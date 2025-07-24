import { Workflow, WorkflowNode, WorkflowConnection, WorkflowExecution, WorkflowLog, WebhookListener } from '../types/automation';
import { twilioService } from './twilioService';
import { sendEmail } from './emailService';

interface ExecutionContext {
  variables: Record<string, any>;
  candidateData?: any;
  jobData?: any;
}

class WorkflowExecutionService {
  private webhookListeners: Map<string, WebhookListener> = new Map();

  async executeWorkflow(
    workflow: Workflow, 
    context: ExecutionContext = { variables: {} }
  ): Promise<WorkflowExecution> {
    const execution: WorkflowExecution = {
      id: `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      workflowId: workflow.id,
      status: 'Running',
      startTime: new Date().toISOString(),
      triggeredBy: 'Manual',
      logs: []
    };

    try {
      this.addLog(execution, 'info', `🚀 Starting workflow: ${workflow.name}`);
      
      // Log candidate information if available
      if (context.candidateData) {
        this.addLog(execution, 'info', `👤 Target: ${context.candidateData.firstName} ${context.candidateData.lastName} (${context.candidateData.phone})`);
      }
      
      // Find start node
      const startNode = workflow.nodes.find(n => n.type === 'start');
      if (!startNode) {
        throw new Error('No start node found in workflow');
      }

      // Execute workflow from start node
      await this.executeFromNode(startNode, workflow, context, execution);
      
      // Check if workflow is waiting for webhook
      if (execution.status !== 'Waiting') {
        execution.status = 'Success';
        execution.endTime = new Date().toISOString();
        execution.duration = Math.floor(
          (new Date(execution.endTime).getTime() - new Date(execution.startTime).getTime()) / 1000
        );
        
        this.addLog(execution, 'info', '✅ Workflow completed successfully');
      }
      
    } catch (error) {
      execution.status = 'Failed';
      execution.endTime = new Date().toISOString();
      execution.duration = Math.floor(
        (new Date(execution.endTime).getTime() - new Date(execution.startTime).getTime()) / 1000
      );
      
      this.addLog(execution, 'error', `❌ Workflow failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Save execution to localStorage (in production, this would be an API call)
    this.saveExecution(execution);
    
    return execution;
  }

  async continueWorkflowFromWebhook(
    executionId: string,
    webhookData: any
  ): Promise<WorkflowExecution | null> {
    // Load execution from storage
    const executions = this.getExecutions();
    const execution = executions.find(e => e.id === executionId);
    
    if (!execution || execution.status !== 'Waiting') {
      return null;
    }

    // Update execution with webhook data
    execution.status = 'Running';
    execution.logs.push({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      level: 'info',
      message: `📥 Webhook received: ${JSON.stringify(webhookData)}`,
      nodeId: execution.waitingForWebhook?.nodeId
    });

    // Add webhook data to context variables
    const context: ExecutionContext = {
      variables: {
        ...execution.logs.find(l => l.message.includes('variables'))?.message || {},
        webhookData,
        ...webhookData // Flatten webhook data into variables
      }
    };

    try {
      // Find the workflow and continue from the webhook listener node
      const savedWorkflows = JSON.parse(localStorage.getItem('workflows') || '[]');
      const workflow = savedWorkflows.find((w: Workflow) => w.id === execution.workflowId);
      
      if (!workflow) {
        throw new Error('Workflow not found');
      }

      const webhookNode = workflow.nodes.find((n: WorkflowNode) => n.id === execution.waitingForWebhook?.nodeId);
      if (!webhookNode) {
        throw new Error('Webhook listener node not found');
      }

      // Continue execution from the next nodes
      const connections = workflow.connections.filter((c: WorkflowConnection) => c.from === webhookNode.id);
      
      for (const connection of connections) {
        const nextNode = workflow.nodes.find((n: WorkflowNode) => n.id === connection.to);
        if (nextNode) {
          if (nextNode.type === 'end') {
            this.addLog(execution, 'info', '🏁 Reached end node');
            break;
          }
          
          // Execute next node
          await this.executeFromNode(nextNode, workflow, context, execution);
        }
      }

      // Mark as completed if not waiting for another webhook
      if (execution.status !== 'Waiting') {
        execution.status = 'Success';
        execution.endTime = new Date().toISOString();
        execution.duration = Math.floor(
          (new Date(execution.endTime).getTime() - new Date(execution.startTime).getTime()) / 1000
        );
        
        this.addLog(execution, 'info', '✅ Workflow completed successfully after webhook');
      }

    } catch (error) {
      execution.status = 'Failed';
      execution.endTime = new Date().toISOString();
      execution.duration = Math.floor(
        (new Date(execution.endTime).getTime() - new Date(execution.startTime).getTime()) / 1000
      );
      
      this.addLog(execution, 'error', `❌ Workflow failed after webhook: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Update execution in storage
    this.saveExecution(execution);
    
    // Remove webhook listener
    if (execution.waitingForWebhook) {
      this.webhookListeners.delete(execution.waitingForWebhook.webhookUrl);
      delete execution.waitingForWebhook;
    }

    return execution;
  }

  private async executeFromNode(
    node: WorkflowNode,
    workflow: Workflow,
    context: ExecutionContext,
    execution: WorkflowExecution
  ): Promise<void> {
    this.addLog(execution, 'info', `🔄 Executing node: ${node.data.label}`, node.id);

    try {
      // Execute the node based on its type
      await this.executeNode(node, context, execution);
      
      // If this was a webhook listener and we're now waiting, stop execution here
      if (execution.status === 'Waiting') {
        return;
      }
      
      // Find next nodes to execute
      const connections = workflow.connections.filter(c => c.from === node.id);
      
      for (const connection of connections) {
        const nextNode = workflow.nodes.find(n => n.id === connection.to);
        if (nextNode) {
          if (nextNode.type === 'end') {
            this.addLog(execution, 'info', '🏁 Reached end node');
            return;
          }
          
          // Execute next node
          await this.executeFromNode(nextNode, workflow, context, execution);
        }
      }
      
    } catch (error) {
      this.addLog(execution, 'error', `❌ Node execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`, node.id);
      throw error;
    }
  }

  private async executeNode(
    node: WorkflowNode,
    context: ExecutionContext,
    execution: WorkflowExecution
  ): Promise<void> {
    switch (node.type) {
      case 'start':
      case 'end':
        // No action needed for start/end nodes
        break;
        
      case 'sms':
        await this.executeSMSNode(node, context, execution);
        break;
        
      case 'call':
        await this.executeCallNode(node, context, execution);
        break;
        
      case 'email':
        await this.executeEmailNode(node, context, execution);
        break;
        
      case 'api':
        await this.executeAPINode(node, context, execution);
        break;
        
      case 'delay':
        await this.executeDelayNode(node, context, execution);
        break;
        
      case 'condition':
        await this.executeConditionNode(node, context, execution);
        break;
        
      case 'webhook':
        await this.executeWebhookNode(node, context, execution);
        break;
        
      case 'webhook_listener':
        await this.executeWebhookListenerNode(node, context, execution);
        break;
        
      case 'database':
        await this.executeDatabaseNode(node, context, execution);
        break;
        
      default:
        this.addLog(execution, 'warning', `⚠️ Unknown node type: ${node.type}`, node.id);
    }
  }

  private async executeSMSNode(
    node: WorkflowNode,
    context: ExecutionContext,
    execution: WorkflowExecution
  ): Promise<void> {
    const { recipient, message } = node.data;
    
    if (!recipient || !message) {
      throw new Error('SMS node missing recipient or message');
    }

    // Replace variables in message
    const processedMessage = this.replaceVariables(message, context);
    const processedRecipient = this.replaceVariables(recipient, context);
    
    this.addLog(execution, 'info', `📱 Sending SMS to ${processedRecipient}`, node.id);
    this.addLog(execution, 'info', `📝 Message: "${processedMessage}"`, node.id);
    
    const result = await twilioService.sendSMS({
      to: processedRecipient,
      message: processedMessage
    });
    
    if (result.success) {
      this.addLog(execution, 'info', `✅ SMS sent successfully. Message ID: ${result.messageId}`, node.id);
      context.variables.lastSMSId = result.messageId;
    } else {
      throw new Error(`Failed to send SMS: ${result.error}`);
    }
  }

  private async executeCallNode(
    node: WorkflowNode,
    context: ExecutionContext,
    execution: WorkflowExecution
  ): Promise<void> {
    const { phoneNumber, script } = node.data;
    
    if (!phoneNumber) {
      throw new Error('Call node missing phone number');
    }

    const processedPhoneNumber = this.replaceVariables(phoneNumber, context);
    const processedScript = script ? this.replaceVariables(script, context) : undefined;
    
    this.addLog(execution, 'info', `📞 Making call to ${processedPhoneNumber}`, node.id);
    
    const result = await twilioService.makeCall({
      to: processedPhoneNumber,
      script: processedScript
    });
    
    if (result.success) {
      this.addLog(execution, 'info', `✅ Call initiated successfully. Call ID: ${result.callId}`, node.id);
      context.variables.lastCallId = result.callId;
    } else {
      throw new Error(`Failed to make call: ${result.error}`);
    }
  }

  private async executeEmailNode(
    node: WorkflowNode,
    context: ExecutionContext,
    execution: WorkflowExecution
  ): Promise<void> {
    const { to, subject, body } = node.data;
    
    if (!to || !subject || !body) {
      throw new Error('Email node missing required fields');
    }

    const processedTo = this.replaceVariables(to, context);
    const processedSubject = this.replaceVariables(subject, context);
    const processedBody = this.replaceVariables(body, context);
    
    this.addLog(execution, 'info', `📧 Sending email to ${processedTo}`, node.id);
    
    try {
      await sendEmail({
        to: processedTo,
        subject: processedSubject,
        body: processedBody
      });
      
      this.addLog(execution, 'info', '✅ Email sent successfully', node.id);
    } catch (error) {
      throw new Error(`Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async executeAPINode(
    node: WorkflowNode,
    context: ExecutionContext,
    execution: WorkflowExecution
  ): Promise<void> {
    const { url, method, headers, body } = node.data;
    
    if (!url) {
      throw new Error('API node missing URL');
    }

    const processedUrl = this.replaceVariables(url, context);
    
    this.addLog(execution, 'info', `🌐 Making ${method} request to ${processedUrl}`, node.id);
    
    try {
      const response = await fetch(processedUrl, {
        method: method || 'GET',
        headers: headers || {},
        body: body ? this.replaceVariables(body, context) : undefined
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const responseData = await response.json();
      context.variables.lastAPIResponse = responseData;
      
      this.addLog(execution, 'info', `✅ API request completed successfully`, node.id);
    } catch (error) {
      throw new Error(`API request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async executeDelayNode(
    node: WorkflowNode,
    context: ExecutionContext,
    execution: WorkflowExecution
  ): Promise<void> {
    const { duration, unit } = node.data;
    
    let delayMs = 0;
    switch (unit) {
      case 'seconds':
        delayMs = duration * 1000;
        break;
      case 'minutes':
        delayMs = duration * 60 * 1000;
        break;
      case 'hours':
        delayMs = duration * 60 * 60 * 1000;
        break;
      case 'days':
        delayMs = duration * 24 * 60 * 60 * 1000;
        break;
      default:
        delayMs = duration * 60 * 1000; // Default to minutes
    }
    
    this.addLog(execution, 'info', `⏱️ Waiting for ${duration} ${unit}`, node.id);
    
    // For demo purposes, we'll use a shorter delay
    const actualDelay = Math.min(delayMs, 2000); // Max 2 seconds for demo
    await new Promise(resolve => setTimeout(resolve, actualDelay));
    
    this.addLog(execution, 'info', '✅ Delay completed', node.id);
  }

  private async executeConditionNode(
    node: WorkflowNode,
    context: ExecutionContext,
    execution: WorkflowExecution
  ): Promise<void> {
    const { field, operator, value } = node.data;
    
    this.addLog(execution, 'info', `🔍 Evaluating condition: ${field} ${operator} ${value}`, node.id);
    
    // Simple condition evaluation (in production, this would be more sophisticated)
    const fieldValue = context.variables[field];
    let conditionMet = false;
    
    switch (operator) {
      case 'equals':
        conditionMet = fieldValue === value;
        break;
      case 'not_equals':
        conditionMet = fieldValue !== value;
        break;
      case 'greater_than':
        conditionMet = Number(fieldValue) > Number(value);
        break;
      case 'less_than':
        conditionMet = Number(fieldValue) < Number(value);
        break;
      default:
        conditionMet = false;
    }
    
    context.variables.lastConditionResult = conditionMet;
    this.addLog(execution, 'info', `✅ Condition result: ${conditionMet}`, node.id);
  }

  private async executeWebhookNode(
    node: WorkflowNode,
    context: ExecutionContext,
    execution: WorkflowExecution
  ): Promise<void> {
    const { url, method } = node.data;
    
    if (!url) {
      throw new Error('Webhook node missing URL');
    }

    const processedUrl = this.replaceVariables(url, context);
    
    this.addLog(execution, 'info', `🔗 Sending webhook to ${processedUrl}`, node.id);
    
    try {
      const response = await fetch(processedUrl, {
        method: method || 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          workflowId: execution.workflowId,
          executionId: execution.id,
          timestamp: new Date().toISOString(),
          data: context.variables,
          candidate: context.candidateData
        })
      });
      
      this.addLog(execution, 'info', `✅ Webhook sent successfully (${response.status})`, node.id);
    } catch (error) {
      throw new Error(`Webhook failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async executeWebhookListenerNode(
    node: WorkflowNode,
    context: ExecutionContext,
    execution: WorkflowExecution
  ): Promise<void> {
    const { timeout, responseMessage } = node.data;
    
    // Generate unique webhook URL
    const webhookUrl = `${window.location.origin}/api/webhook/${execution.id}/${node.id}`;
    
    this.addLog(execution, 'info', `🎣 Setting up webhook listener`, node.id);
    this.addLog(execution, 'info', `📍 Webhook URL: ${webhookUrl}`, node.id);
    this.addLog(execution, 'info', `⏰ Timeout: ${timeout || 3600} seconds`, node.id);
    
    // Create webhook listener
    const listener: WebhookListener = {
      id: `${execution.id}-${node.id}`,
      workflowId: execution.workflowId,
      nodeId: node.id,
      executionId: execution.id,
      webhookUrl,
      isActive: true,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + (timeout || 3600) * 1000).toISOString()
    };
    
    // Store webhook listener
    this.webhookListeners.set(webhookUrl, listener);
    
    // Update execution to waiting state
    execution.status = 'Waiting';
    execution.waitingForWebhook = {
      nodeId: node.id,
      webhookUrl,
      expectedPayload: node.data.expectedFields
    };
    
    this.addLog(execution, 'info', `⏳ Workflow paused, waiting for webhook call...`, node.id);
    
    // In a real implementation, you would set up an actual webhook endpoint
    // For demo purposes, we'll just mark the execution as waiting
    this.addLog(execution, 'info', `💡 Send a POST request to: ${webhookUrl}`, node.id);
    this.addLog(execution, 'info', `💡 Include JSON data in the request body to continue the workflow`, node.id);
  }

  private async executeDatabaseNode(
    node: WorkflowNode,
    context: ExecutionContext,
    execution: WorkflowExecution
  ): Promise<void> {
    // Placeholder for database operations
    this.addLog(execution, 'info', '💾 Database operation executed (placeholder)', node.id);
  }

  private replaceVariables(text: string, context: ExecutionContext): string {
    let result = text;
    
    // Replace variables in format {{variableName}}
    const variableRegex = /\{\{(\w+)\}\}/g;
    result = result.replace(variableRegex, (match, variableName) => {
      return context.variables[variableName] || match;
    });
    
    // Replace candidate data in format {{candidate.fieldName}}
    if (context.candidateData) {
      const candidateRegex = /\{\{candidate\.(\w+)\}\}/g;
      result = result.replace(candidateRegex, (match, fieldName) => {
        return context.candidateData[fieldName] || match;
      });
    }
    
    // Replace job data in format {{job.fieldName}}
    if (context.jobData) {
      const jobRegex = /\{\{job\.(\w+)\}\}/g;
      result = result.replace(jobRegex, (match, fieldName) => {
        return context.jobData[fieldName] || match;
      });
    }
    
    return result;
  }

  private addLog(
    execution: WorkflowExecution,
    level: 'info' | 'warning' | 'error',
    message: string,
    nodeId?: string
  ): void {
    const log: WorkflowLog = {
      id: `log-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toISOString(),
      level,
      message,
      nodeId
    };
    
    execution.logs.push(log);
  }

  private saveExecution(execution: WorkflowExecution): void {
    const savedExecutions = JSON.parse(localStorage.getItem('workflowExecutions') || '[]');
    
    // Update existing execution or add new one
    const existingIndex = savedExecutions.findIndex((e: WorkflowExecution) => e.id === execution.id);
    if (existingIndex >= 0) {
      savedExecutions[existingIndex] = execution;
    } else {
      savedExecutions.unshift(execution); // Add to beginning
    }
    
    // Keep only last 100 executions
    if (savedExecutions.length > 100) {
      savedExecutions.splice(100);
    }
    
    localStorage.setItem('workflowExecutions', JSON.stringify(savedExecutions));
  }

  getExecutions(): WorkflowExecution[] {
    return JSON.parse(localStorage.getItem('workflowExecutions') || '[]');
  }

  getWebhookListeners(): WebhookListener[] {
    return Array.from(this.webhookListeners.values());
  }

  // Method to simulate receiving a webhook (for testing)
  async simulateWebhookReceived(webhookUrl: string, data: any): Promise<boolean> {
    const listener = this.webhookListeners.get(webhookUrl);
    if (!listener || !listener.isActive) {
      return false;
    }

    const execution = await this.continueWorkflowFromWebhook(listener.executionId, data);
    return execution !== null;
  }
}

export const workflowExecutionService = new WorkflowExecutionService();
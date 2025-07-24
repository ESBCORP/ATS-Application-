import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Save, 
  Play, 
  X, 
  MessageSquare, 
  Phone, 
  Globe, 
  Mail, 
  Clock, 
  GitBranch,
  CheckCircle,
  XCircle,
  Zap,
  Database,
  Webhook
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import WorkflowCanvas from './WorkflowCanvas';
import ActivityPanel from './ActivityPanel';
import { WorkflowNode, WorkflowConnection } from '../../types/automation';
import { workflowExecutionService } from '../../services/workflowExecutionService';
import { twilioService } from '../../services/twilioService';
import { createWorkflow, updateWorkflow, fetchWorkflowById } from '../../services/workflowService';

interface WorkflowBuilderProps {
  onClose: () => void;
  workflowId?: string;
}

const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({ onClose, workflowId }) => {
  const [workflowName, setWorkflowName] = useState('New Workflow');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [nodes, setNodes] = useState<WorkflowNode[]>([
    {
      id: 'start',
      type: 'start',
      position: { x: 100, y: 100 },
      data: { label: 'Start' }
    },
    {
      id: 'end',
      type: 'end',
      position: { x: 600, y: 100 },
      data: { label: 'End' }
    }
  ]);
  const [connections, setConnections] = useState<WorkflowConnection[]>([]);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = !!workflowId;

  // Load existing workflow if editing
  useEffect(() => {
    const loadWorkflow = async () => {
      if (!workflowId) return;
      
      try {
        setLoading(true);
        setError(null);
        const workflow = await fetchWorkflowById(workflowId);
        
        setWorkflowName(workflow.name);
        setWorkflowDescription(workflow.description);
        setNodes(workflow.nodes);
        setConnections(workflow.connections);
      } catch (err) {
        setError('Failed to load workflow. Please try again.');
        console.error('Error loading workflow:', err);
      } finally {
        setLoading(false);
      }
    };

    loadWorkflow();
  }, [workflowId]);

  // Check Twilio configuration on component mount
  React.useEffect(() => {
    const config = twilioService.getConfiguration();
    console.log('🔧 Twilio Configuration:', config);
    
    if (!config.isConfigured) {
      console.warn('⚠️ Twilio is not properly configured. SMS functionality will be limited.');
    }
  }, []);

  const handleSaveWorkflow = async () => {
    try {
      setSaving(true);
      setError(null);

      const workflowData = {
        name: workflowName,
        description: workflowDescription,
        nodes,
        connections,
        status: 'Draft' as const
      };

      if (isEditMode) {
        await updateWorkflow(workflowId!, workflowData);
      } else {
        await createWorkflow(workflowData);
      }

      onClose();
    } catch (err) {
      setError('Failed to save workflow. Please try again.');
      console.error('Error saving workflow:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleRunWorkflow = async () => {
    setIsRunning(true);
    
    try {
      const workflow = {
        id: workflowId || `workflow-${Date.now()}`,
        name: workflowName,
        description: workflowDescription,
        nodes,
        connections,
        status: 'Active' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'Current User'
      };

      // Check if there are any SMS nodes and validate Twilio config
      const smsNodes = nodes.filter(n => n.type === 'sms');
      if (smsNodes.length > 0) {
        const config = twilioService.getConfiguration();
        if (!config.isConfigured) {
          alert('⚠️ Twilio is not configured. SMS nodes will not work. Please check your .env file.');
        } else {
          console.log('✅ Twilio is configured. SMS nodes will work properly.');
        }
      }

      // Execute the workflow with sample candidate data
      const execution = await workflowExecutionService.executeWorkflow(workflow, {
        variables: {
          candidateName: 'John Doe',
          candidatePhone: '+1234567890', // You can replace this with actual candidate phone
          candidateEmail: 'john.doe@example.com'
        }
      });

      if (execution.status === 'Success') {
        alert('✅ Workflow executed successfully! Check the History tab for details.');
      } else if (execution.status === 'Waiting') {
        alert('⏳ Workflow is waiting for incoming webhook. Check the History tab for details.');
      } else {
        const lastLog = execution.logs[execution.logs.length - 1];
        alert(`❌ Workflow execution failed: ${lastLog?.message || 'Unknown error'}`);
      }
    } catch (error) {
      alert(`❌ Workflow execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleAddNode = (nodeType: string, position: { x: number; y: number }) => {
    const newNode: WorkflowNode = {
      id: `node-${Date.now()}`,
      type: nodeType as any,
      position,
      data: {
        label: getNodeLabel(nodeType),
        ...getDefaultNodeData(nodeType)
      }
    };

    setNodes(prev => [...prev, newNode]);
  };

  const getNodeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      'sms': 'Send SMS',
      'call': 'Make Call',
      'email': 'Send Email',
      'api': 'API Call',
      'delay': 'Delay',
      'condition': 'Condition',
      'webhook': 'Send Webhook',
      'webhook_listener': 'Webhook Listener',
      'database': 'Database'
    };
    return labels[type] || type;
  };

  const getDefaultNodeData = (type: string): any => {
    switch (type) {
      case 'sms':
        return { 
          message: 'Hello {{candidateName}}, this is a message from our recruitment team.', 
          recipient: '{{candidatePhone}}',
          conversationalMode: false,
          autoReplies: [],
          fallbackMessage: 'Thank you for your response. We will get back to you soon.',
          scheduled: false,
          maxRetries: 3,
          retryDelay: 5
        };
      case 'call':
        return { 
          phoneNumber: '{{candidatePhone}}', 
          script: 'Hello {{candidateName}}, we would like to discuss the opportunity with you.' 
        };
      case 'email':
        return { 
          to: '{{candidateEmail}}', 
          subject: 'Regarding your application', 
          body: 'Dear {{candidateName}},\n\nThank you for your interest in our position.\n\nBest regards,\nRecruitment Team' 
        };
      case 'api':
        return { url: 'https://api.example.com/endpoint', method: 'GET', headers: {}, body: '' };
      case 'delay':
        return { duration: 5, unit: 'minutes' };
      case 'condition':
        return { field: 'candidateStatus', operator: 'equals', value: 'active' };
      case 'webhook':
        return { url: 'https://webhook.example.com/notify', method: 'POST' };
      case 'webhook_listener':
        return { 
          description: 'Wait for incoming webhook',
          timeout: 3600, // 1 hour timeout
          expectedFields: [],
          responseMessage: 'Webhook received successfully'
        };
      default:
        return {};
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-100 z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading workflow...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-100 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
          <div>
            <Input
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="text-lg font-semibold border-none p-0 focus:ring-0"
            />
            <Input
              value={workflowDescription}
              onChange={(e) => setWorkflowDescription(e.target.value)}
              placeholder="Add description..."
              className="text-sm text-gray-500 border-none p-0 focus:ring-0"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={handleRunWorkflow}
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            <Play className="h-4 w-4" />
            {isRunning ? 'Running...' : 'Test Run'}
          </Button>
          <Button
            onClick={handleSaveWorkflow}
            disabled={saving}
            isLoading={saving}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isEditMode ? 'Update' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-6 py-3">
          <div className="flex items-center">
            <XCircle className="h-5 w-5 text-red-400 mr-2" />
            <span className="text-sm text-red-800">{error}</span>
          </div>
        </div>
      )}

      {/* Twilio Status Indicator */}
      <div className="bg-blue-50 border-b border-blue-200 px-6 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              Twilio Status: {twilioService.isServiceConfigured() ? '✅ Connected' : '❌ Not Configured'}
            </span>
          </div>
          {!twilioService.isServiceConfigured() && (
            <span className="text-xs text-blue-600">
              Check your .env file for Twilio credentials
            </span>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Activity Panel */}
        <ActivityPanel onAddNode={handleAddNode} />
        
        {/* Canvas */}
        <div className="flex-1 relative">
          <WorkflowCanvas
            nodes={nodes}
            connections={connections}
            onNodesChange={setNodes}
            onConnectionsChange={setConnections}
            onNodeSelect={setSelectedNode}
            onAddNode={handleAddNode}
          />
        </div>

        {/* Properties Panel */}
        {selectedNode && (
          <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Node Properties</h3>
            <div className="space-y-4">
              <Input
                label="Label"
                value={selectedNode.data.label}
                onChange={(e) => {
                  const updatedNode = {
                    ...selectedNode,
                    data: { ...selectedNode.data, label: e.target.value }
                  };
                  setSelectedNode(updatedNode);
                  setNodes(prev => prev.map(n => n.id === selectedNode.id ? updatedNode : n));
                }}
              />
              
              {/* Type-specific properties */}
              {selectedNode.type === 'sms' && (
                <>
                  <Input
                    label="Recipient"
                    value={selectedNode.data.recipient || ''}
                    onChange={(e) => {
                      const updatedNode = {
                        ...selectedNode,
                        data: { ...selectedNode.data, recipient: e.target.value }
                      };
                      setSelectedNode(updatedNode);
                      setNodes(prev => prev.map(n => n.id === selectedNode.id ? updatedNode : n));
                    }}
                    placeholder="Phone number or {{candidatePhone}}"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      rows={4}
                      value={selectedNode.data.message || ''}
                      onChange={(e) => {
                        const updatedNode = {
                          ...selectedNode,
                          data: { ...selectedNode.data, message: e.target.value }
                        };
                        setSelectedNode(updatedNode);
                        setNodes(prev => prev.map(n => n.id === selectedNode.id ? updatedNode : n));
                      }}
                      placeholder="Enter SMS message... Use {{candidateName}} for variables"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Use variables: {"{{candidateName}}, {{candidatePhone}}, {{candidateEmail}}"}
                    </p>
                  </div>

                  {/* Conversational Mode Toggle */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="conversationalMode"
                      checked={selectedNode.data.conversationalMode || false}
                      onChange={(e) => {
                        const updatedNode = {
                          ...selectedNode,
                          data: { ...selectedNode.data, conversationalMode: e.target.checked }
                        };
                        setSelectedNode(updatedNode);
                        setNodes(prev => prev.map(n => n.id === selectedNode.id ? updatedNode : n));
                      }}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="conversationalMode" className="text-sm font-medium text-gray-700">
                      Enable Conversational Mode
                    </label>
                  </div>

                  {selectedNode.data.conversationalMode && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fallback Message</label>
                      <textarea
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        rows={2}
                        value={selectedNode.data.fallbackMessage || ''}
                        onChange={(e) => {
                          const updatedNode = {
                            ...selectedNode,
                            data: { ...selectedNode.data, fallbackMessage: e.target.value }
                          };
                          setSelectedNode(updatedNode);
                          setNodes(prev => prev.map(n => n.id === selectedNode.id ? updatedNode : n));
                        }}
                        placeholder="Default response for unrecognized keywords"
                      />
                    </div>
                  )}
                </>
              )}

              {selectedNode.type === 'call' && (
                <>
                  <Input
                    label="Phone Number"
                    value={selectedNode.data.phoneNumber || ''}
                    onChange={(e) => {
                      const updatedNode = {
                        ...selectedNode,
                        data: { ...selectedNode.data, phoneNumber: e.target.value }
                      };
                      setSelectedNode(updatedNode);
                      setNodes(prev => prev.map(n => n.id === selectedNode.id ? updatedNode : n));
                    }}
                    placeholder="Phone number or {{candidatePhone}}"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Script</label>
                    <textarea
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      rows={4}
                      value={selectedNode.data.script || ''}
                      onChange={(e) => {
                        const updatedNode = {
                          ...selectedNode,
                          data: { ...selectedNode.data, script: e.target.value }
                        };
                        setSelectedNode(updatedNode);
                        setNodes(prev => prev.map(n => n.id === selectedNode.id ? updatedNode : n));
                      }}
                      placeholder="Call script... Use {{candidateName}} for variables"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Use variables: {"{{candidateName}}, {{candidatePhone}}, {{candidateEmail}}"}
                    </p>
                  </div>
                </>
              )}

              {selectedNode.type === 'email' && (
                <>
                  <Input
                    label="To"
                    value={selectedNode.data.to || ''}
                    onChange={(e) => {
                      const updatedNode = {
                        ...selectedNode,
                        data: { ...selectedNode.data, to: e.target.value }
                      };
                      setSelectedNode(updatedNode);
                      setNodes(prev => prev.map(n => n.id === selectedNode.id ? updatedNode : n));
                    }}
                    placeholder="Email address or {{candidateEmail}}"
                  />
                  <Input
                    label="Subject"
                    value={selectedNode.data.subject || ''}
                    onChange={(e) => {
                      const updatedNode = {
                        ...selectedNode,
                        data: { ...selectedNode.data, subject: e.target.value }
                      };
                      setSelectedNode(updatedNode);
                      setNodes(prev => prev.map(n => n.id === selectedNode.id ? updatedNode : n));
                    }}
                    placeholder="Email subject"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
                    <textarea
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      rows={6}
                      value={selectedNode.data.body || ''}
                      onChange={(e) => {
                        const updatedNode = {
                          ...selectedNode,
                          data: { ...selectedNode.data, body: e.target.value }
                        };
                        setSelectedNode(updatedNode);
                        setNodes(prev => prev.map(n => n.id === selectedNode.id ? updatedNode : n));
                      }}
                      placeholder="Email body... Use {{candidateName}} for variables"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Use variables: {"{{candidateName}}, {{candidatePhone}}, {{candidateEmail}}"}
                    </p>
                  </div>
                </>
              )}

              {selectedNode.type === 'api' && (
                <>
                  <Input
                    label="URL"
                    value={selectedNode.data.url || ''}
                    onChange={(e) => {
                      const updatedNode = {
                        ...selectedNode,
                        data: { ...selectedNode.data, url: e.target.value }
                      };
                      setSelectedNode(updatedNode);
                      setNodes(prev => prev.map(n => n.id === selectedNode.id ? updatedNode : n));
                    }}
                    placeholder="API endpoint URL"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Method</label>
                    <select
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={selectedNode.data.method || 'GET'}
                      onChange={(e) => {
                        const updatedNode = {
                          ...selectedNode,
                          data: { ...selectedNode.data, method: e.target.value }
                        };
                        setSelectedNode(updatedNode);
                        setNodes(prev => prev.map(n => n.id === selectedNode.id ? updatedNode : n));
                      }}
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="DELETE">DELETE</option>
                    </select>
                  </div>
                </>
              )}

              {selectedNode.type === 'delay' && (
                <div className="flex space-x-2">
                  <Input
                    label="Duration"
                    type="number"
                    value={selectedNode.data.duration || 5}
                    onChange={(e) => {
                      const updatedNode = {
                        ...selectedNode,
                        data: { ...selectedNode.data, duration: parseInt(e.target.value) }
                      };
                      setSelectedNode(updatedNode);
                      setNodes(prev => prev.map(n => n.id === selectedNode.id ? updatedNode : n));
                    }}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                    <select
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={selectedNode.data.unit || 'minutes'}
                      onChange={(e) => {
                        const updatedNode = {
                          ...selectedNode,
                          data: { ...selectedNode.data, unit: e.target.value }
                        };
                        setSelectedNode(updatedNode);
                        setNodes(prev => prev.map(n => n.id === selectedNode.id ? updatedNode : n));
                      }}
                    >
                      <option value="seconds">Seconds</option>
                      <option value="minutes">Minutes</option>
                      <option value="hours">Hours</option>
                      <option value="days">Days</option>
                    </select>
                  </div>
                </div>
              )}

              {selectedNode.type === 'condition' && (
                <>
                  <Input
                    label="Field"
                    value={selectedNode.data.field || ''}
                    onChange={(e) => {
                      const updatedNode = {
                        ...selectedNode,
                        data: { ...selectedNode.data, field: e.target.value }
                      };
                      setSelectedNode(updatedNode);
                      setNodes(prev => prev.map(n => n.id === selectedNode.id ? updatedNode : n));
                    }}
                    placeholder="Variable name to check"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Operator</label>
                    <select
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={selectedNode.data.operator || 'equals'}
                      onChange={(e) => {
                        const updatedNode = {
                          ...selectedNode,
                          data: { ...selectedNode.data, operator: e.target.value }
                        };
                        setSelectedNode(updatedNode);
                        setNodes(prev => prev.map(n => n.id === selectedNode.id ? updatedNode : n));
                      }}
                    >
                      <option value="equals">Equals</option>
                      <option value="not_equals">Not Equals</option>
                      <option value="greater_than">Greater Than</option>
                      <option value="less_than">Less Than</option>
                    </select>
                  </div>
                  <Input
                    label="Value"
                    value={selectedNode.data.value || ''}
                    onChange={(e) => {
                      const updatedNode = {
                        ...selectedNode,
                        data: { ...selectedNode.data, value: e.target.value }
                      };
                      setSelectedNode(updatedNode);
                      setNodes(prev => prev.map(n => n.id === selectedNode.id ? updatedNode : n));
                    }}
                    placeholder="Value to compare against"
                  />
                </>
              )}

              {selectedNode.type === 'webhook' && (
                <>
                  <Input
                    label="URL"
                    value={selectedNode.data.url || ''}
                    onChange={(e) => {
                      const updatedNode = {
                        ...selectedNode,
                        data: { ...selectedNode.data, url: e.target.value }
                      };
                      setSelectedNode(updatedNode);
                      setNodes(prev => prev.map(n => n.id === selectedNode.id ? updatedNode : n));
                    }}
                    placeholder="Webhook URL"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Method</label>
                    <select
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={selectedNode.data.method || 'POST'}
                      onChange={(e) => {
                        const updatedNode = {
                          ...selectedNode,
                          data: { ...selectedNode.data, method: e.target.value }
                        };
                        setSelectedNode(updatedNode);
                        setNodes(prev => prev.map(n => n.id === selectedNode.id ? updatedNode : n));
                      }}
                    >
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="PATCH">PATCH</option>
                    </select>
                  </div>
                </>
              )}

              {selectedNode.type === 'webhook_listener' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      rows={3}
                      value={selectedNode.data.description || ''}
                      onChange={(e) => {
                        const updatedNode = {
                          ...selectedNode,
                          data: { ...selectedNode.data, description: e.target.value }
                        };
                        setSelectedNode(updatedNode);
                        setNodes(prev => prev.map(n => n.id === selectedNode.id ? updatedNode : n));
                      }}
                      placeholder="Describe what webhook data you're expecting..."
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Input
                      label="Timeout (seconds)"
                      type="number"
                      value={selectedNode.data.timeout || 3600}
                      onChange={(e) => {
                        const updatedNode = {
                          ...selectedNode,
                          data: { ...selectedNode.data, timeout: parseInt(e.target.value) }
                        };
                        setSelectedNode(updatedNode);
                        setNodes(prev => prev.map(n => n.id === selectedNode.id ? updatedNode : n));
                      }}
                      placeholder="3600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expected Fields (comma-separated)</label>
                    <input
                      type="text"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={selectedNode.data.expectedFields?.join(', ') || ''}
                      onChange={(e) => {
                        const fields = e.target.value.split(',').map(f => f.trim()).filter(Boolean);
                        const updatedNode = {
                          ...selectedNode,
                          data: { ...selectedNode.data, expectedFields: fields }
                        };
                        setSelectedNode(updatedNode);
                        setNodes(prev => prev.map(n => n.id === selectedNode.id ? updatedNode : n));
                      }}
                      placeholder="status, message, data"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Fields you expect in the webhook payload
                    </p>
                  </div>

                  <Input
                    label="Response Message"
                    value={selectedNode.data.responseMessage || ''}
                    onChange={(e) => {
                      const updatedNode = {
                        ...selectedNode,
                        data: { ...selectedNode.data, responseMessage: e.target.value }
                      };
                      setSelectedNode(updatedNode);
                      setNodes(prev => prev.map(n => n.id === selectedNode.id ? updatedNode : n));
                    }}
                    placeholder="Message to send back to webhook caller"
                  />

                  <div className="bg-blue-50 p-3 rounded-md">
                    <p className="text-sm text-blue-800 font-medium">Webhook Listener Info</p>
                    <p className="text-xs text-blue-600 mt-1">
                      When this node is reached, the workflow will pause and wait for an incoming webhook. 
                      A unique webhook URL will be generated that external systems can call to continue the workflow.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowBuilder;
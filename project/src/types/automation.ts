export interface WorkflowNode {
  id: string;
  type: 'start' | 'end' | 'sms' | 'call' | 'email' | 'api' | 'delay' | 'condition' | 'webhook' | 'webhook_listener' | 'database';
  position: { x: number; y: number };
  data: {
    label: string;
    [key: string]: any;
  };
}

export interface WorkflowConnection {
  id: string;
  from: string;
  to: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  status: 'Active' | 'Inactive' | 'Draft';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastRun?: string;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'Running' | 'Success' | 'Failed' | 'Cancelled' | 'Waiting';
  startTime: string;
  endTime?: string;
  duration?: number;
  triggeredBy: string;
  logs: WorkflowLog[];
  waitingForWebhook?: {
    nodeId: string;
    webhookUrl: string;
    expectedPayload?: any;
  };
}

export interface WorkflowLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  nodeId?: string;
}

export interface WebhookListener {
  id: string;
  workflowId: string;
  nodeId: string;
  executionId: string;
  webhookUrl: string;
  isActive: boolean;
  createdAt: string;
  expiresAt?: string;
}
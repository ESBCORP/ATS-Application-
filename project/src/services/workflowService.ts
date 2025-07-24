import api from './api';
import { Workflow, WorkflowNode, WorkflowConnection } from '../types/automation';

interface WorkflowsResponse {
  data: Workflow[];
  total: number;
}

export const fetchWorkflows = async (): Promise<WorkflowsResponse> => {
  try {
    const response = await api.get('/workflows/');
    
    return {
      data: response.data.map((workflow: any) => ({
        id: workflow.id.toString(),
        name: workflow.name,
        description: workflow.description || '',
        nodes: JSON.parse(workflow.nodes || '[]'),
        connections: JSON.parse(workflow.connections || '[]'),
        status: workflow.status || 'Draft',
        createdAt: workflow.created_at,
        updatedAt: workflow.updated_at || workflow.created_at,
        createdBy: workflow.created_by,
        lastRun: workflow.last_run
      })),
      total: response.data.length
    };
  } catch (error) {
    console.warn('API not available, falling back to localStorage');
    // Fallback to localStorage if API is not available
    const savedWorkflows = JSON.parse(localStorage.getItem('workflows') || '[]');
    return {
      data: savedWorkflows,
      total: savedWorkflows.length
    };
  }
};

export const fetchWorkflowById = async (id: string): Promise<Workflow> => {
  try {
    const response = await api.get(`/workflows/${id}`);
    
    return {
      id: response.data.id.toString(),
      name: response.data.name,
      description: response.data.description || '',
      nodes: JSON.parse(response.data.nodes || '[]'),
      connections: JSON.parse(response.data.connections || '[]'),
      status: response.data.status || 'Draft',
      createdAt: response.data.created_at,
      updatedAt: response.data.updated_at || response.data.created_at,
      createdBy: response.data.created_by,
      lastRun: response.data.last_run
    };
  } catch (error) {
    console.warn('API not available, falling back to localStorage');
    // Fallback to localStorage
    const savedWorkflows = JSON.parse(localStorage.getItem('workflows') || '[]');
    const workflow = savedWorkflows.find((w: Workflow) => w.id === id);
    if (!workflow) {
      throw new Error('Workflow not found');
    }
    return workflow;
  }
};

export const createWorkflow = async (workflowData: Partial<Workflow>): Promise<Workflow> => {
  try {
    const payload = {
      name: workflowData.name,
      description: workflowData.description || '',
      nodes: JSON.stringify(workflowData.nodes || []),
      connections: JSON.stringify(workflowData.connections || []),
      status: workflowData.status || 'Draft'
    };

    const response = await api.post('/workflows/', payload);
    
    return {
      id: response.data.id.toString(),
      name: response.data.name,
      description: response.data.description || '',
      nodes: JSON.parse(response.data.nodes || '[]'),
      connections: JSON.parse(response.data.connections || '[]'),
      status: response.data.status || 'Draft',
      createdAt: response.data.created_at,
      updatedAt: response.data.updated_at || response.data.created_at,
      createdBy: response.data.created_by,
      lastRun: response.data.last_run
    };
  } catch (error) {
    console.warn('API not available, falling back to localStorage');
    // Fallback to localStorage
    const workflow: Workflow = {
      id: workflowData.id || `workflow-${Date.now()}`,
      name: workflowData.name || 'New Workflow',
      description: workflowData.description || '',
      nodes: workflowData.nodes || [],
      connections: workflowData.connections || [],
      status: workflowData.status || 'Draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'Current User',
      lastRun: workflowData.lastRun
    };

    const savedWorkflows = JSON.parse(localStorage.getItem('workflows') || '[]');
    savedWorkflows.push(workflow);
    localStorage.setItem('workflows', JSON.stringify(savedWorkflows));
    
    return workflow;
  }
};

export const updateWorkflow = async (id: string, workflowData: Partial<Workflow>): Promise<Workflow> => {
  try {
    const payload = {
      name: workflowData.name,
      description: workflowData.description || '',
      nodes: JSON.stringify(workflowData.nodes || []),
      connections: JSON.stringify(workflowData.connections || []),
      status: workflowData.status || 'Draft'
    };

    const response = await api.put(`/workflows/${id}`, payload);
    
    return {
      id: response.data.id.toString(),
      name: response.data.name,
      description: response.data.description || '',
      nodes: JSON.parse(response.data.nodes || '[]'),
      connections: JSON.parse(response.data.connections || '[]'),
      status: response.data.status || 'Draft',
      createdAt: response.data.created_at,
      updatedAt: response.data.updated_at || response.data.created_at,
      createdBy: response.data.created_by,
      lastRun: response.data.last_run
    };
  } catch (error) {
    console.warn('API not available, falling back to localStorage');
    // Fallback to localStorage
    const savedWorkflows = JSON.parse(localStorage.getItem('workflows') || '[]');
    const workflowIndex = savedWorkflows.findIndex((w: Workflow) => w.id === id);
    
    if (workflowIndex === -1) {
      throw new Error('Workflow not found');
    }

    const updatedWorkflow = {
      ...savedWorkflows[workflowIndex],
      ...workflowData,
      updatedAt: new Date().toISOString()
    };

    savedWorkflows[workflowIndex] = updatedWorkflow;
    localStorage.setItem('workflows', JSON.stringify(savedWorkflows));
    
    return updatedWorkflow;
  }
};

export const deleteWorkflow = async (id: string): Promise<void> => {
  try {
    await api.delete(`/workflows/${id}`);
  } catch (error) {
    console.warn('API not available, falling back to localStorage');
    // Fallback to localStorage
    const savedWorkflows = JSON.parse(localStorage.getItem('workflows') || '[]');
    const filteredWorkflows = savedWorkflows.filter((w: Workflow) => w.id !== id);
    localStorage.setItem('workflows', JSON.stringify(filteredWorkflows));
  }
};

export const updateWorkflowLastRun = async (id: string): Promise<void> => {
  try {
    await api.patch(`/workflows/${id}/last-run`, {
      last_run: new Date().toISOString()
    });
  } catch (error) {
    console.warn('API not available, updating localStorage');
    // Fallback to localStorage
    const savedWorkflows = JSON.parse(localStorage.getItem('workflows') || '[]');
    const workflowIndex = savedWorkflows.findIndex((w: Workflow) => w.id === id);
    
    if (workflowIndex !== -1) {
      savedWorkflows[workflowIndex].lastRun = new Date().toISOString();
      localStorage.setItem('workflows', JSON.stringify(savedWorkflows));
    }
  }
};
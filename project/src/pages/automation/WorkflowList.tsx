import React, { useState, useEffect } from 'react';
import { Play, Edit, Trash2, Copy, Calendar, MessageSquare } from 'lucide-react';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Status from '../../components/ui/Status';
import { fetchWorkflows, deleteWorkflow, updateWorkflowLastRun } from '../../services/workflowService';
import { Workflow } from '../../types/automation';
import { useNavigate } from 'react-router-dom';

interface WorkflowListProps {
  onCreateNew: () => void;
  onEdit?: (workflowId: string) => void;
}

const WorkflowList: React.FC<WorkflowListProps> = ({ onCreateNew, onEdit }) => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchWorkflows();
      setWorkflows(response.data);
    } catch (err) {
      setError('Failed to load workflows. Please try again.');
      console.error('Error loading workflows:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunWorkflow = async (workflowId: string) => {
    try {
      // Update last run time
      await updateWorkflowLastRun(workflowId);
      
      // Refresh the list to show updated last run time
      await loadWorkflows();
      
      alert(`Running workflow: ${workflowId}`);
    } catch (err) {
      console.error('Error updating workflow last run:', err);
      alert(`Running workflow: ${workflowId}`);
    }
  };

  const handleEditWorkflow = (workflowId: string) => {
    if (onEdit) {
      onEdit(workflowId);
    }
  };

  const handleDeleteWorkflow = async (workflowId: string) => {
    if (confirm('Are you sure you want to delete this workflow?')) {
      try {
        await deleteWorkflow(workflowId);
        await loadWorkflows(); // Refresh the list
      } catch (err) {
        console.error('Error deleting workflow:', err);
        alert('Failed to delete workflow. Please try again.');
      }
    }
  };

  const handleDuplicateWorkflow = async (workflowId: string) => {
    try {
      const workflow = workflows.find(w => w.id === workflowId);
      if (workflow) {
        // Create a copy with a new ID and name
        const duplicatedWorkflow = {
          ...workflow,
          id: `workflow-${Date.now()}`,
          name: `${workflow.name} (Copy)`,
          status: 'Draft' as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastRun: undefined
        };
        
        // Save to localStorage (this will be replaced with API call)
        const savedWorkflows = JSON.parse(localStorage.getItem('workflows') || '[]');
        savedWorkflows.push(duplicatedWorkflow);
        localStorage.setItem('workflows', JSON.stringify(savedWorkflows));
        
        await loadWorkflows(); // Refresh the list
      }
    } catch (err) {
      console.error('Error duplicating workflow:', err);
      alert('Failed to duplicate workflow. Please try again.');
    }
  };

  const columns = [
    {
      header: 'Name',
      accessor: (workflow: Workflow) => (
        <div>
          <div className="font-medium text-gray-900">{workflow.name}</div>
          <div className="text-sm text-gray-500">{workflow.description}</div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (workflow: Workflow) => <Status status={workflow.status} />,
    },
    {
      header: 'Last Run',
      accessor: (workflow: Workflow) => 
        workflow.lastRun 
          ? new Date(workflow.lastRun).toLocaleString()
          : 'Never',
    },
    {
      header: 'Created',
      accessor: (workflow: Workflow) => new Date(workflow.createdAt).toLocaleDateString(),
    },
    {
      header: 'Actions',
      accessor: (workflow: Workflow) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleRunWorkflow(workflow.id)}
            className="flex items-center gap-1"
          >
            <Play className="h-3 w-3" />
            Run
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEditWorkflow(workflow.id)}
            className="flex items-center gap-1"
          >
            <Edit className="h-3 w-3" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDuplicateWorkflow(workflow.id)}
            className="flex items-center gap-1"
          >
            <Copy className="h-3 w-3" />
            Copy
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDeleteWorkflow(workflow.id)}
            className="flex items-center gap-1 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-3 w-3" />
            Delete
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4 text-red-800">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 dark:text-gray-100 rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Workflows</h2>
           
          </div>
          <div className="flex space-x-2">
            <Button onClick={onCreateNew} className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Create Workflow
            </Button>
            <Button 
              onClick={() => navigate('/automation/message-template-workflow')} 
              className="flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              Message Template Workflow
            </Button>
          </div>
        </div>

        {workflows.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2 dark:text-white">No workflows yet</h3>
            <p className="text-gray-600 mb-4 dark:text-gray-400">Get started by creating your first automated workflow</p>
            <div className="flex justify-center space-x-4">
              <Button onClick={onCreateNew}>Create Your First Workflow</Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/automation/message-template-workflow')}
                className="flex items-center gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                Create from Message Templates
              </Button>
            </div>
          </div>
        ) : (
          <Table
            columns={columns}
            data={workflows}
            keyExtractor={(workflow) => workflow.id}
            emptyMessage="No workflows found"
          />
        )}
      </div>
    </div>
  );
};

export default WorkflowList;
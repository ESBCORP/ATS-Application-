import React, { useState, useEffect } from 'react';
import { Play, Bot, MessageSquare, Phone, Mail, Clock } from 'lucide-react';
import Button from '../ui/Button';
import { Workflow } from '../../types/automation';
import { fetchWorkflows } from '../../services/workflowService';

interface WorkflowSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (workflow: Workflow) => void;
  selectedCandidates: any[];
}

const WorkflowSelectionModal: React.FC<WorkflowSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  selectedCandidates
}) => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadWorkflows();
    }
  }, [isOpen]);

  const loadWorkflows = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchWorkflows();
      const activeWorkflows = response.data.filter((w: Workflow) => w.status === 'Active');
      setWorkflows(activeWorkflows);
    } catch (err) {
      console.error('Error loading workflows:', err);
      setError('Failed to load workflows. Please try again.');
      setWorkflows([]);
    } finally {
      setLoading(false);
    }
  };

  const getWorkflowIcon = (workflow: Workflow) => {
    // Check what types of nodes are in the workflow
    const nodeTypes = workflow.nodes.map(n => n.type);
    
    if (nodeTypes.includes('sms')) return <MessageSquare className="h-5 w-5" />;
    if (nodeTypes.includes('call')) return <Phone className="h-5 w-5" />;
    if (nodeTypes.includes('email')) return <Mail className="h-5 w-5" />;
    return <Bot className="h-5 w-5" />;
  };

  const getWorkflowDescription = (workflow: Workflow) => {
    const nodeTypes = workflow.nodes.filter(n => n.type !== 'start' && n.type !== 'end');
    const actions = nodeTypes.map(n => {
      switch (n.type) {
        case 'sms': return 'SMS';
        case 'call': return 'Call';
        case 'email': return 'Email';
        case 'delay': return 'Delay';
        case 'condition': return 'Condition';
        case 'api': return 'API';
        case 'webhook': return 'Webhook';
        default: return n.type;
      }
    });
    
    return actions.length > 0 ? `Actions: ${actions.join(', ')}` : 'No actions configured';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="relative w-full max-w-4xl rounded-lg bg-white p-6 shadow-xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Select Workflow</h2>
              <p className="text-sm text-gray-500">
                Choose a workflow to run on {selectedCandidates.length} selected candidate{selectedCandidates.length !== 1 ? 's' : ''}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
          </div>

          {/* Selected Candidates Preview */}
          <div className="mb-6 rounded-lg bg-blue-50 p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Selected Candidates:</h3>
            <div className="flex flex-wrap gap-2">
              {selectedCandidates.slice(0, 5).map((candidate) => (
                <span
                  key={candidate.id}
                  className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
                >
                  {candidate.firstName} {candidate.lastName}
                </span>
              ))}
              {selectedCandidates.length > 5 && (
                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                  +{selectedCandidates.length - 5} more
                </span>
              )}
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4 text-red-800">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : workflows.length === 0 ? (
            <div className="text-center py-12">
              <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Workflows</h3>
              <p className="text-gray-600 mb-4">Create and activate workflows in the Automation section first</p>
              <Button onClick={onClose}>Go to Automation</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {workflows.map((workflow) => (
                <div
                  key={workflow.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => onSelect(workflow)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                        {getWorkflowIcon(workflow)}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{workflow.name}</h3>
                        <p className="text-sm text-gray-500">{getWorkflowDescription(workflow)}</p>
                      </div>
                    </div>
                    <Button size="sm" className="flex items-center gap-1">
                      <Play className="h-3 w-3" />
                      Run
                    </Button>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{workflow.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Created: {new Date(workflow.createdAt).toLocaleDateString()}</span>
                    <span>Last run: {workflow.lastRun ? new Date(workflow.lastRun).toLocaleDateString() : 'Never'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkflowSelectionModal;
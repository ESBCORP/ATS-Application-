import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle, Eye, X } from 'lucide-react';
import Button from '../ui/Button';
import { Workflow } from '../../types/automation';
import { WorkflowExecution } from '../../types/automation';
import { workflowExecutionService } from '../../services/workflowExecutionService';

interface WorkflowExecutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  workflow: Workflow;
  candidates: any[];
}

const WorkflowExecutionModal: React.FC<WorkflowExecutionModalProps> = ({
  isOpen,
  onClose,
  workflow,
  candidates
}) => {
  const [executions, setExecutions] = useState<{ [candidateId: string]: WorkflowExecution }>({});
  const [isRunning, setIsRunning] = useState(false);
  const [selectedExecution, setSelectedExecution] = useState<WorkflowExecution | null>(null);

  const executeWorkflowForCandidates = async () => {
    setIsRunning(true);
    const newExecutions: { [candidateId: string]: WorkflowExecution } = {};

    for (const candidate of candidates) {
      try {
        const execution = await workflowExecutionService.executeWorkflow(workflow, {
          variables: {
            candidateName: `${candidate.firstName} ${candidate.lastName}`,
            candidatePhone: candidate.phone,
            candidateEmail: candidate.email,
            candidateId: candidate.id,
            candidateJobTitle: candidate.jobTitle,
            candidateCity: candidate.city,
            candidateState: candidate.state,
            candidateWorkAuth: candidate.workAuthorization
          },
          candidateData: candidate
        });

        newExecutions[candidate.id] = execution;
      } catch (error) {
        // Create a failed execution record
        newExecutions[candidate.id] = {
          id: `exec-${Date.now()}-${candidate.id}`,
          workflowId: workflow.id,
          status: 'Failed',
          startTime: new Date().toISOString(),
          endTime: new Date().toISOString(),
          duration: 0,
          triggeredBy: 'Manual',
          logs: [{
            id: `log-${Date.now()}`,
            timestamp: new Date().toISOString(),
            level: 'error',
            message: `Failed to execute workflow: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }

    setExecutions(newExecutions);
    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'Running':
        return <Clock className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Success':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'Failed':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'Running':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      default:
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
          
          <div className="relative w-full max-w-6xl rounded-lg bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Execute Workflow: {workflow.name}</h2>
                <p className="text-sm text-gray-500">
                  Running on {candidates.length} candidate{candidates.length !== 1 ? 's' : ''}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Workflow Description */}
            <div className="mb-6 rounded-lg bg-gray-50 p-4">
              <h3 className="font-medium text-gray-900 mb-2">Workflow Description</h3>
              <p className="text-sm text-gray-600">{workflow.description}</p>
            </div>

            {/* Execution Controls */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  onClick={executeWorkflowForCandidates}
                  disabled={isRunning || Object.keys(executions).length > 0}
                  isLoading={isRunning}
                  className="flex items-center gap-2"
                >
                  {isRunning ? 'Executing...' : 'Execute Workflow'}
                </Button>
                
                {Object.keys(executions).length > 0 && (
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      {Object.values(executions).filter(e => e.status === 'Success').length} Success
                    </span>
                    <span className="flex items-center text-red-600">
                      <XCircle className="h-4 w-4 mr-1" />
                      {Object.values(executions).filter(e => e.status === 'Failed').length} Failed
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Execution Results */}
            {Object.keys(executions).length > 0 && (
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Execution Results</h3>
                
                <div className="grid grid-cols-1 gap-4">
                  {candidates.map((candidate) => {
                    const execution = executions[candidate.id];
                    if (!execution) return null;

                    return (
                      <div
                        key={candidate.id}
                        className={`rounded-lg border p-4 ${getStatusColor(execution.status)}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(execution.status)}
                            <div>
                              <h4 className="font-medium">
                                {candidate.firstName} {candidate.lastName}
                              </h4>
                              <p className="text-sm opacity-75">
                                {candidate.phone} • {candidate.email}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">
                              {execution.status}
                            </span>
                            {execution.duration && (
                              <span className="text-xs opacity-75">
                                ({execution.duration}s)
                              </span>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedExecution(execution)}
                              className="flex items-center gap-1"
                            >
                              <Eye className="h-3 w-3" />
                              Logs
                            </Button>
                          </div>
                        </div>

                        {/* Quick Log Preview */}
                        {execution.logs.length > 0 && (
                          <div className="mt-3 text-sm">
                            <p className="opacity-75">
                              Latest: {execution.logs[execution.logs.length - 1].message}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* No executions yet */}
            {Object.keys(executions).length === 0 && !isRunning && (
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Click "Execute Workflow" to start running the workflow on selected candidates</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Execution Logs Modal */}
      {selectedExecution && (
        <div className="fixed inset-0 z-60 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setSelectedExecution(null)} />
            
            <div className="relative w-full max-w-4xl rounded-lg bg-white p-6 shadow-xl">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Execution Logs</h2>
                  <p className="text-sm text-gray-500">
                    Execution ID: {selectedExecution.id} | Status: {selectedExecution.status}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setSelectedExecution(null)}>
                  Close
                </Button>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {selectedExecution.logs.map((log, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border-l-4 ${
                      log.level === 'error'
                        ? 'bg-red-50 border-red-400 text-red-800'
                        : log.level === 'warning'
                        ? 'bg-yellow-50 border-yellow-400 text-yellow-800'
                        : 'bg-blue-50 border-blue-400 text-blue-800'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{log.message}</p>
                        {log.nodeId && (
                          <p className="text-xs opacity-75 mt-1">Node: {log.nodeId}</p>
                        )}
                      </div>
                      <span className="text-xs opacity-75">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {selectedExecution.logs.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No logs available for this execution
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WorkflowExecutionModal;
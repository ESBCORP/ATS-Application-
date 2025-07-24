import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, Eye, Webhook } from 'lucide-react';
import Table from '../../components/ui/Table';
import Status from '../../components/ui/Status';
import Button from '../../components/ui/Button';
import { workflowExecutionService } from '../../services/workflowExecutionService';
import { WorkflowExecution } from '../../types/automation';

const WorkflowHistory: React.FC = () => {
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [selectedExecution, setSelectedExecution] = useState<WorkflowExecution | null>(null);
  const [webhookData, setWebhookData] = useState<string>('');

  useEffect(() => {
    // Load executions from the service
    const loadedExecutions = workflowExecutionService.getExecutions();
    setExecutions(loadedExecutions);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'Running':
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'Waiting':
        return <Webhook className="h-4 w-4 text-purple-500" />;
      case 'Cancelled':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '-';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const handleViewLogs = (execution: WorkflowExecution) => {
    setSelectedExecution(execution);
  };

  const handleSimulateWebhook = async () => {
    if (!selectedExecution || !selectedExecution.waitingForWebhook) return;
    
    try {
      const webhookUrl = selectedExecution.waitingForWebhook.webhookUrl;
      const data = JSON.parse(webhookData || '{}');
      
      const success = await workflowExecutionService.simulateWebhookReceived(webhookUrl, data);
      
      if (success) {
        alert('Webhook simulation successful! Workflow continued.');
        // Refresh executions
        const updatedExecutions = workflowExecutionService.getExecutions();
        setExecutions(updatedExecutions);
        
        // Update selected execution
        const updatedExecution = updatedExecutions.find(e => e.id === selectedExecution.id);
        if (updatedExecution) {
          setSelectedExecution(updatedExecution);
        }
      } else {
        alert('Webhook simulation failed. The webhook listener may have expired or been removed.');
      }
    } catch (error) {
      alert(`Error simulating webhook: ${error instanceof Error ? error.message : 'Invalid JSON data'}`);
    }
  };

  const columns = [
    {
      header: 'Workflow',
      accessor: (execution: WorkflowExecution) => (
        <div>
          <div className="font-medium text-gray-900">Workflow {execution.workflowId}</div>
          <div className="text-sm text-gray-500">ID: {execution.id}</div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (execution: WorkflowExecution) => (
        <div className="flex items-center space-x-2">
          {getStatusIcon(execution.status)}
          <Status status={execution.status} />
        </div>
      ),
    },
    {
      header: 'Start Time',
      accessor: (execution: WorkflowExecution) => 
        new Date(execution.startTime).toLocaleString(),
    },
    {
      header: 'Duration',
      accessor: (execution: WorkflowExecution) => formatDuration(execution.duration),
    },
    {
      header: 'Triggered By',
      accessor: 'triggeredBy',
    },
    {
      header: 'Actions',
      accessor: (execution: WorkflowExecution) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleViewLogs(execution)}
          className="flex items-center gap-1"
        >
          <Eye className="h-3 w-3" />
          View Logs
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Workflow Execution History</h2>
          <p className="text-sm text-gray-600">View the execution history of all workflows</p>
        </div>

        <Table
          columns={columns}
          data={executions}
          keyExtractor={(execution) => execution.id}
          emptyMessage="No workflow executions found"
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Successful</p>
              <p className="text-2xl font-bold text-gray-900">
                {executions.filter(e => e.status === 'Success').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <XCircle className="h-8 w-8 text-red-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Failed</p>
              <p className="text-2xl font-bold text-gray-900">
                {executions.filter(e => e.status === 'Failed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Running</p>
              <p className="text-2xl font-bold text-gray-900">
                {executions.filter(e => e.status === 'Running').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <Webhook className="h-8 w-8 text-purple-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Waiting</p>
              <p className="text-2xl font-bold text-gray-900">
                {executions.filter(e => e.status === 'Waiting').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <AlertCircle className="h-8 w-8 text-yellow-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{executions.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Execution Logs Modal */}
      {selectedExecution && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
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

              {/* Webhook Waiting Section */}
              {selectedExecution.status === 'Waiting' && selectedExecution.waitingForWebhook && (
                <div className="mb-6 bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h3 className="text-lg font-medium text-purple-800 mb-2">
                    <Webhook className="inline-block h-5 w-5 mr-2" />
                    Waiting for Webhook
                  </h3>
                  
                  <div className="mb-4">
                    <p className="text-sm text-purple-700">
                      This workflow is paused and waiting for an incoming webhook call to continue.
                    </p>
                    <p className="text-sm font-medium text-purple-800 mt-2">
                      Webhook URL: <code className="bg-white px-2 py-1 rounded">{selectedExecution.waitingForWebhook.webhookUrl}</code>
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-purple-800 mb-2">Simulate Webhook</h4>
                    <div className="flex flex-col space-y-2">
                      <textarea
                        className="w-full rounded-md border border-purple-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                        rows={4}
                        value={webhookData}
                        onChange={(e) => setWebhookData(e.target.value)}
                        placeholder='{"status": "approved", "message": "Request approved", "data": {"id": 123}}'
                      />
                      <Button 
                        onClick={handleSimulateWebhook}
                        className="self-end"
                      >
                        <Webhook className="h-4 w-4 mr-2" />
                        Simulate Webhook
                      </Button>
                    </div>
                  </div>
                </div>
              )}

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
    </div>
  );
};

export default WorkflowHistory;
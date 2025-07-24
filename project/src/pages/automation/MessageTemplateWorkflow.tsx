import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  Save, 
  ArrowRight, 
  Plus, 
  Trash2, 
  Clock, 
  Calendar,
  Check,
  X,
  AlertCircle,
  GitBranch
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import PageHeader from '../../components/layout/PageHeader';

interface MessageTemplate {
  id: number;
  name: string;
  trigger: string;
  message: string;
  responses: {
    option: string;
    action: string;
    nextMessageId: number | null;
  }[];
  active: boolean;
  sentCount: number;
}

interface WorkflowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    messageId?: number;
    message?: string;
    delay?: number;
    condition?: string;
    [key: string]: any;
  };
}

interface WorkflowConnection {
  id: string;
  from: string;
  to: string;
  label?: string;
}

const MessageTemplateWorkflow: React.FC = () => {
  const navigate = useNavigate();
  const [messageTemplates, setMessageTemplates] = useState<MessageTemplate[]>([
    {
      id: 1,
      name: 'Initial Contact',
      trigger: 'Application Received',
      message: 'Hi {{candidateName}}, we are from {{companyName}}.\n\nWe have received your application for {{jobTitle}}.\n\nAre you interested in this position?\n1. Interested\n2. Not Interested\n3. Don\'t send messages',
      responses: [
        { option: '1', action: 'Go to Scheduling', nextMessageId: 2 },
        { option: '2', action: 'Go to Not Interested', nextMessageId: 3 },
        { option: '3', action: 'Go to Opt Out', nextMessageId: 4 }
      ],
      active: true,
      sentCount: 147
    },
    {
      id: 2,
      name: 'Interview Scheduling',
      trigger: 'Candidate Interested',
      message: 'Please choose a time slot for the interview:\n1. {{timeSlot1}}\n2. {{timeSlot2}}\n3. {{timeSlot3}}',
      responses: [
        { option: '1', action: 'Schedule Slot 1', nextMessageId: 5 },
        { option: '2', action: 'Schedule Slot 2', nextMessageId: 6 },
        { option: '3', action: 'Schedule Slot 3', nextMessageId: 7 }
      ],
      active: true,
      sentCount: 89
    },
    {
      id: 3,
      name: 'Not Interested Response',
      trigger: 'Candidate Not Interested',
      message: 'Thank you for your time. We wish you the best in your job search.\n\nIf you change your mind and are interested in future opportunities, please reply "Restart".',
      responses: [
        { option: 'Restart', action: 'Restart Flow', nextMessageId: 1 }
      ],
      active: true,
      sentCount: 23
    },
    {
      id: 4,
      name: 'Opt Out Confirmation',
      trigger: 'Candidate Opts Out',
      message: 'You have been removed from our contact list. Thank you.\n\nIf you change your mind and are interested in future opportunities, please reply "Restart".',
      responses: [
        { option: 'Restart', action: 'Restart Flow', nextMessageId: 1 }
      ],
      active: true,
      sentCount: 12
    },
    {
      id: 5,
      name: 'Slot 1 Confirmation',
      trigger: 'Slot 1 Selected',
      message: 'Great! You are scheduled for Monday, June 24 at 10:00 AM. We will send you a reminder 24 hours before the interview. Reply "Reschedule" if you need to change the time.',
      responses: [
        { option: 'Reschedule', action: 'Go to Scheduling', nextMessageId: 2 },
        { option: 'Confirm', action: 'Confirm Interview', nextMessageId: 8 }
      ],
      active: true,
      sentCount: 32
    },
    {
      id: 6,
      name: 'Slot 2 Confirmation',
      trigger: 'Slot 2 Selected',
      message: 'Great! You are scheduled for Monday, June 24 at 2:00 PM. We will send you a reminder 24 hours before the interview. Reply "Reschedule" if you need to change the time.',
      responses: [
        { option: 'Reschedule', action: 'Go to Scheduling', nextMessageId: 2 },
        { option: 'Confirm', action: 'Confirm Interview', nextMessageId: 8 }
      ],
      active: true,
      sentCount: 28
    },
    {
      id: 7,
      name: 'Slot 3 Confirmation',
      trigger: 'Slot 3 Selected',
      message: 'Great! You are scheduled for Tuesday, June 25 at 11:30 AM. We will send you a reminder 24 hours before the interview. Reply "Reschedule" if you need to change the time.',
      responses: [
        { option: 'Reschedule', action: 'Go to Scheduling', nextMessageId: 2 },
        { option: 'Confirm', action: 'Confirm Interview', nextMessageId: 8 }
      ],
      active: true,
      sentCount: 29
    },
    {
      id: 8,
      name: 'Interview Reminder',
      trigger: 'Interview Reminder',
      message: 'Reminder: Your interview for {{jobTitle}} is scheduled for tomorrow. Please be prepared to discuss your experience and qualifications. Reply "Confirm" to confirm your attendance.',
      responses: [
        { option: 'Confirm', action: 'Confirm Attendance', nextMessageId: 9 },
        { option: 'Reschedule', action: 'Go to Scheduling', nextMessageId: 2 }
      ],
      active: true,
      sentCount: 65
    },
    {
      id: 9,
      name: 'Post-Interview Follow-up',
      trigger: 'Post-Interview',
      message: 'Thank you for attending the interview for {{jobTitle}}. We appreciate your time and interest. We will be in touch with next steps soon.',
      responses: [],
      active: true,
      sentCount: 42
    }
  ]);

  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [connections, setConnections] = useState<WorkflowConnection[]>([]);
  const [workflowName, setWorkflowName] = useState('Message Template Workflow');
  const [workflowDescription, setWorkflowDescription] = useState('Automated workflow based on message templates');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);

  // Generate workflow from message templates
  useEffect(() => {
    if (messageTemplates.length > 0) {
      generateWorkflowFromTemplates();
    }
  }, [messageTemplates]);

  const generateWorkflowFromTemplates = () => {
    setIsGenerating(true);
    
    try {
      const newNodes: WorkflowNode[] = [
        {
          id: 'start',
          type: 'start',
          position: { x: 100, y: 300 },
          data: { label: 'Start' }
        }
      ];
      
      const newConnections: WorkflowConnection[] = [];
      
      // Create a map to track node positions
      const nodePositions: Record<number, { x: number; y: number }> = {};
      const processedTemplates = new Set<number>();
      const templateMap: Record<number, MessageTemplate> = {};
      
      // Create a map for quick template lookup
      messageTemplates.forEach(template => {
        templateMap[template.id] = template;
      });
      
      // Process templates starting from the first one
      const processTemplate = (templateId: number, startX: number, startY: number, level: number = 0) => {
        if (processedTemplates.has(templateId) || level > 10) return; // Prevent infinite loops
        
        const template = templateMap[templateId];
        if (!template) return;
        
        processedTemplates.add(templateId);
        
        // Calculate position with offset based on level
        const x = startX + level * 300;
        const y = startY;
        
        nodePositions[templateId] = { x, y };
        
        // Create message node
        const messageNodeId = `message-${templateId}`;
        newNodes.push({
          id: messageNodeId,
          type: 'sms',
          position: { x, y },
          data: {
            label: template.name,
            messageId: template.id,
            message: template.message,
            recipient: '{{candidatePhone}}'
          }
        });
        
        // If it's the first template, connect from start
        if (level === 0) {
          newConnections.push({
            id: `conn-start-${messageNodeId}`,
            from: 'start',
            to: messageNodeId
          });
        }
        
        // Process responses
        if (template.responses && template.responses.length > 0) {
          template.responses.forEach((response, respIndex) => {
            if (response.nextMessageId) {
              // Add condition node
              const conditionId = `condition-${templateId}-${respIndex}`;
              const conditionX = x + 200;
              const conditionY = y + (respIndex - template.responses.length / 2 + 0.5) * 150;
              
              newNodes.push({
                id: conditionId,
                type: 'condition',
                position: { x: conditionX, y: conditionY },
                data: {
                  label: `If response is "${response.option}"`,
                  field: 'lastResponse',
                  operator: 'equals',
                  value: response.option
                }
              });
              
              // Connect message to condition
              newConnections.push({
                id: `conn-${messageNodeId}-${conditionId}`,
                from: messageNodeId,
                to: conditionId,
                label: response.option
              });
              
              // Add delay node
              const delayId = `delay-${templateId}-${respIndex}`;
              newNodes.push({
                id: delayId,
                type: 'delay',
                position: { x: conditionX + 200, y: conditionY },
                data: {
                  label: 'Wait 1 minute',
                  duration: 1,
                  unit: 'minutes'
                }
              });
              
              // Connect condition to delay
              newConnections.push({
                id: `conn-${conditionId}-${delayId}`,
                from: conditionId,
                to: delayId
              });
              
              // If the next template hasn't been processed yet, process it
              if (!processedTemplates.has(response.nextMessageId)) {
                // Process the next template with a new Y position to avoid overlaps
                const nextY = y + (respIndex - template.responses.length / 2 + 0.5) * 300;
                processTemplate(response.nextMessageId, x + 400, nextY, level + 1);
                
                // Connect delay to next message
                const nextMessageNodeId = `message-${response.nextMessageId}`;
                newConnections.push({
                  id: `conn-${delayId}-${nextMessageNodeId}`,
                  from: delayId,
                  to: nextMessageNodeId
                });
              } else {
                // If already processed, just connect to the existing node
                const nextMessageNodeId = `message-${response.nextMessageId}`;
                newConnections.push({
                  id: `conn-${delayId}-${nextMessageNodeId}`,
                  from: delayId,
                  to: nextMessageNodeId
                });
              }
            }
          });
        } else {
          // If no responses, connect to end node
          const endNodeId = 'end';
          if (!newNodes.some(node => node.id === endNodeId)) {
            newNodes.push({
              id: endNodeId,
              type: 'end',
              position: { x: x + 300, y: 300 },
              data: { label: 'End' }
            });
          }
          
          newConnections.push({
            id: `conn-${messageNodeId}-${endNodeId}`,
            from: messageNodeId,
            to: endNodeId
          });
        }
      };
      
      // Start processing from the first template
      if (messageTemplates.length > 0) {
        processTemplate(messageTemplates[0].id, 300, 300);
      }
      
      // Add end node if not already added
      if (!newNodes.some(node => node.id === 'end')) {
        newNodes.push({
          id: 'end',
          type: 'end',
          position: { x: 1200, y: 300 },
          data: { label: 'End' }
        });
      }
      
      setNodes(newNodes);
      setConnections(newConnections);
    } catch (error) {
      console.error('Error generating workflow:', error);
      setError('Failed to generate workflow from message templates');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveWorkflow = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      // In a real implementation, you would save to an API
      // For now, we'll simulate a successful save
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save to localStorage for demo purposes
      const workflow = {
        id: `workflow-${Date.now()}`,
        name: workflowName,
        description: workflowDescription,
        nodes,
        connections,
        status: 'Active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'Current User'
      };
      
      const savedWorkflows = JSON.parse(localStorage.getItem('workflows') || '[]');
      savedWorkflows.push(workflow);
      localStorage.setItem('workflows', JSON.stringify(savedWorkflows));
      
      setSuccess('Workflow saved successfully!');
      
      // Navigate to workflow list after a short delay
      setTimeout(() => {
        navigate('/automation/workflows');
      }, 1500);
      
    } catch (err) {
      setError('Failed to save workflow. Please try again.');
      console.error('Error saving workflow:', err);
    } finally {
      setSaving(false);
    }
  };

  // Function to get node color based on type
  const getNodeColor = (type: string) => {
    switch (type) {
      case 'start':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'end':
        return 'bg-red-100 border-red-300 text-red-800';
      case 'sms':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'condition':
        return 'bg-purple-100 border-purple-300 text-purple-800';
      case 'delay':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  // Function to get node icon based on type
  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'start':
        return <ArrowRight className="h-5 w-5" />;
      case 'end':
        return <X className="h-5 w-5" />;
      case 'sms':
        return <MessageSquare className="h-5 w-5" />;
      case 'condition':
        return <GitBranch className="h-5 w-5" />;
      case 'delay':
        return <Clock className="h-5 w-5" />;
      default:
        return <Plus className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Message Template Workflow"
        subtitle="Convert your message templates into an automated workflow"
        actions={
          <div className="space-x-2">
            <Button 
              variant="outline" 
              onClick={() => navigate('/automation')}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveWorkflow}
              isLoading={saving}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Workflow
            </Button>
          </div>
        }
      />

      {error && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="rounded-md bg-green-50 p-4 border border-green-200">
          <div className="flex items-center">
            <Check className="h-5 w-5 text-green-400 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-green-800">Success</h3>
              <p className="text-sm text-green-700 mt-1">{success}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Workflow Details</h2>
          <div className="space-y-4">
            <Input
              label="Workflow Name"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                className="w-full min-h-[100px] rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={workflowDescription}
                onChange={(e) => setWorkflowDescription(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Message Templates</h2>
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {messageTemplates.map((template) => (
              <div key={template.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                    <h3 className="font-medium text-gray-900">{template.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      template.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {template.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">Trigger: {template.trigger}</p>
                <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded border whitespace-pre-line">
                  {template.message.length > 100 
                    ? `${template.message.substring(0, 100)}...` 
                    : template.message}
                </p>
                
                {template.responses.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-medium text-gray-700 mb-2">Response Options:</p>
                    <div className="grid grid-cols-1 gap-2">
                      {template.responses.map((response, idx) => (
                        <div key={idx} className="flex items-center text-xs bg-blue-50 text-blue-800 p-2 rounded">
                          <span className="font-medium mr-2">{response.option}:</span> 
                          <span>{response.action}</span>
                          {response.nextMessageId && (
                            <ArrowRight className="h-3 w-3 mx-2" />
                          )}
                          {response.nextMessageId && (
                            <span className="bg-blue-100 px-2 py-0.5 rounded">
                              {messageTemplates.find(t => t.id === response.nextMessageId)?.name || `Template ${response.nextMessageId}`}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Workflow Preview</h2>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-auto" style={{ minHeight: '600px' }}>
          {isGenerating ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="ml-3 text-gray-600">Generating workflow...</p>
            </div>
          ) : nodes.length > 0 ? (
            <div className="relative" style={{ width: '1500px', height: '1000px' }}>
              {/* Render connections */}
              <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon points="0 0, 10 3.5, 0 7" fill="#4b5563" />
                  </marker>
                </defs>
                
                {connections.map((connection) => {
                  const fromNode = nodes.find(n => n.id === connection.from);
                  const toNode = nodes.find(n => n.id === connection.to);
                  
                  if (!fromNode || !toNode) return null;
                  
                  // Calculate connection points
                  const fromX = fromNode.position.x + 100; // Center of from node
                  const fromY = fromNode.position.y + 30; // Center of from node
                  const toX = toNode.position.x; // Left side of to node
                  const toY = toNode.position.y + 30; // Center of to node
                  
                  // Calculate control points for curve
                  const midX = (fromX + toX) / 2;
                  
                  return (
                    <g key={connection.id}>
                      <path
                        d={`M ${fromX} ${fromY} C ${midX} ${fromY}, ${midX} ${toY}, ${toX} ${toY}`}
                        stroke="#4b5563"
                        strokeWidth="2"
                        fill="none"
                        markerEnd="url(#arrowhead)"
                      />
                      
                      {/* Connection label */}
                      {connection.label && (
                        <foreignObject
                          x={midX - 15}
                          y={(fromY + toY) / 2 - 15}
                          width="30"
                          height="30"
                        >
                          <div className="flex items-center justify-center w-full h-full">
                            <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                              {connection.label}
                            </span>
                          </div>
                        </foreignObject>
                      )}
                    </g>
                  );
                })}
              </svg>
              
              {/* Render nodes */}
              {nodes.map((node) => (
                <div
                  key={node.id}
                  className={`absolute border-2 rounded-lg p-3 w-[200px] ${getNodeColor(node.type)}`}
                  style={{
                    left: `${node.position.x}px`,
                    top: `${node.position.y}px`,
                    zIndex: 2
                  }}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    {getNodeIcon(node.type)}
                    <span className="font-medium text-sm">{node.data.label}</span>
                  </div>
                  
                  {node.type === 'sms' && (
                    <div className="text-xs mt-2 bg-white bg-opacity-50 p-1 rounded">
                      {node.data.message && node.data.message.length > 50
                        ? `${node.data.message.substring(0, 50)}...`
                        : node.data.message}
                    </div>
                  )}
                  
                  {node.type === 'condition' && (
                    <div className="text-xs mt-2 bg-white bg-opacity-50 p-1 rounded">
                      {`${node.data.field} ${node.data.operator} "${node.data.value}"`}
                    </div>
                  )}
                  
                  {node.type === 'delay' && (
                    <div className="text-xs mt-2 bg-white bg-opacity-50 p-1 rounded">
                      {`Wait ${node.data.duration} ${node.data.unit}`}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">No workflow nodes created yet</p>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Workflow Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="active-workflow"
              checked={true}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="active-workflow" className="text-sm font-medium text-gray-700">
              Activate workflow immediately
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="webhook-trigger"
              checked={true}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="webhook-trigger" className="text-sm font-medium text-gray-700">
              Enable webhook trigger
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="event-trigger"
              checked={true}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="event-trigger" className="text-sm font-medium text-gray-700">
              Trigger on candidate creation
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageTemplateWorkflow;
import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Save, Eye, Copy, Settings, MessageSquare, Clock, Users, BarChart3, ArrowRight } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/ui/Button';

const MessagesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('messages');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [showWorkflow, setShowWorkflow] = useState(false);

  const [botSettings, setBotSettings] = useState({
    companyName: 'ESB Technologies',
    defaultPosition: 'Java Developer',
    phoneNumber: '(909) 662-1745',
    businessHours: '9:00 AM - 6:00 PM EST',
    autoReply: true
  });

  const [messageTemplates, setMessageTemplates] = useState([
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

  const [timeSlots, setTimeSlots] = useState([
    { id: 1, slot: 'Monday, June 24 at 10:00 AM', available: true },
    { id: 2, slot: 'Monday, June 24 at 2:00 PM', available: true },
    { id: 3, slot: 'Tuesday, June 25 at 11:30 AM', available: true }
  ]);

  const [variables, setVariables] = useState([
    { name: 'candidateName', description: 'Candidate\'s first name', example: 'John' },
    { name: 'companyName', description: 'Your company name', example: 'ESB Technologies' },
    { name: 'jobTitle', description: 'Position title', example: 'Java Developer' },
    { name: 'timeSlot1', description: 'First available time slot', example: 'Monday, June 24 at 10:00 AM' },
    { name: 'timeSlot2', description: 'Second available time slot', example: 'Monday, June 24 at 2:00 PM' },
    { name: 'timeSlot3', description: 'Third available time slot', example: 'Tuesday, June 25 at 11:30 AM' }
  ]);

  const handleSaveMessage = (messageData) => {
    if (editingMessage) {
      setMessageTemplates(prev => prev.map(msg => 
        msg.id === editingMessage.id ? { ...msg, ...messageData } : msg
      ));
    } else {
      const newMessage = {
        id: Date.now(),
        ...messageData,
        sentCount: 0
      };
      setMessageTemplates(prev => [...prev, newMessage]);
    }
    setEditingMessage(null);
  };

  const MessageEditor = ({ message, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
      name: message?.name || '',
      trigger: message?.trigger || '',
      message: message?.message || '',
      responses: message?.responses || [{ option: '', action: '', nextMessageId: null }],
      active: message?.active !== false
    });

    const addResponse = () => {
      setFormData(prev => ({
        ...prev,
        responses: [...prev.responses, { option: '', action: '', nextMessageId: null }]
      }));
    };

    return (
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h3 className="mb-4 text-lg font-semibold">
          {message?.id ? 'Edit Message Template' : 'Create New Message Template'}
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Template Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Initial Contact"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Trigger Event</label>
            <select
              value={formData.trigger}
              onChange={(e) => setFormData(prev => ({ ...prev, trigger: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select trigger...</option>
              <option value="Application Received">Application Received</option>
              <option value="Candidate Interested">Candidate Interested</option>
              <option value="Candidate Not Interested">Candidate Not Interested</option>
              <option value="Interview Scheduled">Interview Scheduled</option>
              <option value="Follow Up Required">Follow Up Required</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Message Content</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              rows={6}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your message here. Use {{variableName}} for dynamic content."
            />
            <div className="mt-1 text-xs text-gray-500">
              Available variables: candidateName, companyName, jobTitle, timeSlot1, timeSlot2, timeSlot3
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Response Options</label>
              <button
                onClick={addResponse}
                className="flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Response
              </button>
            </div>
            {formData.responses.map((response, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={response.option}
                  onChange={(e) => {
                    const newResponses = [...formData.responses];
                    newResponses[index].option = e.target.value;
                    setFormData(prev => ({ ...prev, responses: newResponses }));
                  }}
                  className="flex-1 p-2 border border-gray-300 rounded-md"
                  placeholder="Response option (e.g., '1' or 'Yes')"
                />
                <input
                  type="text"
                  value={response.action}
                  onChange={(e) => {
                    const newResponses = [...formData.responses];
                    newResponses[index].action = e.target.value;
                    setFormData(prev => ({ ...prev, responses: newResponses }));
                  }}
                  className="flex-1 p-2 border border-gray-300 rounded-md"
                  placeholder="Action description"
                />
                <select
                  value={response.nextMessageId || ""}
                  onChange={(e) => {
                    const newResponses = [...formData.responses];
                    newResponses[index].nextMessageId = e.target.value ? parseInt(e.target.value) : null;
                    setFormData(prev => ({ ...prev, responses: newResponses }));
                  }}
                  className="flex-1 p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select next message...</option>
                  {messageTemplates.map(template => (
                    <option key={template.id} value={template.id}>{template.name}</option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    const newResponses = formData.responses.filter((_, i) => i !== index);
                    setFormData(prev => ({ ...prev, responses: newResponses }));
                  }}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
              className="w-4 h-4 mr-2 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="active" className="text-sm text-gray-700">Active (messages will be sent)</label>
          </div>
        </div>

        <div className="flex justify-end mt-6 space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(formData)}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Save Template
          </button>
        </div>
      </div>
    );
  };

  // Workflow visualization component
  const MessageTemplateWorkflow = () => {
    // Calculate positions for each node
    const getNodePositions = () => {
      const positions = {};
      const nodeWidth = 280;
      const nodeHeight = 120;
      const horizontalGap = 100;
      const verticalGap = 80;
      
      // Create a map of message IDs to their positions in the flow
      const visited = new Set();
      const queue = [1]; // Start with the first message
      const levels = { 1: 0 }; // Message ID to level (depth)
      const nodesAtLevel = {}; // Level to count of nodes
      
      // BFS to determine levels
      while (queue.length > 0) {
        const currentId = queue.shift();
        if (visited.has(currentId)) continue;
        visited.add(currentId);
        
        const currentMessage = messageTemplates.find(m => m.id === currentId);
        if (!currentMessage) continue;
        
        const currentLevel = levels[currentId];
        nodesAtLevel[currentLevel] = (nodesAtLevel[currentLevel] || 0) + 1;
        
        // Process next messages
        if (currentMessage.responses) {
          for (const response of currentMessage.responses) {
            if (response.nextMessageId && !visited.has(response.nextMessageId)) {
              queue.push(response.nextMessageId);
              levels[response.nextMessageId] = currentLevel + 1;
            }
          }
        }
      }
      
      // Calculate positions based on levels
      const levelCounts = {}; // Current count of nodes placed at each level
      
      messageTemplates.forEach(message => {
        const level = levels[message.id] || 0;
        levelCounts[level] = (levelCounts[level] || 0);
        
        const x = level * (nodeWidth + horizontalGap);
        const y = levelCounts[level] * (nodeHeight + verticalGap);
        
        positions[message.id] = { x, y };
        levelCounts[level]++;
      });
      
      return positions;
    };
    
    const nodePositions = getNodePositions();
    
    // Get connections between nodes
    const getConnections = () => {
      const connections = [];
      
      messageTemplates.forEach(message => {
        if (message.responses) {
          message.responses.forEach(response => {
            if (response.nextMessageId) {
              connections.push({
                from: message.id,
                to: response.nextMessageId,
                label: response.option
              });
            }
          });
        }
      });
      
      return connections;
    };
    
    const connections = getConnections();
    
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Message Flow Visualization</h2>
          <Button variant="outline" onClick={() => setShowWorkflow(false)}>Close</Button>
        </div>
        
        <div className="overflow-auto" style={{ maxHeight: '80vh' }}>
          <div className="relative" style={{ minWidth: '1200px', minHeight: '800px' }}>
            {/* Render nodes */}
            {messageTemplates.map(message => {
              const position = nodePositions[message.id] || { x: 0, y: 0 };
              
              return (
                <div 
                  key={message.id}
                  className={`absolute border-2 rounded-lg p-4 w-[280px] ${
                    message.active 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 bg-gray-50'
                  }`}
                  style={{ 
                    left: `${position.x}px`, 
                    top: `${position.y}px`,
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{message.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      message.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {message.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="mb-2 text-xs text-gray-600">Trigger: {message.trigger}</p>
                  <p className="text-xs text-gray-800 line-clamp-2">
                    {message.message.substring(0, 100)}...
                  </p>
                  
                  {message.responses && message.responses.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {message.responses.map((response, idx) => (
                        <span key={idx} className="px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded">
                          {response.option}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            
            {/* Render connections as SVG arrows */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: -1 }}>
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
              
              {connections.map((conn, idx) => {
                const fromPos = nodePositions[conn.from];
                const toPos = nodePositions[conn.to];
                
                if (!fromPos || !toPos) return null;
                
                // Calculate connection points
                const fromX = fromPos.x + 280; // Right side of from node
                const fromY = fromPos.y + 60; // Middle of from node
                const toX = toPos.x; // Left side of to node
                const toY = toPos.y + 60; // Middle of to node
                
                // Calculate control points for curve
                const midX = (fromX + toX) / 2;
                
                return (
                  <g key={idx}>
                    <path
                      d={`M ${fromX} ${fromY} C ${midX} ${fromY}, ${midX} ${toY}, ${toX} ${toY}`}
                      stroke="#4b5563"
                      strokeWidth="2"
                      fill="none"
                      markerEnd="url(#arrowhead)"
                    />
                    
                    {/* Connection label */}
                    <foreignObject
                      x={midX - 15}
                      y={(fromY + toY) / 2 - 15}
                      width="30"
                      height="30"
                    >
                      <div className="flex items-center justify-center w-full h-full">
                        <span className="px-2 py-1 text-xs text-gray-800 bg-gray-100 rounded-full">
                          {conn.label}
                        </span>
                      </div>
                    </foreignObject>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Message Templates"
        subtitle="Manage your automated SMS recruitment conversations"
        actions={
          <div className="flex space-x-3">
            <Button 
              variant="outline"
              className="flex items-center"
              onClick={() => setShowWorkflow(!showWorkflow)}
            >
              <Eye className="w-4 h-4 mr-2" />
              {showWorkflow ? 'Hide Workflow' : 'View Workflow'}
            </Button>
            <Button className="flex items-center">
              <Save className="w-4 h-4 mr-2" />
              Save All Changes
            </Button>
          </div>
        }
      />

     {/* Stats Cards */}
<div className="grid grid-cols-1 gap-6 md:grid-cols-4">
  <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
    <div className="flex items-center">
      <MessageSquare className="w-8 h-8 text-blue-600 dark:text-[#29D3C0]" />
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Messages Sent</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">1,247</p>
      </div>
    </div>
  </div>

  <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
    <div className="flex items-center">
      <Users className="w-8 h-8 text-green-600 dark:text-[#29D3C0]" />
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Response Rate</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">73%</p>
      </div>
    </div>
  </div>

  <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
    <div className="flex items-center">
      <Clock className="w-8 h-8 text-yellow-600 dark:text-[#29D3C0]" />
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Response Time</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">12m</p>
      </div>
    </div>
  </div>

  <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
    <div className="flex items-center">
      <BarChart3 className="w-8 h-8 text-purple-600 dark:text-[#29D3C0]" />
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Interviews Scheduled</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">89</p>
      </div>
    </div>
        </div>
      </div>

      {/* Show workflow visualization if enabled */}
      {showWorkflow ? (
        <MessageTemplateWorkflow />
      ) : (
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex px-6 -mb-px space-x-8">
              {[
                { id: 'messages', label: 'Message Templates', icon: MessageSquare },
                { id: 'settings', label: 'Bot Settings', icon: Settings },
                { id: 'variables', label: 'Variables', icon: Edit3 },
                { id: 'scheduling', label: 'Time Slots', icon: Clock }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Message Templates Tab */}
            {activeTab === 'messages' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">Message Templates</h2>
                  <Button
                    onClick={() => setEditingMessage({})}
                    className="flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Template
                  </Button>
                </div>

                {editingMessage !== null ? (
                  <MessageEditor
                    message={editingMessage}
                    onSave={handleSaveMessage}
                    onCancel={() => setEditingMessage(null)}
                  />
                ) : (
                  <div className="space-y-4">
                    {messageTemplates.map((template) => (
                      <div key={template.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2 space-x-3">
                              <h3 className="font-medium text-gray-900">{template.name}</h3>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                template.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {template.active ? 'Active' : 'Inactive'}
                              </span>
                              <span className="text-sm text-gray-500">
                                Sent {template.sentCount} times
                              </span>
                            </div>
                            <p className="mb-2 text-sm text-gray-600">Trigger: {template.trigger}</p>
                            <p className="p-3 text-sm text-gray-800 whitespace-pre-line border rounded bg-gray-50">
                              {template.message}
                            </p>
                            
                            {template.responses && template.responses.length > 0 && (
                              <div className="mt-3">
                                <p className="mb-2 text-xs font-medium text-gray-700">Response Options:</p>
                                <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
                                  {template.responses.map((response, idx) => (
                                    <div key={idx} className="flex items-center p-2 text-xs text-blue-800 rounded bg-blue-50">
                                      <span className="font-medium">{response.option}</span>
                                      <ArrowRight className="w-3 h-3 mx-1" />
                                      <span>{response.action}</span>
                                      {response.nextMessageId && (
                                        <span className="px-1 ml-1 text-xs bg-blue-200 rounded">
                                          → {messageTemplates.find(m => m.id === response.nextMessageId)?.name || response.nextMessageId}
                                        </span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex ml-4 space-x-2">
                            <button
                              onClick={() => setEditingMessage(template)}
                              className="p-2 text-blue-600 hover:text-blue-800"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-green-600 hover:text-green-800">
                              <Copy className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-red-600 hover:text-red-800">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Bot Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold">Bot Settings</h2>
                
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Company Name</label>
                    <input
                      type="text"
                      value={botSettings.companyName}
                      onChange={(e) => setBotSettings(prev => ({ ...prev, companyName: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Default Job Position</label>
                    <input
                      type="text"
                      value={botSettings.defaultPosition}
                      onChange={(e) => setBotSettings(prev => ({ ...prev, defaultPosition: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                      type="text"
                      value={botSettings.phoneNumber}
                      onChange={(e) => setBotSettings(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Business Hours</label>
                    <input
                      type="text"
                      value={botSettings.businessHours}
                      onChange={(e) => setBotSettings(prev => ({ ...prev, businessHours: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="autoReply"
                    checked={botSettings.autoReply}
                    onChange={(e) => setBotSettings(prev => ({ ...prev, autoReply: e.target.checked }))}
                    className="w-4 h-4 mr-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="autoReply" className="text-sm text-gray-700">
                    Enable automatic replies (responds immediately to candidate messages)
                  </label>
                </div>
              </div>
            )}

            {/* Variables Tab */}
            {activeTab === 'variables' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold">Dynamic Variables</h2>
                <p className="text-sm text-gray-600">
                  These variables can be used in your message templates using the format &#123;&#123;variableName&#125;&#125;
                </p>
                
                <div className="space-y-4">
                  {variables.map((variable, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">Variable Name</label>
                          <code className="px-2 py-1 text-sm bg-gray-100 rounded">
                            &#123;&#123;{variable.name}&#125;&#125;
                          </code>
                        </div>
                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
                          <p className="text-sm text-gray-600">{variable.description}</p>
                        </div>
                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">Example</label>
                          <p className="text-sm font-medium text-gray-800">{variable.example}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Time Slots Tab */}
            {activeTab === 'scheduling' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Available Time Slots</h2>
                  <Button className="flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Time Slot
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {timeSlots.map((slot) => (
                    <div key={slot.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <input
                          type="checkbox"
                          checked={slot.available}
                          onChange={(e) => {
                            const newSlots = timeSlots.map(s => 
                              s.id === slot.id ? { ...s, available: e.target.checked } : s
                            );
                            setTimeSlots(newSlots);
                          }}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className={`${slot.available ? 'text-gray-900' : 'text-gray-500 line-through'}`}>
                          {slot.slot}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          slot.available ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {slot.available ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 text-blue-600 hover:text-blue-800">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:text-red-800">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;
import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Save, Eye, Copy, Settings, MessageSquare, Clock, Users, BarChart3 } from 'lucide-react';

const SMSBotAdmin = () => {
  const [activeTab, setActiveTab] = useState('messages');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);

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
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">
          {message ? 'Edit Message Template' : 'Create New Message Template'}
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Template Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Initial Contact"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trigger Event</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Message Content</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              rows={6}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your message here. Use {{variableName}} for dynamic content."
            />
            <div className="text-xs text-gray-500 mt-1">
              Available variables: {{candidateName}}, {{companyName}}, {{jobTitle}}, {{timeSlot1}}, {{timeSlot2}}, {{timeSlot3}}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Response Options</label>
              <button
                onClick={addResponse}
                className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
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
              className="mr-2"
            />
            <label htmlFor="active" className="text-sm text-gray-700">Active (messages will be sent)</label>
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(formData)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save Template
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">SMS Bot Configuration</h1>
              <p className="text-sm text-gray-600">Manage your automated SMS recruitment conversations</p>
            </div>
            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                Preview Bot
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
                <Save className="w-4 h-4 mr-2" />
                Save All Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <MessageSquare className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Messages Sent</p>
                <p className="text-2xl font-bold text-gray-900">1,247</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Response Rate</p>
                <p className="text-2xl font-bold text-gray-900">73%</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                <p className="text-2xl font-bold text-gray-900">12m</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Interviews Scheduled</p>
                <p className="text-2xl font-bold text-gray-900">89</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
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
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold">Message Templates</h2>
                  <button
                    onClick={() => setEditingMessage({})}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Template
                  </button>
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
                      <div key={template.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
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
                            <p className="text-sm text-gray-600 mb-2">Trigger: {template.trigger}</p>
                            <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded border">
                              {template.message.substring(0, 150)}...
                            </p>
                          </div>
                          <div className="flex space-x-2 ml-4">
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                    <input
                      type="text"
                      value={botSettings.companyName}
                      onChange={(e) => setBotSettings(prev => ({ ...prev, companyName: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Default Job Position</label>
                    <input
                      type="text"
                      value={botSettings.defaultPosition}
                      onChange={(e) => setBotSettings(prev => ({ ...prev, defaultPosition: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="text"
                      value={botSettings.phoneNumber}
                      onChange={(e) => setBotSettings(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Hours</label>
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
                    className="mr-3"
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
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Variable Name</label>
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                            &#123;&#123;{variable.name}&#125;&#125;
                          </code>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <p className="text-sm text-gray-600">{variable.description}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Example</label>
                          <p className="text-sm text-gray-800 font-medium">{variable.example}</p>
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
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Available Time Slots</h2>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Time Slot
                  </button>
                </div>
                
                <div className="space-y-4">
                  {timeSlots.map((slot) => (
                    <div key={slot.id} className="flex items-center justify-between border border-gray-200 rounded-lg p-4">
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
      </div>
    </div>
  );
};

export default SMSBotAdmin;
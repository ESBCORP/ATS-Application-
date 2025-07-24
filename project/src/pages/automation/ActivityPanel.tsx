import React from 'react';
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  Globe, 
  Clock, 
  GitBranch,
  Zap,
  Database,
  Webhook
} from 'lucide-react';

interface ActivityPanelProps {
  onAddNode: (type: string, position: { x: number; y: number }) => void;
}

const ActivityPanel: React.FC<ActivityPanelProps> = ({ onAddNode }) => {
  const activities = [
    {
      type: 'sms',
      label: 'Send SMS',
      icon: MessageSquare,
      color: 'bg-blue-500',
      description: 'Send text message to candidate'
    },
    {
      type: 'call',
      label: 'Make Call',
      icon: Phone,
      color: 'bg-purple-500',
      description: 'Initiate phone call'
    },
    {
      type: 'email',
      label: 'Send Email',
      icon: Mail,
      color: 'bg-orange-500',
      description: 'Send email to candidate'
    },
    {
      type: 'api',
      label: 'API Call',
      icon: Globe,
      color: 'bg-teal-500',
      description: 'Make HTTP API request'
    },
    {
      type: 'delay',
      label: 'Delay',
      icon: Clock,
      color: 'bg-yellow-500',
      description: 'Wait for specified time'
    },
    {
      type: 'condition',
      label: 'Condition',
      icon: GitBranch,
      color: 'bg-indigo-500',
      description: 'Branch based on condition'
    },
    {
      type: 'webhook',
      label: 'Send Webhook',
      icon: Zap,
      color: 'bg-pink-500',
      description: 'Send webhook notification'
    },
    {
      type: 'webhook_listener',
      label: 'Webhook Listener',
      icon: Webhook,
      color: 'bg-emerald-500',
      description: 'Wait for incoming webhook'
    },
    {
      type: 'database',
      label: 'Database',
      icon: Database,
      color: 'bg-gray-500',
      description: 'Query or update database'
    }
  ];

  const handleDragStart = (event: React.DragEvent, activityType: string) => {
    event.dataTransfer.setData('application/json', JSON.stringify({ type: activityType }));
  };

  const handleActivityClick = (activityType: string) => {
    // Add node at a default position when clicked
    onAddNode(activityType, { x: 300, y: 200 });
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Activities</h3>
      
      <div className="space-y-2">
        {activities.map((activity) => {
          const IconComponent = activity.icon;
          
          return (
            <div
              key={activity.type}
              className="p-3 rounded-lg border border-gray-200 hover:border-gray-300 cursor-pointer transition-all hover:shadow-sm"
              draggable
              onDragStart={(e) => handleDragStart(e, activity.type)}
              onClick={() => handleActivityClick(activity.type)}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-lg ${activity.color} flex items-center justify-center text-white`}>
                  <IconComponent className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{activity.label}</div>
                  <div className="text-xs text-gray-500">{activity.description}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <h4 className="text-sm font-semibold mb-3 text-gray-700">Instructions</h4>
        <div className="text-xs text-gray-600 space-y-2">
          <p>• Drag activities to the canvas</p>
          <p>• Click activities to add them</p>
          <p>• Connect nodes using the + button</p>
          <p>• Select nodes to edit properties</p>
          <p>• Delete nodes with the trash icon</p>
        </div>
      </div>
    </div>
  );
};

export default ActivityPanel;
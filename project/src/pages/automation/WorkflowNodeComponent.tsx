import React from 'react';
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  Globe, 
  Clock, 
  GitBranch, 
  Play, 
  Square,
  Trash2,
  Plus,
  Zap,
  Database,
  ArrowRight,
  Webhook
} from 'lucide-react';
import { WorkflowNode } from '../../types/automation';

interface WorkflowNodeComponentProps {
  node: WorkflowNode;
  isSelected: boolean;
  onMouseDown: (nodeId: string, event: React.MouseEvent) => void;
  onConnectionStart: (nodeId: string, event?: React.MouseEvent) => void;
  onConnectionEnd: (nodeId: string) => void;
  onDelete: (nodeId: string) => void;
  connecting: { from: string; to?: string } | null;
  isDraggingConnection?: boolean;
}

const WorkflowNodeComponent: React.FC<WorkflowNodeComponentProps> = ({
  node,
  isSelected,
  onMouseDown,
  onConnectionStart,
  onConnectionEnd,
  onDelete,
  connecting,
  isDraggingConnection = false
}) => {
  const getNodeIcon = () => {
    switch (node.type) {
      case 'start':
        return <Play className="h-5 w-5" />;
      case 'end':
        return <Square className="h-5 w-5" />;
      case 'sms':
        return <MessageSquare className="h-5 w-5" />;
      case 'call':
        return <Phone className="h-5 w-5" />;
      case 'email':
        return <Mail className="h-5 w-5" />;
      case 'api':
        return <Globe className="h-5 w-5" />;
      case 'delay':
        return <Clock className="h-5 w-5" />;
      case 'condition':
        return <GitBranch className="h-5 w-5" />;
      case 'webhook':
        return <Zap className="h-5 w-5" />;
      case 'webhook_listener':
        return <Webhook className="h-5 w-5" />;
      case 'database':
        return <Database className="h-5 w-5" />;
      default:
        return <Square className="h-5 w-5" />;
    }
  };

  const getNodeColor = () => {
    switch (node.type) {
      case 'start':
        return 'bg-green-500 text-white border-green-600';
      case 'end':
        return 'bg-red-500 text-white border-red-600';
      case 'sms':
        return 'bg-blue-500 text-white border-blue-600';
      case 'call':
        return 'bg-purple-500 text-white border-purple-600';
      case 'email':
        return 'bg-orange-500 text-white border-orange-600';
      case 'api':
        return 'bg-teal-500 text-white border-teal-600';
      case 'delay':
        return 'bg-yellow-500 text-white border-yellow-600';
      case 'condition':
        return 'bg-indigo-500 text-white border-indigo-600';
      case 'webhook':
        return 'bg-pink-500 text-white border-pink-600';
      case 'webhook_listener':
        return 'bg-emerald-500 text-white border-emerald-600';
      case 'database':
        return 'bg-gray-500 text-white border-gray-600';
      default:
        return 'bg-gray-500 text-white border-gray-600';
    }
  };

  const handleConnectionButtonMouseDown = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    
    if (connecting && connecting.from !== node.id) {
      // Complete connection
      onConnectionEnd(node.id);
    } else if (!connecting) {
      // Start new connection
      onConnectionStart(node.id, event);
    }
  };

  const handleDeleteClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onDelete(node.id);
  };

  const isConnecting = connecting?.from === node.id;
  const canConnect = connecting && connecting.from !== node.id;
  const isConnectionTarget = isDraggingConnection && canConnect;

  return (
    <div
      className={`absolute select-none ${isSelected ? 'z-20' : 'z-10'} ${
        !isDraggingConnection ? 'cursor-move' : ''
      }`}
      style={{
        left: node.position.x,
        top: node.position.y,
        width: 200,
        height: 50
      }}
      onMouseDown={(e) => !isDraggingConnection && onMouseDown(node.id, e)}
    >
      <div
        className={`
          w-full h-full rounded-lg shadow-lg border-2 flex items-center px-3 transition-all
          ${getNodeColor()}
          ${isSelected ? 'border-blue-400 shadow-xl ring-2 ring-blue-200' : 'border-transparent'}
          ${isConnectionTarget ? 'ring-4 ring-green-300 border-green-400 shadow-2xl scale-105' : ''}
          ${!isDraggingConnection ? 'hover:shadow-xl hover:scale-105' : ''}
          ${isDraggingConnection && !canConnect ? 'opacity-50' : ''}
        `}
      >
        <div className="flex items-center space-x-2 flex-1">
          {getNodeIcon()}
          <span className="text-sm font-medium truncate">{node.data.label}</span>
        </div>

        {/* Connection point */}
        <button
          className={`
            w-8 h-8 rounded-full border-2 border-white flex items-center justify-center 
            transition-all transform relative z-30
            ${isConnecting 
              ? 'bg-blue-500 text-white shadow-lg ring-4 ring-blue-300 scale-110 animate-pulse' 
              : isConnectionTarget
              ? 'bg-green-500 text-white shadow-lg ring-4 ring-green-300 scale-110'
              : 'bg-white text-gray-600 hover:bg-gray-100 hover:scale-110'
            }
          `}
          onMouseDown={handleConnectionButtonMouseDown}
          title={
            isConnecting 
              ? 'Drag to another node to connect' 
              : isConnectionTarget 
              ? 'Drop here to connect'
              : 'Click and drag to connect'
          }
        >
          {isConnecting ? (
            <ArrowRight className="h-4 w-4" />
          ) : isConnectionTarget ? (
            <Plus className="h-4 w-4" />
          ) : (
            <Plus className="h-3 w-3" />
          )}
        </button>

        {/* Delete button (only for non-start/end nodes) */}
        {node.type !== 'start' && node.type !== 'end' && isSelected && !isDraggingConnection && (
          <button
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full hover:bg-red-600 flex items-center justify-center shadow-lg transform hover:scale-110 transition-all z-30"
            onClick={handleDeleteClick}
            title="Delete node"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        )}

        {/* Connection indicator */}
        {isConnecting && (
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap shadow-lg">
            Drag to connect
          </div>
        )}

        {/* Connection target indicator */}
        {isConnectionTarget && (
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap shadow-lg animate-bounce">
            Drop to connect
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowNodeComponent;
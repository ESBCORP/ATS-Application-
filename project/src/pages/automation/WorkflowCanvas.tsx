import React, { useRef, useState, useCallback, useEffect } from 'react';
import { WorkflowNode, WorkflowConnection } from '../../types/automation';
import WorkflowNodeComponent from './WorkflowNodeComponent';

interface WorkflowCanvasProps {
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  onNodesChange: (nodes: WorkflowNode[]) => void;
  onConnectionsChange: (connections: WorkflowConnection[]) => void;
  onNodeSelect: (node: WorkflowNode | null) => void;
  onAddNode: (type: string, position: { x: number; y: number }) => void;
}

const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({
  nodes,
  connections,
  onNodesChange,
  onConnectionsChange,
  onNodeSelect,
  onAddNode
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [connecting, setConnecting] = useState<{ from: string; to?: string } | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [tempConnection, setTempConnection] = useState<{ from: { x: number; y: number }; to: { x: number; y: number } } | null>(null);
  const [isDraggingConnection, setIsDraggingConnection] = useState(false);
  const [hoveredConnection, setHoveredConnection] = useState<string | null>(null);
  const [showConnectionMenu, setShowConnectionMenu] = useState<{
    connectionId: string;
    position: { x: number; y: number };
  } | null>(null);

  const clearTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleNodeMouseDown = useCallback((nodeId: string, event: React.MouseEvent) => {
    if (connecting || isDraggingConnection) return;
    
    event.preventDefault();
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    const rect = event.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    });
    setDraggedNode(nodeId);
    setSelectedNodeId(nodeId);
    onNodeSelect(node);
  }, [nodes, onNodeSelect, connecting, isDraggingConnection]);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (draggedNode && canvasRef.current && !isDraggingConnection) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const newPosition = {
        x: Math.max(0, event.clientX - canvasRect.left - dragOffset.x),
        y: Math.max(0, event.clientY - canvasRect.top - dragOffset.y)
      };

      onNodesChange(nodes.map(node =>
        node.id === draggedNode
          ? { ...node, position: newPosition }
          : node
      ));
    }

    if (connecting && canvasRef.current) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const fromNode = nodes.find(n => n.id === connecting.from);
      if (fromNode) {
        setTempConnection({
          from: {
            x: fromNode.position.x + 100,
            y: fromNode.position.y + 25
          },
          to: {
            x: event.clientX - canvasRect.left,
            y: event.clientY - canvasRect.top
          }
        });
      }
    }
  }, [draggedNode, dragOffset, nodes, onNodesChange, connecting, isDraggingConnection]);

  const handleMouseUp = useCallback((event: MouseEvent) => {
    if (isDraggingConnection && connecting && canvasRef.current) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const mouseX = event.clientX - canvasRect.left;
      const mouseY = event.clientY - canvasRect.top;
      
      const targetNode = nodes.find(node => {
        const nodeRect = {
          left: node.position.x,
          top: node.position.y,
          right: node.position.x + 200,
          bottom: node.position.y + 50
        };
        
        return mouseX >= nodeRect.left && 
               mouseX <= nodeRect.right && 
               mouseY >= nodeRect.top && 
               mouseY <= nodeRect.bottom;
      });
      
      if (targetNode && targetNode.id !== connecting.from) {
        handleConnectionEnd(targetNode.id);
      } else {
        setConnecting(null);
        setTempConnection(null);
      }
      
      setIsDraggingConnection(false);
    }
    
    setDraggedNode(null);
  }, [isDraggingConnection, connecting, nodes]);

  const handleCanvasClick = useCallback((event: React.MouseEvent) => {
    if (event.target === canvasRef.current) {
      setSelectedNodeId(null);
      onNodeSelect(null);
      setShowConnectionMenu(null);
      if (connecting) {
        setConnecting(null);
        setTempConnection(null);
        setIsDraggingConnection(false);
      }
    }
  }, [onNodeSelect, connecting]);

  const handleConnectionStart = useCallback((nodeId: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
      setIsDraggingConnection(true);
    }
    setConnecting({ from: nodeId });
    
    const fromNode = nodes.find(n => n.id === nodeId);
    if (fromNode && canvasRef.current && event) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      setTempConnection({
        from: {
          x: fromNode.position.x + 100,
          y: fromNode.position.y + 25
        },
        to: {
          x: event.clientX - canvasRect.left,
          y: event.clientY - canvasRect.top
        }
      });
    }
  }, [nodes]);

  const handleConnectionEnd = useCallback((nodeId: string) => {
    if (connecting && connecting.from !== nodeId) {
      const existingConnection = connections.find(
        c => c.from === connecting.from && c.to === nodeId
      );
      
      if (!existingConnection) {
        const newConnection: WorkflowConnection = {
          id: `connection-${Date.now()}`,
          from: connecting.from,
          to: nodeId
        };
        onConnectionsChange([...connections, newConnection]);
      }
    }
    setConnecting(null);
    setTempConnection(null);
    setIsDraggingConnection(false);
  }, [connecting, connections, onConnectionsChange]);

  const handleDeleteNode = useCallback((nodeId: string) => {
    if (nodeId === 'start' || nodeId === 'end') return;
    
    onNodesChange(nodes.filter(n => n.id !== nodeId));
    onConnectionsChange(connections.filter(c => c.from !== nodeId && c.to !== nodeId));
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
      onNodeSelect(null);
    }
  }, [nodes, connections, selectedNodeId, onNodesChange, onConnectionsChange, onNodeSelect]);

  const handleDeleteConnection = useCallback((connectionId: string) => {
    onConnectionsChange(connections.filter(c => c.id !== connectionId));
    setShowConnectionMenu(null);
  }, [connections, onConnectionsChange]);

  const handleConnectionClick = useCallback((connectionId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setShowConnectionMenu({
        connectionId,
        position: {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top
        }
      });
    }
  }, []);

  const handleAddActivityOnConnection = useCallback((connectionId: string, activityType: string) => {
    const connection = connections.find(c => c.id === connectionId);
    if (!connection) return;

    const fromNode = nodes.find(n => n.id === connection.from);
    const toNode = nodes.find(n => n.id === connection.to);
    if (!fromNode || !toNode) return;

    // Calculate position between the two nodes
    const midPosition = {
      x: (fromNode.position.x + toNode.position.x) / 2,
      y: (fromNode.position.y + toNode.position.y) / 2
    };

    // Create new node
    const newNode: WorkflowNode = {
      id: `node-${Date.now()}`,
      type: activityType as any,
      position: midPosition,
      data: {
        label: getNodeLabel(activityType),
        ...getDefaultNodeData(activityType)
      }
    };
    
    // Add the new node
    const updatedNodes = [...nodes, newNode];
    onNodesChange(updatedNodes);

    // Remove the original connection
    const updatedConnections = connections.filter(c => c.id !== connectionId);
    
    // Add two new connections: from -> new node -> to
    const newConnections = [
      ...updatedConnections,
      {
        id: `connection-${Date.now()}-1`,
        from: connection.from,
        to: newNode.id
      },
      {
        id: `connection-${Date.now()}-2`,
        from: newNode.id,
        to: connection.to
      }
    ];
    
    onConnectionsChange(newConnections);
    setShowConnectionMenu(null);
  }, [connections, nodes, onAddNode, onConnectionsChange, onNodesChange]);

  const getNodeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      'sms': 'Send SMS',
      'call': 'Make Call',
      'email': 'Send Email',
      'api': 'API Call',
      'delay': 'Delay',
      'condition': 'Condition',
      'webhook': 'Send Webhook',
      'webhook_listener': 'Webhook Listener',
      'database': 'Database'
    };
    return labels[type] || type;
  };

  const getDefaultNodeData = (type: string): any => {
    switch (type) {
      case 'sms':
        return { 
          message: 'Hello {{candidateName}}, this is a message from our recruitment team.', 
          recipient: '{{candidatePhone}}',
          conversationalMode: false,
          autoReplies: [],
          fallbackMessage: 'Thank you for your response. We will get back to you soon.',
          scheduled: false,
          maxRetries: 3,
          retryDelay: 5
        };
      case 'call':
        return { 
          phoneNumber: '{{candidatePhone}}', 
          script: 'Hello {{candidateName}}, we would like to discuss the opportunity with you.' 
        };
      case 'email':
        return { 
          to: '{{candidateEmail}}', 
          subject: 'Regarding your application', 
          body: 'Dear {{candidateName}},\n\nThank you for your interest in our position.\n\nBest regards,\nRecruitment Team' 
        };
      case 'api':
        return { url: 'https://api.example.com/endpoint', method: 'GET', headers: {}, body: '' };
      case 'delay':
        return { duration: 5, unit: 'minutes' };
      case 'condition':
        return { field: 'candidateStatus', operator: 'equals', value: 'active' };
      case 'webhook':
        return { url: 'https://webhook.example.com/notify', method: 'POST' };
      case 'webhook_listener':
        return { 
          description: 'Wait for incoming webhook',
          timeout: 3600, // 1 hour timeout
          expectedFields: [],
          responseMessage: 'Webhook received successfully'
        };
      default:
        return {};
    }
  };

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    
    try {
      const data = JSON.parse(event.dataTransfer.getData('application/json'));
      if (data.type && canvasRef.current) {
        const canvasRect = canvasRef.current.getBoundingClientRect();
        const position = {
          x: event.clientX - canvasRect.left - 100,
          y: event.clientY - canvasRect.top - 25
        };
        
        onAddNode(data.type, position);
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  }, [onAddNode]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      if (clearTimeoutRef.current) {
        clearTimeout(clearTimeoutRef.current);
      }
    };
  }, [handleMouseMove, handleMouseUp]);

  const getConnectionPath = (from: WorkflowNode, to: WorkflowNode) => {
    const fromX = from.position.x + 100;
    const fromY = from.position.y + 25;
    const toX = to.position.x + 100;
    const toY = to.position.y + 25;

    const midX = (fromX + toX) / 2;
    
    return `M ${fromX} ${fromY} C ${midX} ${fromY}, ${midX} ${toY}, ${toX} ${toY}`;
  };

  const getTempConnectionPath = () => {
    if (!tempConnection) return '';
    
    const { from, to } = tempConnection;
    const midX = (from.x + to.x) / 2;
    
    return `M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`;
  };

  const getConnectionMidpoint = (from: WorkflowNode, to: WorkflowNode) => {
    const fromX = from.position.x + 100;
    const fromY = from.position.y + 25;
    const toX = to.position.x + 100;
    const toY = to.position.y + 25;

    return {
      x: (fromX + toX) / 2,
      y: (fromY + toY) / 2
    };
  };

  const activityTypes = [
    { type: 'sms', label: 'SMS', icon: '💬' },
    { type: 'call', label: 'Call', icon: '📞' },
    { type: 'email', label: 'Email', icon: '📧' },
    { type: 'api', label: 'API', icon: '🌐' },
    { type: 'delay', label: 'Delay', icon: '⏱️' },
    { type: 'condition', label: 'Condition', icon: '🔀' },
    { type: 'webhook', label: 'Webhook', icon: '⚡' },
    { type: 'webhook_listener', label: 'Webhook Listener', icon: '🎣' },
    { type: 'database', label: 'Database', icon: '💾' }
  ];

  return (
    <div
      ref={canvasRef}
      className="w-full h-full bg-gray-50 relative overflow-hidden"
      onClick={handleCanvasClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      style={{ 
        backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)', 
        backgroundSize: '20px 20px',
        minHeight: '600px',
        cursor: isDraggingConnection ? 'crosshair' : 'default'
      }}
    >
      {/* SVG for connections */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {/* Existing connections */}
        {connections.map(connection => {
          const fromNode = nodes.find(n => n.id === connection.from);
          const toNode = nodes.find(n => n.id === connection.to);
          
          if (!fromNode || !toNode) return null;
          
          const midpoint = getConnectionMidpoint(fromNode, toNode);
          
          return (
            <g key={connection.id}>
              {/* Main connection path */}
              <path
                d={getConnectionPath(fromNode, toNode)}
                stroke={hoveredConnection === connection.id ? "#3b82f6" : "#6b7280"}
                strokeWidth={hoveredConnection === connection.id ? "3" : "2"}
                fill="none"
                markerEnd="url(#arrowhead)"
                className="cursor-pointer transition-all duration-200"
                style={{ pointerEvents: 'stroke' }}
                onMouseEnter={() => setHoveredConnection(connection.id)}
                onMouseLeave={() => setHoveredConnection(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  handleConnectionClick(connection.id, e as any);
                }}
              />
              
              {/* Invisible wider path for easier clicking */}
              <path
                d={getConnectionPath(fromNode, toNode)}
                stroke="transparent"
                strokeWidth="12"
                fill="none"
                className="cursor-pointer"
                style={{ pointerEvents: 'stroke' }}
                onMouseEnter={() => setHoveredConnection(connection.id)}
                onMouseLeave={() => setHoveredConnection(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  handleConnectionClick(connection.id, e as any);
                }}
              />
              
              {/* Add button on hover */}
              {hoveredConnection === connection.id && (
                <circle
                  cx={midpoint.x}
                  cy={midpoint.y}
                  r="12"
                  fill="#3b82f6"
                  stroke="white"
                  strokeWidth="2"
                  className="cursor-pointer"
                  style={{ pointerEvents: 'all' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleConnectionClick(connection.id, e as any);
                  }}
                />
              )}
              
              {hoveredConnection === connection.id && (
                <text
                  x={midpoint.x}
                  y={midpoint.y + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="12"
                  fontWeight="bold"
                  className="cursor-pointer pointer-events-none"
                >
                  +
                </text>
              )}
            </g>
          );
        })}
        
        {/* Temporary connection while dragging */}
        {tempConnection && (
          <path
            d={getTempConnectionPath()}
            stroke="#3b82f6"
            strokeWidth="3"
            fill="none"
            strokeDasharray="5,5"
            markerEnd="url(#arrowhead-temp)"
            className="animate-pulse"
          />
        )}
        
        {/* Arrow marker definitions */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="12"
            markerHeight="8"
            refX="11"
            refY="4"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <polygon
              points="0 0, 12 4, 0 8"
              fill="#6b7280"
            />
          </marker>
          <marker
            id="arrowhead-temp"
            markerWidth="12"
            markerHeight="8"
            refX="11"
            refY="4"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <polygon
              points="0 0, 12 4, 0 8"
              fill="#3b82f6"
            />
          </marker>
        </defs>
      </svg>

      {/* Nodes */}
      {nodes.map(node => (
        <WorkflowNodeComponent
          key={node.id}
          node={node}
          isSelected={selectedNodeId === node.id}
          onMouseDown={handleNodeMouseDown}
          onConnectionStart={handleConnectionStart}
          onConnectionEnd={handleConnectionEnd}
          onDelete={handleDeleteNode}
          connecting={connecting}
          isDraggingConnection={isDraggingConnection}
        />
      ))}

      {/* Connection Menu */}
      {showConnectionMenu && (
        <div
          className="absolute bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-50"
          style={{
            left: showConnectionMenu.position.x - 100,
            top: showConnectionMenu.position.y - 50
          }}
        >
          <div className="text-xs font-medium text-gray-700 mb-2 px-2">Add Activity</div>
          <div className="grid grid-cols-4 gap-1 mb-2">
            {activityTypes.map(activity => (
              <button
                key={activity.type}
                onClick={() => handleAddActivityOnConnection(showConnectionMenu.connectionId, activity.type)}
                className="flex flex-col items-center p-2 rounded hover:bg-gray-100 transition-colors"
                title={activity.label}
              >
                <span className="text-lg mb-1">{activity.icon}</span>
                <span className="text-xs text-gray-600">{activity.label}</span>
              </button>
            ))}
          </div>
          <div className="border-t pt-2">
            <button
              onClick={() => handleDeleteConnection(showConnectionMenu.connectionId)}
              className="w-full text-left px-2 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
            >
              🗑️ Delete Connection
            </button>
          </div>
        </div>
      )}

      {/* Connection instructions */}
      {connecting && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-100 text-blue-800 px-4 py-2 rounded-lg shadow-lg z-50">
          {isDraggingConnection 
            ? 'Drag to another node to create a connection, or release to cancel'
            : 'Click on another node to create a connection, or click on empty space to cancel'
          }
        </div>
      )}

      {/* Drop zone indicator */}
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span>Drag activities here or click connections to add activities</span>
        </div>
      </div>
    </div>
  );
};

export default WorkflowCanvas;
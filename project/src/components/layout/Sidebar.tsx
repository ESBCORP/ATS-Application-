import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Briefcase,
  Users,
  ClipboardList,
  GitPullRequestArrow,
  Home,
  BarChart3,
  Shield,
  Video,
  UserCheck,
  UserX,
  Settings,
  Workflow
} from 'lucide-react';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  subItems?: { label: string; to: string }[];
  index?: number;
  totalItems?: number;
}

const NavItem: React.FC<NavItemProps> = ({ 
  icon, 
  label, 
  to, 
  subItems, 
  index = 0, 
  totalItems = 0
}) => {
  const [showSubmenu, setShowSubmenu] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Calculate if this is one of the last two items
  const isNearBottom = totalItems > 0 && index >= totalItems - 2;

  const clearTimeoutRef = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleMouseEnter = () => {
    clearTimeoutRef();
    if (subItems && subItems.length > 0) {
      setShowSubmenu(true);
    }
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    clearTimeoutRef();
    
    // Check if we're moving to the submenu
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const submenuLeft = rect.right;
      const submenuRight = rect.right + 200; // approximate submenu width
      const submenuTop = isNearBottom ? rect.bottom - 200 : rect.top - 20;
      const submenuBottom = isNearBottom ? rect.bottom : rect.top + 200;
      
      // If mouse is moving towards submenu area, delay hiding
      if (e.clientX >= submenuLeft && e.clientX <= submenuRight && 
          e.clientY >= submenuTop && e.clientY <= submenuBottom) {
        timeoutRef.current = setTimeout(() => {
          setShowSubmenu(false);
        }, 300);
      } else {
        setShowSubmenu(false);
      }
    } else {
      setShowSubmenu(false);
    }
  };

  const handleSubmenuMouseEnter = () => {
    clearTimeoutRef();
    setShowSubmenu(true);
  };

  const handleSubmenuMouseLeave = () => {
    clearTimeoutRef();
    setShowSubmenu(false);
  };

  const handleSubmenuItemClick = () => {
    clearTimeoutRef();
    setShowSubmenu(false);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      clearTimeoutRef();
    };
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <div
        className="nav-item-container"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <NavLink
          to={to}
          end
          className={({ isActive: linkActive }) => {
            // Check if any of the sub-items are active
            const isSubItemActive = subItems?.some(subItem => 
              window.location.pathname.startsWith(subItem.to)
            ) || false;
            
            const isCurrentlyActive = linkActive || isSubItemActive;
            
            return `flex items-center justify-center h-14 w-16 rounded-lg transition-all duration-200 relative ${
              isCurrentlyActive
                ? 'bg-blue-800 dark:bg-blue-700 text-white'
                : showSubmenu
                ? 'text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400'
            }`;
          }}
        >
          <span className="h-6 w-6 transition-colors duration-200">{icon}</span>
        </NavLink>
      </div>

      {subItems && showSubmenu && (
        <div 
          className={`absolute left-full w-48 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 submenu-container ${
            isNearBottom ? 'bottom-0' : 'top-0 -translate-y-1/4'
          }`}
          style={{
            marginLeft: '2px', // Minimal gap
          }}
          onMouseEnter={handleSubmenuMouseEnter}
          onMouseLeave={handleSubmenuMouseLeave}
        >
          {subItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.to}
              className={({ isActive }) =>
                `block px-4 py-2 text-sm transition-colors duration-200 ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400'
                }`
              }
              onClick={handleSubmenuItemClick}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

const Sidebar: React.FC = () => {
  const navItems: NavItemProps[] = [
    {
      icon: <Home />,
      label: 'Dashboard',
      to: '/dashboard',
    },
    {
      icon: <Briefcase />,
      label: 'Jobs',
      to: '/jobs',
      subItems: [
        { label: 'All Jobs', to: '/jobs' },
        { label: 'Active Jobs', to: '/jobs/active' },
        { label: 'Inactive Jobs', to: '/jobs/inactive' },
        { label: 'Add New Job', to: '/jobs/new' },
      ],
    },
    {
      icon: <Users />,
      label: 'Candidates',
      to: '/candidates',
      subItems: [
        { label: 'All Candidates', to: '/candidates' },
        { label: 'Active Candidates', to: '/candidates/active' },
        { label: 'Inactive Candidates', to: '/candidates/inactive' },
        { label: 'My Candidates', to: '/candidates/my' },
        { label: 'Add New Candidate', to: '/candidates/new' },
      ],
    },
    {
      icon: <ClipboardList />,
      label: 'Submissions',
      to: '/submissions',
      subItems: [
        { label: 'All Submissions', to: '/submissions' },
        { label: 'My Submissions', to: '/submissions/my' },
        { label: 'Recent Submissions', to: '/submissions/recent' },
        { label: 'Create New Submission', to: '/submissions/new' },
      ],
    },
    {
      icon: <Video />,
      label: 'Video',
      to: '/video',
      subItems: [
        { label: 'Meetings', to: '/video/meetings' },
        { label: 'Recordings', to: '/video/recordings' },
        { label: 'Video Settings', to: '/settings/video' }
      ],
    },
    {
      icon: <GitPullRequestArrow />,
      label: 'Pipeline',
      to: '/pipeline',
      subItems: [
        { label: 'Active Pipeline', to: '/pipeline' },
        { label: 'Inactive Pipeline', to: '/pipeline/inactive' },
      ],
    },
    {
      icon: <Workflow />,
      label: 'Automation',
      to: '/automation',
      subItems: [
        { label: 'Workflows', to: '/automation/workflows' },
        { label: 'History', to: '/automation/history' },
        { label: 'Settings', to: '/automation/settings' },
      ],
    },
    {
      icon: <BarChart3 />,
      label: 'Reports',
      to: '/reports',
      subItems: [
        { label: 'Recruitment Overview', to: '/reports/overview' },
        { label: 'Submission Analytics', to: '/reports/submissions' },
        { label: 'Pipeline Analytics', to: '/reports/pipeline' },
        { label: 'Job Analytics', to: '/reports/jobs' },
        { label: 'Candidate Analytics', to: '/reports/candidates' },
        { label: 'Performance Metrics', to: '/reports/performance' },
      ],
    },
  
    {
      icon: <Settings />,
      label: 'Settings',
      to: '/settings/company',
      subItems: [
        { label: 'Company Profile', to: '/settings/company' },
        { label: 'Custom Fields', to: '/settings/custom-fields' },
        { label: 'Access Control', to: '/access/control' },
        { label: 'Users', to: '/access/users' },
        { label: 'Messages', to: '/settings/messages' },
        { label: 'Video', to: '/settings/video' },
        { label: 'Workflow', to: '/settings/workflow' },
      ],
    }
  ];

  return (
    <aside className="fixed left-0 top-16 h-full w-20 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-40">
      <nav className="h-full py-3 flex flex-col items-center space-y-2">
        {navItems.map((item, index) => (
          <NavItem 
            key={index} 
            {...item} 
            index={index} 
            totalItems={navItems.length}
          />
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import { fetchRoles } from '../../services/permissionsService';

interface RoleSecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RoleSecurityModal: React.FC<RoleSecurityModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string>('Admin');
  const [availableRoles, setAvailableRoles] = useState<string[]>(['Admin', 'Employee']);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadRoles = async () => {
      if (!isOpen) return;
      
      try {
        setLoading(true);
        const roles = await fetchRoles();
        setAvailableRoles(roles);
        
        // Default to first role if available
        if (roles.length > 0 && !selectedRole) {
          setSelectedRole(roles[0]);
        }
      } catch (error) {
        console.error('Failed to load roles:', error);
        // Keep default roles if API fails
      } finally {
        setLoading(false);
      }
    };
    
    loadRoles();
  }, [isOpen]);

  const handleRoleSelect = () => {
    navigate('/access/security/role', { state: { role: selectedRole } });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="relative w-full max-w-lg rounded-lg bg-white p-8 shadow-xl">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900">Select Role</h2>
            <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
          </div>

          <div className="space-y-6 mb-8">
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading roles...</p>
              </div>
            ) : (
              availableRoles.map(role => (
                <div 
                  key={role}
                  className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedRole === role 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => setSelectedRole(role)}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border-2 mr-3 ${
                      selectedRole === role 
                        ? 'border-blue-500 bg-blue-500' 
                        : 'border-gray-400'
                    }`}>
                      {selectedRole === role && (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{role}</h3>
                      <p className="text-sm text-gray-500">
                        {role === 'SuperAdmin' ? 'Full system access' : 
                         role === 'Admin' ? 'Administrative access' : 
                         'Standard user access'}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleRoleSelect}>Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSecurityModal;
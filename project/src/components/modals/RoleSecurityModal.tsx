import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

interface RoleSecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RoleSecurityModal: React.FC<RoleSecurityModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string>('Admin');

  if (!isOpen) return null;

  const handleRoleSelect = () => {
    navigate('/access/security/role', { state: { role: selectedRole } });
    onClose();
  };

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
            <div 
              className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                selectedRole === 'Admin' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => setSelectedRole('Admin')}
            >
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full border-2 mr-3 ${
                  selectedRole === 'Admin' 
                    ? 'border-blue-500 bg-blue-500' 
                    : 'border-gray-400'
                }`}>
                  {selectedRole === 'Admin' && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Admin</h3>
                  <p className="text-sm text-gray-500">Full administrative access and control</p>
                </div>
              </div>
            </div>

            <div 
              className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                selectedRole === 'Employee' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => setSelectedRole('Employee')}
            >
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full border-2 mr-3 ${
                  selectedRole === 'Employee' 
                    ? 'border-blue-500 bg-blue-500' 
                    : 'border-gray-400'
                }`}>
                  {selectedRole === 'Employee' && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Employee</h3>
                  <p className="text-sm text-gray-500">Standard user access level</p>
                </div>
              </div>
            </div>
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
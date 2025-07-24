import React, { useState, useEffect } from 'react';
import { Shield, Mail, Lock, LayoutDashboard, Key } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/ui/Button';
import RoleSecurityModal from '../../components/modals/RoleSecurityModal';
import { useAuth } from '../../contexts/AuthContext';
import { fetchRoles } from '../../services/permissionsService';
import { useNavigate } from 'react-router-dom';

const AccessControlPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadRoles = async () => {
      try {
        setLoading(true);
        const roles = await fetchRoles();
        setAvailableRoles(roles);
      } catch (error) {
        console.error('Failed to load roles:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRoles();
  }, []);

  return (
    <div className="space-y-6">
      {/* <PageHeader
        title="Access Control"
        subtitle="Manage roles and permissions"
        actions={
          <div className="flex space-x-2">
            <Button className="flex items-center">
              <Key className="mr-2 h-4 w-4" />
              Create New Role
            </Button>
            <Button
              className="flex items-center bg-blue-600 text-white"
              onClick={() => navigate('/roles')}
            >
              Configure
            </Button>
          </div> */}
        {/* }
      /> */}

      {/* Access Control Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Role Security */}
        <div className="rounded-lg bg-white p-6 shadow-md hover:shadow-lg transition-shadow">
          <div className="mb-4 flex items-center justify-center">
            <div className="rounded-full bg-blue-50 p-4">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h3 className="mb-2 text-center text-xl font-semibold text-gray-900">Role Security</h3>
          <p className="text-center text-sm text-gray-600">
            Configure security access for different roles across all modules.
          </p>
          <div className="mt-4 flex justify-center">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/roles')}
            >
              Configure
            </Button>
          </div>
        </div>

        {/* Email Sync Preferences */}
        <div className="rounded-lg bg-white p-6 shadow-md hover:shadow-lg transition-shadow">
          <div className="mb-4 flex items-center justify-center">
            <div className="rounded-full bg-blue-50 p-4">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h3 className="mb-2 text-center text-xl font-semibold text-gray-900">Email Sync Preferences</h3>
          <p className="text-center text-sm text-gray-600">
            Configure email sync preferences for different roles and designations.
          </p>
          <div className="mt-4 flex justify-center">
            <Button variant="outline" size="sm">Configure</Button>
          </div>
        </div>

        {/* Security Access */}
        <div className="rounded-lg bg-white p-6 shadow-md hover:shadow-lg transition-shadow">
          <div className="mb-4 flex items-center justify-center">
            <div className="rounded-full bg-blue-50 p-4">
              <Lock className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h3 className="mb-2 text-center text-xl font-semibold text-gray-900">Security Access</h3>
          <p className="text-center text-sm text-gray-600">
            Configure security access for activities, documents, etc.
          </p>
          <div className="mt-4 flex justify-center">
            <Button variant="outline" size="sm">Configure</Button>
          </div>
        </div>

        {/* Home Dashboard Access */}
        <div className="rounded-lg bg-white p-6 shadow-md hover:shadow-lg transition-shadow">
          <div className="mb-4 flex items-center justify-center">
            <div className="rounded-full bg-blue-50 p-4">
              <LayoutDashboard className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h3 className="mb-2 text-center text-xl font-semibold text-gray-900">Home Dashboard Access</h3>
          <p className="text-center text-sm text-gray-600">
            Configure home dashboard access and widgets for different roles, designations, and modules.
          </p>
          <div className="mt-4 flex justify-center">
            <Button variant="outline" size="sm">Configure</Button>
          </div>
        </div>
      </div>

      {/* Audit Log */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Recent Access Changes</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-gray-500" />
              <div className="ml-3">
                <p className="text-sm font-medium">Permission modified</p>
                <p className="text-xs text-gray-500">Added 'Manage Reports' to Admin role</p>
              </div>
            </div>
            <span className="text-sm text-gray-500">1 day ago</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-gray-500" />
              <div className="ml-3">
                <p className="text-sm font-medium">New role created</p>
                <p className="text-xs text-gray-500">Created 'Team Lead' role</p>
              </div>
            </div>
            <span className="text-sm text-gray-500">3 days ago</span>
          </div>
        </div>
      </div>

      <RoleSecurityModal 
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
      />
    </div>
  );
};

export default AccessControlPage;

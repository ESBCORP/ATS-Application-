// Enhanced RolesPage.tsx with Delete Role functionality
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle2, Key, Users, Calendar, Search, Filter, ArrowRight } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/ui/Button';
import DeleteModal from '../../components/modals/DeleteModal';

import { fetchPermissions } from '../../services/permissionsService';
import { fetchRoles as fetchRolesAPI, createRole, deleteRole, Role } from '../../services/permissionsService';


const RolesPage: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');
  const [creatingRole, setCreatingRole] = useState(false);
  const navigate = useNavigate();
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const data = await fetchRolesAPI();
      setRoles(data);
    } catch (err: any) {
      setError('Failed to load roles. Please check your network or API.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = async () => {
    if (!newRoleName.trim()) {
      alert('Role name is required.');
      return;
    }

    setCreatingRole(true);
    try {
      await createRole(newRoleName, newRoleDescription);
      setShowModal(false);
      setNewRoleName('');
      setNewRoleDescription('');
      fetchRoles();
    } catch (error) {
      alert('Failed to create role. Please try again.');
    } finally {
      setCreatingRole(false);
    }
  };

  // Enhanced navigation handler with role validation
  const handleRoleClick = async (role: Role) => {
    try {
      const data = await fetchPermissions(); // returns Resource[]
      navigate('/role-security', {
        state: {
          role: role.name,
          roleId: role.id,
          permissions: data
        }
      });
    } catch (error) {
      console.error('Error fetching permissions:', error);
      alert('Failed to fetch permissions for this role.');
    }
  };

  // Handle delete role action
  const handleDeleteRole = (role: Role, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card/row click
    setRoleToDelete(role);
    setShowDeleteModal(true);
  };

  // Handle right-click for table rows
  const handleRowRightClick = (role: Role, e: React.MouseEvent) => {
    e.preventDefault();
    if (!role.is_default) { // Only allow deletion of non-default roles
      setRoleToDelete(role);
      setShowDeleteModal(true);
    }
  };

  const filteredRoles = roles.filter((role) => {
    const matchesSearch =
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedRole === 'All' || role.name === selectedRole;
    return matchesSearch && matchesFilter;
  });

  const CardView = () => (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {filteredRoles.map((role) => (
        <div
          key={role.id}
          onClick={() => handleRoleClick(role)}
          onContextMenu={(e) => handleRowRightClick(role, e)}
          className="cursor-pointer group relative overflow-hidden rounded-lg bg-white p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-blue-300"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="rounded-lg bg-blue-500 p-3 group-hover:bg-blue-600 transition-colors">
              <UserCircle2 className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center gap-2">
              {role.is_default && (
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                  Default
                </span>
              )}
              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
            </div>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {role.name}
          </h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {role.description || 'No description provided'}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {new Date(role.created_at).toLocaleDateString()}
            </div>
            <div className="flex items-center">
              <Users className="h-3 w-3 mr-1" />
              ID: {role.id}
            </div>
          </div>
          <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-10 transition-opacity"></div>
        </div>
      ))}
    </div>
  );

  const TableView = () => (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredRoles.map((role) => (
            <tr
              key={role.id}
              onClick={() => handleRoleClick(role)}
              onContextMenu={(e) => handleRowRightClick(role, e)}
              className="hover:bg-gray-50 transition-colors cursor-pointer group"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-8 w-8">
                    <div className="rounded-full bg-blue-500 p-2 group-hover:bg-blue-600 transition-colors">
                      <UserCircle2 className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {role.name}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900 max-w-xs truncate">
                  {role.description || 'No description provided'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {role.is_default ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Default
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Custom
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(role.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center">
                  <span className="text-blue-600 group-hover:text-blue-800 font-medium">
                    Manage Permissions
                  </span>
                  <ArrowRight className="h-4 w-4 ml-1 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Role Management"
        subtitle={`Manage system roles and permissions (${filteredRoles.length} roles)`}
        actions={
          <Button className="flex items-center bg-blue-500 hover:bg-blue-600" onClick={() => setShowModal(true)}>
            <Key className="mr-2 h-4 w-4" />
            Create New Role
          </Button>
        }
      />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full sm:max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Filter className="h-4 w-4 text-gray-400 mr-2" />
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="All">All Roles</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.name}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center border border-gray-300 rounded-md p-1">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  viewMode === 'cards' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Cards
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  viewMode === 'table' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Table
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Loading roles...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-800">{error}</div>
        </div>
      ) : filteredRoles.length === 0 ? (
        <div className="text-center py-12">
          <UserCircle2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No roles found</h3>
          <p className="text-gray-500">
            {searchTerm || selectedRole !== 'All'
              ? 'Try adjusting your search or filter criteria.'
              : 'No roles are available at the moment.'}
          </p>
        </div>
      ) : (
        <div className="pb-6">{viewMode === 'cards' ? <CardView /> : <TableView />}</div>
      )}

      {/* Create Role Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Create New Role</h2>
            <input
              type="text"
              placeholder="Role Name"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <textarea
              placeholder="Role Description"
              value={newRoleDescription}
              onChange={(e) => setNewRoleDescription(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRole}
                disabled={creatingRole}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {creatingRole ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Role Modal */}
      {showDeleteModal && roleToDelete && (
        <DeleteModal
          title="Delete Role"
          message={
            <>
              Are you sure you want to delete role <strong>{roleToDelete.name}</strong>?
              <br />
              <span className="text-sm text-gray-600">
                This action cannot be undone and will remove all permissions associated with this role.
              </span>
            </>
          }
          onCancel={() => {
            setShowDeleteModal(false);
            setRoleToDelete(null);
          }}
          onConfirm={async () => {
            if (!roleToDelete) return false;

            try {
              await deleteRole(roleToDelete.id);
              setRoles(prev => prev.filter(r => r.id !== roleToDelete.id));
              setShowDeleteModal(false);
              setRoleToDelete(null);
              return true;
            } catch (error) {
              console.error('Failed to delete role:', error);
              return false;
            }
          }}
        />
      )}
    </div>
  );
};

export default RolesPage;
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader, Save, CheckCircle } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/ui/Button';
import { 
  fetchPermissions, 
  fetchModules,
  updatePermission, 
  createPermission, 
  fetchRoles, 
  Resource, 
  Permission, 
  Role 
} from '../../services/permissionsService';
import { useAuth } from '../../contexts/AuthContext';

const RoleSecurityPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const selectedRole = location.state?.role || 'Admin';
  
  const [resources, setResources] = useState<Resource[]>([]);
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [allModules, setAllModules] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pendingChanges, setPendingChanges] = useState<Map<string, any>>(new Map());

  useEffect(() => {
    const loadPermissions = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load available roles from API
        const rolesData = await fetchRoles();
        setAvailableRoles(rolesData);

        // Fetch all modules from API
        const modulesData = await fetchModules();
        setAllModules(modulesData);

        // Fetch permissions data
        const permissionsResponse = await fetchPermissions();
        
        // Use the modules from API, ensuring we have the permission data
        const modulesWithPermissions = modulesData.map(module => {
          const moduleWithPermissions = permissionsResponse.data.find(r => r.id === module.id);
          return moduleWithPermissions || {
            ...module,
            role_permissions: []
          };
        });
        
        setResources(modulesWithPermissions);
      } catch (err) {
        setError('Failed to load permissions. Please try again.');
        console.error('Error loading permissions:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPermissions();
  }, [selectedRole, user]);

  const getPermissionForRole = (resource: Resource, role: string): Permission | undefined => {
    return resource.role_permissions.find((p) => p.role_name === role);
  };

  const getPermissionValue = (resource: Resource, role: string, field: string): boolean => {
    const permission = getPermissionForRole(resource, role);
    
    if (!permission) {
      return false;
    }
    
    return permission[field as keyof Permission] as boolean || false;
  };

  const handlePermissionChange = (resourceId: number, resourceName: string, field: string, value: boolean) => {
    const key = `${resourceId}-${selectedRole}-${field}`;
    
    setPendingChanges(prev => {
      const newChanges = new Map(prev);
      newChanges.set(key, { resourceId, resourceName, field, value, role: selectedRole });
      return newChanges;
    });

    // Update local state for immediate UI feedback
    setResources(prev => prev.map(resource => {
      if (resource.id === resourceId) {
        const existingPermission = getPermissionForRole(resource, selectedRole);
        if (existingPermission) {
          // Update existing permission
          return {
            ...resource,
            role_permissions: resource.role_permissions.map(p => 
              p.role_name === selectedRole 
                ? { ...p, [field]: value }
                : p
            )
          };
        } else {
          // Create new permission entry for this role
          const roleData = availableRoles.find(r => r.name === selectedRole);
          const newPermission: Permission = {
            id: -1, // Temporary ID
            resource_id: resourceId,
            role_id: roleData?.id || 1,
            role_name: selectedRole,
            can_read: field === 'can_read' ? value : false,
            can_create: field === 'can_create' ? value : false,
            can_update: field === 'can_update' ? value : false,
            can_delete: field === 'can_delete' ? value : false,
          };
          return {
            ...resource,
            role_permissions: [...resource.role_permissions, newPermission]
          };
        }
      }
      return resource;
    }));
  };

  const handleSaveChanges = async () => {
    if (pendingChanges.size === 0) {
      setSuccess('No changes to save.');
      setTimeout(() => setSuccess(null), 3000);
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      // Group changes by resource and role to build complete permission objects
      const changesByPermission = new Map<string, { permission: Permission | null, changes: Map<string, boolean> }>();
      
      pendingChanges.forEach((change, key) => {
        const permissionKey = `${change.resourceId}-${change.role}`;
        if (!changesByPermission.has(permissionKey)) {
          const resource = resources.find(r => r.id === change.resourceId);
          const existingPermission = resource ? getPermissionForRole(resource, change.role) : null;
          changesByPermission.set(permissionKey, {
            permission: existingPermission,
            changes: new Map()
          });
        }
        changesByPermission.get(permissionKey)!.changes.set(change.field, change.value);
      });

      // Process each permission's changes
      for (const [permissionKey, { permission, changes }] of changesByPermission) {
        const [resourceIdStr, role] = permissionKey.split('-');
        const resourceId = parseInt(resourceIdStr);

        // Build the complete permission data
        const permissionData = {
          can_read: permission?.can_read || false,
          can_create: permission?.can_create || false,
          can_update: permission?.can_update || false,
          can_delete: permission?.can_delete || false
        };

        // Apply the changes
        changes.forEach((value, field) => {
          permissionData[field as keyof typeof permissionData] = value;
        });

        if (permission && permission.id > 0) {
          // Update existing permission
          await updatePermission(permission.id, permissionData);
        } else {
          // Create new permission
          const roleData = availableRoles.find((r) => r.name === role);
          if (!roleData) {
            console.error("Missing role data for role:", role);
            continue;
          }
          await createPermission(resourceId, roleData.id, permissionData);
        }
      }

      // Clear pending changes and reload data
      setPendingChanges(new Map());
      setSuccess('Permissions updated successfully!');
      
      // Reload permissions to get updated data
      const updatedModulesData = await fetchModules();
      setAllModules(updatedModulesData);

      const updatedPermissionsResponse = await fetchPermissions();
      const updatedModulesWithPermissions = updatedModulesData.map(module => {
        const moduleWithPermissions = updatedPermissionsResponse.data.find(r => r.id === module.id);
        return moduleWithPermissions || {
          ...module,
          role_permissions: []
        };
      });
      setResources(updatedModulesWithPermissions);

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error saving permissions:', err);
      setError('Failed to save permissions. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader
          title={`Configure ${selectedRole} Permissions`}
          subtitle="Set access levels for each module"
          actions={
            <Button variant="outline" onClick={() => navigate('/access')}>
              Back to Access Control
            </Button>
          }
        />
        
        <div className="rounded-md bg-red-50 p-4 border border-red-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Configure ${selectedRole} Permissions`}
        subtitle="Set access levels for each module"
        actions={
          <div className="space-x-2">
            <Button variant="outline" onClick={() => navigate('/roles')}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveChanges}
              isLoading={saving}
              disabled={pendingChanges.size === 0}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Changes {pendingChanges.size > 0 && `(${pendingChanges.size})`}
            </Button>
          </div>
        }
      />

      {success && (
        <div className="rounded-md bg-green-50 p-4 border border-green-200">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">Success</p>
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Permissions for {selectedRole} Role
          </h3>
          <p className="text-sm text-gray-600">
            Configure what actions this role can perform on each module.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-4 text-left font-semibold text-gray-900 w-1/5">Modules</th>
                <th className="pb-4 text-center font-semibold text-gray-900 w-1/5">View</th>
                <th className="pb-4 text-center font-semibold text-gray-900 w-1/5">Post</th>
                <th className="pb-4 text-center font-semibold text-gray-900 w-1/5">Edit</th>
                <th className="pb-4 text-center font-semibold text-gray-900 w-1/5">Delete</th>
              </tr>
            </thead>
            
            <tbody>
              {resources.map((resource) => {
                const renderDropdown = (field: 'can_read' | 'can_create' | 'can_update' | 'can_delete') => {
                  const key = `${resource.id}-${selectedRole}-${field}`;
                  const pendingChange = pendingChanges.get(key);
                  
                  const currentValue = pendingChange?.value !== undefined 
                    ? pendingChange.value 
                    : getPermissionValue(resource, selectedRole, field);

                  return (
                    <select
                      className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={currentValue ? 'Yes' : 'No'}
                      onChange={(e) =>
                        handlePermissionChange(resource.id, resource.name, field, e.target.value === 'Yes')
                      }
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  );
                };

                return (
                  <tr key={resource.id} className="border-b border-gray-100">
                    <td className="py-6">
                      <div>
                        <p className="font-medium text-gray-900 capitalize">
                          {resource.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {resource.description}
                        </p>
                      </div>
                    </td>
                    <td className="py-6 text-center">{renderDropdown('can_read')}</td>
                    <td className="py-6 text-center">{renderDropdown('can_create')}</td>
                    <td className="py-6 text-center">{renderDropdown('can_update')}</td>
                    <td className="py-6 text-center">{renderDropdown('can_delete')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RoleSecurityPage;
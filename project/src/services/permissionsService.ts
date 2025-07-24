import api from './api';
import axios from 'axios';

// ----------- Interfaces ------------
export interface Permission {
  id: number;
  role_id: number;
  resource_id: number;
  role_name: string;
  can_read: boolean;
  can_create: boolean;
  can_update: boolean;
  can_delete: boolean;
}

export interface Resource {
  id: number;
  name: string;
  description: string;
  role_permissions: Permission[]; // Updated to match your component usage
}

export interface PermissionsResponse {
  data: Resource[];
  total: number;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  is_default: boolean;
  created_by: number | null;
  created_at: string;
}

// ----------- Permissions API ------------

// ✅ Fetch all modules/resources
export const fetchModules = async (): Promise<Resource[]> => {
  try {
    const response = await api.get('/permissions/resources/?skip=0&limit=100');
    return response.data;
  } catch (error) {
    console.error('Error fetching modules:', error);
    throw error;
  }
};

// ✅ Fetch all permission resources
export const fetchPermissions = async (): Promise<PermissionsResponse> => {
  try {
    const response = await api.get('/permissions/resources/?skip=0&limit=100');
    return {
      data: response.data,
      total: response.data.length
    };
  } catch (error) {
    console.error('Error fetching permissions:', error);
    throw error;
  }
};

// ✅ Create permission using role_id instead of role string
export const createPermission = async (
  resourceId: number,
  roleId: number,
  permissions: Partial<Permission>
): Promise<Permission> => {
  try {
    const response = await api.post(`/permissions/role-permissions/`, {
      resource_id: resourceId,
      role_id: roleId,
      can_read: permissions.can_read || false,
      can_create: permissions.can_create || false,
      can_update: permissions.can_update || false,
      can_delete: permissions.can_delete || false
    });
    return response.data;
  } catch (error) {
    console.error('Error creating permission:', error);
    throw error;
  }
};

// ✅ Update permission using the correct API endpoint
export const updatePermission = async (
  permissionId: number,
  updates: Partial<Permission>
): Promise<Permission> => {
  try {
    const response = await api.put(`/permissions/role-permissions/${permissionId}`, {
      can_read: updates.can_read || false,
      can_create: updates.can_create || false,
      can_update: updates.can_update || false,
      can_delete: updates.can_delete || false
    });
    return response.data;
  } catch (error) {
    console.error('Error updating permission:', error);
    throw error;
  }
};

// ----------- Roles API ------------

// ✅ Fetch all roles - returns Role objects with id and name
export const fetchRoles = async (): Promise<Role[]> => {
  try {
    const token = localStorage.getItem('auth_token')?.replace('Bearer ', '') || '';
    const response = await axios.get(
      'https://esb-ats-bndke8f0gza5e8d0.eastus2-01.azurewebsites.net/api/roles/',
      {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching roles:', error);
    // Return default roles if API fails
    return [
      { id: 1, name: 'SuperAdmin', description: 'Super Administrator', is_default: false, created_by: null, created_at: '' },
      { id: 2, name: 'Admin', description: 'Administrator', is_default: false, created_by: null, created_at: '' },
      { id: 3, name: 'Employee', description: 'Employee', is_default: true, created_by: null, created_at: '' }
    ];
  }
};

// ✅ Create a new role
export const createRole = async (name: string, description: string): Promise<void> => {
  try {
    const token = localStorage.getItem('auth_token')?.replace('Bearer ', '') || '';
    await axios.post(
      'https://esb-ats-bndke8f0gza5e8d0.eastus2-01.azurewebsites.net/api/roles/',
      { name, description },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    );
  } catch (error) {
    console.error('Error creating role:', error);
    throw error;
  }
};

// ✅ Delete a role
export const deleteRole = async (roleId: number): Promise<void> => {
  try {
    const token = localStorage.getItem('auth_token')?.replace('Bearer ', '') || '';
    await axios.delete(
      `https://esb-ats-bndke8f0gza5e8d0.eastus2-01.azurewebsites.net/api/roles/${roleId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  } catch (error) {
    console.error('Error deleting role:', error);
    throw error;
  }
};

// ✅ Update a role
export const updateRole = async (roleId: number, name: string, description: string): Promise<void> => {
  try {
    const token = localStorage.getItem('auth_token')?.replace('Bearer ', '') || '';
    await axios.put(
      `https://esb-ats-bndke8f0gza5e8d0.eastus2-01.azurewebsites.net/api/roles/${roleId}`,
      { name, description },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    );
  } catch (error) {
    console.error('Error updating role:', error);
    throw error;
  }
};

export const getResources = async () => {
  const response = await api.get('/permissions/resources/?skip=0&limit=100');
  return response.data; // This is an array
};
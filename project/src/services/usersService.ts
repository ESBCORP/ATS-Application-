import api from './api';
import axios from 'axios';
import { User } from '../types';

const AUTH_API_BASE_URL = 'https://esb-ats-bndke8f0gza5e8d0.eastus2-01.azurewebsites.net';

interface UsersResponse {
  data: User[];
  total: number;
}

interface UserProfile {
  id: number;
  username: string;
  email: string;
  full_name: string;
  is_active: boolean;
  role_name: string;
  phone: string | null;
  company: string | null;
  department: string | null;
  location: string | null;
  bio: string | null;
  role_id:number;
}
export interface Role {
  id: number;
  name: string;
  description: string;
}
export const getUserById = (id: string) => axios.get<User>(`/api/accesscontrol/${id}`);


export const fetchRoles = async (): Promise<Role[]> => {
  const token = localStorage.getItem('auth_token');
  console.log('Token in fetchRoles:', token);
//   const response = await axios.get(`https://esb-ats-bndke8f0gza5e8d0.eastus2-01.azurewebsites.net/api/roles/`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//       Accept: 'application/json',
//     },
//   });
//   return response.data;
// };
try {
    const response = await axios.get(
      'https://esb-ats-bndke8f0gza5e8d0.eastus2-01.azurewebsites.net/api/roles/',
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      }
    );

    console.log('✅ Roles fetched:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ fetchRoles failed', {
      url: 'https://esb-ats-bndke8f0gza5e8d0.eastus2-01.azurewebsites.net/api/roles/',
      status: error?.response?.status,
      message: error?.response?.data,
    });
    throw error;
  }
};

export const fetchUserProfile = async (): Promise<UserProfile> => {
  const response = await api.get('/users/me');
  return response.data;
};

export const updateUserProfile = async (profileData: Partial<UserProfile>): Promise<UserProfile> => {
  try {
    // First get the current user profile to get all required fields
    const currentProfile = await fetchUserProfile();
    
    // Prepare the complete payload with all required fields
    const updatePayload = {
      username: currentProfile.username, // Keep existing username
      email: profileData.email || currentProfile.email,
      full_name: profileData.full_name || currentProfile.full_name,
      role_name: currentProfile.role_name, // Keep existing role_name
      phone: profileData.phone || currentProfile.phone || "",
      company: profileData.company || currentProfile.company || "",
      department: profileData.department || currentProfile.department || "",
      location: profileData.location || currentProfile.location || "",
      bio: profileData.bio || currentProfile.bio || "",
      is_active: currentProfile.is_active ,
      role_id: profileData.role_id ?? currentProfile.role_id,
       

      //role_id:currentProfile.role_id// Keep existing active status
    };

    // Use the correct endpoint format based on your API testing
    const response = await api.put(`/accesscontrol/${currentProfile.id}`, updatePayload);
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw new Error('Failed to save profile changes');
  }
};

export const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  const token = localStorage.getItem('auth_token');
  
  try {
    await axios.post(
      `${AUTH_API_BASE_URL}/auth/reset-password`,
      {
        current_password: currentPassword,
        new_password: newPassword
      },
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': token || '',
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};

export const fetchUsers = async (): Promise<UsersResponse> => {
  try {
    const response = await api.get('https://esb-ats-bndke8f0gza5e8d0.eastus2-01.azurewebsites.net/api/accesscontrol/');
    
    return {
      data: response.data.map((user: any) => ({
        id: user.id.toString(),
        username: user.username,
        full_name: user.full_name || user.username,
        email: user.email,
        phone: user.phone || '',
        avatar: `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000)}/pexels-photo.jpeg?auto=compress&cs=tinysrgb&w=150`,
        role_name: user.role_name || 'Employee',
        status: user.is_active ? 'Active' : 'Inactive',
        company:user.company || ''
      })),
      total: response.data.length
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    
    // Return empty data instead of throwing
    return {
      data: [],
      total: 0
    };
  }
};

interface CreateUserData extends Partial<User> {
  password?: string;
}

export const createUser = async (userData: CreateUserData): Promise<User> => {
  const token = localStorage.getItem('auth_token');
  
  if (!userData.username || !userData.email || !userData.full_name || !userData.password) {
    throw new Error('All fields are required');
  }

  if (userData.password.length < 8) {
    throw new Error('Password must be at least  8 characters long');
  }

  if (!userData.email.includes('@')) {
    throw new Error('Please enter a valid email address');
  }
//  const roleMap: Record<'SuperAdmin' | 'Admin' | 'Employee', number> = {
//     SuperAdmin: 1,
//     Admin: 2,
//     Employee: 3,
//   };

  //const roleKey =(userData.role_name ?? 'Employee') as keyof typeof roleMap;// userData.role_name ?? 'Employee';

  const payload = {
    username: userData.username,
    email: userData.email,
    full_name: userData.full_name,
    password: userData.password,
    role_id: userData.role_id,

    phone: userData.phone ?? '',
    company: userData.company ?? '',
    department: userData.department ?? '',
    location: userData.location ?? '',
    bio: userData.bio ?? '',

  };

  console.log("📤 Payload being sent:", payload);

  try {
    const response = await axios.post(`https://esb-ats-bndke8f0gza5e8d0.eastus2-01.azurewebsites.net/auth/signup`,payload,{
      // username: userData.username,
      // email: userData.email,
      // full_name: userData.full_name,
      // role_name: userData.role_name || 'Employee',
      // password: userData.password
     
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
        'Accept': 'application/json'
      }
    });

    if (response.data?.detail) {
      throw new Error(response.data.detail);
    }
    
    return {
      id: response.data.id.toString(),
      username: response.data.username,
      full_name: response.data.full_name || response.data.username,
      email: response.data.email,
      phone:response.data.phone || '',
      avatar: `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000)}/pexels-photo.jpeg?auto=compress&cs=tinysrgb&w=150`,
      role_name: response.data.role_name|| 'Employee',
      status: response.data.is_active ? 'Active' : 'Inactive',
      company: response.data.company ?? '',
      department: response.data.department ?? '',
      location: response.data.location ?? '',
      bio: response.data.bio ?? '',
      role_id:response.data.role_id??''
    };
  }catch (error) {
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;
      console.error("🛑 Backend error:", responseData);

      const detail = responseData?.detail || responseData?.message || responseData;
      const message = typeof detail === 'string' ? detail : JSON.stringify(detail);
      throw new Error(message);
    }
    throw error;
  }
};
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       if (error.response?.status === 400) {
//         const detail = error.response.data?.detail;
//         if (typeof detail === 'string' && detail.toLowerCase().includes('already exists')) {
//           throw new Error('Username or email already exists. Please try different credentials.');
//         }
//         throw new Error(detail || 'Failed to create user');
//       }
//       throw new Error(error.response?.data?.detail || 'Failed to create user');
//     }
//     throw error;
//   }
// };

export const updateUser = async (id: string, userData: Partial<User>): Promise<User> => {
  const response = await api.put(`https://esb-ats-bndke8f0gza5e8d0.eastus2-01.azurewebsites.net/api/accesscontrol/${id}`, {
    username: userData.username,
    email: userData.email,
    full_name: userData.full_name,
    phone: userData.phone || "",
    company:userData.company,
    role_name: userData.role_name,
    is_active: userData.status === 'Active',
    role_id:userData.role_id ?? 3
  });
  
  return {
    id: response.data.id.toString(),
    username: response.data.username,
    full_name: response.data.full_name || response.data.username,
    email: response.data.email,
    phone: response.data.phone || '',
    avatar: `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000)}/pexels-photo.jpeg?auto=compress&cs=tinysrgb&w=150`,
    role_name: response.data.role_name || 'Employee',
    status: response.data.is_active ? 'Active' : 'Inactive',
    company: response.data.company,
  department: response.data.department ?? '',
  location: response.data.location ?? '',
  bio: response.data.bio ?? '',
  role_id:response.data.role_id??''
  };
};

export const activateUser = async (id: string): Promise<void> => {
  await api.patch(`/accesscontrol/${id}/activate`);
};

export const deactivateUser = async (id: string): Promise<void> => {
  await api.patch(`/accesscontrol/${id}/deactivate`);
};

export const deleteUser = async (id: string): Promise<void> => {
  try {
    await api.delete(`https://esb-ats-bndke8f0gza5e8d0.eastus2-01.azurewebsites.net/api/accesscontrol/${id}`);
  } catch (error) {
    console.error(`Failed to delete user with ID ${id}:`, error);
    throw new Error('Failed to delete user');
  }
};
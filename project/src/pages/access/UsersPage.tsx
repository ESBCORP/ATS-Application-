import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Search, Loader, Lock, AlertCircle, UserCheck, UserX, Users } from 'lucide-react';
import {
  fetchUsers,
  createUser,
  updateUser,
  activateUser,
  deactivateUser,
  deleteUser,
  fetchUserProfile,
} from '../../services/usersService';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Status from '../../components/ui/Status';
import UserFormModal from '../../components/modals/UserFormModal';
import DeleteModal from '../../components/modals/DeleteModal';
import { User } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
//import { fetchRoles } from '../../services/usersService';
import { fetchRoles } from '../../services/permissionsService';
//import { fetchUserProfile } from '../../services/usersService';

const UsersPage: React.FC = () => {
  const navigate = useNavigate();
  const { user,refreshUser} = useAuth();
  const { status } = useParams<{ status?: string }>();
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
 // const [selectedUser, setSelectedUser] = useState<User | null>(null); // ✅

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [roles, setRoles] = useState<{ id: number; name: string }[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
  const stored = localStorage.getItem('current_user');
  return stored ? JSON.parse(stored) : null;
});


  
// const roleMap: Record<string, number> = {
//     SuperAdmin: 1,
//     Admin: 2,
//     Employee: 3,
//   };
  // Get current active tab
  const activeTab = status || 'all';

  const canAccessUserManagement = () => {
    // SuperAdmin and Admin can always access user management
   return user?.role_name=== 'SuperAdmin' || user?.role_name=== 'Admin';
   //return true;
  };

  const canDeleteUser = (target: User | null) =>
    (user?.role_name === 'SuperAdmin' || user?.role_name=== 'Admin')// && target?.role_name== 'SuperAdmin';

  const handleDeleteUser = async (): Promise<boolean> => {
    if (!userToDelete || !canDeleteUser(userToDelete)) return false;
    try {
      await deleteUser(userToDelete.id);
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      setShowDeleteModal(false);
      setUserToDelete(null);
      return true;
    } catch (err) {
      console.error('Failed to delete user:', err);
      return false;
    }
  };
  


  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchUsers();
      console.log('Fetched users:', response.data);
      setUsers(response.data);
    } catch (err) {
      setError('Failed to load users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  

  // useEffect(() => {
  //   if (!canAccessUserManagement()) {
  //     setLoading(false);
  //     return;
  //   }
  //   loadUsers();
  // }, [user]);
  useEffect(() => {
  if (!canAccessUserManagement()) {
    setLoading(false);
    return;
  }
  const loadAllData = async () => {
    try {
      const roleData = await fetchRoles();
      const rolesList = roleData.map((r: any) => ({ id: r.id, name: r.name }));
      setRoles(rolesList);

      const userData = await fetchUsers();
      const mappedUsers = userData.data.map((user: User) => {
        const matchedRole = rolesList.find(r => r.name === user.role_name);
        return {
          ...user,
          role_id: matchedRole?.id ?? undefined
        };
      });

      setUsers(mappedUsers);
    } catch (err) {
      console.error('Failed to fetch roles or users:', err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Then call it
  loadAllData();
}, [user]);

//   const loadAllData = async () => {
//     await loadUsers();
//     try {
//       const roleData = await fetchRoles();
//       setRoles(roleData.map((r: any) => ({ id: r.id, name: r.name })));
//     } catch (err) {
//       console.error('Failed to fetch roles', err);
//     }
//   };

//   loadAllData();
// }, [user]);


  // Calculate counts for each tab
  const allUsersCount = users.length;
  const activeUsersCount = users.filter(u => u.status === 'Active').length;
  const inactiveUsersCount = users.filter(u => u.status === 'Inactive').length;

  // Tab configuration
  const tabs = [
    {
      id: 'all',
      label: 'All Users',
      icon: Users,
      count: allUsersCount,
      path: '/access/users'
    },
    {
      id: 'active',
      label: 'Active Users',
      icon: UserCheck,
      count: activeUsersCount,
      path: '/access/users/active'
    },
    {
      id: 'inactive', 
      label: 'Inactive Users',
      icon: UserX,
      count: inactiveUsersCount,
      path: '/access/users/inactive'
    }
  ];

  // Handle tab change
  const handleTabChange = (tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      navigate(tab.path);
    }
  };

  if (!canAccessUserManagement()) {
    return (
      <div className="space-y-6">
        <PageHeader 
          title="User Management" 
          subtitle="Manage user access and permissions" 
        />
        <div className="rounded-md bg-red-50 p-6 border border-red-200">
          <div className="flex items-center">
            <Lock className="h-8 w-8 text-red-400" />
            <div className="ml-4">
              <h3 className="text-lg font-medium text-red-800">Access Denied</h3>
              <p className="text-sm text-red-700 mt-2">
                You do not have the required permissions to configure Employee role permissions.
              </p>
              <p className="text-sm text-red-600 mt-1">
                Only Super Admins and Admins can modify Employee permissions.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Filter users based on active tab
  let filteredUsers = [...users];
  if (activeTab === 'active') {
    filteredUsers = filteredUsers.filter((user) => user.status === 'Active');
  } else if (activeTab === 'inactive') {
    filteredUsers = filteredUsers.filter((user) => user.status === 'Inactive');
  }

  // Apply search filter
  if (searchTerm) {
    const searchLower = searchTerm.toLowerCase();
    filteredUsers = filteredUsers.filter(
      (user) =>
        user.full_name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.username.toLowerCase().includes(searchLower) ||
        user.role_name.toLowerCase().includes(searchLower) ||
        user.phone?.toLowerCase().includes(searchLower)
    );
  }

  const handleAddUser = async (userData: Partial<User>) => {
    try {
      const payload = {
        ...userData,
        role_id: userData.role_name??'',
        phone: userData.phone ?? '',
        company: userData.company ?? '',
        department: userData.department ?? '',
        location: userData.location ?? '',
        bio: userData.bio ?? '',
      };
      const newUser = await createUser(userData);
      setUsers((prev) => [...prev, newUser]);
      setShowUserModal(false);
    } catch (err) {
      console.error('Failed to create user:', err);
      throw err;
    }
  };

  const handleEditUser = async (userData: Partial<User>) => {
    if (!selectedUser?.id) return;
    try {
      const updatedUser = await updateUser(selectedUser.id, userData);
      setUsers((prev) =>
        prev.map((u) => (u.id === selectedUser.id ? updatedUser : u))
      );

      if (updatedUser.id === user?.id) {
      await refreshUser();
    }
      setShowUserModal(false);//
      setSelectedUser(updatedUser);//
    } catch (err) {
      console.error('Failed to update user:', err);
      throw err;
    }
  };

  

  const handleToggleStatus = async (userId: string, isActive: boolean) => {
    try {
      setActionInProgress(userId);
      isActive
        ? await deactivateUser(userId)
        : await activateUser(userId);
      await loadUsers();
    } catch (err) {
      console.error('Failed to update user status:', err);
    } finally {
      setActionInProgress(null);
    }
  };

  // const getInitials = (full_name: string) =>
  //   full_name
  //     .split(' ')
  //     .map((part) => part[0])
  //     .join('')
  //     .toUpperCase()
  //     .slice(0, 2);



  // const getRandomColor = (full_name: string) => {
  //   const colors = [
  //     'bg-blue-500',
  //     'bg-teal-500',
  //     'bg-green-500',
  //     'bg-yellow-500',
  //     'bg-red-500',
  //     'bg-purple-500',
  //     'bg-pink-500',
  //   ];
  //   const index = full_name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  //   return colors[index % colors.length];
  // };
  const getInitials = (name?: string | null): string => {
  if (!name || typeof name !== 'string') return 'U';

  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getRandomColor = (name?: string | null): string => {
  if (!name || typeof name !== 'string') return 'bg-gray-400';

  const colors = [
    'bg-blue-500',
    'bg-teal-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-purple-500',
    'bg-pink-500',
  ];

  const hash = name
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  return colors[hash % colors.length];
};




  const columns = [
    {
      header: 'User',
      accessor: (user: User) => {
        const displayName = user.full_name || user.username || 'User';
        return(
        <div className="flex items-center">
          <div
            className={`h-8 w-8 rounded-full flex items-center justify-center text-white font-medium ${getRandomColor(
              user.full_name
            )}`}
          >
            {getInitials(displayName)}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
            <p className="text-xs text-gray-500">{user.username}</p>
          </div>
        </div>
        )
      },
    },
    { header: 'Email', accessor: 'email' },
    { header: 'Phone', accessor: 'phone' },
    {
      header: 'Role',
      accessor: (user: User) => (
        <span
          className={`inline-flex rounded-full px-2 text-xs font-semibold ${
            user.role_name === 'SuperAdmin'
              ? 'bg-purple-100 text-purple-800'
              : user.role_name === 'Admin'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {user.role_name}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: (user: User) => <Status status={user.status} />,
    },
    {
      header: 'Actions',
      accessor: (user: User) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedUser(user);
              setShowUserModal(true);
            }}
          >
            Edit
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="User Management"
        subtitle="Manage user access and permissions"
        actions={
          <Button
            className="flex items-center"
            onClick={() => {
              setSelectedUser(undefined);
              setShowUserModal(true);
            }}
          >
            <Plus className="mr-1 h-4 w-4" />
            Add User
          </Button>
        }
      />

      {/* Modern Tab Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`
                    flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                    ${isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                  <span
                    className={`
                      inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${isActive
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-600'
                      }
                    `}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors"
              />
            </div>
          </div>

          {/* Content Area */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 font-medium">{error}</div>
            </div>
          ) : (
            <div
              onContextMenu={(e) => {
                const row = (e.target as HTMLElement).closest('tr');
                if (row) {
                  const index = Array.from(row.parentElement?.children || []).indexOf(row);
                  const user = filteredUsers[index];
                  if (user) {
                    e.preventDefault();
                    setUserToDelete(user);
                    setShowDeleteModal(true);
                  }
                }
              }}
            >
              <Table
                columns={columns}
                data={filteredUsers}
                keyExtractor={(user) => user.id}
                emptyMessage={
                  searchTerm 
                    ? "No users found matching your search criteria"
                    : activeTab === 'active'
                    ? "No active users found"
                    : activeTab === 'inactive'
                    ? "No inactive users found"
                    : "No users found"
                }
              />
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <UserFormModal
        isOpen={showUserModal}
        onClose={() => {
          setShowUserModal(false);
          setSelectedUser(undefined);
          //setSelectedUser(null);
        }}
        onSubmit={selectedUser ? handleEditUser : handleAddUser}
        user={selectedUser}
        roles={roles}
      />

      {showDeleteModal && userToDelete && (
        <DeleteModal
          title="Delete User"
          message={
            <>
              Are you sure you want to delete <strong>{userToDelete.full_name}</strong>?
            </>
          }
          onConfirm={handleDeleteUser}
          onCancel={() => {
            setShowDeleteModal(false);
            setUserToDelete(null);
          }}
        />
      )}
    </div>
  );
};

export default UsersPage;
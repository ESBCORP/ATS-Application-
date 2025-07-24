import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Building, MapPin, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { fetchUserProfile, updateUserProfile, changePassword } from '../../services/usersService';

const ProfilePage: React.FC = () => {
  const { user,refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    phone: '',
    company: '',
    department: '',
    location: '',
    bio: ''
  });

  // Password change modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: ''
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const profile = await fetchUserProfile();
        setFormData({
          full_name: profile.full_name || '',
          email: profile.email || '',
          phone: profile.phone || '',
          company: profile.company || '',
          department: profile.department || '',
          location: profile.location || '',
          bio: profile.bio || ''
        });
      } catch (err) {
        setError('Failed to load profile data');
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRandomColor = (name: string) => {
    const colors = [
      'bg-blue-500',
      'bg-teal-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-purple-500',
      'bg-pink-500'
    ];
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      await updateUserProfile({
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        department: formData.department,
        location: formData.location,
        bio: formData.bio,
        role_id:user?.role_id
      });
      await refreshUser();

      setIsEditing(false);
    } catch (err) {
      setError('Failed to save profile changes');
      console.error('Error saving profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    try {
      setChangingPassword(true);
      setPasswordError(null);
      setPasswordSuccess(null);

      // Validate password
      if (!passwordData.current_password || !passwordData.new_password) {
        setPasswordError('Both current and new password are required');
        return;
      }

      if (passwordData.new_password.length < 6) {
        setPasswordError('New password must be at least 6 characters long');
        return;
      }

      // Call API to change password
      await changePassword(passwordData.current_password, passwordData.new_password);
      
      setPasswordSuccess('Password changed successfully');
      
      // Reset form and close modal after a delay
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordData({
          current_password: '',
          new_password: ''
        });
        setPasswordSuccess(null);
      }, 2000);
      
    } catch (err: any) {
      console.error('Error changing password:', err);
      setPasswordError(err.response?.data?.detail || 'Failed to change password. Please check your current password and try again.');
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 space-y-6 ">
      <PageHeader
        title="My Profile"
        subtitle="Manage your account settings and preferences"
        actions={
          isEditing ? (
            <div className="space-x-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} isLoading={saving}>
                Save Changes
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )
        }
      />

      {error && (
        <div className="rounded-md bg-red-50 dark:bg-red-900 p-4 text-red-800 dark:text-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile Overview */}
        <div className="lg:col-span-1">
          <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-md">
            <div className="text-center">
              <div className="relative mx-auto h-32 w-32">
                <div className={`h-full w-full rounded-full flex items-center justify-center text-3xl font-semibold text-white ${getRandomColor(user?.full_name || 'User')}`}>
                  {getInitials(user?.full_name || 'User')}
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 rounded-full bg-blue-600 p-2 text-white hover:bg-blue-700  dark:bg-teal-500 dark:hover:bg-teal-600">
                    <User className="h-4 w-4" />
                  </button>
                )}
              </div>
              <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">{user?.full_name}</h2>
              {/* <p className="text-sm text-gray-500 dark:text-gray-400">{user?.role_name}</p> */}
              {user?.role_name && (
  <span
    className={`inline-flex rounded-full px-2 py-0.5 mt-2 text-xs font-semibold ${
      user.role_name === 'SuperAdmin'
        ? 'bg-purple-100 text-purple-800'
        : user.role_name === 'Admin'
        ? 'bg-blue-100 text-blue-800'
        : 'bg-gray-100 text-gray-800'
    }`}
  >
    {user?.role_name}
  </span>
)}

            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <Mail className="h-5 w-5" />
                <span className="ml-2 text-sm">{formData.email}</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <Phone className="h-5 w-5" />
                <span className="ml-2 text-sm">{formData.phone || 'Not set'}</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <Building className="h-5 w-5" />
                <span className="ml-2 text-sm">{formData.company || 'Not set'}</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <MapPin className="h-5 w-5" />
                <span className="ml-2 text-sm">{formData.location || 'Not set'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-md">
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Input
                  label="Full Name"
                  value={formData.full_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  disabled={!isEditing}
                />
                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  disabled={!isEditing}
                />
                <Input
                  label="Phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  disabled={!isEditing}
                />
                <Input
                  label="Company"
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  disabled={!isEditing}
                />
                <Input
                  label="Department"
                  value={formData.department}
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  disabled={!isEditing}
                />
                <Input
                  label="Location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Bio
                </label>
                <textarea
                  className="w-full min-h-[100px] rounded-md border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-blue-500  focus:ring-blue-500 dark:focus:border-teal-400  dark:focus:ring-teal-500"
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

  

          {/* Account Settings */}
          <div className="mt-6 rounded-lg bg-white dark:bg-gray-800 p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Account Settings</h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Change Password</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Update your password regularly to keep your account secure</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowPasswordModal(true)}
                >
                  Update
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center px-4">
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setShowPasswordModal(false)} />
            
            <div className="relative w-full max-w-md rounded-lg bg-white dark:bg-gray-800 p-6 shadow-xl">
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Change Password</h2>
                  <button 
                    onClick={() => setShowPasswordModal(false)}
                    className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Please enter your current password and a new password
                </p>
              </div>

              {passwordError && (
                <div className="mb-4 rounded-md bg-red-50 dark:bg-red-900/50 p-4 border border-red-200 dark:border-red-800">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-800 dark:text-red-200">{passwordError}</p>
                    </div>
                  </div>
                </div>
              )}

              {passwordSuccess && (
                <div className="mb-4 rounded-md bg-green-50 dark:bg-green-900/50 p-4 border border-green-200 dark:border-green-800">
                  <div className="flex">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">{passwordSuccess}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="relative">
                  <Input
                    label="Current Password"
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.current_password}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, current_password: e.target.value }))}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-8 text-gray-400 hover:text-gray-500"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                <div className="relative">
                  <Input
                    label="New Password"
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.new_password}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, new_password: e.target.value }))}
                    required
                    helperText="Password must be at least 6 characters long"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-8 text-gray-400 hover:text-gray-500"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowPasswordModal(false)}
                  disabled={changingPassword}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handlePasswordChange}
                  isLoading={changingPassword}
                >
                  Update Password
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
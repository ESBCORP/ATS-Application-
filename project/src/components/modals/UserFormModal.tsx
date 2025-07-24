import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (user: Partial<User> & { password?: string }) => void;
  // onSubmit: (userData: Partial<User>) => void;
  user?: User;
  roles:{id:number,name:string}[];
  //currentUserRole: string;
}
interface Role {
  id: number;
  name: string;
}


const UserFormModal: React.FC<UserFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  user,roles
}) => {
  const [formData, setFormData] = useState<Partial<User> & { password?: string }>({
    // username: '',
    // full_name: '',
    // email: '',
    // phone: '',
    // role_name: 'Employee',
    // status: 'Active',
    // password: ''
   username: '',
   full_name: '',
   email: '',
   phone: '',
   company: '',
   department: '',
   location: '',
   bio: '',
   role_name: 'Employee',
   status: 'Active',
   password: '',
   role_id:user?.role_id
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ username?: string; email?: string }>({});

  useEffect(() => {
    
    if (user) {
      setFormData({
       
        username: user.username ?? '',
        full_name: user.full_name ?? '',
        email: user.email ?? '',
        phone: user.phone || '',
        company: user.company ?? '',
        department: user.department ?? '',
        location: user.location ?? '',
        bio: user.bio ?? '',
        role_name: user?.role_name ?? 'Employee',
        status: user.status ?? 'Active',
        password: '',
        role_id:user.role_id
        //role_id: typeof user.role_id === 'number' && user.role_id > 0 ? user.role_id : 1,


      });
      console.log("Editing user company:", user.company);
      console.log("user.role_id on open:", user?.role_id);


    } else {
       //const defaultRoleId = roles.find(r => r.name === 'Employee')?.id ?? roles[0]?.id ?? 1;
      setFormData({
         
        username: '',
        full_name: '',
        email: '',
        phone: '',
        company: '',
        department: '',
        location: '',
        bio: '',
        role_name: 'Employee',
        status: 'Active',
        password: '',
        role_id:undefined
        

        

      });
    }
    setError(null);
    setSuccess(null);
    setFieldErrors({}); 
  }, [user, isOpen]);

  if (!isOpen) return null;


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setSuccess(null);
  setFieldErrors({});
  setIsSubmitting(true);
  console.log("Submitting user data:", formData);

  const payload = {
    username: formData.username,
    full_name: formData.full_name,
    email: formData.email,
    phone: formData.phone ?? '',
    company: formData.company ?? '',
    department: formData.department ?? '',
    location: formData.location ?? '',
    bio: formData.bio ?? '',
    status: formData.status ?? 'Active',
    role_id: formData.role_id,
    password: !user ? formData.password : undefined,
  };

  try {
    await onSubmit(payload);
    setSuccess(user ? 'User updated successfully' : 'User created successfully');
    setTimeout(() => {
      onClose();
    }, 1500);
  } catch (err: any) {
    setIsSubmitting(false);

    const detail = err?.response?.data?.detail || err.message;
    const newErrors: typeof fieldErrors = {};

    if (typeof detail === "string") {
      const message = detail.toLowerCase();
      if (message.includes("username")) newErrors.username = "Username already registered";
      if (message.includes("email")) newErrors.email = "Email already registered";
    }

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      return;
    }

    if (Array.isArray(detail)) {
      setError(detail.map((d) => d.msg).join(', '));
    } else {
      setError(detail || 'Failed to create user');
    }
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="fixed inset-0 bg-black bg-opacity-40 transition-opacity" onClick={onClose} />

        <div className="relative w-full max-w-2xl rounded-xl bg-white dark:bg-[#1f2937] border dark:border-gray-700 p-6 shadow-2xl transition">
          <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
            {user ? 'Edit User' : 'Add New User'}
          </h2>

          {error && (
            <div className="mb-4 rounded-md bg-red-50 dark:bg-red-900 p-4 border border-red-200 dark:border-red-700">
              <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-md bg-green-50 dark:bg-green-900 p-4 border border-green-200 dark:border-green-700">
              <p className="text-sm text-green-800 dark:text-green-300">{success}</p>
            </div>
          )}

  <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <Input
                label="Username"
                value={formData.username??''}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, username: e.target.value }));
                  setFieldErrors(prev => ({ ...prev, username: undefined }));
                }}
                required
                disabled={isSubmitting}
                error={fieldErrors.username}/>
            
            <Input
              label="Full Name"
              value={formData.full_name??''}
              onChange={(e) => setFormData(prev => ({ ...prev,full_name: e.target.value }))}
              required
              disabled={isSubmitting}
            />
            
           <Input
              label="Email"
              type="email"
              value={formData.email??''}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, email: e.target.value }));
                setFieldErrors(prev => ({ ...prev, email: undefined }));
              }}
              required
              disabled={isSubmitting}
              error={fieldErrors.email}
            />

            <Input
              label="Phone"
              type="tel"
              value={formData.phone??''}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              disabled={isSubmitting}
            />
            <Input label="Company" value={formData.company} onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))} 
                disabled={isSubmitting} />
            {/* <Input label="Department" value={formData.department ?? ''} 
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))} 
                  disabled={isSubmitting} /> */}
            {/* <Input label="Location" value={formData.location ?? ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))} 
                  disabled={isSubmitting} /> */}
            {/* <Input label="Bio" value={formData.bio ?? ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))} 
                  disabled={isSubmitting} /> */}


            {!user && (
              <Input
                label="Password"
                type="password"
                value={formData.password??''}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                required={!user}
                minLength={8}
                disabled={isSubmitting}
                helperText="Password must be at least 8 characters long"
              />
              
            )}
          <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Role</label>
             <select
             name="role_id"
              value={formData.role_id?? ''}
              onChange={(e) =>
             setFormData(prev => ({
               ...prev,
             role_id: parseInt(e.target.value), // Store the ID ✅
             }))
              }
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
               required
             disabled={isSubmitting}
                >
           {/* <option value="" disabled>Select a role</option> */}
           {!user && <option value="" disabled>Select a role</option>}


            {[...roles]
             .sort((a, b) => a.name.localeCompare(b.name)) // ✅ Sorted by name
              .map((role) => (
           <option key={role.id} value={role.id}>
              {role.name}
           </option>
          ))}
      </select>
      </div>
         {/* Status Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Status
            </label>

            {/* <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div> */}
        <select
      value={formData.status ?? 'Active'}
      onChange={(e) =>
        setFormData(prev => ({
          ...prev,
          status: e.target.value as User['status'],
        }))
      }
      className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 px-3 py-2"
      required
      disabled={isSubmitting}
    >
      <option value="Active">Active</option>
      <option value="Inactive">Inactive</option>
    </select>
  </div>

        {/* Buttons */}
        <div //className="mt-6 flex justify-end space-x-2">
        className="col-span-2 flex justify-end space-x-2 mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
          >
            {user ? 'Update' : 'Add'} User
          </Button>
        </div>
        
  </form>
  </div>
  </div>
  </div>

      );
};

export default UserFormModal;
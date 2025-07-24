import { User } from '../types';

export const currentUser: User = {
  id: 'USR-001',
  username: 'alexj',
  full_name: 'Alex Johnson',
  email: 'alex.johnson@oorwin.com',
  avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
  role: 'SuperAdmin',
  status: 'Active'
};

export const users: User[] = [
  currentUser,
  {
    id: 'USR-002',
    username: 'sarahj',
    full_name: 'Sarah Johnson',
    email: 'sarah.johnson@oorwin.com',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    role: 'Admin',
    status: 'Active'
  },
  {
    id: 'USR-003',
    username: 'davidm',
    full_name: 'David Miller',
    email: 'david.miller@oorwin.com',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    role: 'Employee',
    status: 'Active'
  },
  {
    id: 'USR-004',
    username: 'jamesw',
    full_name: 'James Wilson',
    email: 'james.wilson@oorwin.com',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    role: 'Employee',
    status: 'Inactive'
  }
];
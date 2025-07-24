import React from 'react';
import Badge from './Badge';

interface StatusProps {
  status: string;
}

const Status: React.FC<StatusProps> = ({ status }) => {
  let variant: 'default' | 'success' | 'warning' | 'danger' | 'info' = 'default';
  
  switch (status) {
    case 'Active':
      variant = 'success';
      break;
    case 'Inactive':
      variant = 'danger';
      break;
    case 'Submitted':
      variant = 'info';
      break;
    case 'Offered':
      variant = 'success';
      break;
    case 'Rejected':
      variant = 'danger';
      break;
    case 'Screening':
      variant = 'warning';
      break;
    case 'Interview':
      variant = 'info';
      break;
    case 'Offer':
      variant = 'success';
      break;
    case 'Hired':
      variant = 'success';
      break;
    default:
      variant = 'default';
  }
  
  return <Badge variant={variant}>{status}</Badge>;
};

export default Status;
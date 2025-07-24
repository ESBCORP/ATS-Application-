import React, { useState } from 'react';
import { Submission } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Status from '../ui/Status';

interface SubmissionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: Submission;
  onSubmit: (submission: Submission) => void;
}

const SubmissionDetailsModal: React.FC<SubmissionDetailsModalProps> = ({
  isOpen,
  onClose,
  submission,
  onSubmit
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    // Submission Details
    availability: submission.availability || '2 Weeks',
    engagement: submission.engagement || 'C2C',
    locationPreference: submission.locationPreference || 'Onsite',
    payType: submission.payType || 'Hourly',
    billType: submission.billType || 'Monthly',
    billRate: submission.billRate || 0,
    payRate: submission.payRate || 0,

    // Candidate Details
    candidateName: `${submission.firstName} ${submission.lastName}`,
    email: submission.email || '',
    mobile: submission.phone || '',
    workAuthorization: submission.workAuthorization || '',
    city: submission.city || '',
    state: submission.state || '',
    submitRate: submission.expectedPay || 0,
    linkedin: submission.linkedinUrl || ''
  });

  if (!isOpen) return null;

  const handleSave = () => {
    const updatedSubmission: Submission = {
      ...submission,
      availability: formData.availability,
      engagement: formData.engagement,
      locationPreference: formData.locationPreference,
      payType: formData.payType,
      billType: formData.billType,
      billRate: formData.billRate,
      payRate: formData.payRate,
      email: formData.email,
      phone: formData.mobile,
      workAuthorization: formData.workAuthorization,
      city: formData.city && formData.city.trim() ? formData.city : null,
      state: formData.state && formData.state.trim() ? formData.state : null,
      expectedPay: formData.submitRate,
      linkedinUrl: formData.linkedin
    };

    onSubmit(updatedSubmission);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="relative w-full max-w-4xl rounded-lg bg-white p-6 shadow-xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Submission Details</h2>
              <p className="mt-1 text-sm text-gray-500">ID: {submission.id}</p>
            </div>
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <Button variant="outline\" size="sm\" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    Save Changes
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={onClose}>
                    Close
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Submission Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Submission Details</h3>
              
              <div className="space-y-4">
                <Input
                  label="Availability*"
                  value={formData.availability}
                  onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))}
                  disabled={!isEditing}
                />
                
                <Input
                  label="Engagement"
                  value={formData.engagement}
                  onChange={(e) => setFormData(prev => ({ ...prev, engagement: e.target.value }))}
                  disabled={!isEditing}
                />
                
                <Input
                  label="Location Preference"
                  value={formData.locationPreference}
                  onChange={(e) => setFormData(prev => ({ ...prev, locationPreference: e.target.value }))}
                  disabled={!isEditing}
                />
                
                <Input
                  label="Pay Type*"
                  value={formData.payType}
                  onChange={(e) => setFormData(prev => ({ ...prev, payType: e.target.value }))}
                  disabled={!isEditing}
                />
                
                <Input
                  label="Bill Type"
                  value={formData.billType}
                  onChange={(e) => setFormData(prev => ({ ...prev, billType: e.target.value }))}
                  disabled={!isEditing}
                />
                
                <Input
                  label="Bill Rate"
                  type="number"
                  value={formData.billRate}
                  onChange={(e) => setFormData(prev => ({ ...prev, billRate: Number(e.target.value) }))}
                  disabled={!isEditing}
                />
                
                <Input
                  label="Pay Rate*"
                  type="number"
                  value={formData.payRate}
                  onChange={(e) => setFormData(prev => ({ ...prev, payRate: Number(e.target.value) }))}
                  disabled={!isEditing}
                />
              </div>
            </div>

            {/* Candidate Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Candidate Details</h3>
              
              <div className="space-y-4">
                <Input
                  label="Candidate Name"
                  value={formData.candidateName}
                  disabled={true}
                />
                
                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  disabled={!isEditing}
                />
                
                <Input
                  label="Mobile"
                  value={formData.mobile}
                  onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
                  disabled={!isEditing}
                />
                
                <Input
                  label="Work Authorization"
                  value={formData.workAuthorization}
                  onChange={(e) => setFormData(prev => ({ ...prev, workAuthorization: e.target.value }))}
                  disabled={!isEditing}
                />
                
                <Input
                  label="City"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  disabled={!isEditing}
                />
                
                <Input
                  label="State"
                  value={formData.state}
                  onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                  disabled={!isEditing}
                />
                
                <Input
                  label="Submit Rate"
                  type="number"
                  value={formData.submitRate}
                  onChange={(e) => setFormData(prev => ({ ...prev, submitRate: Number(e.target.value) }))}
                  disabled={!isEditing}
                />
                
                <Input
                  label="LinkedIn"
                  value={formData.linkedin}
                  onChange={(e) => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          {submission.status === 'Rejected' && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
              <h3 className="text-lg font-medium text-red-900">Rejection Details</h3>
              <p className="mt-2 text-sm text-red-800">
                <span className="font-medium">Reason:</span> {submission.rejectionReason}
              </p>
              {submission.rejectionComments && (
                <p className="mt-2 text-sm text-red-800">
                  <span className="font-medium">Comments:</span> {submission.rejectionComments}
                </p>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmissionDetailsModal;
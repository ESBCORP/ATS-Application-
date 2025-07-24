import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Submission } from '../../types';
import api from '../../services/api';
import { updateSubmission } from '../../services/submissionsService';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import PageHeader from '../../components/layout/PageHeader';
import { Loader } from 'lucide-react';

const SubmissionDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSubmission = async () => {
      const response = await api.get(`/submissions/${id}`);
      const data = response.data;

      const formatted: Submission = {
        id: data.id.toString(),
        candidateId: data.candidate_id.toString(),
        firstName: data.candidate_name?.split(' ')[0] || '',
        lastName: data.candidate_name?.split(' ')[1] || '',
        jobId: data.job_id.toString(),
        jobTitle: data.job_title,
        client: data.client,
        status: data.status,
        payType: data.pay_type,
        expectedPay: parseFloat(data.expected_pay) || 0,
        city: data.city,
        state: data.state,
        jobHiringType: data.job_hiring_type || 'Full-time',
        submitter: data.created_by,
        submittedDate: data.created_on,
        availability: data.availability,
        engagement: data.engagement,
        locationPreference: data.location_preference,
        billType: data.bill_type,
        billRate: parseFloat(data.bill_rate) || 0,
        payRate: parseFloat(data.pay_rate) || 0,
        email: data.email,
        phone: data.mobile,
        workAuthorization: data.work_authorization,
        linkedinUrl: data.linkedin,
        rejectionReason: data.rejection_reason,
        rejectionComments: data.rejection_comments,
        customFields: data.custom_fields || {}  
      };

      setSubmission(formatted);
      setFormData({
        availability: formatted.availability,
        engagement: formatted.engagement,
        locationPreference: formatted.locationPreference,
        payType: formatted.payType,
        billType: formatted.billType,
        billRate: formatted.billRate,
        payRate: formatted.payRate,
        expectedPay: formatted.expectedPay,
        candidateName: `${formatted.firstName} ${formatted.lastName}`,
        email: formatted.email,
        phone: formatted.phone,
        workAuthorization: formatted.workAuthorization,
        city: formatted.city,
        state: formatted.state,
        linkedinUrl: formatted.linkedinUrl,
        customFields: formatted.customFields
      });
      setLoading(false);
    };

    fetchSubmission();
  }, [id]);

  const handleCustomFieldChange = (key: string, newValue: string | number | null) => {
      setFormData(prev => ({
        ...prev,
        customFields: {
          ...prev.customFields,
          [key]: {
            ...prev.customFields[key],
            value: newValue // ✅ only update the `value`, not the full object
          }
        }
      }));
    };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

    const handleSave = async () => {
        if (!submission) return;
    
            const customFieldPayload: Record<string, string | number | null> = {};
        Object.values(formData.customFields || {}).forEach((field: any) => {
          customFieldPayload[field.field_label] =
            field.value ?? field.default_value ?? '';
        });
    
        const payload: Submission = {
          ...submission,
          availability: formData.availability,
          engagement: formData.engagement,
          locationPreference: formData.locationPreference,
          payType: formData.payType,
          billType: formData.billType,
          billRate: formData.billRate,
          payRate: formData.payRate,
          expectedPay: formData.expectedPay,
          email: formData.email,
          phone: formData.phone,
          workAuthorization: formData.workAuthorization,
          city: formData.city,
          state: formData.state,
          linkedinUrl: formData.linkedinUrl,
           customFields: formData.customFields, // used for local UI state
           custom_fields: customFieldPayload         // keep full object in state
                      
        };
        console.log("Payload being sent:", {
      location_preference: formData.locationPreference,
    });
    
        try {
      setIsSaving(true);
      console.log('Submitting:', payload);
      const updated = await updateSubmission(payload);
      console.log("API response after save:", updated);
    
      setSubmission(updated);
      setFormData({
        availability: updated.availability,
        engagement: updated.engagement,
        locationPreference: updated.locationPreference,
        payType: updated.payType,
        billType: updated.billType,
        billRate: updated.billRate,
        payRate: updated.payRate,
        expectedPay: updated.expectedPay,
        candidateName: `${updated.firstName} ${updated.lastName}`,
        email: updated.email,
        phone: updated.phone,
        workAuthorization: updated.workAuthorization,
        city: updated.city,
        state: updated.state,
        linkedinUrl: updated.linkedinUrl,
        customFields: updated.customFields || {}
      });
    
      setIsEditing(false);
    } catch (err) {
      console.error('Save failed:', err);
      alert('Save failed. Please check required fields and try again.');
    } finally {
      setIsSaving(false);
    }
      };

  const renderInput = (label: string, field: string, type: string = 'text') => (
    <Input
      label={label}
      type={type}
      value={formData[field] || ''}
      onChange={(e) => handleInputChange(field, type === 'number' ? parseFloat(e.target.value) : e.target.value)}
      disabled={!isEditing}
    />
  );

  if (loading || !submission) {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader className="h-8 w-8 animate-spin text-blue-600" />
    </div>
  );
}

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <PageHeader
        title={`Submission Details - ${formData.candidateName}`}
        subtitle={`Submission ID: SUB-${submission.id}`}
        actions={
          isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>Cancel</Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit</Button>
          )
        }
      />

      <div className="bg-white shadow rounded-lg p-6 space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">Submission Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {renderInput('Availability', 'availability')}
          {renderInput('Engagement', 'engagement')}
          {renderInput('Location Preference', 'locationPreference')}
          {renderInput('Pay Type', 'payType')}
          {renderInput('Bill Type', 'billType')}
          {renderInput('Bill Rate', 'billRate', 'number')}
          {renderInput('Pay Rate', 'payRate', 'number')}
          {renderInput('Expected Pay', 'expectedPay', 'number')}
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mt-6">Candidate Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {renderInput('Candidate Name', 'candidateName')}
          {renderInput('Email', 'email')}
          {renderInput('Phone', 'phone')}
          {renderInput('Work Authorization', 'workAuthorization')}
          {renderInput('City', 'city')}
          {renderInput('State', 'state')}
          {renderInput('LinkedIn URL', 'linkedinUrl')}
        </div>
        
         {/* Custom Fields */}
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Custom Fields</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {formData.customFields && Object.entries(formData.customFields).length > 0 ? (
            Object.entries(formData.customFields).map(([key, field]: any) => (
              <div key={field.field_id || key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.field_label}
                  {field.is_required && <span className="text-red-500 ml-1">*</span>}
                </label>
      
                {isEditing ? (
                  field.field_type === 'SELECT' ? (
                    <select
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={
                        field.value !== null && field.value !== undefined
                          ? String(field.value)
                          : field.default_value
                          ? String(field.default_value)
                          : ''
                      }
                      onChange={(e) =>
                        handleCustomFieldChange(key, e.target.value)
                      }
                    >
                      <option value="">-- Select --</option>
                      {(field.field_options?.split(',') || []).map((opt: string, idx: number) => {
                        const trimmedOpt = opt.trim();
                        return (
                          <option key={idx} value={trimmedOpt}>
                            {trimmedOpt}
                          </option>
                        );
                      })}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={
                        field.value !== null && field.value !== undefined
                          ? String(field.value)
                          : field.default_value
                          ? String(field.default_value)
                          : ''
                      }
                      onChange={(e) =>
                        handleCustomFieldChange(key, e.target.value)
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder={field.placeholder || ''}
                    />
                  )
                ) : field.field_type === 'SELECT' ? (
                  <div className="relative">
                    <div className="w-full rounded-md border border-gray-300  text-sm text-gray-900 px-3 py-2 pr-10">
                      {field.value !== null && field.value !== undefined && field.value !== ''
                        ? String(field.value)
                        : field.default_value && field.default_value !== ''
                        ? String(field.default_value)
                        : <span className="text-gray-500 italic">No value set</span>}
                    </div>
                    <svg
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-full rounded-md border border-gray-300 bg-white text-sm text-gray-900 px-3 py-2">
        {field.value !== null && field.value !== undefined && field.value !== ''
          ? String(field.value)
          : field.default_value && field.default_value !== ''
          ? String(field.default_value)
          : <span className="text-gray-500 italic">No value set</span>}
      </div>  
                )}
      
                {field.help_text && (
                  <p className="text-xs text-gray-500 mt-1">{field.help_text}</p>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No custom fields available.</p>
          )}
        </div>
      </div>

        {submission.status === 'Rejected' && (
          <div className="border border-red-300 bg-red-50 p-4 rounded-md mt-6">
            <h3 className="text-lg font-semibold text-red-800">Rejection Details</h3>
            <p className="text-sm text-red-700 mt-2">
              <strong>Reason:</strong> {submission.rejectionReason || 'N/A'}
            </p>
            {submission.rejectionComments && (
              <p className="text-sm text-red-700 mt-1">
                <strong>Comments:</strong> {submission.rejectionComments}
              </p>
            )}
          </div>
        )}
      </div> 
  );
};

export default SubmissionDetailsPage;
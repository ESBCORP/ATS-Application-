import api from './api';
import axios from 'axios';
import { Submission } from '../types';

interface SubmissionsResponse {
  data: Submission[];
  total: number;
}

export const checkDuplicateSubmission = async (candidateId: string, jobId: string): Promise<boolean> => {
  try {
    const response = await api.get(`/submissions/check-duplicate?candidate_id=${candidateId}&job_id=${jobId}`);
    return response.data.exists || false;
  } catch (error) {
    // If the endpoint doesn't exist or fails, check manually by fetching submissions
    try {
      const response = await api.get(`/submissions/?candidate_id=${candidateId}&job_id=${jobId}&limit=1`);
      return response.data.length > 0;
    } catch (fallbackError) {
      console.error('Error checking duplicate submission:', fallbackError);
      return false; // If we can't check, allow the submission to proceed
    }
  }
};

export const fetchSubmissions = async (page: number = 1, limit: number = 100): Promise<SubmissionsResponse> => {
  const offset = (page - 1) * limit;
  const response = await api.get(`/submissions/?skip=${offset}&limit=${limit}`);
  
  return {
    data: response.data.map((submission: any) => ({
      id: submission.id.toString(),
      candidateId: submission.candidate_id.toString(),
      firstName: submission.candidate_name?.split(' ')[0] || '',
      lastName: submission.candidate_name?.split(' ').slice(1).join(' ') || '', // Handle multiple last names
      jobId: submission.job_id.toString(),
      jobTitle: submission.job_title || '',
      client: submission.client || '',
      status: submission.status || 'Submitted',
      payType: submission.pay_type || '',
      expectedPay: parseFloat(submission.expected_pay) || 0,
      city: submission.city || null,
      state: submission.state || null,
      country: submission.country || null,
      jobHiringType: submission.job_hiring_type || 'Full-time',
      submitter: submission.created_by || '',
      submittedDate: submission.created_on || '',
      availability: submission.availability || '',
      engagement: submission.engagement || '',
      locationPreference: submission.location_preference || '',
      billType: submission.bill_type || '',
      billRate: parseFloat(submission.bill_rate) || 0,
      payRate: parseFloat(submission.pay_rate) || 0,
      email: submission.email || '',
      phone: submission.mobile || '',
      workAuthorization: submission.work_authorization || '',
      linkedinUrl: submission.linkedin || '',
      customFields: submission.custom_fields || {}
    })),
    total: parseInt(response.headers['x-total-count'] || '0')
  };
};

// Fetch submissions created by the current user
export const fetchMySubmissions = async (skip: number = 0, limit: number = 100): Promise<SubmissionsResponse> => {
  const response = await api.get(`/submissions/my/submissions?skip=${skip}&limit=${limit}`);
  
  return {
    data: response.data.map((submission: any) => ({
      id: submission.id.toString(),
      candidateId: submission.candidate_id.toString(),
      firstName: submission.candidate_name?.split(' ')[0] || '',
      lastName: submission.candidate_name?.split(' ').slice(1).join(' ') || '', // Handle multiple last names
      jobId: submission.job_id.toString(),
      jobTitle: submission.job_title || '',
      client: submission.client || '',
      status: submission.status || 'Submitted',
      payType: submission.pay_type || '',
      expectedPay: parseFloat(submission.expected_pay) || 0,
      city: submission.city || null,
      state: submission.state || null,
      country: submission.country || null,
      jobHiringType: submission.job_hiring_type || 'Full-time',
      submitter: submission.created_by || '',
      submittedDate: submission.created_on || '',
      availability: submission.availability || '',
      engagement: submission.engagement || '',
      locationPreference: submission.location_preference || '',
      billType: submission.bill_type || '',
      billRate: parseFloat(submission.bill_rate) || 0,
      payRate: parseFloat(submission.pay_rate) || 0,
      email: submission.email || '',
      phone: submission.mobile || '',
      workAuthorization: submission.work_authorization || '',
      linkedinUrl: submission.linkedin || '',
      customFields: submission.custom_fields || {}
    })),
    total: parseInt(response.headers['x-total-count'] || '0')
  };
};

export const createSubmission = async (submissionData: Partial<Submission>): Promise<Submission> => {
  const payload = {
    candidate_id: parseInt(submissionData.candidateId || '0'), // Convert to number as API expects
    job_id: parseInt(submissionData.jobId || '0'), // Convert to number as API expects
    candidate_name: `${submissionData.firstName || ''} ${submissionData.lastName || ''}`.trim(),
    job_title: submissionData.jobTitle || '',
    client: submissionData.client || '',
    status: submissionData.status || 'Submitted',
    expected_pay: submissionData.expectedPay?.toString() || '0', // API expects string
    availability: submissionData.availability || '',
    engagement: submissionData.engagement || '',
    pay_type: submissionData.payType || '',
    bill_type: submissionData.billType || '',
    bill_rate: submissionData.billRate?.toString() || '0', // API expects string
    pay_rate: submissionData.payRate?.toString() || '0', // API expects string
    email: submissionData.email || '',
    mobile: submissionData.phone || '',
    work_authorization: submissionData.workAuthorization || '',
    city: submissionData.city || '',
    state: submissionData.state || '',
    country: submissionData.country || '', // Added missing country field
    linkedin: submissionData.linkedinUrl || '',
    custom_fields: submissionData.customFields || {} // Added custom_fields support
  };

  try {
    const response = await api.post('/submissions/', payload);
     console.log('📤 SUBMITTING TO API:', payload);
  
    return {
      id: response.data.id.toString(),
      candidateId: response.data.candidate_id.toString(),
      firstName: response.data.candidate_name.split(' ')[0] || '',
      lastName: response.data.candidate_name.split(' ')[1] || '',
      jobId: response.data.job_id.toString(),
      jobTitle: response.data.job_title || '',
      client: response.data.client || '',
      status: response.data.status || '',
      payType: response.data.pay_type || '',
      expectedPay: parseFloat(response.data.expected_pay) || 0,
      city: response.data.city || '',
      state: response.data.state || '',
      country: response.data.country || '', // Added country field
      jobHiringType: response.data.job_hiring_type || 'Full-time',
      submitter: response.data.created_by || '',
      submittedDate: response.data.created_on || '',
      availability: response.data.availability || '',
      engagement: response.data.engagement || '',
      locationPreference: response.data.location_preference || '',
      billType: response.data.bill_type || '',
      billRate: parseFloat(response.data.bill_rate) || 0,
      payRate: parseFloat(response.data.pay_rate) || 0,
      email: response.data.email || '',
      phone: response.data.mobile || '',
      workAuthorization: response.data.work_authorization || '',
      linkedinUrl: response.data.linkedin || '',
      customFields: response.data.custom_fields || {} // Added custom_fields support
    };
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error('❌ Submission API Error:', error.response?.data);
      console.error('❌ Status:', error.response?.status);
      console.error('❌ Headers:', error.response?.headers);
      
      // Provide more specific error information
      if (error.response?.status === 400) {
        throw new Error(`Validation Error: ${JSON.stringify(error.response.data)}`);
      } else if (error.response?.status === 401) {
        throw new Error('Authentication failed. Please check your credentials.');
      } else if (error.response?.status === 422) {
        throw new Error(`Validation Error: ${JSON.stringify(error.response.data)}`);
      }
      
      throw error; // rethrow to handle in the catch block of EmailCompositionModal
    } else {
      console.error('❌ Unknown Submission Error:', error);
      throw new Error('Unknown error while creating submission');
    }
  }
};

export const updateSubmission = async (submissionData: Submission): Promise<Submission> => {
  const payload = {
    candidate_name: `${submissionData.firstName} ${submissionData.lastName}`,
    candidate_id: parseInt(submissionData.candidateId),
    job_id: parseInt(submissionData.jobId.replace(/\D/g, '')),
    job_title: submissionData.jobTitle,
    client: submissionData.client,
    status: submissionData.status,
    expected_pay: submissionData.expectedPay.toString(),
    availability: submissionData.availability,
    engagement: submissionData.engagement,
    pay_type: submissionData.payType,
    bill_type: submissionData.billType,
    bill_rate: submissionData.billRate.toString(),
    pay_rate: submissionData.payRate.toString(),
    email: submissionData.email,
    mobile: submissionData.phone,
    work_authorization: submissionData.workAuthorization,
    city: submissionData.city || '',
    state: submissionData.state || '',
    country: submissionData.country || '',
    linkedin: submissionData.linkedinUrl,
    location_preference: submissionData.locationPreference,
    job_hiring_type: submissionData.jobHiringType,

    // ✅ Flatten custom fields
    custom_fields: Object.entries(submissionData.customFields || {}).reduce(
      (acc, [_, field]) => {
        acc[field.field_label] = field.value ?? field.default_value ?? '';
        return acc;
      },
      {} as Record<string, string | number | null>
    )
  };

  const response = await api.put(`/submissions/${submissionData.id}`, payload);

  return {
    id: response.data.id.toString(),
    candidateId: response.data.candidate_id.toString(),
    firstName: response.data.candidate_name.split(' ')[0] || '',
    lastName: response.data.candidate_name.split(' ')[1] || '',
    jobId: response.data.job_id.toString(),
    jobTitle: response.data.job_title || '',
    client: response.data.client || '',
    status: response.data.status || '',
    payType: response.data.pay_type || '',
    expectedPay: parseFloat(response.data.expected_pay) || 0,
    city: response.data.city || '',
    state: response.data.state || '',
    country: response.data.country || '',
    jobHiringType: response.data.job_hiring_type || 'Full-time',
    submitter: response.data.created_by || '',
    submittedDate: response.data.created_on || '',
    availability: response.data.availability || '',
    engagement: response.data.engagement || '',
    locationPreference: response.data.location_preference || '',
    billType: response.data.bill_type || '',
    billRate: parseFloat(response.data.bill_rate) || 0,
    payRate: parseFloat(response.data.pay_rate) || 0,
    email: response.data.email || '',
    phone: response.data.mobile || '',
    workAuthorization: response.data.work_authorization || '',
    linkedinUrl: response.data.linkedin || '',
    customFields: response.data.custom_fields || {}
  };
};

export const deleteSubmission = async (submissionId: string): Promise<void> => {
  await api.delete(`/submissions/${submissionId}`);
};
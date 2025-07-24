import api from './api';
import axios from 'axios';
import { Job, QAItem } from '../types';

interface JobsResponse {
  data: Job[];
  total: number;
}

interface GenerateJobSummaryResponse {
  summary: string;
  questions: {
    question: string;
    answer: string;
  }[];
  skills_boolean: string;
  job_titles_boolean: string;
  success: boolean;
  message: string;
}

interface GPTQuestion {
  gpt_id: number;
  job_id: number;
  question: string;
  answer: string;
  created_by: string;
  modified_by: string | null;
  created_at: string;
  modified_at: string;
}

export const fetchGPTQuestions = async (jobId: string): Promise<QAItem[]> => {
  const response = await api.get<GPTQuestion[]>(`/jobs/gpt_questions/?job_id=${jobId}`);
  return response.data.map((qa) => ({
    id: qa.gpt_id.toString(),
    question: qa.question,
    answer: qa.answer,
    createdBy: qa.created_by,
    createdAt: qa.created_at,
    modifiedBy: qa.modified_by,
    modifiedAt: qa.modified_at
  }));
};

export const saveGPTQuestions = async (jobId: string, questions: QAItem[]): Promise<void> => {
  // Get existing questions first
  const existingQuestions = await fetchGPTQuestions(jobId);

  // For each question, either update existing or create new
  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    const existingQuestion = existingQuestions[i];

    if (existingQuestion) {
      // Update existing question
      await api.put(`/jobs/gpt_questions/${existingQuestion.id}`, {
        question: question.question,
        answer: question.answer
      });
    } else {
      // Create new question
      await api.post('/jobs/gpt_questions/', [{
        job_id: parseInt(jobId),
        question: question.question,
        answer: question.answer
      }]);
    }
  }

  // If there are more existing questions than new ones, we don't delete them
  // This preserves history and prevents accidental data loss
};

export const generateJobSummary = async (description: string): Promise<GenerateJobSummaryResponse> => {
  const token = localStorage.getItem('auth_token');
  
  const response = await axios.post(
    'https://esb-ats-bndke8f0gza5e8d0.eastus2-01.azurewebsites.net/api/jobsummary/generate',
    { job_description: description },
    {
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }
  );

  return response.data;
};

export const fetchJobs = async (page: number = 1, limit: number = 15): Promise<JobsResponse> => {
  const offset = (page - 1) * limit;
  const response = await api.get(`/jobs/?skip=${offset}&limit=${limit}`);
  return {
    data: response.data.map((job: any) => ({
      id: `JOB-${job.id.toString().padStart(3, '0')}`,
      title: job.title,
      status: job.status,
      payRate: parseFloat(job.pay_rate_from_customer) || 0,
      createdDate: job.created_at,
      createdBy: job.created_by,
      modifiedDate: job.modified_at || job.created_at,
      modifiedBy: job.modified_by || job.created_by,
      endClient: job.end_client,
      city: job.city,
      state: job.state,
      country: job.country,
      customer: job.customer,
      customerType: job.customer_type,
      workType: job.work_type,
      experienceLevel: job.experience_level,
      positions: job.number_of_positions,
      placementType: job.placement_type,
      clientPayType: job.client_pay_type,
      jobType: job.job_type,
      payType: job.pay_type,
      description: job.description,
      summary: job.summary || '',
      titleBoolean: job.job_title_boolean || '',
      skillBoolean: job.skill_boolean || '',
       custom_fields: job.custom_fields || {}
    })),
    total: parseInt(response.headers['x-total-count'] || '0')
  };
};

export const fetchJobById = async (id: string): Promise<Job> => {
  // Handle both numeric IDs and formatted IDs
  const numericId = id.toString().replace(/^JOB-0*/, '');
  
  const [jobResponse, qaResponse] = await Promise.all([
    api.get(`/jobs/${numericId}`),
    fetchGPTQuestions(numericId).catch(() => [])
  ]);
  
  const job = jobResponse.data;
  
  return {
    id: `JOB-${job.id.toString().padStart(3, '0')}`,
    title: job.title || '',
    status: job.status || 'Draft',
    payRate: parseFloat(job.pay_rate_from_customer) || 0,
    createdDate: job.created_at || new Date().toISOString(),
    createdBy: job.created_by || '',
    modifiedDate: job.modified_at || job.created_at,
    modifiedBy: job.modified_by || job.created_by,
    endClient: job.end_client || '',
    recruiters: [],
    city: job.city || '',
    state: job.state || '',
    country: job.country || '',
    customer: job.customer || '',
    accountManager: '',
    customerType: job.customer_type || '',
    employmentType: 'Full-time',
    workType: job.work_type || 'Onsite',
    experienceLevel: job.experience_level || 'Mid',
    positions: job.number_of_positions || 1,
    primarySkills: [],
    secondarySkills: [],
    languages: [],
    qualifications: [],
    industry: '',
    placementType: job.placement_type || '',
    clientPayType: job.client_pay_type || '',
    jobType: job.job_type || '',
    payType: job.pay_type || '',
    isPreferred: false,
    description: job.description || '',
    summary: job.summary || '',
    qaItems: qaResponse,
    titleBoolean: job.job_title_boolean || '',
    skillBoolean: job.skill_boolean || '',
     custom_fields: job.custom_fields || {}
  };
};

export const createJob = async (jobData: Partial<Job>): Promise<Job> => {
  const payload = {
    title: jobData.title,
    status: jobData.status,
    customer_type: jobData.customerType,
    customer: jobData.customer,
    end_client: jobData.endClient,
    city: jobData.city,
    state: jobData.state,
    country: jobData.country,
    number_of_positions: jobData.positions,
    work_type: jobData.workType,
    experience_level: jobData.experienceLevel,
    placement_type: jobData.placementType,
    client_pay_type: jobData.clientPayType,
    job_type: jobData.jobType,
    pay_type: jobData.payType,
    pay_rate_from_customer: jobData.payRate?.toString(),
    description: jobData.description,
    summary: jobData.summary,
    job_title_boolean: jobData.titleBoolean,
    skill_boolean: jobData.skillBoolean,
    recruiter_instructions: '',
     custom_fields: jobData.custom_fields || {},
  };

  const response = await api.post('/jobs/', payload);
  const newJob = await fetchJobById(response.data.id);

  // Save Q&A items if they exist
  if (jobData.qaItems?.length) {
    const numericId = newJob.id.replace(/^JOB-0*/, '');
    await saveGPTQuestions(numericId, jobData.qaItems);
  }

  return newJob;
};

export const updateJob = async (id: string, jobData: Partial<Job>): Promise<Job> => {
  const numericId = id.toString().replace(/^JOB-0*/, '');

  const payload = {
    title: jobData.title,
    status: jobData.status,
    customer_type: jobData.customerType,
    customer: jobData.customer,
    end_client: jobData.endClient,
    city: jobData.city,
    state: jobData.state,
    country: jobData.country,
    number_of_positions: jobData.positions,
    work_type: jobData.workType,
    experience_level: jobData.experienceLevel,
    placement_type: jobData.placementType,
    client_pay_type: jobData.clientPayType,
    job_type: jobData.jobType,
    pay_type: jobData.payType,
    pay_rate_from_customer: jobData.payRate?.toString(),
    description: jobData.description,
    summary: jobData.summary,
    job_title_boolean: jobData.titleBoolean,
    skill_boolean: jobData.skillBoolean,
    recruiter_instructions: '',
    // ✅ FIXED: Send custom_fields as they are (the handleSave already prepared them)
    custom_fields: jobData.custom_fields || {}
  };

  await api.put(`/jobs/${numericId}`, payload);

  if (jobData.qaItems?.length) {
    await saveGPTQuestions(numericId, jobData.qaItems);
  }

  return fetchJobById(numericId);
};

export const deleteJob = async (jobId: string): Promise<void> => {
  // Handle both numeric IDs and formatted IDs
  const numericId = jobId.toString().replace(/^JOB-0*/, '');
  await api.delete(`/jobs/${numericId}`);
};
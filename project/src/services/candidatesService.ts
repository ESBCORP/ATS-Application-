import api from './api';
import { Candidate, Resume, Document, Note } from '../types';

interface CandidatesResponse {
  data: Candidate[];
  total: number;
}

export const fetchCandidateResumes = async (candidateId: string): Promise<Resume[]> => {
  const response = await api.get(`/candidates/resumes/download?candidate_id=${candidateId}`);
  
  return response.data.map((resume: any) => ({
    id: resume.id.toString(),
    fileName: resume.file_url.split('/').pop() || 'Resume',
    uploadDate: new Date().toISOString(),
    isPrimary: false,
    url: resume.file_url
  }));
};

export const downloadResume = async (resumeId: string, candidateId: string) => {
  return api.get(`/candidates/resumes/download`, {
    params: {
      resume_id: resumeId,
      candidate_id: candidateId
    },
    responseType: 'blob', // IMPORTANT: expect file content
  });
};


export const deleteResume = async (resumeId: string): Promise<void> => {
  await api.delete(`/candidates/resumes/${resumeId}`);
};

export const fetchCandidateDocuments = async (candidateId: string): Promise<Document[]> => {
  const response = await api.get(`/candidates/documents/download?candidate_id=${candidateId}`);
  
  return response.data.map((doc: any) => ({
    id: doc.id.toString(),
    fileName: doc.file_url.split('/').pop() || 'Document',
    uploadDate: new Date().toISOString(),
    type: doc.file_type || 'application/octet-stream',
    url: doc.file_url
  }));
};

export const downloadDocument = async (documentId: string, candidateId: string) => {
  return api.get(`/candidates/documents/download`, {
    params: {
      document_id: documentId,
      candidate_id: candidateId
    },
    responseType: 'blob',
  });
};


export const deleteDocument = async (documentId: string): Promise<void> => {
  await api.delete(`/candidates/documents/${documentId}`);
};

export const fetchCandidateNotes = async (candidateId: string): Promise<Note[]> => {
  const response = await api.get(`/candidates/notes/?candidate_id=${candidateId}`);
  
  return response.data.map((note: any) => ({
    id: note.id.toString(),
    content: note.content,
    createdAt: note.created_on,
    createdBy: note.created_by,
    modifiedAt: note.modified_on,
    modifiedBy: note.modified_by
  }));
};

export const createNote = async (candidateId: string, content: string): Promise<Note> => {
  const response = await api.post('/candidates/notes/', {
    candidate_id: candidateId,
    content: content
  });

  return {
    id: response.data.id.toString(),
    content: response.data.content,
    createdAt: response.data.created_on,
    createdBy: response.data.created_by,
    modifiedAt: response.data.modified_on,
    modifiedBy: response.data.modified_by
  };
};

export const deleteNote = async (noteId: string): Promise<void> => {
  await api.delete(`/candidates/notes/${noteId}`);
};

export const fetchCandidates = async (page: number = 1, limit: number = 100): Promise<CandidatesResponse> => {
  const offset = (page - 1) * limit;
  const response = await api.get(`/candidates/?skip=${offset}&limit=${limit}`);
  
  return {
    data: response.data.map((candidate: any) => ({
      id: candidate.id.toString(),
      firstName: candidate.first_name || '',
      middleName: candidate.middle_name || '',
      lastName: candidate.last_name || '',
      email: candidate.email || '',
      jobTitle: candidate.job_title || '',
      phone: candidate.phone || '',
      linkedinUrl: candidate.linkedin_url || '',
      status: candidate.status || 'Active',
      workAuthorization: candidate.work_authorization || '',
      yearsOfExperience: candidate.years_of_experience || 0,
      city: candidate.city || '',
      state: candidate.state || '',
      country: candidate.country || '',
      rtrStatus: candidate.rtr || 'Not Received',
      skills: candidate.skills ? candidate.skills.split(',').map((s: string) => s.trim()) : [],
      owner: candidate.created_by || '',
      createdBy: candidate.created_by || '',
      createdAt: candidate.created_on || new Date().toISOString(),
      modifiedBy: candidate.modified_by || '',
      modifiedOn: candidate.modified_on || '',
      address: `${candidate.city || ''}, ${candidate.state || ''}, ${candidate.country || ''}`.replace(/^, /, '').replace(/, $/, ''),
      softSkills: [],
      socialLinks: {},
      willingToRelocate: false,
      employmentType: [],
      expectedRateType: 'Hourly',
      remoteStatus: 'Onsite',
      languagesKnown: [],
      resumes: [],
      documents: [],
      notes: []
    })),
    total: parseInt(response.headers['x-total-count'] || '0')
  };
};

export const fetchCandidateById = async (id: string): Promise<Candidate> => {
  try {
    const [candidateResponse, resumesResponse, documentsResponse, notesResponse] = await Promise.all([
      api.get(`/candidates/${id}`),
      api.get(`/candidates/resumes/download?candidate_id=${id}`).catch(() => ({ data: [] })),
      api.get(`/candidates/documents/download?candidate_id=${id}`).catch(() => ({ data: [] })),
      api.get(`/candidates/notes/?candidate_id=${id}`).catch(() => ({ data: [] }))
    ]);
    
    const candidate = candidateResponse.data;
    const resumes = (resumesResponse.data || []).map((resume: any) => ({
      id: resume.id.toString(),
      fileName: resume.file_url?.split('/').pop() || 'Resume',
      uploadDate: new Date().toISOString(),
      isPrimary: false,
      url: resume.file_url || ''
    }));

    const documents = (documentsResponse.data || []).map((doc: any) => ({
      id: doc.id.toString(),
      fileName: doc.file_url?.split('/').pop() || 'Document',
      uploadDate: new Date().toISOString(),
      type: doc.file_type || 'application/octet-stream',
      url: doc.file_url || ''
    }));

    const notes = (notesResponse.data || []).map((note: any) => ({
      id: note.id.toString(),
      content: note.content || '',
      createdAt: note.created_on || new Date().toISOString(),
      createdBy: note.created_by || '',
      modifiedAt: note.modified_on || '',
      modifiedBy: note.modified_by || ''
    }));
    
    return {
      id: candidate.id.toString(),
      firstName: candidate.first_name || '',
      middleName: candidate.middle_name || '',
      lastName: candidate.last_name || '',
      email: candidate.email || '',
      jobTitle: candidate.job_title || '',
      phone: candidate.phone || '',
      linkedinUrl: candidate.linkedin_url || '',
      status: candidate.status || 'Active',
      workAuthorization: candidate.work_authorization || '',
      yearsOfExperience: candidate.years_of_experience || 0,
      city: candidate.city || '',
      state: candidate.state || '',
      country: candidate.country || '',
      rtrStatus: candidate.rtr || 'Not Received',
      skills: candidate.skills ? candidate.skills.split(',').map((s: string) => s.trim()) : [],
      owner: candidate.created_by || '',
      createdBy: candidate.created_by || '',
      createdAt: candidate.created_on || new Date().toISOString(),
      modifiedBy: candidate.modified_by || '',
      modifiedOn: candidate.modified_on || '',
      address: `${candidate.city || ''}, ${candidate.state || ''}, ${candidate.country || ''}`.replace(/^, /, '').replace(/, $/, ''),
      softSkills: [],
      socialLinks: {},
      willingToRelocate: false,
      employmentType: [],
      expectedRateType: 'Hourly',
      remoteStatus: 'Onsite',
      languagesKnown: [],
      resumes,
      documents,
      notes,
      custom_fields: candidate.custom_fields || {}
    };
  } catch (error) {
    console.error('Error fetching candidate:', error);
    throw new Error('Failed to fetch candidate details');
  }
};

export const createCandidate = async (candidateData: Partial<Candidate>): Promise<Candidate> => {
  const payload = {
    first_name: candidateData.firstName || '',
    middle_name: candidateData.middleName || '',
    last_name: candidateData.lastName || '',
    email: candidateData.email || '',
    job_title: candidateData.jobTitle || '',
    phone: candidateData.phone || '',
    linkedin_url: candidateData.linkedinUrl || '',
    status: candidateData.status || 'Active',
    work_authorization: candidateData.workAuthorization || '',
    years_of_experience: candidateData.yearsOfExperience || 0,
    city: candidateData.city || '',
    state: candidateData.state || '',
    country: candidateData.country || '',
    rtr: candidateData.rtrStatus || 'Not Received',
    skills: candidateData.skills?.length ? candidateData.skills.join(', ') : ''
  };

  const response = await api.post('/candidates/', payload);
  return fetchCandidateById(response.data.id);
};

export const updateCandidate = async (id: string, candidateData: Partial<Candidate>): Promise<Candidate> => {
  const payload = {
    first_name: candidateData.firstName || '',
    middle_name: candidateData.middleName || '',
    last_name: candidateData.lastName || '',
    email: candidateData.email || '',
    job_title: candidateData.jobTitle || '',
    phone: candidateData.phone || '',
    linkedin_url: candidateData.linkedinUrl || '',
    status: candidateData.status || 'Active',
    work_authorization: candidateData.workAuthorization || '',
    years_of_experience: candidateData.yearsOfExperience || 0,
    city: candidateData.city || '',
    state: candidateData.state || '',
    country: candidateData.country || '',
    rtr: candidateData.rtrStatus || 'Not Received',
    skills: candidateData.skills?.length ? candidateData.skills.join(', ') : ''
  };

  const response = await api.put(`/candidates/${id}`, payload);
  return fetchCandidateById(id);
};

export const uploadResume = async (candidateId: string, file: File): Promise<Resume> => {
  const formData = new FormData();
  formData.append('candidate_id', candidateId);
  formData.append('file', file);

  const token = localStorage.getItem('auth_token');
  const response = await fetch('https://esb-ats-bndke8f0gza5e8d0.eastus2-01.azurewebsites.net/api/candidates/resumes/', {
    method: 'POST',
    headers: {
      'Authorization': token || '',
      'Accept': 'application/json'
    },
    body: formData
  });

  if (!response.ok) {
    throw new Error('Failed to upload resume');
  }

  const data = await response.json();
  return {
    id: data.id.toString(),
    fileName: file.name,
    uploadDate: new Date().toISOString(),
    isPrimary: false,
    url: data.file_url
  };
};
export const fetchMyCandidates = async (page: number = 1, limit: number = 100): Promise<CandidatesResponse> => {
  const offset = (page - 1) * limit;
  const response = await api.get(`/candidates/my/candidates?skip=${offset}&limit=${limit}`);
  
  return {
    data: response.data.map((candidate: any) => ({
      id: candidate.id.toString(),
      firstName: candidate.first_name || '',
      middleName: candidate.middle_name || '',
      lastName: candidate.last_name || '',
      email: candidate.email || '',
      jobTitle: candidate.job_title || '',
      phone: candidate.phone || '',
      linkedinUrl: candidate.linkedin_url || '',
      status: candidate.status || 'Active',
      workAuthorization: candidate.work_authorization || '',
      yearsOfExperience: candidate.years_of_experience || 0,
      city: candidate.city || '',
      state: candidate.state || '',
      country: candidate.country || '',
      rtrStatus: candidate.rtr || 'Not Received',
      skills: candidate.skills ? candidate.skills.split(',').map((s: string) => s.trim()) : [],
      owner: candidate.created_by || '',
      createdBy: candidate.created_by || '',
      createdAt: candidate.created_on || new Date().toISOString(),
      modifiedBy: candidate.modified_by || '',
      modifiedOn: candidate.modified_on || '',
      address: `${candidate.city || ''}, ${candidate.state || ''}, ${candidate.country || ''}`.replace(/^, /, '').replace(/, $/, ''),
      softSkills: [],
      socialLinks: {},
      willingToRelocate: false,
      employmentType: [],
      expectedRateType: 'Hourly',
      remoteStatus: 'Onsite',
      languagesKnown: [],
      resumes: [],
      documents: [],
      notes: []
    })),
    total: parseInt(response.headers['x-total-count'] || '0')
  };
};

export const deleteCandidate = async (candidateId: string): Promise<void> => {
  await api.delete(`/candidates/${candidateId}`);
};
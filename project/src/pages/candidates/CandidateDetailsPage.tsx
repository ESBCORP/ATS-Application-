import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Trash2, Upload, FileText, File, Loader, Lock } from 'lucide-react';
import { fetchCandidateById, createCandidate, updateCandidate, fetchCandidateResumes, downloadResume, downloadDocument, createNote, deleteResume, deleteNote } from '../../services/candidatesService';
import { generateSasUrl } from '../../services/azureStorageService';
import { submissions } from '../../data/submissions';
import { jobs } from '../../data/jobs';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Candidate, Resume, Job, Document, Note } from '../../types';
import JobSelectionModal from '../../components/modals/JobSelectionModal';
import SubmissionModal from '../../components/modals/SubmissionModal';
import RTREmailModal from '../../components/modals/RTREmailModal';
import * as pdfjs from 'pdfjs-dist';
import * as mammoth from 'mammoth';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

const CandidateDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isNewCandidate = !id || id === 'new';
  
  const emptyCandidate: Candidate = {
    id: `OOC-${Math.floor(Math.random() * 100000)}`,
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    alternateEmail: '',
    phone: '',
    linkedinUrl: '',
    status: 'Active',
    owner: '',
    jobTitle: '',
    workAuthorization: '',
    yearsOfExperience: 0,
    city: '',
    state: '',
    country: '',
    address: '',
    skills: [],
    softSkills: [],
    socialLinks: {},
    willingToRelocate: false,
    employmentType: [],
    expectedRateType: 'Hourly',
    remoteStatus: 'Onsite',
    currentRateType: 'Hourly',
    languagesKnown: [],
    resumes: [],
    documents: [],
    notes: [],
    rtrStatus: 'Not Received'
  };

  const [candidate, setCandidate] = useState<Candidate>(emptyCandidate);
  const [isEditing, setIsEditing] = useState(isNewCandidate);
  const [showJobSelection, setShowJobSelection] = useState(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [showRTRModal, setShowRTRModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rtrEmailSent, setRTREmailSent] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [isRTRFlow, setIsRTRFlow] = useState(false);
  const [showSubmitButton, setShowSubmitButton] = useState(false);
  const [loading, setLoading] = useState(!isNewCandidate);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingFiles, setPendingFiles] = useState<{
    resumes: File[],
    documents: File[]
  }>({
    resumes: [],
    documents: []
  });
  const contentRef = useRef<HTMLDivElement>(null);

  // Check if user has permission to create/edit candidates
  const canCreateCandidate = () => {
    // Super Admin and Admin can always create candidates
    if (user?.role === 'SuperAdmin' || user?.role === 'Admin') {
      return true;
    }
    
    // Employee can also create candidates (based on your business logic)
    if (user?.role === 'Employee') {
      return true;
    }
    
    return false;
  };

  const canEditCandidate = () => {
    // Super Admin and Admin can always edit candidates
    if (user?.role === 'SuperAdmin' || user?.role === 'Admin') {
      return true;
    }
    
    // Employee can edit candidates they created or own
    if (user?.role === 'Employee') {
      return true; // For now, allow all employees to edit
    }
    
    return false;
  };

  const handleRemoveResume = async (resumeId: string) => {
    try {
      setIsProcessing(true);
      setError(null);

      // Check if this is a temporary resume (not yet saved to backend)
      if (resumeId.startsWith('temp-')) {
        // For temporary resumes, just remove from local state
        setCandidate(prev => ({
          ...prev,
          resumes: (prev.resumes || []).filter(r => r.id !== resumeId)
        }));
        
        // Also remove from pending files if it exists there
        setPendingFiles(prev => ({
          ...prev,
          resumes: prev.resumes.filter((_, index) => `temp-${Date.now()}-${index}` !== resumeId)
        }));
      } else {
        // For persisted resumes, call the API
        await deleteResume(resumeId);
        setCandidate(prev => ({
          ...prev,
          resumes: (prev.resumes || []).filter(r => r.id !== resumeId)
        }));
      }
    } catch (error: any) {
      console.error('Error deleting resume:', error);
      let errorMessage = 'Failed to delete resume. ';
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorMessage += error.response.data?.message || `Server returned ${error.response.status}`;
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage += 'No response received from server. Please check your network connection.';
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage += error.message || 'An unexpected error occurred';
      }
      
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };


  const handleRemoveNote = async (noteId: string) => {
    try {
      setIsProcessing(true);
      setError(null);

      await deleteNote(noteId);
      setCandidate(prev => ({
        ...prev,
        notes: (prev.notes || []).filter(n => n.id !== noteId)
      }));
    } catch (error: any) {
      console.error('Error deleting note:', error);
      let errorMessage = 'Failed to delete note. ';
      
      if (error.response) {
        errorMessage += error.response.data?.message || `Server returned ${error.response.status}`;
      } else if (error.request) {
        errorMessage += 'No response received from server. Please check your network connection.';
      } else {
        errorMessage += error.message || 'An unexpected error occurred';
      }
      
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const loadCandidate = async () => {
      if (isNewCandidate) return;
      
      try {
        setLoading(true);
        setError(null);
        const candidateData = await fetchCandidateById(id);
        setCandidate(candidateData);
        setRTREmailSent(candidateData.rtrStatus === 'Received');
      } catch (err) {
        setError('Failed to load candidate details. Please try again later.');
        if (err?.response?.status === 422) {
          navigate('/candidates/new');
        }
      } finally {
        setLoading(false);
      }
    };

    loadCandidate();
  }, [id, isNewCandidate, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const scrolledToBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight - 100;
      setShowSubmitButton(scrolledToBottom);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let text = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item: any) => item.str).join(' ');
    }
    
    return text;
  };

  const extractTextFromDOCX = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  };

  const extractSkills = (text: string): string[] => {
    const skillsToMatch = [
      'JavaScript', 'TypeScript', 'Python', 'Java', 'C\\+\\+', 'C#', 'Ruby',
      'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask',
      'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD',
      'SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis',
      'HTML', 'CSS', 'Sass', 'Less', 'Tailwind',
      'Git', 'REST API', 'GraphQL', 'WebSocket',
      'Agile', 'Scrum', 'Jira', 'Jenkins'
    ];

    const foundSkills = skillsToMatch.filter(skill => 
      new RegExp(`\\b${skill}\\b`, 'i').test(text)
    );

    return [...new Set(foundSkills)];
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'resume' | 'document') => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (isNewCandidate) {
      // Store the file for later upload
      setPendingFiles(prev => ({
        ...prev,
        [type === 'resume' ? 'resumes' : 'documents']: [...prev[type === 'resume' ? 'resumes' : 'documents'], file]
      }));

      // Extract skills if it's a resume
      if (type === 'resume') {
        try {
          let extractedText = '';
          if (file.name.toLowerCase().endsWith('.pdf')) {
            extractedText = await extractTextFromPDF(file);
          } else if (file.name.toLowerCase().endsWith('.docx')) {
            extractedText = await extractTextFromDOCX(file);
          }

          const extractedSkills = extractSkills(extractedText);
          setCandidate(prev => ({
            ...prev,
            skills: [...new Set([...(prev.skills || []), ...extractedSkills])]
          }));
        } catch (error) {
          console.error('Error extracting text from file:', error);
        }
      }

      // Show preview
      const tempId = `temp-${Date.now()}`;
      setCandidate(prev => ({
        ...prev,
        [type === 'resume' ? 'resumes' : 'documents']: [
          ...(prev[type === 'resume' ? 'resumes' : 'documents'] || []),
          {
            id: tempId,
            fileName: file.name,
            uploadDate: new Date().toISOString(),
            isPrimary: false,
            url: URL.createObjectURL(file)
          }
        ]
      }));

      return;
    }

    setIsProcessing(true);
    try {
      let extractedText = '';
      if (file.name.toLowerCase().endsWith('.pdf')) {
        extractedText = await extractTextFromPDF(file);
      } else if (file.name.toLowerCase().endsWith('.docx')) {
        extractedText = await extractTextFromDOCX(file);
      }

      const formData = new FormData();
      formData.append('candidate_id', candidate.id);
      formData.append('file', file);

      if (type === 'resume') {
        const response = await api.post('/candidates/resumes/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        const newResume: Resume = {
          id: response.data.id.toString(),
          fileName: file.name,
          uploadDate: new Date().toISOString(),
          isPrimary: (candidate.resumes || []).length === 0,
          url: response.data.file_url
        };

        const extractedSkills = extractSkills(extractedText);
        
        setCandidate(prev => ({
          ...prev,
          resumes: [...(prev.resumes || []), newResume],
          skills: [...new Set([...(prev.skills || []), ...extractedSkills])]
        }));
      } else {
        const response = await api.post('/candidates/documents/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        const newDocument: Document = {
          id: response.data.id.toString(),
          fileName: file.name,
          uploadDate: new Date().toISOString(),
          type: file.type,
          url: response.data.file_url
        };

        setCandidate(prev => ({
          ...prev,
          documents: [...(prev.documents || []), newDocument]
        }));
      }
    } catch (error) {
      console.error('Error processing file:', error);
      setError('Failed to upload file. Please try again.');
    } finally {
      setIsProcessing(false);
      if (event.target) {
        event.target.value = '';
      }
    }
  };

   const handleViewResume = async (resume: Resume) => {
  try {
    const response = await downloadResume(resume.id, candidate.id); // ✅ Pass both
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = resume.fileName || 'resume.pdf';
    link.click();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error viewing resume:', error);
    setError('Failed to access resume. Please try again.');
  }
};

  const handleViewDocument = async (documentItem: Document) => {
  try {
    const response = await downloadDocument(documentItem.id, candidate.id); // ✅ make sure this takes both IDs
    const blob = new Blob([response.data], {
      type: documentItem.type || 'application/octet-stream',
    });

    const url = window.URL.createObjectURL(blob);
    const link = window.document.createElement('a'); // ✅ fix here
    link.href = url;
    link.download = documentItem.fileName || 'document';
    link.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error viewing document:', error);
    setError('Failed to access document. Please try again.');
  }
};


  const handleSkillsChange = (value: string) => {
    const skillsArray = value
      .split(',')
      .map(skill => skill.trim())
      .filter(Boolean);

    setCandidate(prev => ({
      ...prev,
      skills: skillsArray
    }));
  };

  const handleJobSelect = (job: Job) => {
    setSelectedJob(job);
    if (isRTRFlow) {
      setShowRTRModal(true);
    } else {
      setShowSubmissionModal(true);
    }
    setShowJobSelection(false);
  };

  const handleSubmitRTR = () => {
    setIsRTRFlow(true);
    setShowJobSelection(true);
  };

  const handleSubmitCandidate = () => {
    setIsRTRFlow(false);
    setShowJobSelection(true);
  };

  const handleRTREmailSent = () => {
    setRTREmailSent(true);
    setShowRTRModal(false);
    setCandidate(prev => ({
      ...prev,
      rtrStatus: 'Received'
    }));
    
    const note: Note = {
      id: `NOTE-${Math.random().toString(36).substr(2, 9)}`,
      content: `RTR email sent for job ${selectedJob?.title} (${selectedJob?.id})`,
      createdAt: new Date().toISOString(),
      createdBy: 'Current User'
    };
    
    setCandidate(prev => ({
      ...prev,
      notes: [...(prev.notes || []), note]
    }));
  };

  const uploadPendingFiles = async (candidateId: string) => {
    const uploadPromises = [];

    // Upload resumes
    for (const file of pendingFiles.resumes) {
      const formData = new FormData();
      formData.append('candidate_id', candidateId);
      formData.append('file', file);
      uploadPromises.push(
        api.post('/candidates/resumes/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      );
    }

    // Upload documents
    for (const file of pendingFiles.documents) {
      const formData = new FormData();
      formData.append('candidate_id', candidateId);
      formData.append('file', file);
      uploadPromises.push(
        api.post('/candidates/documents/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      );
    }

    try {
      await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading pending files:', error);
      throw error;
    }
  };

  const handleSave = async () => {
  try {
    setSaving(true);
    setError(null);

    if (isNewCandidate && !canCreateCandidate()) {
      setError('Access Denied — You do not have the required permissions to create candidates.');
      return;
    }

    if (!isNewCandidate && !canEditCandidate()) {
      setError('Access Denied — You do not have the required permissions to edit candidates.');
      return;
    }

    // ✅ Properly format custom fields
    const customFieldValues: Record<string, string | number | null> = {};
    
    if (candidate.custom_fields) {
      Object.entries(candidate.custom_fields).forEach(([key, field]) => {
        // Use the field's current value, or fall back to default_value, or empty string
        let finalValue = field.value;
        
        // Handle null/undefined values
        if (finalValue === null || finalValue === undefined || finalValue === '') {
          finalValue = field.default_value || '';
        }
        
        // Use field_name as the key, not the object key
        const fieldKey = field.field_name || key;
        customFieldValues[fieldKey] = finalValue;
      });
    }

    const payload = {
      first_name: candidate.firstName,
      middle_name: candidate.middleName,
      last_name: candidate.lastName,
      email: candidate.email,
      job_title: candidate.jobTitle,
      phone: candidate.phone,
      linkedin_url: candidate.linkedinUrl,
      status: candidate.status,
      work_authorization: candidate.workAuthorization,
      years_of_experience: candidate.yearsOfExperience,
      city: candidate.city,
      state: candidate.state,
      country: candidate.country,
      rtr: candidate.rtrStatus,
      skills: candidate.skills.join(', '),
      rtr_button: candidate.rtrStatus === 'Received',
      custom_fields: customFieldValues
    };

    console.log('Saving payload:', payload); // Debug log

    if (isNewCandidate) {
      const savedCandidate = await createCandidate(payload);
      if (pendingFiles.resumes.length > 0 || pendingFiles.documents.length > 0) {
        await uploadPendingFiles(savedCandidate.id);
      }
      const updatedCandidate = await fetchCandidateById(savedCandidate.id);
      setCandidate(updatedCandidate);
      setPendingFiles({ resumes: [], documents: [] });
      navigate(`/candidates/details/${savedCandidate.id}`, { replace: true });
    } else {
      await api.put(`/candidates/${candidate.id}`, payload);
      const updatedCandidate = await fetchCandidateById(candidate.id);
      setCandidate(updatedCandidate);
      setIsEditing(false);
    }
  } catch (err: any) {
    console.error('Error saving candidate:', err);
    console.error('Error details:', err.response?.data); // Additional debug info
    
    if (err.response?.status === 403) {
      setError('Access Denied — You do not have the required permissions.');
    } else if (err.response?.status === 401) {
      setError('Authentication required. Please log in again.');
    } else {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Failed to save candidate. Please try again.';
      setError(errorMessage);
    }
  } finally {
    setSaving(false);
  }
};

  const handleAddNote = async () => {
    if (!newNote.trim() || !candidate.id || isNewCandidate) return;

    try {
      const note = await createNote(candidate.id, newNote.trim());
      
      setCandidate(prev => ({
        ...prev,
        notes: [...(prev.notes || []), note]
      }));
      setNewNote('');
    } catch (error) {
      console.error('Error adding note:', error);
      setError('Failed to add note. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Show permission denied message only if user truly doesn't have permission
  if (isNewCandidate && !canCreateCandidate()) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Add New Candidate"
          subtitle="Access denied"
          actions={
            <Button variant="outline" onClick={() => navigate('/candidates')}>
              Back to Candidates
            </Button>
          }
        />

        <div className="rounded-md bg-red-50 p-6 border border-red-200">
          <div className="flex items-center">
            <Lock className="h-8 w-8 text-red-400" />
            <div className="ml-4">
              <h3 className="text-lg font-medium text-red-800">Access Denied</h3>
              <p className="text-sm text-red-700 mt-2">
                You do not have the required permissions to create candidates.
              </p>
              <p className="text-sm text-red-600 mt-1">
                Please contact your administrator to request candidate creation access.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderField = (label: string, field: keyof Candidate, type: string = 'text') => (
    <div className="mb-4">
      <Input
        label={label}
        type={type}
        value={candidate[field]?.toString() || ''}
        onChange={(e) => setCandidate(prev => ({
          ...prev,
          [field]: type === 'number' ? Number(e.target.value) : e.target.value
        }))}
        disabled={!isEditing}
      />
    </div>
  );

  const renderSelect = (label: string, field: keyof Candidate, options: { value: string; label: string }[]) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        value={candidate[field]?.toString()}
        onChange={(e) => setCandidate(prev => ({ ...prev, [field]: e.target.value }))}
        disabled={!isEditing}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );

  const renderTextArea = (label: string, field: keyof Candidate, showGenerate: boolean = false) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <textarea
          className="w-full min-h-[200px] rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={candidate[field]?.toString() || ''}
          onChange={(e) => setCandidate(prev => ({ ...prev, [field]: e.target.value }))}
          disabled={!isEditing}
        />
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen pb-24" ref={contentRef}>
      <div className="space-y-6">
        <PageHeader
          title={isNewCandidate ? 'Add New Candidate' : `Candidate Details - ${candidate.firstName} ${candidate.lastName}`}
         subtitle={`Candidate ID: CAN-${candidate.id.match(/\d+/)?.[0].padStart(3, '0')}`}
          actions={
            <div className="space-x-2">
              {isEditing ? (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsEditing(false);
                      if (isNewCandidate) navigate('/candidates');
                    }}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSave}
                    isLoading={saving}
                  >
                    Save
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    Edit
                  </Button>
                  <Button 
                    variant="secondary"
                    onClick={handleSubmitRTR}
                    disabled={rtrEmailSent}
                  >
                    {rtrEmailSent ? 'RTR Sent' : 'Submit RTR'}
                  </Button>
                </>
              )}
            </div>
          }
        />

        {error && (
          <div className="rounded-md bg-red-50 p-4 border border-red-200">
            <div className="flex items-center">
              <Lock className="h-5 w-5 text-red-400 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">
          {/* Personal Details */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Personal Details</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {renderField('First Name', 'firstName')}
              {renderField('Middle Name', 'middleName')}
              {renderField('Last Name', 'lastName')}
              {renderField('Email', 'email', 'email')}
              {renderField('Phone (Mobile)', 'phone')}
              {renderField('LinkedIn URL', 'linkedinUrl')}
              {renderSelect('Status', 'status', [
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' }
              ])}
              {renderField('Owner', 'owner')}
              {renderField('Job Title', 'jobTitle')}
              {renderField('Work Authorization', 'workAuthorization')}
              {renderField('Years of Experience', 'yearsOfExperience', 'number')}
              {renderField('City', 'city')}
              {renderField('State', 'state')}
              {renderField('Country', 'country')}
              {renderSelect('RTR', 'rtrStatus', [
                { value: 'Not Received', label: 'Not Received' },
                { value: 'Received', label: 'Received' }
              ])}
            </div>
          </div>

          {/* {custom fields} */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Custom Fields</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {candidate.custom_fields && Object.entries(candidate.custom_fields).length > 0 ? (
                Object.entries(candidate.custom_fields).map(([key, field]) => (
                  <div key={field.field_id || key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.field_label}
                      {field.is_required && <span className="text-red-500 ml-1">*</span>}
                    </label>

                    {isEditing ? (
                      field.field_type === 'SELECT' ? (
                        <select
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={field.value !== null && field.value !== undefined ? String(field.value) : (field.default_value ? String(field.default_value) : '')}
                          onChange={(e) => {
                            const updatedValue = e.target.value;
                            setCandidate(prev => ({
                              ...prev,
                              custom_fields: {
                                ...prev.custom_fields,
                                [key]: {
                                  ...field,
                                  value: updatedValue
                                }
                              }
                            }));
                          }}
                        >
                          <option value="">-- Select --</option>
                          {(field.field_options?.split(',') || []).map((opt, idx) => {
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
                          value={field.value !== null && field.value !== undefined ? String(field.value) : (field.default_value ? String(field.default_value) : '')}
                          onChange={(e) => {
                            const updatedValue = e.target.value;
                            setCandidate(prev => ({
                              ...prev,
                              custom_fields: {
                                ...prev.custom_fields,
                                [key]: {
                                  ...field,
                                  value: updatedValue
                                }
                              }
                            }));
                          }}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder={field.placeholder || ''}
                        />
                      )
                    ) : (
                      // Read-only display
                      field.field_type === 'SELECT' ? (
                        <div className="relative">
                          <div className="w-full rounded-md border border-gray-300  text-sm text-gray-900 px-3 py-2 pr-10">
                            {field.value !== null && field.value !== undefined && field.value !== '' 
                              ? String(field.value) 
                              : (field.default_value && field.default_value !== '' 
                                  ? String(field.default_value) 
                                  : <span className="text-gray-500 italic">No value set</span>
                                )
                            }
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
                        <div className="rounded-md border border-gray-300 text-sm text-gray-900 px-3 py-2">
                          {field.value !== null && field.value !== undefined && field.value !== '' 
                            ? String(field.value) 
                            : (field.default_value && field.default_value !== '' 
                                ? String(field.default_value) 
                                : <span className="text-gray-500 italic">No value set</span>
                              )
                          }
                        </div>
                      )
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
          
          {/* Skills */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Skills</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Technical Skills
                </label>
                <textarea
                  className="w-full min-h-[100px] rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={(candidate.skills || []).join(', ')}
                  onChange={(e) => handleSkillsChange(e.target.value)}
                  placeholder="Enter skills separated by commas"
                  disabled={!isEditing}
                />
                <p className="mt-1 text-sm text-gray-500">
                  Skills will be automatically extracted when you upload a resume
                </p>
              </div>
            </div>
          </div>

          {/* Resumes */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Resumes</h2>
              {isEditing && (
                <div>
                  <input
                    type="file"
                    id="resume-upload"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileUpload(e, 'resume')}
                    disabled={isProcessing}
                  />
                  <label htmlFor="resume-upload">
                    <Button as="span" size="sm" isLoading={isProcessing}>
                      <Upload className="h-4 w-4 mr-1" />
                      Upload Resume
                    </Button>
                  </label>
                </div>
              )}
            </div>
            <div className="space-y-4">
              {(candidate.resumes || []).map((resume) => (
                <div key={resume.id} className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-500 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{resume.fileName}</p>
                      <p className="text-xs text-gray-500">
                        Uploaded on {new Date(resume.uploadDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewResume(resume)}
                    >
                      View
                    </Button>
                    {isEditing && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveResume(resume.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {(!candidate.resumes || candidate.resumes.length === 0) && (
                <p className="text-sm text-gray-500">No resumes uploaded yet.</p>
              )}
            </div>
          </div>

          {/* Documents */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Documents</h2>
              {isEditing && (
                <div>
                  <input
                    type="file"
                    id="document-upload"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt,.rtf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload(e, 'document')}
                    disabled={isProcessing}
                  />
                  <label htmlFor="document-upload">
                    <Button as="span" size="sm" isLoading={isProcessing}>
                      <Upload className="h-4 w-4 mr-1" />
                      Upload Document
                    </Button>
                  </label>
                </div>
              )}
            </div>
            <div className="space-y-4">
              {(candidate.documents || []).map((document) => (
                <div key={document.id} className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center">
                    <File className="h-5 w-5 text-gray-500 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{document.fileName}</p>
                      <p className="text-xs text-gray-500">
                        Uploaded on {new Date(document.uploadDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDocument(document)}
                    >
                      View
                    </Button>
                    {isEditing && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCandidate(prev => ({
                            ...prev,
                            documents: (prev.documents || []).filter(d => d.id !== document.id)
                          }));
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {(!candidate.documents || candidate.documents.length === 0) && (
                <p className="text-sm text-gray-500">No documents uploaded yet.</p>
              )}
            </div>
          </div>

          {/* Notes Section */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Notes</h2>
            </div>
            
            <div className="space-y-4">
              {/* Add Note Form */}
              <div className="flex gap-2">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder={isNewCandidate ? "Save the candidate first to add notes" : "Add a note..."}
                  className="flex-1 min-h-[100px] rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                  disabled={!isEditing || isNewCandidate}
                />
                <Button
                  onClick={handleAddNote}
                  disabled={!isEditing || !newNote.trim() || isNewCandidate}
                  className="self-start"
                >
                  Add Note
                </Button>
              </div>

              {isNewCandidate && (
                <p className="text-sm text-gray-500 italic">
                  Please save the candidate first before adding notes.
                </p>
              )}

              {/* Notes List */}
              <div className="space-y-4">
                {(candidate.notes || []).map((note) => (
                  <div
                    key={note.id}
                    className="rounded-lg border border-gray-200 p-4 bg-gray-50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-gray-800 whitespace-pre-wrap">
                          {note.content}
                        </p>
                        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                          <span>By {note.createdBy}</span>
                          <span>{new Date(note.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                      {isEditing && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveNote(note.id)}
                          className="ml-4"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                {(!candidate.notes || candidate.notes.length === 0) && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No notes added yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Submit Button */}
      {!isEditing && showSubmitButton && (
        <div 
          className="fixed bottom-0 right-0 left-20 z-10 bg-white border-t border-gray-200 py-4 px-6 transform transition-transform duration-300 ease-in-out"
          style={{
            transform: showSubmitButton ? 'translateY(0)' : 'translateY(100%)',
          }}
        >
          <div className="container mx-auto max-w-7xl flex justify-end">
            <Button
              onClick={handleSubmitCandidate}
              disabled={candidate.rtrStatus !== 'Received'}
              size="lg"
              className="min-w-[200px] shadow-lg hover:shadow-xl transition-shadow"
            >
              Submit Candidate
            </Button>
          </div>
        </div>
      )}

      {/* Modals */}
      <JobSelectionModal
        isOpen={showJobSelection}
        onClose={() => {
          setShowJobSelection(false);
          setIsRTRFlow(false);
        }}
        onSelect={handleJobSelect}
        jobs={jobs}
      />

      {selectedJob && (
        <SubmissionModal
          isOpen={showSubmissionModal}
          onClose={() => {
            setShowSubmissionModal(false);
            setSelectedJob(null);
          }}
          onSubmit={handleSubmitCandidate}
          candidate={candidate}
          job={selectedJob}
        />
      )}

      {selectedJob && (
        <RTREmailModal
          isOpen={showRTRModal}
          onClose={() => {
            setShowRTRModal(false);
            setSelectedJob(null);
          }}
          onSubmit={handleRTREmailSent}
          candidate={candidate}
          job={selectedJob}
        />
      )}
    
    </div>
  );
};

export default CandidateDetailsPage;
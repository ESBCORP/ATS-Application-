import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Trash2, Loader, Wand2, ChevronDown, ChevronUp, Video, Phone, Copy, Check, Lock } from 'lucide-react';
import { fetchJobById, updateJob, createJob, generateJobSummary } from '../../services/jobsService';
import { fetchPermissions } from '../../services/permissionsService';
import { useAuth } from '../../contexts/AuthContext';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Job, QAItem } from '../../types';
import { getCustomFields, CustomField } from '../../services/customFieldsService';

const parseCustomFields = (fields: any) => {
  const parsedFields: any = {};

  for (const key in fields) {
    let field = fields[key];

    // Step 1: Fix outer field object if stringified
    if (typeof field === 'string') {
      try {
        const cleaned = field
          .replace(/'/g, '"')
          .replace(/\bNone\b/g, 'null'); // Python None to JSON null

        field = JSON.parse(cleaned);
      } catch {
        parsedFields[key] = { field_label: key, value: 'Invalid format' };
        continue;
      }
    }

    // Step 2: Fix field.value if it contains a nested stringified object
    if (typeof field.value === 'string' && field.value.includes('{')) {
      try {
        const cleanedValue = field.value
          .replace(/'/g, '"')
          .replace(/\bNone\b/g, 'null');

        const parsedValue = JSON.parse(cleanedValue);
        field.value = parsedValue.value ?? 'Invalid nested value';
      } catch {
        field.value = 'Invalid nested value';
      }
    }

    parsedFields[key] = field;
  }

  return parsedFields;
};

interface SectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const Section: React.FC<SectionProps> = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="p-6 mb-6 bg-white border rounded-lg shadow-md dark:bg-gray-900 dark:border-gray-700">


      <button
        className="flex items-center justify-between w-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>
      {isOpen && <div className="mt-4">{children}</div>}
    </div>
  );
};

const JobDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isNewJob = !id || id === 'new';
  const [linkCopied, setLinkCopied] = useState(false);
  const [permissions, setPermissions] = useState({
    canCreate: false,
    canUpdate: false
  });
  const [permissionDenied, setPermissionDenied] = useState(false);
  
  const emptyJob: Job = {
    id: `OOJ-${Math.floor(Math.random() * 10000)}`,
    title: '',
    status: 'Draft',
    payRate: 0,
    createdDate: new Date().toISOString().split('T')[0],
    createdBy: user?.name || '',
    endClient: '',
    recruiters: [],
    city: '',
    state: '',
    country: '',
    customer: '',
    accountManager: '',
    customerType: 'Prime Vendor',
    employmentType: 'Full-time',
    workType: 'Onsite',
    experienceLevel: 'Mid',
    positions: 1,
    primarySkills: [],
    secondarySkills: [],
    languages: [],
    qualifications: [],
    placementType: 'Contractual',
    clientPayType: 'Monthly',
    jobType: 'Contractual',
    payType: 'Hourly',
    isPreferred: false,
    description: '',
    summary: '',
    qaItems: [],
    titleBoolean: '',
    skillBoolean: ''
  };

  const [job, setJob] = useState<Job>(emptyJob);
  const [isEditing, setIsEditing] = useState(isNewJob);
  const [loading, setLoading] = useState(!isNewJob);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Check permissions
  const checkPermissions = async () => {
    try {
      console.log('🔍 Checking job permissions for user:', user?.role);
      
      // For Employee role, assign default permissions
      if (user?.role === 'Employee') {
        console.log('👤 Employee detected - assigning default permissions');
        const employeePerms = {
          canCreate: true, // Allow Employee to create jobs
          canUpdate: false
        };
        
        console.log('✅ Employee permissions:', employeePerms);
        setPermissions(employeePerms);
        setPermissionDenied(false);
        return employeePerms;
      }
      
      // For SuperAdmin and Admin, grant full access
      if (user?.role === 'SuperAdmin' || user?.role === 'Admin') {
        console.log('👑 SuperAdmin/Admin detected - granting full access');
        const adminPerms = {
          canCreate: true,
          canUpdate: true
        };
        
        setPermissions(adminPerms);
        setPermissionDenied(false);
        return adminPerms;
      }

      // Try to fetch permissions from API for jobs resource
      try {
        const response = await fetchPermissions();
        const jobsResource = response.data.find(r => r.name.toLowerCase() === 'jobs');
        
        if (jobsResource) {
          const userPermission = jobsResource.permissions.find(p => p.role === user?.role);
          
          if (userPermission) {
            const perms = {
              canCreate: userPermission.can_create,
              canUpdate: userPermission.can_update
            };
            
            console.log('✅ API permissions for jobs:', perms);
            setPermissions(perms);
            setPermissionDenied(false);
            return perms;
          }
        }
      } catch (apiError) {
        console.log('⚠️ API permissions check failed, using role-based fallback');
      }
      
      // Fallback to role-based permissions
      const hasAccess = user?.role === 'SuperAdmin' || user?.role === 'Admin';
      const fallbackPerms = {
        canCreate: hasAccess,
        canUpdate: hasAccess
      };
      
      console.log('🔄 Fallback permissions:', fallbackPerms);
      setPermissions(fallbackPerms);
      setPermissionDenied(!hasAccess);
      return fallbackPerms;
      
    } catch (err: any) {
      console.error('❌ Error in checkPermissions:', err);
      
      // Default to no permissions on error
      setPermissions({ canCreate: false, canUpdate: false });
      setPermissionDenied(true);
      return { canCreate: false, canUpdate: false };
    }
  };

  useEffect(() => {
  const loadJob = async () => {
    await checkPermissions();
    if (isNewJob) return;

    try {
      setLoading(true);
      setError(null);

      // ✅ Correctly convert 'JOB-065' → '65'
      const numericId = id?.startsWith('JOB-') ? id.replace('JOB-', '') : id;

      // ✅ Call API with numeric ID
      const jobData = await fetchJobById(numericId);

      if (jobData.custom_fields && typeof jobData.custom_fields === 'object') {
        jobData.custom_fields = parseCustomFields(jobData.custom_fields); // ✅ ADD THIS LINE
      }
      
      setJob(jobData);

    
        } catch (err) {
          setError('Failed to load job details. Please try again later.');
        } finally {
          setLoading(false);
        }
      };
    
      loadJob();
    }, [id, isNewJob, user]);


  const handleInputChange = (field: keyof Job, value: any) => {
    setJob(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddQA = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) return;
    if (job.qaItems?.length >= 4) return;

    const newQA: QAItem = {
      id: `qa-${Math.random()}`,
      question: newQuestion.trim(),
      answer: newAnswer.trim()
    };

    setJob(prev => ({
      ...prev,
      qaItems: [...(prev.qaItems || []), newQA]
    }));

    setNewQuestion('');
    setNewAnswer('');
  };

  const handleRemoveQA = (qaId: string) => {
    setJob(prev => ({
      ...prev,
      qaItems: (prev.qaItems || []).filter(qa => qa.id !== qaId)
    }));
  };

  const handleGenerate = async () => {
    if (!job.description.trim()) return;

    try {
      setIsGenerating(true);
      setError(null);

      const response = await generateJobSummary(job.description);

      if (response.success) {
        setJob(prev => ({
          ...prev,
          summary: response.summary,
          qaItems: response.questions.map((qa, index) => ({
            id: `qa-${index}`,
            question: qa.question,
            answer: qa.answer
          })),
          titleBoolean: response.job_titles_boolean,
          skillBoolean: response.skills_boolean
        }));
      } else {
        setError('Failed to generate job summary. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while generating the job summary.');
    } finally {
      setIsGenerating(false);
    }
  };

const handleSave = async () => {
  try {
    setSaving(true);
    setError(null);

    if (!isNewJob && !permissions.canUpdate) {
      setError('Access Denied — You do not have the required permissions.');
      return;
    }

    // ✅ FIXED: Prepare custom fields for API - handle empty strings properly
    const customFieldsForAPI: Record<string, any> = {};
    
    if (job.custom_fields) {
      Object.entries(job.custom_fields).forEach(([key, field]: [string, any]) => {
        // ✅ FIXED: Convert empty strings to null only when saving
        customFieldsForAPI[key] = field.value === '' ? null : field.value;
      });
    }

    // ✅ FIXED: Use the correct API format
    const jobUpdateData = {
      ...job,
      custom_fields: customFieldsForAPI
    };

    const updatedJob = await updateJob(id, jobUpdateData);

    setJob(updatedJob);
    setIsEditing(false);
  } catch (err) {
    setError('Failed to save job. Please try again.');
  } finally {
    setSaving(false);
  }
};

  
  const handleCopyVideoLink = async () => {
    if (!id || !job.qaItems?.length) return;

    const interviewLink = `${window.location.origin}/video/interview/${id}`;
    
    try {
      await navigator.clipboard.writeText(interviewLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      setError('Failed to copy interview link. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  // Show permission denied message for new job creation
  if (isNewJob && permissionDenied) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Create New Job"
          subtitle="Access denied"
          actions={
            <Button variant="outline\" onClick={() => navigate('/jobs')}>
              Back to Jobs
            </Button>
          }
        />

        <div className="p-6 border border-red-200 rounded-md bg-red-50">
          <div className="flex items-center">
            <Lock className="w-8 h-8 text-red-400" />
            <div className="ml-4">
              <h3 className="text-lg font-medium text-red-800">Access Denied</h3>
              <p className="mt-2 text-sm text-red-700">
                You do not have the required permissions to create jobs.
              </p>
              <p className="mt-1 text-sm text-red-600">
                Please contact your administrator to request job creation access.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderField = (label: string, field: keyof Job, type: string = 'text') => (
    <div className="mb-4">
      <Input
        label={label}
        type={type}
        value={job[field]?.toString() || ''}
        onChange={(e) => handleInputChange(field, type === 'number' ? Number(e.target.value) : e.target.value)}
        disabled={!isEditing}
      />
    </div>
  );

  const renderSelect = (label: string, field: keyof Job, options: { value: string; label: string }[]) => (
    <div className="mb-4">
      <label className="block mb-1 text-sm font-medium text-gray-700">{label}</label>
      <select className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"

        value={job[field]?.toString()}
        onChange={(e) => handleInputChange(field, e.target.value)}
        disabled={!isEditing}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );

  const renderTextArea = (label: string, field: keyof Job, showGenerate: boolean = false) => (
    <div className="mb-4">
      <label className="block mb-1 text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <textarea className="w-full min-h-[200px] rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"

          value={job[field]?.toString() || ''}
          onChange={(e) => handleInputChange(field, e.target.value)}
          disabled={!isEditing || (field !== 'description' && isGenerating) || field === 'titleBoolean' || field === 'skillBoolean'}
        />
        {isEditing && showGenerate && field === 'description' && (
          <div className="absolute bottom-2 right-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleGenerate}
              disabled={!job[field]?.toString().trim() || isGenerating}
              className="flex items-center gap-2"
            >
              {isGenerating ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Wand2 className="w-4 h-4" />
              )}
              Generate
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={isNewJob ? 'Create New Job' : `Job Details - ${job.title}`}
        subtitle={`Job ID: ${job.id}`}
        actions={
          <div className="space-x-2">
            {isEditing ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsEditing(false);
                    if (isNewJob) navigate('/jobs');
                  }}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave}
                  isLoading={saving}
                  disabled={isNewJob && !permissions.canCreate}
                >
                  Save
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => setIsEditing(true)}
                disabled={!permissions.canUpdate}
              >
                Edit
              </Button>
            )}
          </div>
        }
      />

      {error && (
        <div className="p-4 border border-red-200 rounded-md bg-red-50 dark:bg-red-950 dark:border-red-700">

          <div className="flex items-center">
            <Lock className="w-5 h-5 mr-3 text-red-400" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
       

        {/* Job Details Section */}
        <Section title="Job Details" defaultOpen={true}>
          <div className="grid grid-cols-3 gap-4">
            {renderField('Job Title', 'title')}
            {renderSelect('Status', 'status', [
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' },
              { value: 'Closed', label: 'Closed' },
              { value: 'Draft', label: 'Draft' }
            ])}
            {renderSelect('Customer Type', 'customerType', [
              { value: 'Prime Vendor', label: 'Prime Vendor' },
              { value: 'Direct Client', label: 'Direct Client' },
              { value: 'Internal', label: 'Internal' }
            ])}
            {renderField('Customer', 'customer')}
            {renderField('End Client', 'endClient')}
            {renderField('Created By', 'createdBy')}
            {renderField('City', 'city')}
            {renderField('State', 'state')}
            {renderField('Country', 'country')}
            {renderField('Number of Positions', 'positions', 'number')}
            {renderSelect('Work Type', 'workType', [
              { value: 'Remote', label: 'Remote' },
              { value: 'Onsite', label: 'Onsite' },
              { value: 'Hybrid', label: 'Hybrid' }
            ])}
            {renderSelect('Experience Level', 'experienceLevel', [
              { value: 'Junior', label: 'Junior (5 Years and Below)' },
              { value: 'Mid', label: 'Mid (6 - 9 Years)' },
              { value: 'Senior', label: 'Senior (10+ Years)' }
            ])}
          </div>
        </Section>

          {job?.custom_fields && typeof job.custom_fields === 'object' && Object.keys(job.custom_fields).length > 0 && (
        <Section title="Custom Fields">
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(job.custom_fields).map(([key, field]: [string, any]) => {
              const hasActualValue = field.value !== null && field.value !== undefined;
              const hasDefaultValue = field.default_value !== null && field.default_value !== undefined && field.default_value !== '';

              const displayValue = isEditing
                ? (hasActualValue ? field.value : (hasDefaultValue ? field.default_value : ''))
                : (hasActualValue && field.value !== '' ? field.value : (hasDefaultValue ? field.default_value : ''));

              return (
                <div key={key} className="flex flex-col space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {field.field_label}
                    {field.is_required && <span className="text-red-500 ml-1">*</span>}
                  </label>

                  {isEditing ? (
                    field.field_type === 'SELECT' ? (
                      <select
                        className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={displayValue}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          setJob(prev => ({
                            ...prev,
                            custom_fields: {
                              ...prev.custom_fields,
                              [key]: {
                                ...field,
                                value: newValue
                              }
                            }
                          }));
                        }}
                      >
                        <option value=""> Select </option>
                        {(field.field_options?.split(',') || []).map((opt: string, idx: number) => (
                          <option key={idx} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={displayValue}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          setJob(prev => ({
                            ...prev,
                            custom_fields: {
                              ...prev.custom_fields,
                              [key]: {
                                ...field,
                                value: newValue
                              }
                            }
                          }));
                        }}
                        placeholder={field.placeholder || `Enter ${field.field_label}`}
                      />
                    )
                  ) : (
                    field.field_type === 'SELECT' ? (
                      // View mode styled like dropdown with arrow
                      <div className="relative">
                        <div className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 px-3 py-2 pr-10">
                          {displayValue !== '' && displayValue !== null && displayValue !== undefined
                            ? displayValue
                            : <span className="text-gray-500 italic">null</span>}
                        </div>
                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                      </div>
                    ) : (
                      <div className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 px-3 py-2">
                        {displayValue !== '' && displayValue !== null && displayValue !== undefined
                          ? displayValue
                          : <span className="text-gray-500 italic">null</span>}
                      </div>
                    )
                  )}
                </div>
              );
            })}
          </div>
        </Section>
      )}
        
        {/* Pay & Billing Details */}
        <Section title="Pay & Billing Details">
          <div className="grid grid-cols-3 gap-4">
            {renderSelect('Placement Type', 'placementType', [
              { value: 'Contractual', label: 'Contractual' },
              { value: 'Permanent', label: 'Permanent' }
            ])}
            {renderSelect('Client Pay Type', 'clientPayType', [
              { value: 'Monthly', label: 'Monthly' },
              { value: 'Hourly', label: 'Hourly' }
            ])}
            {renderSelect('Job Type', 'jobType', [
              { value: 'Contractual', label: 'Contractual' },
              { value: 'Permanent', label: 'Permanent' }
            ])}
            {renderSelect('Pay Type', 'payType', [
              { value: 'Hourly', label: 'Hourly' },
              { value: 'Monthly', label: 'Monthly' }
            ])}
            {renderField('Pay Rate from Customer', 'payRate', 'number')}
          </div>

          {job.payRate > 0 && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white border border-gray-200 rounded-lg dark:border-gray-700 dark:bg-gray-800">

                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Resident (USC, GC) - 80% of Pay Rate
                  </label>
                  <div className="flex items-center">
                    <span className="text-lg font-semibold text-blue-800">
                      ${(job.payRate * 0.8).toFixed(2)}
                    </span>
                    <span className="ml-1 text-sm text-gray-500">/hr</span>
                  </div>
                </div>

                <div className="p-4 bg-white border border-gray-200 rounded-lg dark:border-gray-700 dark:bg-gray-800">

                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Immigrant (H1B, H4 EAD, TN, Other Visas) - 75% of Pay Rate
                  </label>
                  <div className="flex items-center">
                    <span className="text-lg font-semibold text-blue-800">
                      ${(job.payRate * 0.75).toFixed(2)}
                    </span>
                    <span className="ml-1 text-sm text-gray-500">/hr</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Section>

        {/* Job Description */}
        <Section title="Job Description">
          {renderTextArea('Description', 'description', true)}
        </Section>

        {/* Job Summary */}
        <Section title="Job Summary">
          {renderTextArea('Summary', 'summary')}
        </Section>

        {/* GPT Q&A */}
        <Section title="GPT Q&A">
          {isEditing && (
            <div className="mb-6 space-y-4">
              <Input
                label="Question"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Enter a question"
              />
              <Input
                label="Answer"
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                placeholder="Enter the answer"
              />
              <Button
                onClick={handleAddQA}
                disabled={!newQuestion.trim() || !newAnswer.trim() || (job.qaItems?.length || 0) >= 4}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Q&A
              </Button>
            </div>
          )}
          
          <div className="space-y-4">
            {(job.qaItems || []).map((qa) => (
              <div key={qa.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{qa.question}</p>
                    <p className="mt-1 text-gray-600">{qa.answer}</p>
                  </div>
                  {isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveQA(qa.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Job Title Boolean */}
        <Section title="Job Title Boolean">
          {renderTextArea('Title Boolean Search', 'titleBoolean')}
        </Section>

        {/* Skill Boolean */}
        <Section title="Skill Boolean">
          {renderTextArea('Skill Boolean Search', 'skillBoolean')}
        </Section>
      </div>
    </div>
  );
};

export default JobDetailsPage;
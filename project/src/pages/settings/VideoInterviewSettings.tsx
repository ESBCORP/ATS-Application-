import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Video, 
  Save, 
  Plus, 
  Trash2, 
  Settings, 
  Users, 
  Clock, 
  BarChart3, 
  Edit3,
  Play,
  Upload,
  Check,
  AlertCircle,
  Mic,
  MessageSquare,
  User,
  Bot
} from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { fetchJobs } from '../../services/jobsService';
import { Job, QAItem } from '../../types';




const VideoInterviewSettings: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('templates');
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<any | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Interview templates
  const [interviewTemplates, setInterviewTemplates] = useState([
    {
      id: 1,
      name: 'Standard Technical Interview',
      description: 'A general technical interview for software engineering positions',
      jobId: 'OOJ-4361',
      jobTitle: 'Salesforce Developer',
      aiInterviewer: 'Jack',
      aiVoice: 'en-US-GuyNeural',
      duration: 30,
      maxResponseTime: 120,
      questions: [
        {
          id: 'q1',
          question: 'Can you explain your experience with Salesforce development?',
          expectedKeywords: ['apex', 'lightning', 'visualforce', 'triggers', 'flows'],
          followUp: 'What was the most complex Salesforce solution you\'ve implemented?'
        },
        {
          id: 'q2',
          question: 'How do you approach testing in Salesforce?',
          expectedKeywords: ['unit tests', 'test coverage', 'test class', 'assertions'],
          followUp: 'Can you describe a situation where thorough testing prevented a production issue?'
        },
        {
          id: 'q3',
          question: 'What experience do you have with Salesforce integrations?',
          expectedKeywords: ['api', 'rest', 'soap', 'middleware', 'mulesoft'],
          followUp: 'What challenges did you face during integration projects?'
        }
      ],
      introScript: 'Hello, I\'m Jack, your AI interviewer today. I\'ll be asking you some questions about your experience with Salesforce development. Please take your time to answer thoroughly.',
      outroScript: 'Thank you for participating in this interview. Your responses have been recorded and will be reviewed by our hiring team. We appreciate your time and interest in the position.',
      active: true,
      usageCount: 42
    },
    {
      id: 2,
      name: 'Java Developer Interview',
      description: 'Technical interview for Java developer positions',
      jobId: 'OOJ-4362',
      jobTitle: 'Java Developer',
      aiInterviewer: 'Emma',
      aiVoice: 'en-US-JennyNeural',
      duration: 25,
      maxResponseTime: 90,
      questions: [
        {
          id: 'q1',
          question: 'Can you explain your experience with Java development frameworks?',
          expectedKeywords: ['spring', 'hibernate', 'spring boot', 'microservices'],
          followUp: 'Which framework do you prefer and why?'
        },
        {
          id: 'q2',
          question: 'How do you handle concurrency in Java?',
          expectedKeywords: ['threads', 'synchronization', 'locks', 'atomic', 'concurrent'],
          followUp: 'Can you describe a situation where you had to solve a concurrency issue?'
        }
      ],
      introScript: 'Hello, I\'m Emma, your AI interviewer today. I\'ll be asking you some questions about your Java development experience. Please take your time to answer thoroughly.',
      outroScript: 'Thank you for participating in this interview. Your responses have been recorded and will be reviewed by our hiring team.',
      active: true,
      usageCount: 28
    }
  ]);

  // AI Interviewer profiles
  const [aiProfiles, setAiProfiles] = useState([
    {
      id: 1,
      name: 'Jack',
      role: 'Technical Interviewer',
      voice: 'en-US-GuyNeural',
      avatar: '/image1.png',

      personality: 'Professional and technical, asks follow-up questions',
      interviewStyle: 'Structured technical assessment'
    },
    {
      id: 2,
      name: 'Emma',
      role: 'HR Interviewer',
      voice: 'en-US-JennyNeural',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      personality: 'Friendly and conversational, focuses on soft skills',
      interviewStyle: 'Behavioral and cultural fit assessment'
    },
    {
      id: 3,
      name: 'David',
      role: 'Senior Technical Interviewer',
      voice: 'en-US-DavisNeural',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      personality: 'Direct and analytical, probes for depth of knowledge',
      interviewStyle: 'In-depth technical deep dive'
    }
  ]);

  // Interview analytics
  const [analytics, setAnalytics] = useState({
    totalInterviews: 70,
    completionRate: 92,
    avgDuration: 22,
    candidateRating: 4.2,
    keywordMatchRate: 68,
    topPerformingTemplate: 'Standard Technical Interview',
    mostMissedKeywords: ['microservices', 'kubernetes', 'ci/cd']
  });

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);
        const response = await fetchJobs(1, 100);
        setJobs(response.data.filter(job => job.qaItems && job.qaItems.length > 0));
      } catch (err) {
        console.error('Failed to load jobs:', err);
        setError('Failed to load jobs with interview questions');
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  const handleSaveTemplate = (templateData: any) => {
    if (editingTemplate) {
      setInterviewTemplates(prev => prev.map(template => 
        template.id === editingTemplate.id ? { ...template, ...templateData } : template
      ));
    } else {
      const newTemplate = {
        id: Date.now(),
        ...templateData,
        usageCount: 0
      };
      setInterviewTemplates(prev => [...prev, newTemplate]);
    }
    setEditingTemplate(null);
  };

  const handleDeleteTemplate = (templateId: number) => {
    if (confirm('Are you sure you want to delete this template?')) {
      setInterviewTemplates(prev => prev.filter(template => template.id !== templateId));
    }
  };

  const handleCreateFromJob = (job: Job) => {
    if (!job.qaItems || job.qaItems.length === 0) {
      setError('This job does not have any interview questions');
      return;
    }

    const newTemplate = {
      id: Date.now(),
      name: `${job.title} Interview`,
      description: `Interview template for ${job.title} position`,
      jobId: job.id,
      jobTitle: job.title,
      aiInterviewer: 'Jack',
      aiVoice: 'en-US-GuyNeural',
      duration: 30,
      maxResponseTime: 120,
      questions: job.qaItems.map((qa: QAItem, index: number) => ({
        id: `q${index + 1}`,
        question: qa.question,
        expectedKeywords: [],
        followUp: ''
      })),
      introScript: `Hello, I'm Jack, your AI interviewer today. I'll be asking you some questions about your experience for the ${job.title} position. Please take your time to answer thoroughly.`,
      outroScript: 'Thank you for participating in this interview. Your responses have been recorded and will be reviewed by our hiring team.',
      active: true,
      usageCount: 0
    };

    setEditingTemplate(newTemplate);
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const TemplateEditor = ({ template, onSave, onCancel }: any) => {
    const [formData, setFormData] = useState({
      name: template?.name || '',
      description: template?.description || '',
      jobId: template?.jobId || '',
      jobTitle: template?.jobTitle || '',
      aiInterviewer: template?.aiInterviewer || 'Jack',
      aiVoice: template?.aiVoice || 'en-US-GuyNeural',
      duration: template?.duration || 30,
      maxResponseTime: template?.maxResponseTime || 120,
      questions: template?.questions || [],
      introScript: template?.introScript || '',
      outroScript: template?.outroScript || '',
      active: template?.active !== false
    });

    const addQuestion = () => {
      setFormData(prev => ({
        ...prev,
        questions: [...prev.questions, { 
          id: `q${Date.now()}`, 
          question: '', 
          expectedKeywords: [],
          followUp: ''
        }]
      }));
    };

    const handleQuestionChange = (index: number, field: string, value: any) => {
      const newQuestions = [...formData.questions];
      newQuestions[index] = { ...newQuestions[index], [field]: value };
      setFormData(prev => ({ ...prev, questions: newQuestions }));
    };

    const handleKeywordsChange = (index: number, value: string) => {
      const keywords = value.split(',').map(k => k.trim()).filter(Boolean);
      handleQuestionChange(index, 'expectedKeywords', keywords);
    };

    const removeQuestion = (index: number) => {
      const newQuestions = [...formData.questions];
      newQuestions.splice(index, 1);
      setFormData(prev => ({ ...prev, questions: newQuestions }));
    };

    const selectedJob = jobs.find(job => job.id === formData.jobId);

    return (
     <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
  <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
    {template?.id ? 'Edit Interview Template' : 'Create New Interview Template'}
  </h3>

  <div className="space-y-6">
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Input
        label="Template Name"
        value={formData.name}
        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        placeholder="e.g., Technical Interview"
      />

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Job Position</label>
        <select
          value={formData.jobId}
          onChange={(e) => {
            const selectedJob = jobs.find(job => job.id === e.target.value);
            setFormData(prev => ({ 
              ...prev, 
              jobId: e.target.value,
              jobTitle: selectedJob?.title || prev.jobTitle
            }));
          }}
          className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md dark:border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="">Select job position...</option>
          {jobs.map(job => (
            <option key={job.id} value={job.id}>{job.title}</option>
          ))}
        </select>
      </div>
    </div>

    <div>
      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
      <textarea
        value={formData.description}
        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        rows={2}
        className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md dark:border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        placeholder="Describe the purpose of this interview template"
      />
    </div>

    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">AI Interviewer</label>
        <select
          value={formData.aiInterviewer}
          onChange={(e) => setFormData(prev => ({ ...prev, aiInterviewer: e.target.value }))}
          className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md dark:border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        >
          {aiProfiles.map(profile => (
            <option key={profile.id} value={profile.name}>{profile.name} ({profile.role})</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">AI Voice</label>
        <select
          value={formData.aiVoice}
          onChange={(e) => setFormData(prev => ({ ...prev, aiVoice: e.target.value }))}
          className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md dark:border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="en-US-GuyNeural">Guy (Male)</option>
          <option value="en-US-JennyNeural">Jenny (Female)</option>
          <option value="en-US-DavisNeural">Davis (Male)</option>
          <option value="en-US-AriaNeural">Aria (Female)</option>
        </select>
      </div>
    </div>

    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Input
        label="Interview Duration (minutes)"
        type="number"
        value={formData.duration}
        onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
      />

      <Input
        label="Max Response Time (seconds)"
        type="number"
        value={formData.maxResponseTime}
        onChange={(e) => setFormData(prev => ({ ...prev, maxResponseTime: parseInt(e.target.value) }))}
      />
    </div>

    <div>
      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Introduction Script</label>
      <textarea
        value={formData.introScript}
        onChange={(e) => setFormData(prev => ({ ...prev, introScript: e.target.value }))}
        rows={3}
        className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md dark:border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        placeholder="Script for the AI to introduce the interview"
      />
    </div>

    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Interview Questions</label>
        <div className="flex space-x-2">
          {selectedJob && selectedJob.qaItems && selectedJob.qaItems.length > 0 && (
            <button
              onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  questions: selectedJob.qaItems.map((qa, index) => ({
                    id: `q${index + 1}`,
                    question: qa.question,
                    expectedKeywords: [],
                    followUp: ''
                  }))
                }));
              }}
              className="flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <Plus className="w-4 h-4 mr-1" />
              Import from Job
            </button>
          )}
          <button
            onClick={addQuestion}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Question
          </button>
        </div>
      </div>

            
            <div className="space-y-4">
            {formData.questions.map((question, index) => (
              <div
                key={question.id}
                className="p-4 bg-white border border-gray-200 rounded-lg dark:border-gray-600 dark:bg-gray-800"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded dark:text-blue-200 dark:bg-blue-900">
                    Question {index + 1}
                  </span>
                  <button
                    onClick={() => removeQuestion(index)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Question</label>
                    <textarea
                      value={question.question}
                      onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md dark:border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter interview question"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Expected Keywords (comma-separated)</label>
                    <input
                      type="text"
                      value={question.expectedKeywords.join(', ')}
                      onChange={(e) => handleKeywordsChange(index, e.target.value)}
                      className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md dark:border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="e.g., java, spring, microservices"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Follow-up Question</label>
                    <input
                      type="text"
                      value={question.followUp}
                      onChange={(e) => handleQuestionChange(index, 'followUp', e.target.value)}
                      className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md dark:border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Optional follow-up question"
                    />
                  </div>
                </div>
                </div>
              ))}
              
              {formData.questions.length === 0 && (
                <div className="py-8 text-center border border-gray-300 border-dashed rounded-lg">
                  <p className="text-gray-500">No questions added yet</p>
                  <button
                    onClick={addQuestion}
                    className="flex items-center mx-auto mt-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Question
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Conclusion Script</label>
            <textarea
              value={formData.outroScript}
              onChange={(e) => setFormData(prev => ({ ...prev, outroScript: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Script for the AI to conclude the interview"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="active-template"
              checked={formData.active}
              onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="active-template" className="ml-2 text-sm text-gray-700">
              Active (template will be available for interviews)
            </label>
          </div>
        </div>

        <div className="flex justify-end mt-6 space-x-2">
          <Button
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            onClick={() => onSave(formData)}
          >
            Save Template
          </Button>
        </div>
      </div>
    );
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Video Interview Settings"
        subtitle="Configure AI-powered video interviews"
        actions={
          <div className="flex space-x-3">
            {activeTab === 'templates' && !editingTemplate && (
              <Button 
                onClick={() => setEditingTemplate({})}
                className="flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Template
              </Button>
            )}
            {activeTab === 'settings' && (
              <Button 
                onClick={handleSaveSettings}
                isLoading={saving}
                className="flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
            )}
          </div>
        }
      />

      {success && (
        <div className="p-4 border border-green-200 rounded-md bg-green-50">
          <div className="flex items-center">
            <Check className="w-5 h-5 mr-3 text-green-400" />
            <div>
              <h3 className="text-sm font-medium text-green-800">Success</h3>
              <p className="mt-1 text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 border border-red-200 rounded-md bg-red-50">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-3 text-red-400" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
<div className="grid grid-cols-1 gap-6 md:grid-cols-4">
  <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800 dark:shadow-lg">
    <div className="flex items-center">
      <Video className="w-8 h-8 text-blue-600" />
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Interviews</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.totalInterviews}</p>
      </div>
    </div>
  </div>

  <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800 dark:shadow-lg">
    <div className="flex items-center">
      <Users className="w-8 h-8 text-green-600" />
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Completion Rate</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.completionRate}%</p>
      </div>
    </div>
  </div>

  <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800 dark:shadow-lg">
    <div className="flex items-center">
      <Clock className="w-8 h-8 text-yellow-600" />
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Avg Duration</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.avgDuration} min</p>
      </div>
    </div>
  </div>

  <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800 dark:shadow-lg">
    <div className="flex items-center">
      <BarChart3 className="w-8 h-8 text-purple-600" />
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Keyword Match</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.keywordMatchRate}%</p>
      </div>
      </div>
        </div>
      </div>

    {/* Tabs */}
<div className="bg-white rounded-lg shadow dark:bg-gray-900">
  <div className="border-b border-gray-200 dark:border-gray-700">
    <nav className="flex px-6 -mb-px space-x-8">
      {[
        { id: 'templates', label: 'Interview Templates', icon: Video },
        { id: 'ai-profiles', label: 'AI Interviewers', icon: Bot },
        { id: 'job-questions', label: 'Job Questions', icon: MessageSquare },
        { id: 'settings', label: 'Global Settings', icon: Settings }
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
            activeTab === tab.id
              ? 'border-blue-500 text-blue-600 hover:text-blue-800 hover:underline dark:text-[#29D3C0] dark:border-[#29D3C0] dark:hover:text-[#29D3C0]'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600'
          }`}
        >
          <tab.icon className="w-4 h-4 mr-2" />
          {tab.label}
        </button>
      ))}
    </nav>
  </div>

  <div className="p-6">
    {/* Interview Templates Tab */}
    {activeTab === 'templates' && !editingTemplate && (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Interview Templates</h2>
        </div>

        <div className="space-y-4">
          {interviewTemplates.map((template) => (
            <div key={template.id} className="p-4 bg-white border border-gray-200 rounded-lg dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2 space-x-3">
                    <h3 className="font-medium text-gray-900 dark:text-white">{template.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      template.active
                        ? 'bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {template.active ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Used {template.usageCount} times
                    </span>
                  </div>
                  <p className="mb-2 text-sm text-gray-600 dark:text-gray-300">{template.description}</p>
                  <p className="mb-2 text-sm text-gray-600 dark:text-gray-300">Job: {template.jobTitle}</p>

                  <div className="mt-3">
                    <p className="mb-2 text-xs font-medium text-gray-700 dark:text-gray-300">Questions:</p>
                    <div className="space-y-2">
                      {template.questions.map((question, idx) => (
                        <div
                          key={idx}
                          className="p-2 text-xs text-gray-900 border border-gray-200 rounded dark:border-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-white"
                        >
                          <p className="font-medium">{question.question}</p>
                          {question.followUp && (
                            <p className="mt-1 text-gray-600 dark:text-gray-300">Follow-up: {question.followUp}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex ml-4 space-x-2">
                  <button
                    onClick={() => setEditingTemplate(template)}
                    className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                    onClick={() => navigate(`/video/preview/${template.id}`)}
                  >
                    <Play className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    onClick={() => handleDeleteTemplate(template.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Template Editor */}
          {activeTab === 'templates' && editingTemplate && (
            <TemplateEditor
              template={editingTemplate}
              onSave={handleSaveTemplate}
              onCancel={() => setEditingTemplate(null)}
            />
          )}

         {/* AI Profiles Tab */}
{activeTab === 'ai-profiles' && (
  <div>
   <div className="flex items-center justify-between mb-6">
  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">AI Interviewer Profiles</h2>
  <Button
    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 dark:bg-[#29D3C0] dark:hover:bg-[#25b5a8]"
  >
    <Plus className="w-4 h-4 mr-2" />
    New AI Profile
  </Button>
</div>


    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {aiProfiles.map((profile) => (
        <div key={profile.id} className="p-6 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-700">
          <div className="flex flex-col items-center mb-4 text-center">
            <div className="w-24 h-24 mb-3 overflow-hidden rounded-full ring-2 ring-gray-200 dark:ring-gray-700">
              <img 
                src={profile.avatar} 
                alt={profile.name} 
                className="object-cover w-full h-full"
              />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{profile.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{profile.role}</p>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Mic className="w-4 h-4 mr-2" />
              <span>Voice: {profile.voice.replace('en-US-', '').replace('Neural', '')}</span>
            </div>
            <div>
              <p className="mb-1 font-medium text-gray-700 dark:text-gray-300">Personality:</p>
              <p className="text-gray-600 dark:text-gray-400">{profile.personality}</p>
            </div>
            <div>
              <p className="mb-1 font-medium text-gray-700 dark:text-gray-300">Interview Style:</p>
              <p className="text-gray-600 dark:text-gray-400">{profile.interviewStyle}</p>
            </div>
          </div>
          
          <div className="flex justify-center mt-4 space-x-2">
            <Button variant="outline" size="sm" className="text-blue-600 hover:text-blue-800 dark:text-[#29D3C0] dark:hover:text-[#29D3C0]">
              <Edit3 className="w-3 h-3 mr-1" />
              Edit
            </Button>
            <Button variant="outline" size="sm" className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300">
              <Play className="w-3 h-3 mr-1" />
              Preview
            </Button>
          </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Job Questions Tab */}
          {activeTab === 'job-questions' && (
  <div>
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Job Questions</h2>
      <div className="relative w-64">
        <input
          type="text"
          placeholder="Search jobs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md 
                     focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500
                     dark:bg-gray-800 dark:border-gray-600 dark:text-white 
                     dark:placeholder-gray-400 dark:focus:border-[#29D3C0] dark:focus:ring-[#29D3C0]"
        />
      </div>
    </div>

    {loading ? (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-b-2 border-blue-600 rounded-full animate-spin dark:border-[#29D3C0]"></div>
      </div>
    ) : (
      <div className="space-y-6">
        {filteredJobs.length === 0 ? (
          <div className="py-12 text-center border border-gray-300 border-dashed rounded-lg dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">No jobs with interview questions found</p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div key={job.id} className="p-4 border border-gray-200 rounded-lg dark:border-gray-700 dark:bg-gray-900">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{job.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">ID: {job.id}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-blue-600 hover:text-blue-800 hover:underline dark:text-[#29D3C0] dark:hover:text-[#29D3C0]"
                  onClick={() => handleCreateFromJob(job)}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Create Template
                </Button>
              </div>
                        
                        <div className="space-y-3">
                          {job.qaItems && job.qaItems.map((qa, index) => (
                            <div key={index} className="p-3 border border-gray-200 rounded bg-gray-50">
                              <p className="text-sm font-medium">{qa.question}</p>
                              <p className="mt-1 text-xs text-gray-600">{qa.answer}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
  <div className="space-y-6">
    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Global Settings</h2>

    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Default Interview Duration (minutes)
        </label>
        <input
          type="number"
          value="30"
          className="w-full p-3 border border-gray-300 rounded-md 
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     dark:bg-gray-800 dark:border-gray-600 dark:text-white 
                     dark:placeholder-gray-400 dark:focus:ring-[#29D3C0]"
        />
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Default Response Time Limit (seconds)
        </label>
        <input
          type="number"
          value="120"
          className="w-full p-3 border border-gray-300 rounded-md 
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     dark:bg-gray-800 dark:border-gray-600 dark:text-white 
                     dark:placeholder-gray-400 dark:focus:ring-[#29D3C0]"
        />
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Default AI Interviewer
        </label>
        <select
          className="w-full p-3 border border-gray-300 rounded-md 
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     dark:bg-gray-800 dark:border-gray-600 dark:text-white 
                     dark:focus:ring-[#29D3C0]"
        >
          {aiProfiles.map(profile => (
            <option key={profile.id} value={profile.name}>
              {profile.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Default Voice
        </label>
        <select
          className="w-full p-3 border border-gray-300 rounded-md 
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     dark:bg-gray-800 dark:border-gray-600 dark:text-white 
                     dark:focus:ring-[#29D3C0]"
        >
          <option value="en-US-GuyNeural">Guy (Male)</option>
          <option value="en-US-JennyNeural">Jenny (Female)</option>
          <option value="en-US-DavisNeural">Davis (Male)</option>
          <option value="en-US-AriaNeural">Aria (Female)</option>
        </select>
      </div>
    </div>
              
             <div className="mt-6 space-y-4">
  <h3 className="font-medium text-gray-800 text-md dark:text-white">Interview Behavior</h3>

  <div className="flex items-center">
    <input
      type="checkbox"
      id="auto-followup"
      checked={true}
      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-[#29D3C0] dark:border-gray-600 dark:bg-gray-800"
    />
    <label htmlFor="auto-followup" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
      Enable automatic follow-up questions
    </label>
  </div>

  <div className="flex items-center">
    <input
      type="checkbox"
      id="keyword-analysis"
      checked={true}
      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-[#29D3C0] dark:border-gray-600 dark:bg-gray-800"
    />
    <label htmlFor="keyword-analysis" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
      Enable keyword analysis in responses
    </label>
  </div>

  <div className="flex items-center">
    <input
      type="checkbox"
      id="sentiment-analysis"
      checked={true}
      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-[#29D3C0] dark:border-gray-600 dark:bg-gray-800"
    />
    <label htmlFor="sentiment-analysis" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
      Enable sentiment analysis
    </label>
  </div>

  <div className="flex items-center">
    <input
      type="checkbox"
      id="record-interviews"
      checked={true}
      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-[#29D3C0] dark:border-gray-600 dark:bg-gray-800"
    />
    <label htmlFor="record-interviews" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
      Record and store interviews
    </label>
  </div>
</div>

<div className="mt-6 space-y-4">
  <h3 className="font-medium text-gray-800 text-md dark:text-white">Notification Settings</h3>

  <div className="flex items-center">
    <input
      type="checkbox"
      id="notify-completion"
      checked={true}
      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-[#29D3C0] dark:border-gray-600 dark:bg-gray-800"
    />
    <label htmlFor="notify-completion" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
      Notify recruiters when interviews are completed
    </label>
  </div>

  <div className="flex items-center">
    <input
      type="checkbox"
      id="notify-candidates"
      checked={true}
      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-[#29D3C0] dark:border-gray-600 dark:bg-gray-800"
    />
    <label htmlFor="notify-candidates" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
      Send confirmation emails to candidates
    </label>
  </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoInterviewSettings;
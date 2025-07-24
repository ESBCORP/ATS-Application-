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
      avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=150',
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
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">
          {template?.id ? 'Edit Interview Template' : 'Create New Interview Template'}
        </h3>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Template Name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Technical Interview"
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Position</label>
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
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select job position...</option>
                {jobs.map(job => (
                  <option key={job.id} value={job.id}>{job.title}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={2}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Describe the purpose of this interview template"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">AI Interviewer</label>
              <select
                value={formData.aiInterviewer}
                onChange={(e) => setFormData(prev => ({ ...prev, aiInterviewer: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {aiProfiles.map(profile => (
                  <option key={profile.id} value={profile.name}>{profile.name} ({profile.role})</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">AI Voice</label>
              <select
                value={formData.aiVoice}
                onChange={(e) => setFormData(prev => ({ ...prev, aiVoice: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="en-US-GuyNeural">Guy (Male)</option>
                <option value="en-US-JennyNeural">Jenny (Female)</option>
                <option value="en-US-DavisNeural">Davis (Male)</option>
                <option value="en-US-AriaNeural">Aria (Female)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Introduction Script</label>
            <textarea
              value={formData.introScript}
              onChange={(e) => setFormData(prev => ({ ...prev, introScript: e.target.value }))}
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Script for the AI to introduce the interview"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Interview Questions</label>
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
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Import from Job
                  </button>
                )}
                <button
                  onClick={addQuestion}
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Question
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              {formData.questions.map((question, index) => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">Question {index + 1}</span>
                    <button
                      onClick={() => removeQuestion(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                      <textarea
                        value={question.question}
                        onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                        rows={2}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Enter interview question"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expected Keywords (comma-separated)</label>
                      <input
                        type="text"
                        value={question.expectedKeywords.join(', ')}
                        onChange={(e) => handleKeywordsChange(index, e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="e.g., java, spring, microservices"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Question</label>
                      <input
                        type="text"
                        value={question.followUp}
                        onChange={(e) => handleQuestionChange(index, 'followUp', e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Optional follow-up question"
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              {formData.questions.length === 0 && (
                <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500">No questions added yet</p>
                  <button
                    onClick={addQuestion}
                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm flex items-center mx-auto"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Question
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Conclusion Script</label>
            <textarea
              value={formData.outroScript}
              onChange={(e) => setFormData(prev => ({ ...prev, outroScript: e.target.value }))}
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Script for the AI to conclude the interview"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="active-template"
              checked={formData.active}
              onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="active-template" className="ml-2 text-sm text-gray-700">
              Active (template will be available for interviews)
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
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
        <div className="rounded-md bg-green-50 p-4 border border-green-200">
          <div className="flex items-center">
            <Check className="h-5 w-5 text-green-400 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-green-800">Success</h3>
              <p className="text-sm text-green-700 mt-1">{success}</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Video className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Interviews</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalInterviews}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.completionRate}%</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Duration</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.avgDuration} min</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <BarChart3 className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Keyword Match</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.keywordMatchRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
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
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Interview Templates</h2>
              </div>

              <div className="space-y-4">
                {interviewTemplates.map((template) => (
                  <div key={template.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-medium text-gray-900">{template.name}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            template.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {template.active ? 'Active' : 'Inactive'}
                          </span>
                          <span className="text-sm text-gray-500">
                            Used {template.usageCount} times
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                        <p className="text-sm text-gray-600 mb-2">Job: {template.jobTitle}</p>
                        
                        <div className="mt-3">
                          <p className="text-xs font-medium text-gray-700 mb-2">Questions:</p>
                          <div className="space-y-2">
                            {template.questions.map((question, idx) => (
                              <div key={idx} className="text-xs bg-gray-50 p-2 rounded border border-gray-200">
                                <p className="font-medium">{question.question}</p>
                                {question.followUp && (
                                  <p className="mt-1 text-gray-600">Follow-up: {question.followUp}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => setEditingTemplate(template)}
                          className="p-2 text-blue-600 hover:text-blue-800"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-2 text-green-600 hover:text-green-800"
                          onClick={() => navigate(`/video/preview/${template.id}`)}
                        >
                          <Play className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-2 text-red-600 hover:text-red-800"
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
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">AI Interviewer Profiles</h2>
                <Button className="flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  New AI Profile
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {aiProfiles.map((profile) => (
                  <div key={profile.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex flex-col items-center text-center mb-4">
                      <div className="w-24 h-24 rounded-full overflow-hidden mb-3">
                        <img 
                          src={profile.avatar} 
                          alt={profile.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="font-medium text-lg">{profile.name}</h3>
                      <p className="text-sm text-gray-600">{profile.role}</p>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center">
                        <Mic className="w-4 h-4 text-gray-500 mr-2" />
                        <span>Voice: {profile.voice.replace('en-US-', '').replace('Neural', '')}</span>
                      </div>
                      <div>
                        <p className="font-medium mb-1">Personality:</p>
                        <p className="text-gray-600">{profile.personality}</p>
                      </div>
                      <div>
                        <p className="font-medium mb-1">Interview Style:</p>
                        <p className="text-gray-600">{profile.interviewStyle}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-center mt-4 space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit3 className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
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
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Job Questions</h2>
                <div className="relative w-64">
                  <input
                    type="text"
                    placeholder="Search jobs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredJobs.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
                      <p className="text-gray-500">No jobs with interview questions found</p>
                    </div>
                  ) : (
                    filteredJobs.map((job) => (
                      <div key={job.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-medium text-gray-900">{job.title}</h3>
                            <p className="text-sm text-gray-600">ID: {job.id}</p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleCreateFromJob(job)}
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Create Template
                          </Button>
                        </div>
                        
                        <div className="space-y-3">
                          {job.qaItems && job.qaItems.map((qa, index) => (
                            <div key={index} className="bg-gray-50 p-3 rounded border border-gray-200">
                              <p className="font-medium text-sm">{qa.question}</p>
                              <p className="text-xs text-gray-600 mt-1">{qa.answer}</p>
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
              <h2 className="text-lg font-semibold">Global Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Default Interview Duration (minutes)</label>
                  <input
                    type="number"
                    value="30"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Default Response Time Limit (seconds)</label>
                  <input
                    type="number"
                    value="120"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Default AI Interviewer</label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {aiProfiles.map(profile => (
                      <option key={profile.id} value={profile.name}>{profile.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Default Voice</label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="en-US-GuyNeural">Guy (Male)</option>
                    <option value="en-US-JennyNeural">Jenny (Female)</option>
                    <option value="en-US-DavisNeural">Davis (Male)</option>
                    <option value="en-US-AriaNeural">Aria (Female)</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-4 mt-6">
                <h3 className="text-md font-medium text-gray-800">Interview Behavior</h3>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="auto-followup"
                    checked={true}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="auto-followup" className="ml-2 text-sm text-gray-700">
                    Enable automatic follow-up questions
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="keyword-analysis"
                    checked={true}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="keyword-analysis" className="ml-2 text-sm text-gray-700">
                    Enable keyword analysis in responses
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="sentiment-analysis"
                    checked={true}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="sentiment-analysis" className="ml-2 text-sm text-gray-700">
                    Enable sentiment analysis
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="record-interviews"
                    checked={true}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="record-interviews" className="ml-2 text-sm text-gray-700">
                    Record and store interviews
                  </label>
                </div>
              </div>
              
              <div className="space-y-4 mt-6">
                <h3 className="text-md font-medium text-gray-800">Notification Settings</h3>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notify-completion"
                    checked={true}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="notify-completion" className="ml-2 text-sm text-gray-700">
                    Notify recruiters when interviews are completed
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notify-candidates"
                    checked={true}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="notify-candidates" className="ml-2 text-sm text-gray-700">
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
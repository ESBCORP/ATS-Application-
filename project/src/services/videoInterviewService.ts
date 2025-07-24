import api from './api';
import speechService from './speechService';

interface InterviewTemplate {
  id: number;
  name: string;
  description: string;
  jobId: string;
  jobTitle: string;
  aiInterviewer: string;
  aiVoice: string;
  duration: number;
  maxResponseTime: number;
  questions: {
    id: string;
    question: string;
    expectedKeywords: string[];
    followUp: string;
  }[];
  introScript: string;
  outroScript: string;
  active: boolean;
  usageCount: number;
}

interface InterviewSession {
  id: string;
  templateId: number;
  candidateId: string;
  candidateName: string;
  jobId: string;
  jobTitle: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  responses: {
    questionId: string;
    question: string;
    response: string;
    keywordsDetected: string[];
    followUpResponse?: string;
    sentimentScore?: number;
  }[];
  recordingUrl?: string;
  transcriptUrl?: string;
  aiInterviewer: string;
}

interface InterviewAnalysis {
  keywordMatchRate: number;
  detectedKeywords: string[];
  missedKeywords: string[];
  sentimentScore: number;
  confidenceScore: number;
  recommendedNextSteps: string;
  strengths: string[];
  weaknesses: string[];
}

class VideoInterviewService {
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    try {
      // Initialize speech service
      this.isInitialized = true;
      console.log('✅ Video interview service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize video interview service:', error);
      this.isInitialized = false;
    }
  }

  async fetchTemplates(): Promise<InterviewTemplate[]> {
    try {
      // In a real implementation, this would be an API call
      // For now, return mock data
      return [
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
      ];
    } catch (error) {
      console.error('Failed to fetch interview templates:', error);
      throw new Error('Failed to fetch interview templates');
    }
  }

  async fetchTemplateById(id: string): Promise<InterviewTemplate> {
    try {
      // In a real implementation, this would be an API call
      // For now, return mock data
      const templates = await this.fetchTemplates();
      const template = templates.find(t => t.id.toString() === id);
      
      if (!template) {
        throw new Error('Template not found');
      }
      
      return template;
    } catch (error) {
      console.error(`Failed to fetch interview template with ID ${id}:`, error);
      throw new Error('Failed to fetch interview template');
    }
  }

  async createTemplate(templateData: Partial<InterviewTemplate>): Promise<InterviewTemplate> {
    try {
      // In a real implementation, this would be an API call
      // For now, return mock data with the new ID
      return {
        id: Date.now(),
        name: templateData.name || 'New Template',
        description: templateData.description || '',
        jobId: templateData.jobId || '',
        jobTitle: templateData.jobTitle || '',
        aiInterviewer: templateData.aiInterviewer || 'Jack',
        aiVoice: templateData.aiVoice || 'en-US-GuyNeural',
        duration: templateData.duration || 30,
        maxResponseTime: templateData.maxResponseTime || 120,
        questions: templateData.questions || [],
        introScript: templateData.introScript || '',
        outroScript: templateData.outroScript || '',
        active: templateData.active !== false,
        usageCount: 0
      };
    } catch (error) {
      console.error('Failed to create interview template:', error);
      throw new Error('Failed to create interview template');
    }
  }

  async updateTemplate(id: number, templateData: Partial<InterviewTemplate>): Promise<InterviewTemplate> {
    try {
      // In a real implementation, this would be an API call
      // For now, return mock data
      return {
        id,
        name: templateData.name || 'Updated Template',
        description: templateData.description || '',
        jobId: templateData.jobId || '',
        jobTitle: templateData.jobTitle || '',
        aiInterviewer: templateData.aiInterviewer || 'Jack',
        aiVoice: templateData.aiVoice || 'en-US-GuyNeural',
        duration: templateData.duration || 30,
        maxResponseTime: templateData.maxResponseTime || 120,
        questions: templateData.questions || [],
        introScript: templateData.introScript || '',
        outroScript: templateData.outroScript || '',
        active: templateData.active !== false,
        usageCount: templateData.usageCount || 0
      };
    } catch (error) {
      console.error(`Failed to update interview template with ID ${id}:`, error);
      throw new Error('Failed to update interview template');
    }
  }

  async deleteTemplate(id: number): Promise<void> {
    try {
      // In a real implementation, this would be an API call
      console.log(`Template with ID ${id} deleted`);
    } catch (error) {
      console.error(`Failed to delete interview template with ID ${id}:`, error);
      throw new Error('Failed to delete interview template');
    }
  }

  async startInterview(templateId: number, candidateId: string): Promise<InterviewSession> {
    try {
      // In a real implementation, this would be an API call
      // For now, return mock data
      const template = await this.fetchTemplateById(templateId.toString());
      
      return {
        id: `interview-${Date.now()}`,
        templateId,
        candidateId,
        candidateName: 'John Doe',
        jobId: template.jobId,
        jobTitle: template.jobTitle,
        startTime: new Date().toISOString(),
        status: 'in-progress',
        responses: [],
        aiInterviewer: template.aiInterviewer
      };
    } catch (error) {
      console.error(`Failed to start interview with template ID ${templateId}:`, error);
      throw new Error('Failed to start interview');
    }
  }

  async endInterview(sessionId: string): Promise<InterviewSession> {
    try {
      // In a real implementation, this would be an API call
      // For now, return mock data
      return {
        id: sessionId,
        templateId: 1,
        candidateId: 'candidate-123',
        candidateName: 'John Doe',
        jobId: 'OOJ-4361',
        jobTitle: 'Salesforce Developer',
        startTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
        endTime: new Date().toISOString(),
        duration: 30,
        status: 'completed',
        responses: [
          {
            questionId: 'q1',
            question: 'Can you explain your experience with Salesforce development?',
            response: 'I have 5 years of experience with Salesforce development, including Apex, Lightning components, and Visualforce pages.',
            keywordsDetected: ['apex', 'lightning', 'visualforce'],
            sentimentScore: 0.8
          }
        ],
        recordingUrl: 'https://example.com/recording.mp4',
        transcriptUrl: 'https://example.com/transcript.txt',
        aiInterviewer: 'Jack'
      };
    } catch (error) {
      console.error(`Failed to end interview session ${sessionId}:`, error);
      throw new Error('Failed to end interview');
    }
  }

  async analyzeInterview(sessionId: string): Promise<InterviewAnalysis> {
    try {
      // In a real implementation, this would be an API call
      // For now, return mock data
      return {
        keywordMatchRate: 68,
        detectedKeywords: ['apex', 'lightning', 'visualforce', 'triggers'],
        missedKeywords: ['flows', 'test coverage'],
        sentimentScore: 0.75,
        confidenceScore: 0.82,
        recommendedNextSteps: 'Proceed to technical assessment',
        strengths: ['Strong Salesforce development experience', 'Good communication skills'],
        weaknesses: ['Limited testing experience', 'No mention of integration experience']
      };
    } catch (error) {
      console.error(`Failed to analyze interview session ${sessionId}:`, error);
      throw new Error('Failed to analyze interview');
    }
  }

  async generateInterviewLink(templateId: number, candidateId: string): Promise<string> {
    try {
      // In a real implementation, this would generate a unique link
      // For now, return a mock link
      return `${window.location.origin}/video/interview/${templateId}?candidate=${candidateId}`;
    } catch (error) {
      console.error('Failed to generate interview link:', error);
      throw new Error('Failed to generate interview link');
    }
  }

  isServiceInitialized(): boolean {
    return this.isInitialized;
  }
}

export const videoInterviewService = new VideoInterviewService();
export default videoInterviewService;
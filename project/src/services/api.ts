import axios from 'axios';

const API_BASE_URL = 'https://esb-ats-bndke8f0gza5e8d0.eastus2-01.azurewebsites.net/api';

const api = axios.create({
  baseURL: API_BASE_URL
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

// Email API specific interfaces
interface EmailRecipients {
  to: string[];
  cc?: string[];
  bcc?: string[];
}

interface EmailApiParams extends EmailRecipients {
  subject: string;
  body: string;
  files?: File[];
}

// Email API endpoint function
export const sendEmailApi = async ({
  to,
  cc = [],
  bcc = [],
  subject,
  body,
  files = []
}: EmailApiParams): Promise<any> => {
  try {
    // Create query parameters for recipients and subject
    const queryParams = new URLSearchParams();
    
    // Add multiple 'to' recipients
    to.forEach(email => {
      if (email.trim()) {
        queryParams.append('to', email.trim());
      }
    });
    
    // Add multiple 'cc' recipients
    cc.forEach(email => {
      if (email.trim()) {
        queryParams.append('cc', email.trim());
      }
    });
    
    // Add multiple 'bcc' recipients
    bcc.forEach(email => {
      if (email.trim()) {
        queryParams.append('bcc', email.trim());
      }
    });
    
    // Add subject
    queryParams.append('subject', subject);
    
    // Create FormData for multipart/form-data request
    const formData = new FormData();
    
    // Add email body
    formData.append('body', body);
    
    // Add files if any
    files.forEach(file => {
      formData.append('files', file);
    });
    
    // Make the API call
    const response = await api.post(`/send?${queryParams.toString()}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'accept': 'application/json'
      }
    });
    
    return response.data;
    
  } catch (error) {
    console.error('Email API Error:', error);
    
    // Enhanced error handling
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Server responded with error status
        throw new Error(`Email API Error: ${error.response.status} - ${error.response.data?.message || 'Unknown server error'}`);
      } else if (error.request) {
        // Request was made but no response received
        throw new Error('Email API Error: No response from server. Please check your connection.');
      } else {
        // Something else happened
        throw new Error(`Email API Error: ${error.message}`);
      }
    }
    
    throw new Error('Email API Error: Failed to send email. Please try again.');
  }
};

// Additional email utility functions
export const validateEmailFormat = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const parseEmailList = (emailString: string): string[] => {
  if (!emailString || !emailString.trim()) {
    return [];
  }
  
  return emailString
    .split(/[,;]/)
    .map(email => email.trim())
    .filter(email => email.length > 0);
};

export const validateEmailList = (emails: string[]): { valid: string[]; invalid: string[] } => {
  const valid: string[] = [];
  const invalid: string[] = [];
  
  emails.forEach(email => {
    if (validateEmailFormat(email)) {
      valid.push(email);
    } else {
      invalid.push(email);
    }
  });
  
  return { valid, invalid };
};

// Test email API function (for development/testing)
export const testEmailApi = async (): Promise<boolean> => {
  try {
    const testParams: EmailApiParams = {
      to: ['test@example.com'],
      subject: 'Test Email from API',
      body: 'This is a test email from the API service.'
    };
    
    await sendEmailApi(testParams);
    return true;
  } catch (error) {
    console.error('Email API test failed:', error);
    return false;
  }
};

// Email API configuration constants
export const EMAIL_API_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB in bytes
  ALLOWED_FILE_TYPES: [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ],
  MAX_RECIPIENTS: 50, // Maximum recipients per email
  MAX_FILES: 10 // Maximum files per email
};

// File validation utility
export const validateEmailFile = (file: File): { isValid: boolean; error?: string } => {
  if (file.size > EMAIL_API_CONFIG.MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File "${file.name}" is too large. Maximum size is ${EMAIL_API_CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB.`
    };
  }
  
  if (!EMAIL_API_CONFIG.ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: `File "${file.name}" type is not supported. Allowed types: PNG, JPG, PDF, DOC, DOCX, TXT.`
    };
  }
  
  return { isValid: true };
};

export default api;
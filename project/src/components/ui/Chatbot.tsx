import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Loader,
  Bot,
  Users,
  FileText,
  Video,
  Settings,
  AlertCircle,
  UserCog,
  HelpCircle,
  Briefcase,
   RefreshCw,
  Hand,
  Home,
  Mail,
  User,
  MessageCircle,
  ArrowLeft,
  Calendar,
  Tag,
  Zap,
  Clock,
  Shield,
  Star,
  XCircle,
  ClipboardCheck
} from 'lucide-react';
import { templateChatService } from '../../services/templateChatService';
import { ChatOption } from '../../data/chatbot-templates';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  options?: ChatOption[];
  type?: 'success' | 'error' | 'normal';
}

interface ChatbotProps {
  isOpen?: boolean;
  onToggle?: () => void;
  onClose?: () => void;
  showLauncher?: boolean;
  embedded?: boolean;
}

interface SupportForm {
  email: string;
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  fullName: string;
}

const Chatbot: React.FC<ChatbotProps> = ({
  isOpen,
  onToggle,
  onClose,
  showLauncher = true,
  embedded = false,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [chatEnded, setChatEnded] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  
  // Help message states
  const [showHelpMessage, setShowHelpMessage] = useState(false);
  const [helpMessageVisible, setHelpMessageVisible] = useState(false);
  const [showHelpOnHover, setShowHelpOnHover] = useState(false);

  // Support Case flow states - Legacy flow
  const [awaitingSubject, setAwaitingSubject] = useState(false);
  const [awaitingBody, setAwaitingBody] = useState(false);
  const [awaitingEmail, setAwaitingEmail] = useState(false);
  const subjectTemp = useRef<string>('');
  const supportQuestionTemp = useRef<string>('');

  // Support Form states - New form-based flow
  const [showSupportForm, setShowSupportForm] = useState(false);
  const [supportForm, setSupportForm] = useState<SupportForm>({
    email: '',
    subject: '',
    message: '',
    priority: 'medium',
    category: '',
    fullName: ''
  });
  const [formErrors, setFormErrors] = useState<Partial<SupportForm>>({});
  const [sendingEmail, setSendingEmail] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  const openState = isOpen !== undefined ? isOpen : internalOpen;
  const setOpenState = (value: boolean) => {
    if (isOpen !== undefined && onToggle) {
      onToggle();
    } else {
      setInternalOpen(value);
    }
  };

  useEffect(() => {
    if (!sessionStarted) {
      startNewSession();
      // Add help message animation for non-embedded mode
      if (!embedded) {
        setTimeout(() => {
          setShowHelpMessage(true);
          setTimeout(() => setHelpMessageVisible(true), 100);
          setTimeout(() => {
            setHelpMessageVisible(false);
            setTimeout(() => setShowHelpMessage(false), 500);
          }, 10000);
        }, 1000);
      }
    }
  }, [embedded, sessionStarted]);

  // ThinkingDots component for processing indicator
  const ThinkingDots = () => {
    return (
      <div className="flex items-center space-x-1">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    );
  };

  const startNewSession = () => {
    templateChatService.startNewSession();
    const welcomeMessage: Message = {
      id: 'welcome',
      content: "Hello! I'm your VirtuosoU support assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
      options: [
        { id: 'jobs', text: 'Jobs & Job Management' },
        { id: 'candidates', text: 'Candidates & Profiles' },
        { id: 'submissions', text: 'Submissions & Applications' },
        { id: 'video', text: 'Video Interviews' },
        { id: 'automation', text: 'Automation & Workflows' },
        { id: 'technical', text: 'Technical Issues' },
        { id: 'account', text: 'Account & Access' },
        { id: 'support-case', text: 'Other Questions (Support Case)' },
      ],
    };
    setMessages([welcomeMessage]);
    setSessionStarted(true);
    setChatEnded(false);
    setInputValue('');
    
    // Reset all support case flow states
    setAwaitingSubject(false);
    setAwaitingBody(false);
    setAwaitingEmail(false);
    setShowSupportForm(false);
    setSupportForm({
      email: '',
      subject: '',
      message: '',
      priority: 'medium',
      category: '',
      fullName: ''
    });
    setFormErrors({});
    setSendingEmail(false);
    subjectTemp.current = '';
    supportQuestionTemp.current = '';
  };

  useEffect(() => {
    if ((openState || embedded) && inputRef.current && !chatEnded && !sendingEmail && !showSupportForm) {
      inputRef.current.focus();
    }
  }, [openState, embedded, chatEnded, sendingEmail, showSupportForm]);

  useEffect(() => {
    if (openState && messagesRef.current) {
      setTimeout(() => {
        messagesRef.current!.scrollTop = 0;
      }, 100);
    }
  }, [openState]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isProcessing]);

  const addMessage = (content: string, sender: 'user' | 'bot', type: 'success' | 'error' | 'normal' = 'normal', options?: ChatOption[]) => {
    const message: Message = {
      id: `${sender}-${Date.now()}`,
      content,
      sender,
      timestamp: new Date(),
      type,
      options,
    };
    setMessages((prev) => [...prev, message]);
    return message;
  };

  const handleOptionSelect = async (optionId: string) => {
    if (chatEnded || isProcessing || sendingEmail) return;
    setIsProcessing(true);

    const currentBotMessage = [...messages].reverse().find(
      (msg) => msg.sender === 'bot' && msg.options?.some((opt) => opt.id === optionId)
    );
    const selectedOption = currentBotMessage?.options?.find((opt) => opt.id === optionId);

    if (selectedOption) {
      addMessage(selectedOption.text, 'user');
      setInputValue('');

      if (optionId === 'support-case') {
        setTimeout(() => {
          setShowSupportForm(true);
          addMessage(
            'I\'ll help you create a support case. Please fill out the form below with your details.',
            'bot'
          );
          setIsProcessing(false);
        }, 1000);
        return;
      }

      if (optionId === 'restart') {
        setTimeout(() => {
          startNewSession();
          setIsProcessing(false);
        }, 1000);
        return;
      }

      if (optionId === 'end') {
        setTimeout(() => {
          setChatEnded(true);
          addMessage('Thank you for using VirtuosoU support. Have a great day!', 'bot');
          setIsProcessing(false);
        }, 1000);
        return;
      }

      // Handle retry support case
      if (optionId === 'retry-support') {
        setTimeout(() => {
          setShowSupportForm(true);
          addMessage('Let\'s try creating your support case again. Please fill out the form below.', 'bot');
          setIsProcessing(false);
        }, 1000);
        return;
      }

      // Simulate bot thinking
      setTimeout(() => {
        templateChatService.selectOption(optionId);
        const updatedHistory = templateChatService.getChatHistory();
        const sanitizedHistory = updatedHistory.map((msg) =>
          msg.sender === 'user' ? { ...msg, options: undefined } : msg
        );
        setMessages(sanitizedHistory);
        setIsProcessing(false);
      }, 1000);
    } else {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isProcessing || sendingEmail || showSupportForm) return;

    const userInput = inputValue.trim();
    addMessage(userInput, 'user');
    setInputValue('');

    // Legacy support case flow (kept for backward compatibility)
    if (awaitingSubject) {
      subjectTemp.current = userInput;
      setAwaitingSubject(false);
      setAwaitingBody(true);
      addMessage('Got it! Please describe your issue or question in detail.', 'bot');
      return;
    }

    if (awaitingBody) {
      supportQuestionTemp.current = userInput;
      setAwaitingBody(false);
      setAwaitingEmail(true);
      addMessage('Thanks! Could you please provide your email address so our team can respond to you?', 'bot');
      return;
    }

    if (awaitingEmail) {
      const email = userInput;
      setAwaitingEmail(false);
      setSendingEmail(true);
      addMessage('📧 Creating your support case...', 'bot');

      try {
        const result = await templateChatService.sendSupportEmail(
          subjectTemp.current,
          supportQuestionTemp.current,
          email
        );

        if (result.success) {
          addMessage(
  `${result.message}\n\nSupport Case Details:\n• Subject: ${subjectTemp.current}\n• Your Email: ${email}\n• Reference: SC-${Date.now().toString().slice(-6)}`,
  'bot',
  'success',
  [
    { id: 'restart', text: 'Create Another Case' },
    { id: 'end', text: 'End Chat' }
  ]
);

        } else {
          addMessage(
  `${result.message}\n\nPlease try again or contact support directly at support@virtuosou.com`,
  'bot',
  'error',
  [
    { id: 'retry-support', text: 'Try Again' },
    { id: 'restart', text: 'Start Over' }
  ]
);

        }
      } catch (error) {
        console.error('Error sending support email:', error);
        addMessage(
  'An unexpected error occurred while creating your support case. Please try again later or contact support directly at support@virtuosou.com',
  'bot',
  'error',
  [
    { id: 'retry-support', text: 'Try Again' },
    { id: 'restart', text: 'Start Over' }
  ]
);

      } finally {
        setSendingEmail(false);
        subjectTemp.current = '';
        supportQuestionTemp.current = '';
      }
      return;
    }

    // Normal chatbot flow
    setIsProcessing(true);
    setTimeout(() => {
      templateChatService.handleTextInput(userInput);
      const updatedHistory = templateChatService.getChatHistory();
      const sanitizedHistory = updatedHistory.map((msg) =>
        msg.sender === 'user' ? { ...msg, options: undefined } : msg
      );
      setMessages(sanitizedHistory);
      setIsProcessing(false);
    }, 1000);
  };

  const validateForm = (): boolean => {
    const errors: Partial<SupportForm> = {};
    
    if (!supportForm.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }
    
    if (!supportForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(supportForm.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (!supportForm.subject.trim()) {
      errors.subject = 'Subject is required';
    }
    
    if (!supportForm.message.trim()) {
      errors.message = 'Message is required';
    } else if (supportForm.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters';
    }
    
    if (!supportForm.category) {
      errors.category = 'Please select a category';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const generateTicketId = (): string => {
    const prefix = 'VSU';
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${timestamp.slice(-7)}${random}`;
  };

  const formatDateCreated = (): string => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    };
    return now.toLocaleDateString('en-US', options);
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'high': return '#dc2626';
      case 'medium': return '#d97706';
      case 'low': return '#16a34a';
      default: return '#6b7280';
    }
  };

  const getCategoryIcon = (category: string): string => {
    const iconMap: { [key: string]: string } = {
      'technical': '🔧',
      'account': '👤',
      'billing': '💳',
      'feature': '✨',
      'bug': '🐛',
      'other': '❓'
    };
    return iconMap[category] || '📋';
  };

  const createSupportCaseEmailContent = (ticketId: string): string => {
    const dateCreated = formatDateCreated();
    const priorityColor = getPriorityColor(supportForm.priority);
    const categoryIcon = getCategoryIcon(supportForm.category);

    return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Support Case Created</title>
  </head>
  <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding: 20px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="20" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
            <!-- VirtuosoU Blue Header -->
            <tr>
              <td style="background-color: #1d3ca6; color: #ffffff; padding: 20px; text-align: center;">
                <div style="display: inline-flex; align-items: center; justify-content: center; gap: 8px; font-size: 18px; font-weight: bold;">
                  <span>New Support Case Created</span>
                </div>
                <div style="margin-top: 8px; font-size: 14px;">
                  Ticket ID: ${ticketId}
                </div>
              </td>
            </tr>

            <tr>
              <td style="color: #333333; font-size: 14px; line-height: 1.6; text-align: left;">
                <p><strong>Subject:</strong> ${supportForm.subject}</p>
                <p><strong>Email:</strong> ${supportForm.email}</p>
                <p><strong>Date:</strong> ${dateCreated}</p>
                <p><strong>Issue Detail:</strong><br/>
                  ${supportForm.message.replace(/\n/g, "<br/>")}
                </p>

                <p>Best regards,<br/>
                VirtuosoU Support Team</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
    `.trim();
  };

  const handleSupportFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSendingEmail(true);
   addMessage('Creating your support case...', 'bot');

    try {
      const ticketId = generateTicketId();
      const emailContent = createSupportCaseEmailContent(ticketId);
      const result = await templateChatService.sendSupportEmail(
        supportForm.subject,
        emailContent,
        supportForm.email,
        supportForm.fullName,
        supportForm.message
      );

      if (result.success) {
        setShowSupportForm(false);
        addMessage(
          `${result.message}\n\nSupport Case Details:\n• Ticket ID: ${ticketId}\n• Subject: ${supportForm.subject}\n• Email: ${supportForm.email}\n• Priority: ${supportForm.priority.toUpperCase()}\n• Category: ${supportForm.category}\n• Customer: ${supportForm.fullName}`,
          'bot',
          'success',
          [
            { id: 'restart', text: 'Create Another Case' },
            { id: 'end', text: ' End Chat' }
          ]
        );
      } else {
        addMessage(
          ` ${result.message}\n\nPlease try again or contact support directly at support@virtuosou.com`,
          'bot',
          'error'
        );
      }
    } catch (error) {
      console.error('Error sending support email:', error);
      addMessage(
        ' An unexpected error occurred while creating your support case. Please try again later or contact support directly at support@virtuosou.com',
        'bot',
        'error'
      );
    } finally {
      setSendingEmail(false);
    }
  };

  const handleBackToChat = () => {
    setShowSupportForm(false);
    setSupportForm({
      email: '',
      subject: '',
      message: '',
      priority: 'medium',
      category: '',
      fullName: ''
    });
    setFormErrors({});
  };

  const toggleChat = () => {
    setOpenState(!openState);
    if (showHelpMessage) {
      setHelpMessageVisible(false);
      setTimeout(() => setShowHelpMessage(false), 500);
    }
  };

  const getOptionIcon = (optionId: string) => {
    switch (optionId) {
      case 'jobs': return <Briefcase className="w-4 h-4 text-blue-600" />;
      case 'candidates': return <Users className="w-4 h-4 text-purple-600" />;
      case 'submissions': return <FileText className="w-4 h-4 text-pink-600" />;
      case 'video': return <Video className="w-4 h-4 text-red-600" />;
      case 'automation': return <Settings className="w-4 h-4 text-green-600" />;
      case 'technical': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'account': return <UserCog className="w-4 h-4 text-indigo-600" />;
      case 'support-case': return <HelpCircle className="w-4 h-4 text-gray-600" />;
      case 'restart': return <MessageSquare className="w-4 h-4 text-blue-600" />;
      case 'retry-support': return <HelpCircle className="w-4 h-4 text-orange-600" />;
      case 'restart': return <RefreshCw className="w-4 h-4 text-blue-600" />;
      case 'end': return <Hand className="w-4 h-4 text-red-600" />;
      case 'retry-support': return <RefreshCw className="w-4 h-4 text-orange-600" />;
      case 'home': return <Home className="w-4 h-4 text-gray-600" />;
      // case 'custom':return <Mail className="h-4 w-4 text-blue-600" />
      default: return null;
    }
  };

  const getMessageStyles = (message: Message) => {
    if (message.sender === 'user') {
      return 'bg-blue-700 text-white';
    }

    switch (message.type) {
      case 'success':
        return 'bg-green-50 text-green-800 border border-green-200';
      case 'error':
        return 'bg-red-50 text-red-800 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

 const getMessageIcon = (message: Message) => {
  if (message.sender === 'user') return null;

   switch (message.type) {
    case 'success':
      return <ClipboardCheck className="h-4 w-4 text-green-600" />;  // 
    case 'error':
      return <XCircle className="h-4 w-4 text-red-600" />;
    default:
      return <Bot className="h-4 w-4" />;
  }
};
  const formatMessage = (text: string) => {
    const boldFormatted = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-black">$1</strong>');
    return boldFormatted;
  };

  const renderSupportForm = () => (
    <div className="p-4 bg-white border-t">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Shield className="w-5 h-5 mr-2 text-blue-600" />
          Create Support Case
        </h3>
        <button
          onClick={handleBackToChat}
          className="flex items-center text-sm text-gray-600 hover:text-gray-800"
          disabled={sendingEmail}
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Chat
        </button>
      </div>

      <form onSubmit={handleSupportFormSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <User className="inline w-4 h-4 mr-1" />
            Full Name *
          </label>
          <input
            type="text"
            value={supportForm.fullName}
            onChange={(e) => setSupportForm({ ...supportForm, fullName: e.target.value })}
            placeholder="Enter your full name"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={sendingEmail}
          />
          {formErrors.fullName && (
            <p className="text-red-600 text-xs mt-1">{formErrors.fullName}</p>
          )}
        </div>

        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Tag className="inline w-4 h-4 mr-1" />
            Category *
          </label>
          <select
            value={supportForm.category}
            onChange={(e) => setSupportForm({ ...supportForm, category: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={sendingEmail}
          >
            <option value="">Select a category</option>
            <option value="technical">🔧 Technical Issue</option>
            <option value="account">👤 Account & Access</option>
            <option value="billing">💳 Billing & Payments</option>
            <option value="feature">✨ Feature Request</option>
            <option value="bug">🐛 Bug Report</option>
            <option value="other">❓ Other</option>
          </select>
          {formErrors.category && (
            <p className="text-red-600 text-xs mt-1">{formErrors.category}</p>
          )}
        </div>

        {/* Priority Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Zap className="inline w-4 h-4 mr-1" />
            Priority
          </label>
          <div className="flex gap-2">
            {(['low', 'medium', 'high'] as const).map((priority) => (
              <label key={priority} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="priority"
                  value={priority}
                  checked={supportForm.priority === priority}
                  onChange={(e) => setSupportForm({ ...supportForm, priority: e.target.value as 'low' | 'medium' | 'high' })}
                  className="mr-2"
                  disabled={sendingEmail}
                />
                <span className={`text-sm px-3 py-1 rounded-full capitalize font-medium flex items-center gap-1 ${
                  priority === 'high' ? 'bg-red-100 text-red-800' :
                  priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {priority === 'high' && <Star className="w-3 h-3" />}
                  {priority === 'medium' && <Clock className="w-3 h-3" />}
                  {priority === 'low' && <Calendar className="w-3 h-3" />}
                  {priority}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Mail className="inline w-4 h-4 mr-1" />
            Your Email *
          </label>
          <input
            type="email"
            value={supportForm.email}
            onChange={(e) => setSupportForm({ ...supportForm, email: e.target.value })}
            placeholder="your.email@company.com"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={sendingEmail}
          />
          {formErrors.email && (
            <p className="text-red-600 text-xs mt-1">{formErrors.email}</p>
          )}
        </div>

        {/* Subject */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <MessageCircle className="inline w-4 h-4 mr-1" />
            Subject *
          </label>
          <input
            type="text"
            value={supportForm.subject}
            onChange={(e) => setSupportForm({ ...supportForm, subject: e.target.value })}
            placeholder="Brief description of your issue"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={sendingEmail}
          />
          {formErrors.subject && (
            <p className="text-red-600 text-xs mt-1">{formErrors.subject}</p>
          )}
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <FileText className="inline w-4 h-4 mr-1" />
            Detailed Message *
          </label>
          <textarea
            value={supportForm.message}
            onChange={(e) => setSupportForm({ ...supportForm, message: e.target.value })}
            placeholder="Please provide detailed information about your issue, including any error messages, steps to reproduce, and expected behavior."
            rows={4}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={sendingEmail}
          />
          <div className="flex justify-between items-center mt-1">
            {formErrors.message && (
              <p className="text-red-600 text-xs">{formErrors.message}</p>
            )}
            <span className="text-xs text-gray-500 ml-auto">
              {supportForm.message.length}/500 characters
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={sendingEmail}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-colors"
        >
          {sendingEmail ? (
            <>
              <Loader className="h-4 w-4 animate-spin" />
              <span>Creating Support Case...</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>Submit Support Case</span>
            </>
          )}
        </button>
      </form>
    </div>
  );

  const renderChatMessages = () => (
    <div ref={messagesRef} className="space-y-4 overflow-y-auto">
      {messages.map((message) => (
        <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
          {message.sender === 'user' ? (
            // User message (right side)
            <div className={`max-w-[80%] rounded-lg px-4 py-2 ${getMessageStyles(message)}`}>
              <div className="text-sm whitespace-pre-line" dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }} />
              <p className="mt-1 text-right text-xs opacity-70">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          ) : (
            // Bot message (left side with avatar)
            <div className="flex items-start space-x-2 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-4 h-4 text-white" />
              </div>
              
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-700 mb-1">Bot</span>
                <div className={`rounded-lg px-4 py-2 ${getMessageStyles(message)}`}>
                  {message.sender === 'bot' && message.type !== 'normal' && (
                    <div className="flex items-center space-x-2 mb-1">
                      {getMessageIcon(message)}
                      <span className="text-xs font-medium">
                        {message.type === 'success' ? 'Success' : message.type === 'error' ? 'Error' : 'Support Assistant'}
                      </span>
                    </div>
                  )}
                  <div className="text-sm whitespace-pre-line" dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }} />
                  
                  {Array.isArray(message.options) && message.options.length > 0 && (
                    <div className="mt-3 grid gap-1">
                      {message.options.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => handleOptionSelect(option.id)}
                          disabled={isProcessing || sendingEmail}
                          className="flex items-center justify-start space-x-2 rounded-xl border border-gray-200 p-3 text-sm bg-white hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 shadow-sm disabled:opacity-50"
                        >
                          {getOptionIcon(option.id)}
                          <span className="text-gray-800 font-medium">{option.text}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  <p className="mt-1 text-right text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
      
      {/* Processing indicator */}
      {(isProcessing || sendingEmail) && !showSupportForm && (
        <div className="flex justify-start">
          <div className="flex items-start space-x-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
              <Bot className="w-4 h-4 text-white" />
            </div>

            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-700 mb-1">Bot</span>
              <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-2">
                {sendingEmail ? (
                  <span className="text-sm">Creating support case...</span>
                ) : (
                  <ThinkingDots />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );

  const getInputPlaceholder = () => {
    if (awaitingSubject) return "Enter the subject of your request...";
    if (awaitingBody) return "Describe your issue or question in detail...";
    if (awaitingEmail) return "Enter your email address...";
    return "Type your question or use the options above...";
  };

  const renderInputField = () => {
    if (showSupportForm) return null;

    return (
      <div className="border-t p-4">
        <div className="relative w-full">
          {!chatEnded && (awaitingSubject || awaitingBody || awaitingEmail) ? (
            // Show text input during legacy support case flow
            <form onSubmit={handleSubmit} className="flex items-center space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={getInputPlaceholder()}
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                disabled={isProcessing || sendingEmail}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isProcessing || sendingEmail}
                className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          ) : !chatEnded ? (
            // Show disabled input for option selection
            <div className="flex items-center border border-blue-400 rounded-full px-4 py-2 bg-white text-gray-500 shadow-sm w-full cursor-not-allowed">
              <span className="flex-1 select-none">Choose an option</span>
              <div className="flex gap-3 ml-2">
                <Send className="h-4 w-4 text-gray-300" />
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center">Chat has ended.</p>
          )}
        </div>
      </div>
    );
  };

  if (embedded) {
    return (
      <div className="h-full flex flex-col bg-white rounded-lg shadow-md border border-gray-200">
        <div className="flex items-center justify-between rounded-t-lg bg-blue-600 px-4 py-3 text-white">
          <div className="flex items-center">
            <Bot className="mr-2 h-5 w-5" />
            <h3 className="font-medium">Support Assistant</h3>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {showSupportForm ? renderSupportForm() : renderChatMessages()}
        </div>
        {renderInputField()}
      </div>
    );
  }

  return (
    <>
      {/* Help Message on Hover */}
      {(showHelpMessage || showHelpOnHover) && (
        <div
          className={`fixed bottom-24 right-20 z-40 bg-blue-700 text-white rounded-lg shadow-lg px-4 py-3 max-w-[220px] transition-all duration-500 transform ${
            (showHelpMessage && helpMessageVisible) || showHelpOnHover 
              ? 'translate-x-0 opacity-100' 
              : 'translate-x-full opacity-0'
          }`}
        >
          <p className="text-sm font-semibold leading-tight">Need Help?</p>
          <p className="text-xs leading-snug">I'm here to assist you!</p>
          <div className="absolute bottom-0 right-6 transform translate-y-1/2 rotate-45 w-2.5 h-2.5 bg-blue-700" />
        </div>
      )}

      {/* Chat Toggle Button */}
      {showLauncher && (
        <button
          onClick={toggleChat}
          onMouseEnter={() => !openState && !showHelpMessage && setShowHelpOnHover(true)}
          onMouseLeave={() => setShowHelpOnHover(false)}
          className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-800 text-white shadow-lg transition-transform duration-300 ease-in-out hover:scale-115`}
          aria-label="Support Chat"
        >
          {openState ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
        </button>
      )}

      {/* Chat Window */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-[400px] rounded-lg bg-white shadow-xl transition-all duration-500 ease-in-out transform ${
          openState ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between rounded-t-lg bg-blue-800 px-4 py-3 text-white">
          <div className="flex items-center">
            <Bot className="mr-2 h-5 w-5" />
            <h3 className="font-medium">Support Assistant</h3>
          </div>
          <button
            onClick={() => (onClose ? onClose() : setOpenState(false))}
            className="text-white hover:text-gray-200 text-xl font-bold"
            aria-label="Close chat"
          >
            ×
          </button>
        </div>

        <div ref={messagesRef} className="h-[545px] overflow-y-auto">
          {showSupportForm ? renderSupportForm() : <div className="p-4">{renderChatMessages()}</div>}
        </div>

        {renderInputField()}
      </div>
    </>
  );
};

export default Chatbot;
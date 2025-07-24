import { ChatTemplate, ChatOption, getTemplateById, getStartTemplate } from '../data/chatbot-templates';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  options?: ChatOption[];
}

interface ChatSession {
  id: string;
  messages: ChatMessage[];
  currentTemplateId: string;
  startTime: Date;
}

class TemplateChatService {
  private currentSession: ChatSession | null = null;

  startNewSession(): ChatSession {
    const startTemplate = getStartTemplate();

    this.currentSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      messages: [],
      currentTemplateId: startTemplate.id,
      startTime: new Date()
    };

    this.addBotMessage(startTemplate.message, startTemplate.options);
    return this.currentSession;
  }

  getCurrentSession(): ChatSession | null {
    return this.currentSession;
  }

  selectOption(optionId: string): ChatMessage | null {
    if (!this.currentSession) return null;

    const currentTemplate = getTemplateById(this.currentSession.currentTemplateId);
    if (!currentTemplate) return null;

    const selectedOption = currentTemplate.options.find(option => option.id === optionId);
    if (!selectedOption) return null;

    const userMessage = this.addUserMessage(selectedOption.text);

    if (selectedOption.nextTemplateId) {
      const nextTemplate = getTemplateById(selectedOption.nextTemplateId);
      if (nextTemplate) {
        this.currentSession.currentTemplateId = nextTemplate.id;
        this.addBotMessage(nextTemplate.message, nextTemplate.options);
      }
    } else if (selectedOption.isEndpoint) {
      this.addBotMessage("Is there anything else I can help you with?", [
        { id: 'restart', text: '🔄 Start over', nextTemplateId: 'start' },
        { id: 'end', text: '👋 End chat', isEndpoint: true }
      ]);
    }

    return userMessage;
  }

  handleTextInput(text: string): ChatMessage | null {
    if (!this.currentSession) return null;

    const userMessage = this.addUserMessage(text);
    const currentTemplate = getTemplateById(this.currentSession.currentTemplateId);

    if (currentTemplate) {
      this.addBotMessage(
        "I understand you have a specific question. Please select from the options below, or choose 'Start over' to see all available topics:",
        [
          ...currentTemplate.options,
          { id: 'restart', text: '🔄 Start over', nextTemplateId: 'start' }
        ]
      );
    }

    return userMessage;
  }

  restart(): void {
    if (this.currentSession) {
      const startTemplate = getStartTemplate();
      this.currentSession.currentTemplateId = startTemplate.id;
      this.addBotMessage(startTemplate.message, startTemplate.options);
    }
  }

  private addBotMessage(content: string, options?: ChatOption[]): ChatMessage {
    if (!this.currentSession) throw new Error('No active session');

    const message: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      content,
      sender: 'bot',
      timestamp: new Date(),
      options
    };

    this.currentSession.messages.push(message);
    return message;
  }

  private addUserMessage(content: string): ChatMessage {
    if (!this.currentSession) throw new Error('No active session');

    const message: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      content,
      sender: 'user',
      timestamp: new Date()
    };

    this.currentSession.messages.push(message);
    return message;
  }

  getChatHistory(): ChatMessage[] {
    return this.currentSession?.messages || [];
  }

  endSession(): void {
    this.currentSession = null;
  }

  getSessionStats(): { messageCount: number; duration: number; templatesVisited: number } | null {
    if (!this.currentSession) return null;

    const duration = Date.now() - this.currentSession.startTime.getTime();
    const messageCount = this.currentSession.messages.length;
    const botMessages = this.currentSession.messages.filter(m => m.sender === 'bot');
    const templatesVisited = Math.ceil(botMessages.length / 2);

    return { messageCount, duration, templatesVisited };
  }

  async sendEmail(
    subject: string,
    body: string,
    to: string | string[]
  ): Promise<{ success: boolean; message: string }> {
    try {
      const recipients = Array.isArray(to) ? to : [to];
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      for (const email of recipients) {
        if (!emailRegex.test(email)) throw new Error(`Invalid email: ${email}`);
      }

      const params = new URLSearchParams();
      recipients.forEach(email => params.append('to', email));
      params.append('subject', subject);

      const formData = new FormData();
      formData.append('body', body);
      formData.append('files', '');

      const url = `https://esb-ats-bndke8f0gza5e8d0.eastus2-01.azurewebsites.net/api/send?${params.toString()}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { accept: 'application/json' },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Email send failed:', errorText);
        throw new Error(`Failed to send email: ${response.status}`);
      }

      const resText = await response.text();
      console.log('✅ Email sent successfully:', resText);

      return { success: true, message: 'Email sent successfully.' };
    } catch (error) {
      console.error('❌ sendEmail error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // ✅ UPDATED FUNCTION (fixed undefined message issue)
 async sendSupportEmail(
  subject: string,
  htmlBody: string,
  userEmail: string,
  userName: string,
  supportFormMessage: string
): Promise<{ success: boolean; message: string }> {

    const supportRecipients = [
      'bindu@theesbcorp.com',
    ];

    // send to support team
    const supportResult = await this.sendEmail(
      `[Support Case] ${subject}`,
      htmlBody,
      supportRecipients
    );

    // personalized user email body
   const userBody = `
  Hi ${userName},<br/><br/>
  Thank you for contacting VirtuosoU Support.<br/>
  Your support case has been received and is currently being reviewed by our team.<br/><br/>
  <strong>Subject:</strong> ${subject}<br/>
  <strong>Your Message:</strong> ${supportFormMessage}<br/>
  <strong>Date:</strong> ${new Date().toLocaleString()}<br/><br/>
  We’ll be in touch shortly.<br/><br/>
  Best regards,<br/>
  <em>VirtuosoU Support Team</em>
`.trim();


    const userResult = await this.sendEmail(
      'Your support request was received',
      userBody,
      userEmail
    );

    if (supportResult.success && userResult.success) {
      return {
        success: true,
        message: 'Support case submitted and confirmation email sent to user.'
      };
    } else {
      const failures = [
        !supportResult.success ? 'support team' : '',
        !userResult.success ? 'user' : ''
      ].filter(Boolean).join(' and ');
      return {
        success: false,
        message: `Email failed to send to ${failures}.`
      };
    }
  }
}

export const templateChatService = new TemplateChatService();
export default templateChatService;

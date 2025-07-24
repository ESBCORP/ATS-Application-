import api from './api';

interface SMSRequest {
  to: string;
  message: string;
  from?: string;
}

interface CallRequest {
  to: string;
  script?: string;
  from?: string;
}

interface SMSResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

interface CallResult {
  success: boolean;
  callId?: string;
  error?: string;
}

class TwilioService {
  private isConfigured = false;
  private accountSid: string | undefined;
  private authToken: string | undefined;
  private phoneNumber: string | undefined;

  constructor() {
    this.initializeConfig();
  }

  private initializeConfig() {
    this.accountSid = import.meta.env.VITE_TWILIO_ACCOUNT_SID;
    this.authToken = import.meta.env.VITE_TWILIO_AUTH_TOKEN;
    this.phoneNumber = import.meta.env.VITE_TWILIO_PHONE_NUMBER;

    if (this.accountSid && this.authToken && this.phoneNumber) {
      this.isConfigured = true;
      console.log('✅ Twilio service configured successfully');
    } else {
      console.warn('⚠️ Twilio credentials not found in environment variables');
      this.isConfigured = false;
    }
  }

  async sendSMS(request: SMSRequest): Promise<SMSResult> {
    if (!this.isConfigured) {
      console.warn('❌ Twilio credentials not configured - SMS sending failed');
      return { 
        success: false, 
        error: 'Twilio credentials not configured'
      };
    }

    try {
      const fromNumber = request.from || this.phoneNumber;
      
      if (!fromNumber) {
        return { 
          success: false, 
          error: 'Twilio phone number not configured'
        };
      }

      console.log(`📱 Sending SMS to ${request.to} from ${fromNumber}`);
      console.log(`📝 Message: ${request.message}`);

      // Make API call to send SMS via Twilio
      const response = await this.sendTwilioSMS({
        to: request.to,
        message: request.message,
        from: fromNumber
      });

      if (response.success) {
        console.log(`✅ SMS sent successfully to ${request.to}`);
        return {
          success: true,
          messageId: response.messageId
        };
      } else {
        console.error(`❌ SMS failed: ${response.error}`);
        return {
          success: false,
          error: response.error || 'Failed to send SMS'
        };
      }
    } catch (error) {
      console.error('❌ SMS sending error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async makeCall(request: CallRequest): Promise<CallResult> {
    if (!this.isConfigured) {
      console.warn('❌ Twilio credentials not configured - call making failed');
      return { 
        success: false, 
        error: 'Twilio credentials not configured'
      };
    }

    try {
      const fromNumber = request.from || this.phoneNumber;
      
      if (!fromNumber) {
        return { 
          success: false, 
          error: 'Twilio phone number not configured'
        };
      }

      console.log(`📞 Making call to ${request.to} from ${fromNumber}`);

      // Make API call to initiate call via Twilio
      const response = await this.makeTwilioCall({
        to: request.to,
        script: request.script,
        from: fromNumber
      });

      if (response.success) {
        console.log(`✅ Call initiated successfully to ${request.to}`);
        return {
          success: true,
          callId: response.callId
        };
      } else {
        console.error(`❌ Call failed: ${response.error}`);
        return {
          success: false,
          error: response.error || 'Failed to make call'
        };
      }
    } catch (error) {
      console.error('❌ Call error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async sendTwilioSMS(params: SMSRequest): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      // Create the request body for Twilio API
      const body = new URLSearchParams();
      body.append('To', params.to);
      body.append('From', params.from || this.phoneNumber!);
      body.append('Body', params.message);

      // Make direct API call to Twilio
      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${this.accountSid}:${this.authToken}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          messageId: data.sid
        };
      } else {
        return {
          success: false,
          error: data.message || `HTTP ${response.status}`
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  }

  private async makeTwilioCall(params: CallRequest): Promise<{ success: boolean; callId?: string; error?: string }> {
    try {
      // Create TwiML for the call script
      const twiml = params.script 
        ? `<Response><Say>${params.script}</Say></Response>`
        : '<Response><Say>Hello from VirtuosoU</Say></Response>';

      // Create the request body for Twilio API
      const body = new URLSearchParams();
      body.append('To', params.to);
      body.append('From', params.from || this.phoneNumber!);
      body.append('Twiml', twiml);

      // Make direct API call to Twilio
      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Calls.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${this.accountSid}:${this.authToken}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          callId: data.sid
        };
      } else {
        return {
          success: false,
          error: data.message || `HTTP ${response.status}`
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  }

  isServiceConfigured(): boolean {
    return this.isConfigured;
  }

  getConfiguration() {
    return {
      isConfigured: this.isConfigured,
      accountSid: this.accountSid ? `${this.accountSid.substring(0, 8)}...` : 'Not set',
      phoneNumber: this.phoneNumber || 'Not set'
    };
  }
}

export const twilioService = new TwilioService();
export default twilioService;
import { sendEmailApi, parseEmailList, validateEmailList, validateEmailFile, EMAIL_API_CONFIG } from './api';

interface SendEmailParams {
  to: string | string[];
  subject: string;
  body: string;
  cc?: string | string[];
  bcc?: string | string[];
  files?: File[];
  isHtml?: boolean;
}

export const sendEmail = async ({ 
  to, 
  subject, 
  body, 
  cc, 
  bcc, 
  files = [],
  isHtml = true 
}: SendEmailParams): Promise<void> => {
  try {
    // Convert string inputs to arrays
    const toEmails = Array.isArray(to) ? to : parseEmailList(to);
    const ccEmails = cc ? (Array.isArray(cc) ? cc : parseEmailList(cc)) : [];
    const bccEmails = bcc ? (Array.isArray(bcc) ? bcc : parseEmailList(bcc)) : [];
    
    // Validate email addresses
    const toValidation = validateEmailList(toEmails);
    const ccValidation = validateEmailList(ccEmails);
    const bccValidation = validateEmailList(bccEmails);
    
    // Check for invalid emails
    const allInvalidEmails = [
      ...toValidation.invalid,
      ...ccValidation.invalid,
      ...bccValidation.invalid
    ];
    
    if (allInvalidEmails.length > 0) {
      throw new Error(`Invalid email addresses: ${allInvalidEmails.join(', ')}`);
    }
    
    // Check recipient limits
    const totalRecipients = toValidation.valid.length + ccValidation.valid.length + bccValidation.valid.length;
    if (totalRecipients > EMAIL_API_CONFIG.MAX_RECIPIENTS) {
      throw new Error(`Too many recipients. Maximum allowed: ${EMAIL_API_CONFIG.MAX_RECIPIENTS}`);
    }
    
    // Validate files if any
    if (files && files.length > 0) {
      if (files.length > EMAIL_API_CONFIG.MAX_FILES) {
        throw new Error(`Too many files. Maximum allowed: ${EMAIL_API_CONFIG.MAX_FILES}`);
      }
      
      for (const file of files) {
        const fileValidation = validateEmailFile(file);
        if (!fileValidation.isValid) {
          throw new Error(fileValidation.error);
        }
      }
    }
    
    // Call the API function from api.ts
    await sendEmailApi({
      to: toValidation.valid,
      cc: ccValidation.valid.length > 0 ? ccValidation.valid : undefined,
      bcc: bccValidation.valid.length > 0 ? bccValidation.valid : undefined,
      subject,
      body,
      files
    });
    
  } catch (error) {
    console.error('Error sending email:', error);
    if (error instanceof Error) {
      throw error; // Re-throw the specific error message
    }
    throw new Error('Failed to send email. Please check your connection and try again.');
  }
};

// Re-export utility functions from api.ts for backward compatibility
export { parseEmailList, validateEmailFormat as validateEmail } from './api';

// Helper function to validate multiple emails (backward compatibility)
export const validateMultipleEmails = (emailString: string): { isValid: boolean; invalidEmails: string[] } => {
  if (!emailString.trim()) {
    return { isValid: true, invalidEmails: [] };
  }

  const emails = parseEmailList(emailString);
  const { valid, invalid } = validateEmailList(emails);

  return {
    isValid: invalid.length === 0,
    invalidEmails: invalid
  };
};
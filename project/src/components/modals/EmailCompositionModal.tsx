import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Candidate, Job } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import EmailInput from '../ui/EmailInput';
import { createSubmission } from '../../services/submissionsService';
import { sendEmail, parseEmailList, validateMultipleEmails } from '../../services/emailService';
import { checkDuplicateSubmission } from '../../services/submissionsService';
import { fetchContacts, Contact } from '../../services/contactsService';
import { useAuth } from '../../contexts/AuthContext';

interface EmailCompositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  candidate: Candidate;
  job: Job;
  submissionDetails: {
    availability: string;
    engagement: string;
    locationPreference: string;
    payType: string;
    billType: string;
    payRate: number;
    billRate: number;
    additionalRecipients: string;
  };
}

const EmailCompositionModal: React.FC<EmailCompositionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  candidate,
  job,
  submissionDetails
}) => {
  const navigate = useNavigate();
  const toFieldRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const scrollToTop = () => {
  modalRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
};

  const { user } = useAuth();
  
  const [emailData, setEmailData] = useState({
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    content: ''
  });
  
  const [hasRightToRepresent, setHasRightToRepresent] = useState(false);
  const [toFieldError, setToFieldError] = useState<string | null>(null);
  const [ccFieldError, setCcFieldError] = useState<string | null>(null);
  const [bccFieldError, setBccFieldError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [duplicateError, setDuplicateError] = useState<string | null>(null);
  const [checkingDuplicate, setCheckingDuplicate] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  // Load contacts when modal opens
  useEffect(() => {
    const loadContacts = async () => {
      if (!isOpen) return;
      
      try {
        setLoadingContacts(true);
        const contactsData = await fetchContacts();
        setContacts(contactsData);
      } catch (err) {
        console.error('Failed to load contacts:', err);
        // Don't show error to user, just continue without contacts
      } finally {
        setLoadingContacts(false);
      }
    };

    loadContacts();
  }, [isOpen]);

  useEffect(() => {
    const content = generateEmailContent(candidate, job);
    setEmailData(prev => ({
      ...prev,
      subject: `Candidate Submission: ${candidate.firstName} ${candidate.lastName} for ${job.title}`,
      content
    }));
  }, [candidate, job, submissionDetails]);

  // Check for duplicate submission when modal opens
  useEffect(() => {
    const checkDuplicate = async () => {
      if (!isOpen) return;
      
      try {
        setCheckingDuplicate(true);
        setDuplicateError(null);
        
        const isDuplicate = await checkDuplicateSubmission(candidate.id, job.id);
        if (isDuplicate) {
          setDuplicateError('You have already submitted this candidate for the selected job role.');
        }
      } catch (err) {
        console.error('Error checking duplicate submission:', err);
        // Don't show error for duplicate check failure, just proceed
      } finally {
        setCheckingDuplicate(false);
      }
    };

    checkDuplicate();
  }, [isOpen, candidate.id, job.id]);

  // Handle file attachment
  const handleFileAttachment = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setAttachedFiles(prev => [...prev, ...fileArray]);
    }
  };

  // Remove attached file
  const removeAttachedFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = async () => {
    // Clear previous errors
    setToFieldError(null);
    setCcFieldError(null);
    setBccFieldError(null);
    setError(null);

    // Validate TO field
    if (!emailData.to.trim()) {
      setToFieldError('This field is mandatory');
      scrollToTop();
      toFieldRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Validate email formats
    const toValidation = validateMultipleEmails(emailData.to);
    const ccValidation = validateMultipleEmails(emailData.cc);
    const bccValidation = validateMultipleEmails(emailData.bcc);

    let hasValidationErrors = false;

    if (!toValidation.isValid) {
      setToFieldError(`Invalid email addresses: ${toValidation.invalidEmails.join(', ')}`);
      scrollToTop();
      hasValidationErrors = true;
    }

    if (!ccValidation.isValid) {
      setCcFieldError(`Invalid email addresses: ${ccValidation.invalidEmails.join(', ')}`);
      hasValidationErrors = true;
    }

    if (!bccValidation.isValid) {
      setBccFieldError(`Invalid email addresses: ${bccValidation.invalidEmails.join(', ')}`);
      scrollToTop();
      hasValidationErrors = true;
    }

    if (hasValidationErrors) {
      scrollToTop();
      return;
    }

    // Validate pay rate and bill rate
    // if (submissionDetails.payRate <= 0 || submissionDetails.billRate <= 0) {
    //   setError('Pay Rate and Bill Rate must be greater than 0.');
    //   return;
    // }
    
    if (!hasRightToRepresent) {
      setError('Please confirm that you have the right to represent this candidate.');
      scrollToTop();
      return;
    }

    if (duplicateError) {
      scrollToTop();
      return; // Don't allow submission if there's a duplicate
    }

    try {
      setSubmitting(true);
      setError(null);

      // Double-check for duplicate before submitting
      const isDuplicate = await checkDuplicateSubmission(candidate.id, job.id);
      if (isDuplicate) {
        setDuplicateError('You have already submitted this candidate for the selected job role.');
        return;
      }

      // Create submission data
      const submissionData = {
        candidateId: candidate.id,
        jobId: job.id,
        firstName: candidate.firstName,
        lastName: candidate.lastName,
        jobTitle: job.title,
        client: job.customer,
        status: 'Submitted',
        payType: submissionDetails.payType,
        payRate: submissionDetails.payRate,
        billRate: submissionDetails.billRate,
        expectedPay: submissionDetails.payRate,
        city: job.city && job.city.trim() ? job.city : null,
        state: job.state && job.state.trim() ? job.state : null,
        jobHiringType: job.jobType,
        availability: submissionDetails.availability,
        engagement: submissionDetails.engagement,
        email: candidate.email,
        phone: candidate.phone,
        workAuthorization: candidate.workAuthorization,
        linkedinUrl: candidate.linkedinUrl,
        locationPreference: submissionDetails.locationPreference,
        billType: submissionDetails.billType
      };

      // Create submission in database
      const createdSubmission = await createSubmission(submissionData);

      if (createdSubmission) {
        // Parse email addresses to arrays for the new API
        const toEmails = parseEmailList(emailData.to);
        const ccEmails = emailData.cc ? parseEmailList(emailData.cc) : [];
        const bccEmails = emailData.bcc ? parseEmailList(emailData.bcc) : [];

        // Prepare email data for new API
        const emailPayload = {
          to: toEmails,
          cc: ccEmails.length > 0 ? ccEmails : undefined,
          bcc: bccEmails.length > 0 ? bccEmails : undefined,
          subject: emailData.subject,
          body: emailData.content,
          files: attachedFiles,
          isHtml: true
        };

        // Send email only after submission is created successfully
        await sendEmail(emailPayload);

        // Close modal and navigate only after both operations succeed
        onSubmit();
        navigate('/submissions');
      }
    } catch (err) {
      console.error('Failed to create submission or send email:', err);
      
      // Check if user is SuperAdmin and bypass permission check
      if (user?.role === 'SuperAdmin') {
        setError('An error occurred while creating the submission. Please try again.');
      } else {
        // Check if error is related to email sending
        if (err instanceof Error && err.message.toLowerCase().includes('email')) {
          setError('Failed to send email. Please check email addresses and try again.');
        } else {
          setError('Access Denied. You do not have the required permissions to create submission.');
          scrollToTop();
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const generateEmailContent = (candidate: Candidate, job: Job) => {
    // Create HTML table for better formatting with enhanced styling
    const tableRows = [
      ['Candidate Name', `${candidate.firstName} ${candidate.lastName}`],
      ['Email', candidate.email],
      ['Phone', candidate.phone],
      ['Work Authorization', candidate.workAuthorization],
      ['City', candidate.city || '-'],
      ['State', candidate.state],
      ['Engagement', submissionDetails.engagement],
      ['Submit Rate', `$ ${submissionDetails.payRate}/${submissionDetails.payType}`],
      ['Location Preference', submissionDetails.locationPreference],
      ['LinkedIn URL', candidate.linkedinUrl || '-']
    ];

    const tableHTML = `
<table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%; max-width: 800px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 14px; margin: 20px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
  <thead>
     <tr style="background: #1e40af; color: white;">
      <th style="text-align: left; padding: 15px 12px; border: 1px solid #ddd; font-weight: 600; font-size: 15px; letter-spacing: 0.5px;">Field</th>
      <th style="text-align: left; padding: 15px 12px; border: 1px solid #ddd; font-weight: 600; font-size: 15px; letter-spacing: 0.5px;">Value</th>
    </tr>
  </thead>
  <tbody>
    ${tableRows.map(([field, value], index) => `
    <tr style="background-color: #f8f9ff;">
      <td style="padding: 12px; border: 1px solid #e1e5e9; font-weight: 500; color: #2c3e50; width: 35%;">${field}</td>
      <td style="padding: 12px; border: 1px solid #e1e5e9; color: #34495e; word-break: break-word;">${value}</td>
    </tr>
    `).join('')}
  </tbody>
</table>`;

    return `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333;">
<p style="font-size: 16px; margin-bottom: 20px;">Hello!</p>

<p style="font-size: 16px; margin-bottom: 25px;">Please find below the candidate details for the <strong style="color: #2c3e50;">${job.title}</strong> position.</p>

<div style="margin: 30px 0;">
<h3 style="color: #2c3e50; font-size: 18px; margin-bottom: 15px; border-bottom: 2px solid #3498db; padding-bottom: 5px; display: inline-block;">📋 Submission Details:</h3>
${tableHTML}
</div>

<p style="font-size: 16px; margin-top: 30px; color: #2c3e50;">Best regards,</p>
</div>`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div
          ref={modalRef} 
          className="relative w-full max-w-4xl rounded-lg bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Compose Submission Email</h2>
            <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
          </div>

          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {duplicateError && (
            <div className="mb-4 rounded-md bg-red-50 p-4 border border-red-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">Duplicate Submission</p>
                  <p className="text-sm text-red-700">{duplicateError}</p>
                </div>
              </div>
            </div>
          )}

          {checkingDuplicate && (
            <div className="mb-4 rounded-md bg-blue-50 p-4 border border-blue-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-800">Checking for duplicate submissions...</p>
                </div>
              </div>
            </div>
          )}

          {loadingContacts && (
            <div className="mb-4 rounded-md bg-blue-50 p-4 border border-blue-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-800">Loading contacts...</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <EmailInput
              ref={toFieldRef}
              label="To"
              value={emailData.to}
              onChange={(value) => {
                setEmailData(prev => ({ ...prev, to: value }));
                setToFieldError(null);
              }}
              placeholder="Enter recipient email addresses (separate multiple emails with commas)"
              contacts={contacts}
              required
              error={toFieldError}
            />
            
            <EmailInput
              label="CC"
              value={emailData.cc}
              onChange={(value) => {
                setEmailData(prev => ({ ...prev, cc: value }));
                setCcFieldError(null);
              }}
              placeholder="Enter CC email addresses (separate multiple emails with commas)"
              contacts={contacts}
              error={ccFieldError}
            />
            
            <EmailInput
              label="BCC"
              value={emailData.bcc}
              onChange={(value) => {
                setEmailData(prev => ({ ...prev, bcc: value }));
                setBccFieldError(null);
              }}
              placeholder="Enter BCC email addresses (separate multiple emails with commas)"
              contacts={contacts}
              error={bccFieldError}
            />
            
            <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-md">
              <strong>Tip:</strong> You can enter multiple email addresses separated by commas (,) or semicolons (;). 
              <br />
              Example: user1@example.com, user2@example.com; user3@example.com
            </div>
            
            <Input
              label="Subject"
              value={emailData.subject}
              onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
            />

            {/* File Attachment Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attachments
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileAttachment}
                  className="hidden"
                  id="file-upload"
                />
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="mt-4">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="text-blue-600 hover:text-blue-500 font-medium">Click to upload files</span>
                      <span className="text-gray-500"> or drag and drop</span>
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">PNG, JPG, PDF, DOC, DOCX up to 10MB each</p>
                </div>
              </div>

              {/* Display attached files */}
              {attachedFiles.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-sm font-medium text-gray-700">Attached Files:</p>
                  {attachedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                      <div className="flex items-center space-x-2">
                        <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachedFile(index)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Content
              </label>
              <div 
                className="w-full min-h-[400px] rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                contentEditable
                dangerouslySetInnerHTML={{ __html: emailData.content }}
                onInput={(e) => {
                  const target = e.target as HTMLDivElement;
                  setEmailData(prev => ({ ...prev, content: target.innerHTML }));
                }}
                style={{
                  minHeight: '400px',
                  maxHeight: '600px',
                  overflowY: 'auto',
                  fontFamily: 'Arial, sans-serif',
                  lineHeight: '1.5'
                }}
              />
              <p className="mt-1 text-xs text-gray-500">
                The submission details are formatted as a professional HTML table for better readability
              </p>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="right-to-represent"
                checked={hasRightToRepresent}
                onChange={(e) => setHasRightToRepresent(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-800 focus:ring-blue-600"
              />
              <label htmlFor="right-to-represent" className="ml-2 block text-sm text-gray-900">
                I confirm that I have the Right to Represent this candidate
              </label>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!hasRightToRepresent || submitting || !!duplicateError || checkingDuplicate}
              isLoading={submitting}
            >
              Submit Candidate
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailCompositionModal;
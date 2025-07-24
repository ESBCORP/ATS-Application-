import React, { useState, useEffect, useRef } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import EmailInput from '../ui/EmailInput';
import { Candidate, Job } from '../../types';
import { sendEmail, parseEmailList, validateMultipleEmails } from '../../services/emailService';
import { updateCandidate } from '../../services/candidatesService';
import { fetchContacts, Contact } from '../../services/contactsService';

interface RTREmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  candidate: Candidate;
  job: Job;
}

const RTREmailModal: React.FC<RTREmailModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  candidate,
  job
}) => {
  const toFieldRef = useRef<HTMLInputElement>(null);
  
  const [emailData, setEmailData] = useState({
    to: candidate.email,
    cc: '',
    bcc: '',
    subject: `Right to Represent - ${candidate.firstName} ${candidate.lastName} - ${job?.title || ''}`,
    content: `I, **${candidate.firstName} ${candidate.lastName}**, give exclusive permission to ESB Technologies Corporation to submit my resume and qualifications for
A **${job?.title || ''}** through ESB's Primary Vendor and/or implementation partner.

I confirm that I have not submitted my resume or an application for this specific position to any other staffing Vendor
within the last thirty (30) days, nor have I signed a Right to Represent form with another staffing vendor for this job
requisition. 

Acceptance to this RTR acknowledges authorization for ESB Technologies Corporation("ESB") to represent me for this
posted requisition from today for the next 30 days.  

ESB Technologies Corporation will pay me **$${job?.adjustedPayRate || ''}/hr** all Inclusive on a full-time basis.

End Client: **${job?.endClient || ''}**

If I give a Right to Represent to more than one staffing vendor for the same requisition, I will be pulled from consideration
meaning I will no longer be eligible for this requisition.

I in good faith agree and commit to the above rate and will not increase the rates/payment terms during and after the
interview process.

I also agree that I am available to start 2 weeks from the date of the confirmation. 

To avoid double submissions and loss of opportunity due to disqualification, I will contact ESB if I come across a similar
position before making that submission. 

In order to assess the fit between my skill set and ESB's Client requirement, ESB will establish communication between
myself, the Subcontractor, the Consultant, and its clients. At all times I will represent myself as an employee of ESB. Also, I
will never talk, or present any issues or discuss about Salary/Rate, Benefits, Insurance, start date, commute, or any other
Personal matters with any of ESB's Client (either the implementation partner or the preferred vendor, or the end-Client) at
any time (before or after the interview). All such issues will be addressed with ESB ONLY.

I agree that I will not perform or solicit services, directly or indirectly, whether as an employee, contractor, subcontractor,
or on behalf of or in conjunction with any other company, corporation, person, or other entity, for or from any ESB client
for whom I have spoken with during the contract finalizing process, without the prior written consent of an officer of ESB.

I also agree that a breach of this understanding could cause severe financial hardships to ESB. Violation of this shall make
me to compensate as liquidated damages the full value of the lost business and the incidental expenses incurred.

Replying to this email confirms that I agree to the above rate and exclusivity of the position and upon setting up a Client
interview, I shall provide Key with 48 hours (2 business days) of hold time. 

This agreement shall be construed in accordance with the laws of the State of Texas and the courts of the State of Texas,
Williamson County shall have jurisdiction.`
  });
  
  const [toFieldError, setToFieldError] = useState<string | null>(null);
  const [ccFieldError, setCcFieldError] = useState<string | null>(null);
  const [bccFieldError, setBccFieldError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(false);

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

  if (!isOpen) return null;

  const handleSubmit = async () => {
    // Clear previous errors
    setToFieldError(null);
    setCcFieldError(null);
    setBccFieldError(null);
    setError(null);

    // Validate TO field
    if (!emailData.to.trim()) {
      setToFieldError('This field is mandatory');
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
      hasValidationErrors = true;
    }

    if (!ccValidation.isValid) {
      setCcFieldError(`Invalid email addresses: ${ccValidation.invalidEmails.join(', ')}`);
      hasValidationErrors = true;
    }

    if (!bccValidation.isValid) {
      setBccFieldError(`Invalid email addresses: ${bccValidation.invalidEmails.join(', ')}`);
      hasValidationErrors = true;
    }

    if (hasValidationErrors) {
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // First update the candidate's RTR status in the database
      const updatedCandidate = await updateCandidate(candidate.id, {
        ...candidate,
        rtrStatus: 'Received'
      });

      // Only send the email if the database update was successful
      if (updatedCandidate.rtrStatus === 'Received') {
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
          isHtml: false // RTR emails are typically plain text
        };

        await sendEmail(emailPayload);
        onSubmit();
      }
    } catch (err) {
      console.error('Failed to send RTR email:', err);
      // Check if error is related to email sending
      if (err instanceof Error && err.message.toLowerCase().includes('email')) {
        setError('Failed to send email. Please check email addresses and try again.');
      } else {
        setError('Failed to send RTR email. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="relative w-full max-w-4xl rounded-lg bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Send RTR Email</h2>
            <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
          </div>

          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
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
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Content
              </label>
              <textarea
                className="font-mono w-full min-h-[600px] rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={emailData.content}
                onChange={(e) => setEmailData(prev => ({ ...prev, content: e.target.value }))}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button 
              onClick={handleSubmit}
              isLoading={submitting}
            >
              Send RTR Email
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RTREmailModal;
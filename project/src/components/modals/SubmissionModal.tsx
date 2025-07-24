import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { Job, Candidate } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import EmailCompositionModal from './EmailCompositionModal';

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  candidate: Candidate;
  job: Job;
}

const SubmissionModal: React.FC<SubmissionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  candidate,
  job
}) => {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [submissionData, setSubmissionData] = useState({
    availability: '2 Weeks',
    engagement: 'C2C',
    locationPreference: job.workType || 'None',
    payType: job.payType || 'Annual Salary',
    billType: 'Monthly',
    payRate: job.payRate || 0,
    billRate: job.payRate || 0,
    additionalRecipients: ''
  });

  if (!isOpen) return null;

  const handleNext = () => {
    setShowEmailModal(true);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
          
          <div className="relative w-full max-w-4xl rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Submit Candidate</h2>
                <p className="mt-1 text-sm text-gray-500">
                  {candidate.firstName} {candidate.middleName} {candidate.lastName}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Submission Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Submission Details</h3>
                
                <Input
                  label="Availability*"
                  value={submissionData.availability}
                  onChange={(e) => setSubmissionData(prev => ({ ...prev, availability: e.target.value }))}
                />
                
                <Input
                  label="Engagement"
                  value={submissionData.engagement}
                  onChange={(e) => setSubmissionData(prev => ({ ...prev, engagement: e.target.value }))}
                />
                
                <Input
                  label="Location Preference"
                  value={submissionData.locationPreference}
                  onChange={(e) => setSubmissionData(prev => ({ ...prev, locationPreference: e.target.value }))}
                />
                
                <Input
                  label="Pay Type*"
                  value={submissionData.payType}
                  onChange={(e) => setSubmissionData(prev => ({ ...prev, payType: e.target.value }))}
                />
                
                <Input
                  label="Bill Type"
                  value={submissionData.billType}
                  onChange={(e) => setSubmissionData(prev => ({ ...prev, billType: e.target.value }))}
                />
                
                <Input
                  label="Pay Rate*"
                  type="number"
                  value={submissionData.payRate}
                  onChange={(e) => setSubmissionData(prev => ({ ...prev, payRate: Number(e.target.value) }))}
                />
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Resume Upload</label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PDF or DOC up to 10MB</p>
                      </div>
                      <input type="file" className="hidden" accept=".pdf,.doc,.docx" />
                    </label>
                  </div>
                </div>
              </div>

              {/* Job Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Job Details</h3>
                
                <div className="rounded-lg border border-gray-200 p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Job Title:</span>
                    <span>{job.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Client:</span>
                    <span>{job.customer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Location:</span>
                    <span>{job.city}, {job.state}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Work Type:</span>
                    <span>{job.workType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Pay Type:</span>
                    <span>{job.payType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Pay Rate:</span>
                    <span>${job.payRate}/hr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Experience Level:</span>
                    <span>{job.experienceLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Placement Type:</span>
                    <span>{job.placementType}</span>
                  </div>
                </div>

                {/* Adjusted Pay Rates */}
                <div className="rounded-lg border border-gray-200 p-4 space-y-4">
                  <h4 className="font-medium text-gray-900">Adjusted Pay Rates</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Resident (USC, GC):</span>
                      <span className="font-medium">${(job.payRate * 0.8).toFixed(2)}/hr</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Immigrant (H1B, etc):</span>
                      <span className="font-medium">${(job.payRate * 0.75).toFixed(2)}/hr</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={handleNext}>Next</Button>
            </div>
          </div>
        </div>
      </div>

      <EmailCompositionModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSubmit={onSubmit}
        candidate={candidate}
        job={job}
        submissionDetails={submissionData}
      />
    </>
  );
};

export default SubmissionModal;
import React from 'react';
import { Job } from '../../types';
import { Briefcase, MapPin, Building } from 'lucide-react';

interface JobDetailsViewProps {
  job: Job;
  onClose: () => void;
}

const JobDetailsView: React.FC<JobDetailsViewProps> = ({ job, onClose }) => {
  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="border-b p-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">{job.title}</h1>
            </div>
            <p className="mt-1 text-sm text-gray-500">Job ID: {job.id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Building className="h-4 w-4" />
            <span>{job.customer}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{job.city}, {job.state}</span>
          </div>
        </div>
      </div>

      {/* Job Description */}
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Description</h2>
        <div className="prose prose-sm max-w-none text-gray-600">
          {job.description ? (
            <div className="whitespace-pre-wrap">{job.description}</div>
          ) : (
            <p className="text-gray-500 italic">No description available</p>
          )}
        </div>
      </div>

      {/* GPT Questions */}
      {job.qaItems && job.qaItems.length > 0 && (
        <div className="p-6 border-t">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">GPT Questions</h2>
          <div className="space-y-4">
            {job.qaItems.map((qa, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium text-gray-900">{qa.question}</p>
                <p className="mt-2 text-gray-600">{qa.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetailsView;
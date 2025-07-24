import React, { useState, useEffect } from 'react';
import { Search, Loader } from 'lucide-react';
import { Job } from '../../types';
import Table from '../ui/Table';
import Button from '../ui/Button';
import Status from '../ui/Status';
import { fetchJobs } from '../../services/jobsService';

interface JobSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (job: Job) => void;
}

const JobSelectionModal: React.FC<JobSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchJobs(1, 100); // Get up to 100 jobs
        setJobs(response.data.filter(job => job.status === 'Active'));
      } catch (err) {
        setError('Failed to load jobs. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      loadJobs();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredJobs = jobs.filter(job => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      job.title.toLowerCase().includes(searchLower) ||
      job.id.toLowerCase().includes(searchLower) ||
      job.customer.toLowerCase().includes(searchLower) ||
      `${job.city}, ${job.state}`.toLowerCase().includes(searchLower)
    );
  });

  const columns = [
    {
      header: 'Job ID',
      accessor: 'id',
    },
    {
      header: 'Job Title',
      accessor: 'title',
    },
    {
      header: 'Client',
      accessor: 'customer',
    },
    {
      header: 'Location',
      accessor: (job: Job) => `${job.city}, ${job.state}`,
    },
    {
      header: 'Pay Rate',
      accessor: (job: Job) => `$${job.payRate}/hr`,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="relative w-full max-w-4xl rounded-lg bg-white p-6 shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Select Job for RTR</h2>
            <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
          </div>
          
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs by title, ID, client, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4 text-red-800">
              {error}
            </div>
          )}
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <Table
              columns={columns}
              data={filteredJobs}
              keyExtractor={(job) => job.id}
              onRowClick={(job) => {
                onSelect(job);
                onClose();
              }}
              emptyMessage="No active jobs found"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default JobSelectionModal;
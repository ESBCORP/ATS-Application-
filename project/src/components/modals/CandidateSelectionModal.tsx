import React, { useState } from 'react';
import { Candidate } from '../../types';
import Table from '../ui/Table';
import Button from '../ui/Button';
import Status from '../ui/Status';
import { Search, Loader } from 'lucide-react';

interface CandidateSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (candidate: Candidate) => void;
  candidates: Candidate[];
  loading?: boolean;
  error?: string | null;
}

const CandidateSelectionModal: React.FC<CandidateSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  candidates,
  loading = false,
  error = null
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredCandidates = candidates.filter(candidate => {
    const searchLower = searchTerm.toLowerCase();
    const fullName = `${candidate.firstName} ${candidate.middleName || ''} ${candidate.lastName}`.toLowerCase();
    
    return (
      fullName.includes(searchLower) ||
      candidate.email.toLowerCase().includes(searchLower) ||
      candidate.phone.includes(searchTerm) ||
      candidate.jobTitle.toLowerCase().includes(searchLower) ||
      candidate.skills.some(skill => skill.toLowerCase().includes(searchLower))
    );
  });

  const columns = [
    {
      header: 'Candidate ID',
      accessor: 'id',
    },
    {
      header: 'Name',
      accessor: (candidate: Candidate) => `${candidate.firstName} ${candidate.lastName}`,
    },
    {
      header: 'Job Title',
      accessor: 'jobTitle',
    },
    {
      header: 'Email',
      accessor: 'email',
    },
    {
      header: 'Phone',
      accessor: 'phone',
    },
    {
      header: 'Location',
      accessor: (candidate: Candidate) => `${candidate.city}, ${candidate.state}`,
    },
    {
      header: 'Status',
      accessor: (candidate: Candidate) => <Status status={candidate.status} />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-90">
      {/* Modal Panel */}
      <div className="relative w-full max-w-6xl p-6 bg-white border border-gray-200 rounded-lg shadow-xl dark:bg-gray-900 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Select Candidate</h2>
          <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2 dark:text-gray-300" />
            <input
              type="text"
              placeholder="Search candidates by name, email, phone, job title, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 pl-10 pr-4 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:focus:border-[#29D3C0] dark:focus:ring-[#29D3C0]"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 mb-4 text-red-800 rounded-md bg-red-50 dark:bg-red-950 dark:text-red-200">
            {error}
          </div>
        )}

        {/* Table or Loader */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 text-blue-600 dark:text-[#29D3C0] animate-spin" />
          </div>
        ) : (
          <Table
            columns={columns}
            data={filteredCandidates}
            keyExtractor={(candidate) => candidate.id}
            onRowClick={(candidate) => {
              onSelect(candidate);
              onClose();
            }}
            emptyMessage="No candidates found"
          />
        )}
      </div>
    </div>
  );
};

export default CandidateSelectionModal;
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
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="relative w-full max-w-6xl rounded-lg bg-white p-6 shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Select Candidate</h2>
            <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
          </div>
          
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search candidates by name, email, phone, job title, or skills..."
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
    </div>
  );
};

export default CandidateSelectionModal;
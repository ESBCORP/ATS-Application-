import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Candidate } from '../../types';
import Table from '../../components/ui/Table';
import Status from '../../components/ui/Status';
import { deleteCandidate } from '../../services/candidatesService';
import DeleteModal from '../../components/modals/DeleteModal';

interface CandidatesTableProps {
  candidates: Candidate[];
  selectedCandidates?: any[];
  onCandidateSelection?: (candidate: any, isSelected: boolean) => void;
}

const CandidatesTable: React.FC<CandidatesTableProps> = ({ 
  candidates, 
  selectedCandidates = [],
  onCandidateSelection 
}) => {
  const navigate = useNavigate();
  const [localCandidates, setLocalCandidates] = useState<Candidate[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState<Candidate | null>(null);
  
  const isSelected = (candidate: any) => {
    return selectedCandidates.some(selected => selected.id === candidate.id);
  };

  const handleCheckboxChange = (candidate: any, checked: boolean) => {
    if (onCandidateSelection) {
      onCandidateSelection(candidate, checked);
    }
  };
  const formatCandidateId = (candidate: Candidate): string => {
  const match = candidate.id.match(/\d+/);
  const num = match ? parseInt(match[0], 10) : 0;
  return `CAN-${num.toString().padStart(3, '0')}`;
};


  useEffect(() => {
  setLocalCandidates(candidates);
}, [candidates]); 
  
  const columns = [
    // Checkbox column for selection
    ...(onCandidateSelection ? [{
      header: (
        <input
          type="checkbox"
          checked={candidates.length > 0 && candidates.every(candidate => isSelected(candidate))}
          onChange={(e) => {
            candidates.forEach(candidate => {
              if (isSelected(candidate) !== e.target.checked) {
                handleCheckboxChange(candidate, e.target.checked);
              }
            });
          }}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      ),
      accessor: (candidate: Candidate) => (
        <input
          type="checkbox"
          checked={isSelected(candidate)}
          onChange={(e) => {
            e.stopPropagation();
            handleCheckboxChange(candidate, e.target.checked);
          }}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      ),
      className: 'w-12'
    }] : []),
    {
      header: 'Candidate ID',
      accessor: (candidate: Candidate) => formatCandidateId(candidate),
      sortable: true,
      sortAccessor: (candidate: Candidate) => candidate.id
    },
    {
      header: 'Name',
      accessor: (candidate: Candidate) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/candidates/details/${candidate.id}`);
          }}
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          {`${candidate.firstName} ${candidate.lastName}`}
        </button>
      ),
    },
    {
      header: 'Email',
      accessor: 'email',
    },
    {
      header: 'Job Title',
      accessor: 'jobTitle',
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
    {
      header: 'Owner',
      accessor: 'owner',
    },
  ];

  const handleRowClick = (candidate: Candidate) => {
    // Only navigate if we're not in selection mode or if the click wasn't on a checkbox
    if (!onCandidateSelection) {
      navigate(`/candidates/details/${candidate.id}`);
    }
  };
  const handleRowRightClick = (candidate: Candidate, e: React.MouseEvent<HTMLTableRowElement>) => {
  e.preventDefault();
  setCandidateToDelete(candidate);
  setShowDeleteModal(true);
};

return (
    <>
      <Table
        columns={columns}
        data={localCandidates} // 💬 using local state so UI can update after delete
        keyExtractor={(candidate) => candidate.id}
        onRowClick={handleRowClick}
        onRowRightClick={handleRowRightClick} // 💬 right-click support
        emptyMessage="No candidates found"
      />

      {/* 💬 DELETE MODAL shown when right-clicked */}
      {showDeleteModal && candidateToDelete && (
              <DeleteModal
        title="Delete Candidate"
        message={
      <>
        Are you sure you want to delete{' '}
        <strong>{candidateToDelete.firstName} {candidateToDelete.lastName}</strong>?
      </>
    }

        onCancel={() => {
          setShowDeleteModal(false);
          setCandidateToDelete(null);
        }}
                  onConfirm={async () => {
        if (!candidateToDelete) return false;

        try {
          await deleteCandidate(candidateToDelete.id); // 🔁 API call

          // ✅ Update frontend UI
          setLocalCandidates(prev =>
            prev.filter(c => c.id !== candidateToDelete.id)
          );

          setShowDeleteModal(false);
          setCandidateToDelete(null);
          return true; // ✅ success
        } catch (error: any) {
          console.error('Error deleting candidate:', error);

          // 🔁 Handle permission denied (403)
          if (error.response?.status === 403) {
            return false;
          }

          // You may log other errors too, or return false
          return false;
        }
      }}

      />
      )}
    </>
  );
};

export default CandidatesTable;
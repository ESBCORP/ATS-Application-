import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { candidates } from '../../data/candidates';
import { Submission } from '../../types';
import Table from '../../components/ui/Table';
import Status from '../../components/ui/Status';
import SubmissionDetailsModal from '../../components/modals/SubmissionDetailsModal';
import { updateSubmission } from '../../services/submissionsService';
import DeleteModal from '../../components/modals/DeleteModal';
import { deleteSubmission } from '../../services/submissionsService';

interface SubmissionsTableProps {
  submissions: Submission[];
  onSubmissionUpdated?: () => void;
  canUpdate?: boolean;
  canRead?: boolean;
}

const SubmissionsTable: React.FC<SubmissionsTableProps> = ({ 
  submissions, 
  onSubmissionUpdated,
  canUpdate = false,
  canRead = false
}) => {
  const navigate = useNavigate();
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [submissionToDelete, setSubmissionToDelete] = useState<Submission | null>(null);

  // Helper function to format submission ID with SUB- prefix and zero-padding
  const formatSubmissionId = (submission: Submission): string => {
    // If the ID already has the SUB- prefix, return as is
    if (submission.id.startsWith('SUB-')) {
      return submission.id;
    }
    
    // Extract numeric part from ID
    const match = submission.id.match(/\d+/);
    const numericPart = match ? parseInt(match[0], 10) : 0;
    
    // Format with SUB- prefix and zero-padding (3 digits)
    return `SUB-${numericPart.toString().padStart(3, '0')}`;
  };

  const handleDeleteConfirm = async () => {
    if (!submissionToDelete) return;

    try {
      // ✅ Call the real API
      await deleteSubmission(submissionToDelete.id);

      // ✅ Refresh the data (if parent handles data)
      if (onSubmissionUpdated) {
        onSubmissionUpdated(); // reload the list
      }

      // ✅ Remove modal and clear state
      setShowDeleteModal(false);
      setSubmissionToDelete(null);
    } catch (error) {
      console.error('Failed to delete submission:', error);
      alert('Failed to delete submission. Please try again.');
    }
  };

  const handleCandidateClick = (submission: Submission, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/candidates/details/${submission.candidateId}`);
  };

  const handleSubmissionUpdate = async (updatedSubmission: Submission) => {
    try {
      await updateSubmission(updatedSubmission);
      setSelectedSubmission(null);
      if (onSubmissionUpdated) {
        onSubmissionUpdated();
      }
    } catch (error) {
      console.error('Error updating submission:', error);
      throw new Error('Failed to update submission');
    }
  };

  // Helper function to extract numeric part from submission ID for proper sorting
  const getSubmissionIdNumber = (submission: Submission): number => {
    // Extract numeric part from ID (e.g., "SUB-123" -> 123)
    const match = submission.id.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };

  const columns = [
    {
      header: 'Submission ID',
      accessor: (submission: Submission) => (
        canRead ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedSubmission(submission);
            }}
            className="text-blue-600 hover:text-blue-800 hover:underline dark:text-[#29D3C0] dark:hover:text-[#29D3C0]"
          >
            {formatSubmissionId(submission)}
          </button>
        ) : (
          <span className="text-gray-900">{formatSubmissionId(submission)}</span>
        )
      ),
      sortable: true,
      sortAccessor: (submission: Submission) => getSubmissionIdNumber(submission)
    },
    {
      header: 'Candidate',
      accessor: (submission: Submission) => (
        <button
          onClick={(e) => handleCandidateClick(submission, e)}
          className="text-blue-600 hover:text-blue-800 hover:underline dark:text-[#29D3C0] dark:hover:text-[#29D3C0]"

        >
          {submission.firstName} {submission.lastName}
        </button>
      ),
    },
    {
      header: 'Job ID',
      accessor: (submission: Submission) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/jobs/details/${submission.jobId}`);
          }}
        className="text-blue-600 hover:text-blue-800 hover:underline dark:text-[#29D3C0] dark:hover:text-[#29D3C0]"
        >
          {submission.jobId}
        </button>
      ),
      sortable: true,
      sortAccessor: (submission: Submission) => {
        // Extract numeric part from Job ID for proper sorting
        const match = submission.jobId.match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
      }
    },
    {
      header: 'Status',
      accessor: (submission: Submission) => <Status status={submission.status} />,
    },
    {
      header: 'Expected Pay',
      accessor: (submission: Submission) => 
        submission.payType === 'Hourly' 
          ? `$${submission.expectedPay}/hr` 
          : `$${submission.expectedPay.toLocaleString()}`,
    },
    {
      header: 'Submitted Date',
      accessor: (submission: Submission) => new Date(submission.submittedDate).toLocaleDateString(),
      sortable: true,
      sortAccessor: (submission: Submission) => new Date(submission.submittedDate).getTime()
    },
    {
      header: 'Submitter',
      accessor: 'submitter',
    },
  ];

  const handleRowClick = (submission: Submission) => {
    navigate(`/candidates/details/${submission.candidateId}`);
  };

  const handleRowRightClick = (
    submission: Submission,
    e: React.MouseEvent<HTMLTableRowElement>
  ) => {
    e.preventDefault();
    setSubmissionToDelete(submission);
    setShowDeleteModal(true);
  };

  // The submissions are already sorted and paginated in the parent component
  // We just need to display them as received
  return (
    <>
      <Table
        columns={columns}
        data={submissions}
        keyExtractor={(submission) => submission.id}
        onRowClick={handleRowClick}
        onRowRightClick={handleRowRightClick}
        emptyMessage="No submissions found"
      />

      {selectedSubmission && canRead && (
        <SubmissionDetailsModal
          isOpen={true}
          onClose={() => setSelectedSubmission(null)}
          submission={selectedSubmission}
          onSubmit={handleSubmissionUpdate}
        />
      )}

      {showDeleteModal && submissionToDelete && (
        <DeleteModal
          title="Delete Submission"
          message={
            <>
              Are you sure you want to delete submission <strong>{formatSubmissionId(submissionToDelete)}</strong> for{' '}
              <strong>{submissionToDelete.firstName} {submissionToDelete.lastName}</strong>?
            </>
          }
          onCancel={() => {
            setShowDeleteModal(false);
            setSubmissionToDelete(null);
          }}
          onConfirm={async () => {
            if (!submissionToDelete) return;
            try {
              await deleteSubmission(submissionToDelete.id);
              if (onSubmissionUpdated) onSubmissionUpdated(); // Refresh parent data
              setShowDeleteModal(false);
              setSubmissionToDelete(null);
            } catch (error) {
              console.error('Delete submission failed:', error);
              alert('Delete failed.');
            }
          }}
        />
      )}
    </>
  );
};

export default SubmissionsTable;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Job } from '../../types';
import Table from '../../components/ui/Table';
import Status from '../../components/ui/Status';
import DeleteModal from '../../components/modals/DeleteModal';
import { deleteJob } from '../../services/jobsService';

interface JobsTableProps {
  jobs: Job[];
}

const JobsTable: React.FC<JobsTableProps> = ({ jobs }) => {
  const navigate = useNavigate();

  // State to manage delete popup and local job list
  const [localJobs, setLocalJobs] = useState<Job[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);

  useEffect(() => {
    setLocalJobs(jobs);
  }, [jobs]);

  // Helper function to extract numeric ID from formatted job ID
  const extractNumericId = (jobId: string): string => {
    // Extract numeric part from formatted ID (e.g., "JOB-001" -> "1")
    const match = jobId.match(/\d+/);
    return match ? parseInt(match[0], 10).toString() : jobId;
  };

  const columns = [
    {   
      header: 'Job ID',
      accessor: (job: Job) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            const numericId = extractNumericId(job.id);
            navigate(`/jobs/details/${numericId}`);
          }}
           className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          {job.id}
        </button>
      ),
      sortable: true,
      sortAccessor: (job: Job) => {
        const match = job.id.match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
      }
    },
    {
      header: 'Job Title',
      accessor: 'title',
    },
    {
      header: 'Status',
      accessor: (job: Job) => <Status status={job.status} />,
    },
    {
      header: 'Pay Rate',
      accessor: (job: Job) => `$${job.payRate}/hr`,
    },
    {
      header: 'Location',
      accessor: (job: Job) => `${job.city}, ${job.state}`,
    },
    {
      header: 'Client',
      accessor: 'customer',
    },
    {
      header: 'Created',
      accessor: (job: Job) => (
        <div>
          <div>{new Date(job.createdDate).toLocaleDateString()}</div>
          <div className="text-xs text-gray-500">by {job.createdBy || 'Unknown'}</div>
        </div>
      ),
    },
    {
      header: 'Modified',
      accessor: (job: Job) => (
        <div>
          <div>{new Date(job.modifiedDate || job.createdDate).toLocaleDateString()}</div>
          <div className="text-xs text-gray-500">by {job.modifiedBy || job.createdBy || 'Unknown'}</div>
        </div>
      ),
    },
  ];

  const handleRowClick = (job: Job) => {
    const numericId = extractNumericId(job.id);
    navigate(`/jobs/details/${numericId}`);
  };

  // Right-click triggers delete modal
  const handleRowRightClick = (
    job: Job,
    e: React.MouseEvent<HTMLTableRowElement>
  ) => {
    e.preventDefault();
    setJobToDelete(job);
    setShowDeleteModal(true);
  };

  return (
    <>
      <Table
        columns={columns}
        data={localJobs}
        keyExtractor={(job) => job.id}
        onRowClick={handleRowClick}
        onRowRightClick={handleRowRightClick}
        emptyMessage="No jobs found"
      />

      {showDeleteModal && jobToDelete && (
        <DeleteModal
          title="Delete Job"
          message={
            <>
              Are you sure you want to delete job <strong>{jobToDelete.id}</strong> titled <strong>{jobToDelete.title}</strong>?
            </>
          }
          onCancel={() => {
            setShowDeleteModal(false);
            setJobToDelete(null);
          }}
          onConfirm={async () => {
            if (!jobToDelete) return false;

            try {
              const numericId = extractNumericId(jobToDelete.id);
              await deleteJob(numericId);
              setLocalJobs(prev =>
                prev.filter(j => j.id !== jobToDelete.id)
              );
              setShowDeleteModal(false);
              setJobToDelete(null);
              return true;
            } catch (error) {
              console.error('Failed to delete job:', error);
              return false;
            }
          }}
        />
      )}
    </>
  );
};

export default JobsTable;
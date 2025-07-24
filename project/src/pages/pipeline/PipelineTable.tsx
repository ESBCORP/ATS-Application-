import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Pipeline } from '../../types';
import Table from '../../components/ui/Table';
import Status from '../../components/ui/Status';

interface PipelineTableProps {
  pipeline: Pipeline[];
}

const PipelineTable: React.FC<PipelineTableProps> = ({ pipeline }) => {
  const navigate = useNavigate();

  const columns = [
    {
      header: 'Pipeline ID',
      accessor: 'id',
    },
    {
      header: 'Candidate',
      accessor: 'candidateName',
    },
    {
      header: 'Job ID',
      accessor: 'jobId',
    },
    {
      header: 'Stage',
      accessor: (pipeline: Pipeline) => <Status status={pipeline.stage} />,
    },
    {
      header: 'Status',
      accessor: (pipeline: Pipeline) => <Status status={pipeline.status} />,
    },
    {
      header: 'Last Updated',
      accessor: (pipeline: Pipeline) => new Date(pipeline.lastUpdated).toLocaleDateString(),
    },
  ];

  const handleRowClick = (pipeline: Pipeline) => {
    navigate(`/pipeline/${pipeline.id}`);
  };

  return (
    <Table
      columns={columns}
      data={pipeline}
      keyExtractor={(pipeline) => pipeline.id}
      onRowClick={handleRowClick}
      emptyMessage="No pipeline entries found"
    />
  );
};

export default PipelineTable;
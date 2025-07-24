import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { pipeline } from '../../data/pipeline';
import PipelineTable from './PipelineTable';
import PageHeader from '../../components/layout/PageHeader';
import DateRangeFilter from '../../components/ui/DateRangeFilter';

const PipelinePage: React.FC = () => {
  const { status } = useParams<{ status?: string }>();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  
  let filteredPipeline = [...pipeline];
  let title = 'Active Pipeline';
  let subtitle = 'Track candidates through the hiring process';
  
  if (status === 'inactive') {
    filteredPipeline = pipeline.filter(item => item.status === 'Inactive');
    title = 'Inactive Pipeline';
    subtitle = 'View inactive pipeline entries';
  } else {
    filteredPipeline = pipeline.filter(item => item.status === 'Active');
  }

  // Apply date range filter
  if (dateRange.start && dateRange.end) {
    filteredPipeline = filteredPipeline.filter(item => {
      const itemDate = new Date(item.lastUpdated);
      return itemDate >= dateRange.start && itemDate <= dateRange.end;
    });
  }
  
  if (searchTerm) {
    filteredPipeline = filteredPipeline.filter(
      item => 
        item.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.jobId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.stage.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  return (
    <div>
      <PageHeader
        title={title}
        subtitle={subtitle}
        actions={
          <div className="flex items-center space-x-2">
            <DateRangeFilter onFilterChange={setDateRange} />
          </div>
        }
      />
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search pipeline..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      
      <div className="mb-6 overflow-x-auto rounded-lg bg-white p-4 shadow-md">
        <div className="flex min-w-max">
          <div className="mr-4 w-64 flex-shrink-0">
            <h3 className="mb-3 font-medium text-gray-700">Screening</h3>
            <div className="space-y-2">
              {filteredPipeline
                .filter(item => item.stage === 'Screening')
                .map(item => (
                  <div key={item.id} className="rounded-md border border-gray-200 bg-white p-3 shadow-sm">
                    <p className="font-medium text-gray-800">{item.candidateName}</p>
                    <p className="text-xs text-gray-500">Job: {item.jobId}</p>
                    <p className="text-xs text-gray-500">Updated: {new Date(item.lastUpdated).toLocaleDateString()}</p>
                  </div>
                ))}
            </div>
          </div>
          
          <div className="mr-4 w-64 flex-shrink-0">
            <h3 className="mb-3 font-medium text-gray-700">Submitted</h3>
            <div className="space-y-2">
              {filteredPipeline
                .filter(item => item.stage === 'Submitted')
                .map(item => (
                  <div key={item.id} className="rounded-md border border-gray-200 bg-white p-3 shadow-sm">
                    <p className="font-medium text-gray-800">{item.candidateName}</p>
                    <p className="text-xs text-gray-500">Job: {item.jobId}</p>
                    <p className="text-xs text-gray-500">Updated: {new Date(item.lastUpdated).toLocaleDateString()}</p>
                  </div>
                ))}
            </div>
          </div>
          
          <div className="mr-4 w-64 flex-shrink-0">
            <h3 className="mb-3 font-medium text-gray-700">Interview</h3>
            <div className="space-y-2">
              {filteredPipeline
                .filter(item => item.stage === 'Interview')
                .map(item => (
                  <div key={item.id} className="rounded-md border border-gray-200 bg-white p-3 shadow-sm">
                    <p className="font-medium text-gray-800">{item.candidateName}</p>
                    <p className="text-xs text-gray-500">Job: {item.jobId}</p>
                    <p className="text-xs text-gray-500">Updated: {new Date(item.lastUpdated).toLocaleDateString()}</p>
                  </div>
                ))}
            </div>
          </div>
          
          <div className="mr-4 w-64 flex-shrink-0">
            <h3 className="mb-3 font-medium text-gray-700">Offer</h3>
            <div className="space-y-2">
              {filteredPipeline
                .filter(item => item.stage === 'Offer')
                .map(item => (
                  <div key={item.id} className="rounded-md border border-gray-200 bg-white p-3 shadow-sm">
                    <p className="font-medium text-gray-800">{item.candidateName}</p>
                    <p className="text-xs text-gray-500">Job: {item.jobId}</p>
                    <p className="text-xs text-gray-500">Updated: {new Date(item.lastUpdated).toLocaleDateString()}</p>
                  </div>
                ))}
            </div>
          </div>
          
          <div className="w-64 flex-shrink-0">
            <h3 className="mb-3 font-medium text-gray-700">Hired</h3>
            <div className="space-y-2">
              {filteredPipeline
                .filter(item => item.stage === 'Hired')
                .map(item => (
                  <div key={item.id} className="rounded-md border border-gray-200 bg-white p-3 shadow-sm">
                    <p className="font-medium text-gray-800">{item.candidateName}</p>
                    <p className="text-xs text-gray-500">Job: {item.jobId}</p>
                    <p className="text-xs text-gray-500">Updated: {new Date(item.lastUpdated).toLocaleDateString()}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      
      <PipelineTable pipeline={filteredPipeline} />
    </div>
  );
};

export default PipelinePage;
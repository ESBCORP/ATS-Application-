import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import DateRangeFilter from '../../components/ui/DateRangeFilter';
import { pipeline } from '../../data/pipeline';
import PipelineTable from './PipelineTable';

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
    <div className="min-h-screen text-gray-900 bg-white dark:text-gray-100 dark:bg-gray-900">
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
          className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 px-4 py-2 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:focus:border-[#29D3C0] dark:focus:ring-[#29D3C0]"
        />
      </div>
      <div className="p-2 mb-3 overflow-x-auto bg-white border rounded-md shadow-sm dark:bg-gray-900 dark:shadow-md dark:border-gray-700">
  <div className="flex min-w-max">
    
    {/* Screening */}
    <div className="flex-shrink-0 w-52">
      <h3 className="mb-2 font-medium text-gray-700 dark:text-gray-300">Screening</h3>
      <div className="space-y-2">
        {filteredPipeline
          .filter(item => item.stage === 'Screening')
          .map(item => (
            <div key={item.id} className="p-2 bg-white border border-gray-200 rounded-md shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <p className="font-medium text-gray-800 dark:text-gray-100">{item.candidateName}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Job: {item.jobId}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Updated: {new Date(item.lastUpdated).toLocaleDateString()}</p>
            </div>
          ))}
      </div>
    </div>

    {/* Submitted */}
    <div className="flex-shrink-0 ml-8 w-52">
      <h3 className="mb-2 font-medium text-gray-700 dark:text-gray-300">Submitted</h3>
      <div className="space-y-2">
        {filteredPipeline
          .filter(item => item.stage === 'Submitted')
          .map(item => (
            <div key={item.id} className="p-2 bg-white border border-gray-200 rounded-md shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <p className="font-medium text-gray-800 dark:text-gray-100">{item.candidateName}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Job: {item.jobId}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Updated: {new Date(item.lastUpdated).toLocaleDateString()}</p>
            </div>
          ))}
      </div>
    </div>

    {/* Interview */}
    <div className="flex-shrink-0 ml-8 w-52">
      <h3 className="mb-2 font-medium text-gray-700 dark:text-gray-300">Interview</h3>
      <div className="space-y-2">
        {filteredPipeline
          .filter(item => item.stage === 'Interview')
          .map(item => (
            <div key={item.id} className="p-2 bg-white border border-gray-200 rounded-md shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <p className="font-medium text-gray-800 dark:text-gray-100">{item.candidateName}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Job: {item.jobId}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Updated: {new Date(item.lastUpdated).toLocaleDateString()}</p>
            </div>
          ))}
      </div>
    </div>

    {/* Offer */}
    <div className="flex-shrink-0 ml-8 w-52">
      <h3 className="mb-2 font-medium text-gray-700 dark:text-gray-300">Offer</h3>
      <div className="space-y-2">
        {filteredPipeline
          .filter(item => item.stage === 'Offer')
          .map(item => (
            <div key={item.id} className="p-2 bg-white border border-gray-200 rounded-md shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <p className="font-medium text-gray-800 dark:text-gray-100">{item.candidateName}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Job: {item.jobId}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Updated: {new Date(item.lastUpdated).toLocaleDateString()}</p>
            </div>
          ))}
      </div>
    </div>

    {/* Hired */}
    <div className="flex-shrink-0 w-48 ml-8">
      <h3 className="mb-2 font-medium text-gray-700 dark:text-gray-300">Hired</h3>
      <div className="space-y-2">
        {filteredPipeline
          .filter(item => item.stage === 'Hired')
          .map(item => (
            <div key={item.id} className="p-1.5 bg-white border border-gray-200 rounded-md shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <p className="font-medium text-gray-800 dark:text-gray-100">{item.candidateName}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Job: {item.jobId}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Updated: {new Date(item.lastUpdated).toLocaleDateString()}</p>
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
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Filter, Loader, AlertCircle, Lock } from 'lucide-react';
import { fetchJobs } from '../../services/jobsService';
import { useAuth } from '../../contexts/AuthContext';
import JobsTable from './JobsTable';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/ui/Button';
import DateRangeFilter from '../../components/ui/DateRangeFilter';

const JobsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { status } = useParams<{ status?: string }>();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Pagination settings - exactly 15 per page
  const itemsPerPage = 15;
  
  let title = 'All Jobs';
  let subtitle = 'Manage your job postings';
  
  if (status === 'active') {
    title = 'Active Jobs';
    subtitle = 'Currently active job postings';
  } else if (status === 'inactive') {
    title = 'Inactive Jobs';
    subtitle = 'Currently inactive job postings';
  }

  // Helper function to extract numeric part from job ID for proper sorting
const getJobIdNumber = (job: any): number => {
  const match = job.id.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
};


  const loadJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      setPermissionDenied(false);
      // Fetch all jobs from API (we'll handle pagination client-side)
      const response = await fetchJobs(1, 1000); // Get enough data
      
      // Sort jobs by numeric ID in ascending order
      const sortedJobs = response.data.sort((a, b) => {
        const aNum = getJobIdNumber(a);
        const bNum = getJobIdNumber(b);
        return aNum - bNum;
      });
      
      setJobs(sortedJobs);
      setError(null);
    } catch (err: any) {
      console.error('Error loading jobs:', err);
      
      // Check if it's a 403 Forbidden error
      if (err.response && err.response.status === 403) {
        setPermissionDenied(true);
        setError(null);
      } else {
        setError('Failed to load jobs. Please try again later.');
        setPermissionDenied(false);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [status]);
  
  let filteredJobs = [...jobs];
  
  // Apply status filter
  if (status === 'active') {
    filteredJobs = filteredJobs.filter(job => job.status === 'Active');
  } else if (status === 'inactive') {
    filteredJobs = filteredJobs.filter(job => job.status === 'Inactive');
  }
  
  // Apply date range filter
  if (dateRange.start && dateRange.end) {
    filteredJobs = filteredJobs.filter(job => {
      const jobDate = new Date(job.createdDate);
      return jobDate >= dateRange.start && jobDate <= dateRange.end;
    });
  }
  
  // Apply search filter
  if (searchTerm) {
    const searchLower = searchTerm.toLowerCase();
    filteredJobs = filteredJobs.filter(
      job => 
        job.title.toLowerCase().includes(searchLower) ||
        job.id.toLowerCase().includes(searchLower) ||
        job.customer.toLowerCase().includes(searchLower)
    );
  }

  // Ensure filtered jobs are also sorted by ID
  filteredJobs.sort((a, b) => {
    const aNum = getJobIdNumber(a);
    const bNum = getJobIdNumber(b);
    return aNum - bNum;
  });

  // Client-side pagination - exactly 15 items per page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedJobs = filteredJobs.slice(startIndex, endIndex);
  const totalFilteredPages = Math.ceil(filteredJobs.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalFilteredPages) {
      setCurrentPage(page => page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(page => page - 1);
    }
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, dateRange, status]);

  // Show permission denied message if user doesn't have access
  if (permissionDenied) {
    return (
      <div className="space-y-6">
        <PageHeader
          title={title}
          subtitle={subtitle}
        />

        <div className="rounded-md bg-red-50 dark:bg-red-900/50 p-6 border border-red-200 dark:border-red-800">
          <div className="flex items-center">
            <Lock className="h-8 w-8 text-red-400" />
            <div className="ml-4">
              <h3 className="text-lg font-medium text-red-800 dark:text-red-200">Access Denied</h3>
              <p className="text-sm text-red-700 dark:text-red-300 mt-2">
                You do not have the required permissions to view Jobs.
              </p>
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                Please contact your administrator to request access to the Jobs module.
              </p>
            </div>
          </div>
        </div>
      </div>
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
            <Button
              onClick={() => navigate('/jobs/new')}
              className="flex items-center"
            >
              <Plus className="mr-1 h-4 w-4" />
              Add Job
            </Button>
          </div>
        }
      />
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search jobs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {error && (
        <div className="mb-6 rounded-md p-4 bg-red-50 dark:bg-red-900/50 text-red-800 dark:text-red-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <>
          <JobsTable jobs={paginatedJobs} />
          
          {/* Pagination - Only show if there are results */}
          {filteredJobs.length > 0 && (
            <div className="mt-6 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 sm:px-6">
              <div className="flex flex-1 justify-between sm:hidden">
                <Button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  variant="outline"
                >
                  Previous
                </Button>
                <Button
                  onClick={handleNextPage}
                  disabled={currentPage === totalFilteredPages}
                  variant="outline"
                >
                  Next
                </Button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(endIndex, filteredJobs.length)}
                    </span>{' '}
                    of <span className="font-medium">{filteredJobs.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <Button
                      variant="outline"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                      className="rounded-l-md"
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleNextPage}
                      disabled={currentPage === totalFilteredPages}
                      className="rounded-r-md"
                    >
                      Next
                    </Button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default JobsPage;
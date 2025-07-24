import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Loader, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { fetchCandidates } from '../../services/candidatesService';
import { fetchSubmissions, fetchMySubmissions } from '../../services/submissionsService';
import { fetchPermissions } from '../../services/permissionsService';
import SubmissionsTable from './SubmissionsTable';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/ui/Button';
import DateRangeFilter from '../../components/ui/DateRangeFilter';
import CandidateSelectionModal from '../../components/modals/CandidateSelectionModal';
import { Candidate, Submission } from '../../types';

const SubmissionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { filter } = useParams<{ filter?: string }>();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [showCandidateSelection, setShowCandidateSelection] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [permissions, setPermissions] = useState({
    canRead: false,
    canCreate: false,
    canUpdate: false
  });
  const [currentPage, setCurrentPage] = useState(1);
  
  // Pagination settings - exactly 15 per page
  const itemsPerPage = 15;
  
  let title = 'All Submissions';
  let subtitle = 'Manage your candidate submissions';
  
  // Helper function to extract numeric part from submission ID for proper sorting
  const getSubmissionIdNumber = (submission: Submission): number => {
    // Extract numeric part from ID (e.g., "SUB-123" -> 123)
    const match = submission.id.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };

  // Check permissions from database
  const checkPermissions = async () => {
    try {
      console.log('🔍 Checking permissions for user:', user?.role);
      
      // For Employee role, assign default permissions without API call
      if (user?.role === 'Employee') {
        console.log('👤 Employee detected - assigning default permissions');
        const employeePerms = {
          canRead: true,
          canCreate: true, // Allow Employee to create submissions
          canUpdate: false
        };
        
        console.log('✅ Employee permissions:', employeePerms);
        setPermissions(employeePerms);
        setPermissionDenied(false);
        return employeePerms;
      }
      
      // For SuperAdmin and Admin, grant full access without API check
      if (user?.role === 'SuperAdmin' || user?.role === 'Admin') {
        console.log('👑 SuperAdmin/Admin detected - granting full access');
        const adminPerms = {
          canRead: true,
          canCreate: true,
          canUpdate: true
        };
        
        setPermissions(adminPerms);
        setPermissionDenied(false);
        return adminPerms;
      }
      
      // For any other role or no role, deny access
      console.log('❌ Unknown role or no role - denying access');
      setPermissionDenied(true);
      setPermissions({ canRead: false, canCreate: false, canUpdate: false });
      return { canRead: false, canCreate: false, canUpdate: false };
      
    } catch (err: any) {
      console.error('❌ Error in checkPermissions:', err);
      
      // If it's a 403 error, show permission denied
      if (err.response && err.response.status === 403) {
        console.log('❌ 403 Forbidden - showing access denied');
        setPermissionDenied(true);
        setPermissions({ canRead: false, canCreate: false, canUpdate: false });
        return { canRead: false, canCreate: false, canUpdate: false };
      }
      
      // For other errors, fall back to role-based check
      const hasAccess = user?.role === 'SuperAdmin' || user?.role === 'Admin';
      const fallbackPerms = {
        canRead: hasAccess,
        canCreate: hasAccess,
        canUpdate: hasAccess
      };
      
      console.log('🔄 Falling back to role-based permissions:', fallbackPerms);
      
      if (!hasAccess) {
        setPermissionDenied(true);
      }
      setPermissions(fallbackPerms);
      return fallbackPerms;
    }
  };
  
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      setPermissionDenied(false);
      
      console.log('🚀 Starting loadData for user:', user?.role, 'filter:', filter);
      
      // Check permissions first
      const userPermissions = await checkPermissions();
      console.log('🔐 Permission check result:', userPermissions);
      
      if (!userPermissions.canRead) {
        console.log('❌ No read permission - stopping data load');
        setLoading(false);
        return;
      }

      console.log('📊 Loading submissions data...');
      
      let response;
      
      // Use different API endpoints based on the filter
      if (filter === 'my') {
        console.log('📊 Loading MY submissions via API...');
        // Use the dedicated "my submissions" endpoint
        response = await fetchMySubmissions(0, 1000); // Get enough data for pagination
      } else {
        console.log('📊 Loading ALL submissions via API...');
        // Fetch all submissions from API (we'll handle pagination client-side)
        response = await fetchSubmissions(1, 1000); // Get enough data
      }
      
      console.log('📊 Submissions loaded:', response.data.length, 'items');
      
      // Sort submissions by numeric ID in ascending order
      const sortedSubmissions = response.data.sort((a, b) => {
        const aNum = getSubmissionIdNumber(a);
        const bNum = getSubmissionIdNumber(b);
        return aNum - bNum;
      });
      
      setSubmissions(sortedSubmissions);
      setError(null);
    } catch (err: any) {
      console.error('❌ Error loading submissions:', err);
      
      // Check if it's a 403 permission error
      if (err.response && err.response.status === 403) {
        console.log('❌ 403 error during data load - showing permission denied');
        setPermissionDenied(true);
        setError(null);
      } else if (err.response && err.response.status === 401) {
        console.log('❌ 401 error during data load - authentication required');
        setError('Authentication required. Please log in again.');
        setPermissionDenied(false);
      } else {
        console.log('❌ Other error during data load:', err.message);
        setError(err.message || 'Failed to load submissions. Please try again later.');
        setPermissionDenied(false);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filter, user]);

  useEffect(() => {
    const loadCandidates = async () => {
      if (!showCandidateSelection) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await fetchCandidates();
        setCandidates(response.data);
      } catch (err) {
        setError('Failed to load candidates. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadCandidates();
  }, [showCandidateSelection]);
  
  let filteredSubmissions = [...submissions];
  
  // Update title and subtitle based on filter
  if (filter === 'my') {
    title = 'My Submissions';
    subtitle = 'Submissions created by you';
    // No additional filtering needed since API already returns user's submissions
  } else if (filter === 'recent') {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    filteredSubmissions = submissions.filter(
      submission => new Date(submission.submittedDate) >= oneWeekAgo
    );
    title = 'Recent Submissions';
    subtitle = 'Submissions from the last 7 days';
  }

  // Apply date range filter
  if (dateRange.start && dateRange.end) {
    filteredSubmissions = filteredSubmissions.filter(submission => {
      const submissionDate = new Date(submission.submittedDate);
      return submissionDate >= dateRange.start && submissionDate <= dateRange.end;
    });
  }
  
  // Apply search filter
  if (searchTerm) {
    filteredSubmissions = filteredSubmissions.filter(
      submission => 
        `${submission.firstName} ${submission.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.client.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Ensure filtered submissions are also sorted by ID
  filteredSubmissions.sort((a, b) => {
    const aNum = getSubmissionIdNumber(a);
    const bNum = getSubmissionIdNumber(b);
    return aNum - bNum;
  });

  // Client-side pagination - exactly 15 items per page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSubmissions = filteredSubmissions.slice(startIndex, endIndex);
  const totalFilteredPages = Math.ceil(filteredSubmissions.length / itemsPerPage);

  const handleCandidateSelect = (candidate: Candidate) => {
    setShowCandidateSelection(false);
    navigate(`/candidates/details/${candidate.id}`);
  };

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
  }, [searchTerm, dateRange, filter]);

  // Show permission denied message if user doesn't have access
  if (permissionDenied) {
    return (
      <div className="space-y-6">
        <PageHeader
          title={title}
          subtitle={subtitle}
        />

        <div className="p-6 border border-red-200 rounded-md bg-red-50 dark:bg-red-900/50 dark:border-red-800">
          <div className="flex items-center">
            <Lock className="w-8 h-8 text-red-400" />
            <div className="ml-4">
              <h3 className="text-lg font-medium text-red-800 dark:text-red-200">Access Denied</h3>
              <p className="mt-2 text-sm text-red-700 dark:text-red-300">
                You do not have the required permissions to view Submissions.
              </p>
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                Please contact your administrator to request access to the Submissions module.
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
            {permissions.canCreate && (
              <Button
                onClick={() => setShowCandidateSelection(true)}
                className="flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" />
                Create Submission
              </Button>
            )}
          </div>
        }
      />
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search submissions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:focus:border-[#29D3C0] dark:focus:ring-[#29D3C0]"
        />
      </div>

      {error && (
        <div className="p-4 mb-6 text-red-800 rounded-md bg-red-50 dark:bg-red-900/50 dark:text-red-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
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
         <Loader className="h-8 w-8 animate-spin text-blue-600 dark:text-[#29D3C0]" />
        </div>
      ) : (
        <>
          <SubmissionsTable 
            submissions={paginatedSubmissions}
            onSubmissionUpdated={loadData}
            canUpdate={permissions.canUpdate}
            canRead={permissions.canRead}
          />
          
          {/* Pagination - Only show if there are results */}
          {filteredSubmissions.length > 0 && (
           <div className="flex items-center justify-between px-4 py-3 mt-6 bg-white border-t border-gray-200 dark:border-gray-700 dark:bg-gray-800 sm:px-6">
  <div className="flex justify-between flex-1 space-x-4 sm:hidden">
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
                      {Math.min(endIndex, filteredSubmissions.length)}
                    </span>{' '}
                    of <span className="font-medium">{filteredSubmissions.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="inline-flex -space-x-px rounded-md shadow-sm isolate" aria-label="Pagination">
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

      {permissions.canCreate && (
        <CandidateSelectionModal
          isOpen={showCandidateSelection}
          onClose={() => setShowCandidateSelection(false)}
          onSelect={handleCandidateSelect}
          candidates={candidates}
          loading={loading}
          error={error}
        />
      )}
    </div>
  );
};

export default SubmissionsPage;
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Search, Loader, Lock, AlertCircle, Bot } from 'lucide-react';
import { fetchCandidates, fetchMyCandidates } from '../../services/candidatesService';
import { useAuth } from '../../contexts/AuthContext';
import CandidatesTable from './CandidatesTable';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/ui/Button';
import DateRangeFilter from '../../components/ui/DateRangeFilter';
import WorkflowSelectionModal from '../../components/modals/WorkflowSelectionModal';
import WorkflowExecutionModal from '../../components/modals/WorkflowExecutionModal';
import { Workflow } from '../../types/automation';

const CandidatesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { filter } = useParams<{ filter?: string }>();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Workflow-related state
  const [selectedCandidates, setSelectedCandidates] = useState<any[]>([]);
  const [showWorkflowSelection, setShowWorkflowSelection] = useState(false);
  const [showWorkflowExecution, setShowWorkflowExecution] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  
  // Pagination settings - exactly 15 per page
  const itemsPerPage = 15;
  
  let title = 'All Candidates';
  let subtitle = 'Manage your candidate pipeline';
  
  if (filter === 'active') {
    title = 'Active Candidates';
    subtitle = 'Currently active candidates';
  } else if (filter === 'inactive') {
    title = 'Inactive Candidates';
    subtitle = 'Currently inactive candidates';
  } else if (filter === 'my') {
    title = 'My Candidates';
    subtitle = 'Candidates assigned to you';
  }

  // Helper function to extract numeric part from candidate ID for proper sorting
  const getCandidateIdNumber = (candidate: any): number => {
    // Extract numeric part from ID (e.g., "OOC-15330" -> 15330, "123" -> 123)
    const match = candidate.id.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };

  const loadCandidates = async () => {
  try {
    setLoading(true);
    setError(null);
    setPermissionDenied(false);

    let response;

    if (filter === 'my') {
      // ✅ Use the dedicated service for user's candidates
      response = await fetchMyCandidates(1, 1000);
    } else {
      // ✅ For other filters: fetch all candidates
      response = await fetchCandidates(1, 1000);
    }

    // ✅ Sort numerically by candidate ID
    const sortedCandidates = response.data.sort((a, b) => {
      const aNum = getCandidateIdNumber(a);
      const bNum = getCandidateIdNumber(b);
      return aNum - bNum;
    });

    setCandidates(sortedCandidates);
    setError(null);
  } catch (err: any) {
    console.error('Error loading candidates:', err.response || err.message || err);

    if (err.response && err.response.status === 403) {
      setPermissionDenied(true);
      setError(null);
    } else {
      setError('Failed to load candidates. Please try again later.');
      setPermissionDenied(false);
    }
  } finally {
    setLoading(false);
  }
};
  
  useEffect(() => {
    loadCandidates();
  }, [filter]);
  
  let filteredCandidates = [...candidates];
  
  if (filter === 'active') {
    filteredCandidates = candidates.filter(candidate => candidate.status === 'Active');
  } else if (filter === 'inactive') {
    filteredCandidates = candidates.filter(candidate => candidate.status === 'Inactive');
  }

  // Apply date range filter
  if (dateRange.start && dateRange.end) {
    filteredCandidates = filteredCandidates.filter(candidate => {
      const candidateDate = new Date(candidate.createdAt);
      return candidateDate >= dateRange.start && candidateDate <= dateRange.end;
    });
  }
  
  if (searchTerm) {
    const searchLower = searchTerm.toLowerCase();
    filteredCandidates = filteredCandidates.filter(candidate => {
      // Search by name
      const fullName = `${candidate.firstName} ${candidate.middleName || ''} ${candidate.lastName}`.toLowerCase();
      if (fullName.includes(searchLower)) return true;

      // Search by phone
      if (candidate.phone.replace(/\D/g, '').includes(searchTerm.replace(/\D/g, ''))) return true;

      // Search by location
      const location = `${candidate.city} ${candidate.state} ${candidate.country}`.toLowerCase();
      if (location.includes(searchLower)) return true;

      // Search by job title
      if (candidate.jobTitle.toLowerCase().includes(searchLower)) return true;

      // Search by skills
      if (candidate.skills?.some((skill: string) => skill.toLowerCase().includes(searchLower))) return true;

      return false;
    });
  }

  // Ensure filtered candidates are also sorted by ID
  filteredCandidates.sort((a, b) => {
    const aNum = getCandidateIdNumber(a);
    const bNum = getCandidateIdNumber(b);
    return aNum - bNum;
  });

  // Client-side pagination - exactly 15 items per page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCandidates = filteredCandidates.slice(startIndex, endIndex);
  const totalFilteredPages = Math.ceil(filteredCandidates.length / itemsPerPage);

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

  // Workflow handlers
  const handleCandidateSelection = (candidate: any, isSelected: boolean) => {
    if (isSelected) {
      setSelectedCandidates(prev => [...prev, candidate]);
    } else {
      setSelectedCandidates(prev => prev.filter(c => c.id !== candidate.id));
    }
  };

  const handleSelectAllCandidates = () => {
    if (selectedCandidates.length === paginatedCandidates.length) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates([...paginatedCandidates]);
    }
  };

  const handleWorkflowSelect = (workflow: Workflow) => {
    setSelectedWorkflow(workflow);
    setShowWorkflowSelection(false);
    setShowWorkflowExecution(true);
  };

  const handleRunWorkflow = () => {
    if (selectedCandidates.length === 0) {
      alert('Please select at least one candidate to run the workflow on.');
      return;
    }
    setShowWorkflowSelection(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Show permission denied message
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
                You do not have the required permissions to view Candidates.
              </p>
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                Please contact your administrator to request access to the Candidates module.
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
              onClick={() => navigate('/candidates/new')}
              className="flex items-center"
            >
              <Plus className="mr-1 h-4 w-4" />
              Add Candidate
            </Button>
          </div>
        }
      />
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, phone, location, skills, or job title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Search across multiple fields: candidate name, phone number, location (city/state), skills, and job title
        </p>
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
      
      <>
        <CandidatesTable 
          candidates={paginatedCandidates}
        />
        
        {/* Pagination - Only show if there are results */}
        {filteredCandidates.length > 0 && (
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
                    {Math.min(endIndex, filteredCandidates.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredCandidates.length}</span> results
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

      {/* Workflow Selection Modal */}
      <WorkflowSelectionModal
        isOpen={showWorkflowSelection}
        onClose={() => setShowWorkflowSelection(false)}
        onSelect={handleWorkflowSelect}
        selectedCandidates={selectedCandidates}
      />

      {/* Workflow Execution Modal */}
      {selectedWorkflow && (
        <WorkflowExecutionModal
          isOpen={showWorkflowExecution}
          onClose={() => {
            setShowWorkflowExecution(false);
            setSelectedWorkflow(null);
            setSelectedCandidates([]);
          }}
          workflow={selectedWorkflow}
          candidates={selectedCandidates}
        />
      )}
    </div>
  );
};

export default CandidatesPage;
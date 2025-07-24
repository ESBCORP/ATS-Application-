import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BarChart3, TrendingUp, Users, Briefcase, GitPullRequestArrow, ClipboardList, Loader } from 'lucide-react';
import { fetchJobs } from '../../services/jobsService';
import { fetchCandidates } from '../../services/candidatesService';
import PageHeader from '../../components/layout/PageHeader';
import DateRangeFilter from '../../components/ui/DateRangeFilter';

const ReportsPage: React.FC = () => {
  const { type } = useParams<{ type?: string }>();
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalCandidates: 0,
    activeCandidates: 0,
    submissions: 0,
    pipeline: {
      screening: 0,
      submitted: 0,
      interview: 0,
      offer: 0,
      hired: 0
    }
  });

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        setLoading(true);
        
        // Fetch jobs
        const jobsResponse = await fetchJobs(1, 1000);
        const activeJobs = jobsResponse.data.filter(job => job.status === 'Active').length;
        
        // Fetch candidates
        const candidatesResponse = await fetchCandidates(1, 1000);
        const activeCandidates = candidatesResponse.data.filter(c => c.status === 'Active').length;
        
        setMetrics({
          totalJobs: jobsResponse.total,
          activeJobs,
          totalCandidates: candidatesResponse.total,
          activeCandidates,
          submissions: 0,
          pipeline: {
            screening: 0,
            submitted: 0,
            interview: 0,
            offer: 0,
            hired: 0
          }
        });
      } catch (error) {
        console.error('Failed to load metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, [dateRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 min-h-screen">
      <PageHeader
        title="Reports & Analytics"
        subtitle="Detailed insights into your recruitment pipeline"
        actions={
          <DateRangeFilter onFilterChange={setDateRange} />
        }
      />

      {/* Key Performance Indicators */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-md dark:shadow-lg">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3">
              <Briefcase className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Jobs</p>
              <div className="mt-1">
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{metrics.activeJobs}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">out of {metrics.totalJobs} total jobs</p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-800">
              <div 
                className="h-2 rounded-full bg-blue-600" 
                style={{ width: `${(metrics.activeJobs / metrics.totalJobs) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-md dark:shadow-lg">
          <div className="flex items-center">
            <div className="rounded-full bg-teal-100 p-3">
              <Users className="h-6 w-6 text-teal-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Candidates</p>
              <div className="mt-1">
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{metrics.activeCandidates}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">out of {metrics.totalCandidates} total candidates</p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-800">
              <div 
                className="h-2 rounded-full bg-teal-600" 
                style={{ width: `${(metrics.activeCandidates / metrics.totalCandidates) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-md dark:shadow-lg">
          <div className="flex items-center">
            <div className="rounded-full bg-purple-100 p-3">
              <ClipboardList className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Submissions</p>
              <div className="mt-1">
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{metrics.submissions}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">total submissions</p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Average per day</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {(metrics.submissions / 30).toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Distribution */}
      <div className="mb-8 rounded-lg bg-white dark:bg-gray-800 p-6 shadow-md dark:shadow-lg">
        <h3 className="mb-6 text-lg font-semibold text-white">Pipeline Distribution</h3>
        <div className="grid grid-cols-5 gap-4">
          {Object.entries(metrics.pipeline).map(([stage, count]) => (
            <div key={stage} className="rounded-lg border border-gray-700 dark:border-gray-600 p-4 text-center bg-gray-800">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stage.charAt(0).toUpperCase() + stage.slice(1)}
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
                {count}
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {metrics.submissions > 0 ? ((count / metrics.submissions) * 100).toFixed(1) : '0'}%
              </p>
            </div>
          ))}

        </div>
      </div>

      {/* Time-based Metrics */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-md dark:shadow-lg">
          <h3 className="mb-4 text-lg font-semibold text-white">Time to Fill</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Average Time to Fill</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">-</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Fastest Fill Time</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">-</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Longest Fill Time</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">-</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-md dark:shadow-lg">
          <h3 className="mb-4 text-lg font-semibold text-white">Interview Metrics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Average Time to Interview</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">-</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Interview Success Rate</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">-</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Average Interviews per Hire</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">-</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, GitPullRequestArrow, ClipboardList, BarChart3, TrendingUp, BarChart as ChartBar, LineChart, Loader } from 'lucide-react';
import { fetchJobs } from '../services/jobsService';
import { fetchCandidates } from '../services/candidatesService';
import { fetchSubmissions } from '../services/submissionsService';
import { useAuth } from '../contexts/AuthContext';
import PageHeader from '../components/layout/PageHeader';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  linkTo: string;
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, linkTo, loading }) => (
  <Link
    to={linkTo}
    className="block overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-6 shadow-md transition-all hover:shadow-lg border border-gray-200 dark:border-gray-700"
  >
    <div className="flex items-center">
      <div className={`rounded-md p-3 ${color}`}>{icon}</div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        {loading ? (
          <Loader className="h-5 w-5 animate-spin text-gray-400" />
        ) : (
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
        )}
      </div>
    </div>
  </Link>
);

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalCandidates: 0,
    activeCandidates: 0,
    submissions: 0,
    submittedCount: 0,
    pipeline: 0
  });
  
  useEffect(() => {
    const loadMetrics = async () => {
      try {
        setLoading(true);
        
        // Fetch jobs, candidates, and submissions concurrently
        const [jobsResponse, candidatesResponse, submissionsResponse] = await Promise.all([
          fetchJobs(1, 1000),
          fetchCandidates(1, 1000),
          fetchSubmissions(1, 1000)
        ]);

        const activeJobs = jobsResponse.data.filter(job => job.status === 'Active').length;
        const activeCandidates = candidatesResponse.data.filter(c => c.status === 'Active').length;
        const submittedCount = submissionsResponse.data.filter(s => s.status === 'Submitted').length;
        
        setMetrics({
          totalJobs: jobsResponse.total,
          activeJobs,
          totalCandidates: candidatesResponse.total,
          activeCandidates,
          submissions: submissionsResponse.total,
          submittedCount,
          pipeline: 0
        });
      } catch (error) {
        console.error('Failed to load metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, []);

  return (
    <div>
      <PageHeader
        title={`Welcome, ${user?.full_name || 'User'}!`}
        subtitle="Here's what's happening with your recruitment pipeline."
      />
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Jobs"
          value={metrics.activeJobs}
          icon={<Briefcase className="h-6 w-6 text-white" />}
          color="bg-blue-800 text-white"
          linkTo="/jobs/active"
          loading={loading}
        />
        <StatCard
          title="Active Candidates"
          value={metrics.activeCandidates}
          icon={<Users className="h-6 w-6 text-white" />}
          color="bg-teal-600 text-white"
          linkTo="/candidates/active"
          loading={loading}
        />
        <StatCard
          title="Total Submissions"
          value={metrics.submittedCount}
          icon={<ClipboardList className="h-6 w-6 text-white" />}
          color="bg-purple-600 text-white"
          linkTo="/submissions"
          loading={loading}
        />
        <StatCard
          title="Active Pipeline"
          value={metrics.pipeline}
          icon={<GitPullRequestArrow className="h-6 w-6 text-white" />}
          color="bg-orange-500 text-white"
          linkTo="/pipeline"
          loading={loading}
        />
      </div>

      {/* Reports Section */}
      <div className="mt-12">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Reports & Analytics</h2>
        
        {/* Recruitment Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Job Fill Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {loading ? (
                    <Loader className="h-5 w-5 animate-spin text-gray-400" />
                  ) : (
                    `${((metrics.activeJobs / metrics.totalJobs) * 100).toFixed(1)}%`
                  )}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Active vs Total Jobs</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Candidate Activity</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {loading ? (
                    <Loader className="h-5 w-5 animate-spin text-gray-400" />
                  ) : (
                    `${((metrics.activeCandidates / metrics.totalCandidates) * 100).toFixed(1)}%`
                  )}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Active vs Total Candidates</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Submission Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {loading ? (
                    <Loader className="h-5 w-5 animate-spin text-gray-400" />
                  ) : (
                    `${((metrics.submittedCount / metrics.totalCandidates) * 100).toFixed(1)}%`
                  )}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Submissions per Candidate</p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
                <ChartBar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pipeline Health</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {loading ? (
                    <Loader className="h-5 w-5 animate-spin text-gray-400" />
                  ) : (
                    `${((metrics.pipeline / metrics.submittedCount) * 100).toFixed(1)}%`
                  )}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Conversion Rate</p>
              </div>
              <div className="bg-orange-100 dark:bg-orange-900 p-3 rounded-full">
                <LineChart className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Jobs */}
          <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-md border border-gray-200 dark:border-gray-700">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Recent Jobs</h2>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <div className="space-y-4">
                {metrics.activeJobs === 0 ? (
                  <p className="text-center text-gray-500 dark:text-gray-400">No active jobs found</p>
                ) : (
                  <div className="text-right">
                    <Link to="/jobs" className="text-sm font-medium text-blue-800 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                      View all jobs →
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Recent Candidates */}
          <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-md border border-gray-200 dark:border-gray-700">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Recent Candidates</h2>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <div className="space-y-4">
                {metrics.activeCandidates === 0 ? (
                  <p className="text-center text-gray-500 dark:text-gray-400">No active candidates found</p>
                ) : (
                  <div className="text-right">
                    <Link to="/candidates" className="text-sm font-medium text-blue-800 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                      View all candidates →
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
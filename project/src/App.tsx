import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ResetPassword from './pages/auth/ResetPassword';
import Dashboard from './pages/Dashboard';
import JobsPage from './pages/jobs/JobsPage';
import JobDetailsPage from './pages/jobs/JobDetailsPage';
import CandidatesPage from './pages/candidates/CandidatesPage';
import CandidateDetailsPage from './pages/candidates/CandidateDetailsPage';
import SubmissionsPage from './pages/submissions/SubmissionsPage';
import PipelinePage from './pages/pipeline/PipelinePage';
import ReportsPage from './pages/reports/ReportsPage';
import UsersPage from './pages/access/UsersPage';
import AccessControlPage from './pages/access/AccessControlPage';
import CustomFields from './pages/settings/CustomFields';
import RoleSecurityPage from './pages/access/RoleSecurityPage';
import VideoPage from './pages/video/VideoPage';
import VideoInterviewPage from './pages/video/VideoInterviewPage';
import ProfilePage from './pages/profile/ProfilePage';
import AutomationPage from './pages/automation/AutomationPage';
import CompanyProfilePage from './pages/settings/CompanyProfilePage';
import MessagesPage from './pages/settings/MessagesPage';
import MessageTemplateWorkflow from './pages/automation/MessageTemplateWorkflow';
import VideoInterviewSettings from './pages/settings/VideoInterviewSettings';
import SubmissionDetailsPage from './pages/submissions/SubmissionDetailsPage';
import VideoPreview from './pages/settings/VideoPreview';
import RolesPage from './pages/access/RolesPage';
import GoogleCallback from './pages/auth/GoogleCallback';

import LandingLayout from './components/Landingpage/LandingLayout';
import LandingPage from './components/Landingpage/LandingPage';

import RecruitmentCRMPage from './components/Landingpage/platform/RecruitmentCRMPage';
import ApplicantTrackingPage from './components/Landingpage/platform/ApplicantTrackingPage';
import VideoInterviewingPage from './components/Landingpage/platform/VideoInterviewingPage';

import ForStaffingPage from './components/Landingpage/solutions/ForStaffingPage';
import ForRecruitingPage from './components/Landingpage/solutions/ForRecruitingPage';
import HRPage from './components/Landingpage/solutions/HRpage';

import BlogPage from './components/Landingpage/Resources/Blog';
import CaseStudiespage from './components/Landingpage/Resources/CaseStudies';
import WebinarsPage from './components/Landingpage/Resources/Webinars';

import OurStory from './components/Landingpage/AboutUs/OurStory';
import ContactUsPage from './components/Landingpage/AboutUs/ContactUs';
import Careers from './components/Landingpage/AboutUs/Careers';

import WorkFlowAutomation from './components/Landingpage/platform/WorkFlowAutomation';
import Analytics from './components/Landingpage/platform/Analytics';
import ForSmallBusiness from './components/Landingpage/solutions/ForSmallBusiness';
import Enterprise from './components/Landingpage/solutions/Enterprise';
import PrivacyPolicy from './components/Landingpage/AboutUs/PrivacyPolicy';
import TermsofService from './components/Landingpage/AboutUs/TermsofService';
import SupportPage from './components/Landingpage/SupportPage';







function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route element={<LandingLayout/>}>
              <Route path="/" element={<LandingPage/>}/>
                {/* Platform */}
              <Route path="/platform/recruitment-crm" element={<RecruitmentCRMPage/>}/>
              <Route path="/platform/applicant-tracking" element={<ApplicantTrackingPage/>}/>
            <Route path="/platform/video-interview" element={<VideoInterviewingPage/>}/>
              {/* Solutions */}
              <Route path="/solutions/for-staffing" element={<ForStaffingPage/>} />
            <Route path="/solutions/for-recruiting" element={<ForRecruitingPage/>}/>
            <Route path="/solutions/for-hr" element={<HRPage/>}/>
              {/* Resources */}

              <Route path="/resources/blog" element={<BlogPage/>}/>
           <Route path="/resources/case-studies" element={<CaseStudiespage/>}/>
           <Route path="/resources/webinar" element={<WebinarsPage/>}/>

               {/* AboutUs */}
               <Route path="/about/our-story" element={<OurStory/>}/>
           <Route path="/about/careers" element={<Careers/>}/>
           <Route path="/about/contact-us" element={<ContactUsPage/>}/>
               {/* Footer */}
           <Route path="/workflow-automation" element={<WorkFlowAutomation/>}/>
           <Route path="/analytics" element={<Analytics/>}/>
           <Route path="/forsmall-business" element={<ForSmallBusiness/>}/>
           <Route path="/enterprise" element={<Enterprise/>}/>
           <Route path="/privacypolicy" element={<PrivacyPolicy/>}/>
           <Route path="termsofservice" element={<TermsofService/>}/>
           <Route path="/support" element={<SupportPage/>}/>
              

              
            </Route>
            
            
           
           
            {/* Public routes - no Layout wrapper */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/auth/google/callback" element={<GoogleCallback />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/video/interview/:id" element={<VideoInterviewPage />} />
            
            {/* Protected routes - wrapped with Layout */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/jobs"
              element={
                <ProtectedRoute>
                  <Layout>
                    <JobsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/jobs/details/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <JobDetailsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/jobs/new"
              element={
                <ProtectedRoute>
                  <Layout>
                    <JobDetailsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/jobs/:status"
              element={
                <ProtectedRoute>
                  <Layout>
                    <JobsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/candidates"
              element={
                <ProtectedRoute>
                  <Layout>
                    <CandidatesPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/candidates/details/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <CandidateDetailsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/candidates/new"
              element={
                <ProtectedRoute>
                  <Layout>
                    <CandidateDetailsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/candidates/:filter"
              element={
                <ProtectedRoute>
                  <Layout>
                    <CandidatesPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/submissions"
              element={
                <ProtectedRoute>
                  <Layout>
                    <SubmissionsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/submission/details/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <SubmissionDetailsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/submissions/:filter"
              element={
                <ProtectedRoute>
                  <Layout>
                    <SubmissionsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
             <Route
  path="/roles"
  element={
    <ProtectedRoute>
      <Layout>
        <RolesPage />
      </Layout>
    </ProtectedRoute>
  }
/>
<Route
  path="/role-security"
  element={
    <ProtectedRoute>
      <Layout>
        <RoleSecurityPage />
      </Layout>
    </ProtectedRoute>
  }
/>

            <Route
              path="/video"
              element={
                <ProtectedRoute>
                  <Layout>
                    <VideoPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/video/:section"
              element={
                <ProtectedRoute>
                  <Layout>
                    <VideoPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/pipeline"
              element={
                <ProtectedRoute>
                  <Layout>
                    <PipelinePage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/pipeline/:status"
              element={
                <ProtectedRoute>
                  <Layout>
                    <PipelinePage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/automation"
              element={
                <ProtectedRoute>
                  <Layout>
                    <AutomationPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/automation/:section"
              element={
                <ProtectedRoute>
                  <Layout>
                    <AutomationPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/automation/message-template-workflow"
              element={
                <ProtectedRoute>
                  <Layout>
                    <MessageTemplateWorkflow />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ReportsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/reports/:type"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ReportsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/access"
              element={<Navigate to="/access/users" replace />}
            />

            <Route
              path="/access/users"
              element={
                <ProtectedRoute>
                  <Layout>
                    <UsersPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/access/users/:status"
              element={
                <ProtectedRoute>
                  <Layout>
                    <UsersPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/access/control"
              element={
                <ProtectedRoute>
                  <Layout>
                    <AccessControlPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/access/security/role"
              element={
                <ProtectedRoute>
                  <Layout>
                    <RoleSecurityPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ProfilePage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings/company"
              element={
                <ProtectedRoute>
                  <Layout>
                    <CompanyProfilePage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings/custom-fields"
              element={
                <ProtectedRoute>
                  <Layout>
                    <CustomFields />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/settings/messages"
              element={
                <ProtectedRoute>
                  <Layout>
                    <MessagesPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/settings/video"
              element={
                <ProtectedRoute>
                  <Layout>
                    <VideoInterviewSettings />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/video/preview/:id"
              element={
                <ProtectedRoute>
                  <VideoPreview />
                </ProtectedRoute>
              }
            />
            
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
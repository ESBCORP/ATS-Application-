import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, Users, Video, Shield, Workflow } from 'lucide-react';

const LandingNavbar: React.FC = () => {
  const navigate = useNavigate();

  // const handleLogoClick = () => {
  //   navigate('/');
  //  // window.location.href='/'; // full refresh to landing page
  // };

  return (
    <header className="bg-white shadow-md py-4 sticky top-0 z-50">
            <div className="container mx-auto px-6 flex justify-between items-center">
              {/* <div className="flex items-center">
                <div className="h-12 w-12 flex items-center justify-center bg-gradient-to-r from-blue-900 to-blue-800 rounded-lg mr-2 shadow-lg">
                  <Workflow className="h-7 w-7 text-white transform -rotate-12" />
                </div>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-blue-700">
                  Virtuoso<span className="text-teal-500 font-extrabold">U</span>
                </span>
              </div> */}
              <div
  className="flex items-center cursor-pointer gap-2 select-none"
  onClick={() =>navigate('/')}//window.location.href = '/'}
>
  <div className="h-12 w-12 flex items-center justify-center bg-gradient-to-r from-blue-900 to-blue-800 rounded-lg shadow-lg">
    <Workflow className="h-7 w-7 text-white transform -rotate-12" />
  </div>
  <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-blue-700">
    Virtuoso<span className="text-teal-500 font-extrabold">U</span>
  </span>
</div>
              
              <nav className="hidden md:flex space-x-6">
                <div className="relative group">
                  <button
                  type="button" 
                  className="text-gray-700 hover:text-blue-800 font-medium flex items-center transition-colors duration-200">
                    Platform
                    <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 border border-gray-100">
                    <div className="py-1">
                      <Link to="/platform/recruitment-crm" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-800 transition-colors duration-150">
                        <div className="flex items-center">
                          <Briefcase className="h-4 w-4 mr-2 text-blue-600" />
                          <span>Recruitment CRM</span>
                        </div>
                      </Link>
                      <Link to="/platform/applicant-tracking" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-800 transition-colors duration-150">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-blue-600" />
                          <span>Applicant Tracking</span>
                        </div>
                      </Link>
                      <Link to="/platform/video-interview" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-800 transition-colors duration-150">
                        <div className="flex items-center">
                          <Video className="h-4 w-4 mr-2 text-blue-600" />
                          <span>Video Interviewing</span>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
                
                <div className="relative group">
                  <button
                  type="button"
                   className="text-gray-700 hover:text-blue-800 font-medium flex items-center transition-colors duration-200">
                    Solutions
                    <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 border border-gray-100">
                    <div className="py-1">
                      <Link to="/solutions/for-staffing" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-800 transition-colors duration-150">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-blue-600" />
                          <span>For Staffing</span>
                        </div>
                      </Link>
                      <Link to="/solutions/for-recruiting" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-800 transition-colors duration-150">
                        <div className="flex items-center">
                          <Briefcase className="h-4 w-4 mr-2 text-blue-600" />
                          <span>For Recruiting</span>
                        </div>
                      </Link>
                      <Link to="/solutions/for-hr" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-800 transition-colors duration-150">
                        <div className="flex items-center">
                          <Shield className="h-4 w-4 mr-2 text-blue-600" />
                          <span>For HR</span>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
                
                <div className="relative group">
                  <button
                  type="button" className="text-gray-700 hover:text-blue-800 font-medium flex items-center transition-colors duration-200">
                    Resources
                    <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 border border-gray-100">
                    <div className="py-1">
                      <Link to="/resources/blog" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-800 transition-colors duration-150">
                        <div className="flex items-center">
                          <svg className="h-4 w-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                          </svg>
                          <span>Blog</span>
                        </div>
                      </Link>
                      <Link to="/resources/case-studies" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-800 transition-colors duration-150">
                        <div className="flex items-center">
                          <svg className="h-4 w-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          <span>Case Studies</span>
                        </div>
                      </Link>
                      <Link to="/resources/webinar" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-800 transition-colors duration-150">
                        <div className="flex items-center">
                          <svg className="h-4 w-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          <span>Webinars</span>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
                
                
                <div className="relative group">
                  <button
                  type="button"
                  className="text-gray-700 hover:text-blue-800 font-medium flex items-center transition-colors duration-200">
                    About
                    <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 border border-gray-100">
                    <div className="py-1">
                      <Link to="/about/our-story" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-800 transition-colors duration-150">
                        <div className="flex items-center">
                          <svg className="h-4 w-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          <span>Our Story</span>
                        </div>
                      </Link>
                      <Link to="/about/careers" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-800 transition-colors duration-150">
                        <div className="flex items-center">
                          <svg className="h-4 w-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span>Careers</span>
                        </div>
                      </Link>
                      <Link to="/about/contact-us" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-800 transition-colors duration-150">
                        <div className="flex items-center">
                          <svg className="h-4 w-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span>Contact Us</span>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
                <Link to="/support" className="text-gray-700 hover:text-blue-800 font-medium transition-colors duration-200">Support</Link>
              </nav>
              
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-blue-800 hover:text-blue-600 font-medium">
                  Login
                </Link>
                <Link to="/signup" className="bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white font-medium py-2.5 px-6 rounded-md transition-all shadow-md hover:shadow-lg">
                  Request Demo
                </Link>
              </div>
            </div>
          </header>
         
   
  );
};

export default LandingNavbar;

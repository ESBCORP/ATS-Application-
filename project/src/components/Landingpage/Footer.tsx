import React from 'react';
import { Workflow } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
            <div className="container mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center">
                    <div className="h-12 w-12 flex items-center justify-center bg-gradient-to-r from-blue-900 to-blue-800 rounded-lg mr-3 shadow-lg">
                      <Workflow className="h-7 w-7 text-white transform -rotate-12" />
                    </div>
                    <span className="text-2xl font-bold text-white tracking-tight">
                      Virtuoso<span className="text-teal-400 font-extrabold">U</span>
                    </span>
                  </div>
                  <p className="text-gray-400 leading-relaxed">
                    VirtuosoU is the leading AI-powered recruitment platform that helps staffing and recruiting professionals streamline their workflow and find the best talent faster.
                  </p>
                  <div className="flex space-x-4 pt-2">
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 transform hover:scale-110">
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                      </svg>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 transform hover:scale-110">
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 transform hover:scale-110">
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold mb-4 text-teal-400">Platform</h3>
                  <ul className="space-y-3">
                    <li><Link to="/platform/recruitment-crm" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center">
                      <svg className="h-3 w-3 mr-2 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      Recruitment CRM
                    </Link></li>
                    <li><Link to="/platform/applicant-tracking" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center">
                      <svg className="h-3 w-3 mr-2 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      Applicant Tracking
                    </Link></li>
                    <li><Link to="/platform/video-interview" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center">
                      <svg className="h-3 w-3 mr-2 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      Video Interviewing
                    </Link></li>
                    <li><Link to="/workflow-automation" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center">
                      <svg className="h-3 w-3 mr-2 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      Workflow Automation
                    </Link></li>
                    <li><Link to="/analytics" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center">
                      <svg className="h-3 w-3 mr-2 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      Analytics
                    </Link></li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold mb-4 text-teal-400">Solutions</h3>
                  <ul className="space-y-3">
                    <li><Link to="/solutions/for-staffing" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center">
                      <svg className="h-3 w-3 mr-2 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      For Staffing
                    </Link></li>
                    <li><Link to="/solutions/for-recruiting" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center">
                      <svg className="h-3 w-3 mr-2 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      For Recruiting
                    </Link></li>
                    <li><Link to="/solutions/for-hr" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center">
                      <svg className="h-3 w-3 mr-2 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      For HR
                    </Link></li>
                    <li><Link to="/forsmall-business" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center">
                      <svg className="h-3 w-3 mr-2 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      For Small Business
                    </Link></li>
                    <li><Link to="/enterprise" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center">
                      <svg className="h-3 w-3 mr-2 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      Enterprise
                    </Link></li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold mb-4 text-teal-400">Company</h3>
                  <ul className="space-y-3">
                    <li><Link to="/about/our-story" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center">
                      <svg className="h-3 w-3 mr-2 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      About Us
                    </Link></li>
                    <li><Link to="/about/careers" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center">
                      <svg className="h-3 w-3 mr-2 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      Careers
                    </Link></li>
                    <li><Link to="/about/contact-us" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center">
                      <svg className="h-3 w-3 mr-2 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      Contact
                    </Link></li>
                    <li><Link to="/privacypolicy" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center">
                      <svg className="h-3 w-3 mr-2 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      Privacy Policy
                    </Link></li>
                    <li><Link to="/termsofservice" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center">
                      <svg className="h-3 w-3 mr-2 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      Terms of Service
                    </Link></li>
                  </ul>
                </div>
              </div>
              
              <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <p className="text-gray-400 text-sm">
                  © {new Date().getFullYear()} VirtuosoU. All rights reserved.
                </p>
                <div className="flex space-x-6">
                  <Link to="/privacypolicy" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">Privacy Policy</Link>
                  <Link to="/termsofservice" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">Terms of Service</Link>
                  <Link to="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">Cookies</Link>
                </div>
              </div>
            </div>
          </footer>
   
  );
};

export default Footer;

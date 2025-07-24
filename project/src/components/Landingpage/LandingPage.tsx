import React from 'react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ContactUsPage from './AboutUs/ContactUs';
import ContinuousScrollTestimonials from './ContinuousScrollTestimonials';
import HeroSection from './HeroSection';
import AIInterviewSection from './AIInterviewSection';
import StatsSection from './StatsSection';
import FeaturesSection from './FeaturesSection';
import HowItWorksCardsSection from './HowItWorksCardsSection';

import { 
  Workflow, 
  Users, 
  GitPullRequestArrow, 
  Video, 
  Bot, 
  ArrowRight,
  BarChart3, 
  CheckCircle, 
  Briefcase, 
  Award, 
  Zap, 
  Clock, 
  Target, 
  TrendingUp, 
  Shield, 
  Star 
} from 'lucide-react';
import RecruiterStaffingSection from './RecruiterStaffingSection';





const LandingPage: React.FC = () => {
  const { logout, isAuthenticated } = useAuth();
  
  // Automatically log out when landing page is visited
  useEffect(() => {
    if (isAuthenticated) {
      console.log('User is authenticated on landing page - logging out');
      logout();
    }
  }, [isAuthenticated, logout]);

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden bg-gradient-to-b from-white to-gray-50">
{/* Hero Section */}
      <HeroSection/>
      
 {/* AI Interview Section */}
      <AIInterviewSection/>
      {/* Stats Section */}
      <StatsSection/>

      
      {/* Features Section */}

    <FeaturesSection/>

      
    <HowItWorksCardsSection/>


       <RecruiterStaffingSection/>
       <ContinuousScrollTestimonials/>
          
      <ContactUsPage/>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-900 to-blue-800 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-700 opacity-20 rounded-full -mt-48 -mr-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500 opacity-20 rounded-full -mb-48 -ml-48"></div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="inline-block px-4 py-1 bg-blue-800 bg-opacity-50 rounded-full text-sm font-semibold text-teal-300 mb-4 backdrop-blur-sm">
            Get Started Today
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Recruitment Process?</h2>
          <p className="text-xl mb-10 max-w-3xl mx-auto text-blue-100">
            Join thousands of companies that are using VirtuosoU to streamline their recruitment workflow and find the best talent faster.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 max-w-2xl mx-auto">
            <Link to="/signup" className="bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-400 hover:to-teal-300 text-white font-bold py-4 px-10 rounded-md text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex-1 flex items-center justify-center">
              <Star className="h-5 w-5 mr-2" />
              Request Demo
            </Link>
            <a href="#" className="bg-transparent hover:bg-white/10 border-2 border-white text-white font-bold py-4 px-10 rounded-md text-lg transition-all hover:shadow-lg flex-1 flex items-center justify-center">
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Contact Sales
            </a>
          </div>
          
          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap justify-center gap-6">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center">
              <Shield className="h-5 w-5 mr-2 text-teal-300" />
              <span className="text-sm font-medium">Enterprise-grade Security</span>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center">
              <Clock className="h-5 w-5 mr-2 text-teal-300" />
              <span className="text-sm font-medium">Quick Implementation</span>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center">
              <Users className="h-5 w-5 mr-2 text-teal-300" />
              <span className="text-sm font-medium">24/7 Support</span>
            </div>
          </div>
        </div> 
      </section>
      

      
      {/* Back to top button */}
      <a href="#" className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50">
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </a>
    </div>
  );
};

export default LandingPage;
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Award } from 'lucide-react';
import { motion, useInView } from 'framer-motion';

interface HeroSectionProps {
  isAuthenticated?: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ isAuthenticated }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });

  return (
    <section
      ref={ref}
      className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-12 md:py-16 overflow-hidden relative"
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-700 opacity-10 rounded-full -mt-24 -mr-24"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500 opacity-10 rounded-full -mb-20 -ml-20"></div>

      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center relative z-10">
        {/* Left Text */}
        <motion.div
          className="md:w-1/2 mb-10 md:mb-0 md:pr-8"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="inline-block px-3 py-1 bg-blue-800 bg-opacity-50 rounded-full text-sm font-semibold text-teal-300 mb-4 backdrop-blur-sm">
            Next-Gen Recruitment Technology
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Total Talent Automation Software
          </h1>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            AI Powered.
            <br className="hidden md:block" />
            <span className="relative">
              People Driven.
              <span className="absolute -bottom-2 left-0 w-20 h-1 bg-teal-400"></span>
            </span>
          </h2>
          <p className="text-xl mb-6 text-blue-100">
            VirtuosoU uses powerful AI to help staffing, recruiting, and talent professionals do their jobs better.
          </p>
          <p className="text-lg mb-8 text-blue-100 leading-relaxed">
            Our comprehensive AI-powered solutions—ATS, VMS, Workforce Management—let you focus on building relationships,
            understanding details, and making great placements while keeping people at the heart of every decision.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/signup"
              className="bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-400 hover:to-teal-300 text-white font-bold py-3.5 px-8 rounded-md text-lg transition-all inline-block shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Request Demo
            </Link>
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-bold py-3.5 px-8 rounded-md text-lg transition-all inline-block backdrop-blur-sm"
              >
                Go to Dashboard
              </Link>
            )}
          </div>
        </motion.div>

        {/* Right Video Block */}
        <motion.div
          className="md:w-1/2 relative"
          initial={{ opacity: 0, x: 40 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative p-2 overflow-hidden bg-white rounded-lg shadow-lg">
            <video
              src="/AI_motion.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-auto transition-all duration-700 ease-out transform scale-95 rounded-lg hover:scale-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900 to-transparent opacity-20"></div>
          </div>

          {/* Floating badges */}
          <div className="absolute top-5 right-5 bg-white py-2 px-4 rounded-full shadow-lg flex items-center z-20 animate-pulse">
            <Award className="h-5 w-5 text-yellow-500 mr-2" />
            <span className="text-gray-800 font-semibold text-sm">Top Rated</span>
          </div>
          <div className="absolute -bottom-3 -left-3 bg-blue-700 py-2 px-4 rounded-full shadow-lg z-20">
            <span className="text-white font-bold text-sm">AI-Powered</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
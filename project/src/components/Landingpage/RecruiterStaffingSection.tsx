import React, { useRef } from 'react';
import { Users, Briefcase, CheckCircle, Zap, Target, TrendingUp } from 'lucide-react';
import { motion, useInView } from 'framer-motion';

const RecruiterStaffingSection: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  return (
    <section
      ref={ref}
      className="py-16 bg-white relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full opacity-50 -mt-32 -mr-32"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-100 rounded-full opacity-50 -mb-48 -ml-48"></div>

      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 max-w-3xl mx-auto"
        >
          <div className="inline-block px-3 py-1 bg-teal-100 rounded-full text-sm font-semibold text-teal-800 mb-3">
            Industry-Leading Results
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Transforming the Recruitment Process
          </h2>
          <p className="text-xl text-gray-600">
            VirtuosoU helps recruiters and staffing professionals work smarter, not harder.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10"
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: 0.8 }}
        >
          {/* Recruiters */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-8 shadow-md border border-gray-100 transform transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">For Recruiters</h3>
            </div>
            <ul className="space-y-4">
              {[
                'Reduce time-to-fill by up to 40% with AI-powered candidate matching',
                'Automate repetitive tasks like screening and initial outreach',
                'Conduct AI video interviews that adapt to candidate responses',
                'Build stronger relationships with personalized communication workflows',
                'Access detailed analytics to optimize your recruitment strategy',
              ].map((item, index) => (
                <li key={index} className="flex items-start bg-white p-3 rounded-lg shadow-sm transform transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Staffing Agencies */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-8 shadow-md border border-gray-100 transform transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mr-4">
                <Briefcase className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">For Staffing Agencies</h3>
            </div>
            <ul className="space-y-4">
              {[
                'Scale your operations without increasing headcount',
                'Improve client satisfaction with faster, higher-quality placements',
                'Reduce cost-per-hire through workflow automation',
                'Gain competitive advantage with AI-powered insights',
                'Increase consultant productivity by eliminating manual tasks',
              ].map((item, index) => (
                <li key={index} className="flex items-start bg-white p-3 rounded-lg shadow-sm transform transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Key Benefits */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            {
              icon: <Zap className="h-8 w-8 text-blue-600" />,
              bg: 'bg-blue-100',
              title: 'Speed',
              text: 'Reduce time-to-hire by up to 40% with our AI-powered matching algorithms',
            },
            {
              icon: <Target className="h-8 w-8 text-teal-600" />,
              bg: 'bg-teal-100',
              title: 'Precision',
              text: 'Find better matches with advanced candidate-job fit scoring and analysis',
            },
            {
              icon: <TrendingUp className="h-8 w-8 text-purple-600" />,
              bg: 'bg-purple-100',
              title: 'Growth',
              text: 'Scale your recruitment operations efficiently with our automation tools',
            },
          ].map((item, index) => (
            <div key={index} className="text-center p-6">
              <div className={`w-16 h-16 mx-auto ${item.bg} rounded-full flex items-center justify-center mb-4`}>
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.text}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default RecruiterStaffingSection;
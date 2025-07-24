import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Users,
  GitPullRequestArrow,
  Video,
  Bot,
  BarChart3,
  Workflow,
} from 'lucide-react';

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
}

const featureItems: FeatureItem[] = [
  {
    icon: <Users className="h-5 w-5" />,
    title: 'Candidate Management',
    desc: 'Streamline your candidate pipeline with powerful search, filtering, and organization tools.',
    color: 'blue',
  },
  {
    icon: <GitPullRequestArrow className="h-5 w-5" />,
    title: 'Workflow Automation',
    desc: 'Automate repetitive tasks and create custom workflows to increase efficiency and reduce errors.',
    color: 'teal',
  },
  {
    icon: <Video className="h-5 w-5" />,
    title: 'AI Video Interviews',
    desc: 'Conduct AI-powered video interviews to screen candidates efficiently and effectively.',
    color: 'purple',
  },
  {
    icon: <Bot className="h-5 w-5" />,
    title: 'AI Assistant',
    desc: 'Leverage AI to help with job descriptions, candidate matching, and communication.',
    color: 'red',
  },
  {
    icon: <BarChart3 className="h-5 w-5" />,
    title: 'Analytics & Reporting',
    desc: 'Gain insights into your recruitment process with comprehensive analytics and reporting.',
    color: 'green',
  },
  {
    icon: <Workflow className="h-5 w-5" />,
    title: 'Integrated Platform',
    desc: 'All your recruitment tools in one place, seamlessly integrated for maximum efficiency.',
    color: 'yellow',
  },
];

const FeaturesSection: React.FC = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });

  return (
    <section ref={sectionRef} className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6">
        {/* Header fade-in */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <div className="inline-block px-3 py-1 bg-blue-100 rounded-full text-sm font-semibold text-blue-800 mb-3">
            Cutting-Edge Features
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Powerful Features for Modern Recruitment
          </h2>
          <p className="text-lg text-gray-700">
            Our platform combines cutting-edge AI with intuitive design to streamline your entire recruitment workflow.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* Left image */}
          <motion.div
            className="lg:w-1/3"
            initial={{ opacity: 0, x: -60 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
            transition={{ duration: 0.6 }}
          >
            <img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="Modern recruitment technology"
              className="w-full h-[400px] object-cover rounded-xl shadow-lg"
            />
          </motion.div>

          {/* Right feature cards */}
          <motion.div
            className="lg:w-2/3"
            initial={{ opacity: 0, x: 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featureItems.map((item, index) => {
                return (
                  <div
                    key={index}
                    className={`group p-5 bg-white rounded-xl shadow transition-all duration-300 border border-gray-100 hover:shadow-lg hover:-translate-y-1`}
                  >
                    <div
                      className={`w-10 h-10 flex items-center justify-center rounded-lg mb-3 bg-${item.color}-100 text-${item.color}-600 group-hover:bg-${item.color}-600 group-hover:text-white transition-all duration-300`}
                    >
                      {item.icon}
                    </div>
                    <h3
                      className={`font-bold text-gray-800 text-sm mb-2 group-hover:text-${item.color}-600 transition-colors duration-300`}
                    >
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
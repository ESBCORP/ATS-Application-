import React from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeInVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

const AIInterviewSection: React.FC = () => {
  return (
    <motion.section
      id="interview"
      className="py-16 bg-white"
      initial="hidden"
      whileInView="visible"
      viewport={{ amount: 0.2 }}
      variants={fadeInVariant}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          {/* Left Text Content */}
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">AI-Powered Interviews</h2>
            <p className="text-lg text-gray-700 mb-6">
              Our advanced AI interviewer conducts the first level of screening, saving you time and resources while ensuring a consistent evaluation process.
            </p>

            <div className="space-y-4 mb-8">
              {[
                {
                  title: 'Customizable Questions',
                  desc: 'Create job-specific interview templates with custom questions.',
                },
                {
                  title: 'Intelligent Follow-ups',
                  desc: 'AI asks relevant follow-up questions based on candidate responses.',
                },
                {
                  title: 'Automated Evaluation',
                  desc: 'Candidates are scored based on keyword detection and response quality.',
                },
                {
                  title: 'Complete Transcripts',
                  desc: 'Review full interview transcripts and recordings at any time.',
                },
              ].map((item, index) => (
                <div className="flex items-start" key={index}>
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">{item.title}</h4>
                    <p className="text-gray-700">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="#contact"
              className="inline-flex items-center text-blue-800 font-medium hover:text-blue-700"
            >
              Learn more about our AI interview technology <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>

          {/* Right Image */}
          <motion.div
            className="md:w-1/2"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ amount: 0.3 }}
          >
            <video
              src="/AiInterview.mp4" // rename to remove spaces!
              autoPlay
              muted
              loop
              playsInline
              className="object-cover w-full h-auto"
            />
            
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default AIInterviewSection;

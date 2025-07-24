import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const fadeInUpVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const HowItWorksCardsSection = () => {
  const sectionRef = useRef(null);
  const sectionInView = useInView(sectionRef, { once: false, amount: 0.2 });

  const imageRef = useRef(null);
  const imageInView = useInView(imageRef, { once: false, amount: 0.2 });

  const steps = [
    {
      title: 'Find Candidates',
      desc: 'Source candidates directly from LinkedIn and add them to your database with a single click.',
      left: true,
      step: 1,
    },
    {
      title: 'AI Screening',
      desc: 'Our AI conducts initial interviews to filter candidates based on their responses to job-specific questions.',
      left: false,
      step: 2,
    },
    {
      title: 'Submit Candidates',
      desc: 'Easily submit qualified candidates to job openings with our streamlined submission process.',
      left: true,
      step: 3,
    },
    {
      title: 'Track & Communicate',
      desc: 'Monitor candidate progress through your pipeline and communicate via integrated voice, video, and chat.',
      left: false,
      step: 4,
    },
  ];

  return (
    <section id="how-it-works" className="py-16 bg-gray-50" ref={sectionRef}>
      <div className="container px-4 mx-auto">
        {/* Section Header */}
        <motion.div
          className="mb-16 text-center"
          variants={fadeInUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
        >
          <h2 className="mb-4 text-3xl font-bold text-gray-900">How VirtuosoU Works</h2>
          <p className="max-w-3xl mx-auto text-lg text-gray-700">
            VirtuosoU is an AI-powered smart interview and recruitment platform designed to revolutionize the hiring process. By combining artificial intelligence with intuitive workflows, VirtuosoU helps organizations automate, standardize, and optimize candidate evaluations — all in real time.
          </p>
        </motion.div>

        <div className="grid items-start grid-cols-1 gap-10 md:grid-cols-2">
          {/* Timeline Steps */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-0 w-1 h-full transform bg-blue-700 md:left-1/2 md:-translate-x-1/2"></div>

            <div className="relative z-10">
              {steps.map(({ title, desc, left, step }, index) => (
                <motion.div
                  key={index}
                  className={`flex flex-col items-center mb-12 md:flex-row ${
                    left ? '' : 'md:flex-row-reverse'
                  }`}
                  variants={fadeInUpVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.3 }}
                >
                  {/* Text Content */}
                  <div
                    className={`flex-1 order-2 mb-4 ${
                      left ? 'md:text-right md:pr-8 md:mb-0 md:order-1' : 'md:pl-8 md:mb-0'
                    }`}
                  >
                    <h3 className="mb-2 text-xl font-semibold text-gray-900">{title}</h3>
                    <p className="text-gray-700">{desc}</p>
                  </div>

                  {/* Step Number */}
                  <div className="z-10 flex items-center justify-center order-1 w-12 h-12 text-lg font-bold text-white bg-blue-800 rounded-full md:order-2">
                    {step}
                  </div>

                  {/* Spacer */}
                  <div className="flex-1 order-3 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right-side Image */}
          <motion.div
            ref={imageRef}
            className="flex justify-center items-start mt-6"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <img
              src="/workflow.png"
              alt="How It Works"
              className="w-full h-auto shadow-xl rounded-2xl max-w-md md:max-w-full"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksCardsSection;

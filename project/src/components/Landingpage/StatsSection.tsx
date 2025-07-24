import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const stats = [
  { value: '98%', label: 'Client Satisfaction' },
  { value: '40%', label: 'Time-to-Hire Reduction' },
  { value: '5K+', label: 'Successful Placements' },
  { value: '24/7', label: 'AI-Powered Support' },
];

const StatsSection: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });

  return (
    <section className="py-12 bg-white">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="container mx-auto px-6"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="p-6 bg-gray-50 rounded-xl shadow-sm transform transition-all duration-300 hover:shadow-md hover:-translate-y-1"
            >
              <div className="text-4xl font-bold text-blue-800 mb-2">{stat.value}</div>
              <div className="text-gray-600 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default StatsSection;
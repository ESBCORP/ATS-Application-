import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Award, Mail, MapPin, Target, Users, Zap } from 'lucide-react';
import React, { useRef } from 'react';

const jobs = [
  {
    title: "Enterprise Business Development Representative",
    location: "Rochester, NY",
    type: "Full-time",
    level: "Mid-level",
    description:
      "Drive B2B outreach, research potential clients, and build relationships with C-level prospects. Great for aspiring sales/marketing professionals.",
    email: "apply@virtuosou.com",
    skills: ["B2B Sales", "Client Relations", "Lead Generation"]
  },
  {
    title: "Senior Application Analyst – Claims & Remittance",
    location: "Remote, US",
    type: "Full-time",
    level: "Senior",
    description:
      "Lead application configuration, testing, and support for insurance systems. Requires technical expertise and proactive support skills.",
    email: "apply@virtuosou.com",
    skills: ["System Analysis", "Insurance Tech", "Testing"]
  },
  {
    title: "Energy Project Manager",
    location: "Remote, US",
    type: "Full-time",
    level: "Senior",
    description:
      "Manage renewable energy projects from planning to execution, ensuring alignment with compliance and sustainability goals.",
    email: "apply@virtuosou.com",
    skills: ["Project Management", "Renewable Energy", "Compliance"]
  },
];

const values = [
  { name: "Customer Delight", icon: Users, color: "from-blue-500 to-blue-600" },
  { name: "Energy & Passion", icon: Zap, color: "from-orange-500 to-red-500" },
  { name: "Integrity", icon: Award, color: "from-green-500 to-green-600" },
  { name: "Partnership", icon: Target, color: "from-purple-500 to-purple-600" },
  { name: "Accountability", icon: Users, color: "from-indigo-500 to-indigo-600" },
  { name: "Learning", icon: Target, color: "from-teal-500 to-teal-600" },
  { name: "Innovation", icon: Zap, color: "from-pink-500 to-pink-600" },
  { name: "Affinity", icon: Award, color: "from-cyan-500 to-cyan-600" },
  { name: "No Bias", icon: Users, color: "from-amber-500 to-amber-600" },
];

const testimonials = [
  {
    name: "Rajesh Jonnalagadda",
    position: "Technical Manager",
    quote:
      "It has been 8 years and counting… a culture where challenges are the reason behind waking us in the morning.",
    avatar: "RJ",
    rating: 5
  },
  {
    name: "Deepthi Mokrala",
    position: "Senior Client Growth Specialist",
    quote: "To love what you do… Proud to be #VirtuosoUian!",
    avatar: "DM",
    rating: 5
  },
];

const benefits = [
  "Comprehensive Health Insurance",
  "Flexible Work Arrangements",
  "Professional Development Budget",
  "Unlimited PTO Policy",
  "Stock Options Program",
  "Wellness & Fitness Programs"
];

const AnimatedCounter = ({ target, label }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (isInView) {
      const timer = setInterval(() => {
        setCount(prev => {
          if (prev < target) {
            return prev + Math.ceil(target / 50);
          }
          return target;
        });
      }, 30);
      return () => clearInterval(timer);
    }
  }, [isInView, target]);

  return (
    <motion.div 
      ref={ref}
      className="text-center"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-2 text-4xl font-bold text-white">{count}+</div>
      <div className="text-blue-100">{label}</div>
    </motion.div>
  );
};

const CareersPage = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const cardHoverVariants = {
    hover: {
      y: -8,
      scale: 1.02,
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen overflow-hidden bg-gray-50">
      {/* Hero Section with Parallax */}
      <motion.section 
        className="relative flex items-center justify-center min-h-screen pt-0 mt-0 bg-blue-900"
        style={{ y: backgroundY }}
      >
        <div className="absolute inset-0 bg-black opacity-10"></div>
        
        <motion.div 
          className="relative z-10 max-w-4xl px-4 mx-auto text-center"
          style={{ y: textY }}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.h1 
            className="mb-6 text-6xl font-bold text-white md:text-7xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Careers at{" "}
            <motion.span 
              className="text-blue-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              VirtuosoU
            </motion.span>
          </motion.h1>
          
          <motion.p 
            className="mb-8 text-xl leading-relaxed text-blue-100 md:text-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Join a passionate, inclusive, and innovative team on a mission to transform the hiring experience.
          </motion.p>

          <motion.div 
            className="flex flex-wrap justify-center gap-8 mt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <AnimatedCounter target={500} label="Team Members" />
            <AnimatedCounter target={50} label="Countries" />
            <AnimatedCounter target={98} label="Satisfaction Rate" />
            <AnimatedCounter target={10} label="Years Experience" />
          </motion.div>
        </motion.div>

        {/* Floating Elements */}
        <motion.div 
          className="absolute w-20 h-20 bg-blue-400 rounded-full top-20 left-10 opacity-20"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute w-16 h-16 bg-purple-400 rounded-full bottom-20 right-10 opacity-20"
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -180, -360]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
      </motion.section>

      {/* Core Values */}
      <motion.section 
        className="relative py-20 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="px-4 mx-auto max-w-7xl">
          <motion.div className="mb-16 text-center" variants={itemVariants}>
            <h2 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
              Our Core Values
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              These values guide everything we do and shape our company culture
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
          >
            {values.map((value, idx) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={idx}
                  className="relative p-8 bg-white border border-gray-100 shadow-lg group rounded-2xl"
                  variants={itemVariants}
                  whileHover={cardHoverVariants.hover}
                >
                  <div className={`w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900">{value.name}</h3>
                  <div className={`h-1 w-full bg-blue-600 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* Benefits Section */}
      <motion.section 
        className="py-20 bg-blue-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="px-4 mx-auto max-w-7xl">
          <motion.div className="mb-16 text-center" variants={itemVariants}>
            <h2 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
              Why Join VirtuosoU?
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              We believe in taking care of our team with comprehensive benefits and growth opportunities
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
          >
            {benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                className="flex items-center p-6 bg-white shadow-lg rounded-xl"
                variants={itemVariants}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              >
                <div className="w-3 h-3 mr-4 bg-blue-500 rounded-full"></div>
                <span className="font-medium text-gray-800">{benefit}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Testimonials */}
      <motion.section 
        className="py-20 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="px-4 mx-auto max-w-7xl">
          <motion.div className="mb-16 text-center" variants={itemVariants}>
            <h2 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
              What Our Team Says
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              Hear from our team members about their experience at VirtuosoU
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 gap-8 lg:grid-cols-2"
            variants={containerVariants}
          >
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                className="relative p-8 shadow-lg bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl"
                variants={itemVariants}
                whileHover={cardHoverVariants.hover}
              >
                <div className="flex items-center mb-6">
                  <div className="flex items-center justify-center w-16 h-16 mr-4 text-lg font-bold text-white bg-blue-600 rounded-full">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600">{testimonial.position}</p>
                    <div className="flex mt-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-4 h-4 mr-1 bg-yellow-400 rounded-full"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: idx * 0.1 + i * 0.1 }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <blockquote className="text-lg italic leading-relaxed text-gray-700">
                  "{testimonial.quote}"
                </blockquote>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Open Positions */}
      <motion.section 
        className="py-20 bg-gray-900"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="px-4 mx-auto max-w-7xl">
          <motion.div className="mb-16 text-center" variants={itemVariants}>
            <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
              Open Positions
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-300">
              Ready to take the next step in your career? Explore our current openings
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 gap-8 lg:grid-cols-3"
            variants={containerVariants}
          >
            {jobs.map((job, idx) => (
              <motion.div
                key={idx}
                className="relative p-8 overflow-hidden bg-white shadow-2xl group rounded-2xl"
                variants={itemVariants}
                whileHover={cardHoverVariants.hover}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
                
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <span className="inline-block px-3 py-1 mb-2 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full">
                      {job.type}
                    </span>
                    <span className="inline-block px-3 py-1 mb-2 ml-2 text-xs font-semibold text-purple-600 bg-purple-100 rounded-full">
                      {job.level}
                    </span>
                  </div>
                </div>

                <h3 className="mb-4 text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-600">
                  {job.title}
                </h3>
                
                <div className="flex items-center mb-4 text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{job.location}</span>
                </div>

                <p className="mb-6 leading-relaxed text-gray-600">
                  {job.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {job.skills.map((skill, skillIdx) => (
                    <span 
                      key={skillIdx}
                      className="px-2 py-1 text-xs text-gray-700 bg-gray-100 rounded-lg"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <motion.a
                  href={`mailto:${job.email}`}
                  className="inline-flex items-center px-6 py-3 font-semibold text-white transition-all duration-300 bg-blue-600 rounded-xl hover:bg-blue-700 group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Apply Now
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </motion.a>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Footer CTA */}
      <motion.section 
        className="py-20 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
        variants={containerVariants}
      >
        <div className="max-w-4xl px-4 mx-auto text-center">
          <motion.div variants={itemVariants}>
            <h2 className="mb-6 text-4xl font-bold text-gray-900">
              Ready to Join Our Team?
            </h2>
            <p className="mb-8 text-xl text-gray-600">
              We're always looking for talented individuals who share our passion for innovation
            </p>
            <motion.button
              className="px-8 py-4 text-lg font-semibold text-white transition-all duration-300 bg-blue-600 rounded-xl hover:bg-blue-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View All Opportunities
            </motion.button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default CareersPage;
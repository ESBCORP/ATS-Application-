import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { 
  Users, 
  Target, 
  Clock, 
  Shield, 
  TrendingUp, 
  Award, 
  CheckCircle, 
  ArrowRight,
  Building,
  Briefcase,
  Search,
  UserCheck,
  Globe,
  Star,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import React, { useRef } from 'react';

const services = [
  {
    title: "Permanent Staffing",
    description: "Find top-tier talent for long-term positions across all industries",
    icon: Users,
    features: ["Executive Search", "Professional Recruitment", "Industry Specialists"],
    color: "from-blue-500 to-blue-600"
  },
  {
    title: "Temporary Staffing",
    description: "Flexible workforce solutions for short-term projects and seasonal needs",
    icon: Clock,
    features: ["Quick Deployment", "Scalable Teams", "Project-Based"],
    color: "from-green-500 to-green-600"
  },
  {
    title: "Contract Staffing",
    description: "Specialized contractors for specific skills and project requirements",
    icon: Briefcase,
    features: ["Technical Experts", "Flexible Terms", "Cost-Effective"],
    color: "from-purple-500 to-purple-600"
  },
  {
    title: "Consulting Services",
    description: "Strategic workforce planning and organizational development",
    icon: Target,
    features: ["Workforce Strategy", "Process Optimization", "Training Programs"],
    color: "from-orange-500 to-red-500"
  }
];

const industries = [
  { name: "Technology", icon: "💻", growth: "+25%" },
  { name: "Healthcare", icon: "🏥", growth: "+18%" },
  { name: "Finance", icon: "💰", growth: "+22%" },
  { name: "Manufacturing", icon: "🏭", growth: "+15%" },
  { name: "Retail", icon: "🛍️", growth: "+12%" },
  { name: "Education", icon: "🎓", growth: "+20%" }
];

const process = [
  {
    step: "01",
    title: "Consultation",
    description: "We understand your specific needs, culture, and requirements",
    icon: Search
  },
  {
    step: "02",
    title: "Sourcing",
    description: "Our team identifies and screens qualified candidates",
    icon: Users
  },
  {
    step: "03",
    title: "Assessment",
    description: "Comprehensive evaluation including skills and cultural fit",
    icon: UserCheck
  },
  {
    step: "04",
    title: "Placement",
    description: "Seamless integration and ongoing support for success",
    icon: CheckCircle
  }
];

const testimonials = [
  {
    name: "Sarah Johnson",
    position: "HR Director, TechCorp",
    company: "TechCorp Solutions",
    quote: "Their staffing solutions helped us scale our team by 200% in just 6 months. Exceptional quality and speed.",
    rating: 5,
    avatar: "SJ"
  },
  {
    name: "Michael Chen",
    position: "Operations Manager",
    company: "HealthFirst",
    quote: "The temporary staffing during our peak season was flawless. Every candidate was pre-screened and ready to contribute immediately.",
    rating: 5,
    avatar: "MC"
  },
  {
    name: "Emily Rodriguez",
    position: "Project Lead",
    company: "BuildRight Construction",
    quote: "Contract staffing allowed us to bring in specialized expertise exactly when we needed it. Highly recommend their services.",
    rating: 5,
    avatar: "ER"
  }
];

const stats = [
  { value: 5000, label: "Successful Placements", suffix: "+" },
  { value: 98, label: "Client Satisfaction", suffix: "%" },
  { value: 50, label: "Industry Partners", suffix: "+" },
  { value: 24, label: "Average Placement Time", suffix: "hrs" }
];

const AnimatedCounter = ({ target, label, suffix = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (isInView) {
      const timer = setInterval(() => {
        setCount(prev => {
          if (prev < target) {
            return Math.min(prev + Math.ceil(target / 50), target);
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
      transition={{ duration: 0.6, type: "spring" }}
    >
      <div className="mb-2 text-4xl font-bold text-white">{count}{suffix}</div>
      <div className="text-blue-100">{label}</div>
    </motion.div>
  );
};

const StaffingPage = () => {
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
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 60, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const cardHoverVariants = {
    hover: {
      y: -10,
      scale: 1.03,
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
        className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900"
        style={{ y: backgroundY }}
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>
        
        {/* Animated Background Elements */}
        <motion.div 
          className="absolute w-32 h-32 bg-blue-400 rounded-full top-20 left-10 opacity-10"
          animate={{ 
            y: [0, -30, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute w-24 h-24 bg-purple-400 rounded-full bottom-32 right-20 opacity-10"
          animate={{ 
            y: [0, 25, 0],
            rotate: [0, -180, -360],
            scale: [1, 0.8, 1]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute w-20 h-20 bg-green-400 rounded-full top-1/2 right-10 opacity-10"
          animate={{ 
            x: [0, 20, 0],
            y: [0, -20, 0],
            rotate: [0, 90, 180]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />

        <motion.div 
          className="relative z-10 max-w-6xl px-4 mx-auto text-center"
          style={{ y: textY }}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <motion.h1 
            className="mb-8 text-5xl font-bold text-white md:text-7xl lg:text-8xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Elite{" "}
            <motion.span 
              className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              Staffing
            </motion.span>
            {" "}Solutions
          </motion.h1>
          
          <motion.p 
            className="mb-12 text-xl leading-relaxed text-blue-100 md:text-2xl lg:text-3xl max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Connect top talent with leading organizations. From temporary assignments to permanent placements, we deliver exceptional workforce solutions.
          </motion.p>

          <motion.div 
            className="flex flex-wrap justify-center gap-12 mt-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {stats.map((stat, index) => (
              <AnimatedCounter 
                key={index}
                target={stat.value} 
                label={stat.label} 
                suffix={stat.suffix}
              />
            ))}
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center mt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <motion.button
              className="px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all duration-300 flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Find Talent
              <ArrowRight className="w-5 h-5 ml-2" />
            </motion.button>
            <motion.button
              className="px-8 py-4 text-lg font-semibold text-blue-300 border-2 border-blue-300 rounded-xl hover:bg-blue-300 hover:text-blue-900 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Post a Job
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Services Section - Grid Layout */}
      <motion.section 
        className="py-24 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="px-4 mx-auto max-w-7xl">
          <motion.div className="mb-20 text-center" variants={itemVariants}>
            <h2 className="mb-8 text-4xl font-bold text-gray-900 md:text-6xl">
              Our Staffing Services
            </h2>
            <p className="max-w-4xl mx-auto text-xl text-gray-600 md:text-2xl">
              Comprehensive workforce solutions tailored to your business needs
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4"
            variants={containerVariants}
          >
            {services.map((service, idx) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={idx}
                  className="relative p-8 bg-white border border-gray-100 shadow-xl group rounded-3xl overflow-hidden"
                  variants={itemVariants}
                  whileHover={cardHoverVariants.hover}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                  
                  <div className={`w-20 h-20 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  
                  <h3 className="mb-4 text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </h3>
                  
                  <p className="mb-6 leading-relaxed text-gray-600">
                    {service.description}
                  </p>

                  <div className="space-y-3">
                    {service.features.map((feature, featureIdx) => (
                      <div key={featureIdx} className="flex items-center">
                        <CheckCircle className="w-5 h-5 mr-3 text-green-500" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${service.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* Industries Section - Flexbox Layout */}
      <motion.section 
        className="py-24 bg-gradient-to-br from-gray-50 to-blue-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="px-4 mx-auto max-w-7xl">
          <motion.div className="mb-20 text-center" variants={itemVariants}>
            <h2 className="mb-8 text-4xl font-bold text-gray-900 md:text-6xl">
              Industries We Serve
            </h2>
            <p className="max-w-4xl mx-auto text-xl text-gray-600 md:text-2xl">
              Specialized expertise across diverse sectors with proven growth rates
            </p>
          </motion.div>

          <motion.div 
            className="flex flex-wrap justify-center gap-8"
            variants={containerVariants}
          >
            {industries.map((industry, idx) => (
              <motion.div
                key={idx}
                className="flex flex-col items-center p-8 bg-white shadow-xl rounded-2xl min-w-[200px] group"
                variants={itemVariants}
                whileHover={{
                  scale: 1.05,
                  y: -5,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  transition: { duration: 0.3 }
                }}
              >
                <div className="mb-4 text-5xl group-hover:scale-110 transition-transform duration-300">
                  {industry.icon}
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">{industry.name}</h3>
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
                  <span className="font-semibold text-green-600">{industry.growth}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Process Section - Grid Layout */}
      <motion.section 
        className="py-24 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="px-4 mx-auto max-w-7xl">
          <motion.div className="mb-20 text-center" variants={itemVariants}>
            <h2 className="mb-8 text-4xl font-bold text-gray-900 md:text-6xl">
              Our Process
            </h2>
            <p className="max-w-4xl mx-auto text-xl text-gray-600 md:text-2xl">
              A proven 4-step approach to finding the perfect match
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
            variants={containerVariants}
          >
            {process.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={idx}
                  className="relative text-center group"
                  variants={itemVariants}
                >
                  {/* Connection Line */}
                  {idx < process.length - 1 && (
                    <div className="hidden lg:block absolute top-16 left-full w-full h-1 bg-gradient-to-r from-blue-200 to-transparent transform translate-x-4"></div>
                  )}
                  
                  <motion.div 
                    className="relative mx-auto mb-8 w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.8 }}
                  >
                    <Icon className="w-12 h-12 text-white" />
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-2xl font-bold text-blue-600">{step.step}</span>
                    </div>
                  </motion.div>

                  <h3 className="mb-4 text-2xl font-bold text-gray-900">{step.title}</h3>
                  <p className="leading-relaxed text-gray-600">{step.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* Testimonials Section - Flexbox Layout */}
      <motion.section 
        className="py-24 bg-gradient-to-br from-blue-900 to-indigo-900"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="px-4 mx-auto max-w-7xl">
          <motion.div className="mb-20 text-center" variants={itemVariants}>
            <h2 className="mb-8 text-4xl font-bold text-white md:text-6xl">
              Client Success Stories
            </h2>
            <p className="max-w-4xl mx-auto text-xl text-blue-100 md:text-2xl">
              Hear from companies who've transformed their workforce with our solutions
            </p>
          </motion.div>

          <motion.div 
            className="flex flex-wrap justify-center gap-8 lg:flex-nowrap"
            variants={containerVariants}
          >
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                className="flex-1 min-w-[300px] max-w-md p-8 bg-white shadow-2xl rounded-3xl relative overflow-hidden group"
                variants={itemVariants}
                whileHover={cardHoverVariants.hover}
              >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                
                <div className="flex items-center mb-6">
                  <div className="flex items-center justify-center w-16 h-16 mr-4 text-lg font-bold text-white bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600">{testimonial.position}</p>
                    <p className="text-sm text-blue-600 font-medium">{testimonial.company}</p>
                  </div>
                </div>

                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: idx * 0.1 + i * 0.1, type: "spring" }}
                    >
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    </motion.div>
                  ))}
                </div>

                <blockquote className="text-lg leading-relaxed text-gray-700 italic">
                  "{testimonial.quote}"
                </blockquote>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Contact CTA Section - Flexbox Layout */}
      <motion.section 
        className="py-24 bg-gradient-to-r from-blue-600 to-purple-600"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
        variants={containerVariants}
      >
        <div className="max-w-6xl px-4 mx-auto">
          <motion.div 
            className="flex flex-col lg:flex-row items-center justify-between gap-12"
            variants={itemVariants}
          >
            <div className="flex-1 text-center lg:text-left">
              <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
                Ready to Transform Your Workforce?
              </h2>
              <p className="mb-8 text-xl text-blue-100">
                Let's discuss your staffing needs and create a customized solution that drives results.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <motion.button
                  className="flex items-center justify-center px-8 py-4 text-lg font-semibold text-blue-600 bg-white rounded-xl hover:bg-blue-50 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call Us Now
                </motion.button>
                <motion.button
                  className="flex items-center justify-center px-8 py-4 text-lg font-semibold text-white border-2 border-white rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Send Message
                </motion.button>
              </div>
            </div>

            <motion.div 
              className="flex-1 max-w-md"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="p-8 bg-white rounded-2xl shadow-2xl">
                <h3 className="mb-6 text-2xl font-bold text-gray-900">Get Started Today</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-3 text-blue-600" />
                    <span className="text-gray-700">Global Offices Available</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-3 text-blue-600" />
                    <span className="text-gray-700">24/7 Support</span>
                  </div>
                  <div className="flex items-center">
                    <Globe className="w-5 h-5 mr-3 text-blue-600" />
                    <span className="text-gray-700">50+ Countries Served</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 mr-3 text-blue-600" />
                    <span className="text-gray-700">100% Satisfaction Guarantee</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default StaffingPage;

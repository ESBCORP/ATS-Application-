
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { 
  ArrowRight, 
  Award, 
  Users, 
  Target, 
  Clock, 
  CheckCircle, 
  Star,
  TrendingUp,
  Globe,
  Shield,
  Briefcase,
  Heart,
  Zap,
  MessageCircle,
  Phone,
  Calendar,
  BarChart3,
  UserCheck,
  Building,
  BookOpen,
  Settings,
  PieChart,
  FileText,
  Handshake,
  Lightbulb,
  Scale,
  Headphones
} from 'lucide-react';
import React, { useRef } from 'react';

const hrProcess = [
  {
    step: 1,
    title: "HR Audit & Assessment",
    description: "Comprehensive evaluation of your current HR systems, policies, processes, and organizational structure.",
    icon: BarChart3,
    color: "from-blue-500 to-blue-600",
    duration: "2-3 Days"
  },
  {
    step: 2,
    title: "Strategic HR Planning",
    description: "Development of customized HR strategies aligned with business goals and workforce requirements.",
    icon: Target,
    color: "from-purple-500 to-purple-600",
    duration: "3-5 Days"
  },
  {
    step: 3,
    title: "Policy & Framework Design",
    description: "Creation of comprehensive HR policies, procedures, and frameworks for optimal workforce management.",
    icon: Calendar,
    color: "from-green-500 to-green-600",
    duration: "2-4 Days"
  },
  {
    step: 4,
    title: "System Implementation",
    description: "Deployment of HR systems, tools, and processes with comprehensive training for HR teams.",
    icon: BookOpen,
    color: "from-orange-500 to-orange-600",
    duration: "1-2 Weeks"
  },
  {
    step: 5,
    title: "Performance Monitoring",
    description: "Ongoing monitoring of HR metrics, employee satisfaction, and continuous improvement initiatives.",
    icon: TrendingUp,
    color: "from-teal-500 to-teal-600",
    duration: "Ongoing"
  }
];

const services = [
  {
    title: "HR Operations & Administration",
    description: "Streamline HR operations with efficient payroll systems, benefits administration, and employee record management.",
    icon: Settings,
    features: ["Payroll management", "Benefits admin", "HRIS systems"],
    price: "Essential"
  },
  {
    title: "Employee Relations & Engagement",
    description: "Build positive workplace culture through conflict resolution, employee communications, and engagement programs.",
    icon: Heart,
    features: ["Conflict resolution", "Employee surveys", "Communication strategies"],
    price: "Premium"
  },
  {
    title: "Learning & Development",
    description: "Comprehensive training programs, skill development initiatives, and career progression planning for employees.",
    icon: BookOpen,
    features: ["Training programs", "Skill assessments", "Career planning"],
    price: "Growth"
  },
  {
    title: "Performance Management",
    description: "Implement effective performance review systems, goal setting frameworks, and employee recognition programs.",
    icon: TrendingUp,
    features: ["Performance reviews", "Goal tracking", "Recognition programs"],
    price: "Performance"
  }
];

const stats = [
  { number: 300, label: "HR Systems Implemented", suffix: "+" },
  { number: 88, label: "Employee Satisfaction Rate", suffix: "%" },
  { number: 35, label: "Avg Process Improvement", suffix: "%" },
  { number: 92, label: "HR Compliance Score", suffix: "%" }
];

const testimonials = [
  {
    name: "Amanda Richardson",
    position: "Chief Human Resources Officer",
    company: "TechFlow Industries",
    quote: "VirtuosoU transformed our entire HR department. Our employee satisfaction scores increased by 35% within six months.",
    avatar: "AR",
    rating: 5,
    industry: "Technology"
  },
  {
    name: "Daniel Park",
    position: "VP of People Operations",
    company: "MedCore Solutions",
    quote: "Their HR systems implementation streamlined our processes and reduced administrative work by 40%. Exceptional service.",
    avatar: "DP",
    rating: 5,
    industry: "Healthcare"
  },
  {
    name: "Rachel Martinez",
    position: "Director of Human Resources",
    company: "FinanceFirst Group",
    quote: "The performance management system they designed has completely transformed how we evaluate and develop our talent.",
    avatar: "RM",
    rating: 5,
    industry: "Finance"
  }
];

const team = [
  {
    name: "Jessica Collins",
    role: "Senior HR Business Partner",
    expertise: "Employee Relations & HR Operations",
    image: "JC",
    experience: "14+ years",
    projects: "180+"
  },
  {
    name: "Ryan Thompson",
    role: "HR Systems Specialist",
    expertise: "HRIS Implementation & Data Analytics",
    image: "RT",
    experience: "11+ years",
    projects: "220+"
  },
  {
    name: "Sophie Anderson",
    role: "Learning & Development Manager",
    expertise: "Training Design & Performance Management",
    image: "SA",
    experience: "9+ years",
    projects: "160+"
  }
];

const hrAreas = [
  { name: "HR Operations", percentage: 28, color: "bg-blue-500" },
  { name: "Employee Relations", percentage: 24, color: "bg-purple-500" },
  { name: "Learning & Development", percentage: 22, color: "bg-green-500" },
  { name: "Performance Management", percentage: 16, color: "bg-orange-500" },
  { name: "HR Analytics", percentage: 10, color: "bg-gray-500" }
];

const AnimatedCounter = ({ target, label, suffix = "", duration = 2000 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (isInView) {
      const increment = target / (duration / 50);
      const timer = setInterval(() => {
        setCount(prev => {
          if (prev < target) {
            return Math.min(prev + increment, target);
          }
          return target;
        });
      }, 50);
      return () => clearInterval(timer);
    }
  }, [isInView, target, duration]);

  return (
    <motion.div 
      ref={ref}
      className="text-center"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, type: "spring" }}
    >
      <div className="mb-2 text-4xl font-bold text-white">
        {Math.round(count)}{suffix}
      </div>
      <div className="text-blue-100">{label}</div>
    </motion.div>
  );
};

const HRPage = () => {
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
        className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900"
        style={{ y: backgroundY }}
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>
        
        {/* Animated Background Elements */}
        <motion.div 
          className="absolute w-96 h-96 bg-blue-400 rounded-full top-10 left-10 opacity-10"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute w-64 h-64 bg-purple-400 rounded-full bottom-10 right-10 opacity-10"
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
            opacity: [0.2, 0.1, 0.2]
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2
          }}
        />

        <motion.div 
          className="relative z-10 max-w-6xl px-4 mx-auto text-center"
          style={{ y: textY }}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.h1 
            className="mb-6 text-6xl font-bold text-white md:text-7xl lg:text-8xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Strategic{" "}
            <motion.span 
              className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              HR Solutions
            </motion.span>
          </motion.h1>
          
          <motion.p 
            className="mb-8 text-xl leading-relaxed text-blue-100 md:text-2xl max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Transform your human resources operations with data-driven strategies, 
            innovative technology, and comprehensive HR expertise that drives organizational success.
          </motion.p>

          <motion.div 
            className="flex flex-wrap justify-center gap-4 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.button
              className="px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all duration-300 flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Transform Your HR
              <ArrowRight className="w-5 h-5 ml-2" />
            </motion.button>
            <motion.button
              className="px-8 py-4 text-lg font-semibold text-white border-2 border-white rounded-xl hover:bg-white hover:text-blue-900 transition-all duration-300 flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Phone className="w-5 h-5 mr-2" />
              Free Consultation
            </motion.button>
          </motion.div>

          {/* Stats Section */}
          <motion.div 
            className="grid grid-cols-2 gap-8 mt-16 lg:grid-cols-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {stats.map((stat, idx) => (
              <AnimatedCounter 
                key={idx}
                target={stat.number} 
                label={stat.label} 
                suffix={stat.suffix}
              />
            ))}
          </motion.div>
        </motion.div>
      </motion.section>

      {/* HR Process */}
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
              Our HR Transformation Process
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              A systematic approach to revolutionizing your human resources operations and organizational effectiveness
            </p>
          </motion.div>

          <div className="relative">
            {/* Process Steps */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
              {hrProcess.map((process, idx) => {
                const Icon = process.icon;
                return (
                  <motion.div
                    key={idx}
                    className="relative text-center"
                    variants={itemVariants}
                    whileHover={cardHoverVariants.hover}
                  >
                    {/* Connection Line */}
                    {idx < hrProcess.length - 1 && (
                      <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gray-200 z-0">
                        <motion.div 
                          className="h-full bg-blue-500"
                          initial={{ width: "0%" }}
                          whileInView={{ width: "100%" }}
                          transition={{ duration: 1, delay: idx * 0.2 }}
                        />
                      </div>
                    )}

                    <motion.div 
                      className={`relative z-10 w-24 h-24 mx-auto mb-6 bg-gradient-to-r ${process.color} rounded-full flex items-center justify-center shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Icon className="w-10 h-10 text-white" />
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                        <span className="text-sm font-bold text-gray-800">{process.step}</span>
                      </div>
                    </motion.div>

                    <h3 className="mb-4 text-xl font-bold text-gray-900">{process.title}</h3>
                    <p className="mb-4 text-gray-600">{process.description}</p>
                    <div className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-full">
                      <Clock className="w-4 h-4 mr-1" />
                      {process.duration}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Services Grid */}
      <motion.section 
        className="py-20 bg-gray-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="px-4 mx-auto max-w-7xl">
          <motion.div className="mb-16 text-center" variants={itemVariants}>
            <h2 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
              Comprehensive HR Services
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              Full-spectrum human resources solutions designed to optimize your workforce and drive organizational excellence
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
            variants={containerVariants}
          >
            {services.map((service, idx) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={idx}
                  className="relative p-8 bg-white shadow-lg rounded-2xl group overflow-hidden"
                  variants={itemVariants}
                  whileHover={cardHoverVariants.hover}
                >
                  <div className="absolute top-0 right-0 px-3 py-1 text-xs font-semibold text-white bg-blue-600 rounded-bl-lg">
                    {service.price}
                  </div>

                  <div className="w-16 h-16 mb-6 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                    <Icon className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors duration-300" />
                  </div>

                  <h3 className="mb-4 text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                    {service.title}
                  </h3>
                  
                  <p className="mb-6 text-gray-600 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="space-y-2">
                    {service.features.map((feature, featureIdx) => (
                      <div key={featureIdx} className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <motion.button
                    className="w-full mt-6 px-4 py-2 text-sm font-semibold text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Learn More
                  </motion.button>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* HR Focus Areas */}
      <motion.section 
        className="py-20 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="px-4 mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
            <motion.div variants={itemVariants}>
              <h2 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
                Core HR Focus Areas
              </h2>
              <p className="mb-8 text-xl text-gray-600 leading-relaxed">
                Our comprehensive approach covers all critical aspects of human resources management, 
                ensuring your organization operates at peak efficiency across every HR function.
              </p>

              <div className="space-y-4">
                {hrAreas.map((area, idx) => (
                  <motion.div
                    key={idx}
                    className="flex items-center"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                  >
                    <div className="w-40 text-sm font-medium text-gray-700">
                      {area.name}
                    </div>
                    <div className="flex-1 mx-4 bg-gray-200 rounded-full h-2">
                      <motion.div
                        className={`h-full rounded-full ${area.color}`}
                        initial={{ width: "0%" }}
                        whileInView={{ width: `${area.percentage}%` }}
                        transition={{ duration: 1, delay: idx * 0.1 }}
                      />
                    </div>
                    <div className="w-12 text-sm font-bold text-gray-800">
                      {area.percentage}%
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              className="relative"
              variants={itemVariants}
            >
              <div className="relative p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl">
                <div className="grid grid-cols-2 gap-6">
                  <motion.div 
                    className="p-6 bg-white rounded-xl shadow-md text-center"
                    whileHover={{ scale: 1.05, rotate: 2 }}
                  >
                    <Globe className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                    <div className="text-2xl font-bold text-gray-900">15+</div>
                    <div className="text-sm text-gray-600">Industries</div>
                  </motion.div>
                  <motion.div 
                    className="p-6 bg-white rounded-xl shadow-md text-center"
                    whileHover={{ scale: 1.05, rotate: -2 }}
                  >
                    <Building className="w-8 h-8 mx-auto mb-3 text-purple-600" />
                    <div className="text-2xl font-bold text-gray-900">300+</div>
                    <div className="text-sm text-gray-600">Companies</div>
                  </motion.div>
                  <motion.div 
                    className="p-6 bg-white rounded-xl shadow-md text-center"
                    whileHover={{ scale: 1.05, rotate: 2 }}
                  >
                    <UserCheck className="w-8 h-8 mx-auto mb-3 text-green-600" />
                    <div className="text-2xl font-bold text-gray-900">25K+</div>
                    <div className="text-sm text-gray-600">Employees</div>
                  </motion.div>
                  <motion.div 
                    className="p-6 bg-white rounded-xl shadow-md text-center"
                    whileHover={{ scale: 1.05, rotate: -2 }}
                  >
                    <TrendingUp className="w-8 h-8 mx-auto mb-3 text-orange-600" />
                    <div className="text-2xl font-bold text-gray-900">92%</div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Team Section */}
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
              Meet Our HR Experts
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-300">
              Seasoned HR professionals with extensive experience in organizational development and human capital management
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 gap-8 md:grid-cols-3"
            variants={containerVariants}
          >
            {team.map((member, idx) => (
              <motion.div
                key={idx}
                className="relative p-8 bg-white rounded-2xl shadow-xl group overflow-hidden"
                variants={itemVariants}
                whileHover={cardHoverVariants.hover}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                
                <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 text-2xl font-bold text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                  {member.image}
                </div>

                <div className="text-center">
                  <h3 className="mb-2 text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                    {member.name}
                  </h3>
                  <p className="mb-4 text-blue-600 font-medium">{member.role}</p>
                  <p className="mb-6 text-gray-600">{member.expertise}</p>
                  
                  <div className="flex justify-center space-x-6 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{member.experience}</div>
                      <div className="text-sm text-gray-600">Experience</div>
                    </div>
                    <div className="w-px bg-gray-200"></div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{member.projects}</div>
                      <div className="text-sm text-gray-600">Projects</div>
                    </div>
                  </div>

                  <motion.button
                    className="px-6 py-2 text-sm font-semibold text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Connect
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Testimonials */}
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
              Client Success Stories
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              Discover how organizations have transformed their HR operations and achieved remarkable results
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 gap-8 lg:grid-cols-3"
            variants={containerVariants}
          >
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                className="p-8 bg-white shadow-lg rounded-2xl relative overflow-hidden group"
                variants={itemVariants}
                whileHover={cardHoverVariants.hover}
              >
                <div className="absolute top-0 right-0 p-2 bg-blue-600 text-white rounded-bl-lg">
                  <span className="text-xs font-semibold">{testimonial.industry}</span>
                </div>

                <div className="flex items-center mb-6">
                  <div className="flex items-center justify-center w-16 h-16 mr-4 text-lg font-bold text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                    {testimonial.avatar}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900">{testimonial.name}</h4>
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

                <blockquote className="text-lg italic leading-relaxed text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                  "{testimonial.quote}"
                </blockquote>

                <motion.div 
                  className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

     
    </div>
  );
};

export default HRPage;
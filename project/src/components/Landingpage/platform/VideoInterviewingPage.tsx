
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
  Headphones,
  Video,
  Play,
  Camera,
  Monitor,
  Mic,
  Eye,
  Timer,
  Database,
  Brain,
  Search,
  Filter,
  Download,
  Share2,
  Lock,
  CloudUpload,
  Smartphone
} from 'lucide-react';
import React, { useRef } from 'react';

const interviewProcess = [
  {
    step: 1,
    title: "Interview Setup & Configuration",
    description: "Customize interview templates, questions, and evaluation criteria tailored to your specific roles and requirements.",
    icon: Settings,
    color: "from-blue-500 to-blue-600",
    duration: "5 Minutes"
  },
  {
    step: 2,
    title: "Candidate Invitation & Scheduling",
    description: "Automated candidate invitations with flexible scheduling options and calendar integration for seamless coordination.",
    icon: Calendar,
    color: "from-purple-500 to-purple-600",
    duration: "Instant"
  },
  {
    step: 3,
    title: "Video Interview Recording",
    description: "High-quality video recording with multi-device compatibility and real-time technical support for candidates.",
    icon: Video,
    color: "from-green-500 to-green-600",
    duration: "15-45 Mins"
  },
  {
    step: 4,
    title: "AI-Powered Analysis",
    description: "Advanced AI evaluation of responses, facial expressions, and communication skills with detailed scoring reports.",
    icon: Brain,
    color: "from-orange-500 to-orange-600",
    duration: "2-5 Minutes"
  },
  {
    step: 5,
    title: "Results & Decision Making",
    description: "Comprehensive candidate comparison tools, team collaboration features, and automated decision workflows.",
    icon: TrendingUp,
    color: "from-teal-500 to-teal-600",
    duration: "Ongoing"
  }
];

const services = [
  {
    title: "Live Video Interviews",
    description: "Real-time face-to-face interviews with HD quality, screen sharing, and collaborative evaluation tools for hiring teams.",
    icon: Video,
    features: ["HD video quality", "Screen sharing", "Multi-interviewer support"],
    price: "Professional"
  },
  {
    title: "Recorded Video Assessments",
    description: "One-way video interviews allowing candidates to record responses at their convenience with AI-powered analysis.",
    icon: Camera,
    features: ["Flexible scheduling", "AI analysis", "Question libraries"],
    price: "Efficient"
  },
  {
    title: "Technical Skill Evaluation",
    description: "Specialized coding challenges, whiteboard sessions, and technical assessments integrated within video interviews.",
    icon: Monitor,
    features: ["Code editors", "Technical challenges", "Real-time collaboration"],
    price: "Technical"
  },
  {
    title: "Interview Analytics & Insights",
    description: "Comprehensive reporting, candidate comparison tools, and hiring pipeline analytics for data-driven decisions.",
    icon: BarChart3,
    features: ["Performance analytics", "Candidate insights", "Hiring metrics"],
    price: "Analytics"
  }
];

const stats = [
  { number: 500, label: "Companies Using Platform", suffix: "+" },
  { number: 87, label: "Interview Completion Rate", suffix: "%" },
  { number: 65, label: "Faster Hiring Process", suffix: "%" },
  { number: 94, label: "User Satisfaction Score", suffix: "%" }
];

const testimonials = [
  {
    name: "Sarah Chen",
    position: "Head of Talent Acquisition",
    company: "InnovateTech Solutions",
    quote: "Our hiring process became 60% faster with VirtuosoU's video interviewing platform. The AI insights are incredibly valuable.",
    avatar: "SC",
    rating: 5,
    industry: "Technology"
  },
  {
    name: "Michael Rodriguez",
    position: "VP of Human Resources",
    company: "GlobalCorp Industries",
    quote: "The quality of candidates improved significantly. We can now reach talent globally and make better hiring decisions.",
    avatar: "MR",
    rating: 5,
    industry: "Manufacturing"
  },
  {
    name: "Emily Johnson",
    position: "Recruitment Director",
    company: "HealthFirst Medical",
    quote: "The recorded interviews feature saved us countless hours while maintaining the personal touch in our hiring process.",
    avatar: "EJ",
    rating: 5,
    industry: "Healthcare"
  }
];

const team = [
  {
    name: "David Kumar",
    role: "Video Technology Lead",
    expertise: "Video Streaming & Interview Platforms",
    image: "DK",
    experience: "12+ years",
    projects: "200+"
  },
  {
    name: "Lisa Zhang",
    role: "AI & Analytics Specialist",
    expertise: "Machine Learning & Candidate Assessment",
    image: "LZ",
    experience: "8+ years",
    projects: "150+"
  },
  {
    name: "James Wilson",
    role: "Customer Success Manager",
    expertise: "Implementation & User Training",
    image: "JW",
    experience: "10+ years",
    projects: "300+"
  }
];

const interviewFeatures = [
  { name: "Live Video Interviews", percentage: 35, color: "bg-blue-500" },
  { name: "Recorded Assessments", percentage: 28, color: "bg-purple-500" },
  { name: "Technical Evaluations", percentage: 20, color: "bg-green-500" },
  { name: "AI Analysis", percentage: 12, color: "bg-orange-500" },
  { name: "Analytics & Reporting", percentage: 5, color: "bg-gray-500" }
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

const VideoInterviewingPage = () => {
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
            Smart{" "}
            <motion.span 
              className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              Video Interviews
            </motion.span>
          </motion.h1>
          
          <motion.p 
            className="mb-8 text-xl leading-relaxed text-blue-100 md:text-2xl max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Transform your hiring process with AI-powered video interviewing solutions. 
            Connect with top talent globally, streamline evaluations, and make data-driven hiring decisions.
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
              Start Interviewing
              <ArrowRight className="w-5 h-5 ml-2" />
            </motion.button>
            <motion.button
              className="px-8 py-4 text-lg font-semibold text-white border-2 border-white rounded-xl hover:bg-white hover:text-blue-900 transition-all duration-300 flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
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

      {/* Interview Process */}
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
              Streamlined Interview Process
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              From setup to hiring decision - our comprehensive video interviewing platform guides you through every step
            </p>
          </motion.div>

          <div className="relative">
            {/* Process Steps */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
              {interviewProcess.map((process, idx) => {
                const Icon = process.icon;
                return (
                  <motion.div
                    key={idx}
                    className="relative text-center"
                    variants={itemVariants}
                    whileHover={cardHoverVariants.hover}
                  >
                    {/* Connection Line */}
                    {idx < interviewProcess.length - 1 && (
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
              Complete Video Interview Solutions
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              Comprehensive video interviewing tools designed to enhance your recruitment process and improve candidate experience
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

      {/* Interview Features */}
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
                Platform Feature Usage
              </h2>
              <p className="mb-8 text-xl text-gray-600 leading-relaxed">
                Our comprehensive video interviewing platform covers all aspects of modern recruitment, 
                from live interviews to AI-powered candidate analysis and detailed reporting.
              </p>

              <div className="space-y-4">
                {interviewFeatures.map((feature, idx) => (
                  <motion.div
                    key={idx}
                    className="flex items-center"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                  >
                    <div className="w-40 text-sm font-medium text-gray-700">
                      {feature.name}
                    </div>
                    <div className="flex-1 mx-4 bg-gray-200 rounded-full h-2">
                      <motion.div
                        className={`h-full rounded-full ${feature.color}`}
                        initial={{ width: "0%" }}
                        whileInView={{ width: `${feature.percentage}%` }}
                        transition={{ duration: 1, delay: idx * 0.1 }}
                      />
                    </div>
                    <div className="w-12 text-sm font-bold text-gray-800">
                      {feature.percentage}%
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
                    <Video className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                    <div className="text-2xl font-bold text-gray-900">10K+</div>
                    <div className="text-sm text-gray-600">Interviews</div>
                  </motion.div>
                  <motion.div 
                    className="p-6 bg-white rounded-xl shadow-md text-center"
                    whileHover={{ scale: 1.05, rotate: -2 }}
                  >
                    <Users className="w-8 h-8 mx-auto mb-3 text-purple-600" />
                    <div className="text-2xl font-bold text-gray-900">50K+</div>
                    <div className="text-sm text-gray-600">Candidates</div>
                  </motion.div>
                  <motion.div 
                    className="p-6 bg-white rounded-xl shadow-md text-center"
                    whileHover={{ scale: 1.05, rotate: 2 }}
                  >
                    <Brain className="w-8 h-8 mx-auto mb-3 text-green-600" />
                    <div className="text-2xl font-bold text-gray-900">95%</div>
                    <div className="text-sm text-gray-600">AI Accuracy</div>
                  </motion.div>
                  <motion.div 
                    className="p-6 bg-white rounded-xl shadow-md text-center"
                    whileHover={{ scale: 1.05, rotate: -2 }}
                  >
                    <Timer className="w-8 h-8 mx-auto mb-3 text-orange-600" />
                    <div className="text-2xl font-bold text-gray-900">3x</div>
                    <div className="text-sm text-gray-600">Faster Hiring</div>
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
              Meet Our Video Interview Specialists
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-300">
              Expert team dedicated to revolutionizing your hiring process with cutting-edge video interview technology
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
              See how companies worldwide have transformed their hiring with our video interviewing solutions
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

export default VideoInterviewingPage;
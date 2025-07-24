import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  Users, 
  Zap, 
  Search, 
  Filter, 
  BarChart3, 
  MessageSquare, 
  FileText, 
  Shield, 
  Target, 
  Rocket,
  Star,
  TrendingUp,
  Globe,
  UserCheck
} from 'lucide-react';
import React, { useRef } from 'react';

const features = [
  {
    title: "Smart Resume Parsing",
    description: "AI-powered resume parsing that extracts key information automatically, saving recruiters hours of manual work.",
    icon: FileText,
    color: "from-blue-500 to-blue-600",
    stats: "99.2% accuracy"
  },
  {
    title: "Advanced Candidate Search",
    description: "Powerful search and filtering capabilities to find the perfect candidate from your talent pool instantly.",
    icon: Search,
    color: "from-green-500 to-green-600",
    stats: "10x faster searches"
  },
  {
    title: "Automated Workflow",
    description: "Streamline your hiring process with automated email sequences, interview scheduling, and status updates.",
    icon: Zap,
    color: "from-purple-500 to-purple-600",
    stats: "70% time saved"
  },
  {
    title: "Real-time Analytics",
    description: "Comprehensive dashboards and reports to track hiring metrics and optimize your recruitment strategy.",
    icon: BarChart3,
    color: "from-orange-500 to-red-500",
    stats: "50+ metrics tracked"
  },
  {
    title: "Collaborative Hiring",
    description: "Enable seamless collaboration between hiring managers, HR teams, and stakeholders with shared workspaces.",
    icon: Users,
    color: "from-teal-500 to-teal-600",
    stats: "Unlimited collaborators"
  },
  {
    title: "Compliance & Security",
    description: "Built-in compliance tools and enterprise-grade security to protect sensitive candidate information.",
    icon: Shield,
    color: "from-indigo-500 to-indigo-600",
    stats: "GDPR compliant"
  }
];

const benefits = [
  {
    title: "Reduce Time-to-Hire",
    description: "Cut down hiring time by up to 70% with automated processes and intelligent candidate matching.",
    icon: Clock,
    metric: "70%",
    label: "faster hiring"
  },
  {
    title: "Improve Candidate Quality",
    description: "Advanced screening and ranking algorithms ensure you connect with the most qualified candidates.",
    icon: Target,
    metric: "85%",
    label: "better matches"
  },
  {
    title: "Enhance Candidate Experience",
    description: "Provide a smooth, professional application process that reflects well on your employer brand.",
    icon: UserCheck,
    metric: "95%",
    label: "satisfaction rate"
  },
  {
    title: "Scale Your Hiring",
    description: "Handle high-volume recruiting efficiently without compromising on quality or candidate experience.",
    icon: TrendingUp,
    metric: "10x",
    label: "more capacity"
  }
];

const testimonials = [
  {
    company: "TechCorp Solutions",
    role: "VP of Human Resources",
    name: "Sarah Johnson",
    quote: "VirtuosoU's ATS transformed our hiring process. We reduced time-to-hire by 65% and improved candidate quality significantly.",
    avatar: "SJ",
    rating: 5,
    logo: "🚀"
  },
  {
    company: "Global Innovations Inc",
    role: "Talent Acquisition Manager",
    name: "Michael Chen",
    quote: "The AI-powered features and intuitive interface make this the best ATS we've ever used. Our team productivity has doubled.",
    avatar: "MC",
    rating: 5,
    logo: "🌟"
  },
  {
    company: "StartupHub",
    role: "Founder & CEO",
    name: "Emily Rodriguez",
    quote: "As a growing startup, we needed an ATS that could scale with us. VirtuosoU delivered exactly that and more.",
    avatar: "ER",
    rating: 5,
    logo: "⚡"
  }
];

const pricingPlans = [
  {
    name: "Starter",
    price: "$49",
    period: "per month",
    description: "Perfect for small teams and startups",
    features: [
      "Up to 100 candidates",
      "5 active job postings",
      "Basic reporting",
      "Email support",
      "Standard integrations"
    ],
    color: "from-blue-500 to-blue-600",
    popular: false
  },
  {
    name: "Professional",
    price: "$99",
    period: "per month",
    description: "Ideal for growing companies",
    features: [
      "Up to 1,000 candidates",
      "25 active job postings",
      "Advanced analytics",
      "Priority support",
      "Custom integrations",
      "Team collaboration tools"
    ],
    color: "from-purple-500 to-purple-600",
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "pricing",
    description: "For large organizations",
    features: [
      "Unlimited candidates",
      "Unlimited job postings",
      "Custom dashboards",
      "Dedicated support",
      "API access",
      "Advanced security",
      "Custom branding"
    ],
    color: "from-orange-500 to-red-500",
    popular: false
  }
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
      <div className="mb-2 text-4xl font-bold text-white">{count}{suffix}</div>
      <div className="text-blue-100">{label}</div>
    </motion.div>
  );
};

const ATSPage = () => {
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
        className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900"
        style={{ y: backgroundY }}
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute w-96 h-96 bg-blue-400 rounded-full opacity-10 -top-48 -left-48"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          />
          <motion.div 
            className="absolute w-80 h-80 bg-purple-400 rounded-full opacity-10 -bottom-40 -right-40"
            animate={{ 
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0]
            }}
            transition={{ 
              duration: 25, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          />
        </div>
        
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
            Applicant{" "}
            <motion.span 
              className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              Tracking
            </motion.span>
            <br />
            System
          </motion.h1>
          
          <motion.p 
            className="mb-8 text-xl leading-relaxed text-blue-100 md:text-2xl max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Revolutionize your hiring process with AI-powered recruitment tools. 
            Find, engage, and hire top talent faster than ever before.
          </motion.p>

          <motion.div 
            className="flex flex-wrap justify-center gap-4 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.button
              className="px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </motion.button>
            <motion.button
              className="px-8 py-4 text-lg font-semibold text-white border-2 border-white rounded-xl hover:bg-white hover:text-blue-900 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Watch Demo
            </motion.button>
          </motion.div>

          <motion.div 
            className="grid grid-cols-2 gap-8 md:grid-cols-4 mt-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <AnimatedCounter target={50000} label="Candidates Hired" suffix="+" />
            <AnimatedCounter target={2500} label="Companies Trust Us" suffix="+" />
            <AnimatedCounter target={70} label="Time Saved" suffix="%" />
            <AnimatedCounter target={99} label="Uptime Guarantee" suffix="%" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Features Section */}
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
              Powerful Features for Modern Recruiting
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              Everything you need to streamline your hiring process and find the perfect candidates
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
          >
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  className="relative p-8 bg-white border border-gray-100 shadow-lg group rounded-2xl overflow-hidden"
                  variants={itemVariants}
                  whileHover={cardHoverVariants.hover}
                >
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${feature.color}`}></div>
                  
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="mb-4 text-xl font-bold text-gray-900">{feature.title}</h3>
                  <p className="mb-4 text-gray-600 leading-relaxed">{feature.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r ${feature.color}`}>
                      {feature.stats}
                    </span>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* Benefits Section */}
      <motion.section 
        className="py-20 bg-gradient-to-br from-blue-50 to-purple-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="px-4 mx-auto max-w-7xl">
          <motion.div className="mb-16 text-center" variants={itemVariants}>
            <h2 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
              Transform Your Hiring Process
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              See measurable improvements in efficiency, quality, and candidate satisfaction
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 gap-8 lg:grid-cols-2"
            variants={containerVariants}
          >
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={idx}
                  className="flex items-start p-8 bg-white shadow-lg rounded-2xl"
                  variants={itemVariants}
                  whileHover={cardHoverVariants.hover}
                >
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-6">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-3 text-xl font-bold text-gray-900">{benefit.title}</h3>
                    <p className="mb-4 text-gray-600 leading-relaxed">{benefit.description}</p>
                    <div className="flex items-center">
                      <span className="text-3xl font-bold text-blue-600 mr-2">{benefit.metric}</span>
                      <span className="text-gray-500">{benefit.label}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
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
              Trusted by Leading Companies
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              See what our customers say about transforming their hiring process
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 gap-8 lg:grid-cols-3"
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
                  <div className="text-4xl mr-4">{testimonial.logo}</div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">{testimonial.company}</h4>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                
                <blockquote className="mb-6 text-lg italic leading-relaxed text-gray-700">
                  "{testimonial.quote}"
                </blockquote>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-12 h-12 mr-3 text-sm font-bold text-white bg-blue-600 rounded-full">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <div className="flex">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Pricing Section */}
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
              Choose Your Plan
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-300">
              Flexible pricing options that scale with your hiring needs
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 gap-8 lg:grid-cols-3"
            variants={containerVariants}
          >
            {pricingPlans.map((plan, idx) => (
              <motion.div
                key={idx}
                className={`relative p-8 bg-white rounded-2xl shadow-2xl ${plan.popular ? 'ring-4 ring-purple-500' : ''}`}
                variants={itemVariants}
                whileHover={cardHoverVariants.hover}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className={`w-16 h-16 bg-gradient-to-r ${plan.color} rounded-xl flex items-center justify-center mb-6 mx-auto`}>
                  <Rocket className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="mb-2 text-2xl font-bold text-center text-gray-900">{plan.name}</h3>
                <p className="mb-6 text-center text-gray-600">{plan.description}</p>
                
                <div className="mb-8 text-center">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600">/{plan.period}</span>
                </div>
                
                <ul className="mb-8 space-y-3">
                  {plan.features.map((feature, featureIdx) => (
                    <li key={featureIdx} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <motion.button
                  className={`w-full px-6 py-3 font-semibold text-white bg-gradient-to-r ${plan.color} rounded-xl hover:opacity-90 transition-opacity`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get Started
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="py-20 bg-gradient-to-r from-blue-600 to-purple-600"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
        variants={containerVariants}
      >
        <div className="max-w-4xl px-4 mx-auto text-center">
          <motion.div variants={itemVariants}>
            <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
              Ready to Transform Your Hiring?
            </h2>
            <p className="mb-8 text-xl text-blue-100">
              Join thousands of companies that have revolutionized their recruitment process
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.button
                className="px-8 py-4 text-lg font-semibold text-blue-600 bg-white rounded-xl hover:bg-gray-100 transition-colors flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </motion.button>
              <motion.button
                className="px-8 py-4 text-lg font-semibold text-white border-2 border-white rounded-xl hover:bg-white hover:text-blue-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Schedule Demo
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default ATSPage;
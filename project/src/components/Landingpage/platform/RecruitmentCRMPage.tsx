import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { 
  ArrowRight, 
  Users, 
  Search, 
  BarChart3, 
  Calendar, 
  MessageSquare, 
  FileText, 
  Zap, 
  Shield, 
  Globe, 
  Target, 
  Award,
  CheckCircle,
  Star,
  TrendingUp,
  Clock,
  Database,
  Brain,
  Workflow,
  Mail,
  Phone
} from 'lucide-react';
import React, { useRef } from 'react';

const features = [
  {
    title: "Candidate Management",
    icon: Users,
    description: "Centralize all candidate information, track interactions, and manage talent pools efficiently with advanced search and filtering capabilities.",
    color: "from-blue-500 to-blue-600",
    benefits: ["360° candidate profiles", "Resume parsing", "Skill matching", "Communication history"]
  },
  {
    title: "Advanced Search & Filtering",
    icon: Search,
    description: "Find the perfect candidates instantly with AI-powered search, boolean queries, and intelligent matching algorithms.",
    color: "from-green-500 to-green-600",
    benefits: ["Boolean search", "AI matching", "Saved searches", "Smart recommendations"]
  },
  {
    title: "Pipeline Management",
    icon: Workflow,
    description: "Visualize and manage your recruitment pipeline with customizable stages, automated workflows, and progress tracking.",
    color: "from-purple-500 to-purple-600",
    benefits: ["Custom pipelines", "Drag & drop", "Automated actions", "Stage analytics"]
  },
  {
    title: "Analytics & Reporting",
    icon: BarChart3,
    description: "Make data-driven decisions with comprehensive analytics, custom reports, and real-time insights into your recruitment performance.",
    color: "from-orange-500 to-red-500",
    benefits: ["Custom dashboards", "ROI tracking", "Performance metrics", "Predictive analytics"]
  },
  {
    title: "Interview Scheduling",
    icon: Calendar,
    description: "Streamline interview coordination with automated scheduling, calendar integration, and candidate self-booking options.",
    color: "from-teal-500 to-teal-600",
    benefits: ["Auto-scheduling", "Calendar sync", "Time zone handling", "Reminder automation"]
  },
  {
    title: "Communication Hub",
    icon: MessageSquare,
    description: "Centralize all candidate communications with email integration, templates, and automated messaging workflows.",
    color: "from-pink-500 to-pink-600",
    benefits: ["Email templates", "SMS integration", "Auto-responses", "Communication tracking"]
  }
];

const benefits = [
  {
    title: "Reduce Time-to-Hire",
    description: "Streamline your recruitment process and fill positions 50% faster",
    icon: Clock,
    stat: "50%",
    statLabel: "Faster Hiring"
  },
  {
    title: "Improve Candidate Quality",
    description: "Advanced matching algorithms ensure better candidate-role fit",
    icon: Target,
    stat: "85%",
    statLabel: "Match Accuracy"
  },
  {
    title: "Enhance Team Collaboration",
    description: "Centralized platform improves recruiter and hiring manager alignment",
    icon: Users,
    stat: "3x",
    statLabel: "Better Collaboration"
  },
  {
    title: "Data-Driven Insights",
    description: "Make informed decisions with comprehensive recruitment analytics",
    icon: TrendingUp,
    stat: "100+",
    statLabel: "Key Metrics"
  }
];

const testimonials = [
  {
    name: "Sarah Johnson",
    position: "Head of Talent Acquisition",
    company: "TechCorp Inc.",
    quote: "Our recruitment efficiency improved by 60% within the first month. The AI-powered matching is incredible!",
    avatar: "SJ",
    rating: 5,
    metrics: { timeToHire: "40% faster", candidateQuality: "25% better" }
  },
  {
    name: "Michael Chen",
    position: "Senior Recruiter",
    company: "Growth Solutions",
    quote: "The best recruitment tool we've ever used. Pipeline management and analytics are game-changers.",
    avatar: "MC",
    rating: 5,
    metrics: { productivity: "50% increase", satisfaction: "95% team satisfaction" }
  },
  {
    name: "Emily Rodriguez",
    position: "Recruitment Manager",
    company: "Innovation Labs",
    quote: "Seamless integration with our existing tools. The automated workflows saved us countless hours.",
    avatar: "ER",
    rating: 5,
    metrics: { timesSaved: "20 hrs/week", efficiency: "70% improvement" }
  }
];

const pricingPlans = [
  {
    name: "Starter",
    price: "$49",
    period: "per user/month",
    description: "Perfect for small teams getting started",
    features: [
      "Up to 100 candidates",
      "Basic pipeline management",
      "Email integration",
      "Standard reporting",
      "Mobile app access"
    ],
    highlighted: false
  },
  {
    name: "Professional",
    price: "$99",
    period: "per user/month",
    description: "Ideal for growing recruitment teams",
    features: [
      "Unlimited candidates",
      "Advanced search & AI matching",
      "Custom pipelines",
      "Advanced analytics",
      "Interview scheduling",
      "API integrations",
      "Priority support"
    ],
    highlighted: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    description: "Tailored solutions for large organizations",
    features: [
      "Everything in Professional",
      "Custom integrations",
      "White-label options",
      "Advanced security",
      "Dedicated support",
      "Training & onboarding",
      "SLA guarantee"
    ],
    highlighted: false
  }
];

const integrations = [
  { name: "LinkedIn", logo: "LI", color: "bg-blue-600" },
  { name: "Indeed", logo: "IN", color: "bg-green-600" },
  { name: "Slack", logo: "SL", color: "bg-purple-600" },
  { name: "Microsoft Teams", logo: "MT", color: "bg-blue-500" },
  { name: "Google Calendar", logo: "GC", color: "bg-red-500" },
  { name: "Zoom", logo: "ZM", color: "bg-blue-400" },
  { name: "Salesforce", logo: "SF", color: "bg-cyan-500" },
  { name: "HubSpot", logo: "HS", color: "bg-orange-500" }
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

const RecruitmentCRMPage = () => {
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
      {/* Hero Section */}
      <motion.section 
        className="relative flex items-center justify-center min-h-screen pt-0 mt-0 bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900"
        style={{ y: backgroundY }}
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>
        
        <motion.div 
          className="relative z-10 max-w-6xl px-4 mx-auto text-center"
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
            Recruitment{" "}
            <motion.span 
              className="text-blue-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              CRM
            </motion.span>
          </motion.h1>
          
          <motion.p 
            className="mb-8 text-xl leading-relaxed text-blue-100 md:text-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Transform your hiring process with AI-powered recruitment management. 
            Find, engage, and hire top talent faster than ever before.
          </motion.p>

          <motion.div 
            className="flex flex-wrap justify-center gap-4 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.button
              className="px-8 py-4 text-lg font-semibold text-white transition-all duration-300 bg-blue-600 rounded-xl hover:bg-blue-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Free Trial
              <ArrowRight className="inline w-5 h-5 ml-2" />
            </motion.button>
            <motion.button
              className="px-8 py-4 text-lg font-semibold text-blue-100 transition-all duration-300 border-2 border-blue-300 rounded-xl hover:bg-blue-100 hover:text-blue-900"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Watch Demo
            </motion.button>
          </motion.div>

          <motion.div 
            className="flex flex-wrap justify-center gap-8 mt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <AnimatedCounter target={10000} label="Active Users" suffix="+" />
            <AnimatedCounter target={500000} label="Candidates Managed" suffix="+" />
            <AnimatedCounter target={50} label="Time Saved" suffix="%" />
            <AnimatedCounter target={99} label="Uptime" suffix="%" />
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

      {/* Key Features */}
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
              Powerful Features for Modern Recruitment
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              Everything you need to streamline your hiring process and build exceptional teams
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
                  className="relative p-8 bg-white border border-gray-100 shadow-lg group rounded-2xl"
                  variants={itemVariants}
                  whileHover={cardHoverVariants.hover}
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="mb-4 text-xl font-bold text-gray-900">{feature.title}</h3>
                  <p className="mb-6 text-gray-600">{feature.description}</p>
                  <div className="space-y-2">
                    {feature.benefits.map((benefit, benefitIdx) => (
                      <div key={benefitIdx} className="flex items-center text-sm text-gray-500">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        {benefit}
                      </div>
                    ))}
                  </div>
                  <div className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${feature.color} rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
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
              Measurable Business Impact
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              See real results with our proven recruitment CRM solution
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
            variants={containerVariants}
          >
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={idx}
                  className="p-8 text-center bg-white shadow-lg rounded-2xl"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                >
                  <div className="w-16 h-16 mx-auto mb-6 bg-blue-600 rounded-xl flex items-center justify-center">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="mb-4 text-3xl font-bold text-blue-600">{benefit.stat}</div>
                  <div className="mb-2 text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    {benefit.statLabel}
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-gray-900">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
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
              Trusted by Industry Leaders
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              See how top companies are transforming their recruitment with our CRM
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
                  <div className="flex items-center justify-center w-16 h-16 mr-4 text-lg font-bold text-white bg-blue-600 rounded-full">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600">{testimonial.position}</p>
                    <p className="text-sm text-gray-500">{testimonial.company}</p>
                    <div className="flex mt-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <blockquote className="mb-6 text-lg italic leading-relaxed text-gray-700">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex gap-4 text-sm">
                  <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                    {Object.entries(testimonial.metrics)[0][1]}
                  </div>
                  <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full">
                    {Object.entries(testimonial.metrics)[1][1]}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Integrations */}
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
              Seamless Integrations
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-300">
              Connect with your favorite tools and platforms for a unified workflow
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-8"
            variants={containerVariants}
          >
            {integrations.map((integration, idx) => (
              <motion.div
                key={idx}
                className="flex flex-col items-center p-6 bg-gray-800 rounded-xl group hover:bg-gray-700 transition-colors duration-300"
                variants={itemVariants}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              >
                <div className={`w-12 h-12 ${integration.color} rounded-lg flex items-center justify-center mb-3 text-white font-bold text-sm group-hover:scale-110 transition-transform duration-300`}>
                  {integration.logo}
                </div>
                <span className="text-sm text-gray-300 text-center">{integration.name}</span>
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
              Ready to Transform Your Recruitment?
            </h2>
            <p className="mb-8 text-xl text-blue-100">
              Join thousands of companies already using our Recruitment CRM to hire better, faster.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.button
                className="px-8 py-4 text-lg font-semibold text-blue-600 transition-all duration-300 bg-white rounded-xl hover:bg-gray-100"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Free Trial
                <ArrowRight className="inline w-5 h-5 ml-2" />
              </motion.button>
              <motion.button
                className="px-8 py-4 text-lg font-semibold text-white transition-all duration-300 border-2 border-white rounded-xl hover:bg-white hover:text-blue-600"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Phone className="inline w-5 h-5 mr-2" />
                Schedule Demo
              </motion.button>
            </div>
            <p className="mt-6 text-sm text-blue-200">
              14-day free trial • No credit card required • Cancel anytime
            </p>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default RecruitmentCRMPage;
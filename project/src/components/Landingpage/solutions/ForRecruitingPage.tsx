
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { 
  ArrowRight, 
  Award, 
  Search, 
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
  Building
} from 'lucide-react';
import React, { useRef } from 'react';

const recruitingProcess = [
  {
    step: 1,
    title: "Discovery & Strategy",
    description: "We dive deep into understanding your company culture, role requirements, and ideal candidate profile.",
    icon: Search,
    color: "from-blue-500 to-blue-600",
    duration: "1-2 Days"
  },
  {
    step: 2,
    title: "Talent Sourcing",
    description: "Our expert recruiters leverage advanced tools and networks to identify top-tier candidates.",
    icon: Users,
    color: "from-purple-500 to-purple-600",
    duration: "3-5 Days"
  },
  {
    step: 3,
    title: "Screening & Assessment",
    description: "Comprehensive evaluation including technical skills, cultural fit, and behavioral assessments.",
    icon: Target,
    color: "from-green-500 to-green-600",
    duration: "2-3 Days"
  },
  {
    step: 4,
    title: "Interview Coordination",
    description: "Seamless scheduling and coordination of interviews with detailed candidate presentations.",
    icon: Calendar,
    color: "from-orange-500 to-orange-600",
    duration: "1-2 Days"
  },
  {
    step: 5,
    title: "Offer & Onboarding",
    description: "Expert negotiation support and smooth onboarding transition for successful placements.",
    icon: CheckCircle,
    color: "from-teal-500 to-teal-600",
    duration: "2-3 Days"
  }
];

const services = [
  {
    title: "Executive Search",
    description: "C-level and senior leadership recruitment with guaranteed results and comprehensive market insights.",
    icon: Building,
    features: ["90-day guarantee", "Market mapping", "Executive coaching"],
    price: "Premium"
  },
  {
    title: "Technical Recruiting",
    description: "Specialized recruitment for engineering, data science, and technology roles across all experience levels.",
    icon: Zap,
    features: ["Technical assessments", "Code reviews", "Skills validation"],
    price: "Standard"
  },
  {
    title: "Volume Hiring",
    description: "Scalable solutions for high-volume recruitment needs with streamlined processes and dedicated teams.",
    icon: TrendingUp,
    features: ["Dedicated teams", "Process automation", "Quality assurance"],
    price: "Volume"
  },
  {
    title: "Contract Staffing",
    description: "Flexible staffing solutions for project-based work and temporary assignments with vetted professionals.",
    icon: Clock,
    features: ["Flexible terms", "Quick deployment", "Backup resources"],
    price: "Flexible"
  }
];

const stats = [
  { number: 2500, label: "Successful Placements", suffix: "+" },
  { number: 95, label: "Client Satisfaction", suffix: "%" },
  { number: 30, label: "Average Days to Hire", suffix: "" },
  { number: 85, label: "Candidate Retention Rate", suffix: "%" }
];

const testimonials = [
  {
    name: "Sarah Chen",
    position: "VP of Engineering",
    company: "TechCorp Inc.",
    quote: "VirtuosoU transformed our hiring process. They delivered exceptional candidates faster than we ever imagined possible.",
    avatar: "SC",
    rating: 5,
    industry: "Technology"
  },
  {
    name: "Michael Rodriguez",
    position: "Chief People Officer",
    company: "InnovateLabs",
    quote: "The quality of candidates and the speed of delivery exceeded our expectations. True recruitment partnership.",
    avatar: "MR",
    rating: 5,
    industry: "Healthcare"
  },
  {
    name: "Emily Watson",
    position: "Talent Director",
    company: "GrowthCo",
    quote: "Their deep understanding of our culture and needs resulted in perfect-fit hires every single time.",
    avatar: "EW",
    rating: 5,
    industry: "Finance"
  }
];

const team = [
  {
    name: "Alex Thompson",
    role: "Senior Recruitment Director",
    expertise: "Executive Search & Leadership Roles",
    image: "AT",
    experience: "12+ years",
    placements: "500+"
  },
  {
    name: "Maria Silva",
    role: "Technical Recruiting Lead",
    expertise: "Engineering & Data Science",
    image: "MS",
    experience: "8+ years",
    placements: "750+"
  },
  {
    name: "David Kim",
    role: "Client Success Manager",
    expertise: "Relationship Management & Strategy",
    image: "DK",
    experience: "10+ years",
    placements: "400+"
  }
];

const industries = [
  { name: "Technology", percentage: 35, color: "bg-blue-500" },
  { name: "Healthcare", percentage: 25, color: "bg-green-500" },
  { name: "Finance", percentage: 20, color: "bg-purple-500" },
  { name: "Manufacturing", percentage: 12, color: "bg-orange-500" },
  { name: "Others", percentage: 8, color: "bg-gray-500" }
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

const RecruitingPage = () => {
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
            Elite{" "}
            <motion.span 
              className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              Recruiting
            </motion.span>
          </motion.h1>
          
          <motion.p 
            className="mb-8 text-xl leading-relaxed text-blue-100 md:text-2xl max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Transform your hiring process with data-driven recruitment strategies, 
            cutting-edge technology, and unparalleled expertise in talent acquisition.
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
              Start Recruiting
              <ArrowRight className="w-5 h-5 ml-2" />
            </motion.button>
            <motion.button
              className="px-8 py-4 text-lg font-semibold text-white border-2 border-white rounded-xl hover:bg-white hover:text-blue-900 transition-all duration-300 flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Phone className="w-5 h-5 mr-2" />
              Schedule Call
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

      {/* Recruiting Process */}
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
              Our Recruiting Process
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              A systematic approach to finding and securing top talent for your organization
            </p>
          </motion.div>

          <div className="relative">
            {/* Process Steps */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
              {recruitingProcess.map((process, idx) => {
                const Icon = process.icon;
                return (
                  <motion.div
                    key={idx}
                    className="relative text-center"
                    variants={itemVariants}
                    whileHover={cardHoverVariants.hover}
                  >
                    {/* Connection Line */}
                    {idx < recruitingProcess.length - 1 && (
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
              Our Recruiting Services
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              Comprehensive recruitment solutions tailored to your specific needs and industry requirements
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

      {/* Industry Expertise */}
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
                Industry Expertise
              </h2>
              <p className="mb-8 text-xl text-gray-600 leading-relaxed">
                Our deep industry knowledge and specialized expertise across multiple sectors 
                ensures we understand your unique challenges and requirements.
              </p>

              <div className="space-y-4">
                {industries.map((industry, idx) => (
                  <motion.div
                    key={idx}
                    className="flex items-center"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                  >
                    <div className="w-32 text-sm font-medium text-gray-700">
                      {industry.name}
                    </div>
                    <div className="flex-1 mx-4 bg-gray-200 rounded-full h-2">
                      <motion.div
                        className={`h-full rounded-full ${industry.color}`}
                        initial={{ width: "0%" }}
                        whileInView={{ width: `${industry.percentage}%` }}
                        transition={{ duration: 1, delay: idx * 0.1 }}
                      />
                    </div>
                    <div className="w-12 text-sm font-bold text-gray-800">
                      {industry.percentage}%
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
                    <div className="text-2xl font-bold text-gray-900">50+</div>
                    <div className="text-sm text-gray-600">Countries</div>
                  </motion.div>
                  <motion.div 
                    className="p-6 bg-white rounded-xl shadow-md text-center"
                    whileHover={{ scale: 1.05, rotate: -2 }}
                  >
                    <Building className="w-8 h-8 mx-auto mb-3 text-purple-600" />
                    <div className="text-2xl font-bold text-gray-900">1000+</div>
                    <div className="text-sm text-gray-600">Companies</div>
                  </motion.div>
                  <motion.div 
                    className="p-6 bg-white rounded-xl shadow-md text-center"
                    whileHover={{ scale: 1.05, rotate: 2 }}
                  >
                    <UserCheck className="w-8 h-8 mx-auto mb-3 text-green-600" />
                    <div className="text-2xl font-bold text-gray-900">10K+</div>
                    <div className="text-sm text-gray-600">Placements</div>
                  </motion.div>
                  <motion.div 
                    className="p-6 bg-white rounded-xl shadow-md text-center"
                    whileHover={{ scale: 1.05, rotate: -2 }}
                  >
                    <BarChart3 className="w-8 h-8 mx-auto mb-3 text-orange-600" />
                    <div className="text-2xl font-bold text-gray-900">98%</div>
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
  className="py-20 mb-20" // removed bg-gray-900 and added mb-20
  initial="hidden"
  whileInView="visible"
  viewport={{ once: false, margin: "-100px" }}
  variants={containerVariants}
>
  <div className="px-4 mx-auto max-w-7xl">
    <motion.div className="mb-16 text-center" variants={itemVariants}>
      <h2 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
        Meet Our Expert Team
      </h2>
      <p className="max-w-3xl mx-auto text-xl text-gray-700">
        Industry veterans with decades of combined experience in talent acquisition and recruitment
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
                <div className="text-2xl font-bold text-gray-900">{member.placements}</div>
                <div className="text-sm text-gray-600">Placements</div>
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

    
     
    </div>
  );
};

export default RecruitingPage;
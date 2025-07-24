import { motion, useScroll, useTransform } from 'framer-motion';
import {
  TrendingUp,
  Users,
  Clock,
  Award,
  Target,
  Building,
  ArrowRight,
  CheckCircle,
  BarChart3,
  Zap,
  Globe,
  Shield,
  Star,
  Download,
  ExternalLink,
  Calendar,
  MapPin,
  Briefcase,
  UserCheck,
  Timer,
  DollarSign
} from 'lucide-react';
import React, { useRef, useState } from 'react';

const featuredCaseStudies = [
  {
    id: 1,
    title: 'TechCorp Reduces Hiring Time by 75% with AI-Powered Screening',
    company: 'TechCorp Global',
    industry: 'Technology',
    size: '5,000+ employees',
    location: 'San Francisco, CA',
    challenge: 'Manual screening process was taking 6 weeks per hire, causing delays in project delivery and losing top candidates to competitors.',
    solution: 'Implemented VirtuosoU\'s AI-powered candidate screening and automated interview scheduling system.',
    results: {
      timeReduction: '75%',
      costSavings: '$2.3M',
      qualityIncrease: '85%',
      candidateSatisfaction: '92%'
    },
    metrics: [
      { label: 'Hiring Time', before: '6 weeks', after: '1.5 weeks', improvement: '75%' },
      { label: 'Cost per Hire', before: '$4,500', after: '$1,200', improvement: '73%' },
      { label: 'Quality Score', before: '6.2/10', after: '8.5/10', improvement: '37%' },
      { label: 'Candidate NPS', before: '45', after: '82', improvement: '82%' }
    ],
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400&fit=crop',
    logo: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=100&h=100&fit=crop',
    testimonial: {
      quote: 'VirtuosoU transformed our entire hiring process. We\'re now able to identify and hire top talent faster than ever before.',
      author: 'Sarah Johnson',
      role: 'VP of Talent Acquisition',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop'
    },
    tags: ['AI Screening', 'Process Automation', 'Time Reduction'],
    featured: true,
    downloadUrl: '#'
  },
  {
    id: 2,
    title: 'Global Bank Achieves 90% Diversity Hiring Goals Through Data-Driven Recruitment',
    company: 'Premier Financial Group',
    industry: 'Financial Services',
    size: '15,000+ employees',
    location: 'New York, NY',
    challenge: 'Struggled to meet diversity hiring targets and lacked visibility into recruitment bias across different departments.',
    solution: 'Deployed VirtuosoU\'s diversity analytics dashboard and bias-detection algorithms in the hiring workflow.',
    results: {
      diversityIncrease: '90%',
      biasReduction: '68%',
      complianceScore: '98%',
      retentionImprovement: '45%'
    },
    metrics: [
      { label: 'Diversity Hires', before: '23%', after: '67%', improvement: '191%' },
      { label: 'Bias Incidents', before: '12/month', after: '2/month', improvement: '83%' },
      { label: 'Compliance Score', before: '72%', after: '98%', improvement: '36%' },
      { label: 'Employee Retention', before: '78%', after: '89%', improvement: '14%' }
    ],
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=400&fit=crop',
    logo: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=100&h=100&fit=crop',
    testimonial: {
      quote: 'The diversity insights provided by VirtuosoU helped us build the most inclusive workforce in our company\'s history.',
      author: 'Marcus Williams',
      role: 'Chief Diversity Officer',
      avatar: 'https://images.unsblash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop'
    },
    tags: ['Diversity & Inclusion', 'Analytics', 'Compliance'],
    featured: true,
    downloadUrl: '#'
  },
  {
    id: 3,
    title: 'Healthcare Network Scales Remote Hiring to 500+ Positions During Pandemic',
    company: 'MediCare Solutions',
    industry: 'Healthcare',
    size: '8,000+ employees',
    location: 'Chicago, IL',
    challenge: 'Needed to rapidly hire healthcare professionals remotely during COVID-19 while maintaining quality and compliance standards.',
    solution: 'Utilized VirtuosoU\'s virtual interview platform with integrated background checks and credential verification.',
    results: {
      hiresCompleted: '524',
      timeToHire: '8 days',
      virtualInterviews: '2,100+',
      complianceRate: '100%'
    },
    metrics: [
      { label: 'Positions Filled', before: '45/month', after: '175/month', improvement: '289%' },
      { label: 'Time to Hire', before: '28 days', after: '8 days', improvement: '71%' },
      { label: 'Interview Completion', before: '67%', after: '94%', improvement: '40%' },
      { label: 'Compliance Rate', before: '89%', after: '100%', improvement: '12%' }
    ],
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=400&fit=crop',
    logo: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100&h=100&fit=crop',
    testimonial: {
      quote: 'VirtuosoU enabled us to maintain our hiring standards while going completely virtual. It was a game-changer.',
      author: 'Dr. Lisa Chen',
      role: 'Director of Human Resources',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=60&h=60&fit=crop'
    },
    tags: ['Remote Hiring', 'Healthcare', 'Compliance'],
    featured: true,
    downloadUrl: '#'
  }
];

const additionalCaseStudies = [
  {
    id: 4,
    title: 'Retail Chain Improves Seasonal Hiring Efficiency by 200%',
    company: 'Fashion Forward Inc.',
    industry: 'Retail',
    size: '2,500+ employees',
    challenge: 'Seasonal hiring spikes overwhelmed HR team',
    solution: 'Automated bulk screening and interview scheduling',
    timeReduction: '65%',
    costSavings: '$800K',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=300&fit=crop',
    tags: ['Retail', 'Seasonal Hiring', 'Automation']
  },
  {
    id: 5,
    title: 'Manufacturing Giant Reduces Turnover by 40% with Better Matching',
    company: 'Industrial Solutions Ltd.',
    industry: 'Manufacturing',
    size: '12,000+ employees',
    challenge: 'High turnover rates in factory positions',
    solution: 'AI-powered job matching and cultural fit assessment',
    turnoverReduction: '40%',
    retentionImprovement: '55%',
    image: 'https://images.unsplash.com/photo-1565688534245-05d6b5be184a?w=600&h=300&fit=crop',
    tags: ['Manufacturing', 'Retention', 'Cultural Fit']
  },
  {
    id: 6,
    title: 'Startup Scales Team from 10 to 100 Employees in 6 Months',
    company: 'InnovateTech Solutions',
    industry: 'Technology Startup',
    size: '100+ employees',
    challenge: 'Rapid scaling without compromising quality',
    solution: 'Structured hiring pipeline with automated workflows',
    growthRate: '900%',
    qualityMaintained: '95%',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=300&fit=crop',
    tags: ['Startup', 'Scaling', 'Growth']
  }
];

const industries = [
  { name: 'Technology', count: 12, icon: <Zap className="w-5 h-5" /> },
  { name: 'Healthcare', count: 8, icon: <Shield className="w-5 h-5" /> },
  { name: 'Financial Services', count: 6, icon: <Building className="w-5 h-5" /> },
  { name: 'Manufacturing', count: 5, icon: <Target className="w-5 h-5" /> },
  { name: 'Retail', count: 4, icon: <Users className="w-5 h-5" /> },
  { name: 'Education', count: 3, icon: <Award className="w-5 h-5" /> }
];

const successMetrics = [
  { icon: <TrendingUp className="w-8 h-8" />, value: '68%', label: 'Average Time Reduction', color: 'text-green-600' },
  { icon: <DollarSign className="w-8 h-8" />, value: '$12M+', label: 'Total Cost Savings', color: 'text-blue-600' },
  { icon: <UserCheck className="w-8 h-8" />, value: '94%', label: 'Client Satisfaction', color: 'text-purple-600' },
  { icon: <Globe className="w-8 h-8" />, value: '45+', label: 'Countries Served', color: 'text-orange-600' }
];

const CaseStudiesPage = () => {
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedStudy, setSelectedStudy] = useState(null);

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={containerRef} className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.section 
        className="relative py-20 overflow-hidden bg-gradient-to-r from-indigo-900 via-blue-900 to-purple-900"
        style={{ y: backgroundY }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <motion.div 
          className="relative z-10 max-w-6xl px-4 mx-auto text-center text-white"
          style={{ y: textY }}
        >
          <motion.h1 
            className="mb-6 text-5xl font-bold md:text-6xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Success <span className="text-blue-300">Stories</span>
          </motion.h1>
          
          <motion.p 
            className="max-w-3xl mx-auto mb-8 text-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Discover how leading organizations transformed their recruitment processes 
            with VirtuosoU, achieving remarkable results and competitive advantages.
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-6 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm">
              <BarChart3 className="w-5 h-5" />
              <span>Proven Results</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm">
              <Award className="w-5 h-5" />
              <span>Industry Leaders</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm">
              <Globe className="w-5 h-5" />
              <span>Global Impact</span>
            </div>
          </motion.div>

          <motion.button
            className="px-8 py-4 text-lg font-bold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:shadow-xl hover:scale-105"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Case Studies
          </motion.button>
        </motion.div>
      </motion.section>

      {/* Success Metrics */}
      <section className="py-16 -mt-10">
        <div className="max-w-6xl px-4 mx-auto">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {successMetrics.map((metric, index) => (
              <motion.div
                key={index}
                className="p-6 text-center bg-white shadow-lg rounded-2xl"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true, amount: 0.3 }}
                whileHover={{ y: -5, scale: 1.05 }}
              >
                <div className={`flex justify-center mb-3 ${metric.color}`}>
                  {metric.icon}
                </div>
                <h4 className="mb-1 text-2xl font-bold text-gray-800">{metric.value}</h4>
                <p className="text-sm text-gray-600">{metric.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Filter */}
      <section className="py-8 bg-white">
        <div className="max-w-6xl px-4 mx-auto">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2 className="mb-4 text-3xl font-bold text-gray-800">Browse by Industry</h2>
            <p className="text-gray-600">See how VirtuosoU delivers results across different sectors</p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setSelectedIndustry('All')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                selectedIndustry === 'All'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Industries
            </button>
            {industries.map((industry) => (
              <button
                key={industry.name}
                onClick={() => setSelectedIndustry(industry.name)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  selectedIndustry === industry.name
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {industry.icon}
                {industry.name} ({industry.count})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Case Studies */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl px-4 mx-auto">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2 className="mb-4 text-4xl font-bold text-gray-800">Featured Success Stories</h2>
            <p className="text-xl text-gray-600">Deep dive into transformational recruiting journeys</p>
          </motion.div>

          <div className="space-y-12">
            {featuredCaseStudies.map((study, index) => (
              <motion.div
                key={study.id}
                className="overflow-hidden bg-white shadow-xl rounded-3xl"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  {/* Image Section */}
                  <div className="relative h-64 lg:h-auto overflow-hidden">
                    <img 
                      src={study.image} 
                      alt={study.company}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/80"></div>
                    <div className="absolute bottom-6 left-6 text-white">
                      <div className="flex items-center gap-3 mb-3">
                        <img 
                          src={study.logo} 
                          alt={study.company}
                          className="w-12 h-12 rounded-lg bg-white p-1"
                        />
                        <div>
                          <h4 className="font-bold text-lg">{study.company}</h4>
                          <p className="text-sm opacity-90">{study.industry}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {study.tags.map((tag, idx) => (
                          <span key={idx} className="px-2 py-1 text-xs bg-white/20 rounded-full backdrop-blur-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-8 lg:p-12">
                    <h3 className="mb-4 text-2xl font-bold text-gray-800">{study.title}</h3>
                    
                    <div className="mb-6 space-y-4">
                      <div>
                        <h5 className="font-semibold text-gray-800 mb-2">Challenge</h5>
                        <p className="text-gray-600">{study.challenge}</p>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-800 mb-2">Solution</h5>
                        <p className="text-gray-600">{study.solution}</p>
                      </div>
                    </div>

                    {/* Key Results */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {Object.entries(study.results).map(([key, value], idx) => (
                        <div key={idx} className="p-4 bg-gray-50 rounded-xl text-center">
                          <div className="text-2xl font-bold text-blue-600">{value}</div>
                          <div className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                        </div>
                      ))}
                    </div>

                    {/* Testimonial */}
                    <div className="p-6 bg-blue-50 rounded-2xl mb-6">
                      <p className="text-gray-700 italic mb-4">"{study.testimonial.quote}"</p>
                      <div className="flex items-center gap-3">
                        <img 
                          src={study.testimonial.avatar} 
                          alt={study.testimonial.author}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="font-semibold text-gray-800">{study.testimonial.author}</p>
                          <p className="text-sm text-gray-600">{study.testimonial.role}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button className="flex-1 px-6 py-3 font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors duration-300">
                        View Full Case Study
                      </button>
                      <button className="px-6 py-3 font-semibold text-blue-600 border-2 border-blue-600 rounded-xl hover:bg-blue-50 transition-colors duration-300">
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Case Studies Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl px-4 mx-auto">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2 className="mb-4 text-4xl font-bold text-gray-800">More Success Stories</h2>
            <p className="text-xl text-gray-600">Explore additional case studies across industries</p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {additionalCaseStudies.map((study, index) => (
              <motion.div
                key={study.id}
                className="overflow-hidden transition-all duration-300 bg-white border shadow-lg rounded-2xl hover:shadow-xl group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true, amount: 0.3 }}
                whileHover={{ y: -10 }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={study.image} 
                    alt={study.company}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex flex-wrap gap-1">
                      {study.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 text-xs font-semibold text-white bg-blue-600 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="mb-3 text-xl font-bold text-gray-800 line-clamp-2">{study.title}</h3>
                  
                  <div className="mb-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Building className="w-4 h-4" />
                      {study.company}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Briefcase className="w-4 h-4" />
                      {study.industry} • {study.size}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 font-medium mb-2">Challenge:</p>
                    <p className="text-sm text-gray-700">{study.challenge}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {study.timeReduction && (
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-lg font-bold text-green-600">{study.timeReduction}</div>
                        <div className="text-xs text-gray-600">Time Saved</div>
                      </div>
                    )}
                    {study.costSavings && (
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">{study.costSavings}</div>
                        <div className="text-xs text-gray-600">Cost Savings</div>
                      </div>
                    )}
                    {study.turnoverReduction && (
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-lg font-bold text-purple-600">{study.turnoverReduction}</div>
                        <div className="text-xs text-gray-600">Turnover ↓</div>
                      </div>
                    )}
                    {study.growthRate && (
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="text-lg font-bold text-orange-600">{study.growthRate}</div>
                        <div className="text-xs text-gray-600">Growth Rate</div>
                      </div>
                    )}
                  </div>

                  <button className="w-full px-6 py-3 font-semibold text-white transition-all duration-300 bg-gray-800 rounded-xl hover:bg-gray-900 flex items-center justify-center gap-2">
                    Read Case Study
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-purple-900">
        <div className="max-w-4xl px-4 mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2 className="mb-6 text-4xl font-bold">Ready to Write Your Success Story?</h2>
            <p className="mb-8 text-xl">Join hundreds of organizations that have transformed their recruitment with VirtuosoU.</p>
            
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <motion.button
                className="px-8 py-4 text-lg font-bold text-blue-900 transition-all duration-300 bg-white shadow-lg rounded-xl hover:bg-gray-100 hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started Today
              </motion.button>
              <motion.button
                className="px-8 py-4 text-lg font-bold text-white transition-all duration-300 border-2 border-white rounded-xl hover:bg-white hover:text-blue-900"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Download All Case Studies
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default CaseStudiesPage;
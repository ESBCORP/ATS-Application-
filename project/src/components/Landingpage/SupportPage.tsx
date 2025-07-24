import { motion, useScroll, useTransform } from 'framer-motion';
import {
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  Book,
  Video,
  FileText,
  Search,
  Clock,
  Users,
  CheckCircle,
  ArrowRight,
  Download,
  ExternalLink,
  Headphones,
  Globe,
  Shield,
  Zap,
  Star,
  Award,
  Building,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import React, { useRef, useState } from 'react';

const supportOptions = [
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: 'Live Chat Support',
    description: 'Get instant help from our support team with real-time chat assistance.',
    availability: '24/7 Available',
    responseTime: 'Instant',
    action: 'Start Chat',
    color: 'blue'
  },
  {
    icon: <Phone className="w-6 h-6" />,
    title: 'Phone Support',
    description: 'Speak directly with our technical experts for complex issues.',
    availability: 'Mon-Fri, 9 AM - 6 PM EST',
    responseTime: 'Immediate',
    action: 'Call Now',
    color: 'green'
  },
  {
    icon: <Mail className="w-6 h-6" />,
    title: 'Email Support',
    description: 'Send detailed questions and receive comprehensive responses.',
    availability: 'Always Open',
    responseTime: 'Within 4 hours',
    action: 'Send Email',
    color: 'purple'
  }
];

const faqs = [
  {
    question: 'How do I get started with VirtuosoU?',
    answer: 'Getting started is easy! Sign up for a free trial, and our onboarding team will guide you through the setup process. We provide comprehensive training and support to ensure smooth implementation.',
    category: 'Getting Started'
  },
  {
    question: 'What support channels are available?',
    answer: 'We offer 24/7 live chat support, phone support during business hours (Mon-Fri, 9 AM - 6 PM EST), and email support with guaranteed response within 4 hours.',
    category: 'Support'
  },
  {
    question: 'How can I integrate VirtuosoU with my existing systems?',
    answer: 'VirtuosoU offers comprehensive APIs and pre-built integrations with popular HR and ATS systems. Our technical team provides full integration support and documentation.',
    category: 'Integration'
  },
  {
    question: 'What training resources are available?',
    answer: 'We provide extensive training resources including video tutorials, comprehensive documentation, live webinars, and personalized one-on-one training sessions with our experts.',
    category: 'Training'
  },
  {
    question: 'How does the AI interview technology work?',
    answer: 'Our AI interviewer conducts first-level screening with customizable questions, intelligent follow-ups, and automated evaluation based on keyword detection and response quality analysis.',
    category: 'Features'
  },
  {
    question: 'Is my data secure with VirtuosoU?',
    answer: 'Absolutely. We use enterprise-grade security measures including end-to-end encryption, regular security audits, GDPR compliance, and maintain 99.9% uptime with secure data centers.',
    category: 'Security'
  }
];

const quickLinks = [
  { title: 'Getting Started Guide', category: 'Setup', time: '5 min read' },
  { title: 'User Account Management', category: 'Account', time: '3 min read' },
  { title: 'Setting Up Video Interviews', category: 'Features', time: '8 min read' },
  { title: 'Workflow Automation Basics', category: 'Automation', time: '10 min read' },
  { title: 'Troubleshooting Common Issues', category: 'Support', time: '6 min read' },
  { title: 'API Integration Guide', category: 'Technical', time: '15 min read' }
];

const stats = [
  { icon: <Users className="w-6 h-6" />, value: '50K+', label: 'Happy Customers' },
  { icon: <Clock className="w-6 h-6" />, value: '< 2 min', label: 'Avg Response Time' },
  { icon: <CheckCircle className="w-6 h-6" />, value: '99.5%', label: 'Issue Resolution Rate' },
  { icon: <Star className="w-6 h-6" />, value: '4.9/5', label: 'Customer Satisfaction' }
];

const whyChooseUs = [
  {
    icon: <Award className="w-8 h-8 text-blue-600" />,
    title: '10+ Years Experience',
    description: 'Trusted by thousands of businesses worldwide with over a decade of expertise in recruitment technology',
  },
  {
    icon: <Users className="w-8 h-8 text-green-600" />,
    title: 'Expert Team',
    description: 'Dedicated professionals ready to help you succeed with comprehensive support and guidance',
  },
  {
    icon: <Clock className="w-8 h-8 text-purple-600" />,
    title: 'Fast Response',
    description: 'Quick turnaround times for all your queries with guaranteed response within 4 hours',
  },
  {
    icon: <Shield className="w-8 h-8 text-yellow-600" />,
    title: 'Secure & Reliable',
    description: 'Enterprise-grade security and 99.9% uptime ensuring your data is always protected',
  },
];

const SupportPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    issueType: '',
    message: ''
  });

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "200%"]);

  const categories = ['All', 'Setup', 'Account', 'Features', 'Automation', 'Support', 'Technical'];

  const filteredLinks = quickLinks.filter(link => {
    const matchesSearch = link.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || link.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (formData.name && formData.email && formData.issueType) {
      alert('Thank you for contacting us! We\'ll get back to you within 24 hours.');
      setFormData({
        name: '',
        email: '',
        issueType: '',
        message: ''
      });
    } else {
      alert('Please fill in all required fields.');
    }
  };

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section with Parallax */}
      <motion.section 
        className="relative py-48 overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900"
        style={{ y: backgroundY }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <motion.div 
          className="relative z-10 text-center text-white px-4 -mt-32"
          style={{ y: textY }}
        >
          <motion.h1 
            className="mb-6 text-5xl font-bold md:text-6xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            VirtuosoU <span className="text-teal-400">Support</span>
          </motion.h1>
          <motion.p 
            className="max-w-2xl mx-auto text-xl leading-relaxed mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            AI-powered support by VirtuosoU experts, fully focused on helping you succeed.
          </motion.p>
          
          {/* Chat with Support Button */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.button
              className="px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-teal-500 to-blue-600 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Chat with support
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Stats Section */}
      <section className="py-20 -mt-32">
        <div className="grid max-w-6xl grid-cols-2 gap-6 px-4 mx-auto md:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="relative p-8 text-center bg-white shadow-xl rounded-3xl hover:shadow-2xl group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              viewport={{ once: false, amount: 0.3 }}
              whileHover={{ 
                scale: 1.05, 
                rotateY: 5,
                transition: { duration: 0.3 }
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-300"></div>
              <motion.div 
                className="flex justify-center mb-4 text-blue-600"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                {stat.icon}
              </motion.div>
              <h4 className="mb-2 text-2xl font-bold text-gray-800">{stat.value}</h4>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl px-4 mx-auto">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false, amount: 0.3 }}
          >
            <h2 className="mb-4 text-4xl font-bold text-gray-800">Why Choose VirtuosoU?</h2>
            <p className="text-xl text-gray-600">Trusted by businesses worldwide for excellence and reliability</p>
          </motion.div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {whyChooseUs.map((item, index) => (
              <motion.div
                key={index}
                className="relative p-8 text-center bg-white rounded-2xl shadow-lg group overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: false, amount: 0.3 }}
                whileHover={{ 
                  y: -8,
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
              >
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 ease-in-out"></div>

                <div className="relative z-10">
                  <motion.div 
                    className="flex justify-center mb-6"
                    whileHover={{ 
                      scale: 1.2,
                      rotate: [0, -10, 10, 0],
                      transition: { duration: 0.5 }
                    }}
                  >
                    {item.icon}
                  </motion.div>
                  <motion.h4 
                    className="mb-4 text-xl font-bold text-gray-800 group-hover:text-blue-700 transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                  >
                    {item.title}
                  </motion.h4>
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    {item.description}
                  </p>
                </div>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50 overflow-hidden">
        <div className="max-w-6xl px-4 mx-auto">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false, amount: 0.3 }}
          >
            <motion.h2 
              className="mb-4 text-4xl font-bold text-gray-800"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: false, amount: 0.3 }}
            >
              Multiple Ways to Reach Us
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: false, amount: 0.3 }}
            >
              Choose the support channel that works best for you
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {supportOptions.map((option, index) => (
              <motion.div
                key={index}
                className="relative p-8 bg-white shadow-xl rounded-2xl group overflow-hidden"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: index * 0.1, 
                  duration: 0.6,
                  ease: "easeOut"
                }}
                viewport={{ once: true, amount: 0.2 }}
                whileHover={{ 
                  y: -8,
                  scale: 1.02,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
              >
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 ease-in-out"></div>

                <div className="relative z-10">
                  <div className="flex items-center mb-6">
                    <motion.div 
                      className="p-3 mr-4 bg-blue-100 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all duration-300"
                      whileHover={{ 
                        rotate: [0, -10, 10, 0],
                        scale: 1.1,
                        transition: { duration: 0.5 }
                      }}
                    >
                      {option.icon}
                    </motion.div>
                    <div>
                      <motion.h4 
                        className="text-xl font-bold text-gray-800 group-hover:text-blue-700 transition-colors duration-300"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        {option.title}
                      </motion.h4>
                      <motion.p 
                        className="text-sm font-semibold text-green-600 group-hover:text-green-700 transition-colors duration-300"
                        whileHover={{ scale: 1.05 }}
                      >
                        {option.availability}
                      </motion.p>
                    </div>
                  </div>
                  
                  <motion.p 
                    className="mb-4 text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300"
                    initial={{ opacity: 0.8 }}
                    whileHover={{ opacity: 1 }}
                  >
                    {option.description}
                  </motion.p>
                  
                  <motion.p 
                    className="mb-6 text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300"
                    whileHover={{ x: 2 }}
                  >
                    Response: {option.responseTime}
                  </motion.p>
                  
                  <motion.button 
                    className="w-full px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg transition-all duration-300 hover:bg-blue-700 hover:shadow-lg relative overflow-hidden"
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)"
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="relative z-10">{option.action}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-600 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  </motion.button>
                </div>

                {/* Corner glow effect */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-blue-400/20 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced FAQ Section */}
      <section className="py-16 bg-white overflow-hidden">
        <div className="max-w-6xl px-4 mx-auto">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false, amount: 0.3 }}
          >
            <motion.h2 
              className="mb-4 text-4xl font-bold text-gray-800"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: false, amount: 0.3 }}
            >
              Frequently Asked Questions
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: false, amount: 0.3 }}
            >
              Quick answers to the most common questions
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="relative bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl overflow-hidden group cursor-pointer"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: index * 0.1, 
                  duration: 0.6,
                  ease: "easeOut"
                }}
                viewport={{ once: true, amount: 0.2 }}
                whileHover={{ 
                  y: -8,
                  scale: 1.02,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                onClick={() => toggleFaq(index)}
              >
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-in-out"></div>

                <div className="relative z-10 p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <motion.div 
                      className="p-2 bg-blue-100 rounded-lg flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300"
                      whileHover={{ 
                        rotate: [0, -5, 5, 0],
                        scale: 1.1,
                        transition: { duration: 0.5 }
                      }}
                    >
                      <HelpCircle className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors duration-300" />
                    </motion.div>
                    <div className="flex-1">
                      <motion.h3 
                        className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-700 transition-colors duration-300"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        {faq.question}
                      </motion.h3>
                      <motion.span 
                        className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full font-medium group-hover:bg-blue-600 group-hover:text-white transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                      >
                        {faq.category}
                      </motion.span>
                    </div>
                    <motion.div
                      animate={{ rotate: expandedFaq === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-gray-400 group-hover:text-blue-600 transition-colors duration-300"
                    >
                      <ChevronDown className="w-5 h-5" />
                    </motion.div>
                  </div>

                  <motion.div
                    initial={false}
                    animate={{
                      height: expandedFaq === index ? "auto" : 0,
                      opacity: expandedFaq === index ? 1 : 0
                    }}
                    transition={{ 
                      duration: 0.4,
                      ease: "easeInOut"
                    }}
                    className="overflow-hidden"
                  >
                    <motion.p 
                      className="text-gray-600 leading-relaxed pt-2 border-t border-gray-200/50"
                      initial={{ y: -10 }}
                      animate={{ y: expandedFaq === index ? 0 : -10 }}
                      transition={{ duration: 0.3, delay: expandedFaq === index ? 0.2 : 0 }}
                    >
                      {faq.answer}
                    </motion.p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form and Information */}
      <section className="py-16 bg-gradient-to-r from-blue-900 to-blue-800 text-white">
        <div className="grid grid-cols-1 gap-12 px-4 mx-auto lg:grid-cols-2 max-w-7xl">
          {/* Contact Information */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false, amount: 0.3 }}
          >
            <h2 className="mb-6 text-4xl font-bold">Still Need Help?</h2>
            <p className="mb-8 text-xl text-blue-100">
              Our support team is standing by to help you succeed with VirtuosoU. 
              Don't hesitate to reach out with any questions or concerns.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold">Phone Support</h4>
                  <p className="text-blue-100">+1 585-625-1312</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold">Email Support</h4>
                  <p className="text-blue-100">contact@virtuosou.com</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold">Support Hours</h4>
                  <p className="text-blue-100">24/7 Chat • Mon-Fri 9AM-6PM Phone</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-8"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: false, amount: 0.3 }}
          >
            <h3 className="mb-6 text-2xl font-bold">Quick Contact Form</h3>
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
              <select 
                name="issueType"
                value={formData.issueType}
                onChange={handleChange}
                className="w-full p-3 bg-white/10 border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
              >
                <option value="">Select Issue Type</option>
                <option value="technical">Technical Issue</option>
                <option value="billing">Billing Question</option>
                <option value="feature">Feature Request</option>
                <option value="other">Other</option>
              </select>
              <textarea
                name="message"
                rows={4}
                placeholder="Describe your issue or question..."
                value={formData.message}
                onChange={handleChange}
                className="w-full p-3 bg-white/10 border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
              />
              <motion.button
                onClick={handleSubmit}
                className="w-full px-6 py-3 bg-teal-500 hover:bg-teal-400 rounded-lg font-semibold transition-colors duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Send Message
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Ready to Get Started Section */}
      <section className="py-16 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="max-w-4xl px-4 mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false, amount: 0.3 }}
          >
            <h2 className="mb-4 text-4xl font-bold text-gray-800">Ready to Get Started?</h2>
            <p className="mb-8 text-xl text-gray-600">
              Join thousands of companies using VirtuosoU to transform their recruitment process.
            </p>
            
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-6">
              <motion.button
                className="px-8 py-4 text-lg font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Free Trial
              </motion.button>
              <motion.button
                className="px-8 py-4 text-lg font-bold text-blue-600 bg-white border-2 border-blue-600 rounded-xl hover:bg-blue-50 transition-colors duration-300 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Schedule Demo
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default SupportPage;
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Award,
  Building,
  Clock,
  Globe,
  HeadphonesIcon,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Shield,
  Users,
  Zap
} from 'lucide-react';
import React, { useRef, useState } from 'react';

const offices = [
  {
    title: 'VirtuosoU.',
    location: 'NEW YORK - HEADQUARTERS',
    address: '687 Lee Road, Suite 109\nRochester, NY 14606 USA',
    phone: '+1 585-625-1312',
    email: 'contact@VirtuosoU.com',
    timezone: 'EST (UTC-5)',
    hours: 'Mon-Fri: 9:00 AM - 6:00 PM',
  },
  {
    title: 'VirtuosoU Pvt. Ltd.',
    location: 'HYDERABAD - REGISTERED OFFICE',
    address: 'iLabs Centre, 3rd flr, Bldg 3 (iMCL),\nSoftware Units Layout, Madhapur, Hyderabad 500081, INDIA',
    phone: '+91 40-4262-3066',
    email: 'contact@virtuosoU.com',
    timezone: 'IST (UTC+5:30)',
    hours: 'Mon-Fri: 9:30 AM - 6:30 PM',
  },
  {
    title: 'VirtuosoU Pvt. Ltd.',
    location: 'HYDERABAD - CORPORATE OFFICE',
    address: 'iLabs Centre, 1st flr, Bldg 3 (iMCL),\nSoftware Units Layout, Madhapur, Hyderabad 500081, INDIA',
    phone: '+91 40-4262-3066',
    email: 'corporate@virtuosoU.com',
    timezone: 'IST (UTC+5:30)',
    hours: 'Mon-Fri: 9:30 AM - 6:30 PM',
  },
];

const supportOptions = [
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: 'Live Chat',
    description: 'Get instant help from our support team',
    availability: '24/7 Available',
    action: 'Start Chat',
  },
  {
    icon: <HeadphonesIcon className="w-6 h-6" />,
    title: 'Phone Support',
    description: 'Speak directly with our experts',
    availability: 'Business Hours',
    action: 'Call Now',
  },
  {
    icon: <Mail className="w-6 h-6" />,
    title: 'Email Support',
    description: 'Detailed assistance via email',
    availability: 'Response within 4 hours',
    action: 'Send Email',
  },
];

const whyChooseUs = [
  {
    icon: <Award className="w-8 h-8 text-blue-600" />,
    title: '10+ Years Experience',
    description: 'Trusted by thousands of businesses worldwide',
  },
  {
    icon: <Users className="w-8 h-8 text-green-600" />,
    title: 'Expert Team',
    description: 'Dedicated professionals ready to help you succeed',
  },
  {
    icon: <Zap className="w-8 h-8 text-yellow-600" />,
    title: 'Fast Response',
    description: 'Quick turnaround times for all your queries',
  },
  {
    icon: <Shield className="w-8 h-8 text-purple-600" />,
    title: 'Secure & Reliable',
    description: 'Enterprise-grade security and 99.9% uptime',
  },
];

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    businessEmail: '',
    phone: '',
    jobTitle: '',
    company: '',
    helpType: '',
    message: '',
    preferredContact: 'email',
  });

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "200%"]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for contacting us! We\'ll get back to you within 24 hours.');
    setFormData({
      firstName: '',
      lastName: '',
      businessEmail: '',
      phone: '',
      jobTitle: '',
      company: '',
      helpType: '',
      message: '',
      preferredContact: 'email',
    });
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section with Parallax */}
      <motion.section 
        className="relative py-24 overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900"
        style={{ y: backgroundY }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <motion.div 
          className="relative z-10 text-center text-white"
          style={{ y: textY }}
        >
          <motion.h1 
            className="mb-4 text-5xl font-bold md:text-6xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Get In <span className="text-blue-300">Touch</span>
          </motion.h1>
          <motion.p 
            className="max-w-2xl mx-auto text-xl leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Whether you're exploring our products, need technical support, or want to discuss partnerships, 
            our global team is here to help you succeed.
          </motion.p>
          <motion.div
            className="flex justify-center gap-6 mt-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              <span>Global Presence</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>24/7 Support</span>
            </div>
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              <span>Enterprise Ready</span>
            </div>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Quick Contact Cards */}
      <section className="py-16 -mt-12">
        <div className="grid max-w-6xl grid-cols-1 gap-6 px-4 mx-auto md:grid-cols-3">
          {[
            {
              icon: <Phone className="w-8 h-8 text-blue-600" />,
              title: 'Call Us',
              text: '+1 585-625-1312',
              subtext: 'Mon-Fri, 9 AM - 6 PM EST',
              gradient: 'from-blue-500 to-blue-600',
            },
            {
              icon: <Mail className="w-8 h-8 text-green-600" />,
              title: 'Email Us',
              text: 'contact@virtuosou.com',
              subtext: 'Response within 4 hours',
              gradient: 'from-green-500 to-green-600',
            },
            {
              icon: <MapPin className="w-8 h-8 text-purple-600" />,
              title: 'Visit Us',
              text: 'Rochester, NY & Hyderabad, IN',
              subtext: 'Multiple office locations',
              gradient: 'from-purple-500 to-purple-600',
            },
          ].map((item, index) => (
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
              <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-300`}></div>
              <motion.div 
                className="flex justify-center mb-4"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                {item.icon}
              </motion.div>
              <h4 className="mb-2 text-xl font-bold text-gray-800">{item.title}</h4>
              <p className="mb-1 text-lg font-semibold text-gray-700">{item.text}</p>
              <p className="text-sm text-gray-500">{item.subtext}</p>
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
                className="p-6 text-center transition-all duration-300 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: false, amount: 0.3 }}
                whileHover={{ y: -5 }}
              >
                <motion.div 
                  className="flex justify-center mb-4"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  {item.icon}
                </motion.div>
                <h4 className="mb-2 text-lg font-bold text-gray-800">{item.title}</h4>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-6xl px-4 mx-auto">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false, amount: 0.3 }}
          >
            <h2 className="mb-4 text-4xl font-bold text-gray-800">Multiple Ways to Reach Us</h2>
            <p className="text-xl text-gray-600">Choose the support channel that works best for you</p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {supportOptions.map((option, index) => (
              <motion.div
                key={index}
                className="p-8 transition-all duration-300 bg-white shadow-lg rounded-2xl hover:shadow-xl"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: false, amount: 0.3 }}
                whileHover={{ y: -10 }}
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 mr-4 bg-blue-100 rounded-lg">
                    {option.icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-800">{option.title}</h4>
                    <p className="text-sm font-semibold text-green-600">{option.availability}</p>
                  </div>
                </div>
                <p className="mb-6 text-gray-600">{option.description}</p>
                <button className="w-full px-6 py-3 font-semibold text-white transition-colors duration-300 bg-blue-600 rounded-lg hover:bg-blue-700">
                  {option.action}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Form and Office Info */}
      <section className="py-16 bg-white">
        <div className="grid grid-cols-1 gap-12 px-4 mx-auto lg:grid-cols-2 max-w-7xl">
          {/* Enhanced Form */}
          <motion.div 
            className="p-8 border shadow-xl bg-gradient-to-br from-white to-blue-50 rounded-3xl"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false, amount: 0.3 }}
          >
            <h3 className="mb-2 text-3xl font-bold text-gray-800">How Can We Help?</h3>
            <p className="mb-8 text-gray-600">Fill out the form below and we'll get back to you within 24 hours.</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <motion.input
                  type="text"
                  name="firstName"
                  placeholder="First name*"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full p-4 transition-all duration-300 border-2 border-gray-200 outline-none rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  whileFocus={{ scale: 1.02 }}
                />
                <motion.input
                  type="text"
                  name="lastName"
                  placeholder="Last name*"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full p-4 transition-all duration-300 border-2 border-gray-200 outline-none rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  whileFocus={{ scale: 1.02 }}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <motion.input
                  type="email"
                  name="businessEmail"
                  placeholder="Business email*"
                  value={formData.businessEmail}
                  onChange={handleChange}
                  required
                  className="w-full p-4 transition-all duration-300 border-2 border-gray-200 outline-none rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  whileFocus={{ scale: 1.02 }}
                />
                <motion.input
                  type="tel"
                  name="phone"
                  placeholder="Phone number*"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full p-4 transition-all duration-300 border-2 border-gray-200 outline-none rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  whileFocus={{ scale: 1.02 }}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <motion.input
                  type="text"
                  name="jobTitle"
                  placeholder="Job title"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  className="w-full p-4 transition-all duration-300 border-2 border-gray-200 outline-none rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  whileFocus={{ scale: 1.02 }}
                />
                <motion.input
                  type="text"
                  name="company"
                  placeholder="Company name"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full p-4 transition-all duration-300 border-2 border-gray-200 outline-none rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  whileFocus={{ scale: 1.02 }}
                />
              </div>

              <div>
                <label className="block mb-3 text-sm font-semibold text-gray-700">How can we help?*</label>
                <motion.select
                  name="helpType"
                  value={formData.helpType}
                  onChange={handleChange}
                  required
                  className="w-full p-4 transition-all duration-300 border-2 border-gray-200 outline-none rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  whileFocus={{ scale: 1.02 }}
                >
                  <option value="">-- Select an option --</option>
                  <option value="product_demo">I'd like a product demo/trial</option>
                  <option value="customer_support">I need customer support</option>
                  <option value="technical_issues">I have technical issues</option>
                  <option value="billing_inquiry">Billing inquiry</option>
                  <option value="partnership">Partnership opportunities</option>
                  <option value="feedback">I have feedback/suggestions</option>
                  <option value="other">Other</option>
                </motion.select>
              </div>

              <div>
                <label className="block mb-3 text-sm font-semibold text-gray-700">Tell us more about your inquiry</label>
                <motion.textarea
                  name="message"
                  placeholder="Provide additional details about your inquiry..."
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full p-4 transition-all duration-300 border-2 border-gray-200 outline-none resize-none rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  whileFocus={{ scale: 1.02 }}
                />
              </div>

              <div>
                <label className="block mb-3 text-sm font-semibold text-gray-700">Preferred contact method</label>
                <div className="flex gap-4">
                  {['email', 'phone'].map((method) => (
                    <label key={method} className="flex items-center">
                      <input
                        type="radio"
                        name="preferredContact"
                        value={method}
                        checked={formData.preferredContact === method}
                        onChange={handleChange}
                        className="w-4 h-4 mr-2 text-blue-600"
                      />
                      <span className="text-gray-700 capitalize">{method}</span>
                    </label>
                  ))}
                </div>
              </div>

              <p className="p-4 text-sm text-gray-500 rounded-lg bg-gray-50">
                By providing your contact information, you agree to our{' '}
                <a href="#" className="text-blue-600 underline hover:text-blue-800">
                  privacy policy
                </a>{' '}
                and to receive communication from Ceipal. You can unsubscribe at any time.
              </p>

              <motion.button
                type="submit"
                className="w-full px-8 py-4 text-lg font-bold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 hover:shadow-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Send Message
              </motion.button>
            </form>
          </motion.div>

          {/* Enhanced Office Info */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false, amount: 0.3 }}
          >
            <div className="mb-8">
              <h3 className="mb-4 text-3xl font-bold text-gray-800">Our Global Offices</h3>
              <p className="text-gray-600">Visit us at any of our locations or connect with our local teams.</p>
            </div>

            {offices.map((office, idx) => (
              <motion.div
                key={idx}
                className="p-6 transition-all duration-300 bg-white border-2 border-gray-100 shadow-lg rounded-2xl hover:shadow-xl"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2, duration: 0.6 }}
                viewport={{ once: false, amount: 0.3 }}
                whileHover={{ y: -5, borderColor: '#3B82F6' }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Building className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    {office.title && <h4 className="mb-1 text-xl font-bold text-blue-700">{office.title}</h4>}
                    <p className="mb-2 font-semibold text-gray-800">{office.location}</p>
                  </div>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700 whitespace-pre-line">{office.address}</p>
                  </div>
                  
                  {office.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="flex-shrink-0 w-4 h-4 text-gray-500" />
                      <p className="text-gray-700">{office.phone}</p>
                    </div>
                  )}
                  
                  {office.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="flex-shrink-0 w-4 h-4 text-gray-500" />
                      <p className="text-gray-700">{office.email}</p>
                    </div>
                  )}
                  
                  {office.hours && (
                    <div className="flex items-center gap-3">
                      <Clock className="flex-shrink-0 w-4 h-4 text-gray-500" />
                      <p className="text-gray-700">{office.hours}</p>
                    </div>
                  )}
                  
                  {office.timezone && (
                    <div className="flex items-center gap-3">
                      <Globe className="flex-shrink-0 w-4 h-4 text-gray-500" />
                      <p className="text-gray-700">{office.timezone}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default ContactUsPage;
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Calendar,
  Clock,
  Users,
  PlayCircle,
  Star,
  ChevronRight,
  Video,
  Award,
  Target,
  Briefcase
} from 'lucide-react';
import React, { useRef } from 'react';

const upcomingWebinars = [
  {
    id: 1,
    title: 'AI-Powered Recruitment: The Future of Hiring',
    description: 'Discover how artificial intelligence is transforming talent acquisition with automated screening and smart candidate matching.',
    speaker: 'Sarah Chen',
    role: 'VP of Talent Acquisition',
    date: '2025-08-15',
    time: '2:00 PM EST',
    duration: '60 min',
    attendees: 1250,
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=300&fit=crop'
  },
  {
    id: 2,
    title: 'Building Diverse Teams: Inclusive Hiring Strategies',
    description: 'Learn proven strategies for creating diverse, high-performing teams through bias-free recruitment practices.',
    speaker: 'Marcus Johnson',
    role: 'Chief Diversity Officer',
    date: '2025-08-20',
    time: '1:00 PM EST',
    duration: '45 min',
    attendees: 890,
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=300&fit=crop'
  },
  {
    id: 3,
    title: 'Remote Hiring Excellence: Virtual Interview Mastery',
    description: 'Perfect your remote hiring process with best practices for virtual interviews and digital assessments.',
    speaker: 'Elena Rodriguez',
    role: 'Head of Remote Operations',
    date: '2025-08-25',
    time: '3:00 PM EST',
    duration: '50 min',
    attendees: 1100,
    image: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=600&h=300&fit=crop'
  }
];

const pastWebinars = [
  {
    id: 4,
    title: 'Data-Driven Recruiting: Analytics That Matter',
    speaker: 'Jennifer Liu',
    date: '2025-07-15',
    views: 2500,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=300&fit=crop'
  },
  {
    id: 5,
    title: 'Social Recruiting: LinkedIn and Beyond',
    speaker: 'Michael Torres',
    date: '2025-07-10',
    views: 1800,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=300&fit=crop'
  },
  {
    id: 6,
    title: 'Employer Branding: Attract Top Talent',
    speaker: 'Amanda Foster',
    date: '2025-07-05',
    views: 3200,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=300&fit=crop'
  }
];

const stats = [
  { icon: <Users className="w-6 h-6" />, value: '50K+', label: 'Attendees' },
  { icon: <Video className="w-6 h-6" />, value: '200+', label: 'Webinars' },
  { icon: <Star className="w-6 h-6" />, value: '4.9', label: 'Rating' },
  { icon: <Award className="w-6 h-6" />, value: '120+', label: 'Countries' }
];

const WebinarsPage = () => {
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
        className="relative py-20 overflow-hidden bg-gradient-to-r from-blue-900 to-purple-900"
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
            VirtuosoU <span className="text-blue-300">Webinars</span>
          </motion.h1>
          
          <motion.p 
            className="max-w-3xl mx-auto mb-8 text-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Master recruitment excellence with expert-led webinars covering AI hiring, 
            diversity strategies, and cutting-edge talent acquisition techniques.
          </motion.p>

          <motion.button
            className="px-8 py-4 text-lg font-bold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:shadow-xl hover:scale-105"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Webinars
          </motion.button>
        </motion.div>
      </motion.section>

      {/* Stats Section */}
      <section className="py-16 -mt-10">
        <div className="max-w-6xl px-4 mx-auto">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="p-6 text-center bg-white shadow-lg rounded-2xl"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true, amount: 0.3 }}
                whileHover={{ y: -5, scale: 1.05 }}
              >
                <div className="flex justify-center mb-3 text-blue-600">
                  {stat.icon}
                </div>
                <h4 className="mb-1 text-2xl font-bold text-gray-800">{stat.value}</h4>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Webinars */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl px-4 mx-auto">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2 className="mb-4 text-4xl font-bold text-gray-800">Upcoming Webinars</h2>
            <p className="text-xl text-gray-600">Join our expert-led sessions and advance your recruitment skills</p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {upcomingWebinars.map((webinar, index) => (
              <motion.div
                key={webinar.id}
                className="overflow-hidden transition-all duration-300 bg-white border shadow-lg rounded-2xl hover:shadow-xl"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true, amount: 0.3 }}
                whileHover={{ y: -10 }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={webinar.image} 
                    alt={webinar.title}
                    className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 text-xs font-bold text-white bg-green-500 rounded-full">
                      UPCOMING
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="mb-3 text-xl font-bold text-gray-800">{webinar.title}</h3>
                  <p className="mb-4 text-gray-600">{webinar.description}</p>
                  
                  <div className="mb-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {new Date(webinar.date).toLocaleDateString()} at {webinar.time}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      Duration: {webinar.duration}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Users className="w-4 h-4" />
                      {webinar.attendees}+ registered
                    </div>
                  </div>

                  <div className="mb-4 pb-4 border-b">
                    <p className="font-semibold text-gray-800">{webinar.speaker}</p>
                    <p className="text-sm text-gray-600">{webinar.role}</p>
                  </div>

                  <button className="w-full px-6 py-3 font-semibold text-white transition-all duration-300 bg-blue-600 rounded-lg hover:bg-blue-700 hover:shadow-lg">
                    Register Free
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Attend Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-6xl px-4 mx-auto">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2 className="mb-4 text-4xl font-bold text-gray-800">Why Attend Our Webinars?</h2>
            <p className="text-xl text-gray-600">Accelerate your recruitment career with industry insights</p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: <Target className="w-12 h-12 text-blue-600" />,
                title: 'Expert Knowledge',
                description: 'Learn from industry leaders with years of recruitment experience and proven track records.'
              },
              {
                icon: <Briefcase className="w-12 h-12 text-green-600" />,
                title: 'Practical Skills',
                description: 'Gain actionable insights and tools you can immediately implement in your hiring process.'
              },
              {
                icon: <Award className="w-12 h-12 text-purple-600" />,
                title: 'Professional Growth',
                description: 'Earn certificates and stay current with the latest trends in talent acquisition.'
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                className="p-8 text-center transition-all duration-300 bg-white shadow-lg rounded-2xl hover:shadow-xl"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true, amount: 0.3 }}
                whileHover={{ y: -10 }}
              >
                <div className="flex justify-center mb-6">
                  {benefit.icon}
                </div>
                <h3 className="mb-4 text-xl font-bold text-gray-800">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Past Webinars */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl px-4 mx-auto">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2 className="mb-4 text-4xl font-bold text-gray-800">Past Webinar Recordings</h2>
            <p className="text-xl text-gray-600">Catch up on sessions you missed</p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {pastWebinars.map((webinar, index) => (
              <motion.div
                key={webinar.id}
                className="overflow-hidden transition-all duration-300 bg-white shadow-lg rounded-2xl hover:shadow-xl group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true, amount: 0.3 }}
                whileHover={{ y: -10 }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={webinar.image} 
                    alt={webinar.title}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <PlayCircle className="w-16 h-16 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 text-xs font-bold text-white bg-red-500 rounded-full">
                      RECORDED
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="mb-3 text-xl font-bold text-gray-800">{webinar.title}</h3>
                  
                  <div className="mb-4 space-y-2">
                    <p className="font-semibold text-gray-800">{webinar.speaker}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{new Date(webinar.date).toLocaleDateString()}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        {webinar.rating}
                      </div>
                      <span>{webinar.views} views</span>
                    </div>
                  </div>

                  <button className="w-full px-6 py-3 font-semibold text-white transition-all duration-300 bg-gray-800 rounded-lg hover:bg-gray-900 hover:shadow-lg">
                    Watch Recording
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
            <h2 className="mb-6 text-4xl font-bold">Ready to Transform Your Recruiting?</h2>
            <p className="mb-8 text-xl">Join thousands of HR professionals advancing their careers with VirtuosoU webinars.</p>
            
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <motion.button
                className="px-8 py-4 text-lg font-bold text-blue-900 transition-all duration-300 bg-white shadow-lg rounded-xl hover:bg-gray-100 hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Browse All Webinars
              </motion.button>
              <motion.button
                className="px-8 py-4 text-lg font-bold text-white transition-all duration-300 border-2 border-white rounded-xl hover:bg-white hover:text-blue-900"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe to Updates
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default WebinarsPage;
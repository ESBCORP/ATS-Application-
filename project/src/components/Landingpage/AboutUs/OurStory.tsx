import { motion, useScroll, useTransform } from 'framer-motion';
import {
    ArrowRight,
    Award,
    Briefcase,
    Building,
    CheckCircle,
    Clock,
    Globe,
    Heart,
    Lightbulb,
    Rocket,
    Shield,
    Star,
    Target,
    TrendingUp,
    Users
} from 'lucide-react';
import { useRef } from 'react';

const milestones = [
  {
    year: '2012',
    title: 'The Beginning',
    description: 'Founded with a vision to revolutionize talent acquisition and workforce management',
    highlight: 'Company Founded',
    icon: <Rocket className="w-6 h-6" />,
  },
  {
    year: '2015',
    title: 'First Major Milestone',
    description: 'Reached 1,000+ active clients and expanded our product suite',
    highlight: '1K+ Clients',
    icon: <Users className="w-6 h-6" />,
  },
  {
    year: '2018',
    title: 'Global Expansion',
    description: 'Opened international offices and launched AI-powered features',
    highlight: 'Global Presence',
    icon: <Globe className="w-6 h-6" />,
  },
  {
    year: '2020',
    title: 'Innovation Leadership',
    description: 'Introduced cutting-edge automation and cloud-first solutions',
    highlight: 'AI Integration',
    icon: <Lightbulb className="w-6 h-6" />,
  },
  {
    year: '2023',
    title: 'Industry Recognition',
    description: 'Awarded as the leading workforce management platform',
    highlight: 'Industry Leader',
    icon: <Award className="w-6 h-6" />,
  },
  {
    year: '2025',
    title: 'Future Forward',
    description: 'Continuing to innovate and shape the future of work',
    highlight: 'Innovation Hub',
    icon: <TrendingUp className="w-6 h-6" />,
  },
];

const values = [
  {
    icon: <Heart className="w-8 h-8 text-red-500" />,
    title: 'Customer First',
    description: 'Every decision we make is guided by what\'s best for our customers and their success.',
    gradient: 'from-red-100 to-pink-100',
  },
  {
    icon: <Lightbulb className="w-8 h-8 text-yellow-500" />,
    title: 'Innovation',
    description: 'We constantly push boundaries and embrace new technologies to solve complex problems.',
    gradient: 'from-yellow-100 to-orange-100',
  },
  {
    icon: <Shield className="w-8 h-8 text-green-500" />,
    title: 'Integrity',
    description: 'We build trust through transparency, honesty, and ethical business practices.',
    gradient: 'from-green-100 to-emerald-100',
  },
  {
    icon: <Users className="w-8 h-8 text-blue-500" />,
    title: 'Collaboration',
    description: 'We believe in the power of teamwork and diverse perspectives to achieve excellence.',
    gradient: 'from-blue-100 to-indigo-100',
  },
];

const team = [
  {
    name: 'Sarah Johnson',
    position: 'Chief Executive Officer',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b977?w=400&h=400&fit=crop&crop=face',
    bio: '15+ years of experience leading technology companies to success',
    linkedin: '#',
  },
  {
    name: 'Michael Chen',
    position: 'Chief Technology Officer',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    bio: 'Former Silicon Valley engineer with expertise in AI and machine learning',
    linkedin: '#',
  },
  {
    name: 'Emily Rodriguez',
    position: 'VP of Product',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    bio: 'Product visionary who has launched multiple award-winning platforms',
    linkedin: '#',
  },
  {
    name: 'David Kumar',
    position: 'VP of Engineering',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    bio: 'Engineering leader with a passion for scalable, robust systems',
    linkedin: '#',
  },
];

const stats = [
  { number: '10M+', label: 'Users Worldwide', icon: <Users className="w-6 h-6" /> },
  { number: '50K+', label: 'Companies Trust Us', icon: <Building className="w-6 h-6" /> },
  { number: '99.9%', label: 'Uptime Guarantee', icon: <Shield className="w-6 h-6" /> },
  { number: '24/7', label: 'Global Support', icon: <Clock className="w-6 h-6" /> },
];

const achievements = [
  {
    title: 'Best Workforce Management Platform',
    organization: 'TechCrunch Awards 2024',
    year: '2024',
    icon: <Award className="w-5 h-5" />,
  },
  {
    title: 'Innovation Excellence Award',
    organization: 'HR Tech Conference',
    year: '2023',
    icon: <Lightbulb className="w-5 h-5" />,
  },
  {
    title: 'Customer Choice Award',
    organization: 'G2 Reviews',
    year: '2023',
    icon: <Star className="w-5 h-5" />,
  },
  {
    title: 'Fastest Growing Company',
    organization: 'Inc. 5000',
    year: '2022',
    icon: <TrendingUp className="w-5 h-5" />,
  },
];

const OurStoryPage = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "200%"]);

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section with Parallax */}
      <motion.section 
       className="relative py-24 overflow-hidden bg-blue-900"

        style={{ y: backgroundY }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
        <motion.div 
          className="relative z-10 max-w-6xl px-4 mx-auto text-center text-white"
          style={{ y: textY }}
        >
          <motion.h1 
            className="mb-6 text-5xl font-bold md:text-7xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Our <span className="text-blue-300">Story</span>
          </motion.h1>
          <motion.p 
            className="max-w-3xl mx-auto mb-8 text-xl leading-relaxed md:text-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            From a small startup with big dreams to a global leader in workforce management. 
            Discover the journey that brought us here and the vision that drives us forward.
          </motion.p>
          <motion.div
            className="flex flex-wrap justify-center gap-8 mt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-2 text-blue-300">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold">{stat.number}</div>
                <div className="text-sm opacity-90">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl px-4 mx-auto">
          <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: false, amount: 0.3 }}
            >
              <h2 className="mb-6 text-4xl font-bold text-gray-800">Our Mission</h2>
              <p className="mb-8 text-lg leading-relaxed text-gray-600">
                To empower organizations worldwide with innovative workforce management solutions 
                that drive efficiency, enhance productivity, and create meaningful work experiences 
                for millions of professionals.
              </p>
              <div className="flex items-center gap-4">
                <Target className="w-8 h-8 text-blue-600" />
                <span className="text-lg font-semibold text-gray-800">Focused on Excellence</span>
              </div>
            </motion.div>
            
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: false, amount: 0.3 }}
            >
              <div className="p-8 text-white bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl">
                <h3 className="mb-4 text-2xl font-bold">Our Vision</h3>
                <p className="mb-6 text-lg leading-relaxed">
                  To be the world's most trusted partner in transforming how organizations 
                  manage, develop, and engage their workforce in the digital age.
                </p>
                <div className="flex items-center gap-3">
                  <Rocket className="w-6 h-6" />
                  <span className="font-semibold">Innovation Driven</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-6xl px-4 mx-auto">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false, amount: 0.3 }}
          >
            <h2 className="mb-4 text-4xl font-bold text-gray-800">Our Journey</h2>
            <p className="text-xl text-gray-600">Milestones that shaped our story</p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                className="relative p-6 transition-all duration-300 bg-white shadow-lg rounded-2xl hover:shadow-xl"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: false, amount: 0.3 }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 text-blue-600 bg-blue-100 rounded-lg">
                    {milestone.icon}
                  </div>
                  <div className="px-3 py-1 text-sm font-bold text-white bg-blue-600 rounded-full">
                    {milestone.year}
                  </div>
                </div>
                <h4 className="mb-2 text-xl font-bold text-gray-800">{milestone.title}</h4>
                <p className="mb-4 text-gray-600">{milestone.description}</p>
                <div className="flex items-center gap-2 font-semibold text-blue-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">{milestone.highlight}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl px-4 mx-auto">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false, amount: 0.3 }}
          >
            <h2 className="mb-4 text-4xl font-bold text-gray-800">Our Values</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className={`p-8 rounded-3xl bg-gradient-to-br ${value.gradient} hover:shadow-lg transition-all duration-300`}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: false, amount: 0.3 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-start gap-4">
                  <motion.div 
                    className="flex-shrink-0"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    {value.icon}
                  </motion.div>
                  <div>
                    <h4 className="mb-3 text-2xl font-bold text-gray-800">{value.title}</h4>
                    <p className="leading-relaxed text-gray-700">{value.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-indigo-50">
        <div className="max-w-6xl px-4 mx-auto">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false, amount: 0.3 }}
          >
            <h2 className="mb-4 text-4xl font-bold text-gray-800">Leadership Team</h2>
            <p className="text-xl text-gray-600">Meet the visionaries behind our success</p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {team.map((member, index) => (
              <motion.div
                key={index}
                className="p-6 text-center transition-all duration-300 bg-white shadow-lg rounded-2xl hover:shadow-xl"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: false, amount: 0.3 }}
                whileHover={{ y: -10 }}
              >
                <div className="relative mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="object-cover w-24 h-24 mx-auto rounded-full"
                  />
                  <div className="absolute w-6 h-6 transform -translate-x-1/2 bg-green-500 border-2 border-white rounded-full -bottom-2 left-1/2"></div>
                </div>
                <h4 className="mb-1 text-xl font-bold text-gray-800">{member.name}</h4>
                <p className="mb-3 font-semibold text-blue-600">{member.position}</p>
                <p className="mb-4 text-sm text-gray-600">{member.bio}</p>
                <motion.button
                  className="text-blue-600 transition-colors duration-300 hover:text-blue-800"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl px-4 mx-auto">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false, amount: 0.3 }}
          >
            <h2 className="mb-4 text-4xl font-bold text-gray-800">Recognition & Awards</h2>
            <p className="text-xl text-gray-600">Industry recognition for our innovative solutions</p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-6 p-6 transition-all duration-300 border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl hover:shadow-lg"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: false, amount: 0.3 }}
                whileHover={{ x: 10 }}
              >
                <div className="p-3 text-blue-600 bg-blue-100 rounded-lg">
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <h4 className="mb-1 text-lg font-bold text-gray-800">{achievement.title}</h4>
                  <p className="mb-1 text-gray-600">{achievement.organization}</p>
                  <span className="text-sm font-semibold text-blue-600">{achievement.year}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Culture Section */}
      <section className="py-20 text-white bg-gradient-to-r from-blue-900 to-indigo-900">
        <div className="max-w-6xl px-4 mx-auto">
          <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: false, amount: 0.3 }}
            >
              <h2 className="mb-6 text-4xl font-bold">Our Culture</h2>
              <p className="mb-8 text-xl leading-relaxed">
                We believe that great companies are built by great people. Our culture is rooted in 
                collaboration, innovation, and a shared commitment to making work better for everyone.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-300">500+</div>
                  <div className="text-sm opacity-90">Team Members</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-300">40+</div>
                  <div className="text-sm opacity-90">Countries</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-300">95%</div>
                  <div className="text-sm opacity-90">Employee Satisfaction</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-300">4.8/5</div>
                  <div className="text-sm opacity-90">Glassdoor Rating</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: false, amount: 0.3 }}
            >
              <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <Briefcase className="w-6 h-6 text-blue-300" />
                  <h4 className="text-xl font-bold">Remote-First</h4>
                </div>
                <p className="opacity-90">Flexible work arrangements that prioritize work-life balance</p>
              </div>
              
              <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <Users className="w-6 h-6 text-blue-300" />
                  <h4 className="text-xl font-bold">Inclusive</h4>
                </div>
                <p className="opacity-90">Diverse teams from around the world working toward common goals</p>
              </div>
              
              <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <TrendingUp className="w-6 h-6 text-blue-300" />
                  <h4 className="text-xl font-bold">Growth-Oriented</h4>
                </div>
                <p className="opacity-90">Continuous learning and development opportunities for all</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default OurStoryPage;
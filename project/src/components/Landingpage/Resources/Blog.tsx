import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Calendar, Clock, Eye, Heart, MessageCircle, Share2, Tag, User } from 'lucide-react';
import React, { useRef, useState } from 'react';

const blogPosts = [
  {
    id: 1,
    title: "The Future of Artificial Intelligence in Business Transformation",
    excerpt: "Explore how AI is revolutionizing industries and creating new opportunities for innovation and growth.",
    content: "Artificial Intelligence has evolved from a futuristic concept to a practical tool that's reshaping how businesses operate. From automating routine tasks to providing deep insights through data analysis, AI is becoming an essential component of modern business strategy.",
    author: "Sarah Chen",
    authorRole: "Tech Strategy Lead",
    authorAvatar: "SC",
    publishDate: "2024-07-20",
    readTime: "8 min",
    category: "Technology",
    tags: ["AI", "Business", "Innovation", "Future"],
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
    views: 2840,
    likes: 124,
    comments: 18
  },
  {
    id: 2,
    title: "Building Sustainable Remote Work Culture in 2024",
    excerpt: "Learn the essential strategies for creating and maintaining a thriving remote work environment.",
    content: "The shift to remote work has fundamentally changed how we think about productivity, collaboration, and work-life balance. Companies that embrace this change thoughtfully are seeing improved employee satisfaction and business outcomes.",
    author: "Michael Rodriguez",
    authorRole: "People Operations Director",
    authorAvatar: "MR",
    publishDate: "2024-07-18",
    readTime: "6 min",
    category: "Workplace",
    tags: ["Remote Work", "Culture", "Productivity", "Leadership"],
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=400&fit=crop",
    views: 1920,
    likes: 89,
    comments: 12
  },
  {
    id: 3,
    title: "Cybersecurity Best Practices for Modern Enterprises",
    excerpt: "Essential security measures every organization needs to implement to protect against evolving threats.",
    content: "As digital transformation accelerates, cybersecurity has become more critical than ever. Organizations must adopt a comprehensive approach to security that includes both technology solutions and human awareness training.",
    author: "Emily Watson",
    authorRole: "Security Architect",
    authorAvatar: "EW",
    publishDate: "2024-07-15",
    readTime: "10 min",
    category: "Security",
    tags: ["Cybersecurity", "Enterprise", "Risk Management", "Technology"],
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=400&fit=crop",
    views: 3210,
    likes: 156,
    comments: 24
  },
  {
    id: 4,
    title: "Data-Driven Decision Making: A Complete Guide",
    excerpt: "Transform your business decisions with the power of data analytics and business intelligence.",
    content: "In today's data-rich environment, organizations that can effectively harness and analyze their data gain a significant competitive advantage. This comprehensive guide covers the essential tools and methodologies for data-driven decision making.",
    author: "David Kim",
    authorRole: "Data Science Lead",
    authorAvatar: "DK",
    publishDate: "2024-07-12",
    readTime: "12 min",
    category: "Analytics",
    tags: ["Data Science", "Analytics", "Business Intelligence", "Strategy"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
    views: 2650,
    likes: 98,
    comments: 15
  },
  {
    id: 5,
    title: "Sustainable Technology: Green Solutions for Digital Growth",
    excerpt: "Discover how organizations are balancing technological advancement with environmental responsibility.",
    content: "The intersection of technology and sustainability presents both challenges and opportunities. Forward-thinking companies are finding innovative ways to reduce their environmental impact while maintaining technological excellence.",
    author: "Lisa Thompson",
    authorRole: "Sustainability Officer",
    authorAvatar: "LT",
    publishDate: "2024-07-10",
    readTime: "7 min",
    category: "Sustainability",
    tags: ["Green Tech", "Sustainability", "Environment", "Innovation"],
    image: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800&h=400&fit=crop",
    views: 1780,
    likes: 72,
    comments: 9
  },
  {
    id: 6,
    title: "The Evolution of Cloud Computing: What's Next?",
    excerpt: "Exploring the latest trends in cloud technology and their impact on business operations.",
    content: "Cloud computing continues to evolve rapidly, with new services and capabilities emerging regularly. Understanding these trends is crucial for organizations planning their digital infrastructure for the future.",
    author: "Robert Zhang",
    authorRole: "Cloud Solutions Architect",
    authorAvatar: "RZ",
    publishDate: "2024-07-08",
    readTime: "9 min",
    category: "Cloud",
    tags: ["Cloud Computing", "Infrastructure", "Technology", "Scalability"],
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop",
    views: 2980,
    likes: 142,
    comments: 21
  }
];

const categories = [
  { name: "All", count: blogPosts.length, color: "from-blue-500 to-blue-600" },
  { name: "Technology", count: 3, color: "from-purple-500 to-purple-600" },
  { name: "Workplace", count: 1, color: "from-green-500 to-green-600" },
  { name: "Security", count: 1, color: "from-red-500 to-red-600" },
  { name: "Analytics", count: 1, color: "from-orange-500 to-orange-600" },
];

const featuredPost = blogPosts[0];

const AnimatedCounter = ({ target, label, suffix = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

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

const BlogPage = () => {
  const containerRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [likedPosts, setLikedPosts] = useState(new Set());

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

  const filteredPosts = selectedCategory === "All" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const handleLike = (postId) => {
    setLikedPosts(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(postId)) {
        newLiked.delete(postId);
      } else {
        newLiked.add(postId);
      }
      return newLiked;
    });
  };

  return (
    <div ref={containerRef} className="min-h-screen overflow-hidden bg-gray-50">
      {/* Hero Section with Parallax */}
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
            Our{" "}
            <motion.span 
              className="text-blue-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              Blog
            </motion.span>
          </motion.h1>
          
          <motion.p 
            className="mb-8 text-xl leading-relaxed text-blue-100 md:text-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Insights, trends, and expert perspectives on technology, business, and innovation.
          </motion.p>

          <motion.div 
            className="flex flex-wrap justify-center gap-8 mt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <AnimatedCounter target={50} suffix="+" label="Articles Published" />
            <AnimatedCounter target={25} suffix="K+" label="Monthly Readers" />
            <AnimatedCounter target={15} suffix="+" label="Expert Authors" />
            <AnimatedCounter target={95} suffix="%" label="Reader Satisfaction" />
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

      {/* Featured Article */}
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
              Featured Article
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              Our latest insights and trending topics in technology and business
            </p>
          </motion.div>

          <motion.div 
            className="overflow-hidden bg-white shadow-2xl rounded-3xl"
            variants={itemVariants}
            whileHover={cardHoverVariants.hover}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative overflow-hidden">
                <img 
                  src={featuredPost.image} 
                  alt={featuredPost.title}
                  className="object-cover w-full h-64 lg:h-full transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-blue-600 rounded-full">
                    Featured
                  </span>
                </div>
              </div>
              
              <div className="p-8 lg:p-12">
                <div className="flex items-center mb-4 text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{new Date(featuredPost.publishDate).toLocaleDateString()}</span>
                  <Clock className="w-4 h-4 ml-4 mr-2" />
                  <span>{featuredPost.readTime} read</span>
                </div>
                
                <h3 className="mb-4 text-2xl font-bold text-gray-900 lg:text-3xl">
                  {featuredPost.title}
                </h3>
                
                <p className="mb-6 text-gray-600 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-10 h-10 mr-3 text-sm font-bold text-white bg-blue-600 rounded-full">
                      {featuredPost.authorAvatar}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{featuredPost.author}</p>
                      <p className="text-sm text-gray-500">{featuredPost.authorRole}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-gray-500">
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      <span className="text-sm">{featuredPost.views}</span>
                    </div>
                    <button 
                      onClick={() => handleLike(featuredPost.id)}
                      className="flex items-center hover:text-red-500 transition-colors"
                    >
                      <Heart className={`w-4 h-4 mr-1 ${likedPosts.has(featuredPost.id) ? 'fill-red-500 text-red-500' : ''}`} />
                      <span className="text-sm">{featuredPost.likes + (likedPosts.has(featuredPost.id) ? 1 : 0)}</span>
                    </button>
                  </div>
                </div>
                
                <motion.button
                  className="inline-flex items-center px-6 py-3 font-semibold text-white transition-all duration-300 bg-blue-600 rounded-xl hover:bg-blue-700 group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Read Full Article
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Categories Filter */}
      <motion.section 
        className="py-12 bg-blue-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="px-4 mx-auto max-w-7xl">
          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            variants={containerVariants}
          >
            {categories.map((category, idx) => (
              <motion.button
                key={idx}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  selectedCategory === category.name
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-blue-100'
                }`}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.name)}
              >
                {category.name} ({category.count})
              </motion.button>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Blog Posts Grid */}
      <motion.section 
        className="py-20 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="px-4 mx-auto max-w-7xl">
          <motion.div 
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
          >
            {filteredPosts.slice(1).map((post, idx) => (
              <motion.article
                key={post.id}
                className="overflow-hidden bg-white shadow-lg rounded-2xl group"
                variants={itemVariants}
                whileHover={cardHoverVariants.hover}
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="object-cover w-full h-48 transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-blue-600 rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center mb-3 text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{new Date(post.publishDate).toLocaleDateString()}</span>
                    <Clock className="w-4 h-4 ml-4 mr-2" />
                    <span>{post.readTime}</span>
                  </div>
                  
                  <h3 className="mb-3 text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="mb-4 text-gray-600 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 2).map((tag, tagIdx) => (
                      <span 
                        key={tagIdx}
                        className="px-2 py-1 text-xs text-blue-600 bg-blue-100 rounded-lg"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-8 h-8 mr-2 text-xs font-bold text-white bg-blue-600 rounded-full">
                        {post.authorAvatar}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{post.author}</p>
                        <p className="text-xs text-gray-500">{post.authorRole}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 text-gray-500">
                      <div className="flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        <span className="text-xs">{post.views}</span>
                      </div>
                      <button 
                        onClick={() => handleLike(post.id)}
                        className="flex items-center hover:text-red-500 transition-colors"
                      >
                        <Heart className={`w-3 h-3 mr-1 ${likedPosts.has(post.id) ? 'fill-red-500 text-red-500' : ''}`} />
                        <span className="text-xs">{post.likes + (likedPosts.has(post.id) ? 1 : 0)}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </motion.section>

     
    </div>
  );
};

export default BlogPage;
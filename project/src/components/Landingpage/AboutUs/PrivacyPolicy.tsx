
import React, { useEffect, useRef } from 'react';
import { 
  Shield, 
  Lock, 
  Eye, 
  Users, 
  Database, 
  Globe, 
  FileText, 
  Mail, 
  Phone, 
  Calendar,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Cookie,
  Share2
} from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          } else {
            entry.target.classList.remove('animate-in');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  const privacySections = [
    {
      id: 'overview',
      title: 'Privacy Overview',
      icon: Shield,
      content: `At VirtuosoU, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our recruiting platform and services. We believe transparency is key to building trust with our users.`
    },
    {
      id: 'information-collection',
      title: 'Information We Collect',
      icon: Database,
      subsections: [
        {
          title: 'Personal Information',
          items: [
            'Full name, email address, phone number, and mailing address',
            'Professional information including resume, work history, and skills assessment',
            'Educational background, certifications, and professional licenses',
            'Profile photos, professional headshots, and portfolio materials',
            'Communication preferences and notification settings'
          ]
        },
        {
          title: 'Account Information',
          items: [
            'Username, encrypted password, and security credentials',
            'Subscription details, billing information, and payment history',
            'Platform usage statistics and interaction analytics',
            'Security logs, authentication data, and access patterns'
          ]
        },
        {
          title: 'Technical Information',
          items: [
            'IP address, browser type, version, and operating system details',
            'Device identifiers, mobile device information, and hardware specifications',
            'Cookies, web beacons, pixel tags, and similar tracking technologies',
            'Log files, session data, error reports, and performance analytics'
          ]
        }
      ]
    },
    {
      id: 'how-we-use',
      title: 'How We Use Your Information',
      icon: Eye,
      subsections: [
        {
          title: 'Core Platform Services',
          items: [
            'Provide and maintain our comprehensive recruiting platform services',
            'Process job applications and facilitate seamless hiring processes',
            'Match candidates with suitable job opportunities using AI algorithms',
            'Enable communication between employers and job seekers',
            'Maintain user profiles and professional networking features'
          ]
        },
        {
          title: 'Platform Enhancement',
          items: [
            'Improve our services through detailed analytics and user feedback',
            'Develop new features and enhance existing functionality',
            'Personalize user experience and content recommendations',
            'Conduct research and development for platform innovation'
          ]
        },
        {
          title: 'Security & Compliance',
          items: [
            'Prevent fraud, abuse, unauthorized access, and security breaches',
            'Comply with legal obligations and regulatory requirements',
            'Enforce our Terms of Service and community guidelines',
            'Respond to legal requests and protect our users\' rights'
          ]
        }
      ]
    },
    {
      id: 'information-sharing',
      title: 'Information Sharing and Disclosure',
      icon: Share2,
      subsections: [
        {
          title: 'With Your Explicit Consent',
          items: [
            'Share your professional profile with potential employers when you apply',
            'Display public profile information in relevant search results',
            'Enable participation in networking and professional development events',
            'Connect you with industry professionals and career opportunities'
          ]
        },
        {
          title: 'Service Providers & Partners',
          items: [
            'Trusted third-party vendors who assist in platform operations',
            'Cloud storage providers and secure data processing services',
            'Email communication and notification service providers',
            'Payment processors, billing services, and financial institutions'
          ]
        },
        {
          title: 'Legal & Safety Requirements',
          items: [
            'Comply with court orders, subpoenas, and legal processes',
            'Protect our rights, property, safety, and that of our users',
            'Prevent fraud, illegal activities, and terms of service violations',
            'Cooperate with law enforcement and regulatory authorities'
          ]
        }
      ]
    },
    {
      id: 'data-security',
      title: 'Data Security Measures',
      icon: Lock,
      content: `We implement comprehensive industry-standard security measures to protect your personal information. This includes end-to-end encryption, secure server infrastructure, regular security audits, penetration testing, access controls with multi-factor authentication, and employee security training. Our data centers comply with SOC 2 Type II standards. However, while we strive for maximum security, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.`
    },
    {
      id: 'cookies',
      title: 'Cookies and Tracking Technologies',
      icon: Cookie,
      subsections: [
        {
          title: 'Types of Cookies We Use',
          items: [
            'Essential cookies required for core platform functionality and security',
            'Performance cookies to analyze usage patterns and optimize services',
            'Functional cookies to remember your preferences and settings',
            'Marketing cookies for personalized content and targeted advertisements',
            'Analytics cookies to understand user behavior and improve experience'
          ]
        },
        {
          title: 'Cookie Management',
          items: [
            'Control cookie preferences through your browser settings',
            'Use our cookie consent banner to manage tracking preferences',
            'Note that disabling certain cookies may affect platform functionality',
            'Third-party cookies are governed by their respective privacy policies'
          ]
        }
      ]
    },
    {
      id: 'user-rights',
      title: 'Your Privacy Rights',
      icon: Users,
      subsections: [
        {
          title: 'Data Access & Control',
          items: [
            'Access, review, and obtain copies of your personal information',
            'Update, correct, or modify inaccurate or incomplete information',
            'Download a comprehensive copy of your data in portable format',
            'Request deletion of your account and associated personal data',
            'Object to certain types of data processing activities'
          ]
        },
        {
          title: 'Communication & Privacy Settings',
          items: [
            'Opt-out of marketing communications and promotional emails',
            'Customize notification preferences and communication frequency',
            'Control privacy settings and visibility of your professional profile',
            'Manage third-party integrations and data sharing permissions',
            'Withdraw consent for non-essential data processing activities'
          ]
        }
      ]
    },
    {
      id: 'data-retention',
      title: 'Data Retention Policy',
      icon: Calendar,
      content: `We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, comply with legal obligations, resolve disputes, and enforce our agreements. Active account data is retained while your account remains active. When you delete your account, we will remove your personal information within 30 days, except where retention is required by law, ongoing legal proceedings, or legitimate business interests. Anonymized analytics data may be retained indefinitely for research and improvement purposes.`
    },
    {
      id: 'international-transfers',
      title: 'International Data Transfers',
      icon: Globe,
      content: `Your information may be transferred to, stored, and processed in countries other than your own, including the United States, European Union, and other jurisdictions where we or our service providers operate. We ensure appropriate safeguards are in place for international transfers, including standard contractual clauses approved by regulatory authorities, adequacy decisions, and certification schemes such as Privacy Shield frameworks where applicable. These measures ensure your data receives equivalent protection regardless of location.`
    },
    {
      id: 'children-privacy',
      title: 'Children\'s Privacy Protection',
      icon: AlertTriangle,
      content: `Our recruiting platform and services are designed for and intended exclusively for individuals who are at least 16 years of age. We do not knowingly collect, use, or disclose personal information from children under 16. If we become aware that we have collected personal information from a child under 16, we will take immediate steps to delete such information and terminate any associated accounts. Parents or guardians who believe their child has provided information to us should contact our privacy team immediately.`
    },
    {
      id: 'policy-updates',
      title: 'Privacy Policy Updates',
      icon: FileText,
      content: `We may update this Privacy Policy periodically to reflect changes in our practices, services, legal requirements, or industry standards. We will notify you of material changes via email to your registered address, through prominent notices on our platform, or other appropriate communication methods. We encourage you to review this policy regularly. Your continued use of our services after policy updates constitutes acceptance of the revised terms. For significant changes, we may require explicit consent.`
    },
    {
      id: 'contact',
      title: 'Contact Our Privacy Team',
      icon: Mail,
      content: `If you have questions, concerns, or requests regarding this Privacy Policy, our data practices, or your privacy rights, please don't hesitate to contact our dedicated Data Protection Officer and privacy team. We are committed to addressing your inquiries promptly and thoroughly. You may also contact your local data protection authority if you have concerns about our data handling practices.`
    }
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-blue-200/20 to-indigo-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-tr from-purple-200/20 to-pink-200/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-gradient-to-r from-green-200/20 to-blue-200/20 rounded-full blur-xl animate-bounce" style={{ animationDuration: '4s' }}></div>
      </div>

      {/* Header Section */}
      <div 
        ref={addToRefs}
        className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-20 px-4 opacity-0 translate-y-8 transition-all duration-1000 ease-out overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        {/* Floating decorative elements */}
        <div className="absolute top-10 right-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute bottom-10 left-10 w-16 h-16 bg-white/10 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative max-w-4xl mx-auto text-center z-10">
          <div className="mb-6 flex justify-center">
            <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm shadow-2xl animate-pulse">
              <Shield className="h-12 w-12" />
            </div>
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold mb-6 tracking-tight animate-fade-in">
            Privacy Policy
          </h1>
          <p className="text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed animate-fade-in-delay">
            Your privacy is our priority. Learn how we protect and handle your personal information with complete transparency.
          </p>
          <div className="mt-8 flex justify-center">
            <button 
              onClick={scrollToTop}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-300 backdrop-blur-sm hover:scale-105 transform"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Top</span>
            </button>
          </div>
        </div>
      </div>

      {/* Last Updated Notice */}
      <div 
        ref={addToRefs}
        className="max-w-4xl mx-auto px-4 py-8 opacity-0 translate-y-8 transition-all duration-1000 ease-out"
      >
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <span className="text-slate-600 font-medium">Last updated: December 15, 2024</span>
              <p className="text-sm text-slate-500 mt-1">Effective from January 1, 2025</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="max-w-4xl mx-auto px-4 pb-20">
        {privacySections.map((section, index) => (
          <div 
            key={section.id}
            ref={addToRefs}
            className="mb-12 opacity-0 translate-y-8 transition-all duration-1000 ease-out hover:scale-[1.01] transform"
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-500 group">
              {/* Section Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 group-hover:from-blue-700 group-hover:to-indigo-700 transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/20 rounded-xl group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110 transform">
                    <section.icon className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-bold group-hover:translate-x-2 transition-transform duration-300">{section.title}</h2>
                </div>
              </div>

              {/* Section Content */}
              <div className="p-6">
                {section.content && (
                  <div className="relative">
                    <p className="text-slate-700 leading-relaxed text-lg mb-4 group-hover:text-slate-800 transition-colors duration-300">
                      {section.content}
                    </p>
                    <div className="absolute -left-2 top-0 w-1 h-full bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                )}

                {section.subsections?.map((subsection, subIndex) => (
                  <div key={subIndex} className="mb-8 last:mb-0 relative">
                    <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center group-hover:text-blue-700 transition-colors duration-300">
                      <div className="mr-3 p-1 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors duration-300">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      {subsection.title}
                    </h3>
                    <ul className="space-y-3 relative">
                      {subsection.items.map((item, itemIndex) => (
                        <li 
                          key={itemIndex}
                          className="flex items-start space-x-3 text-slate-600 hover:text-slate-800 hover:translate-x-2 transition-all duration-300 group cursor-pointer"
                        >
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2.5 flex-shrink-0 group-hover:bg-indigo-600 group-hover:scale-125 transition-all duration-300"></div>
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Contact CTA Section */}
        <div 
          ref={addToRefs}
          className="opacity-0 translate-y-8 transition-all duration-1000 ease-out"
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white text-center shadow-2xl hover:shadow-3xl hover:scale-[1.02] transition-all duration-500 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            
            <div className="relative z-10">
              <div className="mb-6">
                <div className="inline-flex p-4 bg-white/20 rounded-full mb-4 hover:bg-white/30 transition-all duration-300 hover:scale-110 transform">
                  <Mail className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Questions About Your Privacy?</h3>
                <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                  Our dedicated privacy team is here to help. Contact us anytime for questions, concerns, or data requests.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <a 
                  href="mailto:privacy@virtuosou.com"
                  className="flex items-center justify-center space-x-3 p-4 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-300 backdrop-blur-sm hover:scale-105 transform group"
                >
                  <Mail className="h-5 w-5 group-hover:animate-bounce" />
                  <span>privacy@virtuosou.com</span>
                </a>
                <a 
                  href="tel:+1-555-0123"
                  className="flex items-center justify-center space-x-3 p-4 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-300 backdrop-blur-sm hover:scale-105 transform group"
                >
                  <Phone className="h-5 w-5 group-hover:animate-bounce" />
                  <span>+1 (555) 012-3456</span>
                </a>
              </div>

              {/* Additional Contact Info */}
              <div className="mt-8 pt-6 border-t border-white/20">
                <p className="text-blue-100 text-sm mb-4">
                  <strong>Data Protection Officer:</strong> Sarah Johnson, CIPP/E
                </p>
                <p className="text-blue-100 text-sm">
                  <strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM EST
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Notice */}
        <div 
          ref={addToRefs}
          className="mt-12 opacity-0 translate-y-8 transition-all duration-1000 ease-out"
        >
          <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20">
            <p className="text-slate-600 text-sm leading-relaxed">
              This Privacy Policy is part of our Terms of Service. By using VirtuosoU, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy. 
              <br />
              <span className="font-medium">© 2024 VirtuosoU. All rights reserved.</span>
            </p>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 z-50 group"
        aria-label="Scroll to top"
      >
        <ArrowLeft className="h-6 w-6 rotate-90 group-hover:animate-bounce" />
      </button>

      {/* Custom Styles */}
      <style jsx>{`
        .animate-in {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fadeIn 1s ease-out;
        }
        
        .animate-fade-in-delay {
          animation: fadeIn 1s ease-out 0.3s both;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        /* Smooth scrolling for the entire page */
        html {
          scroll-behavior: smooth;
        }
        
        /* Custom scrollbar styling */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #6366f1);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #4f46e5);
        }
        
        /* Reduce motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
          
          html {
            scroll-behavior: auto;
          }
        }
        
        /* Enhanced hover effects */
        .group:hover .animate-bounce {
          animation: bounce 1s infinite;
        }
        
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
          40%, 43% { transform: translate3d(0,-30px,0); }
          70% { transform: translate3d(0,-15px,0); }
          90% { transform: translate3d(0,-4px,0); }
        }
      `}</style>
    </div>
  );
};

export default PrivacyPolicy;
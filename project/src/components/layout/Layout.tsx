import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Chatbot from '../ui/Chatbot';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900"> {/* ✅ full-page black */}
      <Navbar />
      <Sidebar />
      <main className="flex-1 pt-16 pl-20">
        <div className="container mx-auto px-6 py-8 max-w-7xl dark:bg-gray-900 rounded-xl">
          {children}
        </div>
      </main>
      <Chatbot />
    </div>
  );
};

export default Layout;
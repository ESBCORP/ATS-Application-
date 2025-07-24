import React from 'react';
import LandingNavbar from './LandingNavbar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';
import Chatbot from '../ui/Chatbot';

const LandingLayout = () => {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden bg-gradient-to-b from-white to-gray-50">
      <LandingNavbar />
      <main className="flex-1">
        <Outlet/>
      </main>
     
      <Footer/>
      <Chatbot />
    </div>
  );
};

export default LandingLayout;

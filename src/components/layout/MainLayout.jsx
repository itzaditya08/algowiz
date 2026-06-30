import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../common/Sidebar';
import Header from '../common/Header';
import Footer from '../common/Footer';
import { useTheme } from '../../contexts/ThemeContext';

const MainLayout = ({ children }) => {
  const { isDarkMode } = useTheme();
  const location = useLocation();

  return (
    <div className={`flex h-screen overflow-hidden ${isDarkMode ? 'dark' : ''}`}>
      <Sidebar />
      
      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 bg-light-background dark:bg-dark-background transition-colors duration-300 relative z-0">
        
        {/* Ambient background pattern */}
        <div className="absolute inset-0 bg-dot-pattern -z-10 pointer-events-none"></div>

        <Header />

        <main className="flex-1 overflow-x-hidden overflow-y-auto relative">
          <div className="container mx-auto px-6 py-8 lg:px-8 h-full">
            {/* Page Transition Wrapper */}
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="h-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
            <Footer /> 
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
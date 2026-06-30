import React from 'react';
import ThemeToggle from './ThemeToggle';
import { useLocation } from 'react-router-dom';
import { getTitleAndDescription, getCategoryIcon } from '../../utils/helpers';
import { motion } from 'framer-motion';

const Header = () => {
  const location = useLocation();
  const { title, description } = getTitleAndDescription(location.pathname);
  const Icon = getCategoryIcon(location.pathname);

  // Don't show the header logic on the home page if you want a cleaner landing page, 
  // but keeping it consistent is usually better for app layouts.
  
  return (
    <header className="sticky top-0 z-10 mx-6 mt-4 mb-2 rounded-2xl glass-panel px-6 py-4 flex items-center justify-between shadow-sm">
      <motion.div 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        key={location.pathname}
        className="flex items-center space-x-4"
      >
        {Icon && (
          <div className="p-2.5 rounded-xl bg-primary-blue/10 dark:bg-primary-blue/20">
            <Icon className="w-6 h-6 text-primary-blue" />
          </div>
        )}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
            {title || 'AlgoWiz Dashboard'}
          </h2>
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-medium">
              {description}
            </p>
          )}
        </div>
      </motion.div>
      
      <div className="flex items-center">
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
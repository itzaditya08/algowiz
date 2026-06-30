import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gray-100 dark:bg-dark-card border border-gray-200 dark:border-dark-border text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-blue/50"
      aria-label="Toggle Dark Mode"
    >
      <motion.div
        initial={false}
        animate={{
          scale: isDarkMode ? 0 : 1,
          opacity: isDarkMode ? 0 : 1,
          rotate: isDarkMode ? -90 : 0,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="absolute"
      >
        <Sun className="w-5 h-5" />
      </motion.div>

      <motion.div
        initial={false}
        animate={{
          scale: isDarkMode ? 1 : 0,
          opacity: isDarkMode ? 1 : 0,
          rotate: isDarkMode ? 0 : 90,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="absolute"
      >
        <Moon className="w-5 h-5 text-blue-400" />
      </motion.div>
    </button>
  );
};

export default ThemeToggle;
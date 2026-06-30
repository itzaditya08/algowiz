import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

const HeroSection = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative overflow-hidden glass-panel rounded-3xl p-10 md:p-16 text-center border border-gray-200/50 dark:border-gray-700/50 shadow-2xl shadow-primary-blue/5"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-primary-blue/20 blur-[100px] rounded-full pointer-events-none -z-10"></div>
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="inline-flex items-center space-x-2 bg-primary-blue/10 dark:bg-primary-blue/20 text-primary-blue px-4 py-1.5 rounded-full text-sm font-semibold mb-6"
      >
        <Sparkles className="w-4 h-4" />
        <span>Interactive Computer Science Fundamentals</span>
      </motion.div>
      
      <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 mb-6">
        Master Algorithms <br className="hidden md:block" />
        <span className="text-primary-blue">Visually</span>
      </h1>
      
      <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
        AlgoWiz brings code to life. Visualize, compare, and truly understand complex data structures, scheduling policies, and graph algorithms through interactive simulations.
      </p>
      
      <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
        <Link
          to="/graph-algorithms"
          className="group flex items-center px-8 py-4 bg-primary-blue text-white rounded-2xl font-bold shadow-lg shadow-primary-blue/30 hover:bg-primary-blue-hover hover:shadow-primary-blue/50 hover:-translate-y-1 transition-all duration-300"
        >
          Start Visualizing
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link
          to="/os-scheduling-algorithms"
          className="px-8 py-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-2xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
        >
          Explore OS Concepts
        </Link>
      </div>
    </motion.div>
  );
};

export default HeroSection;
import React from 'react';
import { motion } from 'framer-motion';
import CategoryCard from './CategoryCard';
import { categories } from '../../data/categories';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const CategoryGrid = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-8 px-2">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Algorithm Categories</h2>
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 px-3 py-1 rounded-full">
          {categories.length} Modules
        </span>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {categories.map((category) => (
          <CategoryCard key={category.title} category={category} />
        ))}
      </motion.div>
    </div>
  );
};

export default CategoryGrid;
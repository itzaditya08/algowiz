import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

const CategoryCard = ({ category }) => {
  const Icon = category.icon;

  return (
    <motion.div variants={itemVariants}>
      <Link to={category.path} className="block h-full outline-none">
        <motion.div
          whileHover={{ y: -6, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="h-full glass-panel p-6 rounded-2xl hover:shadow-xl hover:shadow-primary-blue/10 border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 group flex flex-col"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="p-3.5 rounded-xl bg-gray-100 dark:bg-gray-800 group-hover:bg-primary-blue group-hover:text-white text-primary-blue transition-colors duration-300">
              <Icon className="w-7 h-7" />
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary-blue" />
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-blue transition-colors">
            {category.title}
          </h3>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 line-clamp-2">
            {category.description}
          </p>
          
          <div className="flex flex-wrap gap-2 mt-auto">
            {category.algos.map((algo) => (
              <span
                key={algo}
                className="bg-gray-100 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 text-xs font-semibold px-2.5 py-1 rounded-md border border-gray-200/50 dark:border-gray-700/50"
              >
                {algo}
              </span>
            ))}
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;
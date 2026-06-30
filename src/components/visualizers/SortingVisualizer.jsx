import React from 'react';
import { motion } from 'framer-motion';

const SortingVisualizer = ({ array, activeIndices = [], sortedIndices = [] }) => {
  const maxValue = Math.max(...array.map(d => d.val), 1);

  return (
    <div className="flex items-end justify-center w-full h-full p-4 gap-1 sm:gap-2">
      {array.map((item, index) => {
        const isActive = activeIndices.includes(index);
        const isSorted = sortedIndices.includes(index);
        
        let barColor = 'bg-primary-blue/80 dark:bg-primary-blue/70'; 
        if (isActive) barColor = 'bg-yellow-400 dark:bg-yellow-500 shadow-[0_0_15px_rgba(250,204,21,0.5)]'; 
        else if (isSorted) barColor = 'bg-emerald-400 dark:bg-emerald-500';

        return (
          <motion.div
            key={item.id} 
            layout 
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className={`relative flex flex-col items-center justify-end w-full max-w-[40px] rounded-t-md ${barColor}`}
            style={{ height: `${(item.val / maxValue) * 90}%`, minHeight: '20px' }}
          >
            <span className="absolute -top-6 text-[10px] md:text-xs font-bold text-gray-700 dark:text-gray-300">
              {item.val}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
};

export default SortingVisualizer;
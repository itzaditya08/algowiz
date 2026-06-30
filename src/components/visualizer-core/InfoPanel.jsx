import React from 'react';
import { Info, Clock, Database } from 'lucide-react';

const InfoPanel = ({ title, description, timeComplexity, spaceComplexity, currentStepMsg }) => {
  return (
    <div className="glass-panel rounded-2xl p-5 border border-gray-200/50 dark:border-gray-700/50 shadow-md flex flex-col h-full">
      <div className="flex items-center space-x-2 mb-3">
        <Info className="w-5 h-5 text-primary-blue" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
      </div>
      
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 flex-1">
        {description}
      </p>

      <div className="space-y-4">
        {currentStepMsg && (
          <div className="p-3 rounded-xl bg-primary-blue/10 dark:bg-primary-blue/20 border border-primary-blue/20">
            <p className="text-sm font-semibold text-primary-blue">
              <span className="opacity-75 mr-1">Status:</span> {currentStepMsg}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-1.5 text-gray-500 dark:text-gray-400 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Time</span>
            </div>
            <p className="text-sm font-mono font-bold text-gray-900 dark:text-white">{timeComplexity || 'O(1)'}</p>
          </div>
          
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-1.5 text-gray-500 dark:text-gray-400 mb-1">
              <Database className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Space</span>
            </div>
            <p className="text-sm font-mono font-bold text-gray-900 dark:text-white">{spaceComplexity || 'O(1)'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;
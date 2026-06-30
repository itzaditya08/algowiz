import React from 'react';
import { motion } from 'framer-motion';

const TreeVisualizer = ({ nodes, edges, activeNode, visitedNodes = [], traversalResult = [] }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-2">
      
      {/* Dynamic Canvas Space */}
      <div className="relative w-full h-[350px] sm:h-[450px] bg-white/50 dark:bg-gray-900/50 rounded-2xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50">
        
        {/* SVG Background for Edges */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
          {edges.map((edge, idx) => {
            const isVisitedPath = visitedNodes.includes(edge.target);
            return (
              <line
                key={idx}
                x1={`${edge.sx}%`} y1={`${edge.sy}%`}
                x2={`${edge.tx}%`} y2={`${edge.ty}%`}
                stroke={isVisitedPath ? '#3b82f6' : '#94a3b8'}
                strokeWidth={isVisitedPath ? 3 : 2}
                opacity={isVisitedPath ? 0.8 : 0.3}
                className="transition-all duration-300 ease-in-out"
              />
            );
          })}
        </svg>

        {/* HTML/Framer Motion Layer for Nodes */}
        {nodes.map((node) => {
          const isVisited = visitedNodes.includes(node.value);
          const isActive = activeNode === node.id;

          let bgColor = 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600';
          if (isVisited) bgColor = 'bg-emerald-500 text-white border-emerald-600';
          if (isActive) bgColor = 'bg-yellow-400 text-gray-900 border-yellow-500 shadow-[0_0_20px_rgba(250,204,21,0.6)] z-30';

          return (
            <motion.div
              key={node.id}
              initial={{ scale: 0 }}
              animate={{ scale: isActive ? 1.15 : 1 }}
              className={`absolute w-12 h-12 -ml-6 -mt-6 rounded-full flex items-center justify-center border-4 font-bold text-lg z-20 transition-colors duration-300 ${bgColor}`}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
            >
              {node.value}
            </motion.div>
          );
        })}
      </div>

      {/* Traversal Result Array UI */}
      <div className="w-full mt-4">
        <h4 className="text-xs font-bold tracking-wider uppercase text-gray-400 dark:text-gray-500 mb-2 px-2">
          Traversal Output Array
        </h4>
        <div className="flex flex-wrap items-center gap-2 p-3 min-h-[60px] bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl">
          {traversalResult.length === 0 ? (
            <span className="text-sm italic text-gray-400 px-2">Awaiting Traversal...</span>
          ) : (
            traversalResult.map((val, idx) => (
              <motion.div
                key={`${val}-${idx}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="px-3 py-1.5 bg-primary-blue text-white rounded-lg font-bold shadow-sm"
              >
                {val}
              </motion.div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};

export default TreeVisualizer;
import React from 'react';

const CanvasArea = ({ children }) => {
  return (
    <div className="relative w-full h-[500px] lg:h-full min-h-[400px] glass-panel rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-inner overflow-hidden bg-white/50 dark:bg-gray-900/50 flex items-center justify-center p-6">
      {/* Subtle coordinate grid background for the canvas */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>
      
      {/* Actual Visualizer Content */}
      <div className="relative z-10 w-full h-full flex items-end justify-center">
        {children}
      </div>
    </div>
  );
};

export default CanvasArea;
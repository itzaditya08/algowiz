import React from 'react';

const VisualizerLayout = ({ controls, info, canvas }) => {
  return (
    <div className="flex flex-col h-full gap-4 pb-6">
      {/* Top Bar: Controls */}
      <div className="w-full shrink-0">
        {controls}
      </div>

      {/* Main Content: Split between Info (Sidebar) and Canvas (Main Stage) */}
      <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
        {/* Left Side: Info Panel */}
        <div className="w-full lg:w-80 shrink-0 flex flex-col gap-4">
          {info}
        </div>
        
        {/* Right Side: The Stage */}
        <div className="flex-1 w-full relative">
          {canvas}
        </div>
      </div>
    </div>
  );
};

export default VisualizerLayout;
import React from 'react';
import { Play, Pause, RotateCcw, StepForward, Settings2 } from 'lucide-react';

const ControlPanel = ({ 
  isPlaying, 
  onPlayPause, 
  onReset, 
  onStep, 
  speed, 
  onSpeedChange,
  children // For extra algorithm-specific controls (like array size or graph type)
}) => {
  return (
    <div className="glass-panel rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 border border-gray-200/50 dark:border-gray-700/50 shadow-lg relative z-10">
      
      {/* Primary Playback Controls */}
      <div className="flex items-center space-x-2">
        <button 
          onClick={onPlayPause}
          className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-blue text-white shadow-md shadow-primary-blue/30 hover:bg-primary-blue-hover hover:scale-105 transition-all duration-200 active:scale-95"
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 translate-x-0.5" />}
        </button>
        
        <button 
          onClick={onStep}
          disabled={isPlaying}
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          title="Step Forward"
        >
          <StepForward className="w-5 h-5" />
        </button>

        <button 
          onClick={onReset}
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500 transition-all duration-200"
          title="Reset"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Dynamic Specific Controls (Passed as children) */}
      <div className="flex-1 w-full md:w-auto flex items-center justify-center md:justify-start gap-4 px-4 border-y md:border-y-0 md:border-x border-gray-200 dark:border-gray-700 py-3 md:py-0">
        {children}
      </div>

      {/* Speed Slider */}
      <div className="flex items-center space-x-3 w-full md:w-auto min-w-[200px]">
        <Settings2 className="w-5 h-5 text-gray-400" />
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300 w-12">Speed</span>
        <input 
          type="range" 
          min="1" 
          max="100" 
          value={speed}
          onChange={(e) => onSpeedChange(e.target.value)}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-blue"
        />
      </div>
    </div>
  );
};

export default ControlPanel;
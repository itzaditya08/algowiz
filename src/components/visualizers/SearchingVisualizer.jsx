import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SearchingVisualizer = ({ stepData }) => {
    if (!stepData) return <div className="flex items-center justify-center h-full text-gray-400">Initialize to start...</div>;

    const { array, target, activeIndices, searchRange, foundIndex } = stepData;
    const [lowBound, highBound] = searchRange;

    return (
        <div className="flex flex-col items-center justify-center w-full h-full p-4 space-y-12">
            
            {/* Target Display */}
            <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Target Value</span>
                <div className="px-8 py-3 bg-primary-blue text-white rounded-xl text-3xl font-black shadow-lg shadow-primary-blue/30">
                    {target}
                </div>
            </div>

            {/* Horizontal Array Grid */}
            <div className="w-full max-w-5xl">
                <div className="flex flex-wrap justify-center gap-2 md:gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700">
                    {array.map((val, idx) => {
                        const isActive = activeIndices.includes(idx);
                        const isFound = foundIndex === idx;
                        const isOutOfRange = searchRange.length > 0 && (idx < lowBound || idx > highBound);

                        let style = "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200";
                        if (isOutOfRange) style = "bg-gray-100 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 text-gray-300 dark:text-gray-700 opacity-40";
                        if (isActive) style = "bg-yellow-400 border-yellow-500 text-gray-900 shadow-[0_0_15px_rgba(250,204,21,0.5)] scale-110 z-10";
                        if (isFound) style = "bg-emerald-500 border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)] scale-110 z-20 animate-pulse";

                        return (
                            <div key={idx} className="flex flex-col items-center space-y-2">
                                <motion.div
                                    layout
                                    className={`relative w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-xl border-2 font-bold text-lg md:text-xl transition-all duration-300 ${style}`}
                                >
                                    {val}
                                    {/* Pointer Indicators */}
                                    {!isOutOfRange && searchRange.length > 0 && (
                                        <div className="absolute -bottom-6 w-full flex justify-center">
                                            {idx === lowBound && <span className="text-[10px] font-bold text-primary-blue">L</span>}
                                            {idx === highBound && <span className="text-[10px] font-bold text-rose-500 ml-1">H</span>}
                                        </div>
                                    )}
                                </motion.div>
                                <span className="text-[10px] text-gray-400 font-mono">{idx}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

        </div>
    );
};

export default SearchingVisualizer;
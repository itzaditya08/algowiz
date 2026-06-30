import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

const CacheEvictionVisualizer = ({ stepData, selectedAlgorithm }) => {
    if (!stepData) return (
      <div className="w-full h-full flex items-center justify-center text-gray-400 italic">
        Awaiting simulation start...
      </div>
    );

    const { requestedBlock, cacheState, result, highlightIndex } = stepData;
    const isHit = result === 'hit';

    return (
        <div className="flex flex-col items-center justify-center w-full h-full space-y-10 p-4">
            
            {/* Incoming Request Section */}
            <div className="flex flex-col items-center space-y-3">
                <span className="text-sm font-bold tracking-widest text-gray-500 uppercase">Incoming Request</span>
                <div className="flex items-center space-x-6">
                    <motion.div 
                        key={requestedBlock}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="w-16 h-16 flex items-center justify-center bg-primary-blue text-white rounded-xl text-3xl font-extrabold shadow-lg shadow-primary-blue/30"
                    >
                        {requestedBlock}
                    </motion.div>
                    <ArrowRight className="text-gray-400 w-8 h-8 animate-pulse" />
                </div>
            </div>

            {/* Cache State Grid */}
            <div className="w-full max-w-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-8 shadow-inner">
                <h3 className="text-xs font-bold text-gray-400 mb-6 uppercase tracking-wider text-center">Physical Memory (Cache Frames)</h3>
                
                <div className="flex flex-wrap justify-center gap-4 min-h-[100px]">
                    <AnimatePresence mode="popLayout">
                        {cacheState.map((blockData, index) => {
                            const isHighlighted = index === highlightIndex;
                            let style = "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 border-2 border-gray-200 dark:border-gray-700";
                            
                            if (isHighlighted) {
                                style = isHit 
                                    ? "bg-emerald-500 border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]" 
                                    : "bg-rose-500 border-rose-400 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)]";
                            }

                            return (
                                <motion.div
                                    layout
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: isHighlighted ? 1.1 : 1, opacity: 1 }}
                                    exit={{ scale: 0.5, opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                                    key={`${index}-${blockData.block}`} // Key ensures smooth entering/exiting
                                    className={`relative w-24 h-24 flex flex-col items-center justify-center rounded-2xl transition-colors duration-300 ${style}`}
                                >
                                    <span className="text-3xl font-bold">{blockData.block}</span>
                                    
                                    {/* Algorithm Specific Metadata */}
                                    <span className="absolute bottom-2 text-[10px] font-mono opacity-80 bg-black/10 px-2 py-0.5 rounded-full">
                                        {selectedAlgorithm === 'LRU' && blockData.lastUsed !== undefined && `Time: ${blockData.lastUsed}`}
                                        {selectedAlgorithm === 'LFU' && blockData.frequency !== undefined && `Freq: ${blockData.frequency}`}
                                        {selectedAlgorithm === 'FIFO' && blockData.fifoIndex !== undefined && `Added: ${blockData.fifoIndex}`}
                                    </span>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>
            
            {/* Hit/Miss Status Banner */}
            <motion.div 
                key={stepData.step}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-lg font-bold shadow-sm ${
                    isHit ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' 
                          : 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400'
                }`}
            >
                {isHit ? <CheckCircle2 size={28} /> : <XCircle size={28} />}
                <span>Cache {isHit ? 'Hit' : 'Miss'}</span>
            </motion.div>
        </div>
    );
};

export default CacheEvictionVisualizer;
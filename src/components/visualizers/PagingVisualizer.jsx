import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PagingVisualizer = ({ stepData, referenceString }) => {
    if (!stepData) return <div className="flex items-center justify-center h-full text-gray-400 italic">Initialize to start...</div>;

    const { requestedPage, frames, isHit, highlightIndex, step } = stepData;

    return (
        <div className="flex flex-col items-center justify-between w-full h-full p-6 space-y-8">
            {/* Reference Sequence Ribbon */}
            <div className="w-full max-w-4xl">
                <h4 className="text-xs font-bold tracking-wider uppercase text-gray-400 mb-2">Reference Sequence</h4>
                <div className="flex gap-2 p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-x-auto">
                    {referenceString.map((val, idx) => (
                        <div key={idx} className={`w-10 h-10 shrink-0 flex items-center justify-center font-bold text-sm rounded-lg border-2 transition-all ${
                            idx + 1 === step ? 'bg-primary-blue text-white border-primary-blue scale-110 shadow-md' 
                            : idx + 1 < step ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 border-transparent opacity-50'
                            : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-600'
                        }`}>
                            {val}
                        </div>
                    ))}
                </div>
            </div>

            {/* RAM Frames */}
            <div className="flex flex-col items-center space-y-4">
                <h4 className="text-xs font-bold tracking-wider uppercase text-gray-400">Physical Memory Frames</h4>
                <div className="flex gap-4">
                    <AnimatePresence mode="popLayout">
                        {frames.map((page, idx) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0, scale: idx === highlightIndex ? 1.1 : 1 }}
                                key={`${idx}-${page}`}
                                className={`relative w-20 h-28 flex items-center justify-center rounded-xl border-4 transition-colors ${
                                    idx === highlightIndex 
                                        ? (isHit ? 'bg-emerald-100 border-emerald-500 text-emerald-700' : 'bg-rose-100 border-rose-500 text-rose-700')
                                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200'
                                }`}
                            >
                                <span className="absolute top-2 text-[10px] font-bold text-gray-400">Slot {idx}</span>
                                <span className="text-3xl font-black mt-2">{page}</span>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Status Metric */}
            <div className={`px-6 py-3 rounded-xl font-black text-xl shadow-sm ${
                isHit === null ? 'bg-gray-100 text-gray-400' 
                : isHit ? 'bg-emerald-500 text-white shadow-emerald-500/40' 
                : 'bg-rose-500 text-white shadow-rose-500/40'
            }`}>
                {isHit === null ? 'Standby' : isHit ? 'CACHE HIT' : 'PAGE FAULT'}
            </div>
        </div>
    );
};

export default PagingVisualizer;
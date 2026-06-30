import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DefragmentationVisualizer = ({ stepData }) => {
    if (!stepData) return <div className="flex items-center justify-center h-full text-gray-400">Initialize to start...</div>;

    const { blocks, activeProcess } = stepData;
    const totalMemory = blocks.reduce((acc, b) => acc + b.size, 0);

    return (
        <div className="flex flex-col items-center w-full h-full p-6 space-y-10">
            
            {/* Incoming Process Header */}
            <div className="flex flex-col items-center justify-center h-24">
                <AnimatePresence mode="wait">
                    {activeProcess ? (
                        <motion.div 
                            key={activeProcess.id}
                            initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
                            className="px-6 py-3 bg-yellow-400 text-gray-900 rounded-xl font-black shadow-lg"
                        >
                            Process {activeProcess.id} requires {activeProcess.size}KB
                        </motion.div>
                    ) : (
                        <div className="text-gray-400 italic text-sm">Waiting for allocation step...</div>
                    )}
                </AnimatePresence>
            </div>

            {/* Linear Memory Block Representation */}
            <div className="w-full max-w-4xl relative">
                <div className="flex w-full h-32 bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700 shadow-inner">
                    <AnimatePresence>
                        {blocks.map((block, idx) => {
                            const widthPercent = (block.size / totalMemory) * 100;
                            return (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    key={`block-${idx}-${block.processId || 'free'}`}
                                    className={`relative h-full flex flex-col items-center justify-center border-r border-gray-300/50 dark:border-gray-700/50 ${
                                        block.isFree ? 'bg-transparent text-gray-400' : 'bg-primary-blue text-white shadow-lg'
                                    }`}
                                    style={{ width: `${widthPercent}%` }}
                                >
                                    {/* Data Labels inside block */}
                                    {widthPercent > 5 && (
                                        <>
                                            <span className="font-bold text-lg">{block.isFree ? 'Free' : `P${block.processId}`}</span>
                                            <span className={`text-xs ${block.isFree ? 'text-gray-400' : 'text-primary-blue-200'}`}>{block.size}KB</span>
                                        </>
                                    )}
                                    
                                    {/* Hatch pattern for free space */}
                                    {block.isFree && (
                                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)', backgroundSize: '10px 10px' }}></div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
                
                {/* Metric Ruler Base */}
                <div className="flex justify-between w-full mt-2 text-[10px] text-gray-400 font-mono">
                    <span>0KB</span>
                    <span>Total: {totalMemory}KB</span>
                </div>
            </div>
        </div>
    );
};

export default DefragmentationVisualizer;
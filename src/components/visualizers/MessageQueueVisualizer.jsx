import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, Server, Database, ArrowRightLeft } from 'lucide-react';

const MessageQueueVisualizer = ({ stepData }) => {
    if (!stepData) return <div className="flex items-center justify-center h-full text-gray-400 italic">Initialize to start...</div>;

    const { producers, queues, consumers } = stepData;

    return (
        <div className="flex flex-col md:flex-row items-center justify-between w-full h-full p-4 md:p-8 gap-6 md:gap-4">
            
            {/* Left Column: Producers / Publishers */}
            <div className="flex flex-col space-y-6 w-full md:w-1/4 items-center">
                <h4 className="text-xs font-bold tracking-wider text-gray-400 uppercase">Senders</h4>
                {producers.map(p => (
                    <div key={p.id} className="w-full bg-white dark:bg-gray-800 border-2 border-primary-blue/30 rounded-2xl p-4 flex flex-col items-center shadow-lg relative">
                        <Monitor className="w-8 h-8 text-primary-blue mb-2" />
                        <span className="font-bold text-sm text-gray-900 dark:text-white">{p.id}</span>
                        <span className="text-[10px] font-mono text-gray-500 mt-2 px-2 py-1 bg-gray-100 dark:bg-gray-900 rounded-md w-full text-center truncate">
                            {p.state}
                        </span>
                        {p.state !== 'idle' && (
                            <span className="absolute -right-2 top-1/2 -translate-y-1/2 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-blue opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-blue"></span>
                            </span>
                        )}
                    </div>
                ))}
            </div>

            {/* Middle Column: Queues / Brokers */}
            <div className="flex flex-col space-y-8 w-full md:w-2/5 items-center justify-center">
                <ArrowRightLeft className="text-gray-300 dark:text-gray-700 w-8 h-8 hidden md:block" />
                {Object.entries(queues).map(([qName, messages]) => (
                    <div key={qName} className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-4 flex flex-col">
                        <div className="flex items-center space-x-2 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                            <Database className="w-5 h-5 text-gray-500" />
                            <span className="font-bold text-sm uppercase tracking-wide text-gray-600 dark:text-gray-300">{qName}</span>
                        </div>
                        
                        {/* Messages Track */}
                        <div className="flex gap-2 min-h-[50px] overflow-x-auto p-2 bg-gray-200/50 dark:bg-gray-800/50 rounded-xl items-center">
                            <AnimatePresence mode="popLayout">
                                {messages.length === 0 ? (
                                    <span className="text-xs italic text-gray-400 w-full text-center">Empty</span>
                                ) : (
                                    messages.map((msg, idx) => (
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0, scale: 0.5, x: -20 }}
                                            animate={{ opacity: 1, scale: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.5, x: 20 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                            key={`${msg}-${idx}`}
                                            className="px-3 py-2 bg-emerald-500 text-white text-xs font-bold rounded-lg whitespace-nowrap shadow-md"
                                        >
                                            {msg}
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                ))}
                <ArrowRightLeft className="text-gray-300 dark:text-gray-700 w-8 h-8 hidden md:block" />
            </div>

            {/* Right Column: Consumers / Subscribers */}
            <div className="flex flex-col space-y-6 w-full md:w-1/4 items-center">
                <h4 className="text-xs font-bold tracking-wider text-gray-400 uppercase">Receivers</h4>
                {consumers.map(c => (
                    <div key={c.id} className="w-full bg-white dark:bg-gray-800 border-2 border-emerald-500/30 rounded-2xl p-4 flex flex-col items-center shadow-lg relative">
                        <Server className="w-8 h-8 text-emerald-500 mb-2" />
                        <span className="font-bold text-sm text-gray-900 dark:text-white">{c.id}</span>
                        <span className={`text-[10px] font-mono mt-2 px-2 py-1 rounded-md w-full text-center truncate transition-colors ${c.state !== 'idle' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300' : 'bg-gray-100 text-gray-500 dark:bg-gray-900 dark:text-gray-400'}`}>
                            {c.state}
                        </span>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default MessageQueueVisualizer;
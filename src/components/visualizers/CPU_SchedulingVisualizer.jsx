import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CPU_SchedulingVisualizer = ({ time, readyQueue, activeProcessId, ganttChart, processesState }) => {
    return (
        <div className="flex flex-col w-full h-full p-4 space-y-6">
            
            {/* CPU Clock and Active Core */}
            <div className="flex items-center space-x-6">
                <div className="flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl w-32 shrink-0">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Clock</span>
                    <span className="text-3xl font-black text-primary-blue">{time}ms</span>
                </div>

                <div className="flex-1 flex flex-col justify-center min-h-[90px] p-4 bg-gray-50 dark:bg-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Executing (CPU Core)</span>
                    {activeProcessId ? (
                        <motion.div 
                            key={activeProcessId}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="px-6 py-2 bg-yellow-400 text-gray-900 font-black rounded-lg shadow-md self-start"
                        >
                            Process {activeProcessId}
                        </motion.div>
                    ) : (
                        <span className="text-sm font-bold text-gray-400 italic">Idle</span>
                    )}
                </div>
            </div>

            {/* Ready Queue */}
            <div className="w-full">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Ready Queue</h4>
                <div className="flex gap-2 p-3 bg-gray-100 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 min-h-[60px] overflow-x-auto items-center">
                    <AnimatePresence mode="popLayout">
                        {readyQueue.length === 0 && <span className="text-xs text-gray-400 italic w-full text-center">Empty</span>}
                        {readyQueue.map(pid => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                key={`rq-${pid}-${Math.random()}`}
                                className="px-4 py-1.5 bg-primary-blue text-white rounded-md font-bold text-sm shrink-0 shadow-sm"
                            >
                                P{pid}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Process Metrics Table */}
            <div className="w-full overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-gray-100 dark:bg-gray-800 text-xs font-bold uppercase tracking-wider text-gray-500">
                        <tr>
                            <th className="p-3">Process</th>
                            <th className="p-3">Arrival</th>
                            <th className="p-3">Burst</th>
                            <th className="p-3">Progress</th>
                            <th className="p-3">TAT</th>
                            <th className="p-3">WT</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {processesState.map((p) => (
                            <tr key={p.id} className={activeProcessId === p.id ? 'bg-primary-blue/5 dark:bg-primary-blue/10' : ''}>
                                <td className="p-3 font-bold">P{p.id}</td>
                                <td className="p-3">{p.arrivalTime}ms</td>
                                <td className="p-3">{p.burstTime}ms</td>
                                <td className="p-3 w-40">
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                                        <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${((p.burstTime - p.remainingTime) / p.burstTime) * 100}%` }} />
                                    </div>
                                </td>
                                <td className="p-3 font-mono">{p.completionTime > 0 ? `${p.turnaroundTime}ms` : '-'}</td>
                                <td className="p-3 font-mono">{p.completionTime > 0 ? `${p.waitingTime}ms` : '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CPU_SchedulingVisualizer;
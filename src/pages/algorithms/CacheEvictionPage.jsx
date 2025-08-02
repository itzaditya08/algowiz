import React, { useState } from 'react';
import CacheEvictionVisualizer from '../../components/visualizers/CacheEvictionVisualizer';
import { fifo, lru, lfu, random } from '../../utils/algorithms/cache';
import { SlidersHorizontal, ListChecks, Database, Activity, History } from 'lucide-react';

const cacheAlgorithms = [
    { name: 'FIFO', func: fifo, desc: 'First-In, First-Out.' },
    { name: 'LRU', func: lru, desc: 'Least Recently Used.' },
    { name: 'LFU', func: lfu, desc: 'Least Frequently Used.' },
    { name: 'Random', func: random, desc: 'Evicts a random block.' },
];

const ControlCard = ({ title, icon, children }) => (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
            {icon}
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">{title}</h2>
        </div>
        <div className="p-4 space-y-4">{children}</div>
    </div>
);

const CacheEvictionPage = () => {
    const [cacheSize, setCacheSize] = useState(4);
    const [refStringInput, setRefStringInput] = useState('1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5');
    const [selectedAlgorithm, setSelectedAlgorithm] = useState(cacheAlgorithms[0].name);
    const [steps, setSteps] = useState([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(-1);
    const [simulationStatus, setSimulationStatus] = useState('idle');
    const handleRunSimulation = () => { if (refStringInput === '' || cacheSize <= 0) return; const parsedRefString = refStringInput.split(/[,\s]+/).map(Number).filter(n => !isNaN(n)); const algo = cacheAlgorithms.find(a => a.name === selectedAlgorithm); const generatedSteps = algo.func(parsedRefString, cacheSize); setSteps(generatedSteps); setCurrentStepIndex(generatedSteps.length - 1); setSimulationStatus('finished'); };
    const handleStepByStep = () => { if (simulationStatus === 'idle') { if (refStringInput === '' || cacheSize <= 0) return; const parsedRefString = refStringInput.split(/[,\s]+/).map(Number).filter(n => !isNaN(n)); const algo = cacheAlgorithms.find(a => a.name === selectedAlgorithm); const generatedSteps = algo.func(parsedRefString, cacheSize); setSteps(generatedSteps); setCurrentStepIndex(0); setSimulationStatus('running'); } else if (currentStepIndex < steps.length - 1) { setCurrentStepIndex(prevIndex => prevIndex + 1); } else { setSimulationStatus('finished'); } };
    const handleReset = () => { setCacheSize(4); setRefStringInput('1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5'); setSelectedAlgorithm(cacheAlgorithms[0].name); setSteps([]); setCurrentStepIndex(-1); setSimulationStatus('idle'); };

    const currentStepData = steps[currentStepIndex];
    const metrics = steps.length > 0 ? steps[steps.length - 1] : null;
    const refStringArray = refStringInput.split(/[,\s]+/).map(Number).filter(n => !isNaN(n));
    const totalRequests = refStringArray.length;

    const inputBaseClass = "w-full p-2 border rounded-md bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition";

    return (
        <div className="p-4 space-y-6 dark:bg-slate-900 min-h-screen">
             <div className="text-center">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Cache Eviction Policies</h1>
                <p className="text-md text-slate-600 dark:text-slate-400">Explore cache eviction policies like LRU, FIFO, and LFU.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Controls Column */}
                <div className="lg:col-span-1 space-y-6">
                    <ControlCard title="Algorithm" icon={<ListChecks className="text-slate-500" />}>
                        <div className="grid grid-cols-2 gap-2">
                            {cacheAlgorithms.map(algo => (
                                <label key={algo.name} className={`p-3 rounded-lg cursor-pointer transition-all border-2 text-center ${selectedAlgorithm === algo.name ? 'bg-indigo-50 dark:bg-indigo-900/50 border-indigo-500' : 'bg-slate-100 dark:bg-slate-700/50 border-transparent hover:border-slate-300 dark:hover:border-slate-600'}`}>
                                    <input type="radio" name="cacheAlgorithm" value={algo.name} checked={selectedAlgorithm === algo.name} onChange={(e) => setSelectedAlgorithm(e.target.value)} className="hidden"/>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200 block">{algo.name}</span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400">{algo.desc}</span>
                                </label>
                            ))}
                        </div>
                    </ControlCard>

                    <ControlCard title="Configuration" icon={<SlidersHorizontal className="text-slate-500" />}>
                        <div>
                            <label htmlFor="cacheSize" className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Cache Size</label>
                            <input type="number" id="cacheSize" value={cacheSize} onChange={(e) => setCacheSize(Math.max(1, parseInt(e.target.value)))} min="1" className={inputBaseClass} />
                        </div>
                        <div>
                            <label htmlFor="refString" className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Reference String</label>
                            <input type="text" id="refString" value={refStringInput} onChange={(e) => setRefStringInput(e.target.value)} placeholder="e.g., 1, 2, 3, 4, 1" className={inputBaseClass} />
                        </div>
                        <div className="grid grid-cols-3 gap-2 pt-2">
                            <button onClick={handleRunSimulation} className="bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 transition font-semibold disabled:opacity-50" disabled={simulationStatus === 'running'}>Run</button>
                            <button onClick={handleStepByStep} className="bg-emerald-500 text-white p-2 rounded-md hover:bg-emerald-600 transition font-semibold disabled:opacity-50" disabled={simulationStatus === 'finished'}>Step</button>
                            <button onClick={handleReset} className="bg-rose-500 text-white p-2 rounded-md hover:bg-rose-600 transition font-semibold">Reset</button>
                        </div>
                    </ControlCard>

                    {metrics && (
                        <ControlCard title="Performance" icon={<Activity className="text-slate-500" />}>
                            <div className="text-sm space-y-2 text-slate-700 dark:text-slate-300">
                                <div className="flex justify-between"><span>Total Requests:</span><span className="font-bold">{totalRequests}</span></div>
                                <div className="flex justify-between text-emerald-600 dark:text-emerald-400"><span>Cache Hits:</span><span className="font-bold">{metrics.totalHits}</span></div>
                                <div className="flex justify-between text-rose-600 dark:text-rose-400"><span>Cache Misses:</span><span className="font-bold">{metrics.totalMisses}</span></div>
                                <div className="flex justify-between"><span>Hit Ratio:</span><span className="font-bold font-mono">{totalRequests > 0 ? ((metrics.totalHits / totalRequests) * 100).toFixed(1) : 0}%</span></div>
                            </div>
                        </ControlCard>
                    )}
                </div>

                {/* Right Content Column */}
                <div className="lg:col-span-2 space-y-6">
                    <ControlCard title="Simulation" icon={<Database className="text-slate-500" />}>
                        <div className="flex items-center justify-center min-h-[250px]">
                            {currentStepData ? <CacheEvictionVisualizer stepData={currentStepData} selectedAlgorithm={selectedAlgorithm} /> : <p className="text-slate-500">Run or step through a simulation to begin.</p>}
                        </div>
                    </ControlCard>

                    {steps.length > 0 && (
                        <ControlCard title="History" icon={<History className="text-slate-500" />}>
                            <div className="overflow-auto max-h-96 rounded-lg border dark:border-slate-700">
                                <table className="min-w-full table-auto text-sm">
                                    <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800">
                                        <tr className="text-left font-semibold text-slate-500 dark:text-slate-400">
                                            <th className="p-2">Step</th><th className="p-2">Request</th><th className="p-2">Cache State</th><th className="p-2">Result</th><th className="p-2">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="dark:text-slate-300">
                                        {steps.slice(0, currentStepIndex + 1).map((step, index) => (
                                            <tr key={index} className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                                <td className="p-2 text-slate-500 font-mono">{step.step}</td>
                                                <td className="p-2 font-bold">{step.requestedBlock}</td>
                                                <td className="p-2 font-mono">[{step.cacheState.map(item => item.block).join(', ')}]</td>
                                                <td className={`p-2 font-bold ${step.result === 'hit' ? 'text-emerald-500' : 'text-rose-500'}`}>{step.result}</td>
                                                <td className="p-2 text-slate-500">{step.action}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </ControlCard>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CacheEvictionPage;

import React, { useState } from 'react';
import PagingVisualizer from '../../components/visualizers/PagingVisualizer';
import { fifo, lru, optimal } from '../../utils/algorithms/paging';
import { ListChecks, Settings2, PlayCircle, BarChart2, History, RotateCcw, SkipForward } from 'lucide-react';

const pagingAlgorithms = [
    { name: 'FIFO', func: fifo, desc: 'Evicts the oldest page in memory.' },
    { name: 'LRU', func: lru, desc: 'Evicts the page least recently used.' },
    { name: 'Optimal', func: optimal, desc: 'Evicts the page not used for the longest time.' },
];

// Reusable card component for a consistent UI
const ControlCard = ({ title, icon, children }) => (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
            {icon}
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">{title}</h3>
        </div>
        <div className="p-4 space-y-4">
            {children}
        </div>
    </div>
);

const PagingPage = () => {
    const [numFrames, setNumFrames] = useState(3);
    const [refStringInput, setRefStringInput] = useState('1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5');
    const [selectedAlgorithm, setSelectedAlgorithm] = useState(pagingAlgorithms[0].name);
    const [steps, setSteps] = useState([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(-1);
    const [simulationStatus, setSimulationStatus] = useState('idle'); // idle, running, finished

    const prepareAndSetSteps = () => {
        const parsedRefString = refStringInput.split(/[,\s]+/).map(Number).filter(n => !isNaN(n));
        if (parsedRefString.length === 0 || numFrames <= 0) {
            alert('Please provide a valid reference string and number of frames.');
            return null;
        }
        const algo = pagingAlgorithms.find(a => a.name === selectedAlgorithm);
        const generatedSteps = algo.func(parsedRefString, numFrames);
        setSteps(generatedSteps);
        return generatedSteps;
    };

    const handleRunSimulation = () => {
        const generatedSteps = prepareAndSetSteps();
        if (generatedSteps) {
            setCurrentStepIndex(generatedSteps.length - 1);
            setSimulationStatus('finished');
        }
    };

    const handleStepByStep = () => {
        if (simulationStatus === 'idle') {
            const generatedSteps = prepareAndSetSteps();
            if (generatedSteps) {
                setCurrentStepIndex(0);
                setSimulationStatus('running');
            }
        } else if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(prevIndex => prevIndex + 1);
        } else if (currentStepIndex === steps.length - 1) {
            setSimulationStatus('finished');
        }
    };

    const handleReset = () => {
        setNumFrames(3);
        setRefStringInput('1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5');
        setSteps([]);
        setCurrentStepIndex(-1);
        setSimulationStatus('idle');
    };

    const currentStepData = steps[currentStepIndex];
    const metrics = (simulationStatus === 'running' || simulationStatus === 'finished') ? steps[steps.length - 1] : null;
    const totalRequests = refStringInput.split(/[,\s]+/).map(Number).filter(n => !isNaN(n)).length;

    const inputBaseClass = "w-full p-2 border rounded-md bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition";
    const labelBaseClass = "block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300";

    return (
        <div className="p-4 sm:p-6 space-y-6 dark:bg-slate-900 min-h-screen">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Paging Algorithms</h1>
                <p className="text-md text-slate-600 dark:text-slate-400">Learn about virtual memory management with FIFO, Optimal, and LRU paging.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Controls */}
                <div className="lg:col-span-1 space-y-6">
                    <ControlCard title="Algorithm Selection" icon={<ListChecks className="text-slate-500" />}>
                        <div className="grid grid-cols-1 gap-2">
                            {pagingAlgorithms.map(algo => (
                                <div key={algo.name}>
                                    <input type="radio" id={algo.name} name="pagingAlgorithm" value={algo.name} checked={selectedAlgorithm === algo.name} onChange={e => setSelectedAlgorithm(e.target.value)} className="hidden peer" />
                                    <label htmlFor={algo.name} className="p-3 block w-full bg-white dark:bg-slate-800 rounded-lg border-2 border-slate-200 dark:border-slate-700 cursor-pointer peer-checked:border-indigo-500 peer-checked:shadow-sm">
                                        <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">{algo.name}</div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{algo.desc}</p>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </ControlCard>

                    <ControlCard title="Configuration" icon={<Settings2 className="text-slate-500" />}>
                        <div>
                            <label htmlFor="numFrames" className={labelBaseClass}>Number of Page Frames</label>
                            <input type="number" id="numFrames" value={numFrames} onChange={e => setNumFrames(Math.max(1, parseInt(e.target.value)))} min="1" className={inputBaseClass} />
                        </div>
                        <div>
                            <label htmlFor="refString" className={labelBaseClass}>Page Reference String</label>
                            <textarea id="refString" value={refStringInput} onChange={e => setRefStringInput(e.target.value)} placeholder="e.g., 1, 2, 3, 4, 1" rows="3" className={inputBaseClass} />
                        </div>
                    </ControlCard>

                    <ControlCard title="Action Buttons" icon={<PlayCircle className="text-slate-500" />}>
                        <div className="flex flex-col space-y-2">
                            <button onClick={handleRunSimulation} className="w-full bg-emerald-500 text-white p-3 rounded-md hover:bg-emerald-600 transition font-bold text-lg">Run Simulation</button>
                            <button onClick={handleStepByStep} disabled={simulationStatus === 'finished'} className="w-full bg-orange-500 text-white p-2 rounded-md hover:bg-orange-600 transition font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                <SkipForward size={16} />{simulationStatus === 'running' ? 'Next Step' : 'Step-by-Step'}
                            </button>
                            <button onClick={handleReset} className="w-full bg-slate-200 text-slate-700 p-2 rounded-md hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 transition font-semibold flex items-center justify-center gap-2">
                                <RotateCcw size={16} /> Reset
                            </button>
                        </div>
                    </ControlCard>
                </div>

                {/* Right Column: Visualizer & Metrics */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4">
                    {currentStepData ? (
                        <PagingVisualizer stepData={currentStepData} />
                    ) : (
                        <div className="flex items-center justify-center h-full min-h-[300px] text-center text-slate-500">
                            <p>Configure and run a simulation to see the visualization.</p>
                        </div>
                    )}
                    {(simulationStatus !== 'idle') && (
                        <>
                            <hr className="my-4 border-slate-200 dark:border-slate-700" />
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <BarChart2 className="text-slate-500" />
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Performance Summary</h3>
                                </div>
                                {metrics && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                                        <div className="p-2 bg-slate-100 dark:bg-slate-900/50 rounded-lg"><p className="text-slate-500 dark:text-slate-400">Total Requests</p><p className="font-bold text-lg text-slate-700 dark:text-slate-200">{totalRequests}</p></div>
                                        <div className="p-2 bg-slate-100 dark:bg-slate-900/50 rounded-lg"><p className="text-slate-500 dark:text-slate-400">Page Hits</p><p className="font-bold text-lg text-emerald-500">{metrics.pageHits}</p></div>
                                        <div className="p-2 bg-slate-100 dark:bg-slate-900/50 rounded-lg"><p className="text-slate-500 dark:text-slate-400">Page Faults</p><p className="font-bold text-lg text-red-500">{metrics.pageFaults}</p></div>
                                        <div className="p-2 bg-slate-100 dark:bg-slate-900/50 rounded-lg"><p className="text-slate-500 dark:text-slate-400">Fault Ratio</p><p className="font-bold text-lg text-slate-700 dark:text-slate-200">{((metrics.pageFaults / totalRequests) * 100).toFixed(1)}%</p></div>
                                    </div>
                                )}
                            </div>
                            <hr className="my-4 border-slate-200 dark:border-slate-700" />
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <History className="text-slate-500" />
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Step-by-Step History</h3>
                                </div>
                                <div className="overflow-y-auto max-h-56 w-full">
                                    <table className="min-w-full table-auto text-sm">
                                        <thead className="sticky top-0 bg-slate-100 dark:bg-slate-700"><tr className="text-left dark:text-white"><th className="p-2 font-semibold">Step</th><th className="p-2 font-semibold">Req.</th><th className="p-2 font-semibold">Frames</th><th className="p-2 font-semibold">Result</th><th className="p-2 font-semibold">Action</th></tr></thead>
                                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
                                            {steps.slice(0, currentStepIndex + 1).map((step) => (
                                                <tr key={step.step}>
                                                    <td className="p-2 dark:text-white">{step.step}</td>
                                                    <td className="p-2 font-bold dark:text-white">{step.requestedPage}</td>
                                                    <td className="p-2 font-mono dark:text-white">[{step.framesState.join(', ')}]</td>
                                                    <td className={`p-2 font-bold ${step.result === 'hit' ? 'text-emerald-500' : 'text-red-500'}`}>{step.result}</td>
                                                    <td className="p-2 dark:text-white">{step.action}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PagingPage;

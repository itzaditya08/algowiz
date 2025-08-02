import React, { useState, useEffect } from 'react';
import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import VisualizerArea from '../../components/visualizers/VisualizerArea';
import InfoModal from '../../components/ui/InfoModal';
import { getTitleAndDescription } from '../../utils/helpers';
import { Plus, Trash2, Play, Circle, Shuffle, CheckCircle2 } from 'lucide-react';
import CPU_SchedulingVisualizer from '../../components/visualizers/CPU_SchedulingVisualizer';
import { fcfs } from '../../utils/algorithms/cpu_scheduling/fcfs';
import { sjf_np } from '../../utils/algorithms/cpu_scheduling/sjf_np';
import { sjf_p } from '../../utils/algorithms/cpu_scheduling/sjf_p';
import { priority_np } from '../../utils/algorithms/cpu_scheduling/priority_np';
import { priority_p } from '../../utils/algorithms/cpu_scheduling/priority_p';
import { rr } from '../../utils/algorithms/cpu_scheduling/rr';

// A styled container for each section in the control panel
const ControlCard = ({ title, children, customHeader }) => (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">{title}</h2>
            {customHeader}
        </div>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);

const CPU_SchedulingVisualizerPage = () => {
    const { algoId } = useParams();
    const navigate = useNavigate();
    const { title, description, subcategories } = getTitleAndDescription('/os-scheduling-algorithms');
    const [selectedAlgo, setSelectedAlgo] = useState(algoId || subcategories[0].id);
    const [processes, setProcesses] = useState([]);
    const [newProcess, setNewProcess] = useState({ name: '', arrivalTime: 0, burstTime: 0, priority: 1 });
    const [quantum, setQuantum] = useState(2);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [simulationResults, setSimulationResults] = useState(null);
    useEffect(() => { if (algoId !== selectedAlgo) { setSelectedAlgo(algoId); } }, [algoId]);
    useEffect(() => { setNewProcess(prev => ({ ...prev, name: `P${processes.length + 1}` })); }, [processes]);
    const handleAlgoChange = (e) => { const newAlgo = e.target.value; setSelectedAlgo(newAlgo); navigate(`/os-scheduling-algorithms/${newAlgo}`); };
    const currentAlgo = subcategories.find(a => a.id === selectedAlgo);
    const handleProcessInputChange = (e) => { const { name, value } = e.target; setNewProcess(prev => ({ ...prev, [name]: name === 'name' ? value : Number(value) })); };
    const addProcess = () => { if (newProcess.burstTime > 0) { const processToAdd = { ...newProcess, name: `P${processes.length + 1}` }; setProcesses(prev => [...prev, processToAdd]); setNewProcess({ name: `P${processes.length + 2}`, arrivalTime: 0, burstTime: 0, priority: 1 }); } };
    const generateRandomProcesses = (count = 5) => { const newRandomProcesses = []; for (let i = 0; i < count; i++) { newRandomProcesses.push({ name: `P${processes.length + i + 1}`, arrivalTime: Math.floor(Math.random() * 10), burstTime: Math.floor(Math.random() * 15) + 1, priority: Math.floor(Math.random() * 5) + 1, }); } setProcesses(prev => [...prev, ...newRandomProcesses]); };
    const removeProcess = (name) => { setProcesses(prev => prev.filter(p => p.name !== name)); };
    const clearAllProcesses = () => { setProcesses([]); setSimulationResults(null); };
    const runSimulation = () => { if (processes.length === 0) return; const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime); let results; switch (selectedAlgo) { case 'FCFS': results = fcfs(sortedProcesses); break; case 'SJF_NP': results = sjf_np(sortedProcesses); break; case 'SJF_P': results = sjf_p(sortedProcesses); break; case 'Priority_NP': results = priority_np(sortedProcesses); break; case 'Priority_P': results = priority_p(sortedProcesses); break; case 'RoundRobin': results = rr(sortedProcesses, quantum); break; default: results = null; } setSimulationResults(results); };

    const inputBaseClass = "w-full p-2 border rounded-md bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-1 transition";
    
    return (
        <div className="flex flex-col h-full p-4 dark:bg-slate-900">
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{title}</h1>
                <p className="text-md text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mt-2">{description}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
                <div className="lg:col-span-1 space-y-4 overflow-y-auto">
                    <ControlCard title="Select Algorithm">
                        {subcategories.map(algo => (
                            <label key={algo.id} className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 border-2 ${selectedAlgo === algo.id ? 'bg-indigo-50 dark:bg-indigo-900/50 border-indigo-500' : 'bg-slate-100 dark:bg-slate-700/50 border-transparent hover:border-slate-300 dark:hover:border-slate-600'}`}>
                                <input type="radio" name="cpu-algo" value={algo.id} checked={selectedAlgo === algo.id} onChange={handleAlgoChange} className="hidden" />
                                {selectedAlgo === algo.id ? <CheckCircle2 className="w-5 h-5 mr-3 text-indigo-500" /> : <Circle className="w-5 h-5 mr-3 text-slate-400" />}
                                <span className="font-semibold text-slate-800 dark:text-slate-200">{algo.name}</span>
                            </label>
                        ))}
                        {selectedAlgo === 'RoundRobin' && (
                            <div className="pt-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Time Quantum</label>
                                <input type="number" value={quantum} onChange={(e) => setQuantum(Number(e.target.value))} className={inputBaseClass} min="1"/>
                            </div>
                        )}
                    </ControlCard>

                    <ControlCard title="Add Processes">
                        <label className="block"><span className="text-sm font-medium text-slate-700 dark:text-slate-300">Process Name</span><input type="text" name="name" value={newProcess.name} onChange={handleProcessInputChange} className={inputBaseClass} readOnly/></label>
                        <label className="block"><span className="text-sm font-medium text-slate-700 dark:text-slate-300">Arrival Time</span><input type="number" name="arrivalTime" value={newProcess.arrivalTime} onChange={handleProcessInputChange} className={inputBaseClass} min="0"/></label>
                        <label className="block"><span className="text-sm font-medium text-slate-700 dark:text-slate-300">Burst Time</span><input type="number" name="burstTime" value={newProcess.burstTime} onChange={handleProcessInputChange} className={inputBaseClass} min="1"/></label>
                        <label className="block"><span className="text-sm font-medium text-slate-700 dark:text-slate-300">Priority (1=highest)</span><input type="number" name="priority" value={newProcess.priority} onChange={handleProcessInputChange} className={inputBaseClass} min="1"/></label>
                        <div className="flex space-x-2 pt-2">
                            <button onClick={addProcess} className="flex-1 flex items-center justify-center bg-emerald-500 text-white font-semibold py-2 rounded-md hover:bg-emerald-600 transition-colors"><Plus className="w-5 h-5 mr-2" /> Add</button>
                            <button onClick={() => generateRandomProcesses(5)} className="flex-1 flex items-center justify-center bg-amber-500 text-white font-semibold py-2 rounded-md hover:bg-amber-600 transition-colors"><Shuffle className="w-4 h-4 mr-2" /> Random</button>
                        </div>
                    </ControlCard>

                    <ControlCard title={`Process Queue (${processes.length})`} customHeader={<button onClick={clearAllProcesses} className="text-sm text-red-500 hover:text-red-700 font-medium">Clear All</button>}>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {processes.length > 0 ? (
                                processes.map(p => (
                                    <div key={p.name} className="flex justify-between items-center bg-slate-100 dark:bg-slate-700 p-2.5 rounded-md text-sm text-slate-800 dark:text-slate-200">
                                        <span className="font-mono text-xs"><b>{p.name}:</b> A={p.arrivalTime}, B={p.burstTime}, P={p.priority}</span>
                                        <button onClick={() => removeProcess(p.name)} className="text-slate-500 hover:text-red-500 transition-colors"><Trash2 className="h-4 w-4" /></button>
                                    </div>
                                ))
                            ) : ( <p className="text-center text-slate-500 dark:text-slate-400 py-4">No processes in queue.</p> )}
                        </div>
                    </ControlCard>

                    <button onClick={runSimulation} className="w-full flex items-center justify-center bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-lg hover:shadow-indigo-500/50 disabled:bg-slate-400 disabled:shadow-none" disabled={processes.length === 0}>
                        <Play className="w-5 h-5 mr-2" /> Run Simulation
                    </button>
                </div>

                <div className="lg:col-span-2 overflow-y-auto">
                    <VisualizerArea title={`${currentAlgo?.name} Visualization`} showInfo={true} onInfoClick={() => setIsInfoModalOpen(true)}>
                        {simulationResults ? ( <CPU_SchedulingVisualizer data={simulationResults} /> ) : (
                            <div className="flex items-center justify-center h-full min-h-[300px]">
                                <p className="text-center text-slate-500 dark:text-slate-400">Add or generate processes and click "Run Simulation" to see the visualization.</p>
                            </div>
                        )}
                    </VisualizerArea>
                </div>
            </div>

            <InfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} title={currentAlgo?.name} description={currentAlgo?.description} />
        </div>
    );
};

const CPU_SchedulingPage = () => (
    <Routes>
        <Route path="/:algoId?" element={<CPU_SchedulingVisualizerPage />} />
    </Routes>
);

export default CPU_SchedulingPage;

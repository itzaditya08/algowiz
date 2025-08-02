import React, { useState, useEffect, useRef } from 'react';
import GraphVisualizer from '../../components/visualizers/GraphVisualizer';
import { Play, RotateCcw, Shuffle, Plus, Trash2, FastForward } from 'lucide-react';
import { Graph, DFS, BFS, Dijkstra, BellmanFord, FloydWarshall, Prim, Kruskal } from '../../utils/algorithms/graph';

const graphAlgorithms = [
    { id: 'BFS', name: 'Breadth-First Search', description: 'Explores level by level.', isWeighted: false, isDirected: false },
    { id: 'DFS', name: 'Depth-First Search', description: 'Explores as far as possible.', isWeighted: false, isDirected: false },
    { id: 'Dijkstra', name: 'Dijkstra\'s Algorithm', description: 'Shortest paths in a non-negative weighted graph.', isWeighted: true, isDirected: false },
    { id: 'BellmanFord', name: 'Bellman-Ford Algorithm', description: 'Shortest paths with negative weights.', isWeighted: true, isDirected: false },
    { id: 'FloydWarshall', name: 'Floyd-Warshall Algorithm', description: 'Shortest paths between all pairs of nodes.', isWeighted: true, isDirected: false },
    { id: 'Prim', name: 'Prim\'s Algorithm', description: 'Finds a Minimum Spanning Tree (MST).', isWeighted: true, isDirected: false },
    { id: 'Kruskal', name: 'Kruskal\'s Algorithm', description: 'Finds a Minimum Spanning Tree (MST).', isWeighted: true, isDirected: false },
];

const ControlSection = ({ title, children }) => (
    <div>
        <h3 className="text-xl font-semibold mb-3 pb-2 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700">
            {title}
        </h3>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);

const GraphPage = () => {
    const [selectedAlgorithm, setSelectedAlgorithm] = useState('DFS');
    const [graph, setGraph] = useState(new Graph());
    const [simulation, setSimulation] = useState(null);
    const [isSimulating, setIsSimulating] = useState(false);
    const [inputNode, setInputNode] = useState('');
    const [inputFromNode, setInputFromNode] = useState('');
    const [inputToNode, setInputToNode] = useState('');
    const [inputWeight, setInputWeight] = useState('');
    const [isDirected, setIsDirected] = useState(false);
    const [startNode, setStartNode] = useState('');
    const [targetNode, setTargetNode] = useState('');
    const [history, setHistory] = useState([]);
    const [metrics, setMetrics] = useState({});
    const [explanation, setExplanation] = useState('Select an algorithm and configure the graph to begin.');

    const algorithmDetails = graphAlgorithms.find(algo => algo.id === selectedAlgorithm);
    const isWeighted = algorithmDetails?.isWeighted;
    const requiresStartNode = ['BFS', 'DFS', 'Dijkstra', 'BellmanFord', 'Prim'].includes(selectedAlgorithm);
    const nodes = graph.getNodes();

    const handleAddNode = () => {
        if (inputNode && !nodes.includes(inputNode)) {
            const newGraph = graph.addNode(inputNode);
            setGraph(newGraph);
            setExplanation(`Added node ${inputNode}.`);
            setInputNode('');
        }
    };
    const handleAddEdge = () => {
        if (inputFromNode && inputToNode) {
            const newGraph = graph.addEdge(inputFromNode, inputToNode, isWeighted ? parseInt(inputWeight) || 1 : 1, isDirected);
            setGraph(newGraph);
            setExplanation(`Added edge from ${inputFromNode} to ${inputToNode}${isWeighted ? ' with weight ' + (inputWeight || 1) : ''}.`);
            setInputFromNode('');
            setInputToNode('');
            setInputWeight('');
        }
    };
    const handleClearGraph = () => { setGraph(new Graph()); setHistory([]); setMetrics({}); setExplanation('Graph has been cleared.'); setSimulation(null); setIsSimulating(false); };
    const handleRunAlgorithm = () => { if (!simulation) { initializeSimulation(); } setIsSimulating(true); let currentSimulation = simulation; if (!currentSimulation) { currentSimulation = initializeSimulation(); } let stepResult; do { stepResult = currentSimulation.step(); updateSimulationState(stepResult); } while (!stepResult.isComplete); setIsSimulating(false); };
    const handleStepAlgorithm = () => { if (!simulation) { const newSimulation = initializeSimulation(); const stepResult = newSimulation.step(); updateSimulationState(stepResult); setIsSimulating(true); } else { const stepResult = simulation.step(); updateSimulationState(stepResult); if (stepResult.isComplete) { setIsSimulating(false); } } };
    const handleResetAlgorithm = () => { setHistory([]); setMetrics({}); setExplanation('Simulation has been reset.'); setSimulation(null); setIsSimulating(false); const resetGraph = graph.resetVisualState(); setGraph(resetGraph); };
    const initializeSimulation = () => { const algoClass = getAlgorithmClass(selectedAlgorithm); const newSimulation = new algoClass(graph, startNode); setSimulation(newSimulation); return newSimulation; };
    const getAlgorithmClass = (algoId) => { switch (algoId) { case 'BFS': return BFS; case 'DFS': return DFS; case 'Dijkstra': return Dijkstra; case 'BellmanFord': return BellmanFord; case 'FloydWarshall': return FloydWarshall; case 'Prim': return Prim; case 'Kruskal': return Kruskal; default: return null; } };
    const updateSimulationState = (stepResult) => { const { details, graphState, isComplete, metrics } = stepResult; setExplanation(details); setGraph(graphState); setHistory(prev => [...prev, details]); if (isComplete) { setMetrics(metrics); } };
    
    const inputBaseClass = "w-full p-2 border rounded-lg bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition";

    return (
        <div className="flex flex-col h-screen dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans p-4 gap-4">
            <header className="flex-shrink-0 text-center">
                <h1 className="text-3xl font-bold">Graph Algorithms</h1>
                <p className="text-slate-500 dark:text-slate-400">Visualize traversal, shortest path, and minimum spanning tree algorithms.</p>
            </header>

            <main className="flex flex-col flex-grow gap-4 overflow-hidden">
                {/* Top Section: Controls + Visualization */}
                <div className="flex-grow grid grid-cols-1 lg:grid-cols-5 gap-4 overflow-hidden">
                    {/* Left Panel: User Controls */}
                    <div className="bg-white dark:bg-slate-800/50 p-5 rounded-xl shadow-lg space-y-6 lg:col-span-2 overflow-y-auto">
                        <ControlSection title="Algorithm">
                            <div className="space-y-2">
                                {graphAlgorithms.map(algo => (
                                    <label key={algo.id} className={`flex items-start p-3 rounded-lg border-2 cursor-pointer transition-all duration-200
                                        ${selectedAlgorithm === algo.id 
                                            ? 'bg-indigo-50 border-indigo-500 dark:bg-indigo-900/50' 
                                            : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-700/50'}`}>
                                        <input type="radio" name="algorithm" value={algo.id} checked={selectedAlgorithm === algo.id}
                                            onChange={() => setSelectedAlgorithm(algo.id)} className="hidden" />
                                        <div>
                                            <span className={`font-semibold ${selectedAlgorithm === algo.id ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-800 dark:text-slate-200'}`}>{algo.name}</span>
                                            <p className={`text-sm ${selectedAlgorithm === algo.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}>{algo.description}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </ControlSection>

                        <ControlSection title="Graph Configuration">
                            <div className="flex space-x-2">
                                <input type="text" placeholder="Add Node (e.g., A)" value={inputNode} onChange={(e) => setInputNode(e.target.value)} className={inputBaseClass} />
                                <button onClick={handleAddNode} className="flex items-center justify-center bg-emerald-500 text-white p-2 rounded-lg hover:bg-emerald-600 transition-colors shrink-0">
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <input type="text" placeholder="From Node" value={inputFromNode} onChange={(e) => setInputFromNode(e.target.value)} className={inputBaseClass} />
                                <input type="text" placeholder="To Node" value={inputToNode} onChange={(e) => setInputToNode(e.target.value)} className={inputBaseClass} />
                            </div>
                            {isWeighted && (
                                <input type="number" placeholder="Weight (e.g., 5)" value={inputWeight} onChange={(e) => setInputWeight(e.target.value)} className={`${inputBaseClass} col-span-2`} />
                            )}
                            <button onClick={handleAddEdge} className="w-full bg-emerald-500 text-white font-semibold py-2 rounded-lg hover:bg-emerald-600 transition-colors">Add Edge</button>
                            <div className="flex items-center space-x-3 pt-2">
                                <input id="isDirected" type="checkbox" checked={isDirected} onChange={(e) => setIsDirected(e.target.checked)} className="h-4 w-4 rounded text-indigo-600 dark:text-indigo-400 bg-slate-200 dark:bg-slate-700 border-slate-400 focus:ring-indigo-500" />
                                <label htmlFor="isDirected" className="text-sm font-medium text-slate-700 dark:text-slate-300">Directed Graph</label>
                            </div>
                            <div className="grid grid-cols-1 gap-2 pt-2">
                                <button onClick={handleClearGraph} className="flex items-center justify-center bg-rose-500 text-white font-semibold py-2 rounded-lg hover:bg-rose-600 transition-colors">
                                    <Trash2 className="w-4 h-4 mr-2" /> Clear
                                </button>
                            </div>
                        </ControlSection>

                        {requiresStartNode && (
                            <ControlSection title="Algorithm Parameters">
                                <input type="text" placeholder="Start Node (e.g., A)" value={startNode} onChange={(e) => setStartNode(e.target.value)} className={inputBaseClass} />
                                {(selectedAlgorithm === 'Dijkstra' || selectedAlgorithm === 'BellmanFord') && (
                                    <input type="text" placeholder="Target Node (Optional)" value={targetNode} onChange={(e) => setTargetNode(e.target.value)} className={inputBaseClass} />
                                )}
                            </ControlSection>
                        )}
                        
                        <ControlSection title="Actions">
                            <div className="grid grid-cols-3 gap-2">
                                <button onClick={handleRunAlgorithm} disabled={isSimulating || !nodes.length || (requiresStartNode && !startNode)} className="flex flex-col items-center justify-center bg-indigo-500 text-white font-semibold py-2 rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                    <Play className="w-5 h-5 mb-1" /> Run
                                </button>
                                <button onClick={handleStepAlgorithm} disabled={isSimulating || !nodes.length || (requiresStartNode && !startNode)} className="flex flex-col items-center justify-center bg-purple-500 text-white font-semibold py-2 rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                    <FastForward className="w-5 h-5 mb-1" /> Step
                                </button>
                                <button onClick={handleResetAlgorithm} disabled={!history.length} className="flex flex-col items-center justify-center bg-slate-500 text-white font-semibold py-2 rounded-lg hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                    <RotateCcw className="w-5 h-5 mb-1" /> Reset
                                </button>
                            </div>
                        </ControlSection>
                    </div>

                    {/* Right Panel: Visualization */}
                    <div className="lg:col-span-3 flex flex-col bg-white dark:bg-slate-800/50 p-5 rounded-xl shadow-lg min-h-[400px]">
                        <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-slate-100">Visualization</h2>
                        <div className="flex-grow relative h-full">
                            <GraphVisualizer graphData={graph.getGraphData()} isDirected={isDirected} isWeighted={isWeighted} />
                        </div>
                        <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-900/70 rounded-lg text-sm text-slate-600 dark:text-slate-300 font-mono">
                            <span className="font-semibold">Log:</span> {explanation}
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Metrics & History */}
                <div className="flex-shrink-0 bg-white dark:bg-slate-800/50 p-5 rounded-xl shadow-lg overflow-y-auto">
                    <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Metrics & History</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-slate-600 dark:text-slate-400">Performance Summary</h3>
                            <div className="space-y-2 text-slate-700 dark:text-slate-300 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg min-h-[100px]">
                                {Object.keys(metrics).length > 0 ? (
                                    Object.entries(metrics).map(([key, value]) => (
                                        <div key={key} className="flex justify-between text-sm">
                                            <strong className="capitalize font-medium text-slate-500">{key.replace(/_/g, ' ')}:</strong>
                                            <span className="font-mono text-emerald-500 dark:text-emerald-400">{String(value)}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="italic text-sm text-slate-500 m-auto">Run an algorithm to see results.</p>
                                )}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-slate-600 dark:text-slate-400">Step-by-Step History</h3>
                            <div className="overflow-auto rounded-lg border dark:border-slate-700 max-h-48 text-sm">
                                <table className="min-w-full table-auto border-collapse">
                                    <thead className="sticky top-0 bg-slate-200 dark:bg-slate-700 z-10">
                                        <tr className="text-left font-semibold">
                                            <th className="px-3 py-2">#</th>
                                            <th className="px-3 py-2">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="dark:text-slate-300">
                                        {history.length > 0 ? (
                                            history.map((entry, index) => (
                                                <tr key={index} className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80">
                                                    <td className="px-3 py-2 font-mono text-slate-500">{index + 1}</td>
                                                    <td className="px-3 py-2">{entry}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="2" className="px-3 py-4 text-center text-sm italic text-slate-500">No steps recorded.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default GraphPage;

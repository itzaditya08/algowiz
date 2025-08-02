import React, { useState, useEffect, useRef } from 'react';
import TreeVisualizer from '../../components/visualizers/TreeVisualizer';
import { BST, BinaryTree } from '../../utils/algorithms/tree';
import { Plus, Trash2, Search, Shuffle, RotateCcw, ListTree, SlidersHorizontal, Eye, History, Route } from 'lucide-react';

const treeTypes = [
    { id: 'BST', name: 'Binary Search Tree', description: 'Left < Parent < Right' },
    { id: 'BinaryTree', name: 'Binary Tree', description: 'A basic tree structure' },
];

const treeAlgorithms = {
    'BinaryTree': BinaryTree,
    'BST': BST,
};

// Reusable UI Components
const ControlCard = ({ title, icon, children }) => (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
            {icon}
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">{title}</h2>
        </div>
        <div className="p-4 space-y-4">{children}</div>
    </div>
);

const TreeStructuresPage = () => {
    // State Management
    const [treeType, setTreeType] = useState('BST');
    const [treeInstance, setTreeInstance] = useState(new BST());
    const [nodeValue, setNodeValue] = useState('');
    const [history, setHistory] = useState([]);
    const [metrics, setMetrics] = useState({ height: 0, nodeCount: 0, comparisons: 0 });
    const [explanation, setExplanation] = useState('Ready to visualize a tree algorithm!');
    const [highlight, setHighlight] = useState([]);
    const [traversalPath, setTraversalPath] = useState([]);
    const [isAnimating, setIsAnimating] = useState(false);

    // Ref and state for dynamic centering of the tree
    const containerRef = useRef(null);
    const [containerWidth, setContainerWidth] = useState(0);

    // Reset the tree when the tree type changes
    useEffect(() => {
        const newTree = new treeAlgorithms[treeType]();
        setTreeInstance(newTree);
        handleReset(newTree); // Pass the new instance to reset
    }, [treeType]);

    // Measure container width for centering logic
    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Core Logic
    const updateState = (event, value, result, details, newTreeInstance) => {
        setTreeInstance(newTreeInstance);
        setHistory(prev => [{ event, value, result }, ...prev]);
        setMetrics({
            height: newTreeInstance.getHeight(),
            nodeCount: newTreeInstance.countNodes(),
            comparisons: newTreeInstance.comparisons || 0,
        });
        setExplanation(details);
    };

    // Action Handlers
    const handleInsert = () => {
        if (!nodeValue) { setExplanation("Please enter a value to insert."); return; }
        const value = parseInt(nodeValue);
        const { newTree, details, result } = treeInstance.insert(value);
        updateState('Insert', value, result, details, newTree);
        setHighlight([value]);
        setNodeValue('');
        setTimeout(() => setHighlight([]), 1500);
    };

    const handleDelete = () => {
        if (!nodeValue) { setExplanation("Please enter a value to delete."); return; }
        const value = parseInt(nodeValue);
        const { newTree, details, result } = treeInstance.delete(value);
        updateState('Delete', value, result, details, newTree);
        setHighlight([value]);
        setNodeValue('');
        setTimeout(() => setHighlight([]), 1500);
    };

    const handleSearch = () => {
        if (!nodeValue) { setExplanation("Please enter a value to search."); return; }
        const value = parseInt(nodeValue);
        const { found, path, details } = treeInstance.search(value);
        setExplanation(details);
        setHighlight(path);
        setHistory(prev => [{ event: 'Search', value, result: found ? 'Found' : 'Not Found' }, ...prev]);
        setTimeout(() => setHighlight([]), 2000);
    };

    const handleTraversal = async (type) => {
        setIsAnimating(true);
        setExplanation(`Performing ${type} traversal...`);
        const path = treeInstance.traversals[type]();
        setTraversalPath([]); // Clear previous path
        for (let i = 0; i < path.length; i++) {
            setTraversalPath(path.slice(0, i + 1));
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        setExplanation(`${type} traversal complete: ${path.join(', ')}`);
        setIsAnimating(false);
        setTimeout(() => setTraversalPath([]), 2000); // Clear visualization after a delay
    };

    const handleRandomGenerate = () => {
        const newTree = new treeAlgorithms[treeType]();
        const numNodes = Math.floor(Math.random() * 10) + 5;
        const values = new Set();
        while (values.size < numNodes) {
            values.add(Math.floor(Math.random() * 100));
        }
        let currentTree = newTree;
        values.forEach(value => {
            const { newTree: updatedTree } = currentTree.insert(value);
            currentTree = updatedTree;
        });
        updateState('Random', `${numNodes} nodes`, 'Success', `Generated a random tree.`, currentTree);
    };

    const handleReset = (tree = null) => {
        const newTree = tree || new treeAlgorithms[treeType]();
        setTreeInstance(newTree);
        setNodeValue('');
        setHistory([]);
        setMetrics({ height: 0, nodeCount: 0, comparisons: 0 });
        setExplanation('Tree has been reset.');
        setHighlight([]);
        setTraversalPath([]);
    };

    // Render Logic
    const treeData = treeInstance.getTreeData();
    let offsetX = 0;
    if (treeData && treeData.root && containerWidth > 0) {
        const xCoords = treeData.allNodes.map(node => node.x);
        const minX = Math.min(...xCoords);
        const maxX = Math.max(...xCoords);
        const treeWidth = maxX - minX;
        offsetX = (containerWidth / 2) - (treeWidth / 2) - minX;
    }
    const inputBaseClass = "w-full p-2 border rounded-md bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition";

    return (
        <div className="p-4 space-y-6 dark:bg-slate-900 min-h-screen text-slate-100">
            <div className="text-center">
                <h1 className="text-3xl font-bold">Tree Data Structures Visualizer</h1>
                <p className="text-md text-slate-400">Understand diagrammatic representation of various tree data structures.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Controls Column */}
                <div className="lg:col-span-1 space-y-6">
                    <ControlCard title="Algorithm" icon={<ListTree className="text-slate-500" />}>
                        <div className="space-y-2">
                            {treeTypes.map(type => (
                                <label key={type.id} className={`p-3 rounded-lg cursor-pointer transition-all border-2 flex items-start ${treeType === type.id ? 'bg-indigo-50 dark:bg-indigo-900/50 border-indigo-500' : 'bg-slate-100 dark:bg-slate-700/50 border-transparent hover:border-slate-300 dark:hover:border-slate-600'}`}>
                                    <input type="radio" name="treeType" value={type.id} checked={treeType === type.id} onChange={() => setTreeType(type.id)} className="hidden"/>
                                    <div className={`w-4 h-4 mt-1 mr-3 rounded-full border-2 flex-shrink-0 ${treeType === type.id ? 'bg-indigo-500 border-indigo-400' : 'border-slate-400'}`}></div>
                                    <div>
                                        <span className="font-semibold text-slate-800 dark:text-slate-200 block">{type.name}</span>
                                        <span className="text-xs text-slate-500 dark:text-slate-400">{type.description}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </ControlCard>

                    <ControlCard title="Configuration & Actions" icon={<SlidersHorizontal className="text-slate-500" />}>
                        <div>
                            <label htmlFor="nodeValue" className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Node Value</label>
                            <input type="number" id="nodeValue" value={nodeValue} onChange={(e) => setNodeValue(e.target.value)} placeholder="e.g., 42" className={inputBaseClass} />
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-2">
                            <button onClick={handleInsert} className="bg-emerald-600 text-white p-2 rounded-md hover:bg-emerald-700 transition font-semibold disabled:opacity-50 flex items-center justify-center" disabled={isAnimating}><Plus size={16} className="mr-1"/>Insert</button>
                            <button onClick={handleDelete} className="bg-rose-500 text-white p-2 rounded-md hover:bg-rose-600 transition font-semibold disabled:opacity-50 flex items-center justify-center" disabled={isAnimating}><Trash2 size={16} className="mr-1"/>Delete</button>
                            <button onClick={handleSearch} className="bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 transition font-semibold disabled:opacity-50 flex items-center justify-center" disabled={isAnimating}><Search size={16} className="mr-1"/>Search</button>
                            <button onClick={handleRandomGenerate} className="bg-slate-500 text-white p-2 rounded-md hover:bg-slate-600 transition font-semibold disabled:opacity-50 flex items-center justify-center" disabled={isAnimating}><Shuffle size={16} className="mr-1"/>Random</button>
                            <button onClick={() => handleReset()} className="col-span-2 bg-slate-600 text-white p-2 rounded-md hover:bg-slate-700 transition font-semibold flex items-center justify-center" disabled={isAnimating}><RotateCcw size={16} className="mr-2"/>Reset Tree</button>
                        </div>
                    </ControlCard>

                    <ControlCard title="Traversals" icon={<Route className="text-slate-500" />}>
                        <div className="grid grid-cols-3 gap-2">
                            <button onClick={() => handleTraversal('inOrder')} className="bg-purple-600 text-white p-2 rounded-md hover:bg-purple-700 transition font-semibold disabled:opacity-50" disabled={isAnimating}>In-order</button>
                            <button onClick={() => handleTraversal('preOrder')} className="bg-purple-600 text-white p-2 rounded-md hover:bg-purple-700 transition font-semibold disabled:opacity-50" disabled={isAnimating}>Pre-order</button>
                            <button onClick={() => handleTraversal('postOrder')} className="bg-purple-600 text-white p-2 rounded-md hover:bg-purple-700 transition font-semibold disabled:opacity-50" disabled={isAnimating}>Post-order</button>
                        </div>
                    </ControlCard>
                </div>

                {/* Right Content Column */}
                <div className="lg:col-span-2 space-y-6">
                    <ControlCard title="Visualization" icon={<Eye className="text-slate-500" />}>
                        <div ref={containerRef} className="relative h-[450px] bg-slate-100 dark:bg-slate-900/50 rounded-lg">
                            <TreeVisualizer treeData={treeData} highlight={highlight} traversalPath={traversalPath} offsetX={offsetX} />
                        </div>
                        <div className="mt-2 p-3 bg-slate-100 dark:bg-slate-900/50 rounded-lg text-sm text-slate-700 dark:text-slate-300 text-center">
                            <span className="font-semibold">Log:</span> {explanation}
                        </div>
                    </ControlCard>

                    <ControlCard title="Metrics & History" icon={<History className="text-slate-500" />}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold mb-2 text-slate-700 dark:text-slate-300">Performance</h3>
                                <div className="text-sm space-y-2 text-slate-700 dark:text-slate-300">
                                    <div className="flex justify-between"><span>Tree Height:</span><span className="font-bold font-mono">{metrics.height}</span></div>
                                    <div className="flex justify-between"><span>Number of Nodes:</span><span className="font-bold font-mono">{metrics.nodeCount}</span></div>
                                    {metrics.comparisons > 0 && <div className="flex justify-between"><span>Search Comparisons:</span><span className="font-bold font-mono">{metrics.comparisons}</span></div>}
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2 text-slate-700 dark:text-slate-300">History</h3>
                                <div className="overflow-auto max-h-48 rounded-lg border dark:border-slate-700">
                                    <table className="min-w-full table-auto text-sm">
                                        <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800">
                                            <tr className="text-left font-semibold text-slate-500 dark:text-slate-400">
                                                <th className="p-2">Operation</th><th className="p-2">Value</th><th className="p-2">Result</th>
                                            </tr>
                                        </thead>
                                        <tbody className="dark:text-slate-300">
                                            {history.length > 0 ? (
                                                history.map((entry, index) => (
                                                    <tr key={index} className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                                        <td className="p-2">{entry.event}</td>
                                                        <td className="p-2 font-mono">{entry.value}</td>
                                                        <td className="p-2">{entry.result}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr><td colSpan="3" className="p-4 text-center text-slate-500 italic">No operations yet.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </ControlCard>
                </div>
            </div>
        </div>
    );
};

export default TreeStructuresPage;

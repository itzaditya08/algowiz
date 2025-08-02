import React, { useState, useEffect } from 'react';
import SortingVisualizer from '../../components/visualizers/SortingVisualizer';
import { bubbleSort, selectionSort, insertionSort, mergeSort, quickSort, heapSort, countingSort } from '../../utils/algorithms/sorting';
import { SORTING_COMPLEXITY } from '../../utils/constants';
import { SlidersHorizontal, ListChecks, BrainCircuit } from 'lucide-react';

const sortingAlgorithms = [
    { name: 'Bubble Sort', func: bubbleSort },
    { name: 'Selection Sort', func: selectionSort },
    { name: 'Insertion Sort', func: insertionSort },
    { name: 'Merge Sort', func: mergeSort },
    { name: 'Quick Sort', func: quickSort },
    { name: 'Heap Sort', func: heapSort },
    { name: 'Counting Sort', func: countingSort },
];

const ControlCard = ({ title, icon, children }) => (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
            {icon}
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">{title}</h2>
        </div>
        <div className="p-4 space-y-4">
            {children}
        </div>
    </div>
);

const SortingPage = () => {
    const [array, setArray] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [selectedAlgorithm, setSelectedAlgorithm] = useState(sortingAlgorithms[0].name);
    const [steps, setSteps] = useState([]);
    const [isVisualizing, setIsVisualizing] = useState(false);
    const [complexity, setComplexity] = useState(SORTING_COMPLEXITY[sortingAlgorithms[0].name]);

    useEffect(() => { generateRandomArray(15); }, []);
    useEffect(() => { setComplexity(SORTING_COMPLEXITY[selectedAlgorithm]); }, [selectedAlgorithm]);

    const generateRandomArray = (size) => {
        setIsVisualizing(false);
        setSteps([]);
        const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 99) + 1);
        setArray(newArray);
        setInputValue(newArray.join(', '));
    };
    const handleSetArray = () => {
        setIsVisualizing(false);
        setSteps([]);
        try {
            const parsedArray = inputValue.split(',').map(num => parseInt(num.trim(), 10)).filter(num => !isNaN(num) && num > 0);
            if (parsedArray.length > 0) {
                setArray(parsedArray);
            } else {
                generateRandomArray(15);
            }
        } catch (e) {
            generateRandomArray(15);
        }
    };
    const handleVisualize = () => {
        if (array.length === 0) return;
        setIsVisualizing(true);
        setSteps([]);
        const algo = sortingAlgorithms.find(a => a.name === selectedAlgorithm);
        if (algo) {
            const visualizationSteps = algo.func([...array]);
            setSteps(visualizationSteps);
        }
    };
    const handleAnimationComplete = () => setIsVisualizing(false);

    const inputBaseClass = "w-full p-2 border rounded-md bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition";

    return (
        <div className="p-4 space-y-6 dark:bg-slate-900 min-h-screen">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Sorting Algorithms</h1>
                <p className="text-md text-slate-600 dark:text-slate-400">Watch sorting algorithms in action with step-by-step visualization.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Controls */}
                <div className="lg:col-span-1 space-y-6">
                    <ControlCard title="Configuration" icon={<SlidersHorizontal className="text-slate-500" size={20}/>}>
                        <div>
                            <label htmlFor="arrayInput" className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Input Array</label>
                            <textarea id="arrayInput" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="e.g., 5, 2, 8, 1, 9" rows="3" className={inputBaseClass} />
                        </div>
                        <div className="flex space-x-2">
                            <button onClick={handleSetArray} className="w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 transition font-semibold">Set Array</button>
                            <button onClick={() => generateRandomArray(15)} className="w-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 p-2 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition font-semibold">Random</button>
                        </div>
                    </ControlCard>

                    <ControlCard title="Algorithm" icon={<ListChecks className="text-slate-500" size={20}/>}>
                        <div>
                            <label htmlFor="algoSelect" className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Choose Algorithm</label>
                            <select id="algoSelect" className={inputBaseClass} value={selectedAlgorithm} onChange={(e) => setSelectedAlgorithm(e.target.value)}>
                                {sortingAlgorithms.map((algo) => (<option key={algo.name} value={algo.name}>{algo.name}</option>))}
                            </select>
                        </div>
                        <button onClick={handleVisualize} disabled={isVisualizing} className="w-full bg-emerald-500 text-white p-3 rounded-md hover:bg-emerald-600 transition font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed">Visualize</button>
                    </ControlCard>
                    
                    <ControlCard title="Complexity" icon={<BrainCircuit className="text-slate-500" size={20}/>}>
                        <div className="text-sm space-y-2">
                             <div className="flex justify-between">
                                <span className="font-semibold text-slate-600 dark:text-slate-400">Time Complexity:</span>
                                <span className="font-mono text-indigo-500">{complexity.time}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold text-slate-600 dark:text-slate-400">Space Complexity:</span>
                                <span className="font-mono text-indigo-500">{complexity.space}</span>
                            </div>
                        </div>
                    </ControlCard>
                </div>

                {/* Right Column: Visualizer */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4">
                         {array.length > 0 ? (
                            <SortingVisualizer steps={steps} initialArray={array} onAnimationComplete={handleAnimationComplete} />
                        ) : (
                            <div className="flex items-center justify-center h-96">
                                <p className="text-slate-500">Please provide an array to visualize.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SortingPage;

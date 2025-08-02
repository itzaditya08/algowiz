import React, { useState, useEffect } from 'react';
import SearchingVisualizer from '../../components/visualizers/SearchingVisualizer';
import { linearSearch, binarySearch, exponentialSearch, interpolationSearch } from '../../utils/algorithms/searching';
import { SEARCHING_COMPLEXITY } from '../../utils/constants';
import { SlidersHorizontal, ListChecks, Activity, Eye, Search as SearchIcon } from 'lucide-react';

const searchingAlgorithms = [
    { name: 'Linear Search', func: linearSearch, requiresSorted: false },
    { name: 'Binary Search', func: binarySearch, requiresSorted: true },
    { name: 'Exponential Search', func: exponentialSearch, requiresSorted: true },
    { name: 'Interpolation Search', func: interpolationSearch, requiresSorted: true },
];

// Reusable UI Components 
const ControlCard = ({ title, icon, children, className = '' }) => (
    <div className={`flex flex-col bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 ${className}`}>
        <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex items-center gap-3">
            {React.cloneElement(icon, { className: 'text-gray-500 dark:text-slate-400' })}
            <h2 className="text-lg font-bold text-gray-800 dark:text-slate-200">{title}</h2>
        </div>
        <div className="p-4 flex-grow">
            {children}
        </div>
    </div>
);

const SearchingPage = () => {
    const [array, setArray] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [targetValue, setTargetValue] = useState('');
    const [selectedAlgorithm, setSelectedAlgorithm] = useState(searchingAlgorithms[0].name);
    const [steps, setSteps] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [complexity, setComplexity] = useState(SEARCHING_COMPLEXITY[searchingAlgorithms[0].name]);

    useEffect(() => {
        generateRandomArray(10);
    }, []);

    useEffect(() => {
        setComplexity(SEARCHING_COMPLEXITY[selectedAlgorithm]);
        setSteps([]); // Clear steps when algorithm changes
    }, [selectedAlgorithm]);

    // Core Logic & Handlers 
    const generateRandomArray = (size) => {
        setIsSearching(false);
        setSteps([]);
        const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 100));
        setArray(newArray);
        setInputValue(newArray.join(', '));
    };

    const handleSetArray = () => {
        setIsSearching(false);
        setSteps([]);
        const parsedArray = inputValue.split(/[, ]+/).map(num => parseInt(num.trim(), 10)).filter(num => !isNaN(num));
        if (parsedArray.length > 0) {
            setArray(parsedArray);
            setInputValue(parsedArray.join(', '));
        } else {
            console.error('Invalid input. Please enter a comma-separated list of numbers.');
        }
    };

    const handleSearch = () => {
        if (array.length === 0 || targetValue === '') return;
        setIsSearching(true);

        const algo = searchingAlgorithms.find(a => a.name === selectedAlgorithm);
        if (!algo) return;

        let arrayToSearch = [...array];
        if (algo.requiresSorted) {
            arrayToSearch.sort((a, b) => a - b);
            setArray(arrayToSearch); // Update state to reflect sorted array
            setInputValue(arrayToSearch.join(', '));
        }
        const visualizationSteps = algo.func(arrayToSearch, parseInt(targetValue, 10));
        setSteps(visualizationSteps);
    };

    const handleAnimationComplete = () => {
        setIsSearching(false);
    };

    // Render Logic
    const inputBaseClass = "w-full p-2 border rounded-md bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition";
    const buttonBaseClass = "p-2 rounded-md transition font-semibold disabled:opacity-50 flex items-center justify-center";

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-gray-100 dark:bg-slate-900 min-h-screen">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Searching Algorithms</h1>
                <p className="text-md text-gray-600 dark:text-slate-400">See searching algorithms in action, including Binary Search and Linear Search.</p>
            </div>

            <div className="max-w-5xl mx-auto space-y-6">
                <ControlCard title="Configuration" icon={<SlidersHorizontal />}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                        <div>
                            <label htmlFor="arrayInput" className="block text-sm font-medium mb-1 text-gray-700 dark:text-slate-300">Input Array</label>
                            <input id="arrayInput" type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="e.g., 5, 2, 8, 1" className={inputBaseClass} />
                        </div>
                        <div className="flex space-x-2">
                            <button onClick={handleSetArray} className={`${buttonBaseClass} bg-indigo-600 hover:bg-indigo-700 text-white w-full`}>Set Array</button>
                            <button onClick={() => generateRandomArray(10)} className={`${buttonBaseClass} bg-emerald-600 hover:bg-emerald-700 text-white w-full`}>Random</button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div className="md:col-span-1">
                            <label htmlFor="algoSelect" className="block text-sm font-medium mb-1 text-gray-700 dark:text-slate-300">Algorithm</label>
                            <select id="algoSelect" value={selectedAlgorithm} onChange={(e) => setSelectedAlgorithm(e.target.value)} className={inputBaseClass}>
                                {searchingAlgorithms.map((algo) => <option key={algo.name} value={algo.name}>{algo.name}</option>)}
                            </select>
                        </div>
                        <div className="md:col-span-1">
                            <label htmlFor="targetInput" className="block text-sm font-medium mb-1 text-gray-700 dark:text-slate-300">Target Value</label>
                            <input id="targetInput" type="number" value={targetValue} onChange={(e) => setTargetValue(e.target.value)} placeholder="e.g., 8" className={inputBaseClass} />
                        </div>
                        <button onClick={handleSearch} disabled={isSearching || array.length === 0 || targetValue === ''} className={`${buttonBaseClass} bg-orange-600 hover:bg-orange-700 text-white w-full md:col-span-1`}>
                            <SearchIcon size={16} className="mr-2"/> Search
                        </button>
                    </div>
                </ControlCard>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                    <ControlCard title="Complexity" icon={<Activity />} className="lg:col-span-1 h-full">
                        <div className="text-sm space-y-2 text-gray-700 dark:text-slate-300">
                            <div className="flex justify-between"><span>Time Complexity:</span><span className="font-bold font-mono">{complexity.time}</span></div>
                            <div className="flex justify-between"><span>Space Complexity:</span><span className="font-bold font-mono">{complexity.space}</span></div>
                            {searchingAlgorithms.find(a => a.name === selectedAlgorithm)?.requiresSorted && (
                                <p className="text-xs text-amber-500 pt-2">*Requires a sorted array.</p>
                            )}
                        </div>
                    </ControlCard>

                    <ControlCard title="Visualizer" icon={<Eye />} className="lg:col-span-2 h-full">
                        <SearchingVisualizer
                            steps={steps}
                            initialArray={array}
                            target={parseInt(targetValue, 10)}
                            onAnimationComplete={handleAnimationComplete}
                        />
                    </ControlCard>
                </div>
            </div>
        </div>
    );
};

export default SearchingPage;

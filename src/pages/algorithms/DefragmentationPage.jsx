import React, { useState, useEffect, useRef } from 'react';
import DefragmentationVisualizer from '../../components/visualizers/DefragmentationVisualizer';
import { firstFit, bestFit, worstFit, nextFit, compaction } from '../../utils/algorithms/defragmentation';
import { Plus, Play, RotateCcw } from 'lucide-react';

const memoryAlgorithms = [
    { name: 'First Fit', func: firstFit, desc: 'Allocates the first free block large enough.' },
    { name: 'Best Fit', func: bestFit, desc: 'Allocates the smallest free block large enough.' },
    { name: 'Worst Fit', func: worstFit, desc: 'Allocates the largest free block large enough.' },
    { name: 'Next Fit', func: nextFit, desc: 'Starts searching from the last allocation\'s end point.' },
];

const DefragmentationPage = () => {
    const [totalMemorySize, setTotalMemorySize] = useState(256);
    const [memoryState, setMemoryState] = useState([]);
    const [queuedProcesses, setQueuedProcesses] = useState([]);
    const [newProcessId, setNewProcessId] = useState('P1');
    const [newProcessSize, setNewProcessSize] = useState('');
    const [selectedAlgorithm, setSelectedAlgorithm] = useState(memoryAlgorithms[0].name);
    const [history, setHistory] = useState([]);
    const [metrics, setMetrics] = useState({
        totalAllocated: 0,
        totalFree: 0,
        numFreeBlocks: 0,
        largestFreeBlock: 0,
    });
    const [highlightedBlockIndex, setHighlightedBlockIndex] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const nextFitPointerRef = useRef(0);
    const processIdCounterRef = useRef(1);

    const showMessage = (message) => {
        setModalMessage(message);
        setShowModal(true);
        setTimeout(() => setShowModal(false), 3000);
    };

    const initializeMemory = () => {
        setMemoryState([{
            id: 'free',
            type: 'free',
            size: totalMemorySize,
            startAddress: 0,
        }]);
        setQueuedProcesses([]);
        setHistory([]);
        setMetrics({
            totalAllocated: 0,
            totalFree: totalMemorySize,
            numFreeBlocks: 1,
            largestFreeBlock: totalMemorySize,
        });
        setHighlightedBlockIndex(null);
        nextFitPointerRef.current = 0;
        processIdCounterRef.current = 1;
        setNewProcessId('P1');
    };

    useEffect(() => {
        initializeMemory();
    }, [totalMemorySize]);

    const handleAddProcess = () => {
        if (!newProcessId || !newProcessSize) {
            showMessage('Please enter both Process ID and Size.');
            return;
        }

        const size = parseInt(newProcessSize);
        if (size <= 0 || size > totalMemorySize) {
            showMessage('Process size must be a positive number and not exceed total memory.');
            return;
        }
        
        const process = {
            id: newProcessId,
            size: size,
        };

        setQueuedProcesses(prev => [...prev, process]);
        setHistory(prev => [...prev, {
            event: 'Process Added',
            process: newProcessId,
            size: size + 'KB',
            algorithm: '-',
            allocationAddress: '-',
            memoryStateSummary: `Added process ${newProcessId} to the queue.`,
        }]);
        processIdCounterRef.current++;
        setNewProcessId(`P${processIdCounterRef.current}`);
        setNewProcessSize('');
    };

    const handleAllocateNext = () => {
        if (queuedProcesses.length === 0) {
            showMessage('No processes in the queue to allocate.');
            return;
        }

        const processToAllocate = queuedProcesses[0];
        const algoFunc = memoryAlgorithms.find(a => a.name === selectedAlgorithm).func;

        let result;
        if (selectedAlgorithm === 'Next Fit') {
            result = algoFunc(memoryState, processToAllocate, nextFitPointerRef.current);
        } else {
            result = algoFunc(memoryState, processToAllocate);
        }
        
        const { newMemoryState, allocatedIndex, newNextFitPointer } = result;

        if (allocatedIndex !== null) {
            setHighlightedBlockIndex(allocatedIndex);
            if (selectedAlgorithm === 'Next Fit') {
                nextFitPointerRef.current = newNextFitPointer;
            }

            let newBlocks = [...newMemoryState];
            const oldBlock = newBlocks[allocatedIndex];

            // Split the block
            const remainingSize = oldBlock.size - processToAllocate.size;

            if (remainingSize > 0) {
                newBlocks.splice(allocatedIndex, 1, {
                    id: processToAllocate.id,
                    type: 'allocated',
                    processId: processToAllocate.id,
                    size: processToAllocate.size,
                    startAddress: oldBlock.startAddress,
                }, {
                    id: 'free',
                    type: 'free',
                    size: remainingSize,
                    startAddress: oldBlock.startAddress + processToAllocate.size,
                });
            } else {
                newBlocks.splice(allocatedIndex, 1, {
                    id: processToAllocate.id,
                    type: 'allocated',
                    processId: processToAllocate.id,
                    size: processToAllocate.size,
                    startAddress: oldBlock.startAddress,
                });
            }

            // Update state
            setMemoryState(newBlocks);
            setQueuedProcesses(queuedProcesses.slice(1));
            updateMetrics(newBlocks);

            setHistory(prev => [...prev, {
                event: 'Process Allocated',
                process: processToAllocate.id,
                size: processToAllocate.size + 'KB',
                algorithm: selectedAlgorithm,
                allocationAddress: oldBlock.startAddress + 'KB',
                memoryStateSummary: `Allocated ${processToAllocate.id} at ${oldBlock.startAddress}KB.`,
            }]);
            setTimeout(() => setHighlightedBlockIndex(null), 1500); // Clear highlight after a delay
        } else {
            showMessage(`Could not allocate ${processToAllocate.id}. No suitable free block found.`);
            setHistory(prev => [...prev, {
                event: 'Allocation Failed',
                process: processToAllocate.id,
                size: processToAllocate.size + 'KB',
                algorithm: selectedAlgorithm,
                allocationAddress: '-',
                memoryStateSummary: `Failed to allocate ${processToAllocate.id}. No block large enough.`,
            }]);
        }
    };

    const handleCompaction = () => {
        const compactedMemory = compaction(memoryState, totalMemorySize);
        setMemoryState(compactedMemory);
        updateMetrics(compactedMemory);
        setHistory(prev => [...prev, {
            event: 'Compaction Run',
            process: '-',
            size: '-',
            algorithm: 'Compaction',
            allocationAddress: '-',
            memoryStateSummary: `Memory has been defragmented. All free space is now contiguous.`,
        }]);
    };

    const handleReset = () => {
        initializeMemory();
    };

    const updateMetrics = (currentMemoryState) => {
        const totalAllocated = currentMemoryState.reduce((sum, block) => block.type === 'allocated' ? sum + block.size : sum, 0);
        const totalFree = totalMemorySize - totalAllocated;
        const freeBlocks = currentMemoryState.filter(block => block.type === 'free');
        const numFreeBlocks = freeBlocks.length;
        const largestFreeBlock = numFreeBlocks > 0 ? Math.max(...freeBlocks.map(block => block.size)) : 0;

        setMetrics({
            totalAllocated,
            totalFree,
            numFreeBlocks,
            largestFreeBlock,
        });
    };

    return (
        <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen font-inter text-gray-800 dark:text-gray-200">
            <h1 className="text-4xl font-bold text-center mb-8">Free Space Defragmentation Visualizer</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Panel: User Controls */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl space-y-6">
                    <h2 className="text-2xl font-bold">User Controls</h2>
                    {/* Algorithm Selection */}
                    <div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-600 dark:text-gray-400">1. Algorithm Selection</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {memoryAlgorithms.map(algo => (
                                <div key={algo.name}>
                                    <input
                                        type="radio"
                                        id={algo.name}
                                        name="memoryAlgorithm"
                                        value={algo.name}
                                        checked={selectedAlgorithm === algo.name}
                                        onChange={(e) => setSelectedAlgorithm(e.target.value)}
                                        className="hidden peer"
                                    />
                                    <label
                                        htmlFor={algo.name}
                                        className="p-4 block w-full bg-gray-100 dark:bg-gray-900 rounded-lg border-2 border-gray-300 dark:border-gray-700 cursor-pointer
                                        peer-checked:border-blue-500 peer-checked:shadow-lg peer-checked:bg-blue-500 peer-checked:text-white
                                        transition-all duration-200 dark:text-gray-200"
                                    >
                                        <div className="font-semibold text-lg">{algo.name}</div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 peer-checked:text-white">{algo.desc}</p>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Simulation Configuration */}
                    <div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-600 dark:text-gray-400">2. Simulation Configuration</h3>
                        <div className="flex flex-col mb-4">
                            <label htmlFor="totalMemorySize" className="block text-lg font-medium text-gray-600 dark:text-gray-400 mb-1">Total Memory Size (KB):</label>
                            <input
                                type="number"
                                id="totalMemorySize"
                                value={totalMemorySize}
                                onChange={(e) => setTotalMemorySize(Math.max(1, parseInt(e.target.value)))}
                                min="1"
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div className="border-t border-gray-300 dark:border-gray-700 pt-4">
                            <h4 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">Add Process</h4>
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={newProcessId}
                                    onChange={(e) => setNewProcessId(e.target.value)}
                                    placeholder="P-ID (e.g., P1)"
                                    className="p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white w-1/3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <input
                                    type="number"
                                    value={newProcessSize}
                                    onChange={(e) => setNewProcessSize(e.target.value)}
                                    placeholder="Size (KB)"
                                    min="1"
                                    className="p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white w-1/3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <button
                                    onClick={handleAddProcess}
                                    className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors shadow-md w-1/3 flex items-center justify-center"
                                >
                                    <Plus size={16} className="mr-2" /> Add
                                </button>
                            </div>
                        </div>
                        <div className="mt-4">
                            <h4 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">Queued Processes:</h4>
                            <ul className="list-disc list-inside dark:text-gray-400">
                                {queuedProcesses.length > 0 ? (
                                    queuedProcesses.map((p, index) => (
                                        <li key={index}>{p.id} ({p.size}KB)</li>
                                    ))
                                ) : (
                                    <li className="text-sm italic">No processes in queue.</li>
                                )}
                            </ul>
                        </div>
                    </div>
                    {/* Action Buttons */}
                    <div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-600 dark:text-gray-400">3. Actions</h3>
                        <div className="flex flex-col space-y-2">
                            <button
                                onClick={handleAllocateNext}
                                className="bg-green-600 text-white p-3 rounded-md hover:bg-green-700 transition-colors shadow-md flex items-center justify-center"
                            >
                                <Play size={16} className="mr-2" /> Allocate Next Process
                            </button>
                            <button
                                onClick={handleCompaction}
                                className="bg-yellow-500 text-white p-3 rounded-md hover:bg-yellow-600 transition-colors shadow-md"
                            >
                                Run Compaction
                            </button>
                            <button
                                onClick={handleReset}
                                className="bg-red-500 text-white p-3 rounded-md hover:bg-red-600 transition-colors shadow-md flex items-center justify-center"
                            >
                                <RotateCcw size={16} className="mr-2" /> Reset
                            </button>
                        </div>
                    </div>
                </div>
                {/* Middle Panel: Simulation & Visualization */}
                <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl flex flex-col items-center">
                    <h2 className="text-2xl font-bold mb-4">Memory Visualization</h2>
                    <DefragmentationVisualizer
                        memoryState={memoryState}
                        totalMemorySize={totalMemorySize}
                        highlightedBlockIndex={highlightedBlockIndex}
                        nextFitPointer={selectedAlgorithm === 'Next Fit' ? nextFitPointerRef.current : null}
                    />
                </div>
                {/* Right Panel: Metrics & History */}
                <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl space-y-6">
                    <h2 className="text-2xl font-bold">Metrics & History</h2>
                    <div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-600 dark:text-gray-400">1. Performance Summary</h3>
                        <div className="space-y-1 text-gray-700 dark:text-gray-300">
                            <p><strong>Total Allocated Memory:</strong> {metrics.totalAllocated}KB</p>
                            <p><strong>Total Free Memory:</strong> {metrics.totalFree}KB</p>
                            <p><strong>Number of Free Blocks:</strong> {metrics.numFreeBlocks}</p>
                            <p><strong>Largest Contiguous Free Block:</strong> {metrics.largestFreeBlock}KB</p>
                        </div>
                    </div>
                    {history.length > 0 && (
                        <div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-600 dark:text-gray-400">2. Step-by-Step History</h3>
                            <div className="overflow-x-auto rounded-lg border dark:border-gray-700">
                                <table className="min-w-full table-auto border-collapse">
                                    <thead>
                                        <tr className="bg-gray-200 dark:bg-gray-700 text-sm">
                                            <th className="px-4 py-2 text-center border-b border-gray-300 dark:border-gray-600">Event</th>
                                            <th className="px-4 py-2 text-center border-b border-gray-300 dark:border-gray-600">Algorithm</th>
                                            <th className="px-4 py-2 text-center border-b border-gray-300 dark:border-gray-600">Process (Size)</th>
                                            <th className="px-4 py-2 text-center border-b border-gray-300 dark:border-gray-600">Allocated Address</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {history.map((entry, index) => (
                                            <tr key={index} className={`border-b border-gray-200 dark:border-gray-700 ${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'}`}>
                                                <td className="px-4 py-2 text-center">{entry.event}</td>
                                                <td className="px-4 py-2 text-center">{entry.algorithm}</td>
                                                <td className="px-4 py-2 text-center">{entry.process} ({entry.size})</td>
                                                <td className="px-4 py-2 text-center">{entry.allocationAddress}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Custom Modal for alerts */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
                        <p className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{modalMessage}</p>
                        <button
                            onClick={() => setShowModal(false)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DefragmentationPage;
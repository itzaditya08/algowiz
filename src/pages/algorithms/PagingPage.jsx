import React, { useState, useEffect, useCallback } from 'react';
import VisualizerLayout from '../../components/visualizer-core/VisualizerLayout';
import ControlPanel from '../../components/visualizer-core/ControlPanel';
import InfoPanel from '../../components/visualizer-core/InfoPanel';
import CanvasArea from '../../components/visualizer-core/CanvasArea';
import PagingVisualizer from '../../components/visualizers/PagingVisualizer';
import { generatePagingSteps } from '../../utils/algorithms/paging/pagingEngine';

const defaultInput = "7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2";

const PagingPage = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(60);
    const [algorithm, setAlgorithm] = useState('LRU');
    const [capacity, setCapacity] = useState(3);
    const [inputStr, setInputStr] = useState(defaultInput);
    
    const [steps, setSteps] = useState([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    const initVisualizer = useCallback(() => {
        setIsPlaying(false);
        const refStr = inputStr.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
        if (refStr.length > 0) {
            setSteps(generatePagingSteps(refStr, capacity, algorithm));
            setCurrentStepIndex(0);
        }
    }, [algorithm, capacity, inputStr]);

    useEffect(() => { initVisualizer(); }, [initVisualizer]);

    useEffect(() => {
        let timer;
        if (isPlaying && currentStepIndex < steps.length - 1) {
            timer = setTimeout(() => { setCurrentStepIndex(p => p + 1); }, 1500 - (speed * 14));
        } else if (currentStepIndex >= steps.length - 1) {
            setIsPlaying(false);
        }
        return () => clearTimeout(timer);
    }, [isPlaying, currentStepIndex, steps.length, speed]);

    const frame = steps[currentStepIndex] || null;

    return (
        <VisualizerLayout 
            controls={
                <ControlPanel 
                    isPlaying={isPlaying} onPlayPause={() => setIsPlaying(!isPlaying)}
                    onReset={initVisualizer}
                    onStep={() => { setIsPlaying(false); if (currentStepIndex < steps.length - 1) setCurrentStepIndex(p => p + 1); }}
                    speed={speed} onSpeedChange={setSpeed}
                >
                    <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)} className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm rounded-lg px-3 py-2 outline-none">
                        <option>LRU</option>
                        <option>FIFO</option>
                        <option>Optimal</option>
                    </select>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">Frames:</span>
                        <input type="number" min="2" max="6" value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} className="w-16 p-1 text-center bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none font-bold" />
                    </div>
                </ControlPanel>
            }
            info={
                <div className="flex flex-col gap-4 h-full">
                    <InfoPanel 
                        title={`${algorithm} Page Replacement`}
                        description="Operating System memory management technique. Determines which memory page to page-out (evict) to disk when a page fault occurs and RAM is full."
                        timeComplexity="O(1) to O(N)"
                        spaceComplexity="O(Frames)"
                        currentStepMsg={frame ? frame.action : "Ready"}
                    />
                    <div className="glass-panel rounded-2xl p-4 border border-gray-200/50 dark:border-gray-700/50 shadow-md">
                        <h3 className="text-sm font-bold mb-1">Reference Sequence</h3>
                        <textarea value={inputStr} onChange={(e) => setInputStr(e.target.value)} className="w-full h-16 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-sm font-mono outline-none focus:border-primary-blue resize-none" />
                        {frame && (
                            <div className="mt-2 text-sm font-bold text-red-500">Total Page Faults: {frame.pageFaults}</div>
                        )}
                    </div>
                </div>
            }
            canvas={
                <CanvasArea>
                    <PagingVisualizer stepData={frame} referenceString={inputStr.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n))} />
                </CanvasArea>
            }
        />
    );
};

export default PagingPage;
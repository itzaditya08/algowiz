import React, { useState, useEffect, useCallback } from 'react';
import VisualizerLayout from '../../components/visualizer-core/VisualizerLayout';
import ControlPanel from '../../components/visualizer-core/ControlPanel';
import InfoPanel from '../../components/visualizer-core/InfoPanel';
import CanvasArea from '../../components/visualizer-core/CanvasArea';
import SortingVisualizer from '../../components/visualizers/SortingVisualizer';
import { generateSortingSteps } from '../../utils/algorithms/sorting/sortingEngine';

const defaultArray = "45, 22, 68, 12, 89, 34, 99, 15, 55, 71";

const SortingPage = () => {
    // Replace your current state declarations with this:
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(60);
    const [algorithm, setAlgorithm] = useState('Bubble Sort');
    const [inputStr, setInputStr] = useState(defaultArray);
    
    // SYNCHRONOUS FIX: Initialize steps immediately on mount
    const [steps, setSteps] = useState(() => {
      const parsed = defaultArray.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
      return generateSortingSteps(parsed, 'Bubble Sort');
    });
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    const initVisualizer = useCallback(() => {
        setIsPlaying(false);
        const parsed = inputStr.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
        if (parsed.length > 0) {
            setSteps(generateSortingSteps(parsed, algorithm));
            setCurrentStepIndex(0);
        }
    }, [algorithm, inputStr]);

    useEffect(() => { initVisualizer(); }, [initVisualizer]);

    useEffect(() => {
        let timer;
        if (isPlaying && currentStepIndex < steps.length - 1) {
            timer = setTimeout(() => { setCurrentStepIndex(p => p + 1); }, 1000 - (speed * 9));
        } else if (currentStepIndex >= steps.length - 1) setIsPlaying(false);
        return () => clearTimeout(timer);
    }, [isPlaying, currentStepIndex, steps.length, speed]);

    const frame = steps[currentStepIndex] || { array: [], activeIndices: [], sortedIndices: [], message: "" };

    const customControls = (
        <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)} className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm rounded-lg px-3 py-2 outline-none">
            <option>Bubble Sort</option>
            <option>Selection Sort</option>
            <option>Insertion Sort</option>
            <option>Merge Sort</option>
            <option>Quick Sort</option>
        </select>
    );

    return (
        <VisualizerLayout 
            controls={<ControlPanel isPlaying={isPlaying} onPlayPause={() => setIsPlaying(!isPlaying)} onReset={initVisualizer} onStep={() => { setIsPlaying(false); if (currentStepIndex < steps.length - 1) setCurrentStepIndex(p => p + 1); }} speed={speed} onSpeedChange={setSpeed}>{customControls}</ControlPanel>}
            info={
                <div className="flex flex-col gap-4 h-full">
                    <InfoPanel title={algorithm} description="Rearranges elements in a specific order." timeComplexity={algorithm === 'Merge Sort' || algorithm === 'Quick Sort' ? "O(N log N)" : "O(N²)"} spaceComplexity="O(1) to O(N)" currentStepMsg={frame.message} />
                    <div className="glass-panel rounded-2xl p-4 shadow-md flex-1">
                        <h3 className="text-sm font-bold mb-1">Input Array</h3>
                        <textarea value={inputStr} onChange={(e) => setInputStr(e.target.value)} className="w-full h-16 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-sm font-mono outline-none resize-none" />
                    </div>
                </div>
            }
            canvas={<CanvasArea><SortingVisualizer array={frame.array} activeIndices={frame.activeIndices} sortedIndices={frame.sortedIndices} /></CanvasArea>}
        />
    );
};

export default SortingPage;
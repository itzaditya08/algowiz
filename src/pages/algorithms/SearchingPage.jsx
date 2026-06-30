import React, { useState, useEffect, useCallback } from 'react';
import VisualizerLayout from '../../components/visualizer-core/VisualizerLayout';
import ControlPanel from '../../components/visualizer-core/ControlPanel';
import InfoPanel from '../../components/visualizer-core/InfoPanel';
import CanvasArea from '../../components/visualizer-core/CanvasArea';
import SearchingVisualizer from '../../components/visualizers/SearchingVisualizer';
import { generateSearchingSteps } from '../../utils/algorithms/searching/searchingEngine';

const defaultArray = "2, 4, 8, 12, 16, 23, 38, 45, 56, 72, 91, 105";

const SearchingPage = () => {
    // Replace your current state declarations with this:
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(60);
    const [algorithm, setAlgorithm] = useState('Binary Search');
    const [inputStr, setInputStr] = useState(defaultArray);
    const [target, setTarget] = useState(45);

    // SYNCHRONOUS FIX: Initialize steps immediately on mount
    const [steps, setSteps] = useState(() => {
        const parsed = defaultArray.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n)).sort((a, b) => a - b);
        return generateSearchingSteps(parsed, 45, 'Binary Search');
    });
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    const initVisualizer = useCallback(() => {
        setIsPlaying(false);
        const parsed = inputStr.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
        
        // Binary and Exponential require sorted arrays. Force sort if user inputs random data.
        if (algorithm !== 'Linear Search') parsed.sort((a, b) => a - b);
        
        if (parsed.length > 0) {
            setSteps(generateSearchingSteps(parsed, target, algorithm));
            setCurrentStepIndex(0);
        }
    }, [algorithm, inputStr, target]);

    useEffect(() => { initVisualizer(); }, [initVisualizer]);

    useEffect(() => {
        let timer;
        if (isPlaying && currentStepIndex < steps.length - 1) {
            timer = setTimeout(() => { setCurrentStepIndex(p => p + 1); }, 1500 - (speed * 14));
        } else if (currentStepIndex >= steps.length - 1) setIsPlaying(false);
        return () => clearTimeout(timer);
    }, [isPlaying, currentStepIndex, steps.length, speed]);

    const frame = steps[currentStepIndex] || null;

    const customControls = (
        <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)} className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm rounded-lg px-3 py-2 outline-none">
            <option>Linear Search</option>
            <option>Binary Search</option>
            <option>Exponential Search</option>
        </select>
    );

    return (
        <VisualizerLayout 
            controls={<ControlPanel isPlaying={isPlaying} onPlayPause={() => setIsPlaying(!isPlaying)} onReset={initVisualizer} onStep={() => { setIsPlaying(false); if (currentStepIndex < steps.length - 1) setCurrentStepIndex(p => p + 1); }} speed={speed} onSpeedChange={setSpeed}>{customControls}</ControlPanel>}
            info={
                <div className="flex flex-col gap-4 h-full">
                    <InfoPanel title={algorithm} description="Algorithms designed to check for an element or retrieve an element from any data structure." timeComplexity={algorithm === 'Linear Search' ? "O(N)" : "O(log N)"} spaceComplexity="O(1)" currentStepMsg={frame ? frame.message : "Ready"} />
                    
                    <div className="glass-panel rounded-2xl p-4 shadow-md flex-1">
                        <h3 className="text-sm font-bold mb-1">Target Value</h3>
                        <input type="number" value={target} onChange={(e) => setTarget(Number(e.target.value))} className="w-full p-2 mb-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none font-bold text-primary-blue" />
                        
                        <h3 className="text-sm font-bold mb-1">Search Space Array</h3>
                        <p className="text-[10px] text-gray-500 mb-1">Auto-sorted for Binary/Exp searches.</p>
                        <textarea value={inputStr} onChange={(e) => setInputStr(e.target.value)} className="w-full h-16 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-sm font-mono outline-none resize-none" />
                    </div>
                </div>
            }
            canvas={<CanvasArea><SearchingVisualizer stepData={frame} /></CanvasArea>}
        />
    );
};

export default SearchingPage;
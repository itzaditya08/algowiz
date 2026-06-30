import React, { useState, useEffect, useCallback } from 'react';
import VisualizerLayout from '../../components/visualizer-core/VisualizerLayout';
import ControlPanel from '../../components/visualizer-core/ControlPanel';
import InfoPanel from '../../components/visualizer-core/InfoPanel';
import CanvasArea from '../../components/visualizer-core/CanvasArea';
import CacheEvictionVisualizer from '../../components/visualizers/CacheEvictionVisualizer';

// Import the user's data layer functions
import { fifo } from '../../utils/algorithms/cache/fifo';
import { lru } from '../../utils/algorithms/cache/lru';
import { lfu } from '../../utils/algorithms/cache/lfu';
import { random } from '../../utils/algorithms/cache/random';

const defaultRefString = "1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5";

const CacheEvictionPage = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(60);
    const [algorithm, setAlgorithm] = useState('LRU');
    const [cacheSize, setCacheSize] = useState(3);
    const [inputString, setInputString] = useState(defaultRefString);
    
    const [steps, setSteps] = useState([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    const initVisualizer = useCallback(() => {
        setIsPlaying(false);
        // Parse input safely
        const refArray = inputString.split(',').map(s => s.trim()).filter(s => s !== '');
        if (refArray.length === 0) return;

        let generatedSteps = [];
        if (algorithm === 'FIFO') generatedSteps = fifo(refArray, cacheSize);
        if (algorithm === 'LRU') generatedSteps = lru(refArray, cacheSize);
        if (algorithm === 'LFU') generatedSteps = lfu(refArray, cacheSize);
        if (algorithm === 'Random') generatedSteps = random(refArray, cacheSize);
        
        setSteps(generatedSteps);
        setCurrentStepIndex(0);
    }, [algorithm, cacheSize, inputString]);

    // Recalculate if core parameters change
    useEffect(() => { initVisualizer(); }, [initVisualizer]);

    // Playback loop
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

    const customControls = (
        <>
            <select 
                value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}
                className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm rounded-lg px-3 py-2 outline-none cursor-pointer"
            >
                <option>LRU</option>
                <option>FIFO</option>
                <option>LFU</option>
                <option>Random</option>
            </select>
            
            <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Cache Size:</span>
                <input 
                    type="number" min="1" max="6" 
                    value={cacheSize} onChange={(e) => setCacheSize(Number(e.target.value))}
                    className="w-16 p-1 text-center bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none font-bold text-primary-blue"
                />
            </div>
        </>
    );

    return (
        <VisualizerLayout 
            controls={
                <ControlPanel 
                    isPlaying={isPlaying} onPlayPause={() => setIsPlaying(!isPlaying)}
                    onReset={initVisualizer}
                    onStep={() => { setIsPlaying(false); if (currentStepIndex < steps.length - 1) setCurrentStepIndex(p => p + 1); }}
                    speed={speed} onSpeedChange={setSpeed}
                >
                    {customControls}
                </ControlPanel>
            }
            info={
                <div className="flex flex-col gap-4 h-full">
                    <InfoPanel 
                        title={`${algorithm} Eviction`}
                        description="Manages limited high-speed memory. Determines which block to throw out to make room for a new block when the cache is full."
                        timeComplexity="O(1) to O(N) per fault"
                        spaceComplexity="O(Cache Size)"
                        currentStepMsg={frame ? frame.action : "Ready"}
                    />
                    
                    <div className="glass-panel rounded-2xl p-4 border border-gray-200/50 dark:border-gray-700/50 shadow-md flex-1">
                        <h3 className="text-sm font-bold mb-1">Reference Sequence</h3>
                        <p className="text-[11px] text-gray-500 mb-2">Comma separated requests.</p>
                        <textarea
                            value={inputString}
                            onChange={(e) => setInputString(e.target.value)}
                            className="w-full h-20 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-sm font-mono outline-none focus:border-primary-blue resize-none"
                        />
                        {frame && (
                            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                                <div className="p-2 bg-emerald-100/50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-lg font-bold text-center">Hits: {frame.totalHits}</div>
                                <div className="p-2 bg-rose-100/50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 rounded-lg font-bold text-center">Faults: {frame.totalMisses}</div>
                            </div>
                        )}
                    </div>
                </div>
            }
            canvas={
                <CanvasArea>
                    <CacheEvictionVisualizer stepData={frame} selectedAlgorithm={algorithm} />
                </CanvasArea>
            }
        />
    );
};

export default CacheEvictionPage;
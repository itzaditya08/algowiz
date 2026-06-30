import React, { useState, useEffect, useCallback } from 'react';
import VisualizerLayout from '../../components/visualizer-core/VisualizerLayout';
import ControlPanel from '../../components/visualizer-core/ControlPanel';
import InfoPanel from '../../components/visualizer-core/InfoPanel';
import CanvasArea from '../../components/visualizer-core/CanvasArea';
import DefragmentationVisualizer from '../../components/visualizers/DefragmentationVisualizer';
import { generateAllocationSteps } from '../../utils/algorithms/defragmentation/memoryEngine';

const defaultBlocks = "100, 500, 200, 300, 600";
const defaultProcesses = "1: 212, 2: 417, 3: 112, 4: 426";

const DefragmentationPage = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(60);
    const [algorithm, setAlgorithm] = useState('First Fit');
    const [doCompaction, setDoCompaction] = useState(false);
    
    const [blocksInput, setBlocksInput] = useState(defaultBlocks);
    const [procsInput, setProcsInput] = useState(defaultProcesses);
    
    const [steps, setSteps] = useState([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    const initVisualizer = useCallback(() => {
        setIsPlaying(false);
        try {
            // Parse initial free memory partitions
            const initialBlocks = blocksInput.split(',').map(s => ({ size: parseInt(s.trim()), isFree: true }));
            // Parse incoming process requests
            const procs = procsInput.split(',').map(s => {
                const parts = s.split(':');
                return { id: parts[0].trim(), size: parseInt(parts[1].trim()) };
            });

            if (initialBlocks.length > 0 && procs.length > 0) {
                setSteps(generateAllocationSteps(0, initialBlocks, procs, algorithm, doCompaction));
                setCurrentStepIndex(0);
            }
        } catch (e) {
            console.error("Invalid Input Format");
        }
    }, [algorithm, doCompaction, blocksInput, procsInput]);

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
        <>
            <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)} className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm rounded-lg px-3 py-2 outline-none">
                <option>First Fit</option>
                <option>Next Fit</option>
                <option>Best Fit</option>
                <option>Worst Fit</option>
            </select>
            <div className="flex items-center space-x-2 ml-2">
                <input type="checkbox" id="compact" checked={doCompaction} onChange={(e) => setDoCompaction(e.target.checked)} className="cursor-pointer" />
                <label htmlFor="compact" className="text-sm font-medium cursor-pointer">Enable Compaction</label>
            </div>
        </>
    );

    return (
        <VisualizerLayout 
            controls={<ControlPanel isPlaying={isPlaying} onPlayPause={() => setIsPlaying(!isPlaying)} onReset={initVisualizer} onStep={() => { setIsPlaying(false); if (currentStepIndex < steps.length - 1) setCurrentStepIndex(p => p + 1); }} speed={speed} onSpeedChange={setSpeed}>{customControls}</ControlPanel>}
            info={
                <div className="flex flex-col gap-4 h-full">
                    <InfoPanel title={algorithm} description="Contiguous memory allocation techniques. Best Fit minimizes wasted space per block, while First Fit optimizes allocation speed." timeComplexity="O(N) per allocation" spaceComplexity="O(Blocks)" currentStepMsg={frame ? frame.message : "Ready"} />
                    <div className="glass-panel rounded-2xl p-4 border border-gray-200/50 dark:border-gray-700/50 shadow-md flex-1">
                        <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Free Partitions (KB)</h3>
                        <textarea value={blocksInput} onChange={(e) => setBlocksInput(e.target.value)} className="w-full h-10 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-xs font-mono outline-none resize-none mb-2" />
                        
                        <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Incoming Processes</h3>
                        <p className="text-[10px] text-gray-400 mb-1">Format: <code>ID: Size</code></p>
                        <textarea value={procsInput} onChange={(e) => setProcsInput(e.target.value)} className="w-full h-12 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-xs font-mono outline-none resize-none" />
                    </div>
                </div>
            }
            canvas={
                <CanvasArea>
                    <DefragmentationVisualizer stepData={frame} />
                </CanvasArea>
            }
        />
    );
};

export default DefragmentationPage;
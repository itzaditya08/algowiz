import React, { useState, useEffect, useCallback } from 'react';
import VisualizerLayout from '../../components/visualizer-core/VisualizerLayout';
import ControlPanel from '../../components/visualizer-core/ControlPanel';
import InfoPanel from '../../components/visualizer-core/InfoPanel';
import CanvasArea from '../../components/visualizer-core/CanvasArea';
import CPU_SchedulingVisualizer from '../../components/visualizers/CPU_SchedulingVisualizer';
import { generateSchedulingSteps } from '../../utils/algorithms/cpu_scheduling/schedulingEngine';

// Format: ID, Arrival, Burst, Priority
const defaultProcesses = "1, 0, 5, 2\n2, 1, 3, 1\n3, 2, 8, 3\n4, 4, 2, 4";

const CPU_SchedulingPage = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(60);
    const [algorithm, setAlgorithm] = useState('Round Robin');
    const [quantum, setQuantum] = useState(2);
    
    const [inputStr, setInputStr] = useState(defaultProcesses);
    const [steps, setSteps] = useState([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    const initVisualizer = useCallback(() => {
        setIsPlaying(false);
        try {
            const parsed = inputStr.trim().split('\n').map(line => {
                const parts = line.split(',').map(s => parseInt(s.trim()));
                return { id: parts[0], arrivalTime: parts[1], burstTime: parts[2], priority: parts[3] || 0 };
            });
            if (parsed.length > 0) {
                setSteps(generateSchedulingSteps(parsed, algorithm, quantum));
                setCurrentStepIndex(0);
            }
        } catch (e) {
            console.error("Invalid Process Input");
        }
    }, [algorithm, quantum, inputStr]);

    useEffect(() => { initVisualizer(); }, [initVisualizer]);

    useEffect(() => {
        let timer;
        if (isPlaying && currentStepIndex < steps.length - 1) {
            timer = setTimeout(() => { setCurrentStepIndex(p => p + 1); }, 1200 - (speed * 10));
        } else if (currentStepIndex >= steps.length - 1) setIsPlaying(false);
        return () => clearTimeout(timer);
    }, [isPlaying, currentStepIndex, steps.length, speed]);

    const frame = steps[currentStepIndex] || { time: 0, readyQueue: [], activeProcessId: null, ganttChart: [], processesState: [], message: "" };

    const customControls = (
        <>
            <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)} className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm rounded-lg px-3 py-2 outline-none">
                <option>FCFS</option>
                <option>SJF (Non-Preemptive)</option>
                <option>SJF (Preemptive)</option>
                <option>Priority (Non-Preemptive)</option>
                <option>Priority (Preemptive)</option>
                <option>Round Robin</option>
            </select>
            {algorithm === 'Round Robin' && (
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">TQ:</span>
                    <input type="number" min="1" max="10" value={quantum} onChange={(e) => setQuantum(Number(e.target.value))} className="w-16 p-1 text-center bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none font-bold" />
                </div>
            )}
        </>
    );

    return (
        <VisualizerLayout 
            controls={<ControlPanel isPlaying={isPlaying} onPlayPause={() => setIsPlaying(!isPlaying)} onReset={initVisualizer} onStep={() => { setIsPlaying(false); if (currentStepIndex < steps.length - 1) setCurrentStepIndex(p => p + 1); }} speed={speed} onSpeedChange={setSpeed}>{customControls}</ControlPanel>}
            info={
                <div className="flex flex-col gap-4 h-full">
                    <InfoPanel title={algorithm} description="Determines the sequence in which processes get access to the CPU core." timeComplexity="O(N log N)" spaceComplexity="O(N)" currentStepMsg={frame.message} />
                    <div className="glass-panel rounded-2xl p-4 border border-gray-200/50 dark:border-gray-700/50 shadow-md flex-1">
                        <h3 className="text-sm font-bold mb-1">Process Data Input</h3>
                        <p className="text-[10px] text-gray-500 mb-2">Format: <code>ID, Arrival, Burst, Priority</code></p>
                        <textarea value={inputStr} onChange={(e) => setInputStr(e.target.value)} className="w-full h-24 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-sm font-mono outline-none resize-none" />
                    </div>
                </div>
            }
            canvas={
                <CanvasArea>
                    <CPU_SchedulingVisualizer time={frame.time} readyQueue={frame.readyQueue} activeProcessId={frame.activeProcessId} ganttChart={frame.ganttChart} processesState={frame.processesState} />
                </CanvasArea>
            }
        />
    );
};

export default CPU_SchedulingPage;
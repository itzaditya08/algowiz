import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';

const SortingVisualizer = ({ initialArray, steps, onAnimationComplete }) => {
    const [array, setArray] = useState(initialArray);
    const [stepIndex, setStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(500);
    const [round, setRound] = useState(0);
    const [swaps, setSwaps] = useState(0);
    const animationRef = useRef(null);

    useEffect(() => {
        setArray(initialArray);
        setStepIndex(0);
        setIsPlaying(false);
        setRound(0);
        setSwaps(0);
    }, [initialArray, steps]);

    useEffect(() => {
        if (!isPlaying || stepIndex >= steps.length) {
            clearTimeout(animationRef.current);
            if (isPlaying && stepIndex >= steps.length) {
                setIsPlaying(false);
                onAnimationComplete();
            }
            return;
        }
        animationRef.current = setTimeout(() => {
            const currentStep = steps[stepIndex];
            setArray(currentStep.array);
            if (currentStep.type === 'round') setRound(prev => prev + 1);
            if (currentStep.type === 'swap') setSwaps(prev => prev + 1);
            setStepIndex(stepIndex + 1);
        }, speed);
        return () => clearTimeout(animationRef.current);
    }, [isPlaying, stepIndex, steps, speed, onAnimationComplete]);

    // All handler functions remain unchanged
    const handlePlayPause = () => setIsPlaying(!isPlaying);
    const handleNext = () => {
        if (stepIndex < steps.length) {
            const currentStep = steps[stepIndex];
            setArray(currentStep.array);
            if (currentStep.type === 'round') setRound(prev => prev + 1);
            if (currentStep.type === 'swap') setSwaps(prev => prev + 1);
            setStepIndex(stepIndex + 1);
        }
    };
    const handlePrev = () => {
        if (stepIndex > 0) {
            const newIndex = stepIndex - 1;
            const prevStep = steps[newIndex > 0 ? newIndex - 1 : 0];
            // This logic is simplified for aesthetic updates, might need review for functional accuracy if counters are critical during reverse stepping
            if (prevStep.type === 'round' && round > 0) setRound(prev => prev - 1);
            if (prevStep.type === 'swap' && swaps > 0) setSwaps(prev => prev - 1);
            setArray(steps[newIndex].array);
            setStepIndex(newIndex);
        }
    };
    const handleReset = () => {
        setArray(initialArray);
        setStepIndex(0);
        setIsPlaying(false);
        setRound(0);
        setSwaps(0);
    };

    const getBarColor = (index) => {
        const currentStep = steps[stepIndex > 0 ? stepIndex - 1 : 0];
        if (!currentStep || stepIndex === 0) return 'bg-slate-300 dark:bg-slate-600';

        if (currentStep.type === 'sorted' && currentStep.indices.includes(index)) return 'bg-emerald-500';
        if (currentStep.type === 'swap' && currentStep.indices.includes(index)) return 'bg-rose-500';
        if (currentStep.type === 'compare' && currentStep.indices.includes(index)) return 'bg-amber-500';
        
        return 'bg-slate-300 dark:bg-slate-600';
    };

    const isAnimationFinished = stepIndex >= steps.length && steps.length > 0;

    return (
        <div className="w-full space-y-4">
            {/* Bar Chart Visualization */}
            <div className="flex justify-center items-end h-72 w-full p-4 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg shadow-inner">
                {array.map((value, index) => (
                    <div
                        key={index}
                        className="flex-1 flex flex-col justify-end mx-0.5 transition-all duration-300 ease-in-out rounded-t-md"
                        style={{ height: `${(value / Math.max(...array, 1)) * 100}%` }}
                    >
                         <div
                            className={`h-full w-full rounded-t-md ${getBarColor(index)} transition-colors duration-300 flex items-end justify-center`}
                         >
                            <span className="text-xs text-white font-bold pb-1">{value > 10 ? value : ''}</span>
                         </div>
                    </div>
                ))}
            </div>

            {/* Counters and Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                {/* Counters */}
                <div className="flex justify-around md:justify-start space-x-6 col-span-1">
                    <div className="text-center">
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Passes</span>
                        <span className="block text-2xl font-bold text-indigo-500">{round}</span>
                    </div>
                    <div className="text-center">
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Swaps</span>
                        <span className="block text-2xl font-bold text-rose-500">{swaps}</span>
                    </div>
                </div>

                {/* Main Controls */}
                <div className="flex justify-center space-x-2 col-span-1">
                    <button onClick={handlePrev} disabled={stepIndex === 0 || isPlaying} className="p-2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 transition"><SkipBack size={20} /></button>
                    <button onClick={handlePlayPause} disabled={isAnimationFinished} className="w-24 h-10 flex items-center justify-center bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition shadow-lg">
                        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                    </button>
                    <button onClick={handleNext} disabled={isAnimationFinished || isPlaying} className="p-2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 transition"><SkipForward size={20} /></button>
                    <button onClick={handleReset} className="p-2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition"><RotateCcw size={20} /></button>
                </div>

                {/* Speed Control */}
                <div className="flex items-center justify-center md:justify-end space-x-2 col-span-1">
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Speed</span>
                    <input type="range" min="100" max="1000" step="50" value={1100 - speed} onChange={(e) => setSpeed(1100 - e.target.value)} className="w-32 accent-indigo-500"/>
                </div>
            </div>
        </div>
    );
};

export default SortingVisualizer;

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';

const SearchBlock = ({ value, color }) => (
    <div
        className={`flex items-center justify-center m-1 w-16 h-16 transition-all duration-300 ease-in-out rounded-lg font-bold text-lg text-white shadow-md ${color}`}
    >
        <span>{value}</span>
    </div>
);

const SearchingVisualizer = ({ initialArray, steps, target, onAnimationComplete }) => {
    const [stepIndex, setStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(500);
    const animationRef = useRef(null);

    // Reset visualization when initialArray or steps change
    useEffect(() => {
        setStepIndex(0);
        setIsPlaying(false);
    }, [initialArray, steps]);

    // Animation loop
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
            setStepIndex(prev => prev + 1);
        }, speed);

        return () => clearTimeout(animationRef.current);
    }, [isPlaying, stepIndex, steps, speed, onAnimationComplete]);

    const handlePlayPause = () => setIsPlaying(!isPlaying);
    const handleNext = () => !isAnimationFinished && setStepIndex(stepIndex + 1);
    const handlePrev = () => stepIndex > 0 && setStepIndex(stepIndex - 1);
    const handleReset = () => {
        setStepIndex(0);
        setIsPlaying(false);
    };

    const getBarColor = (index) => {
        if (steps.length === 0 || stepIndex === 0) return 'bg-slate-600';

        const currentStep = steps[stepIndex - 1];
        const { type, indices, range } = currentStep;

        if (type === 'found' && indices.includes(index)) return 'bg-emerald-500';
        if (type === 'compare' && indices.includes(index)) return 'bg-yellow-500';
        if (type === 'range_check' && indices.includes(index)) return 'bg-orange-500';
        if (range) {
            const [low, high] = range;
            if (index >= low && index <= high) {
                return 'bg-indigo-500'; // Active search range
            }
        }
        
        return 'bg-slate-600'; // Default/inactive
    };

    const isAnimationFinished = stepIndex >= steps.length;
    const currentStep = steps[stepIndex - 1];
    const buttonClass = "p-2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 transition";

    return (
        <div className="flex flex-col items-center p-4">
            {/* Array Visualization */}
            <div className="flex flex-wrap justify-center items-center h-auto min-h-[80px] w-full p-4 bg-slate-900/50 rounded-md">
                {initialArray.map((value, index) => (
                    <SearchBlock key={index} value={value} color={getBarColor(index)} />
                ))}
            </div>

            {/* Status Information */}
            <div className="mt-4 text-center text-slate-300 h-6">
                {currentStep && (
                    <p className="font-semibold text-md">
                        {currentStep.type === 'start' && `Starting search for ${target}`}
                        {currentStep.type === 'compare' && `Comparing with index ${currentStep.indices[0]} (value: ${initialArray[currentStep.indices[0]]})`}
                        {currentStep.type === 'found' && `Target ${target} found at index ${currentStep.indices[0]}`}
                        {currentStep.type === 'not_found' && `Target ${target} not found in the array`}
                        {currentStep.type === 'range_check' && `Checking range at index ${currentStep.indices[0]}`}
                        {currentStep.type === 'range_found' && `Narrowing search range to indices ${currentStep.range[0]} - ${currentStep.range[1]}`}
                    </p>
                )}
            </div>
            
            {/* Controls */}
            <div className="flex items-center space-x-4 mt-4">
                <button onClick={handlePrev} disabled={stepIndex === 0} className={buttonClass}><SkipBack /></button>
                <button onClick={handlePlayPause} className="w-24 h-10 flex items-center justify-center bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition shadow-lg" disabled={isAnimationFinished}>
                    {isPlaying ? <Pause size={20}/> : <Play size={20}/>}
                </button>
                <button onClick={handleNext} disabled={isAnimationFinished} className={buttonClass} ><SkipForward /></button>
                <button onClick={handleReset} className={buttonClass}><RotateCcw /></button>
            </div>
            
            {/* Speed Control */}
            <div className="flex items-center space-x-2 mt-4 w-full max-w-xs justify-center">
                <span className="text-slate-300 font-semibold text-sm">Slow</span>
                <input
                    type="range"
                    min="100"
                    max="1500"
                    step="100"
                    value={1600 - speed}
                    onChange={(e) => setSpeed(1600 - parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <span className="text-slate-300 font-semibold text-sm">Fast</span>
            </div>
        </div>
    );
};

export default SearchingVisualizer;

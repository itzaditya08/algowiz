import React from 'react';

const DefragmentationVisualizer = ({ memoryState, totalMemorySize, highlightedBlockIndex, nextFitPointerStart }) => {
    return (
        <div className="w-full flex justify-center items-start py-2 px-8 min-h-[500px] h-full">
            {/* Embedded CSS for highlight animation */}
            <style>
                {`
                @keyframes pulse-highlight {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
                    50% { box-shadow: 0 0 20px 8px rgba(99, 102, 241, 0.5); }
                }
                .highlighted-block {
                    animation: pulse-highlight 1.5s ease-out;
                    z-index: 10;
                }
                `}
            </style>
            
            {/* Memory Bar */}
            <div className="relative w-full max-w-[150px] h-full bg-slate-200 dark:bg-slate-700/50 rounded-lg shadow-inner overflow-hidden flex flex-col justify-end">
                {memoryState.map((block, index) => {
                    const heightPercentage = (block.size / totalMemorySize) * 100;
                    const blockColor = block.type === 'allocated' 
                        ? 'bg-indigo-600' 
                        : 'bg-slate-300 dark:bg-slate-600';

                    return (
                        <div
                            key={block.id + '-' + index}
                            className={`relative w-full flex flex-col justify-center items-center text-center border-t border-slate-400/50 dark:border-slate-800/80 box-border transition-all duration-500 ease-in-out ${blockColor} ${highlightedBlockIndex === index ? 'highlighted-block' : ''}`}
                            style={{ height: `${heightPercentage}%` }}
                        >
                            {heightPercentage > 5 && (
                                <div className="text-white text-[10px] leading-tight font-semibold p-1 break-words">
                                    {block.type === 'allocated' && <span>{block.id}</span>}
                                    <br />
                                    <span>{block.size}KB</span>
                                </div>
                            )}
                        </div>
                    );
                })}
                
                {/* Next Fit Pointer */}
                {nextFitPointerStart !== null && (
                     <div
                        className="absolute -left-4 -right-4 h-0.5 bg-amber-400 z-20 transition-all duration-500 ease-out"
                        style={{ bottom: `${(nextFitPointerStart / totalMemorySize) * 100}%` }}
                    >
                        <div className="absolute -left-1 -top-1 w-2 h-2 bg-amber-400 rounded-full"></div>
                        <div className="absolute -right-1 -top-1 w-2 h-2 bg-amber-400 rounded-full"></div>
                    </div>
                )}
            </div>

            {/* Address Labels */}
            <div className="absolute top-0 right-0 h-full w-10 flex flex-col justify-between text-xs text-slate-500 dark:text-slate-400 py-2">
                <span>0KB</span>
                <span className="-translate-y-1/2">{Math.round(totalMemorySize / 2)}KB</span>
                <span>{totalMemorySize}KB</span>
            </div>
        </div>
    );
};

export default DefragmentationVisualizer;
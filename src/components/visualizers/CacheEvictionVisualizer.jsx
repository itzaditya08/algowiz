import React from 'react';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

const CacheBlock = ({ blockData, isHighlighted, result, algorithm }) => {
    const getBlockInfo = () => {
        if (!blockData) return null;
        if (algorithm === 'LRU') return `Last Used: ${blockData.lastUsed}`;
        if (algorithm === 'LFU') return `Freq: ${blockData.frequency}`;
        return null;
    };

    const blockStyle = isHighlighted
        ? (result === 'hit' ? 'bg-emerald-500 ring-4 ring-emerald-500/30 text-white' : 'bg-rose-500 ring-4 ring-rose-500/30 text-white')
        : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200';

    return (
        <div className={`w-20 h-20 flex flex-col items-center justify-center p-2 rounded-lg shadow-md transition-all duration-300 ${blockStyle}`}>
            <span className="text-2xl font-bold">{blockData?.block}</span>
            <span className="text-xs font-mono mt-1 opacity-80">{getBlockInfo()}</span>
        </div>
    );
};

const CacheEvictionVisualizer = ({ stepData, selectedAlgorithm }) => {
    if (!stepData) return null;

    const { requestedBlock, cacheState, result, highlightIndex } = stepData;
    const isHit = result === 'hit';

    return (
        <div className="flex flex-col items-center justify-center w-full space-y-6 text-center">
            
            <div className="flex items-center space-x-4">
                <span className="text-lg font-medium text-slate-600 dark:text-slate-400">Requesting Block</span>
                <ArrowRight className="text-slate-400" size={24} />
                <div className="w-20 h-20 flex items-center justify-center bg-indigo-500 text-white rounded-lg text-3xl font-bold shadow-lg">
                    {requestedBlock}
                </div>
            </div>

            <div className="w-full">
                <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400 mb-2">Cache State</h3>
                <div className="flex flex-wrap justify-center gap-3 p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg">
                    {cacheState.map((blockData, index) => (
                        <CacheBlock
                            key={index}
                            blockData={blockData}
                            isHighlighted={index === highlightIndex}
                            result={result}
                            algorithm={selectedAlgorithm}
                        />
                    ))}
                </div>
            </div>
            
            <div className={`flex items-center gap-2 p-3 rounded-lg text-xl font-bold ${isHit ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                {isHit ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                <span>Cache {isHit ? 'Hit!' : 'Miss!'}</span>
            </div>
        </div>
    );
};

export default CacheEvictionVisualizer;

import React from 'react';

const PagingVisualizer = ({ stepData }) => {
    if (!stepData) return null;

    const { requestedPage, framesState, result, highlightIndex } = stepData;

    return (
        <div className="flex flex-col items-center justify-center p-4 min-h-[300px]">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">Simulation</h2>

            {/* Current Request */}
            <div className="flex items-center gap-4 mb-6">
                <span className="text-md font-medium text-slate-600 dark:text-slate-400">Current Request:</span>
                <div className="w-14 h-14 flex items-center justify-center bg-slate-200 dark:bg-slate-700 rounded-md text-2xl font-bold text-slate-800 dark:text-slate-200 shadow-sm">
                    {requestedPage}
                </div>
            </div>

            {/* Page Frames */}
            <div className="flex flex-col items-center space-y-3 mb-6">
                <h3 className="text-md font-medium text-slate-600 dark:text-slate-400">Page Frames</h3>
                <div className="flex flex-wrap justify-center gap-3">
                    {framesState.map((page, index) => (
                        <div
                            key={index}
                            className={`w-16 h-16 flex items-center justify-center text-white rounded-lg text-xl font-bold shadow-md transition-all duration-300
                            ${page === requestedPage && result === 'hit' ? 'bg-emerald-500 animate-pulse' : ''}
                            ${index === highlightIndex && result === 'fault' ? 'bg-amber-500 animate-pulse' : ''}
                            ${!(page === requestedPage && result === 'hit') && !(index === highlightIndex && result === 'fault') ? 'bg-indigo-600' : ''}`}
                        >
                            {page !== null ? page : '-'}
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Result */}
            <div className={`text-2xl font-bold py-2 px-4 rounded-lg
                ${result === 'hit' ? 'text-emerald-500' : 'text-red-500'}`}>
                {result === 'hit' ? 'Page Hit!' : 'Page Fault!'}
            </div>
        </div>
    );
};

export default PagingVisualizer;
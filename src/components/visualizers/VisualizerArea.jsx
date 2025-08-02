import React from 'react';
import { Info } from 'lucide-react';

const VisualizerArea = ({ title, showInfo, onInfoClick, children }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 min-h-[400px]">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
                {showInfo && (
                    <button
                        onClick={onInfoClick}
                        className="text-gray-500 dark:text-gray-400 hover:text-primary-blue dark:hover:text-primary-blue"
                    >
                        <Info className="h-5 w-5" />
                    </button>
                )}
            </div>
            <div className="overflow-x-auto overflow-y-hidden">
                {children}
            </div>
        </div>
    );
};

export default VisualizerArea;

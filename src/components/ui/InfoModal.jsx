import React from 'react';
import { X } from 'lucide-react';

const InfoModal = ({ isOpen, onClose, title, description }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-11/12 max-w-md">
                <div className="flex justify-between items-center border-b pb-3 mb-3 border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
                    <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                        <X size={24} />
                    </button>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{description}</p>
            </div>
        </div>
    );
};

export default InfoModal;
'use client'

import React, { useState, useEffect } from 'react';
import { Tracker } from '@/types/tracker';

interface TrackerInputProps {
    tracker: Tracker;
    date: Date;
    currentValue: string;
    onClose: () => void;
    onUnset: () => void;
    onSave: (value: string) => void;
}

const TrackerInput: React.FC<TrackerInputProps> = ({ tracker, date, currentValue, onClose, onSave, onUnset }) => {
    const [selectedValue, setSelectedValue] = useState(currentValue);

    useEffect(() => {
        setSelectedValue(currentValue);
    }, [currentValue]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg max-w-md w-full">
                <h3 className="text-lg font-bold mb-4">
                    {tracker.name} - {date.toLocaleDateString()}
                </h3>
                <div className="space-y-2">
                    {tracker.options.map((option) => (
                        <button
                            key={option.label}
                            className={`w-full p-2 rounded transition-all duration-200 ${
                                selectedValue === option.label ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                            }`}
                            style={{
                                backgroundColor: option.color,
                                color: option.textColor,
                                transform: selectedValue === option.label ? 'scale(1.02)' : 'scale(1)'
                            }}
                            onClick={() => setSelectedValue(option.label)}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onUnset()}
                        className={`bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition-colors`}
                    >
                        Unset
                    </button>
                    <button
                        onClick={() => onSave(selectedValue)}
                        className={`bg-blue-500 text-white px-4 py-2 rounded enabled:hover:bg-blue-600 transition-colors ${
                            !selectedValue ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        disabled={!selectedValue}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TrackerInput;


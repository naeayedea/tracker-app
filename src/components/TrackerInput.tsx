'use client'

import React, { useState } from 'react';
import { Tracker } from '@/types/tracker';

interface TrackerInputProps {
    tracker: Tracker;
    date: Date;
    onClose: () => void;
    onSave: (value: string) => void;
}

const TrackerInput: React.FC<TrackerInputProps> = ({ tracker, date, onClose, onSave }) => {
    const [selectedValue, setSelectedValue] = useState('');

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg">
                <h3 className="text-lg font-bold mb-2">
                    {tracker.name} - {date.toLocaleDateString()}
                </h3>
                <div className="space-y-2">
                    {tracker.options.map((option) => (
                        <button
                            key={option.label}
                            className="w-full p-2 rounded"
                            style={{ backgroundColor: option.color }}
                            onClick={() => setSelectedValue(option.label)}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                    <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
                        Cancel
                    </button>
                    <button
                        onClick={() => onSave(selectedValue)}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
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


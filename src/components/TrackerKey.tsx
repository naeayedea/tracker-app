import React from 'react'
import { Tracker } from '@/types/tracker'

interface TrackerKeyProps {
    tracker: Tracker
}

const TrackerKey: React.FC<TrackerKeyProps> = ({ tracker }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Tracker Key</h3>
            <div className="grid grid-cols-2 gap-2">
                {tracker.options.map((option) => (
                    <div key={option.label} className="flex items-center">
                        <div
                            className="w-6 h-6 rounded mr-2"
                            style={{ backgroundColor: option.color }}
                        ></div>
                        <span style={{ color: option.color }}>{option.label}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TrackerKey


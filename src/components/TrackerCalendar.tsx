'use client'

import React, { useState } from 'react';
import { useTracker } from '@/contexts/TrackerContext';
import { Tracker } from '@/types/tracker';
import TrackerInput from '@/components/TrackerInput';
import TrackerKey from '@/components/TrackerKey';

interface TrackerCalendarProps {
    tracker: Tracker;
}

const dayPadLookup: Record<number, number> = {0: 6, 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6:5}
const daysOfTheWeek = ["Mon", "Tue", "Wed","Thu", "Fri", "Sat", "Sun"]

const TrackerCalendar: React.FC<TrackerCalendarProps> = ({ tracker }) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [showKey, setShowKey] = useState(false);
    const [hoveredDate, setHoveredDate] = useState<string | null>(null);
    const { setTrackerValue } = useTracker();
    const year = tracker.currentDate

    const renderCalendar = () => {
        const calendar = [];

        for (let month = 0; month < 12; month++) {
            const date = new Date(year, month + 1, 0)

            const firstDayOfMonth = new Date(year, month, 1).getDay();

            const daysInMonth = date.getDate();
            const monthDays = [];
            const dayIndicator = [];

            //add the day
            for (const dayString of daysOfTheWeek) {
                dayIndicator.push(
                    <div
                        key={`${year}-${month}-day-string-${dayString}`}
                        className="w-12 h-12 lg:w-12 lg:h-16 flex items-center justify-center cursor-pointer relative"
                    >
                        {dayString}
                    </div>
                );
            }

            //pad to the day
            for (let pad = 0; pad < dayPadLookup[firstDayOfMonth]; pad++) {
                monthDays.push(
                    <div key={`${year}-${month}-pad-${pad}`} className={"w-12 h-12 lg:w-16 lg:h-16 flex items-center justify-center cursor-pointer relative"} />
                )
            }

            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(year, month, day);
                const dateString = date.toISOString().split('T')[0];
                const value = tracker.data[tracker.currentDate][dateString];
                const option = tracker.options.find(opt => opt.label === value);
                const backgroundColor = option ? option.color : 'gray';
                const textColor = option ? option.textColor : 'white';

                monthDays.push(
                    <div
                        key={`${year}-${month}-${day}`}
                        className="w-12 h-12 lg:w-16 lg:h-16 flex items-center justify-center cursor-pointer relative"
                        style={{ backgroundColor, color: textColor }}
                        onClick={() => setSelectedDate(date)}
                        onMouseEnter={() => setHoveredDate(dateString)}
                        onMouseLeave={() => setHoveredDate(null)}
                    >
                        {day}
                        {hoveredDate === dateString && value && (
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-black text-white p-1 rounded text-xs whitespace-nowrap">
                                {value}
                            </div>
                        )}
                    </div>
                );
            }

            calendar.push(
                <div key={`${year}-${month}`} className="m-4">
                    <h3 className="font-bold mb-2">{new Date(year, month).toLocaleString('default', {month: 'long'})}</h3>
                    <div className="grid grid-cols-7 gap-x-4 mb-0">{dayIndicator}</div>

                    <div className="grid grid-cols-7 gap-4">{monthDays}</div>
                </div>
            );
        }

        return calendar;
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => setShowKey(!showKey)} className="bg-blue-500 text-white px-4 py-2 rounded">
                    {showKey ? 'Hide Key' : 'Show Key'}
                </button>
            </div>

            <div>
                <h1 className={"text-2xl font-bold flex justify-center"}>{year}</h1>
            </div>

            {showKey && <TrackerKey tracker={tracker} />}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {renderCalendar()}
            </div>
            {selectedDate && (
                <TrackerInput
                    tracker={tracker}
                    date={selectedDate}
                    onClose={() => setSelectedDate(null)}
                    onSave={(value) => {
                        setTrackerValue(tracker.id, year, selectedDate.toISOString().split('T')[0], value);
                        setSelectedDate(null);
                    }}
                />
            )}
        </div>
    );
};

export default TrackerCalendar;


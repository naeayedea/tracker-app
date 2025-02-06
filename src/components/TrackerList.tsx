import React from 'react';
import { useTracker } from '@/contexts/TrackerContext';
import TrackerCalendar from '@/components/TrackerCalendar';
import {HeadingTwo} from "@/components/ui/text";
import {Button} from "@/components/ui/button";

interface TrackerListProps {
    selectedTrackerId: string | null;
}

const TrackerList: React.FC<TrackerListProps> = ({ selectedTrackerId }) => {
    const { trackers, deleteTracker } = useTracker();

    const displayedTrackers = selectedTrackerId
        ? trackers.filter(tracker => tracker.id === selectedTrackerId)
        : trackers;

    return (
        <div className="space-y-4">
            {displayedTrackers.map(tracker => (
                <div key={tracker.id} className="border p-4 rounded-lg">
                    <HeadingTwo>{tracker.name}</HeadingTwo>
                    <Button
                        onClick={() => deleteTracker(tracker.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded mb-2"
                    >
                        Delete Tracker
                    </Button>
                    <TrackerCalendar tracker={tracker} />
                </div>
            ))}
        </div>
    );
};

export default TrackerList;


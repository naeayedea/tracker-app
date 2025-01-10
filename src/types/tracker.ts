export interface TrackerOption {
    label: string;
    color: string;
    textColor: string;
}

export interface Tracker {
    id: string;
    name: string;
    options: TrackerOption[];
    data: Record<number, { [date: string]: string }>;
    currentDate: number,
}

export interface TrackerContextType {
    trackers: Tracker[];
    addTracker: (tracker: Tracker) => void;
    updateTracker: (tracker: Tracker) => void;
    deleteTracker: (id: string) => void;
    setTrackerValue: (trackerId: string, year:number, date: string, value: string) => void;
}


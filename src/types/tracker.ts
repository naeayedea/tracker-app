export interface TrackerOption {
    label: string;
    color: string;
    textColor: string;
    excludeFromSummary: boolean;
}

export interface Tracker {
    id: string;
    name: string;
    category: string;
    options: TrackerOption[];
    data: Record<number, { [date: string]: string }>;
    currentDate: number;
    excludeFromDashboard: boolean;
}

export interface TrackerContextType {
    trackers: Tracker[];
    addTracker: (tracker: Tracker) => void;
    updateTracker: (tracker: Tracker) => void;
    deleteTracker: (id: string) => void;
    setTrackerValue: (trackerId: string, year:number, date: string, value: string) => void;
    unsetTrackerValue: (trackerId: string, year:number, date: string) => void;
    switchYear: (tracker: Tracker, year: number) => void;
    importTrackers: (importedTrackers: Tracker[]) => void;
    getCategories: () => string[];
    updateTrackerOptions: (trackerId: string, updatedOptions: TrackerOption[]) => void;
}


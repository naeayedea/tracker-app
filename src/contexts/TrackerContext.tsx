'use client'

import React, { createContext, useState, useEffect, useContext } from 'react'
import { Tracker, TrackerContextType } from '../types/tracker'

const TrackerContext = createContext<TrackerContextType | undefined>(undefined)

export const TrackerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [trackers, setTrackers] = useState<Tracker[]>([])

    useEffect(() => {
        const storedTrackers = localStorage.getItem('trackers')
        if (storedTrackers) {
            setTrackers(JSON.parse(storedTrackers))
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('trackers', JSON.stringify(trackers))
    }, [trackers])

    const addTracker = (tracker: Tracker) => {
        setTrackers([...trackers, tracker])
    }

    const updateTracker = (updatedTracker: Tracker) => {
        setTrackers(trackers.map(tracker =>
            tracker.id === updatedTracker.id ? updatedTracker : tracker
        ))
    }

    const switchYear = (trackerToSwitch: Tracker, year: number) => {
        setTrackers(trackers.map(tracker => {
            if (tracker.id !== trackerToSwitch.id)
                return tracker

            const switchedTracker: Tracker = {...trackerToSwitch, currentDate: year}

            //ensure that the year exists

            switchedTracker.data[year] = switchedTracker.data[year] !== undefined ? switchedTracker.data[year] : {}

            return switchedTracker
        }))
    }

    const deleteTracker = (id: string) => {
        setTrackers(trackers.filter(tracker => tracker.id !== id))
    }

    const setTrackerValue = (trackerId: string, year: number, date: string, value: string) => {
        setTrackers(trackers.map(tracker => {
            if (tracker.id === trackerId) {
                const dataToUpdate = tracker.data[year]

                const updatedData =  { ...dataToUpdate, [date]: value }

                return { ...tracker, data: { ...tracker.data, [year]: updatedData } }
            }
            return tracker
        }))
    }

    return (
        <TrackerContext.Provider value={{ trackers, addTracker, updateTracker, deleteTracker, setTrackerValue, switchYear }}>
            {children}
        </TrackerContext.Provider>
    )
}

export const useTracker = () => {
    const context = useContext(TrackerContext)
    if (context === undefined) {
        throw new Error('useTracker must be used within a TrackerProvider')
    }
    return context
}


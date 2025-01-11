'use client'

import React, {createContext, useContext} from 'react'
import { Tracker, TrackerContextType } from '../types/tracker'
import {useLocalStorage} from "react-use";

const TrackerContext = createContext<TrackerContextType | undefined>(undefined)

export const TrackerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [trackers, setTrackers] = useLocalStorage<Tracker[]>("trackers", [])

    const addTracker = (tracker: Tracker) => {
        if (trackers === undefined) {
            setTrackers([tracker])
        } else {
            setTrackers([...trackers, tracker])
        }
    }

    const updateTracker = (updatedTracker: Tracker) => {


        if (trackers !== undefined) {
            setTrackers(trackers.map(tracker =>
                tracker.id === updatedTracker.id ? updatedTracker : tracker
            ))
        } else {
            console.warn("No trackers stored, could not update tracker with id {}", updatedTracker.id)
        }
    }

    const switchYear = (trackerToSwitch: Tracker, year: number) => {
        if (trackers !== undefined) {
            setTrackers(trackers.map(tracker => {
                if (tracker.id !== trackerToSwitch.id)
                    return tracker

                const switchedTracker: Tracker = {...trackerToSwitch, currentDate: year}

                //ensure that the year exists

                switchedTracker.data[year] = switchedTracker.data[year] !== undefined ? switchedTracker.data[year] : {}

                return switchedTracker
            }))
        } else {
            console.warn("No trackers stored, could not switch year.")
        }
    }

    const deleteTracker = (id: string) => {
        if (trackers !== undefined) {
            setTrackers(trackers.filter(tracker => tracker.id !== id))
        } else {
            console.warn("No trackers stored, could not delete tracker with id {}", id)
        }
    }

    const setTrackerValue = (trackerId: string, year: number, date: string, value: string) => {
        if (trackers !== undefined) {
            setTrackers(trackers.map(tracker => {
                if (tracker.id === trackerId) {
                    const dataToUpdate = tracker.data[year]

                    const updatedData =  { ...dataToUpdate, [date]: value }

                    return { ...tracker, data: { ...tracker.data, [year]: updatedData } }
                }
                return tracker
            }))
        } else {
            console.warn("No trackers stored, could not set value for tracker with id {}", trackerId)
        }
    }

    return (
        <TrackerContext.Provider value={{
            trackers: trackers !== undefined ? trackers : [],
            addTracker,
            updateTracker,
            deleteTracker,
            setTrackerValue,
            switchYear
        }}>
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


'use client'

import React, {createContext, useContext} from 'react'
import {Tracker, TrackerContextType, TrackerOption} from '@/types/tracker'
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

    const importTrackers = (importedTrackers: Tracker[]) => {
        setTrackers(prevTrackers => {
            let mergedTrackers: Tracker[];

            if (prevTrackers !== undefined) {
                mergedTrackers = [...prevTrackers]
            } else {
                mergedTrackers = []
            }

            importedTrackers.forEach(importedTracker => {
                const existingTrackerIndex = mergedTrackers.findIndex(t => t.id === importedTracker.id)
                if (existingTrackerIndex !== -1) {
                    // Merge data for existing tracker
                    const existingTracker = mergedTrackers[existingTrackerIndex]
                    const mergedData = { ...existingTracker.data }
                    Object.keys(importedTracker.data).map((year: string) => parseInt(year)).forEach((year: number) => {
                        mergedData[year] = {
                            ...(mergedData[year] || {}),
                            ...importedTracker.data[year]
                        }
                    })
                    mergedTrackers[existingTrackerIndex] = {
                        ...existingTracker,
                        options: [...new Set([...existingTracker.options, ...importedTracker.options])],
                        data: mergedData
                    }
                } else {
                    // Add new tracker
                    mergedTrackers.push(importedTracker)
                }
            })
            return mergedTrackers
        })
    }

    const getCategories = () => {
        if (trackers === undefined) {
            return []
        }

        return [...new Set(trackers.map(tracker => tracker.category))].filter(Boolean)
    }

    const updateTrackerOptions = (trackerId: string, updatedOptions: TrackerOption[]) => {
        if (trackers !== undefined) {
            setTrackers(trackers.map(tracker => {
                if (tracker.id === trackerId) {
                    return { ...tracker, options: updatedOptions }
                }
                return tracker
            }))
        } else {
            console.warn("No trackers stored, could not update options for tracker with id {}", trackerId)
        }
    }

    return (
        <TrackerContext.Provider value={{
            trackers: trackers !== undefined ? trackers : [],
            addTracker,
            updateTracker,
            deleteTracker,
            setTrackerValue,
            switchYear,
            importTrackers,
            getCategories,
            updateTrackerOptions
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


import React, {createContext, useContext} from 'react'
import {Tracker, TrackerContextType, TrackerOption} from '@/types/tracker'
import useLocalStorage from "@/hooks/useLocalStorage"

const TrackerContext = createContext<TrackerContextType | undefined>(undefined)

export const TrackerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [trackers, setTrackers] = useLocalStorage<Tracker[]>("trackers", [])

    const addTracker = (tracker: Tracker) => {
        const localTracker: Tracker = JSON.parse(JSON.stringify(tracker))

        if (trackers === undefined) {
            setTrackers([localTracker])
        } else {
            setTrackers([...trackers, localTracker])
        }
    }

    const updateTracker = (updatedTracker: Tracker) => {
        const localTracker: Tracker = JSON.parse(JSON.stringify(updatedTracker))

        if (trackers !== undefined) {
            setTrackers((currentTrackers) => {
                if (currentTrackers === undefined)
                    return currentTrackers;

                const newTrackers: Tracker[] = JSON.parse(JSON.stringify((currentTrackers.map(tracker => {
                    if (tracker.id === updatedTracker.id) {
                        return {
                            ...updatedTracker
                        }
                    }
                    return {...tracker}
                }))))

                return [...newTrackers]
            })
        } else {
            console.warn("No trackers stored, could not update tracker with id {}", localTracker.id)
        }
    }

    const switchYear = (trackerToSwitch: Tracker, year: number) => {
        if (trackers !== undefined) {
            setTrackers((currentTrackers) => {
                return currentTrackers.map(tracker => {
                    if (tracker.id !== trackerToSwitch.id)
                        return tracker

                    const switchedTracker: Tracker = {...trackerToSwitch, currentDate: year}

                    //ensure that the year exists

                    switchedTracker.data[year] = switchedTracker.data[year] !== undefined ? switchedTracker.data[year] : {}

                    return switchedTracker
                });
            })
        } else {
            console.warn("No trackers stored, could not switch year.")
        }
    }

    const deleteTracker = (id: string) => {
        if (trackers !== undefined) {
            setTrackers((currentTrackers) => currentTrackers.filter(tracker => tracker.id !== id))
        } else {
            console.warn("No trackers stored, could not delete tracker with id {}", id)
        }
    }

    const unsetTrackerValue = (trackerId: string, year: number, date:string)  => {
        if (trackers !== undefined) {
            setTrackers((currentTrackers) => currentTrackers.map(tracker => {
                if (tracker.id === trackerId) {
                    const dataToUpdate = tracker.data[year]

                    const updatedData =  { ...dataToUpdate }

                    delete updatedData[date]

                    return { ...tracker, data: { ...tracker.data, [year]: updatedData } }
                }
                return tracker
            }))
        } else {
            console.warn("No trackers stored, could not set value for tracker with id {}", trackerId)
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
        setTrackers(() => {
            let mergedTrackers: Tracker[];

            if (trackers !== undefined) {
                mergedTrackers = [...trackers]
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
                        options: [...new Set([...existingTracker.options, ...importedTracker.options.filter(option => existingTracker.options.findIndex(o => o.label === option.label) === -1)])],
                        data: mergedData,
                        category: existingTracker.category || importedTracker.category,
                        excludeFromDashboard: existingTracker.excludeFromDashboard || false
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
            setTrackers(currentTrackers => currentTrackers.map(tracker => {
                if (tracker.id === trackerId) {
                    const removedOptions = tracker.options.filter(
                        option => !updatedOptions.some(updatedOption => updatedOption.label === option.label)
                    )
                    const updatedData = { ...tracker.data }

                    // Unset dates for removed options
                    Object.keys(updatedData).forEach(year => {
                        const yearNumber = parseInt(year)
                        updatedData[yearNumber] = Object.fromEntries(
                            Object.entries(updatedData[yearNumber]).filter(([, value]) =>
                                !removedOptions.some(option => option.label === value)
                            )
                        )
                    })

                    return {
                        ...tracker,
                        options: updatedOptions,
                        data: updatedData
                    }
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
            unsetTrackerValue,
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


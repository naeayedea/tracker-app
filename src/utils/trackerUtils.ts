import {Tracker} from "@/types/tracker";

export function flattenTrackerData(tracker: Tracker): Record<string, string> {
    const flattenedData: Record<string, string> = {}

    Object.keys(tracker.data).forEach(year => {
        const yearData: {[date: string]: string} = tracker.data[parseInt(year)]

        Object.keys(yearData).forEach((date) => {
            flattenedData[date] = yearData[date]
        })
    })

    return flattenedData
}
'use client'

import React, { useState } from 'react'
import { Tracker } from '@/types/tracker'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TimePeriod, filterDataByTimePeriod, getTimePeriodLabel } from '@/utils/dateUtils'
import {flattenTrackerData} from "@/utils/trackerUtils";

interface TrackerStatisticsProps {
    tracker: Tracker
}

const TrackerStatistics: React.FC<TrackerStatisticsProps> = ({ tracker }) => {
    const [timePeriod, setTimePeriod] = useState<TimePeriod>('month')

    const flattenedData = flattenTrackerData(tracker)

    const filteredData = filterDataByTimePeriod(flattenedData, timePeriod)

    const includedOptions = tracker.options.filter(option => !option.excludeFromSummary)

    const optionCounts = includedOptions.reduce((acc, option) => {
        acc[option.label] = 0
        return acc
    }, {} as Record<string, number>)

    Object.values(filteredData).forEach(value => {
        if (value in optionCounts) {
            optionCounts[value]++
        }
    })

    const chartData = Object.entries(optionCounts).map(([label, count]) => ({
        label,
        count,
        color: tracker.options.find(option => option.label === label)?.color || '#000000'
    }))

    const totalEntries = Object.values(optionCounts).reduce((sum, count) => sum + count, 0)
    const mostCommonEntry = Object.entries(optionCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0]

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Statistics for {tracker.name}</h2>
                <Select value={timePeriod} onValueChange={(value: TimePeriod) => setTimePeriod(value)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select time period" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="year">This Year</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                        <SelectItem value="week">7 Days</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Distribution of Entries</CardTitle>
                    <CardDescription>{getTimePeriodLabel(timePeriod)}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="label" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" name="Entries">
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Entries</CardTitle>
                        <CardDescription>{getTimePeriodLabel(timePeriod)}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">{totalEntries}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Most Common Entry</CardTitle>
                        <CardDescription>{getTimePeriodLabel(timePeriod)}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">{mostCommonEntry}</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default TrackerStatistics


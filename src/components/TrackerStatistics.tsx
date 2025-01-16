'use client'

import React from 'react'
import { Tracker } from '@/types/tracker'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'

interface TrackerStatisticsProps {
    tracker: Tracker
}

const TrackerStatistics: React.FC<TrackerStatisticsProps> = ({ tracker }) => {
    const currentYear = new Date().getFullYear()
    const yearData = tracker.data[currentYear] || {}

    const includedOptions = tracker.options.filter(option => !option.excludeFromSummary)

    const optionCounts = includedOptions.reduce((acc, option) => {
        acc[option.label] = 0
        return acc
    }, {} as Record<string, number>)

    Object.values(yearData).forEach(value => {
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
            <Card>
                <CardHeader>
                    <CardTitle>Year Overview</CardTitle>
                    <CardDescription>Distribution of tracker entries for {currentYear}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="label" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
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
                        <CardDescription>Number of days tracked this year</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">{totalEntries}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Most Common Entry</CardTitle>
                        <CardDescription>Most frequently used option</CardDescription>
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


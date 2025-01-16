'use client'

import React, {useEffect, useMemo, useState} from 'react'
import {useTracker} from '@/contexts/TrackerContext'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts'
import {Tracker} from "@/types/tracker";
import PageTemplate from "@/components/PageTemplate";

export default function DashboardPage() {
    const [isClient, setIsClient] = useState(false);
    const {trackers} = useTracker()
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentWeek = getWeekNumber(currentDate)

    const includedTrackers = useMemo(() => trackers.filter(tracker => !tracker.excludeFromDashboard), [trackers])

    useEffect(() => {
        setIsClient(true)
    }, []);

    const getWeekData = (tracker: Tracker) => {
        const weekStart = getWeekStart(currentDate)
        const weekDates = Array.from({length: 7}, (_, i) => {
            const date = new Date(weekStart)
            date.setDate(weekStart.getDate() + i)
            return date.toISOString().split('T')[0]
        })

        return weekDates.map(date => ({
            date,
            value: tracker.data[currentYear]?.[date] || null
        }))
    }

    const trackerOverviews = includedTrackers.map(tracker => {
        const weekData = getWeekData(tracker)
        const filledDays = weekData.filter(day => day.value !== null).length

        return {
            id: tracker.id,
            name: tracker.name,
            weekData,
            filledPercentage: (filledDays / 7) * 100
        }
    })

    const overallCompletionData = [
        {
            name: 'Filled',
            value: trackerOverviews.reduce((sum, tracker) => sum + tracker.filledPercentage, 0) / includedTrackers.length
        },
        {
            name: 'Empty',
            value: 100 - (trackerOverviews.reduce((sum, tracker) => sum + tracker.filledPercentage, 0) / includedTrackers.length)
        }
    ]

    const completionRatesData = trackerOverviews.map(tracker => ({
        name: tracker.name,
        value: tracker.filledPercentage
    }))

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

    return (
        <PageTemplate>
            {isClient && <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Overall Completion</CardTitle>
                            <CardDescription>Average completion rate for all trackers this week</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={overallCompletionData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {overallCompletionData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                                            ))}
                                        </Pie>
                                        <Tooltip/>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Tracker Completion Rates</CardTitle>
                            <CardDescription>Percentage of days filled for each tracker this week</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={completionRatesData}>
                                        <CartesianGrid strokeDasharray="3 3"/>
                                        <XAxis dataKey="name"/>
                                        <YAxis/>
                                        <Tooltip/>
                                        <Legend/>
                                        <Bar dataKey="value" name="Completion %" fill="#8884d8"/>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <h2 className="text-2xl font-semibold mt-8 mb-4">This Week&#39;s Entries</h2>
                <div className="space-y-6">
                    {trackerOverviews.map(tracker => (
                        <Card key={tracker.id}>
                            <CardHeader>
                                <CardTitle>{tracker.name}</CardTitle>
                                <CardDescription>Week {currentWeek}, {currentYear}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-7 gap-2">
                                    {tracker.weekData.map((day, index) => (
                                        <div key={index} className="text-center">
                                            <div
                                                className="text-sm font-medium">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index]}</div>
                                            <div className="mt-1 p-2 bg-gray-100 rounded">
                                                {day.value || '-'}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </>}
        </PageTemplate>
    )
}

function getWeekNumber(date: Date): number {
    const onejan = new Date(date.getFullYear(), 0, 1);
    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dayOfYear = ((today.getDate() - onejan.getDate() + 86400000) / 86400000);

    return Math.ceil(dayOfYear / 7)
}

function getWeekStart(date: Date): Date {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    return new Date(d.setDate(diff))
}


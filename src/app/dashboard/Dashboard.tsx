import React, {useState} from 'react'
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
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {filterDataByTimePeriod, getTimePeriodLabel, TimePeriod} from '@/utils/dateUtils'
import PageTemplate from "@/components/PageTemplate";
import {Tracker, TrackerOption} from "@/types/tracker";
import {flattenTrackerData} from "@/utils/trackerUtils";

export default function DashboardPage() {
    const { trackers } = useTracker()
    const [timePeriod, setTimePeriod] = useState<TimePeriod>('week')

    const includedTrackers = trackers.filter(tracker => !tracker.excludeFromDashboard)

    const getFilteredData = (tracker: Tracker) => {
        const flattenedData: Record<string, string> = flattenTrackerData(tracker)

        return filterDataByTimePeriod(flattenedData, timePeriod)
    }

    const trackerOverviews = includedTrackers.map(tracker => {
        const filteredData = getFilteredData(tracker)
        const totalEntries = Object.keys(filteredData).length
        const possibleEntries = timePeriod === 'today' ? 1 :
            timePeriod === 'week' ? 7 :
                timePeriod === 'month' ? 28 :
                    timePeriod === 'year' ? 365:
                        calculateAllTimePossibleEntries(tracker)

        const includedLabels: string[] = Object.values(filteredData).filter(option => {
            const foundOption: TrackerOption | undefined = tracker.options.find(o => o.label === option)

            return foundOption !== undefined && !foundOption.excludeFromSummary
        })

        return {
            id: tracker.id,
            name: tracker.name,
            data: filteredData,
            completionRate: (totalEntries / possibleEntries) * 100,
            mostCommonEntry: includedLabels.sort((a,b) => includedLabels.filter(v => v===a).length - includedLabels.filter(v => v===b).length).pop()
        }
    })

    const overallCompletionRate = trackerOverviews.reduce((sum, tracker) => sum + tracker.completionRate, 0) / includedTrackers.length

    const completionRatesData = trackerOverviews.map(tracker => ({
        name: tracker.name,
        value: tracker.completionRate
    }))

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

    return (
        <PageTemplate>
            <div className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <Select value={timePeriod} onValueChange={(value: TimePeriod) => setTimePeriod(value)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select time period" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Time</SelectItem>
                            <SelectItem value="year">Last 365 Days</SelectItem>
                            <SelectItem value="month">Last 28 Days</SelectItem>
                            <SelectItem value="week">Last 7 Days</SelectItem>
                            <SelectItem value="today">Today</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Overall Completion Rate</CardTitle>
                            <CardDescription>{getTimePeriodLabel(timePeriod)}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={[
                                                { name: 'Completed', value: overallCompletionRate },
                                                { name: 'Incomplete', value: 100 - overallCompletionRate }
                                            ]}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {[0, 1].map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Tracker Completion Rates</CardTitle>
                            <CardDescription>{getTimePeriodLabel(timePeriod)}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={completionRatesData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="value" name="Completion %" fill="#8884d8" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <h2 className="text-2xl font-semibold mt-8 mb-4">Tracker Summaries</h2>
                <div className="space-y-6">
                    {trackerOverviews.map(tracker => (
                        <Card key={tracker.id}>
                            <CardHeader>
                                <CardTitle>{tracker.name}</CardTitle>
                                <CardDescription>{getTimePeriodLabel(timePeriod)}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">Completion Rate</h3>
                                        <p className="text-3xl font-bold">{tracker.completionRate.toFixed(1)}%</p>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">Most Common Entry</h3>
                                        <p className="text-3xl font-bold">
                                            {tracker.mostCommonEntry}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </PageTemplate>
    )
}

const calculateAllTimePossibleEntries = (tracker: Tracker): number => {
    const availableYears = Object.keys(tracker.data).filter(year => Object.keys(tracker.data[parseInt(year)]).length > 0)
    const earliestYear = availableYears.reduce((val, next) => val < next ? val : next)
    const earliestYearData = tracker.data[parseInt(earliestYear)]
    const earliestEntryInEarliestYear = Object.keys(earliestYearData).reduce((val, next) => val < next ? val : next)

    return Math.ceil(Math.abs(new Date().getTime() - new Date(earliestEntryInEarliestYear).getTime()) / (1000 * 60 * 60 * 24));
}

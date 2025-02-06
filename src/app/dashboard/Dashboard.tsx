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
import {Text} from "@/components/ui/text";

interface TrackerOverview {
    id: string;
    name: string;
    data: Record<string, string>;
    completionRate: number;
    mostCommonEntry: string | undefined;
}

export default function DashboardPage() {
    const {trackers} = useTracker()
    const [timePeriod, setTimePeriod] = useState<TimePeriod>('week')


    const includedTrackers = trackers.filter(tracker => !tracker.excludeFromDashboard)

    const getFilteredData = (tracker: Tracker) => {
        const flattenedData: Record<string, string> = flattenTrackerData(tracker)

        return filterDataByTimePeriod(flattenedData, timePeriod)
    }

    const trackerOverviews: TrackerOverview[] = includedTrackers.map(tracker => {
        const filteredData = getFilteredData(tracker)
        const totalEntries = Object.keys(filteredData).length
        const possibleEntries = timePeriod === 'today' ? 1 :
            timePeriod === 'week' ? 7 :
                timePeriod === 'month' ? 28 :
                    timePeriod === 'year' ? 365 :
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
            mostCommonEntry: includedLabels.sort((a, b) => includedLabels.filter(v => v === a).length - includedLabels.filter(v => v === b).length).pop()
        }
    })

    const overallCompletionRate = trackerOverviews.reduce((sum, tracker) => sum + tracker.completionRate, 0) / includedTrackers.length

    const completionRatesData = trackerOverviews.map(tracker => ({
        name: tracker.name,
        value: tracker.completionRate
    }))

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#d884b4', '#84d8c2']

    if (trackers.length <= 0) {
        return (
            <PageTemplate>
                <div className="bg-white shadow-lg rounded-xl p-8 mb-8 min-h-full w-full xl:w-5/6 xl:mx-auto ">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800">Dashboard</h2>
                    <Text>Once you start tracking some metrics, your dashboard will appear here!</Text>
                </div>
            </PageTemplate>
        )
    }

    return (
        <PageTemplate>
            <div className="bg-white shadow-lg rounded-xl p-8 mb-8 min-h-full w-full xl:w-5/6 xl:mx-auto ">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">Dashboard</h2>
                <GraphView colorPalette={COLORS} trackerOverviews={trackerOverviews} timePeriod={timePeriod}
                           overallCompletionRate={overallCompletionRate} completionRatesData={completionRatesData}
                           setTimePeriod={setTimePeriod}/>
            </div>
        </PageTemplate>
    )
}

const GraphView = ({
                       colorPalette,
                       timePeriod,
                       setTimePeriod,
                       overallCompletionRate,
                       completionRatesData,
                       trackerOverviews
                   }: {
    colorPalette: string[],
    trackerOverviews: TrackerOverview[],
    timePeriod: TimePeriod,
    overallCompletionRate: number,
    completionRatesData: { name: string, value: number }[],
    setTimePeriod: React.Dispatch<React.SetStateAction<TimePeriod>>
}) => {
    return (<>
        <div className="mb-6">
            <Select value={timePeriod} onValueChange={(value: TimePeriod) => setTimePeriod(value)}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select time period"/>
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
                                        {name: 'Completed', value: overallCompletionRate},
                                        {name: 'Incomplete', value: 100 - overallCompletionRate}
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {[0, 1].map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={colorPalette[index % colorPalette.length]}/>
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
                    <CardDescription>{getTimePeriodLabel(timePeriod)}</CardDescription>
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
    </>)
}

const calculateAllTimePossibleEntries = (tracker: Tracker): number => {
    const availableYears = Object.keys(tracker.data).filter(year => Object.keys(tracker.data[parseInt(year)]).length > 0)

    if (!availableYears) {
        return 1;
    }

    const earliestYear = availableYears.reduce((val, next) => val < next ? val : next)

    const earliestYearData = tracker.data[parseInt(earliestYear)]

    const potentialDates = Object.keys(earliestYearData);

    if (!potentialDates) {
        return 1;
    }

    const earliestEntryInEarliestYear = potentialDates.reduce((val, next) => val < next ? val : next)

    return Math.ceil(Math.abs(new Date().getTime() - new Date(earliestEntryInEarliestYear).getTime()) / (1000 * 60 * 60 * 24));
}

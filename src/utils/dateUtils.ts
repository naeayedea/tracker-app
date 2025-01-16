export type TimePeriod = 'all' | 'year' | 'month' | 'week' | 'today';

export function filterDataByTimePeriod(data: Record<string, string>, timePeriod: TimePeriod): Record<string, string> {
    const today = new Date();
    const filteredData: Record<string, string> = {};

    Object.entries(data).forEach(([date, value]) => {
        const entryDate = new Date(date);
        let include = false;

        switch (timePeriod) {
            case 'all':
                include = true;
                break;
            case 'year':
                include = entryDate.getFullYear() === today.getFullYear();
                break;
            case 'month':
                include = entryDate.getFullYear() === today.getFullYear() &&
                    entryDate.getMonth() === today.getMonth();
                break;
            case 'week':
                const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                include = entryDate >= weekAgo && entryDate <= today
                break;
            case 'today':
                include = entryDate.toDateString() === today.toDateString();
                break;
        }

        if (include) {
            filteredData[date] = value;
        }
    });

    return filteredData;
}

export function getTimePeriodLabel(timePeriod: TimePeriod): string {
    switch (timePeriod) {
        case 'all':
            return 'All Time';
        case 'year':
            return 'This Year';
        case 'month':
            return 'This Month';
        case 'week':
            return 'Previous 7 days';
        case 'today':
            return 'Today';
    }
}


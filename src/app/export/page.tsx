'use client'

import React, { useState } from 'react'
import { useTracker } from '@/contexts/TrackerContext'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'

export default function ExportPage() {
    const { trackers } = useTracker()
    const [exportFormat, setExportFormat] = useState<'json' | 'zip'>('json')

    const handleExport = async () => {
        if (exportFormat === 'json') {
            const jsonData = JSON.stringify(trackers, null, 2)
            const blob = new Blob([jsonData], { type: 'application/json' })
            saveAs(blob, 'tracker_data.json')
        } else if (exportFormat === 'zip') {
            const zip = new JSZip()
            trackers.forEach(tracker => {
                const trackerData = JSON.stringify(tracker, null, 2)
                zip.file(`${tracker.name}.json`, trackerData)
            })
            const content = await zip.generateAsync({ type: 'blob' })
            saveAs(content, 'tracker_data.zip')
        }
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Export Data</h1>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Export Format</label>
                <select
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value as 'json' | 'zip')}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    <option value="json">JSON</option>
                    <option value="zip">ZIP</option>
                </select>
            </div>
            <button
                onClick={handleExport}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
                Export Data
            </button>
        </div>
    )
}


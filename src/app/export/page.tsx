'use client'

import React, { useState } from 'react'
import { useTracker } from '@/contexts/TrackerContext'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import PageTemplate from "@/components/PageTemplate";

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
        <PageTemplate>
            <div className={"flex content-center justify-center w-full"}>
                <div className="bg-white shadow-lg rounded-xl p-8 w-full">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800">Export Your Tracker Data</h2>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
                        <select
                            value={exportFormat}
                            onChange={(e) => setExportFormat(e.target.value as 'json' | 'zip')}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="json">JSON</option>
                            <option value="zip">ZIP</option>
                        </select>
                    </div>
                    <button
                        onClick={handleExport}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:shadow-outline text-lg"
                    >
                        Export Data
                    </button>
                </div>
            </div>
        </PageTemplate>
    )
}


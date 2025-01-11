'use client'

import React, { useState } from 'react'
import { useTracker } from '@/contexts/TrackerContext'
import { Tracker } from '@/types/tracker'

const ImportData: React.FC = () => {
    const { importTrackers } = useTracker()
    const [file, setFile] = useState<File | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0])
            setError(null)
        }
    }

    const handleImport = async () => {
        if (!file) {
            setError('Please select a file to import.')
            return
        }

        try {
            const content = await file.text()
            const importedData = JSON.parse(content) as Tracker[]
            importTrackers(importedData)
            setFile(null)
            setError(null)
            alert('Data imported successfully!')
        } catch (err) {
            setError('Error importing data. Please make sure the file is valid JSON.')
            console.error(err)
        }
    }

    return (
        <div className="bg-white shadow-lg rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Import Data</h2>
            <div className="mb-4">
                <input
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                />
            </div>
            <button
                onClick={handleImport}
                disabled={!file}
                className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
                Import Data
            </button>
            {error && <p className="mt-4 text-red-500">{error}</p>}
        </div>
    )
}

export default ImportData


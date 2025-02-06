import React, {useState} from 'react'
import { useTracker } from '@/contexts/TrackerContext'
import { Tracker } from '@/types/tracker'
import ConfirmImportDialog from './ConfirmImportDialog'
import {HeadingTwo} from "@/components/ui/text";
import {Button} from "@/components/ui/button";
import {FileInput} from "@/components/ui/input";

const ImportData: React.FC = () => {
    const { importTrackers } = useTracker()
    const [file, setFile] = useState<File | null>(null)
    const [importData, setImportData] = useState<Tracker[] | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0])
            setError(null)
            setImportData(null)
        }
    }

    const handleImport = async () => {
        if (!file) {
            setError('Please select a file to import.')
            return
        }

        try {
            const content = await file.text()
            const parsedData: Tracker[] = JSON.parse(content)
            setImportData(parsedData)
            setIsConfirmDialogOpen(true)
        } catch (err) {
            setError('Error parsing data. Please make sure the file is valid JSON.')
            console.error(err)
        }
    }

    const confirmImport = () => {
        if (importData) {
            importTrackers(importData)
            setFile(null)
            setImportData(null)
            setError(null)
            setIsConfirmDialogOpen(false)
            alert('Data imported successfully!')
        }
    }

    return (
        <div className="bg-white shadow-lg rounded-xl p-8 mb-8 min-h-full w-full xl:w-5/6 xl:mx-auto ">
            <HeadingTwo className="font-semibold mb-6">Import Data</HeadingTwo>
            <div className="mb-4">
                <FileInput
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                    className={"block w-full text-sm"}
                    buttonClassName={"px-7"}
                />
            </div>
            <Button
                onClick={handleImport}
                disabled={!file}
                className=""
            >
                Preview Import
            </Button>
            {error && <p className="mt-4 text-red-500">{error}</p>}

            <ConfirmImportDialog
                isOpen={isConfirmDialogOpen}
                onClose={() => setIsConfirmDialogOpen(false)}
                onConfirm={confirmImport}
                importData={importData}
            />
        </div>
    )
}

export default ImportData


'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTracker } from '@/contexts/TrackerContext'
import TrackerCalendar from '@/components/TrackerCalendar'
import ConfirmDialog from '@/components/ConfirmDialog'
import { useParams } from 'next/navigation'

export default function TrackerPage() {
    const { trackers, deleteTracker } = useTracker()
    const router = useRouter()
    const params = useParams()
    const trackerId = params.id as string

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    const tracker = trackers.find(t => t.id === trackerId)

    if (!tracker) {
        return <div>Tracker not found</div>
    }

    const handleDeleteClick = () => {
        setIsDeleteDialogOpen(true)
    }

    const handleDeleteConfirm = () => {
        deleteTracker(tracker.id)
        setIsDeleteDialogOpen(false)
        router.push('/')
    }

    const handleDeleteCancel = () => {
        setIsDeleteDialogOpen(false)
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">{tracker.name}</h1>
            <button
                onClick={handleDeleteClick}
                className="bg-red-500 text-white px-4 py-2 rounded mb-4"
            >
                Delete Tracker
            </button>
            <TrackerCalendar tracker={tracker} />

            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                title="Delete Tracker"
                message={`Are you sure you want to delete the tracker "${tracker.name}"? This action cannot be undone.`}
            />
        </div>
    )
}


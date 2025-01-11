'use client'

import React, {useEffect, useState} from 'react'
import { useRouter } from 'next/navigation'
import { useTracker } from '@/contexts/TrackerContext'
import TrackerCalendar from '@/components/TrackerCalendar'
import ConfirmDialog from '@/components/ConfirmDialog'
import { useParams } from 'next/navigation'
import PageTemplate from "@/components/PageTemplate";

export default function TrackerPage() {
    const [isClient, setIsClient] = useState(false);
    const { trackers, deleteTracker } = useTracker()
    const router = useRouter()
    const params = useParams()
    const trackerId = params.id as string

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    const tracker = trackers.find(t => t.id === trackerId)

    useEffect(() => {
        setIsClient(true)
    }, []);

    if (!isClient) {
        return (
            <PageTemplate>
                <div className="container mx-auto px-4 py-8">
                    <div>Loading...</div>
                </div>
            </PageTemplate>
    )
    }

    if (!tracker) {
        return (
            <PageTemplate>
                <div className="container mx-auto px-4 py-8">
                    <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
                        <div>Tracker Not Found</div>
                    </div>
                </div>
            </PageTemplate>
        )
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
        <PageTemplate>
            <div className="container mx-auto px-4 pb-8">
                <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800">{tracker.name}</h2>
                    <button
                        onClick={handleDeleteClick}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors mb-4"
                    >
                        Delete Tracker
                    </button>
                    <TrackerCalendar tracker={tracker}/>
                </div>

                <ConfirmDialog
                    isOpen={isDeleteDialogOpen}
                    onClose={handleDeleteCancel}
                    onConfirm={handleDeleteConfirm}
                    title="Delete Tracker"
                    message={`Are you sure you want to delete the tracker "${tracker.name}"? This action cannot be undone.`}
                />
            </div>
        </PageTemplate>
    )
}


'use client'

import React, {useEffect, useState} from 'react'
import { useRouter } from 'next/navigation'
import { useTracker } from '@/contexts/TrackerContext'
import TrackerCalendar from '@/components/TrackerCalendar'
import ConfirmDialog from '@/components/ConfirmDialog'
import { useParams } from 'next/navigation'
import PageTemplate from "@/components/PageTemplate";
import {Button} from "@/components/ui/button";
import EditTracker from "@/components/EditTracker";

export default function TrackerPage() {
    const [isClient, setIsClient] = useState(false);
    const { trackers, deleteTracker } = useTracker()
    const router = useRouter()
    const params = useParams()
    const trackerId = params.id as string

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

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

    const handleEditClick = () => {
        setIsEditDialogOpen(true)
    }

    return (
        <PageTemplate>
            <div className="container mx-auto px-4 pb-8">
                <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800">{tracker.name}</h2>
                        <div className="space-x-2">
                            <Button onClick={handleEditClick} variant="outline">Edit Tracker</Button>
                            <Button onClick={handleDeleteClick} variant="destructive">Delete Tracker</Button>
                        </div>
                    </div>
                    <TrackerCalendar tracker={tracker}/>
                </div>

                <ConfirmDialog
                    isOpen={isDeleteDialogOpen}
                    onClose={handleDeleteCancel}
                    onConfirm={handleDeleteConfirm}
                    title="Delete Tracker"
                    message={`Are you sure you want to delete the tracker "${tracker.name}"? This action cannot be undone.`}
                />

                <EditTracker
                    tracker={tracker}
                    isOpen={isEditDialogOpen}
                    onClose={() => setIsEditDialogOpen(false)}
                />
            </div>
        </PageTemplate>
    )
}


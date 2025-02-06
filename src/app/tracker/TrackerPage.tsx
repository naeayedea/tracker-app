import React, {useEffect, useState} from 'react'
import { useTracker } from '@/contexts/TrackerContext'
import TrackerCalendar from '@/components/TrackerCalendar'
import TrackerStatistics from '@/components/TrackerStatistics'
import ConfirmDialog from '@/components/ConfirmDialog'
import PageTemplate from "@/components/PageTemplate";
import {Button} from "@/components/ui/button";
import EditTracker from "@/components/EditTracker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {useNavigate, useParams} from "react-router-dom";

export default function TrackerPage() {
    const [isClient, setIsClient] = useState(false);
    const { trackers, deleteTracker } = useTracker()
    const navigate = useNavigate()
    const { trackerId } = useParams()

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
        navigate("/")
    }

    const handleDeleteCancel = () => {
        setIsDeleteDialogOpen(false)
    }

    const handleEditClick = () => {
        setIsEditDialogOpen(true)
    }

    return (
        <PageTemplate>
            <div className="mx-auto w-[1920px] max-w-full min-h-full">
                <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                        <h2 className="text-2xl font-semibold text-gray-800">{tracker.name}</h2>
                        <div className="space-x-2 py-6 px-1">
                            <Button onClick={handleEditClick} variant="quiet" size={"sm"}>Edit Tracker</Button>
                            <Button onClick={handleDeleteClick} variant="destructive" size={"sm"}>Delete Tracker</Button>
                        </div>
                    </div>
                    <Tabs defaultValue="calendar" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="calendar">Calendar</TabsTrigger>
                            <TabsTrigger value="statistics">Statistics</TabsTrigger>
                        </TabsList>
                        <TabsContent value="calendar">
                            <TrackerCalendar tracker={tracker} />
                        </TabsContent>
                        <TabsContent value="statistics">
                            <TrackerStatistics tracker={tracker} />
                        </TabsContent>
                    </Tabs>
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


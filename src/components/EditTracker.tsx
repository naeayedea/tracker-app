'use client'

import React, {useState, useEffect} from 'react'
import { useTracker } from '@/contexts/TrackerContext'
import { Tracker } from '@/types/tracker'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import CategoryInput from "@/components/CategoryInput";

interface EditTrackerProps {
    tracker: Tracker
    isOpen: boolean
    onClose: () => void
}

const EditTracker: React.FC<EditTrackerProps> = ({ tracker, isOpen, onClose }) => {
    const { updateTracker, getCategories } = useTracker()
    const [name, setName] = useState(tracker.name)
    const [category, setCategory] = useState(tracker.category)
    const [categories, setCategories] = useState<string[]>([])

    useEffect(() => {
        setCategories(getCategories())
    }, [getCategories])

    const handleSave = () => {
        const updatedTracker: Tracker = {
            ...tracker,
            name,
            category
        }
        updateTracker(updatedTracker)

        onClose()
    }

    const handleCancel = () => {
        setCategory(tracker.category)
        setName(tracker.name)
        setCategories(getCategories)

        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Tracker</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="edit-tracker-name">Tracker Name</Label>
                        <Input
                            id="edit-tracker-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <CategoryInput category={category} setCategory={setCategory} categories={categories} setCategories={setCategories}/>
                </div>
                <DialogFooter>
                    <Button onClick={handleCancel} variant="outline">Cancel</Button>
                    <Button onClick={handleSave}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EditTracker


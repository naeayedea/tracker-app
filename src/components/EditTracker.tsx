'use client'

import React, {useState, useEffect} from 'react'
import { useTracker } from '@/contexts/TrackerContext'
import {Tracker, TrackerOption} from '@/types/tracker'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import CategoryInput from "@/components/CategoryInput";
import {getContrastColor, hashStringToColor, isColorValid} from "@/utils/colorUtils";
import {Plus, X} from "lucide-react";
import ConfirmEditDialog from "@/components/ConfirmEditDialog";
import {Switch} from "@/components/ui/switch";

interface EditTrackerProps {
    tracker: Tracker
    isOpen: boolean
    onClose: () => void
}

interface TrackerChanges {
    name?: string
    category?: string
    addedOptions: TrackerOption[]
    removedOptions: TrackerOption[]
    changedOptions: { old: TrackerOption; new: TrackerOption }[]
}

interface ExtendedTrackerOption extends TrackerOption {
    isDeleted: boolean
}

const EditTracker: React.FC<EditTrackerProps> = ({ tracker, isOpen, onClose }) => {
    const { updateTracker, getCategories, updateTrackerOptions } = useTracker()
    const [name, setName] = useState(tracker.name)
    const [category, setCategory] = useState(tracker.category)
    const [options, setOptions] = useState<ExtendedTrackerOption[]>(tracker.options.map(option => ({ ...option, isDeleted: false })))
    const [categories, setCategories] = useState<string[]>([])
    const [newOptionLabel, setNewOptionLabel] = useState('')
    const [newOptionColor, setNewOptionColor] = useState('#000000')
    const [newOptionTextColor, setNewOptionTextColor] = useState('#ffffff')
    const [isColorManuallySelected, setIsColorManuallySelected] = useState(false)
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
    const [changes, setChanges] = useState<TrackerChanges>({
        addedOptions: [],
        removedOptions: [],
        changedOptions: [],
    })
    const [datesAffected, setDatesAffected] = useState<{ [optionLabel: string]: string[] }>({})

    useEffect(() => {
        setCategories(getCategories())
    }, [getCategories])

    useEffect(() => {
        if (newOptionLabel && !isColorManuallySelected) {
            let suggestedColor;
            do {
                suggestedColor = hashStringToColor(newOptionLabel + Math.random().toString());
            } while (!isColorValid(suggestedColor));
            setNewOptionColor(suggestedColor);
            setNewOptionTextColor(getContrastColor(suggestedColor));
        }
    }, [newOptionLabel, isColorManuallySelected])

    const handleSave = () => {
        const newChanges: TrackerChanges = {
            addedOptions: options.filter(option => !tracker.options.some(o => o.label === option.label) && !option.isDeleted),
            removedOptions: options.filter(option => option.isDeleted),
            changedOptions: options.filter(option => {
                const oldOption = tracker.options.find(o => o.label === option.label);
                return oldOption && !option.isDeleted && (oldOption.color !== option.color || oldOption.textColor !== option.textColor);
            }).map(option => ({
                old: tracker.options.find(o => o.label === option.label)!,
                new: option
            })),
        };

        if (name !== tracker.name) {
            newChanges.name = name;
        }

        if (category !== tracker.category) {
            newChanges.category = category;
        }

        setChanges(newChanges);

        const affectedDates: { [optionLabel: string]: string[] } = {};
        newChanges.removedOptions.forEach(option => {
            const dates = Object.entries(tracker.data)
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                .flatMap(([_, yearData]) =>
                    Object.entries(yearData)
                        .filter(([, value]) => value === option.label)
                        .map(([date]) => date)
                );
            if (dates.length > 0) {
                affectedDates[option.label] = dates;
            }
        });
        setDatesAffected(affectedDates);

        setIsConfirmDialogOpen(true);
    }

    const handleConfirmChanges = () => {
        const updatedTracker: Tracker = {
            ...tracker,
            name,
            category,
            options: options.filter(option => !option.isDeleted)
        }
        updateTracker(updatedTracker)
        updateTrackerOptions(tracker.id, updatedTracker.options)

        setIsConfirmDialogOpen(false);
        onClose()
    }

    const handleAddOption = () => {
        if (newOptionLabel) {
            setOptions([...options, { label: newOptionLabel, color: newOptionColor, textColor: newOptionTextColor, isDeleted: false }])
            setNewOptionLabel('')
            setNewOptionColor('#000000')
            setNewOptionTextColor('#ffffff')
            setIsColorManuallySelected(false)
        }
    }

    const handleToggleOption = (index: number) => {
        const updatedOptions = [...options]
        updatedOptions[index].isDeleted = !updatedOptions[index].isDeleted
        setOptions(updatedOptions)
    }

    const handleOptionColorChange = (index: number, color: string) => {
        const updatedOptions = [...options]
        updatedOptions[index] = {
            ...updatedOptions[index],
            color,
            textColor: getContrastColor(color)
        }
        setOptions(updatedOptions)
    }

    const handleCancel = () => {
        setCategory(tracker.category)
        setName(tracker.name)
        setCategories(getCategories)
        setOptions(tracker.options.map(option => ({ ...option, isDeleted: false })))

        onClose()
    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-md">
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
                        <div>
                            <CategoryInput category={category} setCategory={setCategory} categories={categories} setCategories={setCategories} />
                        </div>
                        <div>
                            <Label>Options</Label>
                            <div className="space-y-2">
                                {options.map((option, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <div className={"w-8 h-8 rounded-full overflow-hidden"}>
                                            <input
                                                type="color"
                                                value={option.color}
                                                onChange={(e) => handleOptionColorChange(index, e.target.value)}
                                                className="w-16 h-16 -translate-x-1/4 -translate-y-1/4 cursor-pointer disabled:cursor-default disabled:opacity-50"
                                                disabled={option.isDeleted}
                                            />
                                        </div>
                                        <span
                                            className="flex-grow px-2 py-1 rounded"
                                            style={{backgroundColor: option.color, color: option.textColor}}
                                        >
                                            {option.label}
                                        </span>
                                        <Switch
                                            checked={!option.isDeleted}
                                            onCheckedChange={() => handleToggleOption(index)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="new-option">Add New Option</Label>
                            <div className="flex items-center space-x-2">
                                <Input
                                    id="new-option"
                                    value={newOptionLabel}
                                    onChange={(e) => setNewOptionLabel(e.target.value)}
                                    placeholder="New option label"
                                />
                                <input
                                    type="color"
                                    value={newOptionColor}
                                    onChange={(e) => {
                                        setNewOptionColor(e.target.value);
                                        setNewOptionTextColor(getContrastColor(e.target.value));
                                        setIsColorManuallySelected(true);
                                    }}
                                    className="w-8 h-8 rounded-full cursor-pointer overflow-hidden"
                                />
                                <Button onClick={handleAddOption} size="icon">
                                    <Plus size={18} />
                                </Button>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleCancel} variant="outline">Cancel</Button>
                        <Button onClick={handleSave}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <ConfirmEditDialog
                isOpen={isConfirmDialogOpen}
                onClose={() => setIsConfirmDialogOpen(false)}
                onConfirm={handleConfirmChanges}
                changes={changes}
                datesAffected={datesAffected}
            />
        </>
    )
}

export default EditTracker


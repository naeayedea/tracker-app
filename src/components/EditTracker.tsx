'use client'

import React, { useState, useEffect, useCallback} from 'react'
import { useTracker } from '@/contexts/TrackerContext'
import { Tracker, TrackerOption } from '@/types/tracker'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CategoryInput from "@/components/CategoryInput";
import { getContrastColor, hashStringToColor, isColorValid } from "@/utils/colorUtils";
import { GripVertical, Plus } from "lucide-react";
import ConfirmEditDialog from "@/components/ConfirmEditDialog";
import { Switch } from "@/components/ui/switch";

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
    reorderedOptions?: {old: TrackerOption[], new: TrackerOption[]}
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
        reorderedOptions: {old: [], new: []}
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
            // reorderedOptions: JSON.stringify(tracker.options.map(o => o.label)) !== JSON.stringify(options.filter(o => !o.isDeleted).map(o => o.label)) ? {old: tracker.options, new: options.filter(o => !o.isDeleted)} : {old: [], new: []}
        };

        if (name !== tracker.name) {
            newChanges.name = name;
        }

        if (category !== tracker.category) {
            newChanges.category = category;
        }

        const updatedOptionsWithDeletions = options.filter(o => !o.isDeleted)
        const originalOptionsWithoutDeletions = tracker.options.filter(o => updatedOptionsWithDeletions.findIndex(uo => uo.label === o.label) !== -1)

        if (JSON.stringify(originalOptionsWithoutDeletions) !== JSON.stringify(updatedOptionsWithDeletions)) {
            newChanges.reorderedOptions = {old: tracker.options, new: options.filter(o => !o.isDeleted)}
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

    const handleDragStart = useCallback((e: React.DragEvent<HTMLDivElement>, targetLabel: string) => {
        e.dataTransfer.setData(targetLabel, targetLabel)
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setDragImage(document.createElement('canvas'), 0, 0);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>, targetLabel:string) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        const sourceLabel: string = e.dataTransfer.types[0]

        if (sourceLabel.toLowerCase() !== targetLabel.toLowerCase()) {
            const sourceIndex = options.findIndex(o => o.label.toLowerCase() === sourceLabel.toLowerCase());
            const targetIndex = options.findIndex(o => o.label.toLowerCase() === targetLabel.toLowerCase());

            setOptions((prevOptions) => {
                const newOptions = [...prevOptions];

                const temp = newOptions[sourceIndex]

                newOptions[sourceIndex] = newOptions[targetIndex]
                newOptions[targetIndex] = temp

                return newOptions;
            });
        }
    }, [options]);

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
                                className={"w-full"}
                            />
                        </div>
                        <div>
                            <CategoryInput category={category} setCategory={setCategory} categories={categories} setCategories={setCategories} />
                        </div>
                        <div>
                            <Label>Options</Label>
                            <div className="space-y-2">
                                {options.map((option, index) => (
                                    <div key={option.label}
                                         className="flex items-center space-x-2 border rounded-md p-2"
                                         draggable={true}
                                         onDragStart={(e) => handleDragStart(e, option.label)}
                                         onDragOver={(e) => handleDragOver(e, option.label)}
                                    >
                                        <div>
                                            <GripVertical size={20} className={"hover:cursor-move"} />
                                        </div>
                                        <div className={"w-8 h-8 rounded-lg overflow-hidden"}>
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
                                    className={"flex-grow"}
                                />
                                <div className={"w-8 h-8 rounded-lg overflow-hidden"}>
                                    <input
                                        type="color"
                                        value={newOptionColor}
                                        onChange={(e) => {
                                            setNewOptionColor(e.target.value);
                                            setNewOptionTextColor(getContrastColor(e.target.value));
                                            setIsColorManuallySelected(true);
                                        }}
                                        className="w-16 h-16 basis-1 -translate-x-1/4 -translate-y-1/4 rounded-full cursor-pointer overflow-hidden"
                                    />
                                </div>

                                <Button onClick={handleAddOption} size="icon">
                                    <Plus size={18}/>
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


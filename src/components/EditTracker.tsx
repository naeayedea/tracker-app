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

interface EditTrackerProps {
    tracker: Tracker
    isOpen: boolean
    onClose: () => void
}

const EditTracker: React.FC<EditTrackerProps> = ({ tracker, isOpen, onClose }) => {
    const { updateTracker, getCategories, updateTrackerOptions } = useTracker()
    const [name, setName] = useState(tracker.name)
    const [category, setCategory] = useState(tracker.category)
    const [options, setOptions] = useState<TrackerOption[]>(tracker.options)
    const [categories, setCategories] = useState<string[]>([])
    const [newOptionLabel, setNewOptionLabel] = useState('')
    const [newOptionColor, setNewOptionColor] = useState('#000000')
    const [newOptionTextColor, setNewOptionTextColor] = useState('#ffffff')
    const [isColorManuallySelected, setIsColorManuallySelected] = useState(false)

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
        const updatedTracker: Tracker = {
            ...tracker,
            name,
            category
        }
        updateTracker(updatedTracker)
        updateTrackerOptions(tracker.id, options)

        onClose()
    }

    const handleAddOption = () => {
        if (newOptionLabel) {
            setOptions([...options, { label: newOptionLabel, color: newOptionColor, textColor: newOptionTextColor }])
            setNewOptionLabel('')
            setNewOptionColor('#000000')
            setNewOptionTextColor('#ffffff')
            setIsColorManuallySelected(false)
        }
    }

    const handleRemoveOption = (index: number) => {
        setOptions(options.filter((_, i) => i !== index))


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
        setOptions(tracker.options)

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
                    <CategoryInput category={category} setCategory={setCategory} categories={categories}
                                   setCategories={setCategories}/>
                    <div>
                        <Label>Options</Label>
                        <div className="space-y-2">
                            {options.map((option, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <input
                                        type="color"
                                        value={option.color}
                                        onChange={(e) => handleOptionColorChange(index, e.target.value)}
                                        className="w-8 h-8 rounded-full cursor-pointer overflow-hidden"
                                    />
                                    <span
                                        className="flex-grow px-2 py-1 rounded"
                                        style={{backgroundColor: option.color, color: option.textColor}}
                                    >
                                        {option.label}
                                    </span>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => handleRemoveOption(index)}
                                    >
                                        <X size={18}/>
                                    </Button>
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
    )
}

export default EditTracker


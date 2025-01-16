import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { TrackerOption } from '@/types/tracker'

interface ManageExclusionsProps {
    isOpen: boolean
    onClose: () => void
    options: TrackerOption[]
    onSave: (updatedOptions: TrackerOption[]) => void
}

const ManageExclusions: React.FC<ManageExclusionsProps> = ({ isOpen, onClose, options, onSave }) => {
    const [localOptions, setLocalOptions] = useState<TrackerOption[]>(options)

    console.log(options)

    const handleToggleExclusion = (index: number) => {
        const updatedOptions = [...localOptions]

        updatedOptions[index] = {
            ...updatedOptions[index],
            excludeFromSummary: !updatedOptions[index].excludeFromSummary
        }
        setLocalOptions(updatedOptions)
    }

    const handleSave = () => {
        onSave(localOptions)
        onClose()
    }

    console.log(localOptions)

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Manage Option Exclusions</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    {localOptions.map((option, index) => (
                        <div key={option.label} className="flex items-center justify-between space-x-2">
                            <Label htmlFor={`exclude-option-${index}`} className="flex items-center space-x-2">
                                <div
                                    className="w-4 h-4 rounded-full"
                                    style={{ backgroundColor: option.color }}
                                />
                                <span>{option.label}</span>
                            </Label>
                            <Switch
                                id={`exclude-option-${index}`}
                                checked={!option.excludeFromSummary}
                                onCheckedChange={() => handleToggleExclusion(index)}
                            />
                        </div>
                    ))}
                </div>
                <DialogFooter>
                    <Button onClick={onClose} variant="outline">Cancel</Button>
                    <Button onClick={handleSave}>Update</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ManageExclusions

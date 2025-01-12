import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { TrackerOption } from '@/types/tracker'

const groupDatesByYear = (dates: string[]): Record<string, string[]> => {
    return dates.reduce((acc, date) => {
        const year = date.split('-')[0];
        if (!acc[year]) {
            acc[year] = [];
        }
        acc[year].push(date);
        return acc;
    }, {} as Record<string, string[]>);
};

interface ConfirmEditDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    changes: {
        name?: string
        category?: string
        addedOptions: TrackerOption[]
        removedOptions: TrackerOption[]
        changedOptions: { old: TrackerOption; new: TrackerOption }[]
    }
    datesAffected: { [optionLabel: string]: string[] }
}

const ConfirmEditDialog: React.FC<ConfirmEditDialogProps> = ({
                                                                 isOpen,
                                                                 onClose,
                                                                 onConfirm,
                                                                 changes,
                                                                 datesAffected,
                                                             }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Confirm Changes</DialogTitle>
                    <DialogDescription>
                        Please review the following changes:
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="flex-grow">
                    <div className="space-y-4 pr-4">
                        {changes.name && (
                            <div>
                                <h4 className="font-semibold">Name Change:</h4>
                                <p>{changes.name}</p>
                            </div>
                        )}
                        {changes.category && (
                            <div>
                                <h4 className="font-semibold">Category Change:</h4>
                                <p>{changes.category}</p>
                            </div>
                        )}
                        {changes.addedOptions.length > 0 && (
                            <div>
                                <h4 className="font-semibold">Added Options:</h4>
                                <ul className="list-disc pl-5">
                                    {changes.addedOptions.map((option, index) => (
                                        <li key={index} style={{ color: option.color }}>
                                            {option.label}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {changes.removedOptions.length > 0 && (
                            <div>
                                <h4 className="font-semibold">Removed Options:</h4>
                                <ul className="list-disc pl-5">
                                    {changes.removedOptions.map((option, index) => (
                                        <li key={index} style={{ color: option.color }}>
                                            {option.label}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {changes.changedOptions.length > 0 && (
                            <div>
                                <h4 className="font-semibold">Changed Options:</h4>
                                <ul className="list-disc pl-5">
                                    {changes.changedOptions.map((change, index) => (
                                        <li key={index}>
                                            <span style={{ color: change.old.color }}>{change.old.label}</span>
                                            {' -> '}
                                            <span style={{ color: change.new.color }}>{change.new.label}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {Object.keys(datesAffected).length > 0 && (
                            <div>
                                <h4 className="font-semibold">Dates Affected:</h4>
                                {Object.entries(datesAffected).map(([optionLabel, dates]) => (
                                    <div key={optionLabel} className="mb-4">
                                        <p className="font-medium">{optionLabel}:</p>
                                        {Object.entries(groupDatesByYear(dates)).map(([year, yearDates]) => (
                                            <div key={year} className="ml-4">
                                                <p className="font-medium text-sm">{year}:</p>
                                                <ul className="list-disc pl-5">
                                                    {yearDates.map((date, index) => (
                                                        <li key={index} className="text-sm">
                                                            {new Date(date).toLocaleDateString()}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </ScrollArea>
                <DialogFooter>
                    <Button onClick={onClose} variant="outline">
                        Cancel
                    </Button>
                    <Button onClick={onConfirm} variant="default">
                        Confirm Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ConfirmEditDialog


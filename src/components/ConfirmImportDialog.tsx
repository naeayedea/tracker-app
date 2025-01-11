import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Tracker } from '@/types/tracker'

interface ConfirmImportDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    importData: Tracker[] | null
}

const ConfirmImportDialog: React.FC<ConfirmImportDialogProps> = ({
                                                                     isOpen,
                                                                     onClose,
                                                                     onConfirm,
                                                                     importData
                                                                 }) => {
    if (!importData) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Import</DialogTitle>
                    <DialogDescription>
                        You are about to import the following data:
                    </DialogDescription>
                </DialogHeader>
                <div className="max-h-[300px] overflow-y-auto">
                    <ul className="list-disc pl-5">
                        {importData.map((tracker, index) => (
                            <li key={index} className="mb-2">
                                <strong>{tracker.name}</strong>: {tracker.options.length} options,{" "}
                                {Object.keys(tracker.data).length} years of data
                            </li>
                        ))}
                    </ul>
                </div>
                <DialogFooter>
                    <Button onClick={onClose} variant="outline">
                        Cancel
                    </Button>
                    <Button onClick={onConfirm} variant="default">
                        Confirm Import
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ConfirmImportDialog


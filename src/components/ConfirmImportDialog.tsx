import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Tracker } from '@/types/tracker'
import { ScrollArea } from '@/components/ui/scroll-area'
import {HeadingFour} from "@/components/ui/text";

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
            <DialogContent className="max-w-3xl h-[80vh] flex flex-col overflow-hidden">
                <DialogHeader>
                    <DialogTitle>Confirm Import</DialogTitle>
                    <DialogDescription>
                        You are about to import the following data:
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="flex-grow pr-4">
                    <Accordion type="single" collapsible className="w-full">
                        {importData.map(function (tracker, index) {

                            const importedTrackerData = Object.entries(tracker.data).filter(([, yearData]) => yearData && Object.keys(yearData).length > 0 )

                            return <AccordionItem value={`tracker-${index}`} key={index}>
                                <AccordionTrigger>
                                    <span className="font-semibold">{tracker.name}</span>
                                    <span className="text-sm text-gray-500 ml-2">
                                        ({tracker.options.length} options{importedTrackerData.length > 0 && `, ${importedTrackerData.length} years`})
                                    </span>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="pl-4">
                                        <HeadingFour>Options:</HeadingFour>
                                        <ul className="list-disc pl-5 mb-4">
                                            {tracker.options.map((option, optionIndex) => (
                                                <li key={optionIndex}>{option.label}</li>
                                            ))}
                                        </ul>
                                        {importedTrackerData.length > 0 && <>
                                            <HeadingFour>Years:</HeadingFour>
                                            <Accordion type="multiple" className="w-full">
                                                {importedTrackerData.map(([year, yearData], yearIndex) => (
                                                    <AccordionItem value={`year-${year}`} key={yearIndex}>
                                                        <AccordionTrigger>{year}</AccordionTrigger>
                                                        <AccordionContent>
                                                            <ScrollArea className="h-40 pr-4">
                                                                <ul className="list-disc pl-5">
                                                                    {Object.entries(yearData).map(([date, value], entryIndex) => (
                                                                        <li key={entryIndex}>
                                                                            {date}: {value}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </ScrollArea>
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                ))}
                                            </Accordion>
                                        </>}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>;
                        })}
                    </Accordion>
                </ScrollArea>
                <DialogFooter className="mt-4">
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


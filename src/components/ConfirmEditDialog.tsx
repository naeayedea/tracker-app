import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { TrackerOption } from '@/types/tracker'
import {HeadingFive, HeadingFour} from "@/components/ui/text";

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
        reorderedOptions?: { old: TrackerOption[], new: TrackerOption[] }
        updatedExclusions?: TrackerOption[]
        excludeFromDashboard?: boolean
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
    const renderDates = (dates: string[]) => {
        const groupedDates = groupDatesByYear(dates);
        const years = Object.keys(groupedDates);

        if (years.length === 1) {
            // If there's only one year, render the dates directly
            return (
                <ul className="list-disc pl-5 space-y-1">
                    {groupedDates[years[0]].map((date, index) => (
                        <li key={index} className="text-sm">
                            {new Date(date).toLocaleDateString()}
                        </li>
                    ))}
                </ul>
            );
        } else {
            // If there are multiple years, use an accordion
            return (
                <Accordion type="single" collapsible className="w-full">
                    {years.map((year, yearIndex) => (
                        <AccordionItem value={`year-${yearIndex}`} key={yearIndex}>
                            <AccordionTrigger>{year}</AccordionTrigger>
                            <AccordionContent>
                                <ul className="list-disc pl-5 space-y-1">
                                    {groupedDates[year].map((date, dateIndex) => (
                                        <li key={dateIndex} className="text-sm">
                                            {new Date(date).toLocaleDateString()}
                                        </li>
                                    ))}
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            );
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Confirm Changes</DialogTitle>
                    <DialogDescription>
                        Please review the following changes:
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="flex-grow pr-4">
                    <div className="space-y-6">
                        {changes.name && (
                            <Section title="Updated Name">
                                <p>{changes.name}</p>
                            </Section>
                        )}
                        {changes.category && (
                            <Section title="Updated Change">
                                <p>{changes.category}</p>
                            </Section>
                        )}
                        {changes.excludeFromDashboard !== undefined && (
                            <Section title={"Dashboard Exclusion Rule Updated"}>
                                <p>Rule set to {changes.excludeFromDashboard ? "true" : "false"}</p>
                            </Section>
                        )}
                        {changes.updatedExclusions && (
                            <Section title={"Statistics Exclusion Rules Updated"} >
                                {
                                    changes.updatedExclusions.map((option, index) => (
                                        <li key={index}>
                                            <span style={{ color: option.color }}> {option.label} </span> - {option.excludeFromSummary ? <span className={"text-green-400"}>true</span> : <span className={"text-red-400"}>false</span>}
                                        </li>
                                    ))
                                }
                            </Section>
                        )}
                        {changes.addedOptions.length > 0 && (
                            <Section title="Added Options">
                                <ul className="list-disc pl-5">
                                    {changes.addedOptions.map((option, index) => (
                                        <li key={index} style={{ color: option.color }}>
                                            {option.label}
                                        </li>
                                    ))}
                                </ul>
                            </Section>
                        )}
                        {changes.removedOptions.length > 0 && (
                            <Section title="Removed Options">
                                <ul className="list-disc pl-5">
                                    {changes.removedOptions.map((option, index) => (
                                        <li key={index} style={{ color: option.color }}>
                                            {option.label}
                                        </li>
                                    ))}
                                </ul>
                            </Section>
                        )}
                        {changes.changedOptions.length > 0 && (
                            <Section title="Changed Options">
                                <ul className="list-disc pl-5">
                                    {changes.changedOptions.map((change, index) => (
                                        <li key={index}>
                                            <span style={{ color: change.old.color }}>{change.old.label}</span>
                                            {' -> '}
                                            <span style={{ color: change.new.color }}>{change.new.label}</span>
                                        </li>
                                    ))}
                                </ul>
                            </Section>
                        )}
                        {changes.reorderedOptions && (
                            <Section title="Reordered Options">
                                <HeadingFive className="mt-2">{"Old"}</HeadingFive>
                                {changes.reorderedOptions.old.map((option) => (
                                    <div key={option.label}
                                         className="flex items-center space-x-2 border rounded-md p-2"
                                    >
                                        <div className={"w-8 h-8 rounded-lg overflow-hidden"}>
                                            <input
                                                type="color"
                                                value={option.color}
                                                className="w-16 h-16 -translate-x-1/4 -translate-y-1/4 cursor-pointer disabled:cursor-default"
                                                disabled={true}
                                            />
                                        </div>
                                        <span
                                            className="flex-grow px-2 py-1 rounded"
                                            style={{backgroundColor: option.color, color: option.textColor}}
                                        >
                                            {option.label}
                                        </span>
                                    </div>
                                ))}
                                <HeadingFive className="mt-2">{"New"}</HeadingFive>
                                {changes.reorderedOptions.new.map((option) => (
                                    <div key={option.label}
                                         className="flex items-center space-x-2 border rounded-md p-2"
                                    >
                                        <div className={"w-8 h-8 rounded-lg overflow-hidden"}>
                                            <input
                                                type="color"
                                                value={option.color}
                                                className="w-16 h-16 -translate-x-1/4 -translate-y-1/4 cursor-pointer disabled:cursor-default"
                                                disabled={true}
                                            />
                                        </div>
                                        <span
                                            className="flex-grow px-2 py-1 rounded"
                                            style={{backgroundColor: option.color, color: option.textColor}}
                                        >
                                            {option.label}
                                        </span>
                                    </div>
                                ))}
                            </Section>
                        )}
                        {Object.keys(datesAffected).length > 0 && (
                            <Section title="Dates Affected">
                                {Object.keys(datesAffected).length === 1 ? (
                                    // If there's only one option, don't use an accordion
                                    Object.entries(datesAffected).map(([optionLabel, dates], index) => (
                                        <div key={index}>
                                            <HeadingFive>{optionLabel}</HeadingFive>
                                            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                                                {renderDates(dates)}
                                            </ScrollArea>
                                        </div>
                                    ))
                                ) : (
                                    // If there are multiple options, use an accordion
                                    <Accordion type="single" collapsible className="w-full">
                                        {Object.entries(datesAffected).map(([optionLabel, dates], index) => (
                                            <AccordionItem value={`option-${index}`} key={index}>
                                                <AccordionTrigger>{optionLabel}</AccordionTrigger>
                                                <AccordionContent>
                                                    <ScrollArea className="w-full rounded-md border p-4">
                                                        {renderDates(dates)}
                                                    </ScrollArea>
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                )}
                            </Section>
                        )}
                    </div>
                </ScrollArea>
                <DialogFooter className="mt-6">
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

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-gray-50 p-4 rounded-lg">
        <HeadingFour>{title}</HeadingFour>
        {children}
    </div>
)

export default ConfirmEditDialog


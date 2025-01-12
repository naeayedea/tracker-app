'use client'

import React, { useState, useEffect, KeyboardEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useTracker } from '@/contexts/TrackerContext'
import { Tracker, TrackerOption } from '@/types/tracker'
import { hashStringToColor, getContrastColor, isColorValid } from '@/utils/colorUtils'
import { X, Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import CategoryInput from "@/components/CategoryInput";

const TrackerCreator: React.FC = () => {
    const { addTracker, getCategories } = useTracker()
    const router = useRouter()
    const [name, setName] = useState('')
    const [category, setCategory] = useState('')
    const [options, setOptions] = useState<TrackerOption[]>([])
    const [optionLabel, setOptionLabel] = useState('')
    const [optionColor, setOptionColor] = useState('#000000')
    const [textColor, setTextColor] = useState('#ffffff')
    const [isColorManuallySelected, setIsColorManuallySelected] = useState(false)
    const [categories, setCategories] = useState<string[]>([])

    useEffect(() => {
        setCategories(getCategories())
    }, [getCategories])

    useEffect(() => {
        if (optionLabel && !isColorManuallySelected) {
            let suggestedColor;
            do {
                suggestedColor = hashStringToColor(optionLabel + Math.random().toString());
            } while (!isColorValid(suggestedColor));
            setOptionColor(suggestedColor);
            setTextColor(getContrastColor(suggestedColor));
        }
    }, [optionLabel, isColorManuallySelected])

    const handleAddOption = () => {
        if (optionLabel) {
            setOptions([...options, { label: optionLabel, color: optionColor, textColor }])
            setOptionLabel('')
            setOptionColor('#000000')
            setTextColor('#ffffff')
            setIsColorManuallySelected(false)
        }
    }

    const handleCreateTracker = () => {
        if (name && options.length > 0) {
            const year: number = new Date().getFullYear()

            const newTracker: Tracker = {
                id: Date.now().toString(),
                name,
                category,
                options,
                data: { [year]: {} },
                currentDate: year
            }

            addTracker(newTracker)
            router.push(`/tracker/${newTracker.id}`)
        }
    }

    const handleRemoveOption = (index: number) => {
        setOptions(options.filter((_, i) => i !== index))
    }

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if (e.currentTarget.id === 'tracker-name' && name) {
                document.getElementById('category')?.focus()
            } else if (e.currentTarget.id === 'option-label') {
                handleAddOption()
            }
        }
    }

    return (
        <div className="w-full max-w-4xl mx-auto px-4">
            <div className="bg-white shadow-lg rounded-xl p-8 mb-8">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">Create New Tracker</h2>
                <div className="mb-6">
                    <Label htmlFor="tracker-name">Tracker Name</Label>
                    <Input
                        id="tracker-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyUp={handleKeyPress}
                        placeholder="Enter tracker name"
                    />
                </div>
                <div className="mb-6">
                    <CategoryInput category={category} setCategory={setCategory} categories={categories} setCategories={setCategories} />
                </div>
                <div className="mb-6">
                    <Label htmlFor="option-label">Add Option</Label>
                    <div className="flex space-x-2 ">
                        <div className={"flex flex-col align-middle justify-center content-center flex-grow"}>
                            <Input
                                id="option-label"
                                value={optionLabel}
                                onChange={(e) => setOptionLabel(e.target.value)}
                                onKeyUp={handleKeyPress}
                                placeholder="Option label"
                            />
                        </div>
                        <div className={"w-12 h-12 rounded-lg overflow-hidden"}>
                            <input
                                type="color"
                                value={optionColor}
                                onChange={(e) => {
                                    const newColor = e.target.value;
                                    setOptionColor(newColor);
                                    setTextColor(getContrastColor(newColor));
                                    setIsColorManuallySelected(true);
                                }}
                                className="w-24 h-24 -translate-x-1/4 -translate-y-1/4"
                                style={{
                                    appearance: 'none',
                                    background: 'none',
                                    border: 'none',
                                    padding: 0,
                                }}
                            />
                        </div>

                        <button
                            onClick={handleAddOption}
                            className="bg-blue-500 text-white px-5 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            <Plus size={24}/>
                        </button>
                    </div>
                </div>
                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3 text-gray-700">Options</h3>
                    <div className="flex flex-wrap gap-3">
                        {options.map((option, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center px-4 py-2 rounded-full text-base"
                                style={{backgroundColor: option.color, color: option.textColor }}
                            >
                                {option.label}
                                <button
                                    onClick={() => handleRemoveOption(index)}
                                    className="ml-2 focus:outline-none"
                                >
                                    <X size={18} />
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
                <button
                    onClick={handleCreateTracker}
                    disabled={!name || options.length === 0}
                    className="w-full bg-green-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    Create Tracker
                </button>
            </div>
        </div>
    )
}

export default TrackerCreator


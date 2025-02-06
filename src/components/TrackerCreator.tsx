import React, { useState, useEffect, KeyboardEvent } from 'react'
import { useTracker } from '@/contexts/TrackerContext'
import { Tracker, TrackerOption } from '@/types/tracker'
import { hashStringToColor, getContrastColor, isColorValid } from '@/utils/colorUtils'
import { X, Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import CategoryInput from "@/components/CategoryInput";
import {useNavigate} from "react-router-dom";
import {HeadingThree, HeadingTwo} from "@/components/ui/text";

const TrackerCreator: React.FC = () => {
    const { addTracker, getCategories } = useTracker()
    const navigate = useNavigate()
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
            setOptions([...options, { label: optionLabel, color: optionColor, textColor, excludeFromSummary: false }])
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
                currentDate: year,
                excludeFromDashboard: false
            }

            addTracker(newTracker)
            navigate(`/tracker/${newTracker.id}`)
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
        <div className="bg-white shadow-lg rounded-xl p-8 mb-8 min-h-full w-full xl:w-5/6 xl:mx-auto ">
            <HeadingTwo>Create New Tracker</HeadingTwo>
            <div>
                <Label htmlFor="tracker-name">Tracker Name</Label>
                <Input
                    id="tracker-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyUp={handleKeyPress}
                    placeholder="Enter tracker name"
                    className={"w-full lg:w-5/6 my-2"}
                />
            </div>
            <div>
                <CategoryInput category={category} setCategory={setCategory} categories={categories} setCategories={setCategories} className={"w-full lg:w-2/3"}/>
            </div>
            <div className={"w-full lg:w-1/2"}>
                <Label htmlFor="option-label">Add Option</Label>
                <div className="flex space-x-2">
                    <div className={"flex flex-col align-middle justify-center content-center flex-grow "}>
                        <Input
                            id="option-label"
                            value={optionLabel}
                            onChange={(e) => setOptionLabel(e.target.value)}
                            onKeyUp={handleKeyPress}
                            placeholder="Option label"
                            className={"w-full my-2"}
                        />
                    </div>
                    <div className={"flex flex-col align-middle justify-center content-center "}>
                        <div className={"w-8 h-8 rounded-lg overflow-hidden cursor-pointer"}>
                            <input
                                type="color"
                                value={optionColor}
                                onChange={(e) => {
                                    const newColor = e.target.value;
                                    setOptionColor(newColor);
                                    setTextColor(getContrastColor(newColor));
                                    setIsColorManuallySelected(true);
                                }}
                                className="w-16 h-16 -translate-x-1/4 -translate-y-1/4 cursor-pointer"
                                style={{
                                    appearance: 'none',
                                    background: 'none',
                                    border: 'none',
                                    padding: 0,
                                }}
                            />
                        </div>
                    </div>
                    <div className={"flex flex-col align-middle justify-center content-center"}>
                        <button
                            onClick={handleAddOption}
                            className="bg-blue-500 text-white h-8 w-8 rounded-lg hover:bg-blue-600 transition-colors flex flex-col justify-center"
                        >
                            <Plus size={16} className={"translate-x-1/2"}/>
                        </button>
                    </div>
                </div>
                </div>
                <div className="mb-6">
                    <HeadingThree className="mb-3">Options</HeadingThree>
                <div className="flex flex-wrap gap-3">
                    {options.map((option, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center px-4 py-2 rounded-full text-base"
                            style={{backgroundColor: option.color, color: option.textColor}}
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
                className="w-full lg:w-1/2 bg-green-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
                Create Tracker
            </button>
        </div>
    )
}

export default TrackerCreator


'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useTracker } from '@/contexts/TrackerContext'
import { Tracker, TrackerOption } from '@/types/tracker'
import { hashStringToColor, getContrastColor } from '@/utils/colorUtils'

const TrackerCreator: React.FC = () => {
    const { addTracker } = useTracker()
    const router = useRouter()
    const [name, setName] = useState('')
    const [options, setOptions] = useState<TrackerOption[]>([])
    const [optionLabel, setOptionLabel] = useState('')
    const [optionColor, setOptionColor] = useState('#000000')
    const [textColor, setTextColor] = useState('#ffffff')
    const optionInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (optionLabel) {
            const suggestedColor = hashStringToColor(optionLabel)
            setOptionColor(suggestedColor)
            setTextColor(getContrastColor(suggestedColor))
        }
    }, [optionLabel])

    const handleAddOption = () => {
        if (optionLabel) {
            setOptions([...options, { label: optionLabel, color: optionColor, textColor }])
            setOptionLabel('')
            setOptionColor('#000000')
            setTextColor('#ffffff')
            optionInputRef.current?.focus()
        }
    }

    const handleCreateTracker = () => {
        if (name && options.length > 0) {
            const year: number = new Date().getFullYear()

            const newTracker: Tracker = {
                id: Date.now().toString(),
                name,
                options,
                data: {},
                currentDate: year
            }

            newTracker.data[year] = {}

            addTracker(newTracker)

            router.push(`/tracker/${newTracker.id}`)
        }
    }

    const handleRemoveOption = (index: number) => {
        setOptions(options.filter((_, i) => i !== index))
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleAddOption()
        }
    }

    return (
        <div className="mb-4 p-4 border rounded-lg">
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tracker Name"
                className="w-full p-2 mb-2 border rounded"
            />
            <div className="mb-2">
                <input
                    ref={optionInputRef}
                    type="text"
                    value={optionLabel}
                    onChange={(e) => setOptionLabel(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Option Label"
                    className="p-2 mr-2 border rounded"
                />
                <input
                    type="color"
                    value={optionColor}
                    onChange={(e) => {
                        setOptionColor(e.target.value)
                        setTextColor(getContrastColor(e.target.value))
                    }}
                    className="mr-2"
                />
                <button onClick={handleAddOption} className="bg-blue-500 text-white px-2 py-1 rounded">
                    Add Option
                </button>
            </div>
            <div className="mb-2">
                {options.map((option, index) => (
                    <span
                        key={index}
                        className="mr-2 p-1 rounded flex items-center"
                        style={{ backgroundColor: option.color, color: option.textColor }}
                    >
            {option.label}
                        <button
                            onClick={() => handleRemoveOption(index)}
                            className="ml-2 font-bold"
                            style={{ color: option.textColor }}
                        >
              ×
            </button>
          </span>
                ))}
            </div>
            <button onClick={handleCreateTracker} className="bg-green-500 text-white px-4 py-2 rounded">
                Create Tracker
            </button>
        </div>
    )
}

export default TrackerCreator


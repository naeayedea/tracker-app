import React, {KeyboardEvent, useEffect, useRef, useState} from "react";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Input} from "@/components/ui/input";

interface CategoryInputProps {
    category: string;
    setCategory: (str: string) => void;
    categories: string[];
    setCategories: (strings: string[]) => void;
    className?: string;
}

const useFocus = (): {ref: React.RefObject<HTMLInputElement | null>, setFocus: () => void} => {
    const htmlElRef: React.RefObject<HTMLInputElement | null> = useRef<HTMLInputElement>(null)

    const setFocus = () => {
        if (htmlElRef.current !== null) {
            setTimeout(() => htmlElRef.current?.focus(), 50);
        }
    }

    return { ref: htmlElRef, setFocus: setFocus }
}

const CategoryInput: React.FC<CategoryInputProps> = ({category, setCategory, categories, setCategories, className}) => {
    const [categoryTextInput, setCategoryTextInput] = useState<string>("");
    const {ref, setFocus} = useFocus()

    useEffect(() => {
        setFocus()
    }, [category]);

    const handleOnEnter = (e: KeyboardEvent<HTMLInputElement>, action: () => void) => {
        if (e.key === 'Enter') {
            action()
        }
    }

    const handleSetCategory = () => {
        if (categoryTextInput !== undefined && categoryTextInput !== "" && categoryTextInput !== "new") {
            setCategory(categoryTextInput)
            setCategories([...new Set([...categories, categoryTextInput])].filter(Boolean))
        }
    }

    return (
        <div className={className}>
            <Label htmlFor="edit-category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="edit-category">
                    <SelectValue placeholder="Select a category"/>
                </SelectTrigger>
                <SelectContent>
                    {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                            {cat}
                        </SelectItem>
                    ))}
                    <SelectItem value="new">+ Add New Category</SelectItem>
                </SelectContent>
            </Select>
            {category === 'new' && (
                <Input
                    className="mt-2 w-full"
                    placeholder="Enter new category"
                    value={categoryTextInput}
                    onChange={(e) => setCategoryTextInput(e.target.value)}
                    onKeyUp={(e) => handleOnEnter(e, () => handleSetCategory())}
                    onBlur={() => handleSetCategory()}
                    key={"new-category-input"}
                    ref={ref}
                />
            )}
        </div>
    )
}

export default CategoryInput
import React from "react"

import { cn } from "@/lib/utils"

const Text = ({ className, ...props }: React.ComponentProps<"p">) => {
    return (
        <p className={cn("text-gray-800", className)} {...props} />
    )
}

const HeadingOne = ({ className, ...props }: React.ComponentProps<"h1">) => {
    return (
        <h1 className={cn("text-gray-800 text-2xl font-bold", className)} {...props} />
    )
}

const HeadingTwo = ({ className, ...props }: React.ComponentProps<"h2">) => {
    return (
        <h2 className={cn("text-gray-800 text-2xl font-bold mb-2", className)} {...props} />
    )
}

const HeadingThree = ({ className, ...props }: React.ComponentProps<"h3">) => {
    return (
        <h3 className={cn("text-gray-800 text-xl font-semibold mb-2", className)} {...props} />
    )
}

const HeadingFour = ({ className, ...props }: React.ComponentProps<"h4">) => {
    return (
        <h4 className={cn("text-gray-800 text-lg mb-2", className)} {...props} />
    )
}

const HeadingFive = ({ className, ...props }: React.ComponentProps<"h5">) => {
    return (
        <h5 className={cn("text-gray-800 font-medium mb-2", className)} {...props} />
    )
}

export { Text, HeadingOne, HeadingTwo, HeadingThree, HeadingFour, HeadingFive }

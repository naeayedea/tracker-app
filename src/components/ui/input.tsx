import * as React from "react"

import { cn } from "@/lib/utils"
import { useImperativeHandle, useMemo, useRef} from "react";
import {Button} from "@/components/ui/button";
import {Text} from "@/components/ui/text";


const coreInputStyling: string = "flex rounded-md border border-input bg-input px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(({ className, type, ...props }, ref) => {
    const mergedClassName = cn(coreInputStyling, className);

        if (type === "file") {
            return <FileInput className={mergedClassName} ref={ref} type={type} {...props} />
        }

        return (
            <input type={type} className={mergedClassName} ref={ref} {...props}/>
        )
    }
)

const FileInput = React.forwardRef<HTMLInputElement, React.ComponentProps<"input"> & { buttonClassName?: string, textClassName?: string }>(({ className, buttonClassName, textClassName, type, ...props }, forwardedRef) => {
    const externalRef = useRef<HTMLInputElement>(null);
    const fileName = useMemo(() => {
        const fileName = externalRef.current?.files?.item(0)?.name

        return fileName ? fileName : "No file chosen";
        //feels like a bug to me, I want to recalculate each time files is updated
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [externalRef.current?.files])

    useImperativeHandle(forwardedRef, () => externalRef.current as HTMLInputElement);

    return (<div className={className}>
        <Button onClick={() => externalRef.current?.click()} className={cn("file:border-0 file:bg-primary file:text-sm file:font-medium file:text-foreground", buttonClassName)}>
            <Text className={cn("text-primary-foreground", textClassName)}>{"Choose File"}</Text>
            <input type={type} className={"hidden"} ref={externalRef} {...props}/>
        </Button>
        <Text className={cn("pl-2 inline-block", textClassName)}>{fileName}</Text>
    </div>)
})


export { Input, FileInput}

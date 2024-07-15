"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { TYPE_OF_SCALE_CHART } from "../layouts/constants"

export function ComboBox({ value, setValue }) {
    const [open, setOpen] = React.useState(false)
    const handleOpenChange = (newOpen) => {
        setOpen(!!newOpen); 
    };
    
    return (
        <Popover open={open} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[200px] justify-between"
                >
                {value
                    ? TYPE_OF_SCALE_CHART.find((scale) => scale.value === value)?.label
                    : "Select scale..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandEmpty>No scale found.</CommandEmpty>
                    <CommandGroup>
                        <CommandList>
                            {TYPE_OF_SCALE_CHART.map((scale) => (
                                <CommandItem
                                    key={scale.value}
                                    value={scale.value}
                                    onSelect={(currentValue) => {
                                    setValue(currentValue === value ? "" : currentValue)
                                    setOpen(false)
                                    }}
                                    className="cursor-pointer"
                                >
                                    <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value === scale.value ? "opacity-100" : "opacity-0"
                                    )}
                                    />
                                    {scale.label}
                                </CommandItem>
                            ))}
                        </CommandList>
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

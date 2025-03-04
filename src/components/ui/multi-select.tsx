'use client';

import * as React from 'react';
import { Plus, X } from 'lucide-react';
import { Badge } from './badge';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from './command';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { cn } from '@/lib/utils';

export interface Option {
    label: string;
    value: string;
}

interface MultiSelectProps {
    options?: Option[];
    value: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
    className?: string;
    creatable?: boolean;
}

export function MultiSelect({
    options: initialOptions = [],
    value,
    onChange,
    placeholder = 'Select options...',
    className,
    creatable = true,
}: MultiSelectProps) {
    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState('');
    const [options, setOptions] = React.useState<Option[]>(initialOptions);

    // Update options when initialOptions change
    React.useEffect(() => {
        setOptions(initialOptions);
    }, [initialOptions]);

    // Add value options if they don't exist in options
    React.useEffect(() => {
        const newOptions = value
            .filter(val => !options.some(opt => opt.value === val))
            .map(val => ({ label: val, value: val }));

        if (newOptions.length > 0) {
            setOptions(prev => [...prev, ...newOptions]);
        }
    }, [value, options]);

    const selected = value.map((val) =>
        options.find((opt) => opt.value === val)
    ).filter((opt): opt is Option => opt !== undefined);

    const handleSelect = (selectedValue: string) => {
        const newValue = value.includes(selectedValue)
            ? value.filter((val) => val !== selectedValue)
            : [...value, selectedValue];
        onChange(newValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!creatable) return;

        const input = e.currentTarget.value.trim();
        if (e.key === 'Enter' && input) {
            e.preventDefault();
            if (!options.some(opt => opt.value.toLowerCase() === input.toLowerCase())) {
                const newOption = { label: input, value: input };
                setOptions(prev => [...prev, newOption]);
                onChange([...value, input]);
            }
            setInputValue('');
        }
    };

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
    );

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        'flex min-h-[40px] w-full flex-wrap items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                        className
                    )}
                >
                    <div className="flex flex-wrap gap-1">
                        {selected.map((option) => (
                            <Badge
                                key={option.value}
                                variant="secondary"
                                className="flex items-center gap-1"
                            >
                                {option.label}
                                <button
                                    type="button"
                                    className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSelect(option.value);
                                    }}
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        ))}
                        {selected.length === 0 && (
                            <span className="text-muted-foreground">{placeholder}</span>
                        )}
                    </div>
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
                <Command>
                    <CommandInput
                        placeholder="Search or add new..."
                        value={inputValue}
                        onValueChange={setInputValue}
                        onKeyDown={handleKeyDown}
                    />
                    <CommandEmpty>
                        {creatable && inputValue && (
                            <button
                                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                                onClick={() => {
                                    const input = inputValue.trim();
                                    if (!options.some(opt => opt.value.toLowerCase() === input.toLowerCase())) {
                                        const newOption = { label: input, value: input };
                                        setOptions(prev => [...prev, newOption]);
                                        onChange([...value, input]);
                                    }
                                    setInputValue('');
                                    setOpen(false);
                                }}
                            >
                                <Plus className="h-4 w-4" />
                                Add "{inputValue}"
                            </button>
                        )}
                        {!creatable && 'No results found.'}
                    </CommandEmpty>
                    <CommandGroup>
                        {filteredOptions.map((option) => (
                            <CommandItem
                                key={option.value}
                                onSelect={() => {
                                    handleSelect(option.value);
                                    setInputValue('');
                                }}
                            >
                                <div
                                    className={cn(
                                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                                        value.includes(option.value)
                                            ? 'bg-primary text-primary-foreground'
                                            : 'opacity-50 [&_svg]:invisible'
                                    )}
                                >
                                    <X className="h-3 w-3" />
                                </div>
                                {option.label}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
} 
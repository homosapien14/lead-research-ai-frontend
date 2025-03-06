'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

export interface Option {
    label: string;
    value: string;
}

interface SimpleMultiSelectProps {
    options?: Option[];
    value: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
    creatable?: boolean;
}

export function SimpleMultiSelect({
    options = [],
    value = [],
    onChange,
    placeholder = 'Select options...',
    creatable = false
}: SimpleMultiSelectProps) {
    const [inputValue, setInputValue] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Handle click outside to close dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Convert values to options for display
    const selectedOptions = value.map(v => {
        const option = options.find(opt => opt.value === v);
        return option || { label: v, value: v };
    });

    const handleRemoveOption = (optionValue: string) => {
        onChange(value.filter(v => v !== optionValue));
    };

    const handleAddOption = (option: Option) => {
        if (!value.includes(option.value)) {
            onChange([...value, option.value]);
        }
        setInputValue('');
        setIsOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!creatable || !inputValue.trim()) return;

        if (e.key === 'Enter') {
            e.preventDefault();
            const newOption = { label: inputValue.trim(), value: inputValue.trim() };
            handleAddOption(newOption);
        }
    };

    // Filter options based on input
    const filteredOptions = options.filter(option => 
        option.label.toLowerCase().includes(inputValue.toLowerCase()) &&
        !value.includes(option.value)
    );

    return (
        <div className="relative w-full" ref={containerRef}>
            {/* Selected Options Display */}
            <div className="min-h-[38px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <div className="flex flex-wrap gap-2">
                    {selectedOptions.map((option) => (
                        <span
                            key={option.value}
                            className="flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-sm"
                        >
                            {option.label}
                            <button
                                type="button"
                                onClick={() => handleRemoveOption(option.value)}
                                className="ml-1 rounded-full hover:bg-destructive/20"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                    ))}
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => {
                            setInputValue(e.target.value);
                            setIsOpen(true);
                        }}
                        onFocus={() => setIsOpen(true)}
                        placeholder={selectedOptions.length === 0 ? placeholder : ''}
                        className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                        onKeyDown={handleKeyDown}
                    />
                </div>
            </div>

            {/* Dropdown */}
            {isOpen && (inputValue || options.length > 0) && (
                <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 shadow-md">
                    {filteredOptions.length === 0 && creatable && inputValue && (
                        <button
                            className="flex w-full items-center px-2 py-1.5 text-sm hover:bg-accent"
                            onClick={() => handleAddOption({ label: inputValue, value: inputValue })}
                        >
                            Add "{inputValue}"
                        </button>
                    )}
                    {filteredOptions.map((option) => (
                        <button
                            key={option.value}
                            className="flex w-full items-center px-2 py-1.5 text-sm hover:bg-accent"
                            onClick={() => handleAddOption(option)}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
} 
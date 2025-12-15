"use client";

import * as React from "react";
import { format, isValid, parse } from "date-fns";
import { DayPicker } from "react-day-picker";
import { Calendar as CalendarIcon } from "lucide-react";
import { enUS } from "date-fns/locale";
import "react-day-picker/style.css";

interface DatePickerProps {
    value: Date | undefined;
    onChange: (date: Date | undefined) => void;
    className?: string;
    placeholder?: string;
    label?: string;
    disabled?: boolean;
    popoverAlign?: 'left' | 'right';
}

export function DatePicker({
    value,
    onChange,
    className = "",
    placeholder = "Select date",
    label,
    disabled = false,
    popoverAlign = 'left',
}: DatePickerProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState("");
    const containerRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (value && isValid(value)) {
            setInputValue(format(value, "dd/MM/yyyy"));
        }
        // Do not clear input value if value becomes undefined to allow typing
    }, [value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Allow only numbers and slashes
        let value = e.target.value.replace(/[^0-9/]/g, "");

        // Prevent double slashes to clean up input
        value = value.replace(/\/+/g, "/");

        // Detect if deleting (current length < previous length)
        // Note: This relies on inputValue being the up-to-date state from before this change.
        const isDeleting = value.length < inputValue.length;

        if (!isDeleting) {
            // Auto-append slashes
            if (value.length === 2 && !value.includes("/")) {
                value += "/";
            } else if (value.length === 5) {
                // Ensure we only append if we have one slash so far (dd/mm -> dd/mm/)
                if ((value.match(/\//g) || []).length === 1) {
                    value += "/";
                }
            }
        }

        // Check length
        if (value.length > 10) return;

        setInputValue(value);
        const parsedDate = parse(value, "dd/MM/yyyy", new Date());

        if (isValid(parsedDate) && value.length === 10) {
            onChange(parsedDate);
        } else {
            if (value === "") {
                onChange(undefined);
            }
        }
    };

    const handleInputFocus = () => {
        if (!disabled) setIsOpen(true);
    };

    const START_DATE = new Date(1900, 0, 1);
    const END_DATE = new Date(2100, 11, 31);

    const handleInputBlur = () => {
        if (inputValue === "") {
            onChange(undefined);
            return;
        }

        const parsedDate = parse(inputValue, "dd/MM/yyyy", new Date());

        if (isValid(parsedDate)) {
            if (parsedDate < START_DATE || parsedDate > END_DATE) {
                setInputValue("");
                onChange(undefined);
            } else {
                // Valid date, ensure it's set
                onChange(parsedDate);
            }
        } else {
            // Invalid date format, clear it
            setInputValue("");
            onChange(undefined);
        }
    };

    const handleDaySelect = (date: Date | undefined) => {
        onChange(date);
        if (date) {
            setInputValue(format(date, "dd/MM/yyyy"));
            setIsOpen(false);
        } else {
            setInputValue("");
        }
    };

    // Close when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className={`relative w-full ${className}`} ref={containerRef}>
            {label && (
                <label className='mb-1.5 block text-sm font-medium text-gray-700 '>
                    {label}
                </label>
            )}

            <div className='relative group'>
                <input
                    ref={inputRef}
                    type='text'
                    maxLength={10}
                    className={`block w-full rounded-xl border border-gray-200 bg-white py-3 pl-3 pr-10 text-sm text-gray-900 shadow-sm transition-all placeholder:text-gray-400 hover:border-indigo-300 hover:shadow-md focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 ${
                        isOpen ? "border-indigo-500 ring-1 ring-indigo-500" : ""
                    }`}
                    placeholder={placeholder}
                    value={inputValue}
                    onFocus={handleInputFocus}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    disabled={disabled}
                />
                <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3'>
                    <CalendarIcon className='h-5 w-5 text-gray-400 transition-colors group-focus-within:text-indigo-500' />
                </div>
            </div>

            {isOpen && (
                <div className={`absolute z-50 mt-2 rounded-xl border border-gray-100 bg-white p-3 shadow-2xl ${
                    popoverAlign === 'right' ? 'right-0' : 'left-0'
                }`}>
                    <DayPicker
                        mode='single'
                        selected={value}
                        onSelect={handleDaySelect}
                        showOutsideDays
                        locale={enUS}
                        captionLayout='dropdown'
                        defaultMonth={value}
                        animate
                        navLayout='around'
                        startMonth={START_DATE}
                        endMonth={END_DATE}
                    />
                </div>
            )}
        </div>
    );
}

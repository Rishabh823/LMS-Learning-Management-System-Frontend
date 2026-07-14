"use client";
import React from "react";
import { Calendar } from "lucide-react";
import Input from "./Input";

interface DateInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: string;
  error?: string;
  className?: string;
}

const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Merge refs if external ref is provided
    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const handleCalendarClick = () => {
      inputRef.current?.showPicker?.();
    };

    return (
      <div className={`flex flex-col ${className}`}>
        {label && (
          <label className="text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <Input
            ref={inputRef}
            type="date"
            className={`w-full px-3 py-2 pr-10 focus:outline-none text-sm ${
              error ? "border-red-500" : "border-gray-300"
            } [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer`}
            {...props}
          />
          <Calendar
            className="absolute right-3 text-gray-400 cursor-pointer"
            size={18}
            onClick={handleCalendarClick}
          />
        </div>
        {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
      </div>
    );
  },
);

DateInput.displayName = "DateInput";

export default DateInput;

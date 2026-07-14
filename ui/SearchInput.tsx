"use client";
import React from "react";
import { Search, X } from "lucide-react";
import Input from "./Input";
import Button from "./Button";

interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      value = "",
      onChange,
      onClear,
      placeholder = "Search...",
      className = "",
      ...props
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.value);
    };

    const handleClear = () => {
      onChange?.("");
      onClear?.();
    };

    return (
      <div className={`relative flex items-center ${className}`}>
        <Search
          className="absolute left-3 text-gray-400 pointer-events-none"
          size={18}
        />
        <Input
          ref={ref}
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 focus:outline-none text-sm"
          {...props}
        />
        {value && (
          <Button
            type="button"
            variant="ghost"
            onClick={handleClear}
            className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Clear search"
          >
            <X color="gray" size={18} />
          </Button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";

export default SearchInput;

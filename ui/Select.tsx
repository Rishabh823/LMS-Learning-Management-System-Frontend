"use client";
import React from "react";
import { FieldError } from "react-hook-form";
import Input from "./Input";

interface SelectOption {
  value: number | string;
  label: string;
}

interface SelectProps {
  filteredOptions: SelectOption[];
  isLoading: boolean;
  hasMore: boolean;
  isOpen: boolean;
  searchTerm: string;
  selectedOption?: SelectOption | SelectOption[] | null;
  dropdownRef: React.RefObject<HTMLDivElement>;
  searchInputRef: React.RefObject<HTMLInputElement>;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  handleSearchChange: (value: string) => void;
  handleScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  handleSelect: (
    option: SelectOption,
    onChange: (value: number | string | number[] | string[]) => void,
    isMulti?: boolean,
  ) => void;
  toggleDropdown: (disabled: boolean) => void;

  value?: number | string | (number | string)[] | null;
  onChange: (value: number | string | number[] | string[]) => void;
  placeholder?: string;
  error?: FieldError;
  disabled?: boolean;
  searchable?: boolean;
  isMulti?: boolean;
}

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      filteredOptions,
      isLoading,
      isOpen,
      searchTerm,
      selectedOption,
      dropdownRef,
      searchInputRef,
      scrollContainerRef,
      handleSearchChange,
      handleScroll,
      handleSelect,
      toggleDropdown,
      value,
      onChange,
      placeholder = "Select an option",
      disabled = false,
      searchable = true,
      isMulti = false,
    },
    ref,
  ) => {
    const renderLabel = () => {
      // Check value first - if it's undefined/empty, show placeholder
      if (Array.isArray(value)) {
        if (value.length === 0) {
          return placeholder;
        }
        const labels = filteredOptions
          .filter((opt) => value.includes(opt.value))
          .map((opt) => opt.label);
        return labels.length > 0 ? labels.join(", ") : placeholder;
      }

      // If value is undefined, null, or empty string, show placeholder
      if (value === undefined || value === null || value === "") {
        return placeholder;
      }

      // Try to find the option by value
      const found = filteredOptions.find((opt) => opt.value === value);
      if (found) {
        return found.label;
      }

      // Fallback to selectedOption if value doesn't match any option
      if (selectedOption) {
        if (Array.isArray(selectedOption)) {
          if (selectedOption.length === 0) {
            return placeholder;
          }
          return selectedOption.map((o) => o.label).join(", ");
        }
        return selectedOption.label;
      }

      return placeholder;
    };

    return (
      <div ref={dropdownRef} className="relative w-full">
        <div
          onClick={() => toggleDropdown(disabled)}
          className={`border-b border-gray-300 w-full pb-2 pt-1 cursor-pointer flex items-center justify-between text-sm focus:outline-none transition-all duration-200 ${
            disabled
              ? "bg-transparent cursor-not-allowed opacity-60"
              : "bg-transparent hover:border-gray-400"
          } ${isOpen ? "border-[#0066FF]" : ""}`}
        >
          <span
            className={
              value && (Array.isArray(value) ? value.length : true)
                ? "text-gray-900"
                : "text-gray-500"
            }
          >
            {renderLabel()}
          </span>

          <svg
            className={`w-4 h-4 transition-transform text-gray-500 ${
              isOpen ? "rotate-180 text-[#0066FF]" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
            {searchable && (
              <div className="p-2 border-b border-gray-200">
                <Input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search..."
                  className="w-full border-none"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}

            <div
              ref={scrollContainerRef}
              className="overflow-y-auto"
              style={{ maxHeight: "192px" }}
              onScroll={handleScroll}
            >
              {isLoading && filteredOptions.length === 0 ? (
                <div className="px-3 py-4 text-sm text-gray-500 text-center">
                  Loading...
                </div>
              ) : filteredOptions.length > 0 ? (
                filteredOptions.map((option) => {
                  const isSelected = Array.isArray(value)
                    ? value.includes(option.value)
                    : value === option.value;

                  return (
                    <div
                      key={String(option.value)}
                      onClick={() => {
                        handleSelect(option, onChange, isMulti);
                      }}
                      className={`px-3 py-2 cursor-pointer hover:bg-[#0066FF]/10 text-sm transition-colors duration-150 ${
                        isSelected
                          ? "bg-[#0066FF]/10 text-[#0066FF] font-medium"
                          : "text-gray-700"
                      }`}
                    >
                      {option.label}
                    </div>
                  );
                })
              ) : (
                <div className="px-3 py-4 text-sm text-gray-500 text-center">
                  {searchTerm ? "No results found" : "No options available"}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";
export default Select;

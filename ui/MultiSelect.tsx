"use client";
import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { FieldError } from "react-hook-form";

interface SelectOption {
  value: number | string;
  label: string;
}

interface MultiSelectProps {
  options: SelectOption[];
  value?: (number | string)[];
  onChange: (value: (number | string)[]) => void;
  placeholder?: string;
  error?: FieldError;
  disabled?: boolean;
  searchable?: boolean;
  isLoading?: boolean;
  maxDisplay?: number;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onSearch?: (term: string) => void; // New prop for server-side search
  enableServerSearch?: boolean; // Flag to indicate server-side search
}

const MultiSelect = React.forwardRef<HTMLDivElement, MultiSelectProps>(
  (
    {
      options,
      value = [],
      onChange,
      placeholder = "Select options",
      error,
      disabled = false,
      searchable = true,
      isLoading = false,
      maxDisplay = 2,
      hasMore = false,
      onLoadMore,
      onSearch,
      enableServerSearch = false,
    },
    ref,
  ) => {
    // Internal state - each instance has its own
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Refs - each instance has its own
    const dropdownRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Position the dropdown panel via a portal so it can never be clipped by
    // an ancestor's overflow (e.g. a scrollable Dialog).
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

    const updateCoords = () => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    };

    useLayoutEffect(() => {
      if (!isOpen) return;
      updateCoords();
      window.addEventListener("scroll", updateCoords, true);
      window.addEventListener("resize", updateCoords);
      return () => {
        window.removeEventListener("scroll", updateCoords, true);
        window.removeEventListener("resize", updateCoords);
      };
    }, [isOpen]);

    // Filter options based on search term (only for client-side search)
    const filteredOptions = enableServerSearch
      ? options // Server handles filtering
      : searchable
        ? options.filter((option) =>
            option.label.toLowerCase().includes(searchTerm.toLowerCase()),
          )
        : options;

    // Get display label
    const getDisplayLabel = () => {
      if (!value || value.length === 0) {
        return placeholder;
      }

      const selectedOptions = options.filter((opt) =>
        value.includes(opt.value),
      );

      if (selectedOptions.length <= maxDisplay) {
        return selectedOptions.map((opt) => opt.label).join(", ");
      }

      return `${selectedOptions.length} selected`;
    };

    // Handle search change
    const handleSearchChange = (term: string) => {
      setSearchTerm(term);

      // If server-side search is enabled, call the search function
      if (enableServerSearch && onSearch) {
        onSearch(term);
      }
    };

    // Handle infinite scroll
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
      if (!hasMore || isLoading || !onLoadMore) return;

      const target = e.currentTarget;
      const { scrollTop, scrollHeight, clientHeight } = target;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

      // Load more when within 50px of bottom
      if (distanceFromBottom < 50) {
        onLoadMore();
      }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Node;
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(target) &&
          !(panelRef.current && panelRef.current.contains(target))
        ) {
          setIsOpen(false);
          setSearchTerm("");
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Focus search input when dropdown opens
    useEffect(() => {
      if (isOpen && searchable && searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, [isOpen, searchable]);

    const handleToggleOption = (optionValue: number | string) => {
      const newValue = value.includes(optionValue)
        ? value.filter((v) => v !== optionValue)
        : [...value, optionValue];

      onChange(newValue);
    };

    const handleClearAll = () => {
      onChange([]);
    };

    const handleSelectAll = () => {
      onChange(filteredOptions.map((opt) => opt.value));
    };

    return (
      <div ref={dropdownRef} className="relative w-full">
        {/* Main Select Button */}
        <button
          ref={triggerRef}
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
            rounded-md border border-sky-200 bg-white w-full px-3 py-2.5
            flex items-center justify-between text-sm text-left
            focus:outline-none transition-all duration-200
            ${
              disabled
                ? "cursor-not-allowed opacity-60"
                : "hover:border-sky-300 cursor-pointer"
            }
            ${isOpen ? "border-sky-400 ring-2 ring-sky-100" : ""}
            ${error ? "border-red-500" : ""}
          `}
        >
          <span
            className={value.length > 0 ? "text-slate-800" : "text-slate-400"}
          >
            {getDisplayLabel()}
          </span>

          <div className="flex items-center gap-2">
            {value.length > 0 && !disabled && (
              <span
                role="button"
                tabIndex={0}
                onMouseDown={(e) => {
                  // Prevent the parent button from receiving the click.
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleClearAll();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    handleClearAll();
                  }
                }}
                aria-label="Clear selected options"
                className="text-slate-400 hover:text-slate-600 inline-flex items-center"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </span>
            )}

            <svg
              className={`w-4 h-4 transition-transform text-slate-400 ${
                isOpen ? "rotate-180 text-sky-500" : ""
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
        </button>

        {/* Error Message */}
        {error && <p className="mt-1 text-xs text-red-500">{error.message}</p>}

        {/* Dropdown - rendered in a portal so it can't be clipped by an
            ancestor's overflow (e.g. a scrollable Dialog) */}
        {isOpen &&
          createPortal(
            <div
              ref={panelRef}
              style={{
                position: "fixed",
                top: coords.top,
                left: coords.left,
                width: coords.width,
              }}
              className="z-110 bg-white border border-sky-100 rounded-lg shadow-lg max-h-60 overflow-hidden"
            >
            {/* Search Input */}
            {searchable && (
              <div className="p-2 border-b border-sky-100">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search..."
                  className="w-full px-3 py-2 text-sm border border-sky-200 rounded-md focus:outline-none focus:border-sky-400"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}

            {/* Select All / Clear All */}
            {filteredOptions.length > 0 && !isLoading && (
              <div className="flex items-center justify-between px-3 py-2 border-b border-sky-100 bg-sky-50/60">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-xs text-sky-600 hover:underline"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-xs text-slate-500 hover:underline"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Options List */}
            <div
              ref={scrollContainerRef}
              className="overflow-y-auto max-h-48"
              onScroll={handleScroll}
            >
              {isLoading && filteredOptions.length === 0 ? (
                <div className="px-3 py-4 text-sm text-slate-400 text-center">
                  Loading...
                </div>
              ) : filteredOptions.length > 0 ? (
                <>
                  {filteredOptions.map((option) => {
                    const isSelected = value.includes(option.value);

                    return (
                      <label
                        key={String(option.value)}
                        className={`
                          flex items-center px-3 py-2 cursor-pointer
                          hover:bg-sky-50 text-sm transition-colors duration-150
                          ${isSelected ? "bg-sky-50/60" : ""}
                        `}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleOption(option.value)}
                          className="mr-3 w-4 h-4 text-sky-500 border-sky-300 rounded focus:ring-sky-400"
                        />
                        <span
                          className={
                            isSelected
                              ? "text-sky-600 font-medium"
                              : "text-slate-700"
                          }
                        >
                          {option.label}
                        </span>
                      </label>
                    );
                  })}

                  {/* Loading more indicator */}
                  {isLoading && hasMore && (
                    <div className="px-3 py-2 text-sm text-slate-400 text-center">
                      Loading more...
                    </div>
                  )}
                </>
              ) : (
                <div className="px-3 py-4 text-sm text-slate-400 text-center">
                  {searchTerm ? "No results found" : "No options available"}
                </div>
              )}
            </div>
            </div>,
            document.body,
          )}
      </div>
    );
  },
);

export default MultiSelect;

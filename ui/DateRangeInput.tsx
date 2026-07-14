"use client";
import React, { useState, useRef, useEffect } from "react";
import { DateRangePicker } from "react-date-range";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import Button from "./Button";
import moment from "moment";

export interface DateRange {
  from: string;
  to: string;
}

interface DateRangeInputProps {
  value?: DateRange;
  onChange?: (dateRange: DateRange) => void;
  className?: string;
  disabled?: boolean;
  defaultToToday?: boolean;
}

const DateRangeInput: React.FC<DateRangeInputProps> = ({
  value = { from: "", to: "" },
  onChange,
  className = "",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [alignRight, setAlignRight] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const startDate = value.from
    ? moment(value.from, "DD MMM YYYY").toDate()
    : new Date();
  const endDate = value.to
    ? moment(value.to, "DD MMM YYYY").toDate()
    : new Date();

  // Calculate position when opening
  useEffect(() => {
    if (isOpen && wrapperRef.current && dropdownRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      const dropdownWidth = 300; // Approximate width of date picker
      const spaceOnRight = window.innerWidth - rect.right;
      const spaceOnLeft = rect.left;

      // If there's not enough space on the right but enough on the left, align right
      if (spaceOnRight < dropdownWidth && spaceOnLeft > dropdownWidth) {
        setAlignRight(true);
      } else {
        setAlignRight(false);
      }
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (ranges: any) => {
    const { startDate, endDate } = ranges.selection;
    onChange?.({
      from: moment(startDate).format("DD MMM YYYY"),
      to: moment(endDate).format("DD MMM YYYY"),
    });
  };

  const formatDisplayDate = (date: string) => {
    if (!date) return "Select date";
    try {
      return format(moment(date, "DD MMM YYYY").toDate(), "MMM dd, yyyy");
    } catch {
      return "Select date";
    }
  };

  return (
    <div className={`relative ${className}`} ref={wrapperRef}>
      <Button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`flex items-center w-full gap-2 px-4 py-2 pb-2 pt-1 border-b border-gray-300 bg-transparent rounded-b-none focus:outline-none focus:border-[#0066FF] transition-colors ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer hover:border-gray-400"
        }`}
      >
        <Calendar size={18} className="text-gray-400" />
        <span className="text-sm text-gray-500 w-full">
          {formatDisplayDate(value.from)} - {formatDisplayDate(value.to)}
        </span>
      </Button>

      {isOpen && !disabled && (
        <div
          ref={dropdownRef}
          className={`absolute top-full mt-2 z-50 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden ${
            alignRight ? "right-0" : "left-0"
          }`}
        >
          <DateRangePicker
            ranges={[
              {
                startDate: startDate,
                endDate: endDate,
                key: "selection",
              },
            ]}
            onChange={handleSelect}
            months={1}
            direction="vertical"
            moveRangeOnFirstSelection={false}
            rangeColors={["#0066FF"]}
          />
        </div>
      )}
    </div>
  );
};

DateRangeInput.displayName = "DateRangeInput";

export default DateRangeInput;

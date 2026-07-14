"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface AccordionProps {
  header: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

const Accordion = ({
  header,
  children,
  defaultOpen = false,
  className = "",
}: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className={`rounded-xl border border-gray-300 bg-white shadow-sm overflow-hidden transition-all duration-300 ${className}`}
    >
      {/* Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 transition"
      >
        <div className="flex-1">{header}</div>

        <ChevronDown
          size={16}
          className={`ml-2 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Body */}
      <div
        className={`transition-all duration-300 overflow-hidden ${
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-gray-300 p-3">{children}</div>
      </div>
    </div>
  );
};

export default Accordion;

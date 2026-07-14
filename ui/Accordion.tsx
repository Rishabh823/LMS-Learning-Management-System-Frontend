"use client";
import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export interface AccordionItem {
  id: string | number;
  title: string;
  content: React.ReactNode;
  onClick?: () => void;
}

interface AccordionProps {
  items: AccordionItem[];
  defaultOpenId?: string | number;
  allowMultiple?: boolean;
  onItemClick?: (id: string | number) => void;
}

const Accordion: React.FC<AccordionProps> = ({
  items,
  defaultOpenId,
  allowMultiple = false,
  onItemClick,
}) => {
  const [openIds, setOpenIds] = useState<Set<string | number>>(
    new Set(defaultOpenId ? [defaultOpenId] : []),
  );
  const [lastItemsRef, setLastItemsRef] = useState<string>("");

  // Auto-open and auto-select first item when items change
  useEffect(() => {
    const itemsKey = items.map((item) => item.id).join(",");

    if (items.length > 0 && itemsKey !== lastItemsRef) {
      const firstItem = items[0];
      setOpenIds(new Set([firstItem.id]));
      if (firstItem.onClick) {
        firstItem.onClick();
      }
      if (onItemClick) {
        onItemClick(firstItem.id);
      }
      setLastItemsRef(itemsKey);
    }
  }, [items]);

  const toggleItem = (item: AccordionItem) => {
    if (item.onClick) {
      item.onClick();
    }
    if (onItemClick) {
      onItemClick(item.id);
    }

    setOpenIds((prevOpenIds) => {
      const newOpenIds = new Set(prevOpenIds);
      if (newOpenIds.has(item.id)) {
        newOpenIds.delete(item.id);
      } else {
        if (!allowMultiple) {
          newOpenIds.clear();
        }
        newOpenIds.add(item.id);
      }
      return newOpenIds;
    });
  };

  return (
    <div className="space-y-2">
      {items.map((item) => {
        const isOpen = openIds.has(item.id);
        return (
          <div
            key={item.id}
            className="border border-gray-100 rounded-md overflow-hidden transition-all duration-300"
          >
            <button
              onClick={() => toggleItem(item)}
              className={`w-full flex items-center justify-between px-4 py-3 transition-all duration-300 text-left cursor-pointer ${
                isOpen
                  ? "bg-[#0066FF] hover:bg-[#2a7cf7] text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              <span className="font-medium text-sm">{item.title}</span>
              <span
                className="transition-transform duration-300"
                style={{
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
                <ChevronDown size={20} className="text-white" />
              </span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? "max-h-500 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="px-3 py-3 bg-white border-t border-gray-100">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;

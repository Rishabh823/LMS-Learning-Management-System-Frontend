"use client";

import React from "react";

type Props = {
  title: string;
  children: React.ReactNode;
  className?: string;
  maxWidth?: string;
  textSize?: string;
  bg?: string;
  color?: string;
  wrap?: boolean;
  minWidth?: string;
};

const IconTooltip = ({
  title,
  children,
  className = "",
  maxWidth,
  bg,
  color,
  textSize,
  wrap = false,
  minWidth,
}: Props) => {
  return (
    <div className={`relative group inline-flex ${className}`}>
      {children}

      <div
        className={`absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 ${
          bg || "bg-gray-800"
        } ${color || "text-white"} ${textSize || "text-sm"} px-2 py-1 rounded ${
          wrap ? "text-wrap" : "whitespace-nowrap"
        } ${maxWidth ? `max-w-${maxWidth}` : ""} ${minWidth ? `min-w-${minWidth}` : "min-w-auto"}`}
      >
        {title}
      </div>
    </div>
  );
};

export default IconTooltip;

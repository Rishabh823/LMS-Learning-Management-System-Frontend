import React, { useState, useEffect } from "react";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  showCharCount?: boolean;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", value, maxLength, showCharCount, onChange, ...props }, ref) => {
    const [charCount, setCharCount] = useState(0);
    const textValue = typeof value === "string" ? value : "";
    
    useEffect(() => {
      setCharCount(textValue.length);
    }, [textValue]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      setCharCount(newValue.length);
      onChange?.(e);
    };

    const defaultClasses =
      "w-full rounded-md border border-sky-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-colors resize-none min-h-[100px]";

    const shouldShowCount = showCharCount !== false && maxLength !== undefined;

    return (
      <div className="relative w-full">
        <textarea
          ref={ref}
          className={`${defaultClasses} ${className} ${shouldShowCount ? "pb-6" : ""}`}
          value={value}
          maxLength={maxLength}
          onChange={handleChange}
          {...props}
        />
        {shouldShowCount && (
          <div className="absolute bottom-2 right-0">
            <span className={`text-xs ${
              charCount >= (maxLength || 0) * 0.9 
                ? "text-red-500" 
                : "text-slate-400"
            }`}>
              {charCount} / {maxLength}
            </span>
          </div>
        )}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";

export default TextArea;

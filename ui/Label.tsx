import React from "react";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export default function Label({
  children,
  className = "",
  required = false,
  ...props
}: LabelProps) {
  return (
    <label className={`text-sm font-medium text-slate-700 ${className}`} {...props}>
      <span className="inline-flex items-center">
        {children}
        {required && <span className="text-red-500 ml-1">*</span>}
      </span>
    </label>
  );
}

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", icon, ...props }, ref) => {
    const defaultClasses =
      "w-full rounded-md border border-sky-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-colors";

    return (
      <div className="relative w-full">
        <input
          ref={ref}
          className={`${defaultClasses} ${className} ${icon ? "pr-9" : ""}`}
          {...props}
        />
        {icon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            {icon}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;

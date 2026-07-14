import React from "react";

type Variant =
  | "none"
  | "primary"
  | "secondary"
  | "ghost"
  | "submit"
  | "clear"
  | "back"
  | "danger"
  | "cancel"
  | "accept";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export default function Button({
  variant = "none",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base =
    "px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-100 text-sm font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer";

  const variants: Record<Variant, string> = {
    none: "",
    primary: "bg-sky-500 text-white shadow-sm hover:bg-sky-600",
    secondary:
      "flex items-center bg-sky-50 text-sky-700 hover:bg-sky-100 gap-2",
    ghost: "bg-transparent text-slate-600 hover:bg-sky-50",
    danger: "bg-red-600 text-white hover:bg-red-700",
    submit:
      "flex bg-sky-500 text-white shadow-sm hover:bg-sky-600 items-center gap-2",
    clear: "border border-sky-200 text-slate-600 hover:bg-sky-50",
    back: "border border-sky-200 text-slate-600 hover:bg-sky-50",
    cancel: "bg-slate-100 text-slate-700 hover:bg-slate-200",
    accept: "bg-emerald-600 text-white hover:bg-emerald-700",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

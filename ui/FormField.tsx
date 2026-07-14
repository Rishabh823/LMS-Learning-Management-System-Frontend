import React from "react";
import { FieldError } from "react-hook-form";
import Label from "./Label";

interface FormFieldProps {
  label?: React.ReactNode;
  error?: FieldError;
  children: React.ReactNode;
  required?: boolean;
  className?: string;
  labelClassName?: string;
}

const FormField = ({
  label,
  error,
  children,
  required,
  className,
  labelClassName,
}: FormFieldProps) => {
  return (
    <div className={className ? className : "w-full flex flex-col"}>
      {label && (
        <Label required={required} className={`font-medium mb-1.5 ${labelClassName || ""}`}>
          {label}
        </Label>
      )}
      <div className="w-full">
        {children}
      </div>
      {error && <span className="text-sm text-red-500 mt-1">{error.message}</span>}
    </div>
  );
};

export default FormField;

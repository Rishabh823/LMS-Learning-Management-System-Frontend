"use client";

type SwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  checkedClassName?: string;
  uncheckedClassName?: string;
};

const Switch = ({
  checked,
  onChange,
  disabled = false,
  checkedClassName = "bg-blue-600",
  uncheckedClassName = "bg-gray-300",
}: SwitchProps) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full 
        transition-colors duration-200
        ${checked ? checkedClassName : uncheckedClassName}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white shadow 
          transition-transform duration-200
          ${checked ? "translate-x-6" : "translate-x-1"}
        `}
      />
    </button>
  );
};

export default Switch;

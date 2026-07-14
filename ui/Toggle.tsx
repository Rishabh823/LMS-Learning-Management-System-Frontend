interface ToggleProps {
  checked: boolean;
  onChange: (value: boolean) => void;
}

const ToggleButton = ({ checked, onChange }: ToggleProps) => {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors
        ${checked ? "bg-[#3cd8ed]" : "bg-gray-300"}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
          ${checked ? "translate-x-5" : "translate-x-1"}`}
      />
    </button>
  );
};
export default ToggleButton;

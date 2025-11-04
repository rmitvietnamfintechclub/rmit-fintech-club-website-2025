import { useState } from "react";
import { FunnelIcon } from "@heroicons/react/24/solid";

interface LabelSortProps {
  availableLabels: string[];
  onSelect: (label: string) => void;
}

export default function LabelSort({
  availableLabels,
  onSelect,
}: LabelSortProps) {
  const [selectedLabel, setSelectedLabel] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedLabel(value);
    onSelect(value);
  };

  return (
    // --- RESPONSIVE LAYOUT ---
    // Stacks vertically on mobile, row on desktop
    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
      <label className="hidden md:block text-xl font-semibold text-[#2A2A57]">
        Label Sort
      </label>
      {/* --- RESPONSIVE SELECT --- */}
      {/* Full width on mobile, w-64 on desktop */}
      <div className="relative w-full md:w-64">
        <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#2A2A57] pointer-events-none" />
        <select
          value={selectedLabel}
          onChange={handleChange}
          className="pl-10 pr-8 py-2 rounded-xl bg-[#f6f4ff] text-[#2A2A57] font-medium shadow-md w-full cursor-pointer focus:outline-none appearance-none"
        >
          <option disabled value="">
            Select label...
          </option>
          {availableLabels.map((label, index) => (
            <option key={index} value={label}>
              {label}
            </option>
          ))}
        </select>
        {/* Custom arrow for select */}
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg
            className="w-4 h-4 fill-current text-[#2A2A57]"
            viewBox="0 0 20 20"
          >
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
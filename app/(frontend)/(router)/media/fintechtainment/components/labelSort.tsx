"use client";

import { useState } from "react";
import { FunnelIcon } from "@heroicons/react/24/solid";

// Define the props interface for the component
interface LabelSortProps {
  availableLabels: string[];
  onSelect: (label: string) => void;
}

export default function LabelSort({ availableLabels, onSelect }: LabelSortProps) {
  // Use "All" as the initial state to match the parent component
  const [selectedLabel, setSelectedLabel] = useState("All");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedLabel(value);
    onSelect(value);
  };

  return (
    <div className="flex items-center gap-6">
      <label className="text-xl font-semibold text-[#2A2A57]">
        Label Sort
      </label>
      <div className="relative w-64">
        <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#2A2A57]" />
        <select
          value={selectedLabel}
          onChange={handleChange}
          className="pl-10 pr-4 py-2 rounded-xl bg-[#f6f4ff] text-[#2A2A57] font-medium shadow-md w-full cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-[#DBB968]"
        >
          {/* Map over the labels received from props */}
          {availableLabels.map((label, index) => (
            <option key={index} value={label}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

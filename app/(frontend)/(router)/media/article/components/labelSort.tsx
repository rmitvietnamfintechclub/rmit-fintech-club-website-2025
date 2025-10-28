import { useState, useMemo } from "react";
import { FunnelIcon } from "@heroicons/react/24/solid";

interface LabelSortProps {
    availableLabels: string[];
    onSelect: (label: string) => void;
}

export default function LabelSort({ availableLabels, onSelect }: LabelSortProps) {
    const [selectedLabel, setSelectedLabel] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedLabel(value);
        onSelect(value);
    };

    return (
        <div className="flex content-center gap-6">
            <label className="text-xl font-semibold text-[#2A2A57]">
                Label Sort
            </label>
            <div className="relative w-64 bottom-2">
                <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#2A2A57]" />
                <select
                    value={selectedLabel}
                    onChange={handleChange}
                    className="px-10 py-2 rounded-xl bg-[#f6f4ff] text-[#2A2A57] font-medium shadow-md w-full cursor-pointer focus:outline-none"
                >
                    <option disabled value="">
                        Select label...
                    </option>
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
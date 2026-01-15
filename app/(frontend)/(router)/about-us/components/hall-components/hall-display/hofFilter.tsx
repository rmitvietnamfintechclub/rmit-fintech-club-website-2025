"use client";
import * as Select from "@radix-ui/react-select";
import { CheckIcon } from "@radix-ui/react-icons";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import type { SemesterFilterProps } from "../types";

export default function HoFFilter({
  semesters,
  onSelect,
  selectedLabel,
}: SemesterFilterProps) {
  const [open, setOpen] = useState(false);
  const [clicked, setClicked] = useState(false);
  const contextYear = selectedLabel 
    ? selectedLabel.substring(0, 4) 
    : new Date().getFullYear().toString();

  const getSemesterValue = (label: string): string => {
    const letter = label.split(" ")[1];
    
    return `${contextYear}${letter}`;
  };

  const handleSelect = (label: string) => {
    onSelect?.(getSemesterValue(label));
  };

  useEffect(() => {
    if (clicked) {
      const timeout = setTimeout(() => setClicked(false), 200);
      return () => clearTimeout(timeout);
    }
  }, [clicked]);

  const displayLabel = selectedLabel
    ? `Semester ${selectedLabel.slice(4)}`
    : "Select semester...";

  return (
    <Select.Root
      value={displayLabel}
      onValueChange={handleSelect}
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (isOpen) setClicked(true);
      }}
    >
      <div className="relative inline-block mb-3 xl:mr-8">
        <Select.Trigger asChild>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            className="
              bg-[#DCB968] text-[#2C305F] font-semibold
              pr-8 pl-4 py-2 rounded-md w-44 xl:text-lg 
              appearance-none inline-flex items-center justify-between
              focus:outline-none shadow-md
            "
          >
            <Select.Value>{displayLabel}</Select.Value>
          </motion.button>
        </Select.Trigger>

        {/* Triangle Arrow giữ nguyên */}
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#2C305F]"></div>

        <AnimatePresence>
          {open && (
            <Select.Portal>
              <Select.Content asChild position="popper" sideOffset={5}>
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="z-50 w-44 rounded-md bg-[#DCB968] text-[#2C305F] shadow-xl border border-[#2C305F] overflow-hidden"
                >
                  <Select.Viewport className="p-1">
                    {semesters.map((label) => (
                      <Select.Item
                        key={label}
                        value={label} // Value ở đây là "Semester A"
                        className="
                          relative cursor-pointer select-none rounded px-4 py-2 text-sm font-semibold outline-none
                          data-[highlighted]:bg-[#2C305F]/20
                          data-[state=checked]:bg-[#2C305F] data-[state=checked]:text-[#DCB968]
                        "
                      >
                        <Select.ItemText>{label}</Select.ItemText>
                        <Select.ItemIndicator className="absolute right-2 top-1/2 -translate-y-1/2">
                          <CheckIcon />
                        </Select.ItemIndicator>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                </motion.div>
              </Select.Content>
            </Select.Portal>
          )}
        </AnimatePresence>
      </div>
    </Select.Root>
  );
}
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

  const getSemesterValue = (label: string): string => {
    const letter = label.split(" ")[1];
    const year = new Date().getFullYear();
    return `${year}${letter}`;
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

  return (
    <Select.Root
      value={selectedLabel}
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
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 16,
            }}
            className="
              bg-[#DCB968] text-[#2C305F] font-semibold
              pr-8 pl-4 py-2 rounded-md w-40 xl:text-lg
              appearance-none inline-flex items-center justify-between
              focus:outline-none focus:ring-0 focus:ring-offset-0
              cursor-pointer
            "
          >
            <Select.Value className="text-sm xl:text-lg font-semibold text-[#2C305F]">
              {selectedLabel
                ? `Semester ${selectedLabel.charAt(selectedLabel.length - 1)}`
                : "Select semester..."}
            </Select.Value>
          </motion.button>
        </Select.Trigger>

        {/* Triangle arrow */}
        <div
          className="
            pointer-events-none
            absolute right-3 top-1/2 -translate-y-1/2
            w-0 h-0
            border-l-[6px] border-l-transparent
            border-r-[6px] border-r-transparent
            border-t-[6px] border-t-[#2C305F]
          "
        ></div>

        {/* Dropdown content */}
        <AnimatePresence>
          {open && (
            <Select.Portal>
              <Select.Content asChild>
                <motion.div
                  initial={{ opacity: 0, y: -5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1.04 }}
                  exit={{ opacity: 0, y: -5, scale: 0.95 }}
                  transition={{
                    type: "spring",
                    stiffness: 360,
                    damping: 20,
                  }}
                  className="
                              z-50 mt-1 w-40 rounded-md bg-[#DCB968] text-[#2C305F]
                              shadow-lg border border-[#2C305F]
                            "
                >
                  <Select.Viewport className="p-1">
                    {semesters.map((label) => (
                      <Select.Item
                        key={label}
                        value={label}
                        className="
              relative cursor-pointer select-none rounded
              px-4 py-2 text-sm
              hover:bg-[#2C305F]/10
              focus:bg-[#2C305F]/20 focus:outline-none
            "
                      >
                        <Select.ItemText>
                          <span className="text-sm xl:text-lg font-semibold text-[#2C305F]">
                            {label}
                          </span>
                        </Select.ItemText>

                        <Select.ItemIndicator className="absolute right-3 top-1/2 -translate-y-1/2">
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

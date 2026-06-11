"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckIcon } from "@radix-ui/react-icons";
import type { SemesterFilterProps } from "../types";

// Helper format: "2026A" -> "Semester A 2026"
const formatDisplay = (val: string) => `Semester ${val.slice(4)} ${val.slice(0, 4)}`;

export default function HoFFilter({
  semesters,
  onSelect,
  selectedLabel,
}: SemesterFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSelect = (val: string) => {
    onSelect?.(val);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayLabel = selectedLabel ? formatDisplay(selectedLabel) : "Select semester...";

  return (
    <div className="relative inline-block md:mb-4 md:mr-4" ref={containerRef}>
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setIsOpen(!isOpen)}
        className="
          bg-[#DCB968] text-[#2C305F] font-semibold
          pr-8 pl-4 py-2 rounded-md w-52 xl:text-lg 
          appearance-none inline-flex items-center justify-between
          focus:outline-none shadow-md
        "
      >
        <span className="truncate">{displayLabel}</span>
      </motion.button>

      <div
        className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-0 h-0 
        border-l-[6px] border-l-transparent 
        border-r-[6px] border-r-transparent 
        border-t-[6px] border-t-[#2C305F]
        transition-transform duration-200
        ${isOpen ? "rotate-180" : "rotate-0"} 
        `}
      ></div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="
              absolute z-50 mt-2 w-52 md:w-56 
              rounded-md bg-[#DCB968] text-[#2C305F] 
              shadow-xl border border-[#2C305F] overflow-hidden
            "
          >
            <div className="p-1 max-h-60 overflow-y-auto custom-scrollbar">
              {semesters.map((val) => {
                const isActive = selectedLabel === val;
                return (
                  <div
                    key={val}
                    onClick={() => handleSelect(val)}
                    className={`
                      relative cursor-pointer select-none rounded px-4 py-2 text-sm font-semibold 
                      transition-colors
                      hover:bg-[#2C305F]/20
                      ${isActive ? "bg-[#2C305F] text-[#DCB968]" : ""}
                    `}
                  >
                    <span>{formatDisplay(val)}</span>
                    {isActive && (
                      <span className="absolute right-2 top-1/2 -translate-y-1/2">
                        <CheckIcon />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
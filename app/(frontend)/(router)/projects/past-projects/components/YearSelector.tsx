"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckIcon } from "@radix-ui/react-icons";

interface YearSelectorProps {
  years: number[];
  selectedYear: number;
  onSelectYear: (year: number) => void;
}

export default function YearSelector({ years, selectedYear, onSelectYear }: YearSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSelect = (val: number) => {
    onSelectYear(val);
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

  if (years.length === 0) return null;

  return (
    <>
      {/* --- MOBILE VIEW --- */}
      <div className="md:hidden px-20 mb-8 w-full flex justify-center">
        <div className="relative inline-block w-full" ref={containerRef}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsOpen(!isOpen)}
            className="
              bg-[#DCB968] text-[#2C305F] font-black
              pr-8 pl-5 py-3 rounded-xl w-full text-lg 
              appearance-none inline-flex items-center justify-between
              focus:outline-none shadow-md border border-[#c5a65c]
            "
          >
            <span className="truncate">Year {selectedYear}</span>
          </motion.button>

          {/* Mũi tên tam giác (Caret) */}
          <div
            className={`pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 w-0 h-0 
            border-l-[6px] border-l-transparent 
            border-r-[6px] border-r-transparent 
            border-t-[6px] border-t-[#2C305F]
            transition-transform duration-200
            ${isOpen ? "rotate-180" : "rotate-0"} 
            `}
          ></div>

          {/* Menu thả xuống */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="
                  absolute z-50 mt-2 w-full 
                  rounded-xl bg-[#DCB968] text-[#2C305F] 
                  shadow-xl border border-[#2C305F] overflow-hidden
                "
              >
                <div className="p-1 max-h-60 overflow-y-auto custom-scrollbar">
                  {years.map((val) => {
                    const isActive = selectedYear === val;
                    return (
                      <div
                        key={val}
                        onClick={() => handleSelect(val)}
                        className={`
                          relative cursor-pointer select-none rounded-lg px-4 py-3 text-base font-bold 
                          transition-colors
                          hover:bg-[#2C305F]/20
                          ${isActive ? "bg-[#2C305F] text-[#DCB968]" : ""}
                        `}
                      >
                        <span>Year {val}</span>
                        {isActive && (
                          <span className="absolute right-4 top-1/2 -translate-y-1/2">
                            <CheckIcon width={18} height={18} />
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
      </div>

      {/* --- DESKTOP VIEW --- */}
      <div className="hidden md:flex w-full items-center flex-wrap gap-4 mb-4 py-2">
        {years.map((year) => {
          const isActive = selectedYear === year;
          return (
            <button
              key={year}
              onClick={() => onSelectYear(year)}
              className={`text-3xl font-black transition-all duration-300 pr-2 ${
                isActive 
                  ? "text-[#DBB968] scale-110" 
                  : "text-gray-300 hover:text-gray-400"
              }`}
            >
              {year}
            </button>
          );
        })}
        <div className="flex-1 h-[2px] bg-[#EBEBEB] min-w-[100px]" />
      </div>
    </>
  );
}
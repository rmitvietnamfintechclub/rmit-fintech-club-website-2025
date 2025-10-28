"use client";
import * as React from "react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function StackedLabel({
  label,
  measure = false,
}: { label: string; measure?: boolean }) {
  const isHR = label.toUpperCase() === "HUMAN RESOURCES";
  const container = measure ? "flex" : "hidden lg:flex";

  if (isHR) {
    const firstWord = "HUMAN".split("");
    const secondWord = "RESOURCES".split("");

    return (
      <span
        className={`${container} relative h-[38rem] flex-row items-stretch justify-between leading-none uppercase tracking-[0.08em] font-bold md:max-lg:gap-[0.25rem] ${poppins.className}`}
        aria-hidden="true"
      >
        {/* Outer container for HUMAN */}
        <span className="flex flex-col items-center h-full">
          <span className="relative flex flex-col justify-start items-center h-full gap-[0.45rem] md:max-lg:gap-[0.3rem]">
            {/* Actual HUMAN text wrapper */}
            <span className="stacked-word-human flex flex-col items-center bg-[#2C305F] z-[10] pb-3">
              {firstWord.map((ch, i) => (
                <span
                  key={`human-${i}`}
                  className="text-[clamp(1.5rem,0.9vw+0.95rem,2rem)]
                     md:max-lg:text-[clamp(1.05rem,0.45vw+0.9rem,1.25rem)] py-1"
                >
                  {ch}
                </span>
              ))}
            </span>
            {/* Vertical line below HUMAN */}
            <span className="absolute left-1/2 -translate-x-1/2 w-px h-full bg-[#DBB968]" style={{ bottom: 0, top: 'unset' }} />
          </span>
        </span>

        {/* Outer container for RESOURCES */}
        <span className="flex flex-col items-center h-full">
          <span className="relative flex flex-col justify-end items-center h-full gap-[0.45rem] md:max-lg:gap-[0.3rem]">
            {/* Vertical line above RESOURCES */}
            <span className="absolute left-1/2 -translate-x-1/2 w-px h-full bg-[#DBB968]" style={{ top: 0 }} />
            {/* Actual RESOURCES text wrapper */}
            <span className="stacked-word-resources flex flex-col items-center bg-[#2C305F] z-[10] pt-3">
              {secondWord.map((ch, i) => (
                <span
                  key={`resources-${i}`}
                  className="text-[clamp(1.5rem,0.9vw+0.95rem,2rem)]
                     md:max-lg:text-[clamp(1.05rem,0.45vw+0.9rem,1.25rem)] py-1"
                >
                  {ch}
                </span>
              ))}
            </span>
          </span>
        </span>
      </span>
    );
  }

  // Default (single column)
  return (
    <span
      className={`${container} flex-col items-center justify-center
                  gap-[0.35rem] md:max-lg:gap-[0.25rem]
                  leading-none uppercase tracking-[0.08em]
                  font-bold ${poppins.className}`}
      aria-hidden="true"
    >
      {label.split("").map((ch, i) => (
        <span
          key={`${ch}-${i}`}
          className="text-[clamp(1.5rem,0.9vw+0.95rem,2rem)]
                     md:max-lg:text-[clamp(1.05rem,0.45vw+0.9rem,1.25rem)] py-1"
        >
          {ch}
        </span>
      ))}
    </span>
  );
}

// src/components/DeptAccordionItem.tsx
"use client";
import * as React from "react";
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import StackedLabel from "./StackedLabel";
import type { DeptItemBase } from "./types";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const BORDER_CLASS_MAP: Record<string, string> = {
  "bg-[#DBB968]": "border-[#DBB968]",
  "bg-[#2C305F]": "border-[#2C305F]",
};

type Props = {
  value: string;
  label: string;
  color: string;
  isOpen: boolean;
  renderContent?: (item: DeptItemBase) => React.ReactNode;
  content?: React.ReactNode;
};

export default function DeptAccordionItem({
  value,
  label,
  color,
  isOpen,
  renderContent,
  content,
}: Props) {
  const borderClass = BORDER_CLASS_MAP[color] ?? "border-current";

  return (
    <AccordionItem
      value={value}
      className={`
        group border-none w-full lg:w-auto
        lg:flex lg:items-stretch lg:min-w-0
        transition-[flex-basis] ease-[cubic-bezier(0.4,0,0.2,1)]
        duration-[var(--acc-dur)]
        ${isOpen ? "lg:flex-[1_1_var(--acc-open-w)]" : "lg:flex-[0_0_var(--acc-tab-w)]"}
      `}
    >
      <AccordionTrigger
        className={`
          ${color} text-white font-bold select-none
          flex items-center justify-center text-center [&>svg]:hidden
          h-14 px-4
          lg:w-[var(--acc-tab-w)] lg:h-full lg:shrink-0
          no-underline
          hover:no-underline
          shadow-inner
          lg:[box-shadow:inset_-8px_0_6px_-4px_rgba(0,0,0,0.25)]
          [box-shadow:inset_0_8px_6px_-4px_rgba(0,0,0,0.25)]
          group-data-[state=open]:lg:hidden
        `}
      >
        <span className={`lg:hidden tracking-wide text-sm font-semibold uppercase ${poppins.className}`}>
          {label}
        </span>
        <StackedLabel label={label} />
      </AccordionTrigger>

      <AccordionContent
        forceMount
        className={`
          w-full p-4 md:p-8 text-left
          lg:h-full lg:overflow-y-auto lg:overflow-x-hidden
          transition-opacity ease-[cubic-bezier(0.4,0,0.2,1)]
          duration-[var(--acc-dur)]
          border-4 ${borderClass}
          ${isOpen ? "opacity-100" : "opacity-0"}
        `}
      >
        {renderContent ? renderContent({ value, label, color }) : content}
      </AccordionContent>
    </AccordionItem>
  );
}
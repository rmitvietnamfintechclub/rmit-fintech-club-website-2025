"use client";
import React from "react";
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import StackedLabel from "./StackedLabel";
import { AccordionItemProps } from "./DepartmentAccordion";

const BORDER_COLORS: Record<string, string> = {
  "bg-[#DBB968]": "border-[#DBB968]",
  "bg-[#2C305F]": "border-[#2C305F]",
};

export default function DeptAccordionItem({ value, label, color, isOpen, renderContent }: AccordionItemProps & { isOpen: boolean }) {
  const borderClass = BORDER_COLORS[color] ?? "border-current";

  return (
    <AccordionItem
      value={value}
      className={`
        group border-none w-full lg:w-auto
        lg:flex lg:items-stretch lg:min-w-0
        transition-[flex-basis] ease-[cubic-bezier(0.4,0,0.2,1)] duration-[var(--acc-dur)]
        ${isOpen ? "lg:flex-[1_1_var(--acc-open-w)]" : "lg:flex-[0_0_var(--acc-tab-w)]"}
      `}
    >
      <AccordionTrigger
        className={`
          ${color} text-white select-none
          flex items-center justify-center text-center [&>svg]:hidden
          h-16 px-4 lg:w-[var(--acc-tab-w)] lg:h-full lg:shrink-0
          hover:no-underline shadow-inner
          lg:[box-shadow:inset_-8px_0_6px_-4px_rgba(0,0,0,0.25)]
          [box-shadow:inset_0_8px_6px_-4px_rgba(0,0,0,0.25)]
          group-data-[state=open]:lg:hidden
        `}
      >
        {/* Mobile View */}
        <span className="lg:hidden tracking-widest text-sm font-bold uppercase">
          {label}
        </span>
        {/* Desktop View */}
        <StackedLabel label={label} />
      </AccordionTrigger>

      <AccordionContent
        forceMount
        className={`
          w-full h-full bg-white
          transition-opacity ease-[cubic-bezier(0.4,0,0.2,1)] duration-[var(--acc-dur)]
          border-4 ${borderClass}
          ${isOpen ? "opacity-100 visible" : "opacity-0 invisible lg:hidden"}
        `}
      >
        <div className="h-full w-full overflow-y-auto overflow-x-hidden p-6 md:p-8 md:pb-4">
           {renderContent()}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
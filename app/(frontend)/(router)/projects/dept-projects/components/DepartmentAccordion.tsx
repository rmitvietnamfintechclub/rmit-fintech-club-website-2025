"use client";
import React, { useState, CSSProperties } from "react";
import { Accordion } from "@/components/ui/accordion";
import DeptAccordionItem from "./DeptAccordionItem";

export type AccordionItemProps = {
  value: string;
  label: string;
  color: string;
  renderContent: () => React.ReactNode;
};

type Props = {
  items: AccordionItemProps[];
  defaultOpen?: string;
};

const DEFAULT_TAB_WIDTH = 80;
const ANIMATION_DURATION = 300;

export default function DepartmentAccordion({ items, defaultOpen }: Props) {
  const [openItem, setOpenItem] = useState<string | undefined>(defaultOpen ?? items[0]?.value);

  const cssVars = {
    "--acc-dur": `${ANIMATION_DURATION}ms`,
    "--acc-tab-w": `${DEFAULT_TAB_WIDTH}px`,
    "--acc-open-w": `calc(100% - ${(items.length - 1) * DEFAULT_TAB_WIDTH}px)`,
  } as CSSProperties;

  return (
    <Accordion
      type="single"
      collapsible
      value={openItem}
      onValueChange={(v) => setOpenItem(v || undefined)}
      className="flex w-full min-w-0 flex-col lg:flex-row h-auto overflow-hidden shadow-sm"
      style={cssVars}
    >
      {items.map((item) => (
        <DeptAccordionItem
          key={item.value}
          {...item}
          isOpen={openItem === item.value}
        />
      ))}
    </Accordion>
  );
}
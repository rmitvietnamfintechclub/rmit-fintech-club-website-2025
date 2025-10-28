"use client";
import { RefObject } from "react";
import styles from "@/styles/partners.module.css";
import clsx from "clsx";
import { PartnerItem } from "@/app/(frontend)/(router)/(home_page)/components/partners";

interface PartnersCircleProps {
  items: PartnerItem[];
  mobileItems: PartnerItem[];
  activeItemId: number;
  handleClick: (dir: "next" | "prev") => void;
  handleItemSelect: (id: number) => void;
  circleRef: RefObject<(HTMLDivElement | null)[]>;
  animating: boolean;
  isMobile: boolean;
}

export default function PartnersCircle({
  items,
  mobileItems,
  activeItemId,
  handleClick,
  handleItemSelect,
  circleRef,
  animating,
  isMobile,
}: PartnersCircleProps) {
  // --- MOBILE RENDER ---
  if (isMobile) {
    return (
      <div className="relative w-full h-auto mt-10 mb-4 flex flex-row justify-center items-center gap-2 px-4 md:hidden">
        {/* Map over the STATIC initialItems array */}
        {mobileItems.map((item, index) => (
          <div
            key={item.id}
            ref={(el: HTMLDivElement | null) => {
              if (circleRef.current) {
                circleRef.current[index] = el;
              }
            }}
            className={clsx(
              "flex justify-center items-center text-white bg-center bg-no-repeat bg-contain rounded-full transition-all duration-300 ease-in-out",
              item.bg,
              // Check active state based on ID, not index
              item.id === activeItemId
                ? "w-20 h-20"
                : "w-14 h-14 opacity-60", 
              item.id !== activeItemId && !animating && "cursor-pointer"
            )}
            onClick={() => {
              // Call the mobile-specific handler
              if (animating || item.id === activeItemId) return;
              handleItemSelect(item.id);
            }}
          >
            <div
              className="aspect-square w-3/5 bg-contain bg-no-repeat bg-center"
              style={{ backgroundImage: `url(${item.icon})` }}
            ></div>
          </div>
        ))}
      </div>
    );
  }

  // --- DESKTOP RENDER ---
  return (
    <div className="absolute h-[80vh] w-[40vw] border-[0.2vw] border-[#000] rounded-[50%] top-[50%] translate-y-[-52%] left-[-20vw] max-md:hidden">
      {items.map((item, index) => (
        <div
          key={item.id}
          ref={(el: HTMLDivElement | null) => {
            if (circleRef.current) {
              circleRef.current[index] = el;
            }
          }}
          className={clsx(
            styles.circle_item,
            styles[`circle_item_${index + 1}`],
            "flex justify-center items-center text-[3vh] text-white bg-center bg-no-repeat bg-contain",
            item.bg
          )}
          onClick={() => {
            if (animating) return;
            if (index === 2) handleClick("prev");
            else if (index === 4) handleClick("next");
          }}
        >
          <div
            className="aspect-square w-3/5 bg-contain bg-no-repeat bg-center"
            style={{ backgroundImage: `url(${item.icon})` }}
          ></div>
          {[2, 3, 4].includes(index) && (
            <div
              className={`${styles.pattern} h-full w-full absolute top-0 left-0 rounded-[50%] bg-center bg-no-repeat bg-contain`}
              style={{ backgroundImage: `url(/home/pattern.svg)` }}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
}

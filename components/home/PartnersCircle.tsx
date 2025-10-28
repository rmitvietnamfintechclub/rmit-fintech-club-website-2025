"use client";
import { RefObject } from "react";
import styles from "@/styles/partners.module.css";
import clsx from "clsx";
import { PartnerItem } from "@/app/(frontend)/(router)/(home_page)/components/partners";

interface PartnersCircleProps {
  items: PartnerItem[];
  handleClick: (dir: "next" | "prev") => void;
  circleRef: RefObject<(HTMLDivElement | null)[]>;
  animating: boolean;
}

export default function PartnersCircle({
  items,
  handleClick,
  circleRef,
  animating,
}: PartnersCircleProps) {
  return (
    <div className="absolute h-[80vh] w-[40vw] border-[0.2vw] border-[#000] rounded-[50%] top-[50%] translate-y-[-52%] left-[-20vw]">
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
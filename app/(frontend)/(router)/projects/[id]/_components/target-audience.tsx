import React from "react";
import SectionTitle from "./SectionTitle";
import { Audience } from "./types";
import { Icon } from "./icon-map";

// --- Prop Types ---
type TargetAudienceProps = {
  target_audience: Audience[];
};

// --- Main Component ---
export default function TargetAudience({
  target_audience = [],
}: TargetAudienceProps) {
  if (!target_audience || target_audience.length === 0) {
    return null;
  }

  return (
    <section className="py-8 md:py-12">
      <div className="mx-auto px-20">
        <SectionTitle>Target Audience</SectionTitle>

        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          {target_audience.map((item, index) => (
            <div
              key={index}
              className="w-full sm:w-[45%] md:w-[40%] lg:w-[30%] max-w-xs flex flex-col items-center text-center bg-ft-primary-blue-300 rounded-xl shadow-md p-6 transition-transform hover:scale-105 border-t-4 border-[#2C305F]"
            >
              <div className="mb-4 p-3 rounded-full bg-[#DBB968]">
                <div className="flex justify-center items-center w-8 h-8 text-[#2C305F]">
                  <Icon name={item.icon} />
                </div>
              </div>
              <span className="text-lg font-semibold text-[#2C305F]">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
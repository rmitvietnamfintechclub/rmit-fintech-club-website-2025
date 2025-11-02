import React from "react";

export default function HeaderTitle({ text }: { text: string }) {
  return (
    
    <div className="relative inline-block xl:ml-28 lg:ml-16">
      {/* Star behind */}
      <img
        src="/StarVector.svg"
        alt="Star"
        className="absolute -left-8 -top-3 md:-left-16 md:-top-12 w-24 h-24 md:w-44 md:h-44 z-0"
      />
      {/* -translate-x-18 -translate-y-10 */}

      {/* Text container */}
      <div className="relative z-10 flex flex-row leading-none gap-2 md:gap-4 p-2">
        {/* Col with Hall 2025 */}
        <div className="flex flex-col items-end md:gap-2">
          <span className="xl:text-8xl lg:text-7xl text-6xl font-extrabold text-[#2C305F]">Hall</span>
          <span className="xl:text-5xl lg:text-4xl text-3xl font-bold text-[#5E5E92]">2025</span>
        </div>

        {/* Col with OF and FAME */}
        <div className="flex flex-col items-start md:gap-1">
          <span className="xl:text-5xl lg:text-4xl text-3xl font-semibold text-[#2C305F] ">OF</span>
          <span className="xl:text-8xl lg:text-7xl text-6xl font-extrabold text-[#DCB968] mb-2 [filter:drop-shadow(0px_3px_2px_rgba(0,0,0,0.5))]"
          >FAME</span>
        </div>

      </div>
    </div>
  );
}

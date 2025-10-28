import React from "react";

type SectionTitleProps = {
  children: React.ReactNode;
};

export default function SectionTitle({ children }: SectionTitleProps) {
  return (
    <div className="text-center mb-12">
      <h2 className="text-4xl md:text-5xl font-extrabold text-[#2C305F] inline-block relative">
        {children}
        {/* The accent underline is now consistent */}
        <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-[#DBB968] rounded-full"></span>
      </h2>
    </div>
  );
}
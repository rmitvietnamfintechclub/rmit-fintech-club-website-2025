import React from "react";
import SectionTitle from "./SectionTitle"; 

const ScopeItem = ({ number, text }: { number: string; text: string }) => (
  <li className="bg-ft-primary-blue-300 rounded-xl shadow-md p-6 flex items-start gap-4 transition-transform hover:scale-105 border-l-4 border-[#2C305F]">
    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#DBB968] text-[#2C305F] flex items-center justify-center font-bold text-lg">
      {number}
    </div>
    <span className="text-[#2C305F] text-lg font-medium pt-1.5">{text}</span>
  </li>
);

type ScopeProps = {
  scope: string[];
};

export default function Scope({ scope = [] }: ScopeProps) {
  if (!scope || scope.length === 0) {
    return null;
  }

  return (
    <section className="py-8 md:py-12">
      <div className="mx-auto px-20">
        <SectionTitle>Our Scope</SectionTitle>
        <ul className="space-y-6">
          {scope.map((item, index) => (
            <ScopeItem
              key={index}
              number={(index + 1).toString().padStart(2, "0")}
              text={item}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
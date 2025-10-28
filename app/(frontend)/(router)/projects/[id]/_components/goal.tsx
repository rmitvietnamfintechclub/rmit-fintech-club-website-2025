import React from "react";
import SectionTitle from "./SectionTitle";

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5"
  >
    <path
      fillRule="evenodd"
      d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
      clipRule="evenodd"
    />
  </svg>
);

const GoalItem = ({ text }: { text: string }) => (
  <li className="bg-ft-primary-blue-300 rounded-xl shadow-md p-6 flex items-start gap-4 transition-transform hover:scale-105 border-l-4 border-[#2C305F]">
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#DBB968] text-[#2C305F] flex items-center justify-center">
      <CheckIcon />
    </div>
    <span className="text-[#2C305F] text-lg font-medium pt-0.5">{text}</span>
  </li>
);

// The main Goal component
type GoalProps = {
  goals: string[];
};

export default function Goal({ goals = [] }: GoalProps) {
  if (!goals || goals.length === 0) {
    return null;
  }

  const midpoint = Math.ceil(goals.length / 2);
  const firstColumnGoals = goals.slice(0, midpoint);
  const secondColumnGoals = goals.slice(midpoint);

  return (
    <section className="py-8 md:py-12">
      <div className="mx-auto px-20">
        <SectionTitle>Our Goals</SectionTitle>

        <div className="grid md:grid-cols-2 gap-8 mx-auto">
          <ul className="space-y-6">
            {firstColumnGoals.map((goal, index) => (
              <GoalItem key={index} text={goal} />
            ))}
          </ul>

          <ul className="space-y-6">
            {secondColumnGoals.map((goal, index) => (
              <GoalItem key={index} text={goal} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
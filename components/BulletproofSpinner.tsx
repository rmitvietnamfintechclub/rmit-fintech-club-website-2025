import React from "react";

interface BulletproofSpinnerProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export const BulletproofSpinner = ({
  size = 64,
  className = "",
  ...props
}: BulletproofSpinnerProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 50 50"
      xmlns="http://www.w3.org/2000/svg"
      className={`text-[#DBB968] ${className}`}
      {...props}
    >
      {/* Vòng tròn nền (mờ) */}
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        className="opacity-20"
      />
      {/* Vòng tròn xoay */}
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeDasharray="90 150"
        strokeLinecap="round"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 25 25"
          to="360 25 25"
          dur="1s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
};
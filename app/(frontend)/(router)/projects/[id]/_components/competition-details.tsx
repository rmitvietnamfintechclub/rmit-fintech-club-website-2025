import React from "react";
import { CalendarDays, MapPin, Lightbulb, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Prop Types ---
type CompetitionDetailsProps = {
  duration: string;
  platformLocation: string[];
  theme: string;
};

// --- Reusable Detail Card Sub-component ---
const DetailCard = ({
  icon,
  label,
  value,
  highlightColor = "border-[#DBB968]",
  bgColor = "bg-gray-50",
  customBg,
  textColor = "text-[#2C305F]",
  iconBg = "bg-[#DBB968]/20",
  iconColor = "text-[#DBB968]",
  className = "",
}: {
  icon: React.ReactNode;
  label: string;
  value: string | string[];
  highlightColor?: string;
  bgColor?: string;
  customBg?: string;
  textColor?: string;
  iconBg?: string;
  iconColor?: string;
  className?: string;
}) => (
  <div
    className={cn(
      "rounded-xl shadow-md p-6 text-center border-t-4",
      highlightColor,
      bgColor,
      textColor,
      className
    )}
    style={customBg ? { background: customBg } : undefined}
  >
    <div className={cn("mb-3 inline-flex p-3 rounded-full", iconBg, iconColor)}>
      {icon}
    </div>
    <h3 className="text-lg font-semibold mb-2 uppercase tracking-wider opacity-90">
      {label}
    </h3>
    <div className={cn("text-xl font-bold")}>
      {Array.isArray(value) ? (
        <ul className="space-y-1 text-left text-base md:text-lg font-medium">
          {value.map((part, i) => (
            <li key={i} className="flex items-start gap-2">
              <ChevronRight
                className={cn(`w-4 h-4 mt-[6px] flex-shrink-0`, iconColor)}
              />
              <span>{part}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>{value}</p>
      )}
    </div>
  </div>
);

// --- Main Component ---
export default function CompetitionDetails({
  duration,
  platformLocation,
  theme,
}: CompetitionDetailsProps) {
  if (
    !duration &&
    (!platformLocation || platformLocation.length === 0) &&
    !theme
  ) {
    return null;
  }

  return (
    <section className="py-8 md:py-12">
      <div className="mx-auto px-20">
        <div className="flex flex-col gap-6 md:gap-8">
          {/* --- THẺ THEME (Nền tối) --- */}
          <DetailCard
            icon={<Lightbulb className="w-8 h-8" />}
            label="Theme"
            value={theme}
            highlightColor="border-[#DBB968]" // Viền Vàng
            customBg="linear-gradient(to right, #2C305F, #4A407D)"
            textColor="text-white"
            iconBg="bg-white/15" 
            iconColor="text-[#F7D27F]" // Icon vàng sáng
            className="w-full shadow-lg" // Bỏ class "text-white" thừa ở đây
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* --- THẺ DURATION (Nền sáng) --- */}
            <DetailCard
              icon={<CalendarDays className="w-7 h-7" />}
              label="Duration"
              value={duration}
              highlightColor="border-[#2C305F]" // Viền Navy
              bgColor="bg-white"
              textColor="text-[#2C305F]" // Chữ Navy
              iconBg="bg-[#2C305F]/10"
              iconColor="text-[#2C305F]"
            />
            {/* --- THẺ LOCATION (Nền sáng) --- */}
            <DetailCard
              icon={<MapPin className="w-7 h-7" />}
              label="Platform / Location"
              value={platformLocation}
              highlightColor="border-[#DBB968]" // Viền Vàng
              bgColor="bg-white"
              textColor="text-[#2C305F]" // Chữ Navy
              iconBg="bg-[#DBB968]/20"
              iconColor="text-[#DBB968]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
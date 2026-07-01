"use client";

import Image from "next/image";
import { useState, useRef } from "react";

// --- Data Array ---
const mentorData = [
  {
    name: "Assoc. Prof. BINH NGUYEN",
    title: "SENIOR PROGRAM MANAGER OF BLOCKCHAIN ENABLED BUSINESS",
    imageUrl:
      "https://d2uq10394z5icp.cloudfront.net/about_us/mentors/Mentor-BinhNguyen.png",
    social: {
      type: "linkedin",
      href: "http://linkedin.com/in/dr-binh-nguyen-thanh",
    },
    isPriority: true,
  },
  {
    name: "Dr. HUY PHAM",
    title: "SENIOR LECTURER OF FINANCE",
    imageUrl:
      "https://d2uq10394z5icp.cloudfront.net/about_us/mentors/Mentor-HuyPham.png",
    social: {
      type: "email",
      href: "mailto:huy.phamnguyenanh@rmit.edu.vn",
    },
    isPriority: false,
  },
  {
    name: "Dr. HIEU THAI",
    title: "LECTURER OF BLOCKCHAIN ENABLED BUSINESS",
    imageUrl:
      "https://d2uq10394z5icp.cloudfront.net/about_us/mentors/Mentor-HieuThai.png",
    social: {
      type: "linkedin",
      href: "https://www.linkedin.com/in/hieu-thai-0a29b6ab/",
    },
    isPriority: false,
  },
];

// --- Icon Components ---
const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 77 77"
    fill="none"
    className={className}
  >
    <path
      d="M12.8333 19.25C12.8333 17.5482 13.5094 15.9161 14.7127 14.7127C15.9161 13.5094 17.5482 12.8333 19.25 12.8333H57.75C59.4518 12.8333 61.0839 13.5094 62.2872 14.7127C63.4906 15.9161 64.1666 17.5482 64.1666 19.25V57.75C64.1666 59.4518 63.4906 61.0839 62.2872 62.2872C61.0839 63.4906 59.4518 64.1666 57.75 64.1666H19.25C17.5482 64.1666 15.9161 63.4906 14.7127 62.2872C13.5094 61.0839 12.8333 59.4518 12.8333 57.75V19.25Z"
      stroke="#2C305F"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M25.6667 35.2917V51.3334"
      stroke="#2C305F"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M25.6667 25.6667V25.6992"
      stroke="#2C305F"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M38.5 51.3334V35.2917"
      stroke="#2C305F"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M51.3333 51.3334V41.7084C51.3333 40.0065 50.6573 38.3744 49.4539 37.1711C48.2506 35.9677 46.6185 35.2917 44.9167 35.2917C43.2149 35.2917 41.5828 35.9677 40.3794 37.1711C39.176 38.3744 38.5 40.0065 38.5 41.7084"
      stroke="#2C305F"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const OutlookIcon = ({ className }: { className?: string }) => (
  <div
    className={`p-[0.3rem] border-[2px] border-[#2C305F] rounded-md ${className}`}
  >
    <Image
      src="/outlook.svg"
      alt="Outlook"
      width={35}
      height={35}
      loading="lazy"
      className="w-full h-full object-contain"
    />
  </div>
);

// --- Mentor Card Component ---
type MentorCardProps = (typeof mentorData)[0];

const MentorCard = ({
  name,
  title,
  imageUrl,
  social,
  isPriority,
}: MentorCardProps) => {
  return (
    <div className="flex flex-col items-center w-full h-full max-w-[280px] md:max-w-[21rem] mx-auto">
      <div className="font-bold text-xl md:text-2xl text-[#2C305F] text-center md:mb-4 px-2 h-14 flex items-center justify-center shrink-0">
        <span>{name}</span>
      </div>
      {/* Image Container */}
      <div className="w-full aspect-square relative object-cover overflow-hidden rounded-[40px] md:rounded-[50px] border-[#2C305F] border-4 md:border-5 shrink-0">
        <Image
          src={imageUrl}
          alt={`Mentor ${name}`}
          className="object-cover"
          fill
          sizes="(max-width: 768px) 280px, 320px"
          priority={isPriority}
        />
      </div>
      <div className="relative w-full mt-4 md:mt-6">
        {/* Info Box */}
        <div className="relative z-0 rounded-[30px] md:rounded-[50px] w-full min-h-[80px] md:min-h-[100px] bg-[#DBB968] flex justify-between items-center px-4 py-3 md:px-6 md:py-4 shadow-sm">
          <div className="flex-1 text-center text-xs md:text-sm font-medium text-[#2C305F] mr-2 md:mr-4 leading-tight">
            {title}
          </div>

          {/* Social Icon */}
          <div className="flex-shrink-0">
            <a
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block transition duration-300 transform hover:scale-110 hover:brightness-150 hover:drop-shadow-[0_0_6px_#FFEFCA]"
            >
              {social.type === "linkedin" && (
                <LinkedInIcon className="w-[50px] h-[50px] md:w-[65px] md:h-[65px]" />
              )}
              {social.type === "email" && (
                <OutlookIcon className="w-[50px] h-[50px]" />
              )}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---
export const ClubMentors = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollPosition = scrollRef.current.scrollLeft;
    const width = scrollRef.current.clientWidth;
    const index = Math.round(scrollPosition / width);
    setActiveIndex(index);
  };

  const scrollTo = (index: number) => {
    if (!scrollRef.current) return;
    const width = scrollRef.current.clientWidth;
    scrollRef.current.scrollTo({
      left: width * index,
      behavior: "smooth",
    });
  };

  return (
    <div className="px-4 md:px-20">
      <div className="container mx-auto">
        <div className="text-center pt-6 md:pt-12 font-sans font-extrabold text-3xl md:text-6xl text-[#2C305F]">
          OUR CLUB <span className="text-[#DBB968]"> MENTORS</span>
        </div>

        {/* - Mobile: Flex ngang, ẩn thanh cuộn, tự động snap vào giữa (snap-mandatory)
          - Desktop: Flex wrap, dàn đều (justify-between)
        */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex md:grid md:grid-cols-3 items-stretch gap-10 md:gap-8 lg:gap-12 pt-4 md:pt-8 overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-4"
        >
          {mentorData.map((mentor) => (
            <div
              key={mentor.name}
              className="w-full flex-shrink-0 snap-center md:w-auto md:flex-shrink"
            >
              <MentorCard {...mentor} />
            </div>
          ))}
        </div>

        {/* Pagination Dots (Chỉ hiển thị trên Mobile) */}
        <div className="flex justify-center items-center gap-2 mt-4 md:hidden">
          {mentorData.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                activeIndex === index
                  ? "w-6 bg-[#DBB968]"
                  : "w-2.5 bg-[#2C305F]/50"
              }`}
              aria-label={`Go to mentor ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

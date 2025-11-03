"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "@heroui/react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// =================================================================
// 1. DATA & TYPES (Moved outside component for scalability)
// =================================================================
type DepartmentId = "Technology" | "Business" | "Marketing" | "HumanResources";

type DepartmentInfo = {
  id: DepartmentId; // Use ID for key prop
  name: string;
  button: string;
  description: string;
  background: string;
};

// Data object is now easier to manage here
const departments: Record<DepartmentId, DepartmentInfo> = {
  Technology: {
    id: "Technology",
    name: "TECHNOLOGY DEPARTMENT",
    button: "Technology",
    description:
      "The Technology Department is an innovation hub for tech enthusiasts, fostering both technical expertise and cutting-edge Fintech innovation through development sprints, collaborative workshops, and industry partnerships. This semester, we’re working on three exciting projects: a blockchain-powered History Chess Game blending strategy with Vietnamese history, a peer-to-peer learning hub for mastering foundational Data Structures and Algorithms, and an immersive bootcamp where members learn web development fundamentals.",
    background:
      "https://d2uq10394z5icp.cloudfront.net/home/department-mascot/Technology_Mascot.png",
  },
  Business: {
    id: "Business",
    name: "BUSINESS DEPARTMENT",
    button: "Business",
    description:
      "The Business Department is a dynamic space for curious minds to grow through peer-to-peer learning, hands-on projects, and industry connections, fostering academic excellence and real-world Fintech experience. This semester, members are gaining a professional edge by diving into investment fundamentals with FPT Securities in the Breaking the Curve Workshop, mastering market-aware content creation by producing the bi-weekly FinTech Spotlight series, and thinking like analysts in our new CFA Learning Hub.",
    background:
      "https://d2uq10394z5icp.cloudfront.net/home/department-mascot/Business_Mascot.png",
  },
  Marketing: {
    id: "Marketing",
    name: "MARKETING DEPARTMENT",
    button: "Marketing",
    description:
      "The Marketing Department is a creative hub for orchestrating campaigns and internal skill trainings, fostering both marketing expertise and an engaged Fintech community. This semester, we are elevating our brand's voice by producing a cinematic Short Film, an original FTC Music Video, and a story-driven Photoshoot Series. Members will master the full content lifecycle — from strategy and trend-spotting for our TikTok and Instagram platforms to professional production and digital analytics — all while building a vibrant online community and a professional creative portfolio.",
    background:
      "https://d2uq10394z5icp.cloudfront.net/home/department-mascot/Marketing_Mascot.png",
  },
  HumanResources: {
    id: "HumanResources",
    name: "HUMAN RESOURCES DEPARTMENT",
    button: "Human Resources",
    description:
      "The Human Resources Department plays a pivotal role in shaping the FinTech Club’s culture, managing all internal bonding projects, and fostering a welcoming and supportive home for every member. This semester, we're building community by organizing our high-energy FinTech Olympic sports event, hosting the annual Secret Santa celebration, and exploring the potential for an unforgettable End of Semester Trip.",
    background:
      "https://d2uq10394z5icp.cloudfront.net/home/department-mascot/HR_Mascot.png",
  },
};

// Get keys for mapping
const deptKeys = Object.keys(departments) as DepartmentId[];

// =================================================================
// 2. CHILD COMPONENT (For Clean Code & Reusability)
// =================================================================
interface DepartmentButtonProps {
  deptInfo: DepartmentInfo;
  isActive: boolean;
  onClick: () => void;
}

/**
 * A self-contained button that handles its own active/inactive styling.
 */
const DepartmentButton: React.FC<DepartmentButtonProps> = ({
  deptInfo,
  isActive,
  onClick,
}) => {
  const gradientStyle = isActive
    ? "linear-gradient(to bottom, #C9D6EA, #DBB968)"
    : "linear-gradient(to bottom, #F0EDFF, #5E5E92)";

  const buttonClass = isActive
    ? "[background:linear-gradient(to_bottom,_#C9D6EA_0%,_#DBB968_58%)]" // Active style
    : "bg-[#F0EDFF] group-hover:[background:linear-gradient(to_bottom,_#C9D6EA_0%,_#DBB968_58%)]"; // Inactive style

  return (
    <div
      className="group p-[1px] rounded-[10px]"
      style={{ background: gradientStyle }}
    >
      <button
        type="button"
        onClick={onClick}
        className={`w-full h-16 rounded-[10px] text-[#0B0B3B] text-wrap font-semibold text-sm transition-all duration-200
                   md:w-[6.7rem] md:h-[4rem] md:text-[0.85rem] ${buttonClass}`}
      >
        {deptInfo.button.toUpperCase()}
      </button>
    </div>
  );
};

// =================================================================
// 3. MAIN COMPONENT (Now cleaner and focused on layout)
// =================================================================
const Department = () => {
  const [activeDepartment, setActiveDepartment] = useState<DepartmentInfo>(
    departments.Technology
  );

  return (
    <div className="relative w-full h-fit flex flex-col md:h-[50rem] md:flex-row">
      {/* --- DECORATIONS (Intact) --- */}
      <div className="absolute w-[14rem] h-auto right-3 -top-[13rem] z-30 hidden md:block">
        <Image
          src="/Department_Decoration.svg"
          alt="Department Decoration"
          width={400}
          height={400}
          loading="lazy"
        />
      </div>
      <div className="absolute md:w-[14rem] max-md:w-[10rem] h-auto top-[-4rem] md:left-[-5.25rem] max-md:left-[-4rem] md:rotate-[109deg] max-md:rotate-[120deg] z-30">
        <Image
          src="https://d2uq10394z5icp.cloudfront.net/global/Mascot+-+M%E1%BA%B7t+tr%C6%B0%E1%BB%9Bc.svg"
          alt="Bear mascot"
          width={400}
          height={400}
          loading="lazy"
        />
      </div>
      <div className="absolute w-[10rem] h-auto top-[-4rem] right-[-4rem] -rotate-[120deg] z-30 block md:hidden">
        <Image
          src="https://d2uq10394z5icp.cloudfront.net/global/Mascot+-+M%E1%BA%B7t+tr%C6%B0%E1%BB%9Bc.svg"
          alt="Bear mascot"
          width={400}
          height={400}
          loading="lazy"
        />
      </div>

      {/* --- DESKTOP IMAGE SECTION (Intact) --- */}
      <div className="relative hidden md:block order-2 w-[30vw] h-full p-0 bg-transparent">
        {/* Desktop-only decorative blue/gradient BG */}
        <div
          className="h-full w-[29vw] rounded-br-[18vw] relative z-0 hidden md:block"
          style={{ background: "linear-gradient(to bottom, #C9D6EA, #DBB968)" }}
        >
          <div className="h-[49rem] w-[27.5vw] bg-[#2C305F] rounded-br-[17vw] absolute top-0 left-0 z-10"></div>
        </div>

        {/* Image Container */}
        <div
          className="hidden md:block absolute z-20 w-[35.5vw] h-[42rem] bottom-0 right-[14.5rem] rounded-t-[10vw]"
          style={{ background: "linear-gradient(to bottom, #C9D6EA, #DBB968)" }}
        >
          {/* Inner Image Wrapper */}
          <div className="w-full h-full p-2 md:p-0 md:h-[40rem] md:w-[33vw] md:absolute md:m-[1rem] md:z-20">
            <Image
              src={activeDepartment.background} // State-driven
              alt={`${activeDepartment.name} background`}
              className="h-full w-full object-cover rounded-t-2xl md:object-fill md:rounded-t-[9vw]"
              width={400}
              height={400}
              fetchPriority="high"
              loading="eager"
              priority={true}
            />
          </div>
        </div>
      </div>

      {/* --- CONTENT SECTION (Intact Layout, Cleaner Code) --- */}
      <div
        className="w-full h-auto bg-[#F9FAFB] border-b-[0.5rem] border-[#DAB868] order-2
                   md:w-[70vw] md:h-full md:border-b-[1rem] md:order-1"
      >
        <section
          className="relative flex flex-col items-center w-full max-w-xl px-4 pb-8
                     md:h-full md:items-start md:justify-between md:pl-20 md:pr-0 md:pt-[8.5rem] md:max-w-[45vw] md:mx-0"
        >
          {/* Decorative Stars (Intact) */}
          <div className="absolute w-[3rem] h-auto top-[4.5rem] right-[7rem] hidden md:block">
            <Image
              src="https://d2uq10394z5icp.cloudfront.net/home/assets/YellowStar.svg"
              alt="Yellow Star"
              width={400}
              height={400}
              loading="lazy"
            />
          </div>
          <div className="absolute w-[6rem] h-auto top-[6rem] right-[-1rem] hidden md:block">
            <Image
              src="https://d2uq10394z5icp.cloudfront.net/home/assets/YellowStar.svg"
              alt="Yellow Star"
              width={400}
              height={400}
              loading="lazy"
            />
          </div>

          {/* Title */}
          <p
            className="md:text-[#DCB968] max-md:text-[#2c305f] max-md:pt-10 max-md:drop-shadow-[0_4px_4px_rgb(255,204,102,0.6)] font-bold text-[1.875rem] text-center
                         md:text-6xl md:text-left"
          >
            BE ONE OF US
          </p>

          {/* Department Buttons (Mobile) - Now clean */}
          <div className="md:hidden mt-6 grid grid-cols-2 gap-3 w-full max-w-sm mx-auto">
            {deptKeys.map((key) => (
              <DepartmentButton
                key={key}
                deptInfo={departments[key]}
                isActive={activeDepartment.id === key}
                onClick={() => setActiveDepartment(departments[key])}
              />
            ))}
          </div>

          {/* Department Name */}
          <p
            className={`font-bold md:mt-0 mt-6 text-[#5E5E92] text-wrap md:text-5xl text-2xl md:leading-tight md:text-start text-center`}
          >
            {activeDepartment.name}
          </p>

          {/* Department Description */}
          <p className="max-md:mt-4 text-base text-justify max-md:text-justify font-normal md:pr-6">
            {activeDepartment.description}
          </p>

          {/* Explore Button */}
          <Button className="text-[#F0EDFF] bg-[#5E5E92] rounded-xl w-fit px-6 py-2 max-md:mt-4 font-semibold drop-shadow-lg text-[1rem]">
            Explore more
          </Button>

          {/* Bottom Content Block (Desktop Buttons) - Now clean */}
          <div className="hidden md:flex md:flex-row md:flex-wrap md:gap-3 md:w-auto md:max-w-none">
            {deptKeys.map((key) => (
              <DepartmentButton
                key={key}
                deptInfo={departments[key]}
                isActive={activeDepartment.id === key}
                onClick={() => setActiveDepartment(departments[key])}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Department;

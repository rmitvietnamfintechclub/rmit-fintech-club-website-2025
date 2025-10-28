"use client";
import { useEffect, useState } from "react";
import Countdown from "../components/Countdown";
import NavigationButton from "../components/NavigationButton";
import Image from "next/image";

export default function CountdownPage() {
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [isShortHeight, setIsShortHeight] = useState(false);

  useEffect(() => {
    const navbar = document.querySelector("nav");
    if (navbar) {
      setNavbarHeight(navbar.offsetHeight);
    }

    const handleResize = () => {
      if (navbar) {
        setNavbarHeight(navbar.offsetHeight);
      }
      setIsShortHeight(window.innerHeight < 900);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    // Container for the whole section
    <div className="flex flex-col">
      {/* Hero Section with Yellow background */}
      <div
        className="relative flex flex-col items-center justify-center rounded-b-[80px]"
        style={{
          minHeight: `calc(90vh - ${navbarHeight}px)`,
          backgroundColor: "#DBB968",
          backgroundImage: "url('/joinUsPage/background-pattern.svg')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1
          className={`text-4xl md:text-5xl lg:text-6xl font-bold text-center text-[white] z-10 ${
            isShortHeight ? "mt-8" : ""
          }`}
        >
          COUNT DOWN TO FORM CLOSED
        </h1>
        <div className={`${isShortHeight ? "mb-8" : ""}`}>
          <Countdown date={new Date("2025-10-31T23:59:00")} />
        </div>

        {/*  change svg here nhe  */}
        <Image
          src="/joinUsPage/white-star.svg"
          alt="Big White Star"
          height={100}
          width={100}
          loading="lazy"
          className="absolute left-[1.5rem] translate-y-4 md:block hidden z-0"
        />
        <Image
          src="/joinUsPage/white-star.svg"
          alt="Big White Star"
          height={50}
          width={50}
          loading="lazy"
          className="absolute right-[3rem] translate-y-24 md:block hidden z-0"
        />
      </div>
      {/* Navigation Tabs section: scroll to the corresponding section with IDs */}
      <div className="flex flex-row self-center w-full md:w-2/3 lg:w-2/3">
        <NavigationButton text="MEMBER BENEFITS" link="#member-benefits" />
        <NavigationButton
          text="RECRUITMENT PROCESS"
          link="#recruitment-process"
        />
        <NavigationButton text="JOIN NOW!" link="#join-now" />
      </div>
    </div>
  );
}

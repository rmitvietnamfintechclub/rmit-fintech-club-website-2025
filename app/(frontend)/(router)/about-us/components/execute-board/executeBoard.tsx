import { Card, CardBody, CardHeader } from "@heroui/react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import "./styles.css"; // Assuming this contains base styles
import Link from "next/link";
import { IconBrandLinkedin } from "@tabler/icons-react";
import { motion, useInView } from "framer-motion";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import useMediaQuery from "./useMediaQuery"; 

// --- Type Definition ---
type ExecutiveBoardMember = {
  photo_url: string;
  name: string;
  position: string;
  linkedin_url: string;
};

// --- Reusable UI Components ---
const DecorativeCircles = () => (
  // ... (This component remains unchanged)
  <>
    <div className="absolute top-[4.3rem] right-[1.8rem] w-[4rem] h-[4rem] bg-[#C9D6EA] rounded-full hidden md:block"></div>
    <div className="absolute top-[11rem] right-[5rem] w-[2.5rem] h-[2.5rem] bg-[#DBB968] rounded-full hidden md:block"></div>
    <div className="absolute bottom-[-1rem] right-[-2.4rem] w-[6rem] h-[6rem] bg-[#DBB968] rounded-full z-20 hidden md:block"></div>
    <div className="absolute bottom-[-2rem] right-[1.8rem] w-[3.7rem] h-[3.7rem] bg-[#2C305F] rounded-full z-10 hidden md:block"></div>
    <div className="absolute bottom-[-6rem] left-[1rem] w-[8rem] h-[8rem] bg-[#2C305F] rounded-full z-10 hidden md:block"></div>
    <div className="absolute bottom-[2rem] left-[8.5rem] w-[2.8rem] h-[2.8rem] bg-[#C9D6EA] rounded-full z-10 hidden md:block"></div>
    <div className="absolute bottom-[-1.8rem] left-[12rem] w-[4.3rem] h-[4.3rem] bg-[#DBB968] rounded-full z-10 hidden md:block"></div>
    <div className="absolute bottom-[5rem] left-[15rem] w-[2rem] h-[2rem] bg-[#DBB968] rounded-full z-10 hidden md:block"></div>
    <div className="absolute bottom-[1rem] left-[21rem] w-[1.6rem] h-[1.6rem] bg-[#C9D6EA] rounded-full z-10 hidden md:block"></div>
  </>
);

const PageHeader = () => (
  // ... (This component remains unchanged)
  <div className="content grid">
    <h2 className="leading-tight text-[#5E5E92] text-3xl md:text-4xl font-bold">
      Meet Our
    </h2>
    <h1 className="leading-tight text-[#2C305F] text-5xl md:text-7xl font-bold">
      Executive Board
    </h1>
    <p className="leading-8 w-full text-[#000000] text-base md:text-lg mt-2">
      Meet the fierce, brilliant, and passionate minds behind the FinTech Club
      machine!
    </p>
  </div>
);

// 👇 ================== [ MODIFIED COMPONENT ] ================== 👇

function ExecutiveBoardCard({
  photo_url,
  name,
  position,
  linkedin_url,
  index,
}: ExecutiveBoardMember & { index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  // Tailwind's `md` breakpoint is 768px
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Priority-load the first row of images (4) for best LCP
  const isPriority = index < 4;

  // Define variants for animation
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20, // Start all cards slightly down for a slide-up effect
    },
    visible: {
      opacity: 1,
      // Apply "bobbing" Y only on desktop, otherwise just slide to y: 0
      y: isDesktop ? (index % 2 === 0 ? -25 : 25) : 0,
      transition: {
        duration: isDesktop ? 1 : 0.7, // Faster animation on mobile
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      // No custom prop needed here as `isDesktop` is in scope
    >
      <Card className="relative mt-[1.5rem] rounded-2xl border-[4px] border-[#F7D27F] border-solid overflow-hidden">
        <CardHeader className="pb-0 pt-0 max-md:h-72 md:h-56">
          <div className="z-0">
            <Image
              alt={`${name} profile`}
              src={photo_url}
              className="object-cover w-full h-full translate-y-[13%]"
              width={400}
              height={400}
              fetchPriority={isPriority ? "high" : "auto"}
              loading={isPriority ? "eager" : "lazy"}
              priority={isPriority}
            />
          </div>
        </CardHeader>
        <CardBody className="relative z-10 overflow-visible pb-2 max-md:px-5 md:pl-3 md:pr-2 pt-4 bg-[#F7D27F] rounded-t-3xl">
          <div className="flex justify-between items-start space-x-2">
            <div className="flex-1">
              <h6 className="leading-6 font-semibold text-xl md:text-[0.9rem] text-[#2C305F]">
                {name}
              </h6>
              <p className="leading-5 text-[#2C305F] text-base max-md:mt-2 md:text-[0.8rem]">
                {position}
              </p>
            </div>
            {linkedin_url && linkedin_url.trim() ? (
              <Link
                href={linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                title="Visit LinkedIn"
                className="flex-shrink-0 my-auto"
              >
                <IconBrandLinkedin
                  size={40}
                  color="#2C305F"
                  strokeWidth={0.8}
                  className="max-md:w-14 h-auto transition duration-300 transform hover:scale-110 hover:brightness-150 hover:drop-shadow-[0_0_6px_#2C305F]"
                />
              </Link>
            ) : (
              <div className="flex-shrink-0 my-auto" title="LinkedIn not available">
                <IconBrandLinkedin
                  size={40}
                  color="#9CA3AF"
                  strokeWidth={0.8}
                  className="opacity-50 cursor-not-allowed"
                />
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}

// 👆 ================== [ END OF MODIFICATIONS ] ================== 👆

// --- Main Component ---

const ExecutiveBoard = () => {
  // ... (This component logic remains unchanged)
  const [members, setMembers] = useState<ExecutiveBoardMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchExecutiveBoard = async () => {
      try {
        const response = await axios.get("/api/v1/executivemembers");
        if (response.data.status === 200 && response.data.members) {
          setMembers(response.data.members);
        } else {
          setError(
            response.data.message ||
              "Failed to load executive board data. Please try again later."
          );
        }
      } catch (err: any) {
        console.error("Error fetching executive board: ", err);
        if (err.response?.status === 404) {
          setError("Executive board API not found");
        } else if (err.code === "ERR_NETWORK") {
          setError("Network error. Please check your connection.");
        } else {
          setError("Failed to load executive board data.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchExecutiveBoard();
  }, []);

  if (loading) {
    return (
      <section className="relative px-6 md:px-20 max-md:pt-16 max-md:pb-12 md:py-24 min-h-screen">
        <DecorativeCircles />
        <main>
          <PageHeader />
          <div className="p-8 text-center flex flex-col items-center justify-center h-64">
            <CircularProgress sx={{ color: "#DCB968" }} />
            <p className="mt-4 text-lg md:text-xl text-[#5E5E92]">
              Loading Executive Board
            </p>
          </div>
        </main>
      </section>
    );
  }

  return (
    <section className="relative max-md:pt-16 max-md:pb-12 md:py-24 px-6 md:px-20">
      <DecorativeCircles />
      <main>
        <PageHeader />

        {/* Display error message if any */}
        {error && (
          <div className="relative w-full max-w-4xl h-48 mx-auto my-10 md:h-64 p-[4px] rounded-lg bg-gradient-to-b from-[#DCB968] to-[#F7D27F]">
            <div className="flex flex-col items-center justify-center w-full h-full bg-[#F9FAFB] rounded-[7px] text-center px-4">
              <p className="text-5xl font-bold mb-4">⚠️</p>
              <p className="text-[#2C305F] text-lg md:text-xl">{error}</p>
            </div>
          </div>
        )}

        {/* Responsive Grid for Members */}
        <div className="max-md:py-4 md:pt-12 md:pb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {members.map((item, index) => (
            <ExecutiveBoardCard key={index} {...item} index={index} />
          ))}
        </div>
      </main>
    </section>
  );
};

export default ExecutiveBoard;
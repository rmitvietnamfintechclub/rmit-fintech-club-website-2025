import { Card, CardBody, CardHeader } from "@heroui/react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { IconBrandLinkedin } from "@tabler/icons-react";
import { motion, useInView } from "framer-motion";
import "./styles.css"; 
import Link from "next/link";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import useMediaQuery from "./useMediaQuery";

// --- Type Definition ---
type ManagementBoardMember = {
  photo_url: string;
  name: string;
  position: string;
  linkedin_url: string;
};

// --- Reusable UI Components ---

/**
 * 🎨 Renders the decorative mascot and circles.
 * Hidden on mobile (max-md) for a cleaner UI.
 */
const DecorativeElements = () => (
  <>
    <Image
      src="https://d2uq10394z5icp.cloudfront.net/global/Mascot+-+M%E1%BA%B7t+b%C3%AAn.svg"
      alt="Bear mascot"
      className="absolute left-[-8rem] top-[-1rem] rotate-[35deg] scale-x-[-1] z-30 hidden md:block"
      width={380}
      height={380}
      loading="lazy"
    />
    <div className="absolute bottom-[-2rem] right-[8rem] w-[7rem] h-[7rem] bg-[#C9D6EA] rounded-full z-20 hidden md:block"></div>
    <div className="absolute bottom-[-2rem] right-[13rem] w-[3.7rem] h-[3.7rem] bg-[#DBB968] rounded-full z-10 hidden md:block"></div>
    <div className="absolute bottom-[0.5rem] right-[16rem] w-[3.7rem] h-[3.7rem] bg-[#2C305F] rounded-full z-10 hidden md:block"></div>
    <div className="absolute bottom-[0.2rem] right-[21rem] w-[1.8rem] h-[1.8rem] bg-[#2C305F] rounded-full z-10 hidden md:block"></div>
    <div className="absolute bottom-[4.8rem] right-[15rem] w-[1.3rem] h-[1.3rem] bg-[#C9D6EA] rounded-full z-10 hidden md:block"></div>
    <div className="absolute bottom-[3rem] right-[5.5rem] w-[1.3rem] h-[1.3rem] bg-[#C9D6EA] rounded-full z-10 hidden md:block"></div>
    <div className="absolute bottom-[3rem] right-[2.4rem] w-[4rem] h-[4rem] bg-[#2C305F] rounded-full z-10 hidden md:block"></div>
  </>
);

/**
 * 📄 Renders the responsive page header (text-aligned right).
 */
const PageHeader = () => (
  <div className="content grid text-right">
    <h2 className="leading-tight text-[#5E5E92] !text-[1.75rem] md:text-4xl font-bold">
      Meet Our
    </h2>
    <h1 className="leading-tight text-[#DCB968] !text-[2.05rem] md:text-7xl font-bold">
      Management Board
    </h1>
    <p className="leading-8 w-full text-[#000000] text-[0.95rem] md:text-lg mt-2">
      Meet the talented representatives behind the four pillars of RMIT Vietnam
      FinTech Club!
    </p>
  </div>
);

/**
 * 🧑‍ Renders a single, animated management board member card.
 */
function ManagementBoardCard({
  photo_url,
  name,
  position,
  linkedin_url,
  index,
}: ManagementBoardMember & { index: number }) {
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
      y: isDesktop ? (index % 2 === 0 ? 25 : -25) : 0,
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
    >
      <Card className="relative mt-[1.5rem] rounded-2xl border-[4px] border-[#F7D27F] border-solid overflow-hidden">
        {/* Responsive card height */}
        <CardHeader className="pb-0 pt-0 h-72 md:h-56">
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
        {/* Responsive padding and text */}
        <CardBody className="relative z-10 overflow-visible pb-2 max-md:px-6 md:pl-3 md:pr-2 pt-4 bg-[#F7D27F] rounded-t-3xl">
          <div className="flex justify-between items-start space-x-2">
            <div className="flex-1">
              {/* Responsive text sizes */}
              <h6 className="leading-6 font-semibold text-xl md:text-[0.9rem] text-[#2C305F]">
                {name}
              </h6>
              <p className="leading-5 text-[#2C305F] text-base md:text-[0.8rem] max-md:mt-2">
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
                  color="#2C305F"
                  strokeWidth={0.8}
                  className="w-10 h-10 md:w-10 md:h-10 transition duration-300 transform hover:scale-110 hover:brightness-150 hover:drop-shadow-[0_0_6px_#2C305F]"
                />
              </Link>
            ) : (
              <div className="flex-shrink-0 my-auto" title="LinkedIn not available">
                <IconBrandLinkedin
                  color="#9CA3AF"
                  strokeWidth={0.8}
                  className="w-10 h-10 md:w-10 md:h-10 opacity-50 cursor-not-allowed"
                />
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}

// --- Main Component ---

const ManagementBoard = () => {
  const [members, setMembers] = useState<ManagementBoardMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Fetch data on component mount
  useEffect(() => {
    const fetchManagementBoard = async () => {
      try {
        // Updated API endpoint
        const response = await axios.get("/api/v1/managementBoard");

        if (response.data.status === 200 && response.data.members) {
          setMembers(response.data.members);
        } else {
          setError(
            response.data.message ||
              "Failed to load management board data. Please try again later."
          );
        }
      } catch (err: any) {
        console.error("Error fetching management board: ", err);

        // Updated error messages
        if (err.response?.status === 404) {
          setError("Management board API not found");
        } else if (err.code === "ERR_NETWORK") {
          setError("Network error. Please check your connection.");
        } else {
          setError("Failed to load management board data.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchManagementBoard();
  }, []);

  // Loading state
  if (loading) {
    return (
      <section className="relative max-md:pb-16 md:py-24 min-h-screen px-6 md:px-20">
        <DecorativeElements />
        {/* Responsive padding */}
        <main className="mx-6 md:mx-16 2xl:mx-[10rem]">
          <PageHeader />
          <div className="p-8 text-center flex flex-col items-center justify-center h-64">
            <CircularProgress sx={{ color: "#DCB968" }} />
            <p className="mt-4 text-lg md:text-xl text-[#5E5E92]">
              Loading Management Board
            </p>
          </div>
        </main>
      </section>
    );
  }

  return (
    <section className="relative max-md:pb-16 md:py-24 px-6 md:px-20">
      <DecorativeElements />
      {/* Responsive padding */}
      <main>
        <PageHeader />

        {/* Display error message */}
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
            <ManagementBoardCard key={index} {...item} index={index} />
          ))}
        </div>
      </main>
    </section>
  );
};

export default ManagementBoard;
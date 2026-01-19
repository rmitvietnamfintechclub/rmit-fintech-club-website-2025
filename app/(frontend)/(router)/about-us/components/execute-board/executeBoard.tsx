import { Card, CardBody, CardHeader } from "@heroui/react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { IconBrandLinkedin } from "@tabler/icons-react";
import { motion, useInView } from "framer-motion";
import axios from "axios";
import useMediaQuery from "./useMediaQuery";

// --- Type Definition ---
type ExecutiveBoardMember = {
  photo_url: string;
  name: string;
  position: string;
  linkedin_url: string;
};

// --- Reusable UI Components (Giữ nguyên) ---
const DecorativeCircles = () => (
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
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const isPriority = index < 4;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: isDesktop ? (index % 2 === 0 ? -25 : 25) : 0,
      transition: {
        duration: isDesktop ? 1 : 0.7,
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
      className="h-full"
    >
      <Card
        className="
          relative overflow-hidden w-full h-full
          rounded-xl border-0 shadow-sm mt-0
          md:rounded-2xl md:border-[4px] md:border-[#F7D27F] md:border-solid
        "
      >
        {/* === MOBILE LAYOUT (PREMIUM STYLE) === */}
        <div className="md:hidden relative w-full h-56">
          <Image
            alt={`${name} profile`}
            src={photo_url}
            className="object-cover w-full h-full"
            width={300}
            height={400}
            fetchPriority={isPriority ? "high" : "auto"}
            loading={isPriority ? "eager" : "lazy"}
          />
          
          {/* Gradient Overlay */}
          <div
            className="absolute inset-0 z-10"
            style={{
              background:
                "linear-gradient(to top, rgba(44, 48, 95, 0.95) 0%, rgba(44, 48, 95, 0.6) 35%, transparent 100%)",
            }}
          />

          {/* Text Content Mobile - Cân chỉnh lại font size cho thẻ nhỏ */}
          <div className="absolute bottom-0 left-0 w-full p-2.5 z-20 flex flex-col justify-end">
            <h6 className="font-bold text-white text-[0.85rem] leading-tight line-clamp-2 drop-shadow-sm">
              {name}
            </h6>
            <div className="h-0.5 w-5 bg-[#DBB968] my-1"></div>
            <p className="text-[#F7D27F] text-[0.65rem] font-medium leading-tight line-clamp-2">
              {position}
            </p>
          </div>

          {/* LinkedIn Mobile - Thu nhỏ icon lại chút */}
          <div className="absolute top-2 right-2 z-20">
            {linkedin_url && (
              <Link
                href={linkedin_url}
                target="_blank"
                className="bg-white/20 p-1 rounded-full backdrop-blur-sm block"
              >
                <IconBrandLinkedin size={14} color="white" strokeWidth={1.5} />
              </Link>
            )}
          </div>
        </div>

        {/* === DESKTOP LAYOUT (CLASSIC STYLE - GIỮ NGUYÊN) === */}
        <div className="hidden md:block">
          <CardHeader className="pb-0 pt-0 h-[17rem]">
            <div className="z-0 w-full h-full">
              <Image
                alt={`${name} profile`}
                src={photo_url}
                className="object-cover w-full h-full"
                width={400}
                height={400}
                fetchPriority={isPriority ? "high" : "auto"}
                loading={isPriority ? "eager" : "lazy"}
              />
            </div>
          </CardHeader>
          <CardBody className="relative z-10 overflow-visible pb-2 pl-3 pr-2 pt-4 bg-[#F7D27F] rounded-t-3xl">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h6 className="leading-6 font-semibold text-[0.9rem] text-[#2C305F]">
                  {name}
                </h6>
                <p className="leading-5 text-[#2C305F] text-[0.8rem] mt-1">
                  {position}
                </p>
              </div>
              {linkedin_url && linkedin_url.trim() ? (
                <Link
                  href={linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 my-auto"
                >
                  <IconBrandLinkedin
                    size={40}
                    color="#2C305F"
                    strokeWidth={0.8}
                    className="h-auto transition duration-300 transform hover:scale-110 hover:brightness-150 hover:drop-shadow-[0_0_6px_#2C305F]"
                  />
                </Link>
              ) : (
                <div className="flex-shrink-0 my-auto">
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
        </div>
      </Card>
    </motion.div>
  );
}

// --- Main Component ---

const ExecutiveBoard = () => {
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
          setError("Failed to load executive board data.");
        }
      } catch (err: any) {
        console.error("Error fetching executive board: ", err);
        setError("Failed to load executive board data.");
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
            <div className="w-12 h-12 border-[5px] border-[#F0EDFF] border-t-[#DCB968] rounded-full animate-spin"></div>
            <p className="mt-4 text-lg text-[#5E5E92]">Loading Executive Board...</p>
          </div>
        </main>
      </section>
    );
  }

  return (
    <section className="relative max-md:pt-16 max-md:pb-12 md:py-24 px-6 md:px-20">
      <DecorativeCircles />
      <main>
        <div className="mb-4 md:mb-0">
          <PageHeader />
        </div>

        {error && (
          <div className="relative w-full max-w-4xl h-48 mx-auto my-10 md:h-64 p-[4px] rounded-lg bg-gradient-to-b from-[#DCB968] to-[#F7D27F]">
            <div className="flex flex-col items-center justify-center w-full h-full bg-[#F9FAFB] rounded-[7px] text-center px-4">
              <p className="text-5xl font-bold mb-4">⚠️</p>
              <p className="text-[#2C305F] text-lg md:text-xl">{error}</p>
            </div>
          </div>
        )}
        <div className="
            md:pt-12 md:pb-8 
            w-full 
            grid grid-cols-2 gap-3 
            md:grid-cols-2 lg:grid-cols-4 md:gap-8
        ">
          {members.map((item, index) => (
            <ExecutiveBoardCard key={index} {...item} index={index} />
          ))}
        </div>
      </main>
    </section>
  );
};

export default ExecutiveBoard;
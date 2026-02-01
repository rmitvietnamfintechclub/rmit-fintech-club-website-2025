import { Card, CardBody, CardHeader } from "@heroui/react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { IconBrandLinkedin } from "@tabler/icons-react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import axios from "axios";
import useMediaQuery from "./useMediaQuery";

// --- Type Definition ---
type ManagementBoardMember = {
  photo_url: string;
  name: string;
  position: string;
  linkedin_url: string;
};

// --- Reusable UI Components (Giữ nguyên của Management Board) ---

/**
 * 🎨 Decorative elements specific to Management Board (Bear mascot)
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
 * 📄 Page Header (Right Aligned - Giữ nguyên style cũ)
 */
const PageHeader = () => (
  <div className="content grid text-right">
    <h2 className="leading-tight text-[#5E5E92] !text-[1.75rem] md:!text-5xl font-bold">
      Meet Our
    </h2>
    <h1 className="leading-tight text-[#DCB968] !text-[2.05rem] md:!text-6xl md:mt-1 font-bold">
      Management Board
    </h1>
    <p className="leading-8 w-full text-[#000000] text-[0.95rem] md:text-lg mt-2">
      Meet the talented representatives behind the four pillars of RMIT Vietnam
      FinTech Club!
    </p>
  </div>
);

// 👇 ================== [ MODIFIED CARD COMPONENT ] ================== 👇

function ManagementBoardCard({
  photo_url,
  name,
  position,
  linkedin_url,
  index,
}: ManagementBoardMember & { index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  // Logic responsive & priority loading
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const isPriority = index < 4;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: isDesktop ? (index % 2 === 0 ? 25 : -25) : 0,
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
        {/* =================================================================
            1. MOBILE LAYOUT
           ================================================================= */}
        <div className="md:hidden relative w-full aspect-[4/5]">
          <Image
            alt={`${name} profile`}
            src={photo_url}
            className="object-contain w-full h-full"
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

          {/* Text Content */}
          <div className="absolute bottom-0 left-0 w-full p-2.5 z-20 flex flex-col justify-end">
            <h6 className="font-bold text-white text-[0.85rem] leading-tight line-clamp-2 drop-shadow-sm">
              {name}
            </h6>
            <div className="h-0.5 w-5 bg-[#DBB968] my-1"></div>
            <p className="text-[#F7D27F] text-[0.65rem] font-medium leading-tight line-clamp-2">
              {position}
            </p>
          </div>

          {/* LinkedIn Icon */}
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

        {/* =================================================================
            2. DESKTOP LAYOUT
           ================================================================= */}
        <div className="hidden md:block">
          <CardHeader className="pb-0 pt-0 h-[14rem]">
            <div className="z-0 w-full h-full">
              <Image
                alt={`${name} profile`}
                src={photo_url}
                className="object-contain w-full h-full"
                width={400}
                height={400}
                fetchPriority={isPriority ? "high" : "auto"}
                loading={isPriority ? "eager" : "lazy"}
              />
            </div>
          </CardHeader>
          <CardBody className="relative z-10 overflow-visible pb-2 pl-3 pr-2 pt-4 bg-[#F7D27F] rounded-t-3xl">
            <div className="flex justify-between items-start space-x-2">
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
                  title="Visit LinkedIn"
                  className="flex-shrink-0 my-auto"
                >
                  <IconBrandLinkedin
                    color="#2C305F"
                    strokeWidth={0.8}
                    className="w-10 h-10 transition duration-300 transform hover:scale-110 hover:brightness-150 hover:drop-shadow-[0_0_6px_#2C305F]"
                  />
                </Link>
              ) : (
                <div className="flex-shrink-0 my-auto">
                  <IconBrandLinkedin
                    color="#9CA3AF"
                    strokeWidth={0.8}
                    className="w-10 h-10 opacity-50 cursor-not-allowed"
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

const ManagementBoard = () => {
  const [members, setMembers] = useState<ManagementBoardMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchManagementBoard = async () => {
      try {
        const settingsRes = await axios.get("/api/v1/settings");
        const activeGen = settingsRes.data.value;

        const response = await axios.get("/api/v1/managementBoard", {
            params: { generation: activeGen }
        });
        
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
        setError("Failed to load management board data.");
      } finally {
        setLoading(false);
      }
    };
    fetchManagementBoard();
  }, []);

  if (loading) {
    return (
      <section className="relative max-md:pb-0 md:py-24 min-h-screen px-6 md:px-20">
        <DecorativeElements />
        <main className="mx-6 md:mx-16 2xl:mx-[10rem]">
          <PageHeader />
          <div className="p-8 text-center flex flex-col items-center justify-center h-64">
            <div className="w-12 h-12 border-[5px] border-[#F0EDFF] border-t-[#DCB968] rounded-full animate-spin"></div>
            <p className="mt-4 text-lg md:text-xl text-[#5E5E92] animate-pulse">
              Loading Management Board...
            </p>
          </div>
        </main>
      </section>
    );
  }

  return (
    <section className="relative max-md:pb-0 md:py-24 px-6 md:px-20">
      <DecorativeElements />
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
            <ManagementBoardCard key={index} {...item} index={index} />
          ))}
        </div>
      </main>
    </section>
  );
};

export default ManagementBoard;
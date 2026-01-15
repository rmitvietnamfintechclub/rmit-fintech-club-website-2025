"use client";
import axios from "axios";
import { useState, useEffect } from "react";

import type { HallOfFameMember } from "./hall-components/types";
import HonoreePage from "./hall-components/honoreePage";
import HallPage from "./hall-components/hallPage";
import { useSemester } from "./hall-components/hooks/useSemester";
import HallRevealSection from "./hall-components/hall-display/HallRevealSection";
import HeaderTitle from "./hall-components/headerTitle";
import Image from "next/image";
import { motion } from "framer-motion";

const EmptyHallState = ({ semester }: { semester: string }) => {
  const displaySemester = semester.slice(4);
  const displayYear = semester.slice(0, 4);

  return (
    <section className="flex flex-col items-center justify-center py-12 px-4 w-full">
      <div className="flex flex-col items-center w-full max-w-lg mx-auto">
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-36 h-36 md:w-56 md:h-56 mb-[-2rem] z-10"
        >
          <Image
            src="https://d2uq10394z5icp.cloudfront.net/global/Mascot+-+M%E1%BA%B7t+tr%C6%B0%E1%BB%9Bc.svg"
            alt="Waiting Mascot"
            fill
            className="object-contain drop-shadow-xl"
            priority
          />
        </motion.div>

        {/* CARD NỘI DUNG */}
        <div
          className="
            relative z-0 w-full text-center 
            bg-white/60 backdrop-blur-md 
            rounded-3xl border border-[#DCB968]/40 shadow-sm
            pt-12 pb-8 px-6 md:px-10 md:pt-16 md:pb-10
            mt-4
        "
        >
          <h3 className="text-2xl md:text-4xl font-extrabold text-[#2C305F] mb-3 tracking-tight">
            Coming Soon!
          </h3>

          <p className="text-base md:text-xl text-[#5E5E92] leading-relaxed max-w-xs md:max-w-md mx-auto">
            The Hall of Fame for{" "}
            <span className="inline-block font-bold text-[#DBB968] bg-[#2C305F]/5 px-2 rounded-md">
              Semester {displaySemester} {displayYear}
            </span>{" "}
            hasn't been released yet.
          </p>

          <p className="text-sm md:text-base text-gray-500 mt-4 font-medium">
            Please select a{" "}
            <span className="text-[#2C305F] underline underline-offset-2 decoration-[#DCB968]">
              previous semester
            </span>{" "}
            above to explore.
          </p>

          <div className="mt-6 flex justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#DCB968]/50 animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-[#DCB968]/50 animate-pulse delay-150"></div>
            <div className="w-2 h-2 rounded-full bg-[#DCB968]/50 animate-pulse delay-300"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default function HallOfFamePage() {
  const categories = [
    "Department MVP",
    "Academic Ace",
    "Project MVP",
    "Community Builder",
    "Rookie of the Semester",
    "Best Department",
    "Club MVP",
  ];
  const semesters = ["Semester A", "Semester B", "Semester C"];

  const { semester } = useSemester(); // Giá trị ví dụ: "2025C"
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [members, setMembers] = useState<HallOfFameMember[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      setError(null);
      setSelectedCategory(null);

      try {
        const response = await axios.get("/api/v1/hall-of-fame", {
          params: { year: semester },
        });

        setMembers(response.data.honorees);
      } catch (err: any) {
        console.error("Error fetching Hall of Fame members:", err);

        if (err.response?.status === 404) {
          setMembers([]);
          setError(null);
        } else if (err.code === "ERR_NETWORK") {
          setError("Network error. Please check your connection.");
          setMembers([]);
        } else {
          setError("Failed to load data.");
          setMembers([]);
        }
      } finally {
        setLoading(false);
      }
    };

    if (semester) fetchMembers();
  }, [semester]);

  // --- RENDER ---
  return (
    <>
      {/* Loading Spinner */}
      {loading && (
        <section className="relative py-12 overflow-hidden">
          <div className="flex flex-col items-center py-10">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end items-center w-full lg:w-8/12">
              <HeaderTitle text="Hall of Fame" />
            </div>
            <div className="p-8 text-center flex flex-col items-center justify-center h-64">
              <div className="w-12 h-12 border-[5px] border-[#F0EDFF] border-t-[#DCB968] rounded-full animate-spin"></div>
              <p className="mt-4 text-lg text-[#5E5E92]">
                Loading Hall of Fame...
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Error Alert (Chỉ hiện khi lỗi mạng thực sự) */}
      {error && !loading && (
        <div className="relative w-[87vw] h-48 mx-auto mt-20 mb-10 md:h-64 p-[4px] rounded-lg bg-gradient-to-b from-[#DCB968] to-[#F7D27F]">
          <div className="flex flex-col items-center justify-center w-full h-full bg-[#F9FAFB] rounded-[7px] text-center px-4">
            <p className="text-5xl font-bold mb-4">⚠️</p>
            <p className="text-[#2C305F] text-xl">{error}</p>
          </div>
        </div>
      )}

      {/* Success State */}
      {!loading && !error && (
        <>
          {members.length === 0 ? (
            <HallRevealSection>
              <div className="flex flex-col items-center w-full">
                <HallPage
                  categories={categories}
                  semesters={semesters}
                  onCategorySelect={setSelectedCategory}
                  isEmpty={true}
                  emptyComponent={<EmptyHallState semester={semester} />}
                />
              </div>
            </HallRevealSection>
          ) : selectedCategory ? (
            <HonoreePage
              members={members}
              category={selectedCategory}
              semester={semester}
              onBack={() => setSelectedCategory(null)}
            />
          ) : (
            <HallRevealSection>
              <HallPage
                categories={categories}
                semesters={semesters}
                onCategorySelect={setSelectedCategory}
                isEmpty={false}
              />
            </HallRevealSection>
          )}
        </>
      )}
    </>
  );
}

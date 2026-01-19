"use client";
import axios from "axios";
import { useState, useEffect } from "react";

import type { HallOfFameMember } from "./hall-components/types";
import HonoreePage from "./hall-components/honoreePage";
import HallPage from "./hall-components/hallPage";
import { useSemester } from "./hall-components/hooks/useSemester";
import HallRevealSection from "./hall-components/hall-display/HallRevealSection";
import Image from "next/image";
import { motion } from "framer-motion";

const EmptyHallState = ({ semester }: { semester: string }) => {
  const displaySemester = semester.slice(4);
  const displayYear = semester.slice(0, 4);

  return (
    <section className="flex flex-col items-center justify-center px-4 w-full">
      <div className="flex flex-col items-center w-full md:max-w-lg mx-auto">
        <div
          className="
            relative z-0 w-full text-center 
            bg-white/60 backdrop-blur-md 
            rounded-3xl border border-[#DCB968]/40 shadow-sm
            py-8 px-4 md:px-10 md:pt-16 md:pb-10
          "
        >
          <h3 className="text-2xl md:text-4xl font-extrabold text-[#2C305F] mb-3 tracking-tight">
            Coming Soon!
          </h3>

          <p
            className="
            text-base md:text-xl text-[#5E5E92] leading-relaxed 
            w-full md:max-w-lg mx-auto
          "
          >
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

  const { semester } = useSemester(); // Example value: "2025C"
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

  // If a sub-category is selected, show the detail page
  if (selectedCategory && !loading) {
    return (
      <HonoreePage
        members={members}
        category={selectedCategory}
        semester={semester}
        onBack={() => setSelectedCategory(null)}
      />
    );
  }

  return (
    <>
      {/* Error Alert (Only show on real network error) */}
      {error && !loading && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-[90vw] md:w-auto p-4 rounded-lg bg-red-100 border border-red-400 text-red-700 shadow-lg animate-in fade-in slide-in-from-top-4">
          <p className="flex items-center gap-2 text-center font-medium">
            ⚠️ {error}
          </p>
        </div>
      )}

      <HallRevealSection>
        <div className="flex flex-col items-center w-full">
          <HallPage
            categories={categories}
            semesters={semesters}
            onCategorySelect={setSelectedCategory}
            isEmpty={members.length === 0}
            isLoading={loading} // Pass loading state down
            emptyComponent={<EmptyHallState semester={semester} />}
          />
        </div>
      </HallRevealSection>
    </>
  );
}

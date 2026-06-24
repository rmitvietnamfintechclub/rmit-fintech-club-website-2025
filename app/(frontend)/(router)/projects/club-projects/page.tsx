"use client";

import { Button } from "@heroui/react";
import { BulletproofSpinner } from "@/components/BulletproofSpinner";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ApiProject } from "../types";

type ProjectData = {
  labels: string[];
  title: string;
  description: string;
  link: string;
  image: string;
};

const ClubwideProjects = () => {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const [direction, setDirection] = useState<number>(1);

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const lastInteractionRef = useRef(Date.now());
  const autoPlayIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          "/api/v1/projects?type=large-scaled&status=ongoing",
          { signal: controller.signal },
        );

        const apiProjects: ApiProject[] = response.data.data?.projects || [];

        const formattedProjects: ProjectData[] = apiProjects.map((p) => ({
          title: p.title,
          description: p.description,
          labels: p.labels || [],
          image: p.image_url,
          link: p.exploreLink || "",
        }));

        setProjects(formattedProjects);
      } catch (err: any) {
        if (axios.isCancel(err)) return;
        console.error("Failed to fetch clubwide projects:", err);
        setError("Failed to fetch clubwide projects. Please try again later.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchProjects();
    return () => controller.abort();
  }, []);

  const registerInteraction = useCallback(() => {
    lastInteractionRef.current = Date.now();
  }, []);

  // Cập nhật hướng 1 khi tiến tới
  const nextSlide = useCallback(() => {
    if (projects.length > 0) {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % projects.length);
    }
  }, [projects.length]);

  // Cập nhật hướng -1 khi lùi lại
  const prevSlide = useCallback(() => {
    if (projects.length > 0) {
      setDirection(-1);
      setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
    }
  }, [projects.length]);

  // Tính toán hướng động dựa trên vị trí dot click
  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    registerInteraction();
  };

  const togglePlayPause = () => {
    setIsAutoPlaying((prev) => !prev);
    registerInteraction();
  };

  // --- Mobile Swipe ---
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50; // Vuốt qua trái -> Xem slide tiếp theo
    const isRightSwipe = distance < -50; // Vuốt qua phải -> Xem slide phía trước

    if (isLeftSwipe) {
      nextSlide();
      registerInteraction();
    }
    if (isRightSwipe) {
      prevSlide();
      registerInteraction();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  useEffect(() => {
    const checkInactivity = setInterval(() => {
      if (!isAutoPlaying && Date.now() - lastInteractionRef.current > 10000) {
        setIsAutoPlaying(true);
      }
    }, 1000);
    return () => {
      clearInterval(checkInactivity);
    };
  }, [isAutoPlaying]);

  useEffect(() => {
    if (isAutoPlaying && projects.length > 1) {
      autoPlayIntervalRef.current = setInterval(nextSlide, 5000);
    } else if (autoPlayIntervalRef.current) {
      clearInterval(autoPlayIntervalRef.current);
      autoPlayIntervalRef.current = null;
    }
    return () => {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
      }
    };
  }, [isAutoPlaying, nextSlide, projects.length]);

  const textVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
  };

  const imageCardVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? 60 : -60,
      scale: 0.96,
    }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 40, scale: 0.96 }),
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-screen p-8 bg-[#2C305F]">
        <BulletproofSpinner />
        <p
          className="mt-5 text-lg font-semibold text-[#DBB968] tracking-wide uppercase"
          style={{
            animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          }}
        >
          Loading Clubwide Projects...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative h-[95vh] flex items-center justify-center p-6 bg-ft-background">
        <div className="relative w-full max-w-2xl p-[4px] rounded-lg bg-gradient-to-b from-[#DCB968] to-[#F7D27F]">
          <div className="flex flex-col items-center justify-center w-full py-10 bg-[#F9FAFB] rounded-[7px] text-center px-4">
            <p className="text-5xl font-bold mb-4">⚠️</p>
            <p className="text-[#2C305F] text-xl font-semibold">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <section className="relative h-[95vh] bg-[#2C305F] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="z-10 text-center text-white px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#DBB968]">
            Clubwide Projects
          </h2>
          <p className="text-lg md:text-xl opacity-90">
            New large-scale projects are coming soon. Stay tuned!
          </p>
        </div>
      </section>
    );
  }

  const currentProject = projects[currentIndex];
  const nextProject = projects[(currentIndex + 1) % projects.length];

  return (
    <section className="relative overflow-hidden w-full lg:h-[calc(100vh-2.75rem)] bg-[#2C305F]">
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${currentIndex}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all"
          style={{ backgroundImage: `url(${currentProject.image})` }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to bottom,
                rgba(64, 68, 114, 0.65) 0%,
                rgba(49, 53, 104, 0.7) 12.5%,
                rgba(37, 41, 95, 0.75) 25%,
                rgba(16, 21, 79, 0.8) 37.5%,
                rgba(8, 13, 73, 0.9) 50%,
                rgba(0, 5, 67, 0.9) 62.5%,
                rgba(0, 5, 67, 0.95) 75%,
                rgba(110, 95, 86, 0.95) 87.5%,
                rgba(220, 185, 104, 0.9) 100%
              )`,
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* --- CONTENT CONTAINER WRAPPER --- */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative z-10 w-full h-full flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-12 px-6 md:px-16 pt-16 lg:pt-24 pb-8 lg:pb-16"
      >
        {/* Top Floating Category Badge */}
        <div className="absolute top-6 left-6 md:left-16 px-4 py-2 text-[#2C305F] font-bold bg-[#F0EDFF] rounded-tl-xl rounded-br-xl rounded-tr-[2.5rem] rounded-bl-[2.5rem] shadow-md text-xs md:text-sm">
          Clubwide Projects
        </div>

        {/* 2. ANIMATED LEFT TEXT */}
        <div className="w-full lg:max-w-2xl text-white flex flex-col order-2 lg:order-1 min-h-[320px] justify-center overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`text-${currentIndex}`}
              custom={direction}
              variants={textVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
            >
              {/* Labels Row */}
              <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
                {currentProject.labels.map((label, index) => (
                  <span
                    key={index}
                    className="bg-[#F7D27F] hover:bg-[#DCB968] text-[#2C305F] px-3 py-1 rounded-md text-xs lg:text-sm font-bold shadow-sm transition-colors"
                  >
                    {label}
                  </span>
                ))}
              </div>

              <h2 className="text-2xl lg:text-[2.5rem] font-[1000] mb-4 text-center md:text-left leading-tight drop-shadow-md tracking-wide uppercase">
                {currentProject.title}
              </h2>

              <p className="text-sm lg:text-base leading-relaxed mb-6 text-gray-100 text-justify opacity-95">
                {currentProject.description}
              </p>

              {currentProject.link && (
                <div className="w-full flex justify-center lg:justify-start">
                  <Button
                    className="bg-[#DCB968] hover:bg-[#DCB968]/80 text-[#2C305F] text-sm lg:text-[16px] py-5 lg:py-6 px-6 lg:px-8 font-bold rounded-xl transition-all hover:scale-105 shadow-lg"
                    as="a"
                    href={currentProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Explore More
                  </Button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 3. VISUAL MEDIA */}
        <div className="w-full lg:w-auto flex flex-col items-center order-1 lg:order-2 shrink-0 gap-5 mt-4 lg:mt-0">
          <div className="relative flex items-center justify-start lg:justify-start w-full max-w-[420px] lg:max-w-none lg:w-[32rem] overflow-visible">
            {/* Ảnh chính (Active Card) */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={`img-${currentIndex}`}
                custom={direction}
                variants={imageCardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                className="w-full aspect-[1.4/1] lg:w-[30rem] lg:h-[22rem] lg:aspect-auto rounded-2xl lg:rounded-[30px] p-[6px] bg-gradient-to-b from-[rgba(240,237,255,1)] to-[rgba(94,94,146,1)] backdrop-blur-sm shadow-2xl overflow-hidden shrink-0 z-10"
              >
                <div
                  className="w-full h-full bg-[length:100%_100%] bg-center bg-no-repeat rounded-2xl lg:rounded-[28px]"
                  style={{ backgroundImage: `url(${currentProject.image})` }}
                />
              </motion.div>
            </AnimatePresence>

            {/* Ảnh phụ peeking kế bên (Desktop Only) */}
            {projects.length > 1 && nextProject && (
              <div className="hidden lg:block w-[22rem] h-[16rem] -right-[23rem] -bottom-2 absolute rounded-[30px] z-10 blur-[1px] opacity-80 pointer-events-none">
                <div
                  className="absolute inset-0 m-[8px] bg-[length:100%_100%] bg-center bg-no-repeat rounded-3xl opacity-80"
                  style={{ backgroundImage: `url(${nextProject.image})` }}
                />
              </div>
            )}

            {/* Arrow Button Desktop */}
            {projects.length > 1 && (
              <Button
                isIconOnly
                size="sm"
                className="hidden lg:flex absolute left-[30.65rem] top-1/2 rounded-full transform -translate-y-1/2 z-30 bg-[#DBB968] hover:bg-white text-[#2C305F] shadow-xl transition-all scale-110 hover:scale-125"
                onClick={nextSlide}
                aria-label="Next project"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.8}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Button>
            )}
          </div>

          {/* Mobile Only Dots Navigation */}
          {projects.length > 1 && (
            <div className="flex space-x-2.5 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full lg:hidden">
              {projects.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-[#DCB968] scale-125 shadow-sm"
                      : "bg-white/40 hover:bg-white"
                  }`}
                  aria-label={`Go to project ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Desktop Only Base Dots Pagination */}
      {projects.length > 1 && (
        <div className="hidden lg:block absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex space-x-3 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-[#DCB968] scale-125 shadow-lg"
                    : "bg-white/50 hover:bg-white"
                }`}
                aria-label={`Go to project ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Floating Status Counter Status */}
      <div className="absolute top-6 lg:top-8 right-6 lg:right-8 z-20 bg-black/20 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-bold border border-white/10 flex items-center gap-3 shadow-lg">
        {currentIndex + 1} <span className="text-white/60">/</span>{" "}
        {projects.length}
        <button
          onClick={togglePlayPause}
          title={isAutoPlaying ? "Pause Autoplay" : "Start Autoplay"}
          className="flex items-center justify-center w-7 h-7 rounded-full bg-white/10 text-white hover:bg-[#DBB968] hover:text-[#2C305F] transition-all"
        >
          {isAutoPlaying ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="ml-0.5"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          )}
        </button>
      </div>
    </section>
  );
};

export default ClubwideProjects;

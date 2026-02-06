"use client";

import { Button, Spinner } from "@heroui/react";
import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { ApiProject } from "../types";

type ProjectData = {
  labels: string[];
  title: string;
  description: string;
  link: string;
  image: string;
};

const ClubwideProjects = () => {
  // State for data, loading, and errors
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for slider functionality
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  // Refs for managing intervals and timers
  const lastInteractionRef = useRef(Date.now());
  const autoPlayIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch data from the API when the component mounts
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

  // --- Slider Logic ---
  const registerInteraction = useCallback(() => {
    lastInteractionRef.current = Date.now();
  }, []);

  const nextSlide = useCallback(() => {
    if (projects.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % projects.length);
    }
  }, [projects.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    registerInteraction();
  };

  const togglePlayPause = () => {
    setIsAutoPlaying((prev) => !prev);
    registerInteraction();
  };

  useEffect(() => {
    const checkInactivity = setInterval(() => {
      if (!isAutoPlaying && Date.now() - lastInteractionRef.current > 10000) {
        setIsAutoPlaying(true);
      }
    }, 1000);

    return () => clearInterval(checkInactivity);
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

  // --- Conditional Rendering ---

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-screen p-8">
        <Spinner
          size="lg"
          classNames={{
            wrapper: "w-16 h-16",
            circle1: "border-b-ft-primary-yellow border-[4px]",
            circle2: "border-b-ft-primary-yellow border-[4px]",
          }}
        />
        <p className="mt-5 text-lg font-semibold text-[#5E5E92] animate-pulse tracking-wide">
          Loading Clubwide Projects...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative h-[95vh] flex items-center justify-center p-6">
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
    <section className="relative overflow-hidden">
      <div className="relative h-[calc(100vh-2.75rem)]">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat duration-700 ease-in-out"
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
          ></div>
        </div>

        {/* Description Content */}
        <div className="pt-[5rem] h-[calc(100vh-3rem)] relative z-10 flex items-center gap-12 pl-6 md:pl-16 pr-6 md:pr-20">
          {/* Left */}
          <div className="relative flex-1 max-w-2xl text-white">
            <div className="absolute -top-[3.5rem] px-[0.8rem] py-[0.5rem] text-[#2C305F] font-semibold bg-[#F0EDFF] rounded-tl-md rounded-tr-[5rem] rounded-br-[5rem] rounded-bl-md shadow-lg">
              Clubwide Projects
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {currentProject.labels.map((label, index) => (
                <span
                  key={index}
                  className="bg-[#F7D27F] hover:bg-[#DCB968] text-[#2C305F] px-3 py-1 rounded text-sm font-bold shadow-sm transition-colors"
                >
                  {label}
                </span>
              ))}
            </div>

            <h2 className="text-[2rem] lg:text-[2.5rem] font-bold mb-4 leading-tight drop-shadow-md">
              {currentProject.title.toUpperCase()}
            </h2>

            <p className="text-base leading-relaxed mb-6 text-gray-100 text-justify w-[100%] md:line-clamp-4 lg:line-clamp-none">
              {currentProject.description}
            </p>

            {currentProject.link && (
              <Button
                className="bg-[#DCB968] hover:bg-[#DCB968]/80 text-[#2C305F] text-[16px] py-6 px-8 font-bold rounded-xl transition-all hover:scale-105 shadow-lg"
                as="a"
                href={currentProject.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                Explore More
              </Button>
            )}
          </div>

          {/* Right (Desktop Only) */}
          <div className="hidden lg:block flex-shrink-0">
            <div className="relative">
              {/* Main Card */}
              <div className="w-[30rem] h-[22rem] rounded-[30px] bg-gradient-to-b from-[rgba(240,237,255,1)] to-[rgba(94,94,146,1)] z-20 relative shadow-2xl border-4 border-white/10">
                <div
                  className="absolute inset-0 m-[10px] bg-[length:100%_100%] bg-center bg-no-repeat rounded-3xl transition-all duration-700 ease-in-out"
                  style={{
                    backgroundImage: `url(${currentProject.image})`,
                  }}
                ></div>
              </div>

              {/* Next Slide Preview (Decorative) */}
              {projects.length > 1 && nextProject && (
                <div className="w-[16rem] h-[16rem] -right-[12rem] -bottom-8 absolute bg-gradient-to-b from-[rgba(240,237,255,0.5)] to-[rgba(94,94,146,0.5)] rounded-[30px] z-10 blur-[1px] opacity-80 pointer-events-none">
                  <div
                    className="absolute inset-0 m-[8px] bg-[length:100%_100%] bg-center bg-no-repeat rounded-3xl opacity-80"
                    style={{
                      backgroundImage: `url(${nextProject.image})`,
                    }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        {projects.length > 1 && (
          <Button
            isIconOnly
            size="sm"
            className="hidden md:flex absolute mt-[5rem] right-[2rem] top-1/2 rounded-full transform -translate-y-1/2 z-20 bg-[#DBB968] hover:bg-white text-[#2C305F] backdrop-blur-sm shadow-lg transition-all"
            onClick={() => {
              nextSlide();
              registerInteraction();
            }}
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
                strokeWidth={2.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Button>
        )}

        {/* Dots */}
        {projects.length > 1 && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
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

        {/* Counter */}
        <div className="absolute top-28 md:top-8 right-6 md:right-8 z-20 bg-black/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-bold border border-white/10 flex items-center gap-3 shadow-lg">
          {currentIndex + 1} <span className="text-white/60">/</span>{" "}
          {projects.length}
          <button
            onClick={togglePlayPause}
            title={isAutoPlaying ? "Pause Autoplay" : "Start Autoplay"}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white hover:bg-[#DBB968] hover:text-[#2C305F] transition-all"
          >
            {isAutoPlaying ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <rect x="6" y="4" width="4" height="16"></rect>
                <rect x="14" y="4" width="4" height="16"></rect>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="ml-0.5"
              >
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ClubwideProjects;

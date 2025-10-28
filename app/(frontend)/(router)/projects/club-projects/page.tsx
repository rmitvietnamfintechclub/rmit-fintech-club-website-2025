"use client";

import { Button } from "@heroui/react";
import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { CircularProgress } from "@mui/material";

type ProjectData = {
  labels: string[];
  title: string;
  description: string;
  link: string;
  image: string;
};

interface ApiProject {
  _id: string;
  title: string;
  description: string;
  labels: string[];
  image_url: string;
  slug: string;
}

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
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "/api/v1/projects?type=large-scaled&status=Ongoing"
        );
        const apiProjects: ApiProject[] = response.data.data || [];

        // Map the API data to the structure your component needs
        const formattedProjects: ProjectData[] = apiProjects.map((p) => ({
          title: p.title,
          description: p.description,
          labels: p.labels || [],
          image: p.image_url,
          link: `/projects/${p.slug}`,
        }));

        setProjects(formattedProjects);
      } catch (err) {
        console.error("Failed to fetch clubwide projects:", err);
        setError("Failed to fetch clubwide projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []); // Empty array ensures this runs only once on mount

  // --- Slider Logic ---
  // Utility to reset the inactivity timer
  const registerInteraction = useCallback(() => {
    lastInteractionRef.current = Date.now();
  }, []);

  // Go to the next slide
  const nextSlide = useCallback(() => {
    if (projects.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % projects.length);
    }
  }, [projects.length]);

  // Go to a specific slide
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    registerInteraction();
  };

  // Toggle the autoplay state and register it as an interaction
  const togglePlayPause = () => {
    setIsAutoPlaying((prev) => !prev);
    registerInteraction();
  };

  // Effect to check for user inactivity and start autoplay
  useEffect(() => {
    const checkInactivity = setInterval(() => {
      if (!isAutoPlaying && Date.now() - lastInteractionRef.current > 10000) {
        setIsAutoPlaying(true);
      }
    }, 1000);

    return () => clearInterval(checkInactivity);
  }, [isAutoPlaying]); // Dependency ensures the check is aware of the current play state

  // Effect to handle the autoplay interval itself
  useEffect(() => {
    if (isAutoPlaying) {
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
  }, [isAutoPlaying, nextSlide]);

  // --- Conditional Rendering ---
  if (loading) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center h-screen">
        <CircularProgress sx={{ color: "#DCB968" }} />
        <p className="mt-4 text-lg text-[#5E5E92]">Loading Clubwide Projects</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative w-[87vw] h-48 mx-auto my-10 md:h-64 p-[4px] rounded-lg bg-gradient-to-b from-[#DCB968] to-[#F7D27F]">
        <div className="flex flex-col items-center justify-center w-full h-full bg-[#F9FAFB] rounded-[7px] text-center px-4">
          <p className="text-5xl font-bold mb-4">⚠️</p>
          <p className="text-[#2C305F] text-xl">{error}</p>
        </div>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return null;
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

        {/* description */}
        <div className="pt-[5rem] h-[calc(100vh-3rem)] relative z-10 flex items-center gap-12 pl-16 pr-20">
          {/* Left */}
          <div className="relative flex-1 max-w-2xl text-white">
            <div className="absolute -top-[3.5rem] px-[0.8rem] py-[0.5rem] text-[#2C305F] font-semibold bg-[#F0EDFF] rounded-tl-md rounded-tr-[5rem] rounded-br-[5rem] rounded-bl-md">
              Clubwide Projects
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {currentProject.labels.map((label, index) => (
                <span
                  key={index}
                  className="bg-[#F7D27F] hover:bg-[#DCB968] text-black px-3 py-1 rounded text-sm font-medium"
                >
                  {label}
                </span>
              ))}
            </div>

            <h2 className="text-[2rem] lg:text-[2.5rem] font-bold mb-2 leading-tight">
              {currentProject.title.toUpperCase()}
            </h2>

            <p className="text-base leading-relaxed mb-4 text-gray-100 text-justify w-[100%]">
              {currentProject.description}
            </p>

            {currentProject.link && (
              <Button
                className="bg-[#DCB968] hover:bg-[#DCB968]/80 text-[#2C305F] text-[16px] py-3 font-semibold rounded-lg transition-colors"
                as="a"
                href={currentProject.link}
              >
                Explore More
              </Button>
            )}
          </div>

          {/* Right */}
          <div className="hidden lg:block flex-shrink-0">
            <div className="relative">
              <div className="w-[30rem] h-[22rem] rounded-[30px] bg-gradient-to-b from-[rgba(240,237,255,1)] to-[rgba(94,94,146,1)] z-0">
                <div
                  className="absolute inset-0 m-[10px] bg-cover bg-center bg-no-repeat rounded-3xl transition-all duration-700 ease-in-out z-10"
                  style={{ backgroundImage: `url(${currentProject.image})`, backgroundSize: '100% 100%', }}
                ></div>
                <div
                  className="w-[16rem] h-[16rem] right-[-20rem] bottom-0 absolute ml-[10px] bg-cover bg-center bg-no-repeat rounded-3xl transition-all duration-700 ease-in-out z-10"
                  style={{
                    backgroundImage: `url(${nextProject!.image})`,
                    backgroundSize: '100% 100%',
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        {projects.length > 1 && (
          <Button
            isIconOnly
            size="sm"
            className="absolute mt-[5rem] right-[2rem] top-1/2 rounded-full transform -translate-y-1/2 z-20 bg-[#DBB968] text-[#2C305F] backdrop-blur-sm"
            onClick={() => {
              nextSlide();
              registerInteraction();
            }}
            aria-label="Next project"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Button>
        )}

        {/* Dots */}
        {projects.length > 1 && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
            <div className="flex space-x-3">
              {projects.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    goToSlide(index);
                    registerInteraction();
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-[#DCB968] scale-125 shadow-lg"
                      : "bg-[#FFFFFF] hover:bg-[#DCB968]/60"
                  }`}
                  aria-label={`Go to project ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Counter */}
        <div className="absolute top-8 right-8 z-20 bg-black/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm border border-white/20 flex items-center gap-2">
          {/* Counter Text */}
          {currentIndex + 1} / {projects.length}
          {/* Autoplay Indicator and Control */}
          <div className="flex items-center">
            {/* The Toggle Button */}
            <button
              onClick={togglePlayPause}
              title={isAutoPlaying ? "Pause Autoplay" : "Start Autoplay"}
              className="flex items-center justify-center ml-1 w-8 h-8 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
            >
              {isAutoPlaying ? (
                // Pause icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="6" y="4" width="4" height="16"></rect>
                  <rect x="14" y="4" width="4" height="16"></rect>
                </svg>
              ) : (
                // Play icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClubwideProjects;

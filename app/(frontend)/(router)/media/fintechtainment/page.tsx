"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import LabelSort from "./components/labelSort";
import PodcastCard from "./components/podcastCard";
import ReelPlayer from "./components/reelPlayer";
import ReelLibraryGrid from "./components/ReelLibraryGrid";
import { motion } from "framer-motion";
import { Spinner } from "@heroui/react";
import PaginationRounded from "./components/pagination";
import Image from "next/image";
import axios from "axios";

// --- TYPE DEFINITIONS ---
interface ApiPodcast {
  _id: string;
  title: string;
  summary: string;
  thumbnail_url: string;
  labels: string[];
  publicationDate: string;
}

interface DisplayPodcast {
  _id: string;
  imageSrc: string;
  imageAlt: string;
  labels: string[];
  title: string;
  description: string;
  date: string;
}

interface ApiReel {
  _id: string;
  title: string;
  description: string;
  videoId: string;
  thumbnailUrl: string;
  labels: string[];
  publicationDate: string;
}

// --- HELPER FUNCTIONS ---
const addOrdinalSuffix = (day: number): string => {
  if (day > 10 && day < 14) return `${day}th`;
  const lastDigit = day % 10;
  switch (lastDigit) {
    case 1:
      return `${day}st`;
    case 2:
      return `${day}nd`;
    case 3:
      return `${day}rd`;
    default:
      return `${day}th`;
  }
};

const formatPodcastDate = (isoString: string): string => {
  const dateObj = new Date(isoString);
  const day = addOrdinalSuffix(dateObj.getDate());
  const month = dateObj.toLocaleString("en-US", { month: "long" });
  const year = dateObj.getFullYear();
  return `${month} ${day}, ${year}`;
};

// --- ICONS (SVG Thuần) ---
const ChevronRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#A28436"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="mx-2"
  >
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-2"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
      clipRule="evenodd"
    />
  </svg>
);

export default function PodcastLibrary() {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState("podcast");

  // Podcast State
  const [podcasts, setPodcasts] = useState<DisplayPodcast[]>([]);
  const [podcastsLoading, setPodcastsLoading] = useState<boolean>(true);
  const [podcastsError, setPodcastsError] = useState<string>("");
  const [podcastPage, setPodcastPage] = useState(1);
  const [totalPodcastPages, setTotalPodcastPages] = useState(1);
  const [selectedPodcastLabel, setSelectedPodcastLabel] = useState<
    string | null
  >(null);
  const [availablePodcastLabels, setAvailablePodcastLabels] = useState<
    string[]
  >([]);

  // Reel State
  const [reels, setReels] = useState<ApiReel[]>([]);
  const [reelsLoading, setReelsLoading] = useState<boolean>(true);
  const [reelsError, setReelsError] = useState<string>("");
  const [reelPage, setReelPage] = useState(1);
  const [totalReelPages, setTotalReelPages] = useState(1);
  const [selectedReelLabel, setSelectedReelLabel] = useState<string | null>(
    null,
  );
  const [availableReelLabels, setAvailableReelLabels] = useState<string[]>([]);

  const [selectedReelIndex, setSelectedReelIndex] = useState<number | null>(
    null,
  );

  // --- EFFECTS ---
  useEffect(() => {
    const fetchAllPodcastLabels = async () => {
      try {
        const response = await axios.get(`/api/v1/podcast/labels`);
        const uniqueLabels: string[] = response.data || [];
        setAvailablePodcastLabels(["All", ...uniqueLabels.sort()]);
      } catch (err) {
        console.error("Failed to fetch unique podcast labels:", err);
        setAvailablePodcastLabels(["All"]);
      }
    };

    const fetchAllReelLabels = async () => {
      try {
        const response = await axios.get(`/api/v1/reel/labels`);
        const uniqueLabels: string[] = response.data || [];
        setAvailableReelLabels(["All", ...uniqueLabels.sort()]);
      } catch (err) {
        console.error("Failed to fetch unique reel labels:", err);
        setAvailableReelLabels(["All"]);
      }
    };

    fetchAllPodcastLabels();
    fetchAllReelLabels();
  }, []);

  // Fetch podcasts
  useEffect(() => {
    if (activeTab === "podcast") {
      const fetchPodcasts = async () => {
        setPodcastsLoading(true);
        setPodcastsError("");
        try {
          const params = new URLSearchParams({
            page: podcastPage.toString(),
            limit: "5",
          });
          if (selectedPodcastLabel && selectedPodcastLabel !== "All") {
            params.append("labels", selectedPodcastLabel);
          }
          const response = await axios.get(
            `/api/v1/podcast?${params.toString()}`,
          );
          const {
            podcasts: fetchedPodcasts = [],
            totalPages: fetchedTotalPages = 1,
          } = response.data;
          const formattedPodcasts: DisplayPodcast[] = fetchedPodcasts.map(
            (p: ApiPodcast) => ({
              _id: p._id,
              title: p.title,
              description: p.summary,
              imageSrc: p.thumbnail_url,
              imageAlt: p.title,
              labels: p.labels,
              date: formatPodcastDate(p.publicationDate),
            }),
          );
          setPodcasts(formattedPodcasts);
          setTotalPodcastPages(fetchedTotalPages);
        } catch (err: any) {
          setPodcastsError("Failed to load podcasts. Please try again later.");
        } finally {
          setPodcastsLoading(false);
        }
      };
      fetchPodcasts();
    }
  }, [podcastPage, selectedPodcastLabel, activeTab]);

  // Fetch reels
  useEffect(() => {
    if (activeTab === "fintech101") {
      const fetchReels = async () => {
        setReelsLoading(true);
        setReelsError("");
        try {
          const params = new URLSearchParams({
            page: reelPage.toString(),
            limit: "8",
          });
          if (selectedReelLabel && selectedReelLabel !== "All") {
            params.append("labels", selectedReelLabel);
          }
          const response = await axios.get(`/api/v1/reel?${params.toString()}`);
          const {
            reels: fetchedReels = [],
            totalPages: fetchedTotalPages = 1,
          } = response.data;
          setReels(fetchedReels);
          setTotalReelPages(fetchedTotalPages);
        } catch (err: any) {
          setReelsError("Failed to load Fintech101. Please try again later.");
        } finally {
          setReelsLoading(false);
        }
      };
      fetchReels();
    }
  }, [reelPage, selectedReelLabel, activeTab]);

  // --- HANDLERS ---
  const handlePodcastLabelSelect = (label: string) => {
    setSelectedPodcastLabel(label);
    setPodcastPage(1);
  };

  const handleReelLabelSelect = (label: string) => {
    setSelectedReelLabel(label);
    setReelPage(1);
  };

  // --- RENDER LOGIC ---
  const renderPodcastContent = () => {
    if (podcastsLoading) {
      return (
        <div className="flex flex-col items-center justify-center w-full h-64 p-8">
          <Spinner
            size="lg"
            classNames={{
              wrapper: "w-16 h-16",
              circle1: "border-b-ft-primary-yellow border-[4px]",
              circle2: "border-b-ft-primary-yellow border-[4px]",
            }}
          />
          <p className="mt-5 text-lg font-semibold text-[#5E5E92] animate-pulse tracking-wide">
            Loading Podcasts...
          </p>
        </div>
      );
    }

    if (podcastsError)
      return (
        <div className="relative w-[90vw] max-w-4xl h-48 mx-auto my-10 md:h-64 p-[4px] rounded-lg bg-gradient-to-b from-[#DCB968] to-[#F7D27F]">
          <div className="flex flex-col items-center justify-center w-full h-full bg-[#F9FAFB] rounded-[7px] text-center px-4">
            <p className="text-5xl font-bold mb-4">⚠️</p>
            <p className="text-[#2C305F] text-lg md:text-xl">{podcastsError}</p>
          </div>
        </div>
      );

    return (
      <>
        <div className="pt-8 px-6 md:px-16 lg:px-24">
          {podcasts.map((podcast) => (
            <Link
              href={`/media/fintechtainment/${podcast._id}`}
              key={podcast._id}
            >
              <PodcastCard {...podcast} />
            </Link>
          ))}
        </div>
        {totalPodcastPages > 1 && (
          <div className="flex justify-center">
            <PaginationRounded
              page={podcastPage}
              onPageChange={(value) => setPodcastPage(value)}
              count={totalPodcastPages}
            />
          </div>
        )}
      </>
    );
  };

  const renderReelContent = () => {
    if (reelsLoading) {
      return (
        <div className="flex flex-col items-center justify-center w-full h-64 p-8">
          <Spinner
            size="lg"
            classNames={{
              wrapper: "w-16 h-16",
              circle1: "border-b-ft-primary-yellow border-[4px]",
              circle2: "border-b-ft-primary-yellow border-[4px]",
            }}
          />
          <p className="mt-5 text-lg font-semibold text-[#5E5E92] animate-pulse tracking-wide">
            Loading FinTech101...
          </p>
        </div>
      );
    }
    if (reelsError)
      return (
        <div className="relative w-[90vw] max-w-4xl h-48 mx-auto my-10 md:h-64 p-[4px] rounded-lg bg-gradient-to-b from-[#DCB968] to-[#F7D27F]">
          <div className="flex flex-col items-center justify-center w-full h-full bg-[#F9FAFB] rounded-[7px] text-center px-4">
            <p className="text-5xl font-bold mb-4">⚠️</p>
            <p className="text-[#2C305F] text-lg md:text-xl">{reelsError}</p>
          </div>
        </div>
      );

    return (
      <>
        <ReelLibraryGrid
          reels={reels.map((r) => ({ ...r, id: Number(r._id) }))}
          onReelSelect={(index) => setSelectedReelIndex(index)}
        />
        {totalReelPages > 1 && (
          <div className="flex justify-center mt-8">
            <PaginationRounded
              page={reelPage}
              onPageChange={(value) => setReelPage(value)}
              count={totalReelPages}
            />
          </div>
        )}
      </>
    );
  };

  return (
    <section className="overflow-x-hidden">
      {/* Hero Section */}
      <div
        className="w-screen h-[70vh] md:h-[92vh] flex items-center justify-center relative"
        style={{
          background: "linear-gradient(to bottom, #474A6E, #DBB968)",
        }}
      >
        <div className="absolute w-screen h-full z-10">
          <Image
            src="https://d2uq10394z5icp.cloudfront.net/media/podcast/Fintechtainment-LandscapePoster-New.png"
            alt="Fintechtainment Poster"
            fill
            priority
            className="object-cover md:object-fill opacity-15"
          />
        </div>
        {/* Stars (Desktop Only) */}
        <div className="absolute w-screen h-screen top-[-20vh] left-[2vw] z-20 hidden md:block">
          <Image
            src="https://d2uq10394z5icp.cloudfront.net/media/YellowStars.png"
            alt="Yellow Stars"
            width={1200}
            height={800}
            loading="lazy"
            className="w-full h-auto"
          />
        </div>
        <div className="flex flex-col items-center justify-center z-30 mt-[2vh] md:mt-[17vh] px-6">
          <h1 className="text-4xl md:text-7xl lg:text-[9vh] font-bold text-center text-ft-primary-yellow-50 drop-shadow-[1.5px_1.5px_0_#1E264A]">
            FinTechTainment
          </h1>
          <p className="leading-6 font-medium text-base text-white w-[90vw] md:w-[50vw] text-justify py-6 max-md:py-4">
            FinTechTainment is play of words between "Fintech" and
            "Entertainment". It is a media project aimed at interviewing
            industry professionals with topics in the fields of: Business,
            Finance, Technology, and Entrepreneurship. Our approach is to have
            casual conversations about insightful academic and industry topics,
            in a way that is relatable and understandable by students and
            curious newcomers.
          </p>
          <div
            className="w-fit h-fit rounded-md p-[2px] mt-[1.5rem] max-md:mt-0"
            style={{
              background: "linear-gradient(to top, #474A6E, #DBB968)",
            }}
          >
            <Link href="/media">
              <motion.button className="bg-ft-primary-blue-300 text-bluePrimary font-semibold px-4 py-2 rounded-md hover:bg-yellowCream transition-colors duration-200">
                Back to Media
              </motion.button>
            </Link>
          </div>
        </div>
      </div>

      {selectedReelIndex === null ? (
        <nav
          aria-label="Breadcrumb"
          className="w-full py-8 max-md:py-4 px-6 md:pl-16"
        >
          <ol className="flex items-center">
            <li>
              <Link
                href="/media"
                className="text-black hover:text-[#A28436] transition-colors underline-offset-4 hover:underline"
              >
                Media
              </Link>
            </li>
            <li className="flex items-center">
              <ChevronRightIcon />
            </li>
            <li>
              <span className="text-black font-semibold truncate max-w-[150px] md:max-w-none cursor-default">
                FinTechTainment Library
              </span>
            </li>
          </ol>
        </nav>
      ) : (
        <div className="w-full pt-8 pb-4 px-6 md:pl-16">
          <button
            onClick={() => setSelectedReelIndex(null)}
            className="flex items-center text-gray-700 font-semibold hover:text-black transition-colors"
          >
            <ArrowLeftIcon />
            Back to FinTech 101 Library
          </button>
        </div>
      )}

      {/* Conditionally render the Tab Bar only when not in player view */}
      {selectedReelIndex === null && (
        <div className="px-6 md:px-16 lg:px-24 mb-6">
          <div className="max-w-lg mx-auto bg-gray-100 rounded-lg p-1 flex space-x-1 shadow-inner border border-gray-200">
            <button
              onClick={() => setActiveTab("podcast")}
              className={`w-1/2 py-2.5 px-2 text-sm md:text-base rounded-md font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#A28436] focus:ring-opacity-50 ${
                activeTab === "podcast"
                  ? "bg-[#DBB968] text-[#1E264A] shadow-md"
                  : "bg-transparent text-gray-500 hover:bg-gray-200 hover:text-gray-700"
              }`}
            >
              FinTechTainment Podcast
            </button>
            <button
              onClick={() => setActiveTab("fintech101")}
              className={`w-1/2 py-2.5 px-2 text-sm md:text-base rounded-md font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#A28436] focus:ring-opacity-50 ${
                activeTab === "fintech101"
                  ? "bg-[#DBB968] text-[#1E264A] shadow-md"
                  : "bg-transparent text-gray-500 hover:bg-gray-200 hover:text-gray-700"
              }`}
            >
              FinTech 101
            </button>
          </div>
        </div>
      )}

      {/* Tab Content */}
      {activeTab === "podcast" && selectedReelIndex === null && (
        <>
          <div className="relative px-0 md:px-16 lg:px-24">
            <LabelSort
              availableLabels={availablePodcastLabels}
              onSelect={handlePodcastLabelSelect}
            />
          </div>
          {renderPodcastContent()}
        </>
      )}

      {activeTab === "fintech101" && (
        <div className="px-0 pb-8 md:px-16 lg:px-24">
          {selectedReelIndex === null ? (
            <>
              <div className="relative mb-8">
                <LabelSort
                  availableLabels={availableReelLabels}
                  onSelect={handleReelLabelSelect}
                />
              </div>
              {renderReelContent()}
            </>
          ) : (
            <ReelPlayer
              reels={reels.map((r) => ({ ...r, id: Number(r._id) }))}
              selectedIndex={selectedReelIndex}
              onClose={() => setSelectedReelIndex(null)}
              onNavigate={(newIndex) => setSelectedReelIndex(newIndex)}
            />
          )}
        </div>
      )}
    </section>
  );
}

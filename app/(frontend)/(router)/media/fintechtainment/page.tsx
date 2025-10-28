"use client";

import React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import MuiLink from "@mui/material/Link";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import LabelSort from "./components/labelSort";
import PodcastCard from "./components/podcastCard";
import ReelPlayer from "./components/reelPlayer";
import ReelLibraryGrid from "./components/ReelLibraryGrid";
import { motion } from "framer-motion";
import PaginationRounded from "./components/pagination";
import Image from "next/image";
import axios from "axios";
import { CircularProgress } from "@mui/material";

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
    null
  );
  const [availableReelLabels, setAvailableReelLabels] = useState<string[]>([]);

  const [selectedReelIndex, setSelectedReelIndex] = useState<number | null>(
    null
  );

  // --- EFFECTS ---
  // Fetch labels for both content types on initial load
  useEffect(() => {
    const fetchAllPodcastLabels = async () => {
      try {
        const response = await axios.get(`/api/v1/podcast?limit=200`);
        const allPodcasts: ApiPodcast[] = response.data.podcasts || [];
        const allLabelsFlat = allPodcasts.flatMap((p) => p.labels);
        const uniqueLabels = Array.from(new Set(allLabelsFlat)).sort();
        setAvailablePodcastLabels(["All", ...uniqueLabels]);
      } catch (err) {
        console.error("Failed to fetch unique podcast labels:", err);
        setAvailablePodcastLabels(["All"]);
      }
    };
    const fetchAllReelLabels = async () => {
      try {
        const response = await axios.get(`/api/v1/reel?limit=200`);
        const allReels: ApiReel[] = response.data.reels || [];
        const allLabelsFlat = allReels.flatMap((r) => r.labels);
        const uniqueLabels = Array.from(new Set(allLabelsFlat)).sort();
        setAvailableReelLabels(["All", ...uniqueLabels]);
      } catch (err) {
        console.error("Failed to fetch unique reel labels:", err);
        setAvailableReelLabels(["All"]);
      }
    };
    fetchAllPodcastLabels();
    fetchAllReelLabels();
  }, []);

  // Fetch podcasts when relevant state changes
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
            `/api/v1/podcast?${params.toString()}`
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
            })
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

  // Fetch reels when relevant state changes
  useEffect(() => {
    if (activeTab === "fintech101") {
      const fetchReels = async () => {
        setReelsLoading(true);
        setReelsError("");
        try {
          const params = new URLSearchParams({
            page: reelPage.toString(),
            limit: "12",
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
        <div className="p-8 text-center flex flex-col items-center justify-center h-64">
          <CircularProgress sx={{ color: "#DCB968" }} />
          <p className="mt-4 text-lg text-[#5E5E92]">Loading Podcasts</p>
        </div>
      );
    }
    if (podcastsError)
      return (
        <div className="relative w-[87vw] h-48 mx-auto my-10 md:h-64 p-[4px] rounded-lg bg-gradient-to-b from-[#DCB968] to-[#F7D27F]">
          <div className="flex flex-col items-center justify-center w-full h-full bg-[#F9FAFB] rounded-[7px] text-center px-4">
            <p className="text-5xl font-bold mb-4">⚠️</p>
            <p className="text-[#2C305F] text-xl">{podcastsError}</p>
          </div>
        </div>
      );

    return (
      <>
        <div className="pt-8 px-4 md:px-16 lg:px-24">
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
        <div className="p-8 text-center flex flex-col items-center justify-center h-64">
          <CircularProgress sx={{ color: "#DCB968" }} />
          <p className="mt-4 text-lg text-[#5E5E92]">Loading Fintech101</p>
        </div>
      );
    }
    if (reelsError)
      return (
        <div className="relative w-[87vw] h-48 mx-auto my-10 md:h-64 p-[4px] rounded-lg bg-gradient-to-b from-[#DCB968] to-[#F7D27F]">
          <div className="flex flex-col items-center justify-center w-full h-full bg-[#F9FAFB] rounded-[7px] text-center px-4">
            <p className="text-5xl font-bold mb-4">⚠️</p>
            <p className="text-[#2C305F] text-xl">{reelsError}</p>
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
    <section>
      {/* Hero Section */}
      <div
        className="w-screen h-screen flex items-center justify-center"
        style={{
          background: "linear-gradient(to bottom, #474A6E, #DBB968)",
        }}
      >
        <div className="absolute w-screen h-screen z-10">
          <Image
            src="https://d2prwyp3rwi40.cloudfront.net/media/podcast/Fintechtainment-LandscapePoster-New.png"
            alt="Fintechtainment Poster"
            fill
            priority
            className="object-fill opacity-15"
          />
        </div>
        <div className="absolute w-screen h-screen top-[-12vh] left-[2vw] z-20">
          <Image
            src="https://d2prwyp3rwi40.cloudfront.net/media/YellowStars.png"
            alt="Yellow Stars"
            width={1200}
            height={800}
            loading="lazy"
            className="w-full h-auto"
          />
        </div>
        <div className="flex flex-col items-center justify-center z-30 mt-[17vh]">
          <h1 className="text-5xl font-bold text-[9vh] text-center text-ft-primary-yellow-50 drop-shadow-[1.5px_1.5px_0_#1E264A]">
            FinTechTainment
          </h1>
          <p className="leading-6 font-semibold text-base text-white w-[50vw] text-justify py-6">
            FinTechTainment is play of words between "Fintech" and
            "Entertainment". It is a media project aimed at interviewing
            industry professionals with topics in the fields of: Business,
            Finance, Technology, and Entrepreneurship. Our approach is to have
            casual conversations about insightful academic and industry topics,
            in a way that is relatable and understandable by students and
            curious newcomers.
          </p>
          <div
            className="w-fit h-fit rounded-md p-[2px] mt-[1.5rem]"
            style={{
              background: "linear-gradient(to top, #474A6E, #DBB968)",
            }}
          >
            <Link href="/media">
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 1.1 }}
                className="bg-ft-primary-blue-300 text-bluePrimary font-semibold px-4 py-2 rounded-md hover:bg-yellowCream"
              >
                Back to Media
              </motion.button>
            </Link>
          </div>
        </div>
      </div>

      {/* Conditionally show Breadcrumbs OR the Back button */}
      {selectedReelIndex === null ? (
        <Breadcrumbs
          aria-label="breadcrumb"
          separator={
            <NavigateNextIcon fontSize="small" sx={{ color: "#A28436" }} />
          }
          sx={{ color: "#000000", "& .MuiBreadcrumbs-separator": { mx: 0.5 } }}
          className="w-full pt-8 pb-2 pl-16"
        >
          <MuiLink
            underline="hover"
            sx={{ color: "#000000", "&:hover": { color: "#A28436" } }}
            component={Link}
            href="/media"
          >
            Media
          </MuiLink>
          <MuiLink
            underline="hover"
            sx={{ color: "#000000", "&:hover": { color: "#A28436" } }}
            component={Link}
            href="/media/fintechtainment"
          >
            FinTechTainment Library
          </MuiLink>
        </Breadcrumbs>
      ) : (
        <div className="w-full pt-8 pb-4 pl-16">
          <button
            onClick={() => setSelectedReelIndex(null)}
            className="flex items-center text-gray-700 font-semibold hover:text-black transition-colors"
          >
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
            Back to FinTech 101 Library
          </button>
        </div>
      )}

      {/* Conditionally render the Tab Bar only when not in player view */}
      {selectedReelIndex === null && (
        <div className="px-4 md:px-16 lg:px-24 mb-6">
          <div className="max-w-lg mx-auto bg-gray-100 rounded-lg p-1 flex items-center space-x-1 shadow-inner border border-gray-200">
            <button
              onClick={() => setActiveTab("podcast")}
              className={`w-1/2 py-2.5 px-2 text-sm md:text-base rounded-md font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#A28436] focus:ring-opacity-50 ${
                activeTab === "podcast"
                  ? "bg-[#DBB968] text-[#1E264A] shadow-md"
                  : "bg-transparent text-gray-500 hover:bg-gray-200"
              }`}
            >
              FinTechTainment Podcast
            </button>
            <button
              onClick={() => setActiveTab("fintech101")}
              className={`w-1/2 py-2.5 px-2 text-sm md:text-base rounded-md font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#A28436] focus:ring-opacity-50 ${
                activeTab === "fintech101"
                  ? "bg-[#DBB968] text-[#1E264A] shadow-md"
                  : "bg-transparent text-gray-500 hover:bg-gray-200"
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
          <div className="relative px-4 md:px-16 lg:px-24">
            <LabelSort
              availableLabels={availablePodcastLabels}
              onSelect={handlePodcastLabelSelect}
            />
          </div>
          {renderPodcastContent()}
        </>
      )}

      {activeTab === "fintech101" && (
        <div className="px-4 pb-8 md:px-16 lg:px-24">
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

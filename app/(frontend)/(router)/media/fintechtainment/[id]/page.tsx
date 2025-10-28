"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import MuiLink from "@mui/material/Link";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { motion } from "framer-motion";
import Image from "next/image";
import axios from "axios";
import { CircularProgress } from "@mui/material";

// --- INTERFACES (no changes needed here) ---
interface GuestSpeaker {
  name: string;
  description: string;
  avatar_url: string;
  linkedIn_url: string;
}

interface ApiPodcast {
  _id: string;
  title: string;
  summary: string;
  publicationDate: string;
  video_url: string;
  thumbnail_url: string;
  labels: string[];
  guest_speaker: GuestSpeaker;
}

interface SidebarPodcast {
  _id: string;
  title: string;
  publicationDate: string;
  thumbnail_url: string;
}

// Helper function
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

const formatPublicationDate = (isoString: string): string => {
  const dateObj = new Date(isoString);
  const day = addOrdinalSuffix(dateObj.getDate());
  const month = dateObj.toLocaleString("en-US", { month: "long" });
  const year = dateObj.getFullYear();
  return `${month} ${day}, ${year}`;
};

export default function SpecificPodcast({
  params,
}: {
  params: { id: string };
}) {
  // --- STATE MANAGEMENT ---
  const [podcast, setPodcast] = useState<ApiPodcast | null>(null);
  // Updated state to handle the dynamic sidebar content
  const [sidebarPodcasts, setSidebarPodcasts] = useState<SidebarPodcast[]>([]);
  const [sidebarTitle, setSidebarTitle] = useState("Related Podcasts");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --- DATA FETCHING ---
  useEffect(() => {
    if (!params.id) return;

    const fetchPodcastData = async () => {
      setLoading(true);
      setError("");
      try {
        // Fetch data and destructure the new response shape
        const response = await axios.get(`/api/v1/podcast/${params.id}`);
        const {
          podcast: fetchedPodcast,
          sidebarTitle,
          sidebarPodcasts,
        } = response.data;

        // Set the state with the data from the API
        setPodcast(fetchedPodcast);
        setSidebarTitle(sidebarTitle);
        setSidebarPodcasts(sidebarPodcasts);
      } catch (err) {
        console.error("Error fetching podcast:", err);
        setError("Could not load the podcast. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPodcastData();
  }, [params.id]);

  // --- CONDITIONAL RENDERING ---
  if (loading) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center h-screen">
        <CircularProgress sx={{ color: "#DCB968" }} />
        <p className="mt-4 text-lg text-[#5E5E92]">Loading</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="relative w-[87vw] h-48 md:h-64 p-[4px] rounded-lg bg-gradient-to-b from-[#DCB968] to-[#F7D27F]">
          <div className="flex flex-col items-center justify-center w-full h-full bg-[#F9FAFB] rounded-[7px] text-center px-4">
            <p className="text-5xl font-bold mb-4">⚠️</p>
            <p className="text-[#2C305F] text-xl">{error}</p>
            <div
              className="w-fit h-fit rounded-md p-[2px] mt-[1.5rem]"
              style={{
                background: "linear-gradient(to top, #474A6E, #DBB968)",
              }}
            >
              <Link href="/media/fintechtainment">
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 1.1 }}
                  className="bg-ft-primary-blue-300 text-bluePrimary font-semibold px-4 py-2 rounded-md hover:bg-yellowCream"
                >
                  Back to Fintechtainment Library
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!podcast) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="relative w-[87vw] h-48 md:h-64 p-[4px] rounded-lg bg-gradient-to-b from-[#DCB968] to-[#F7D27F]">
          <div className="flex flex-col items-center justify-center w-full h-full bg-[#F9FAFB] rounded-[7px] text-center px-4">
            <Image
              src="/error-404-New.png"
              alt="404 Not Found"
              width={50}
              height={50}
              loading="lazy"
              className="mb-4"
            />
            <h3 className="text-2xl font-bold text-[#2C305F] mb-2">
              Podcast Not Found
            </h3>
            <div
              className="w-fit h-fit rounded-md p-[2px] mt-[0.5rem]"
              style={{
                background: "linear-gradient(to top, #474A6E, #DBB968)",
              }}
            >
              <Link href="/media/fintechtainment">
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 1.1 }}
                  className="bg-ft-primary-blue-300 text-bluePrimary font-semibold px-4 py-2 rounded-md hover:bg-yellowCream"
                >
                  Back to Fintechtainment Library
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="relative mb-6">
      {/* HERO SECTION */}
      <div
        className="w-screen h-[92vh] flex items-center justify-center px-16"
        style={{
          background: "linear-gradient(to bottom, #0D1742 62%, #DBB968 100%)",
        }}
      >
        <div className="flex flex-col justify-center z-30 w-full">
          <div className="flex flex-wrap gap-2 mb-4">
            {podcast.labels.map((label) => (
              <div
                key={label}
                className="p-2 rounded-lg bg-ft-primary-yellow-200 text-sm font-medium text-[#0D1742]"
              >
                {label}
              </div>
            ))}
          </div>
          <h1 className="text-4xl font-bold text-ft-text-bright">
            {podcast.title}
          </h1>
          <p className="font-medium text-base text-white text-justify py-4 whitespace-pre-wrap">
            {podcast.summary}
          </p>
          <section className="flex flex-row justify-start gap-4">
            <div
              className="w-fit h-fit rounded-md p-[2px] mt-[0.5rem]"
              style={{
                background: "linear-gradient(to top, #474A6E, #DBB968)",
              }}
            >
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 1.1 }}
                className="bg-ft-primary-blue-300 text-bluePrimary font-semibold px-4 py-2 rounded-md hover:bg-yellowCream"
                onClick={() => {
                  const element = document.getElementById("podcast-episode");
                  if (element) {
                    // Use the browser's built-in smooth scrolling
                    element.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                View Podcast
              </motion.button>
            </div>
            <div
              className="w-fit h-fit rounded-md p-[2px] mt-[0.5rem]"
              style={{
                background: "linear-gradient(to top, #474A6E, #DBB968)",
              }}
            >
              <Link href="/media/fintechtainment">
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 1.1 }}
                  className="bg-ft-primary-blue-300 text-bluePrimary font-semibold px-4 py-2 rounded-md hover:bg-yellowCream"
                >
                  Back to Podcast Library
                </motion.button>
              </Link>
            </div>
          </section>
        </div>
      </div>

      {/* BREADCRUMBS */}
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={
          <NavigateNextIcon fontSize="small" sx={{ color: "#A28436" }} />
        }
        className="w-full py-8 px-16"
      >
        <MuiLink
          component={Link}
          href="/media"
          sx={{ color: "#000000", "&:hover": { color: "#A28436" } }}
        >
          Media
        </MuiLink>
        <MuiLink
          component={Link}
          href="/media/fintechtainment"
          sx={{ color: "#000000", "&:hover": { color: "#A28436" } }}
        >
          FinTechTainment Library
        </MuiLink>
        <MuiLink
          component={Link}
          href={`/media/fintechtainment/${podcast._id}`}
          sx={{ color: "#000000", "&:hover": { color: "#A28436" } }}
        >
          {podcast.title}
        </MuiLink>
      </Breadcrumbs>

      <div
        id="podcast-episode"
        className="flex justify-center pb-12 px-16 gap-8"
      >
        {/* Main Content Area */}
        <div className="w-full max-w-4xl">
          <div className="relative aspect-video w-full">
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
              src={podcast.video_url}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
          <div>
            <h1 className="text-3xl mt-6 font-bold text-ft-primary-blue-50">
              {podcast.title}
            </h1>
            <p className="text-ft-primary-blue-200 mt-2 italic">
              Published on {formatPublicationDate(podcast.publicationDate)}
            </p>
          </div>
          {/* --- Guest Speaker Section --- */}
          <div className="flex my-8 border-2 border-ft-primary-yellow-50 rounded-2xl shadow-lg overflow-hidden">
            <div className="relative bg-ft-primary-blue-200 w-1/3 flex-shrink-0">
              <Image
                src={podcast.guest_speaker.avatar_url}
                alt={podcast.guest_speaker.name}
                fill
                className="object-cover p-4"
              />
            </div>

            {/* Text content container */}
            <div className="bg-ft-primary-blue-300 p-6 w-2/3 self-stretch flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-2xl text-ft-primary-blue-50">
                  {podcast.guest_speaker.name}
                </h3>
                <p className="text-[#000000] mt-2 text-base text-justify">
                  {podcast.guest_speaker.description}
                </p>
              </div>

              {/* LinkedIn link with hover effect */}
              <div className="mt-4 self-start">
                <a
                  href={podcast.guest_speaker.linkedIn_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block transition-transform duration-200 hover:scale-110 border-solid border-2 border-[#2C305F] p-2 rounded-lg hover:bg-[#FFEFCA]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#2C305F"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Back to Library Button */}
          <div
            className="w-fit h-fit rounded-md p-[2px] mt-[2rem]"
            style={{
              background: "linear-gradient(to top, #474A6E, #DBB968)",
            }}
          >
            <a href="/media/fintechtainment">
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 1.1 }}
                className="bg-ft-primary-blue-300 text-bluePrimary font-semibold px-4 py-2 rounded-md hover:bg-yellowCream"
              >
                Back to FinTechTainment Library
              </motion.button>
            </a>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full max-w-[17.75rem] flex flex-col gap-8">
          <div className="relative">
            {/* 1. Title is now dynamic */}
            <h2 className="text-3xl font-bold text-[#0D1742] mb-4">
              {sidebarTitle}
            </h2>

            {/* 2. Logic now uses the new state variables */}
            <div className="flex flex-col gap-4">
              {sidebarPodcasts.map((item) => (
                <Link
                  href={`/media/fintechtainment/${item._id}`}
                  key={item._id}
                  className="flex flex-col items-center bg-white rounded-2xl shadow-lg border-2 border-transparent hover:border-[#DBB968] overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative w-full h-40 flex-shrink-0">
                    <Image
                      src={item.thumbnail_url}
                      alt={item.title}
                      layout="fill"
                      objectFit="fill"
                    />
                  </div>
                  <div className="p-4 w-full">
                    <p className="font-bold text-sm text-[#0D1742] leading-tight">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatPublicationDate(item.publicationDate)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Mascot image (no changes) */}
            <div className="absolute right-[-12.5rem] bottom-[-22rem]">
              <Image
                src="https://d2prwyp3rwi40.cloudfront.net/global/Mascot+-+M%E1%BA%B7t+tr%C6%B0%E1%BB%9Bc.svg"
                alt="Mascot"
                width={200}
                height={500}
                loading="lazy"
                className="w-[25vw] h-auto -rotate-[35deg]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

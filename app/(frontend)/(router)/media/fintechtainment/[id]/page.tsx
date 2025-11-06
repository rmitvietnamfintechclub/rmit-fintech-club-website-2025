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

// --- INTERFACES (no changes) ---
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

// --- HELPER FUNCTIONS (no changes) ---
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
  // --- STATE MANAGEMENT (no changes) ---
  const [podcast, setPodcast] = useState<ApiPodcast | null>(null);
  const [sidebarPodcasts, setSidebarPodcasts] = useState<SidebarPodcast[]>([]);
  const [sidebarTitle, setSidebarTitle] = useState("Related Podcasts");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --- DATA FETCHING (no changes) ---
  useEffect(() => {
    if (!params.id) return;

    const fetchPodcastData = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(`/api/v1/podcast/${params.id}`);
        const {
          podcast: fetchedPodcast,
          sidebarTitle,
          sidebarPodcasts,
        } = response.data;

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

  // --- CONDITIONAL RENDERING (Responsive) ---
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
      <div className="h-screen flex items-center justify-center p-4">
        {/* Responsive Error Card */}
        <div className="relative w-[90vw] max-w-xl h-auto md:h-64 p-1 rounded-lg bg-gradient-to-b from-[#DCB968] to-[#F7D27F]">
          <div className="flex flex-col items-center justify-center w-full h-full bg-[#F9FAFB] rounded-[7px] text-center p-6 md:p-4">
            <p className="text-4xl md:text-5xl font-bold mb-4">⚠️</p>
            <p className="text-[#2C305F] text-lg md:text-xl">{error}</p>
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
      <div className="h-screen flex items-center justify-center p-4">
        {/* Responsive 404 Card */}
        <div className="relative w-[90vw] max-w-xl h-auto md:h-64 p-1 rounded-lg bg-gradient-to-b from-[#DCB968] to-[#F7D27F]">
          <div className="flex flex-col items-center justify-center w-full h-full bg-[#F9FAFB] rounded-[7px] text-center p-6 md:p-4">
            <Image
              src="/error-404-New.png"
              alt="404 Not Found"
              width={50}
              height={50}
              loading="lazy"
              className="mb-4"
            />
            <h3 className="text-xl md:text-2xl font-bold text-[#2C305F] mb-2">
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

  // --- MAIN COMPONENT RENDER (Responsive) ---
  return (
    <section className="relative mb-6">
      {/* HERO SECTION (Responsive) */}
      <div
        className="w-screen min-h-[70vh] md:h-[92vh] flex items-center justify-center px-6 md:px-16 max-md:py-12"
        style={{
          background: "linear-gradient(to bottom, #0D1742 62%, #DBB968 100%)",
        }}
      >
        <div className="flex flex-col justify-center z-30 w-full max-w-6xl">
          {/* Added max-w for large screens */}
          <div className="flex flex-wrap max-md:justify-center gap-2 mb-4">
            {podcast.labels.map((label) => (
              <div
                key={label}
                className="p-2 rounded-lg bg-ft-primary-yellow-200 text-sm font-medium text-[#0D1742]"
              >
                {label}
              </div>
            ))}
          </div>
          {/* Responsive Title */}
          <h1 className="text-2xl md:text-4xl max-md:text-center font-bold text-ft-text-bright">
            {podcast.title}
          </h1>
          <p className="font-medium text-base text-white text-left md:text-justify py-2 whitespace-pre-wrap max-w-3xl">
            {podcast.summary}
          </p>
          {/* Responsive Buttons: stack on mobile, row on small+ */}
          <section className="flex flex-col sm:flex-row justify-start gap-2 md:gap-4">
            <div
              className="w-full md:w-fit h-fit rounded-md p-[2px] mt-[0.5rem]"
              style={{
                background: "linear-gradient(to top, #474A6E, #DBB968)",
              }}
            >
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 1.1 }}
                className="w-full bg-ft-primary-blue-300 text-bluePrimary font-semibold px-4 py-2 rounded-md hover:bg-yellowCream"
                onClick={() => {
                  const element = document.getElementById("podcast-episode");
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                View Podcast
              </motion.button>
            </div>
            <div
              className="w-full md:w-fit h-fit rounded-md p-[2px] mt-[0.5rem]"
              style={{
                background: "linear-gradient(to top, #474A6E, #DBB968)",
              }}
            >
              <Link href="/media/fintechtainment">
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 1.1 }}
                  className="w-full bg-ft-primary-blue-300 text-bluePrimary font-semibold px-4 py-2 rounded-md hover:bg-yellowCream"
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
        sx={{ color: "#000000", "& .MuiBreadcrumbs-separator": { mx: 0.5 } }}
        className="w-full py-8 px-6 md:px-16"
      >
        <MuiLink
          underline="hover"
          sx={{
            color: "#000000",
            "&:hover": { color: "#A28436" },
            textDecoration: "underline",
            "@media (min-width: 768px)": {
              textDecoration: "none",
            },
          }}
          component={Link}
          href="/media"
        >
          Media
        </MuiLink>
        <MuiLink
          underline="hover"
          sx={{
            color: "#000000",
            "&:hover": { color: "#A28436" },
            textDecoration: "underline",
            "@media (min-width: 768px)": {
              textDecoration: "none",
            },
          }}
          component={Link}
          href="/media/fintechtainment"
        >
          FinTechTainment Library
        </MuiLink>
        <MuiLink
          underline="hover"
          sx={{
            color: "#000000",
            "&:hover": { color: "#A28436" },
            display: "inline-block",
            maxWidth: "90vw",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            textDecoration: "underline",
            verticalAlign: "bottom",
            "@media (min-width: 768px)": {
              maxWidth: "none",
              textDecoration: "none",
            },
          }}
          component={Link}
          href={`/media/fintechtainment/${podcast._id}`}
        >
          {podcast.title}
        </MuiLink>
      </Breadcrumbs>

      {/* --- CONTENT AREA (Responsive) --- */}
      <div
        id="podcast-episode"
        // Stacks vertically on mobile, row on desktop
        className="flex flex-col md:flex-row justify-center pb-8 md:pb-12 px-4 md:px-16 md:gap-12"
      >
        {/* Main Content Area (Left) */}
        <div className="w-full md:max-w-4xl">
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
            {/* Responsive title */}
            <h1 className="text-2xl md:text-3xl mt-6 font-bold text-ft-primary-blue-50">
              {podcast.title}
            </h1>
            <p className="text-ft-primary-blue-200 mt-2 italic">
              Published on {formatPublicationDate(podcast.publicationDate)}
            </p>
          </div>

          <div className="pt-20 max-md:max-w-md max-md:mx-auto my-8">
            {/* Card: Set to relative to contain the absolute image */}
            <div className="relative bg-ft-primary-blue-300 rounded-2xl shadow-lg p-6 pt-28">
              {/* Avatar: Absolute, centered, and overlapping the top */}
              <div className="absolute -top-24 left-4 max-md:left-1/2 max-md:-translate-x-1/2 w-48 h-48 rounded-full bg-[#5E5E92] border-4 border-ft-primary-yellow-50 shadow-xl overflow-hidden">
                <Image
                  src={podcast.guest_speaker.avatar_url}
                  alt={`Headshot of ${podcast.guest_speaker.name}`}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="max-md:text-center">
                <h3 className="font-bold text-2xl md:text-3xl md:text-left text-ft-primary-blue-50">
                  {podcast.guest_speaker.name}
                </h3>

                <p className="text-[#000000] mt-2 text-sm md:text-base text-center md:text-left">
                  {podcast.guest_speaker.description}
                </p>

                {/* LinkedIn Link */}
                <div className="max-md:text-center mt-6 md:mt-4 md:self-start">
                  <a
                    href={podcast.guest_speaker.linkedIn_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${podcast.guest_speaker.name}'s profile on LinkedIn`} // Accessibility
                    className="inline-flex items-center gap-2.5 transition-transform duration-200 hover:scale-105 border-solid border-2 border-[#2C305F] py-2 px-3 rounded-lg hover:bg-[#FFEFCA] text-[#2C305F]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24" // Reduced size to better match text
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor" // Inherits color from parent's text-[]
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                    {/* ADDED: Text label for clarity */}
                    <span className="font-medium text-sm">View Profile</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Back to Library Button */}
          <div
            className="max-md:hidden w-fit h-fit rounded-md p-[2px] mt-[2rem]"
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

        {/* Right Sidebar (Responsive) */}
        {/* Full width on mobile with margin-top, fixed width on desktop */}
        <div className="w-full md:w-full md:max-w-[17.75rem]">
          <div className="relative">
            <h2 className="text-3xl font-bold text-[#0D1742] mb-4">
              {sidebarTitle}
            </h2>

            <div className="flex flex-col gap-4">
              {sidebarPodcasts.map((item) => (
                <Link
                  href={`/media/fintechtainment/${item._id}`}
                  key={item._id}
                  className="flex flex-col items-center bg-white rounded-2xl shadow-lg border-2 border-transparent hover:border-[#DBB968] overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative w-full h-52 md:h-40 flex-shrink-0">
                    <Image
                      src={item.thumbnail_url}
                      alt={item.title}
                      layout="fill"
                      objectFit="fill" // Changed from "fill" to "cover" to prevent stretching
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

            {/* Mascot image: Hidden on mobile, visible on desktop */}
            <div className="absolute right-[-12.5rem] bottom-[-22rem] hidden md:block">
              <Image
                src="https://d2uq10394z5icp.cloudfront.net/global/Mascot+-+M%E1%BA%B7t+tr%C6%B0%E1%BB%9Bc.svg"
                alt="Mascot"
                width={200}
                height={500}
                loading="lazy"
                className="w-[25vw] h-auto -rotate-[35deg]"
              />
            </div>

            {/* Back to Library Button */}
            <div
              className="md:hidden w-fit h-fit rounded-md p-[2px] mt-[2rem] mx-auto"
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
        </div>
      </div>
    </section>
  );
}

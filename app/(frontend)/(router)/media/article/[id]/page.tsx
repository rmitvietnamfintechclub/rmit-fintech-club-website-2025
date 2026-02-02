"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Spinner } from "@heroui/react";
import Image from "next/image";
import axios from "axios";

interface ApiArticle {
  _id: string;
  title: string;
  summary: string;
  content_url: string;
  illustration_url: string;
  labels: string[];
  authors: string[];
  publicationDate: string;
}
interface SidebarArticle {
  _id: string;
  title: string;
  illustration_url: string;
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

const formatPublicationDate = (isoString: string): string => {
  const dateObj = new Date(isoString);
  const day = addOrdinalSuffix(dateObj.getDate());
  const month = dateObj.toLocaleString("en-US", { month: "long" });
  const year = dateObj.getFullYear();
  return `${month} ${day}, ${year}`;
};

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
    className="mx-2 flex-shrink-0"
  >
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const ExternalLinkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="ml-2"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15 3 21 3 21 9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
  </svg>
);

const FileIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#DBB968"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="M16 13H8" />
    <path d="M16 17H8" />
    <path d="M10 9H8" />
  </svg>
);

const ActionButton = ({
  text,
  onClick,
}: {
  text: string;
  onClick?: () => void;
}) => (
  <motion.button
    className="bg-ft-primary-blue-300 text-bluePrimary font-semibold px-4 py-2 rounded-md hover:bg-yellowCream w-full transition-colors duration-200"
    onClick={onClick}
  >
    {text}
  </motion.button>
);

export default function SpecificArticle({
  params,
}: {
  params: { id: string };
}) {
  // --- STATE MANAGEMENT ---
  const [article, setArticle] = useState<ApiArticle | null>(null);
  const [sidebarArticles, setSidebarArticles] = useState<SidebarArticle[]>([]);
  const [sidebarTitle, setSidebarTitle] = useState("Related Articles");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --- DATA FETCHING ---
  useEffect(() => {
    if (!params.id) return;

    const fetchArticleData = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(`/api/v1/article/${params.id}`);
        const {
          article: fetchedArticle,
          sidebarTitle,
          sidebarArticles,
        } = response.data;

        setArticle(fetchedArticle);
        setSidebarTitle(sidebarTitle);
        setSidebarArticles(sidebarArticles);
      } catch (err) {
        console.error("Error fetching article:", err);
        setError("Could not load the article. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticleData();
  }, [params.id]);

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
            Loading Article...
          </p>
        </div>
      );
    }

  // --- ERROR STATE ---
  if (error) {
    return (
      <div className="h-screen flex items-center justify-center p-4">
        <div className="relative w-11/12 md:w-[87vw] h-auto md:h-64 p-[4px] rounded-lg bg-gradient-to-b from-[#DCB968] to-[#F7D27F]">
          <div className="flex flex-col items-center justify-center w-full h-full bg-[#F9FAFB] rounded-[7px] text-center px-4 py-8 md:py-0">
            <p className="text-5xl font-bold mb-4">⚠️</p>
            <p className="text-[#2C305F] text-lg md:text-xl">{error}</p>
            <div
              className="w-fit h-fit rounded-md p-[2px] mt-[1.5rem]"
              style={{
                background: "linear-gradient(to top, #474A6E, #DBB968)",
              }}
            >
              <Link href="/media/article">
                <ActionButton text="Back to Article Library" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- NOT FOUND STATE ---
  if (!article) {
    return (
      <div className="h-screen flex items-center justify-center p-4">
        <div className="relative w-11/12 md:w-[87vw] h-auto md:h-64 p-[4px] rounded-lg bg-gradient-to-b from-[#DCB968] to-[#F7D27F]">
          <div className="flex flex-col items-center justify-center w-full h-full bg-[#F9FAFB] rounded-[7px] text-center px-4 py-8 md:py-0">
            <Image
              src="/error-404-New.png"
              alt="404 Not Found"
              width={50}
              height={50}
              loading="lazy"
              className="mb-4"
            />
            <h3 className="text-xl md:text-2xl font-bold text-[#2C305F] mb-2">
              Article Not Found
            </h3>
            <div
              className="w-fit h-fit rounded-md p-[2px] mt-[0.5rem]"
              style={{
                background: "linear-gradient(to top, #474A6E, #DBB968)",
              }}
            >
              <Link href="/media/article">
                <ActionButton text="Back to Article Library" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- MAIN COMPONENT RENDER ---
  return (
    <section className="relative overflow-hidden">
      {/* HERO SECTION */}
      <div
        className="w-screen h-auto md:h-[92vh] flex flex-col md:flex-row items-center justify-center md:justify-between px-6 md:px-16 max-md:pb-12 max-md:pt-4"
        style={{
          background: "linear-gradient(to bottom, #0D1742 62%, #DBB968 100%)",
        }}
      >
        {/* Text content */}
        <div className="flex flex-col items-center md:items-start justify-center z-30 w-full">
          <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
            {article.labels?.map((label) => (
              <div
                key={label}
                className="p-2 rounded-lg bg-ft-primary-yellow-200 text-sm font-medium"
              >
                {label}
              </div>
            ))}
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-ft-text-bright text-center md:text-left">
            {article.title}
          </h1>
          <p className="font-medium text-base text-white text-left md:text-justify py-2 whitespace-pre-wrap">
            {article.summary}
          </p>

          {/* Buttons Section */}
          <section className="flex flex-col md:flex-row justify-center md:justify-start gap-2 md:gap-4 w-full md:w-auto">
            <div
              className="w-full sm:w-fit h-fit rounded-md p-[2px] mt-[0.5rem]"
              style={{
                background: "linear-gradient(to top, #474A6E, #DBB968)",
              }}
            >
              <ActionButton
                text="Read Article"
                onClick={() => {
                  const element = document.getElementById("article");
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              />
            </div>
            <div
              className="w-full sm:w-fit h-fit rounded-md p-[2px] mt-[0.5rem]"
              style={{
                background: "linear-gradient(to top, #474A6E, #DBB968)",
              }}
            >
              <Link href="/media/article" className="w-full">
                <ActionButton text="Back to Article Library" />
              </Link>
            </div>
          </section>
        </div>
      </div>

      {/* --- BREADCRUMBS (Native Tailwind Implementation) --- */}
      <nav aria-label="Breadcrumb" className="w-full py-8 px-6 md:px-16">
        <ol className="flex items-center flex-wrap">
          <li className="flex items-center">
            <Link
              href="/media"
              className="text-black hover:text-[#A28436] transition-colors hover:underline underline-offset-4"
            >
              Media
            </Link>
            <ChevronRightIcon />
          </li>
          <li className="flex items-center">
            <Link
              href="/media/article"
              className="text-black hover:text-[#A28436] transition-colors hover:underline underline-offset-4"
            >
              Article Library
            </Link>
            <ChevronRightIcon />
          </li>
          <li className="flex items-center min-w-0">
            <span
              className="text-black font-semibold truncate max-w-[150px] md:max-w-none cursor-default"
              title={article.title}
            >
              {article.title}
            </span>
          </li>
        </ol>
      </nav>

      {/* MAIN CONTENT SECTION */}
      <div
        id="article"
        className="flex flex-col md:flex-row justify-center pb-12 px-6 md:px-16 gap-8"
      >
        {/* PDF VIEWER CONTAINER */}
        <div className="w-full md:max-w-4xl">
          {/* --- 1. DESKTOP: INLINE VIEWER (Hidden on Mobile) --- */}
          <div className="hidden md:block w-full h-[150vh] rounded-lg shadow-lg bg-gray-100 overflow-hidden border border-gray-200">
            <iframe
              src={article.content_url}
              title="PDF Viewer"
              className="w-full h-full"
              aria-label="PDF article preview"
            />
          </div>

          {/* --- 2. MOBILE: PDF CARD (Visible on Mobile Only) --- */}
          <div className="md:hidden w-full bg-white rounded-xl shadow-md border border-gray-200 p-6 flex flex-col items-center text-center">
            <div className="bg-ft-primary-yellow-100/20 p-4 rounded-full mb-4">
              <FileIcon />
            </div>
            <h3 className="text-xl font-bold text-[#2C305F] mb-2">
              Read the Full Article
            </h3>
            <p className="text-gray-500 text-sm mb-6 max-w-xs">
              This document is optimized for reading on your device's native PDF
              viewer.
            </p>

            <a
              href={article.content_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <motion.button
                whileTap={{ scale: 0.98 }}
                className="w-full bg-[#2C305F] text-white font-semibold py-3.5 px-6 rounded-lg shadow-md flex items-center justify-center gap-2 hover:bg-[#1f2244] transition-colors"
              >
                Open PDF
                <ExternalLinkIcon />
              </motion.button>
            </a>
          </div>

          {/* Back Button (Desktop positioning) */}
          <div
            className="hidden md:block w-fit h-fit rounded-md p-[2px] mt-[2rem] mb-12 md:mb-20 mx-auto"
            style={{
              background: "linear-gradient(to top, #474A6E, #DBB968)",
            }}
          >
            <Link href="/media/article">
              <ActionButton text="Back to Article Library" />
            </Link>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="w-full md:w-full md:max-w-[16rem] flex flex-col gap-4">
          {/* Author Section */}
          {article.authors?.length > 0 && (
            <div className="p-6 rounded-lg shadow-md border-2 border-[#DBB968] bg-white">
              <h2 className="text-3xl font-bold text-[#DBB968] mb-4">
                Authors
              </h2>
              <div className="divide-y divide-gray-200">
                {article.authors.map((authorName, index) => (
                  <div key={index} className="py-4 last:pb-0 first:pt-0">
                    <p className="text-lg font-semibold text-[#000000]">
                      {authorName}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-3xl font-bold text-ft-primary-yellow-100 mb-4">
              {sidebarTitle}
            </h2>
            <div
              className="
                flex flex-row md:flex-col 
                gap-4 
                overflow-x-auto snap-x snap-mandatory md:overflow-visible 
                pb-4 md:pb-0 
                scrollbar-hide /* Cần thêm plugin hoặc style ẩn scrollbar */
            "
              style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
            >
              {sidebarArticles.map((item) => (
                <Link
                  href={`/media/article/${item._id}`}
                  key={item._id}
                  className="
                    group flex flex-col bg-white rounded-lg overflow-hidden border-2 border-gray-200 md:border-transparent hover:border-[#DBB968] hover:shadow-lg transition-all duration-300
                    /* --- CAROUSEL STYLES --- */
                    flex-shrink-0 
                    w-[80vw] sm:w-[45vw] md:w-full
                    snap-center
                  "
                >
                  <div className="relative w-full h-96 md:h-72 overflow-hidden">
                    <Image
                      src={item.illustration_url}
                      alt={item.title}
                      layout="fill"
                      objectFit="fill"
                      className="transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4 bg-gray-50 rounded-b-lg flex-grow">
                    <p className="font-semibold text-gray-800 text-md leading-snug line-clamp-2">
                      {item.title}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      {formatPublicationDate(item.publicationDate)}
                    </p>
                  </div>
                </Link>
              ))}
              {/* Spacer for mobile scroll */}
              <div className="w-2 md:hidden flex-shrink-0"></div>
            </div>
          </div>

          <div
            className="block md:hidden w-fit h-fit rounded-md p-[2px] mt-0 mx-auto"
            style={{ background: "linear-gradient(to top, #474A6E, #DBB968)" }}
          >
            <Link href="/media/article">
              <ActionButton text="Back to Article Library" />
            </Link>
          </div>
        </div>
      </div>

      {/* Mascot */}
      <div className="absolute bottom-[-9rem] left-0 hidden md:block pointer-events-none">
        <Image
          src="https://d2uq10394z5icp.cloudfront.net/global/Mascot+-+M%E1%BA%B7t+b%C3%AAn.svg"
          alt="Mascot"
          width={200}
          height={500}
          loading="lazy"
          className="w-[25vw] h-auto scale-x-[-1]"
        />
      </div>
    </section>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import LabelSort from "./components/labelSort";
import ArticleCard from "./components/articleCard";
import { motion } from "framer-motion";
import PaginationRounded from "./components/pagination";
import Image from "next/image";
import axios from "axios";

// Interface for the raw data from the API
interface ApiArticle {
  _id: string;
  title: string;
  summary: string;
  illustration_url: string;
  labels: string[];
  publicationDate: string;
}

// Interface for the data structure your ArticleCard component needs
interface DisplayArticle {
  _id: string;
  imageSrc: string;
  imageAlt: string;
  labels: string[];
  title: string;
  description: string;
  date: string;
}

// --- Helper functions for date formatting ---
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

const formatArticleDate = (isoString: string): string => {
  const dateObj = new Date(isoString);
  const day = addOrdinalSuffix(dateObj.getDate());
  const month = dateObj.toLocaleString("en-US", { month: "long" });
  const year = dateObj.getFullYear();
  return `${month} ${day}, ${year}`;
};

// --- Component Icon Mũi tên (Thay thế NavigateNextIcon) ---
const ChevronRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#A28436" // Màu vàng gold của bạn
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

export default function ArticleLibrary() {
  // State for managing API data, loading, and errors
  const [articles, setArticles] = useState<DisplayArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // State for pagination and filtering
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  // State to hold all unique labels for the dropdown
  const [availableLabels, setAvailableLabels] = useState<string[]>([]);

  const itemsPerPage = 5;

  // Effect to fetch all unique labels once on component mount
  useEffect(() => {
    const fetchAllLabels = async () => {
      try {
        const response = await axios.get(`/api/v1/article`);
        const allArticles: ApiArticle[] =
          response.data.articles || response.data || [];

        const allLabelsFlat = allArticles.flatMap((article) => article.labels);
        const uniqueLabels = Array.from(new Set(allLabelsFlat)).sort();
        setAvailableLabels(["All", ...uniqueLabels]);
      } catch (err) {
        console.error("Failed to fetch unique labels:", err);
        setAvailableLabels(["All"]);
      }
    };

    fetchAllLabels();
  }, []);

  // Effect to fetch paginated/filtered articles when page or selectedLabel changes
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: itemsPerPage.toString(),
        });
        if (selectedLabel && selectedLabel !== "All") {
          params.append("labels", selectedLabel);
        }

        const response = await axios.get(
          `/api/v1/article?${params.toString()}`
        );
        const {
          articles: fetchedArticles = [],
          totalPages: fetchedTotalPages = 1,
        } = response.data;

        const formattedArticles: DisplayArticle[] = fetchedArticles.map(
          (article: ApiArticle) => ({
            _id: article._id,
            title: article.title,
            description: article.summary,
            imageSrc: article.illustration_url,
            imageAlt: article.title,
            labels: article.labels,
            date: formatArticleDate(article.publicationDate),
          })
        );

        setArticles(formattedArticles);
        setTotalPages(fetchedTotalPages);
      } catch (err: any) {
        console.error("Error fetching articles:", err);
        setError("Failed to load articles. Please try again later.");
        setArticles([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [page, selectedLabel]);

  const handleLabelSelect = (label: string) => {
    setSelectedLabel(label);
    setPage(1);
  };

  const renderArticleContent = () => {
    if (loading) {
      return (
        <div className="p-8 text-center flex flex-col items-center justify-center h-64">
          {/* ✅ Thay thế CircularProgress bằng Tailwind Spinner */}
          <div className="w-12 h-12 border-[5px] border-[#F0EDFF] border-t-[#DCB968] rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-[#5E5E92] animate-pulse">
            Loading Articles...
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="relative w-[90vw] max-w-4xl h-48 mx-auto mt-4 mb-10 md:h-64 p-[4px] rounded-lg bg-gradient-to-b from-[#DCB968] to-[#F7D27F]">
          <div className="flex flex-col items-center justify-center w-full h-full bg-[#F9FAFB] rounded-[7px] text-center px-4">
            <p className="text-5xl font-bold mb-4">⚠️</p>
            <p className="text-[#2C305F] text-lg md:text-xl">{error}</p>
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="py-6 px-6 md:px-12 lg:px-24">
          {articles.map((article) => (
            <Link href={`/media/article/${article._id}`} key={article._id}>
              <ArticleCard
                imageSrc={article.imageSrc}
                imageAlt={article.imageAlt}
                labels={article.labels}
                title={article.title}
                description={article.description}
                date={article.date}
              />
            </Link>
          ))}
        </div>
        {totalPages > 1 && (
          <div className="flex justify-center">
            <PaginationRounded
              page={page}
              onPageChange={(value) => setPage(value)}
              count={totalPages}
            />
          </div>
        )}
      </>
    );
  };

  return (
    <section className="overflow-x-hidden">
      {/* --- Responsive Hero Section --- */}
      <div
        className="w-screen h-[70vh] md:h-[92vh] flex items-center justify-center relative"
        style={{
          background: "linear-gradient(to bottom, #474A6E, #DBB968)",
        }}
      >
        <div className="absolute w-screen h-full z-10">
          <Image
            src="https://d2uq10394z5icp.cloudfront.net/media/article/BiWeeklyArticle-LandscapePoster.png"
            alt="Bi-Weekly Article Poster"
            fill
            priority
            className="object-cover opacity-15"
          />
        </div>
        <div className="absolute w-screen h-screen top-[-20vh] left-[2vw] z-20 hidden md:block">
          <Image
            src="https://d2uq10394z5icp.cloudfront.net/media/YellowStars.png"
            alt="Yellow Stars"
            width={1200}
            height={800}
            className="w-full h-auto"
            loading="lazy"
          />
        </div>
        <div className="flex flex-col items-center justify-center z-30 mt-[2vh] md:mt-[17vh] px-6">
          <h1 className="text-4xl md:text-7xl lg:text-[9vh] font-bold text-center text-[#2C305F] drop-shadow-[1.5px_1.5px_0_#DCB968]">
            Bi-weekly Article
          </h1>
          <p className="leading-6 font-medium text-base text-white w-[90vw] md:w-[50vw] text-justify py-6 max-md:py-4">
            Welcome to the Bi-weekly Article Series, where curiosity meets
            analysis at the intersection of finance and technology. Our
            articles, crafted by dedicated members of the FinTech Club, blend
            academic depth with real-world relevance, providing you with
            rigorously researched insights into emerging industry trends
            alongside pivotal global economic events. Explore our latest work
            and discover what’s truly shaping the industry today.
          </p>
          <div
            className="w-fit h-fit rounded-md p-[2px] mt-[1.5rem] max-md:mt-0"
            style={{
              background: "linear-gradient(to top, #474A6E, #DBB968)",
            }}
          >
            <Link href="/media">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="bg-[#2C305F] text-[#DBB968] font-semibold px-4 py-2 rounded-md hover:bg-[#F0EDFF] hover:text-[#2C305F] transition-colors duration-200 border border-transparent hover:border-[#2C305F]"
              >
                Back to Media
              </motion.button>
            </Link>
          </div>
        </div>
      </div>

      {/* --- Responsive Breadcrumbs (Native Tailwind) --- */}
      <nav
        aria-label="Breadcrumb"
        className="w-full py-8 max-md:py-4 px-6 md:pl-16"
      >
        <ol className="flex items-center space-x-2">
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
            <span 
              className="text-black font-semibold truncate max-w-[150px] md:max-w-none cursor-default"
            >
              Article Library
            </span>
          </li>
        </ol>
      </nav>

      {/* --- Responsive LabelSort --- */}
      <div className="relative pb-4 max-md:pb-0 px-6 md:pl-24">
        <LabelSort
          availableLabels={availableLabels}
          onSelect={handleLabelSelect}
        />
      </div>

      {renderArticleContent()}
    </section>
  );
}

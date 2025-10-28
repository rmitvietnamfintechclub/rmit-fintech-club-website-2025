"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import MuiLink from "@mui/material/Link";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import LabelSort from "./components/labelSort";
import ArticleCard from "./components/articleCard";
import { motion } from "framer-motion";
import PaginationRounded from "./components/pagination";
import Image from "next/image";
import axios from "axios";
import { CircularProgress } from "@mui/material";

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
        // Assuming the API without params returns all articles
        const response = await axios.get(`/api/v1/article`);
        const allArticles: ApiArticle[] =
          response.data.articles || response.data || [];

        // Use a Set to get only unique labels
        const allLabelsFlat = allArticles.flatMap((article) => article.labels);
        const uniqueLabels = Array.from(new Set(allLabelsFlat)).sort();

        // Add "All" option to the beginning
        setAvailableLabels(["All", ...uniqueLabels]);
      } catch (err) {
        console.error("Failed to fetch unique labels:", err);
        // Set a default or handle the error
        setAvailableLabels(["All"]);
      }
    };

    fetchAllLabels();
  }, []); // Empty dependency array ensures this runs only once

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
    setPage(1); // Reset to first page when filter changes
  };

  const handleBreadcrumbClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    console.info("You clicked a breadcrumb.");
  };

  const renderArticleContent = () => {
    if (loading) {
      return (
        <div className="p-8 text-center flex flex-col items-center justify-center h-64">
          <CircularProgress sx={{ color: "#DCB968" }} />
          <p className="mt-4 text-lg text-[#5E5E92]">Loading Articles</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="relative w-[87vw] h-48 mx-auto mt-4 mb-10 md:h-64 p-[4px] rounded-lg bg-gradient-to-b from-[#DCB968] to-[#F7D27F]">
          <div className="flex flex-col items-center justify-center w-full h-full bg-[#F9FAFB] rounded-[7px] text-center px-4">
            <p className="text-5xl font-bold mb-4">
              ⚠️
            </p>
            <p className="text-[#2C305F] text-xl">
              {error}
            </p>
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="py-6 px-24">
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
    <section>
      <div
        className="w-screen h-[92vh] flex items-center justify-center"
        style={{
          background: "linear-gradient(to bottom, #474A6E, #DBB968)",
        }}
      >
        <div className="absolute w-screen h-[92vh] z-10">
          <Image
            src="https://d2prwyp3rwi40.cloudfront.net/media/article/BiWeeklyArticle-LandscapePoster.png"
            alt="Bi-Weekly Article Poster"
            fill
            priority
            className="object-cover opacity-15"
          />
        </div>
        <div className="absolute w-screen h-screen top-[-12vh] left-[2vw] z-20">
          <Image
            src="https://d2prwyp3rwi40.cloudfront.net/media/YellowStars.png"
            alt="Yellow Stars"
            width={1200}
            height={800}
            className="w-full h-auto"
          />
        </div>
        <div className="flex flex-col items-center justify-center z-30 mt-[17vh]">
          <h1 className="text-5xl font-bold text-[9vh] text-center text-[#2C305F] drop-shadow-[1.5px_1.5px_0_#DCB968]">
            Bi-weekly Article
          </h1>
          <p className="leading-6 font-semibold text-base text-white w-[50vw] text-justify py-6">
            Welcome to the Bi-weekly Article Series, where curiosity meets
            analysis at the intersection of finance and technology. Our
            articles, crafted by dedicated members of the FinTech Club, blend
            academic depth with real-world relevance, providing you with
            rigorously researched insights into emerging industry trends
            alongside pivotal global economic events. Explore our latest work
            and discover what’s truly shaping the industry today.
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
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={
          <NavigateNextIcon fontSize="small" sx={{ color: "#A28436" }} />
        }
        sx={{
          color: "#000000",
          "& .MuiBreadcrumbs-separator": { mx: 0.5 },
        }}
        className="w-full py-8 pl-16"
      >
        <MuiLink
          underline="hover"
          sx={{
            color: "#000000",
            "&:hover": { color: "#A28436" },
          }}
          component={Link}
          href="/media"
          onClick={handleBreadcrumbClick}
        >
          Media
        </MuiLink>
        <MuiLink
          underline="hover"
          sx={{
            color: "#000000",
            "&:hover": { color: "#A28436" },
          }}
          component={Link}
          href="/media/article"
          onClick={handleBreadcrumbClick}
        >
          Article Library
        </MuiLink>
      </Breadcrumbs>

      <div className="relative pb-4 pl-24">
        <LabelSort
          availableLabels={availableLabels}
          onSelect={handleLabelSelect}
        />
      </div>

      {renderArticleContent()}
    </section>
  );
}

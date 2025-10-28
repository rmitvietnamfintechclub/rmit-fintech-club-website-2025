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

// Helper function for formatting dates
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

export default function SpecificArticle({
  params,
}: {
  params: { id: string };
}) {
  // --- STATE MANAGEMENT ---
  const [article, setArticle] = useState<ApiArticle | null>(null);
  // Updated state for dynamic sidebar content
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
        // Destructure the new, simplified response from the API
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
              <Link href="/media/article">
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 1.1 }}
                  className="bg-ft-primary-blue-300 text-bluePrimary font-semibold px-4 py-2 rounded-md hover:bg-yellowCream"
                >
                  Back to Article Library
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
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
              Article Not Found
            </h3>
            <div
              className="w-fit h-fit rounded-md p-[2px] mt-[0.5rem]"
              style={{
                background: "linear-gradient(to top, #474A6E, #DBB968)",
              }}
            >
              <Link href="/media/article">
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 1.1 }}
                  className="bg-ft-primary-blue-300 text-bluePrimary font-semibold px-4 py-2 rounded-md hover:bg-yellowCream"
                >
                  Back to Article Library
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="relative">
      {/* HERO SECTION */}
      <div
        className="w-screen h-[92vh] flex items-center justify-between px-16"
        style={{
          background: "linear-gradient(to bottom, #0D1742 62%, #DBB968 100%)",
        }}
      >
        <div className="flex flex-col items-start justify-center z-30 w-[58vw]">
          <div className="flex flex-wrap gap-2 mb-4">
            {article.labels?.map((label) => (
              <div
                key={label}
                className="p-2 rounded-lg bg-ft-primary-yellow-200 text-sm font-medium"
              >
                {label}
              </div>
            ))}
          </div>
          <h1 className="text-4xl font-bold text-ft-text-bright">
            {article.title}
          </h1>
          <p className="font-medium text-base text-white text-justify py-2 whitespace-pre-wrap">
            {article.summary}
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
                  const element = document.getElementById("article");
                  if (element) {
                    // Use the browser's built-in smooth scrolling
                    element.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                Read Article
              </motion.button>
            </div>
            <div
              className="w-fit h-fit rounded-md p-[2px] mt-[0.5rem]"
              style={{
                background: "linear-gradient(to top, #474A6E, #DBB968)",
              }}
            >
              <Link href="/media/article">
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 1.1 }}
                  className="bg-ft-primary-blue-300 text-bluePrimary font-semibold px-4 py-2 rounded-md hover:bg-yellowCream"
                >
                  Back to Article Library
                </motion.button>
              </Link>
            </div>
          </section>
        </div>
        <div className="z-30">
          <Image
            src={article.illustration_url}
            alt={article.title}
            width={500}
            height={500}
            className="w-[25vw] h-auto rounded-lg"
            fetchPriority="high"
            loading="eager"
            priority={true}
          />
        </div>
      </div>

      {/* BREADCRUMBS */}
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={
          <NavigateNextIcon fontSize="small" sx={{ color: "#A28436" }} />
        }
        sx={{ color: "#000000", "& .MuiBreadcrumbs-separator": { mx: 0.5 } }}
        className="w-full py-8 px-16"
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
          href="/media/article"
        >
          Article Library
        </MuiLink>
        <MuiLink
          underline="hover"
          sx={{ color: "#000000", "&:hover": { color: "#A28436" } }}
          component={Link}
          href={`/media/article/${article._id}`}
        >
          {article.title}
        </MuiLink>
      </Breadcrumbs>

      {/* MAIN CONTENT SECTION */}
      <div id="article" className="flex justify-center pb-12 px-16 gap-8">
        <div className="w-full max-w-4xl">
          <iframe
            src={article.content_url}
            title="PDF Viewer"
            className="w-full h-[120vh] rounded-lg shadow-lg"
            aria-label="PDF article preview"
          >
            This browser does not support PDFs.
          </iframe>
          <div
            className="w-fit h-fit rounded-md p-[2px] mt-[2rem] mb-20 mx-auto"
            style={{
              background: "linear-gradient(to top, #474A6E, #DBB968)",
            }}
          >
            <a href="/media/article">
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 1.1 }}
                className="bg-ft-primary-blue-300 text-bluePrimary font-semibold px-4 py-2 rounded-md hover:bg-yellowCream"
              >
                Back to Article Library
              </motion.button>
            </a>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="w-full max-w-[16rem] flex flex-col gap-4">
          {/* Author Section */}
          {article.authors?.length > 0 && (
            <div className="p-6 rounded-lg shadow-md border-2 border-[#DBB968]">
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

          {/* Sidebar Articles Section */}
          <div>
            <h2 className="text-3xl font-bold text-ft-primary-yellow-100 mb-4">
              {sidebarTitle}
            </h2>
            <div className="flex flex-col gap-6">
              {sidebarArticles.map((item) => (
                <Link
                  href={`/media/article/${item._id}`}
                  key={item._id}
                  className="block rounded-lg overflow-hidden border-2 border-transparent hover:border-[#DBB968] hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative w-full h-72">
                    <Image
                      src={item.illustration_url}
                      alt={item.title}
                      layout="fill"
                      objectFit="fill"
                      className="rounded-t-lg"
                    />
                  </div>
                  <div className="p-4 bg-gray-50 rounded-b-lg">
                    <p className="font-semibold text-gray-800 text-md leading-snug">
                      {item.title}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      {formatPublicationDate(item.publicationDate)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-[-9rem] left-0">
        <Image
          src="https://d2prwyp3rwi40.cloudfront.net/global/Mascot+-+M%E1%BA%B7t+b%C3%AAn.svg"
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

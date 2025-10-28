"use client";

import { useState } from "react";

// Define an interface for the component's props for type safety
interface Reel {
  id: number;
  title: string;
  description: string;
  videoId: string;
  publicationDate: string;
  labels: string[];
}

interface ReelPlayerProps {
  reels: Reel[];
  selectedIndex: number;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

// Helper function to format the date
const formatReelDate = (isoString: string): string => {
  if (!isoString) return "";
  const date = new Date(isoString);
  return `Published on ${date.toLocaleString("en-US", {
    month: "long",
  })} ${date.getDate()}, ${date.getFullYear()}`;
};

const ReelPlayer: React.FC<ReelPlayerProps> = ({
  reels,
  selectedIndex,
  onClose,
  onNavigate,
}) => {
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);
  const currentReel = reels[selectedIndex];

  const handleNavigation = (newIndex: number) => {
    onNavigate(newIndex);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* A single, unified layout container */}
      <div className="flex flex-row items-start justify-center space-x-4">
        {/* Column 1: Video Player */}
        <div className="relative flex-shrink-0 h-[95vh] max-h-[800px] aspect-[9/16] overflow-hidden rounded-xl shadow-2xl">
          <iframe
            src={`https://www.youtube.com/embed/${currentReel.videoId}?shorts=1&autoplay=1&rel=0`}
            title={currentReel.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>

        {/* Column 2: Navigation Buttons */}
        <div className="flex flex-col items-center justify-center h-[95vh] max-h-[800px] space-y-4">
          <button
            onClick={() => setIsDescriptionVisible(!isDescriptionVisible)}
            className="p-2 bg-gray-100 border rounded-full shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
          <button
            onClick={() => handleNavigation(selectedIndex - 1)}
            disabled={selectedIndex === 0}
            className="p-2 bg-gray-100 border rounded-full shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
          </button>
          <button
            onClick={() => handleNavigation(selectedIndex + 1)}
            disabled={selectedIndex === reels.length - 1}
            className="p-2 bg-gray-100 border rounded-full shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>

        {/* Column 3: Description Panel */}
        <div
          className={`relative flex flex-col bg-white rounded-xl shadow-2xl h-[95vh] max-h-[800px] border transition-all duration-500 ease-in-out overflow-hidden ${
            isDescriptionVisible ? "w-[40vw] p-6" : "w-0 p-0 border-0"
          }`}
        >
          <button
            onClick={() => setIsDescriptionVisible(false)}
            className="absolute top-3 right-3 p-1 text-gray-500 hover:bg-gray-100 rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <div className="flex flex-col space-y-3 h-full min-w-[350px]">
            <h2 className="text-xl font-bold text-gray-900 pr-6">
              Description
            </h2>
            <div className="border-t border-gray-200 pt-4">
              <div className="flex flex-wrap gap-2 mb-3">
                {currentReel.labels.map((label) => (
                  <span
                    key={label}
                    className="bg-[#F7D27F] px-3 py-1 rounded-md font-semibold text-sm text-[#2A2A57]"
                  >
                    {label}
                  </span>
                ))}
              </div>
              <h3 className="text-lg font-bold text-gray-800">
                {currentReel.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1 italic">
                {formatReelDate(currentReel.publicationDate)}
              </p>
            </div>
            <div className="pt-4 flex-grow overflow-y-auto border-t border-gray-200">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {currentReel.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReelPlayer;

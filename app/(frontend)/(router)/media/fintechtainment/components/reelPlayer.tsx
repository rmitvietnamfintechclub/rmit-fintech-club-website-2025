"use client";

import { useState, TouchEvent } from "react"; // TouchEvent is no longer strictly needed but fine to keep

// --- (Interfaces and formatReelDate helper are unchanged) ---
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

const formatReelDate = (isoString: string): string => {
  if (!isoString) return "";
  const date = new Date(isoString);
  return `Published on ${date.toLocaleString("en-US", {
    month: "long",
  })} ${date.getDate()}, ${date.getFullYear()}`;
};

// --- (ReelDescriptionContent component is unchanged) ---
const ReelDescriptionContent: React.FC<{ reel: Reel; isMobile?: boolean }> = ({
  reel,
  isMobile = false,
}) => {
  return (
    <>
      <div
        className={
          isMobile
            ? "pt-4"
            : "md:border-t border-gray-200 pt-4"
        }
      >
        <div className="flex flex-wrap gap-2 mb-3">
          {reel.labels.map((label) => (
            <span
              key={label}
              className="bg-[#F7D27F] px-3 py-1 rounded-md font-semibold text-sm text-[#2A2A57]"
            >
              {label}
            </span>
          ))}
        </div>
        <h3
          className={`font-bold text-lg text-gray-800`}
        >
          {reel.title}
        </h3>
        <p
          className={`text-sm mt-1 italic ${
            isMobile ? "text-gray-300 mb-4" : "text-gray-500"
          }`}
        >
          {formatReelDate(reel.publicationDate)}
        </p>
      </div>
      <div
        className={`md:pt-4 ${
          isMobile
            ? "flex-grow overflow-y-auto" // Mobile panel scrolls
            : "md:flex-grow md:overflow-y-auto border-t border-gray-200" // Desktop panel scrolls
        }`}
      >
        <p
          className={`text-sm whitespace-pre-wrap ${
            isMobile ? "text-gray-200" : "text-gray-700"
          }`}
        >
          {reel.description}
        </p>
      </div>
    </>
  );
};

const ReelPlayer: React.FC<ReelPlayerProps> = ({
  reels,
  selectedIndex,
  onClose,
  onNavigate,
}) => {
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);
  // ✨ --- REMOVED: touchStartY state ---
  // const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const currentReel = reels[selectedIndex];

  const handleNavigation = (newIndex: number) => {
    setIsDescriptionVisible(false);
    onNavigate(newIndex);
  };

  // ✨ --- REMOVED: Swipe Handlers (onTouchStart, onTouchMove, onTouchEnd) ---

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="flex flex-col md:flex-row items-center md:items-start justify-center md:space-x-4">
        {/* Column 1: Video Player */}
        <div className="relative flex-shrink-0 h-[88vh] md:h-[95vh] max-h-[800px] aspect-[9/16] overflow-hidden rounded-xl shadow-2xl">
          <iframe
            src={`https://www.youtube.com/embed/${currentReel.videoId}?shorts=1&autoplay=1&rel=0`}
            title={currentReel.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full"
          ></iframe>

          {/* ✨ --- REMOVED: Mobile Gesture Capture Layer --- */}

          {/* Mobile-Only Overlay Buttons (z-10) */}
          {/* These buttons are now the *only* way to navigate on mobile */}
          <div className="md:hidden flex flex-col items-center justify-center space-y-4 absolute bottom-16 right-4 z-10">
            {/* Mobile Info Button */}
            <button
              onClick={() => setIsDescriptionVisible(!isDescriptionVisible)}
              className="p-3 bg-black/40 backdrop-blur-sm rounded-full text-white shadow-lg"
            >
              {/* (Info SVG) */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
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
            {/* Mobile Up Button */}
            <button
              onClick={() => handleNavigation(selectedIndex - 1)}
              disabled={selectedIndex === 0}
              className="p-3 bg-black/40 backdrop-blur-sm rounded-full text-white shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {/* (Up SVG) */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
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
            {/* Mobile Down Button */}
            <button
              onClick={() => handleNavigation(selectedIndex + 1)}
              disabled={selectedIndex === reels.length - 1}
              className="p-3 bg-black/40 backdrop-blur-sm rounded-full text-white shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {/* (Down SVG) */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
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

          {/* --- (Mobile Bottom Sheet is unchanged) --- */}
          {/* 1. Dimming Overlay (z-20) */}
          <div
            className={`absolute inset-0 bg-black/50 md:hidden transition-opacity duration-300 z-20 ${
              isDescriptionVisible
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setIsDescriptionVisible(false)}
          ></div>

          {/* 2. Bottom Sheet Panel (z-30) */}
          <div
            className={`absolute bottom-0 left-0 right-0 p-4 pt-2 md:hidden
                       bg-white backdrop-blur-lg rounded-t-2xl 
                       flex flex-col max-h-[60vh]
                       transition-transform duration-500 ease-in-out z-30
                       ${
                         isDescriptionVisible
                           ? "translate-y-0" // Visible
                           : "translate-y-full" // Hidden off-screen
                       }`}
          >
            {/* Handle bar */}
            <div className="w-12 h-1.5 bg-gray-500 rounded-full mx-auto my-2"></div>

            {/* Close Button (Absolute within sheet) */}
            <button
              onClick={() => setIsDescriptionVisible(false)}
              className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Scrollable Content Area */}
            <div className="flex flex-col flex-grow overflow-y-auto">
              <ReelDescriptionContent reel={currentReel} isMobile={true} />
            </div>
          </div>
          {/* --- (END: Mobile Bottom Sheet) --- */}
        </div>

        {/* --- (Column 2: Desktop Navigation is unchanged) --- */}
        <div className="hidden md:flex flex-col items-center justify-center h-[95vh] max-h-[800px] space-y-4">
          <button
            onClick={() => setIsDescriptionVisible(!isDescriptionVisible)}
            className="p-2 bg-gray-100 border rounded-full shadow-sm cursor-pointer"
          >
            {/* (Info SVG) */}
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
            {/* (Up SVG) */}
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
            {/* (Down SVG) */}
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

        {/* --- (Column 3: Desktop Description Panel is unchanged) --- */}
        <div
          className={`relative flex-col md:bg-white md:rounded-xl md:shadow-2xl h-full md:h-[95vh] md:max-h-[800px] border
                     transition-all duration-500 ease-in-out overflow-hidden
                     hidden md:flex
                     ${
                       isDescriptionVisible
                         ? "w-[40vw] md:p-6" // Visible state on desktop
                         : "w-0 p-0 border-0" // Hidden state on desktop
                     }`}
        >
          {/* Desktop Close Button */}
          <button
            onClick={() => setIsDescriptionVisible(false)}
            className="hidden md:block absolute top-3 right-3 p-1 text-gray-500 hover:bg-gray-100 rounded-full"
          >
            {/* (Close SVG) */}
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

          {/* Content */}
          <div className="flex flex-col space-y-3 h-full min-w-[350px]">
            <h2 className="hidden md:block text-xl font-bold text-gray-900 pr-6">
              Description
            </h2>
            <ReelDescriptionContent reel={currentReel} isMobile={false} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReelPlayer;
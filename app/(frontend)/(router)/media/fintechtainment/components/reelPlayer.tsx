"use client";

import { useState, TouchEvent } from "react"; // Import TouchEvent

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
  const [touchStartY, setTouchStartY] = useState<number | null>(null); // --- ADDED: State for swipe
  const currentReel = reels[selectedIndex];

  const handleNavigation = (newIndex: number) => {
    onNavigate(newIndex);
  };

  // --- START: Added Swipe Handlers ---
  const minSwipeDistance = 50; // Minimum pixels for a valid swipe

  const onTouchStart = (e: TouchEvent) => {
    // Don't track swipe if description is open
    if (isDescriptionVisible) {
      setTouchStartY(null);
      return;
    }
    // Record the starting Y position of the first touch
    setTouchStartY(e.touches[0].clientY);
  };

  const onTouchMove = (e: TouchEvent) => {
    // If we're not tracking a swipe, or description is visible, let default scroll happen
    if (!touchStartY || isDescriptionVisible) return;

    // Prevent the default browser scroll action (pull-to-refresh, page scroll)
    // This gives the "app-like" feel
    e.preventDefault();
  };

  const onTouchEnd = (e: TouchEvent) => {
    // Check if we started a valid swipe and description is still hidden
    if (!touchStartY || isDescriptionVisible) {
      setTouchStartY(null); // Reset
      return;
    }

    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY - touchEndY; // Positive = Swipe Up

    // Check if the swipe distance is significant
    if (Math.abs(deltaY) > minSwipeDistance) {
      if (deltaY > 0 && selectedIndex < reels.length - 1) {
        // --- Swiped Up (Next video) ---
        handleNavigation(selectedIndex + 1);
      } else if (deltaY < 0 && selectedIndex > 0) {
        // --- Swiped Down (Previous video) ---
        handleNavigation(selectedIndex - 1);
      }
    }

    // Reset touch start position
    setTouchStartY(null);
  };
  // --- END: Added Swipe Handlers ---

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* A single, unified layout container */}
      <div className="flex flex-col md:flex-row items-center md:items-start justify-center md:space-x-4">
        {/* Column 1: Video Player */}
        <div className="relative flex-shrink-0 h-[95vh] max-h-[800px] aspect-[9/16] overflow-hidden rounded-xl shadow-2xl">
          <iframe
            src={`https://www.youtube.com/embed/${currentReel.videoId}?shorts=1&autoplay=1&rel=0`}
            title={currentReel.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full"
          ></iframe>

          {/* --- START: Mobile Gesture Capture Layer --- */}
          {/* This transparent layer sits ON TOP of the iframe (z-5) */}
          {/* but BELOW the buttons (z-10) to capture swipes. */}
          {/* It's hidden on desktop (md:hidden). */}
          <div
            className="absolute inset-0 z-5 md:hidden"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          ></div>
          {/* --- END: Mobile Gesture Capture Layer --- */}

          {/* --- START: Mobile-Only Overlay Buttons --- */}
          {/* This div is hidden on medium screens and up (md:hidden) */}
          {/* It's positioned absolutely relative to the video player above */}
          {/* It has z-10 to be ON TOP of the gesture layer */}
          <div className="md:hidden flex flex-col items-center justify-center space-y-4 absolute bottom-16 right-4 z-10">
            {/* Mobile Info Button */}
            <button
              onClick={() => setIsDescriptionVisible(!isDescriptionVisible)}
              className="p-3 bg-black/40 backdrop-blur-sm rounded-full text-white shadow-lg"
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
          {/* --- END: Mobile-Only Overlay Buttons --- */}
        </div>

        {/* Column 2: Navigation Buttons (Desktop-Only) */}
        {/* ... (this section remains unchanged) ... */}
        <div className="hidden md:flex flex-col items-center justify-center h-[95vh] max-h-[800px] space-y-4">
          <button
            onClick={() => setIsDescriptionVisible(!isDescriptionVisible)}
            className="p-2 bg-gray-100 border rounded-full shadow-sm cursor-pointer"
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
        {/* ... (this section remains unchanged) ... */}
        <div
          className={`relative flex flex-col md:bg-white md:rounded-xl md:shadow-2xl h-full md:h-[95vh] md:max-h-[800px] border transition-all duration-500 ease-in-out overflow-hidden ${
            isDescriptionVisible
              ? "w-[40vw] max-md:w-full md:p-6 max-md:px-8 max-md:border-0"
              : "h-0 w-0 p-0 border-0 max-md:hidden"
          }`}
        >
          <button
            onClick={() => setIsDescriptionVisible(false)}
            className="hidden md:block absolute top-3 right-3 p-1 text-gray-500 hover:bg-gray-100 rounded-full"
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
            <h2 className="hidden md:block text-xl font-bold text-gray-900 pr-6">
              Description
            </h2>
            <div className="md:border-t border-gray-200 pt-4">
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
            <div className="pt-4 md:flex-grow md:overflow-y-auto border-t border-gray-200">
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
"use client";

import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import styles from "@/styles/upcoming.module.css";
import clsx from "clsx";
import axios from "axios";
import Link from "next/link";
import { CircularProgress } from "@mui/material";

// Thêm React Slick
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface EventItem {
  _id: string;
  name: string;
  posterUrl: string;
  date: string;
  time: string;
  mode: "Hybrid" | "Offline" | "Online";
  location: string;
}

// ==================================
// Helper Functions (Giữ nguyên)
// ==================================
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

const formatEventDate = (isoString: string): { day: string; month: string } => {
  const dateObj = new Date(isoString);
  const day = addOrdinalSuffix(dateObj.getDate());
  const month = dateObj.toLocaleString("en-US", { month: "short" });
  return { day, month };
};

// ==================================
// Component con (Responsive)
// ==================================

// Component khi không có sự kiện
const NoEventsDisplay = () => (
  <div className="relative w-[90vw] md:w-[85vw] h-fit p-[4px] my-4 rounded-lg bg-gradient-to-b from-[#DCB968] to-[#F7D27F]">
    <div className="flex flex-col items-center justify-center w-full h-full bg-[#F9FAFB] rounded-[7px] text-center px-4 py-12">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-[#2C305F] mb-4"
      >
        <path d="M8 2v4"></path>
        <path d="M16 2v4"></path>
        <rect width="18" height="18" x="3" y="4" rx="2"></rect>
        <path d="M3 10h18"></path>
        <path d="M10.5 14.5a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1z"></path>
        <path d="M16.5 14.5a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1z"></path>
      </svg>
      <h3 className="text-xl md:text-2xl font-bold text-[#2C305F] mb-2">
        No Upcoming Events
      </h3>
      <p className="text-[#5E5E92] text-sm md:text-base">
        We're busy planning more exciting events for you. Please check back
        later!
      </p>
    </div>
  </div>
);

// Component Card cho Mobile
const MobileEventCard = ({ event }: { event: EventItem }) => {
  const { day, month } = formatEventDate(event.date);
  return (
    <div className="w-full px-2 py-4">
      <div className="w-full rounded-lg p-[4px] bg-gradient-to-b from-[#DCB968] to-[#F7D27F]">
        <div className="w-full h-full p-4 bg-blueSlate rounded-[7px] flex flex-col gap-4">
          <p className="text-xl leading-7 text-yellowSand uppercase text-center font-bold">
            {event.name}
          </p>

          {/* Poster */}
          <div
            className="relative w-full h-48 rounded-lg p-2"
            style={{ background: "linear-gradient(to bottom, #C9D6EA, #DBB968)" }}
          >
            <div
              className="w-full h-full rounded-md bg-center bg-cover bg-no-repeat"
              style={{ backgroundImage: `url(${event.posterUrl})` }}
            />
          </div>

          {/* Info */}
          <div className="w-full flex flex-col sm:flex-row gap-2">
            <div
              className="h-24 sm:h-full sm:aspect-square rounded-lg p-2"
              style={{ background: "linear-gradient(to bottom, #C9D6EA, #DBB968)" }}
            >
              <div className="bg-ft-primary-yellow-50 w-full h-full rounded-lg flex flex-col justify-center items-center">
                <p className="text-sm font-medium text-center">{event.time}</p>
                <p className="text-sm font-medium text-center">
                  {day} {month}
                </p>
              </div>
            </div>
            <div className="flex-grow flex flex-row sm:flex-col gap-2">
              <div
                className="h-full w-1/2 sm:w-full rounded-lg p-2 flex justify-center items-center"
                style={{
                  background: "linear-gradient(to bottom, #C9D6EA, #DBB968)",
                }}
              >
                <div className="bg-white w-full h-full rounded-md flex flex-col sm:flex-row justify-around items-center px-2 py-1">
                  <p className="text-sm font-bold text-ft-primary-blue-50 uppercase">
                    Location
                  </p>
                  <p className="text-sm font-medium text-center text-bluePrimary">
                    {event.location}
                  </p>
                </div>
              </div>
              <div
                className="h-full w-1/2 sm:w-full aspect-square sm:aspect-auto rounded-lg p-2"
                style={{
                  background: "linear-gradient(to bottom, #C9D6EA, #DBB968)",
                }}
              >
                <div className="bg-ft-primary-yellow-50 w-full h-full rounded-lg flex flex-col justify-center items-center px-2 py-1">
                  <p className="text-sm font-bold text-ft-primary-blue-50 uppercase">
                    Format
                  </p>
                  <p className="text-sm font-medium text-center">{event.mode}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Button */}
          <Link
            href={`/events/${event._id}`}
            className="h-fit w-full rounded-full py-1 px-1 cursor-pointer"
            style={{ background: "linear-gradient(to bottom, #C9D6EA, #DBB968)" }}
          >
            <div className="bg-ft-primary-yellow-50 w-full h-full rounded-full py-2 px-4 flex justify-center items-center transition-transform hover:scale-105">
              <p className="text-base font-semibold text-center">Explore More</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

// ==================================
// COMPONENT CHÍNH
// ==================================
export default function UpcomingEvent() {
  const [items, setItems] = useState<EventItem[]>([]);
  const [originalItems, setOriginalItems] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [animating, setAnimating] = useState(false);
  const cardRef = useRef<(HTMLDivElement | null)[]>([]);

  // --- Logic Fetch (Giữ nguyên) ---
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get("/api/v1/event");
        const fetchedEvents = response.data.events || [];

        if (response.data.status === 200 && fetchedEvents.length > 0) {
          // Cho Mobile, không cần 5+ items. 1+ là đủ
          if (fetchedEvents.length < 5) {
            console.warn(
              "API returned fewer than 5 events. Desktop carousel may look empty, but mobile will work."
            );
            // Vẫn set data, mobile carousel sẽ xử lý
            setItems(fetchedEvents);
            setOriginalItems(fetchedEvents);
          } else {
            setItems(fetchedEvents);
            setOriginalItems(fetchedEvents);
          }
        } else {
          setItems([]);
          setOriginalItems([]);
        }
      } catch (err: any) {
        console.error("Error fetching upcoming events: ", err);
        if (err.response?.status === 404) {
          setError("Upcoming events API not found.");
        } else if (err.code === "ERR_NETWORK") {
          setError("Network error. Could not fetch events.");
        } else {
          setError("Failed to load upcoming events.");
        }
        setItems([]);
        setOriginalItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // --- Logic Click (Chỉ dùng cho Desktop) ---
  const handleClick = (dir: "next" | "prev") => {
    if (animating) return;
    setAnimating(true);
    cardRef.current.forEach((el, i) => {
      el?.classList.add(styles[`card_${i + 1}_${dir}`]);
    });

    setTimeout(() => {
      const rotated = [...items];
      if (dir === "prev") {
        rotated.unshift(rotated.pop()!);
      } else {
        rotated.push(rotated.shift()!);
      }
      setItems(rotated);
      setAnimating(false);
      cardRef.current.forEach((el, i) => {
        el?.classList.remove(styles[`card_${i + 1}_${dir}`]);
      });
    }, 3000); // Desktop animation 3s
  };

  // Cấu hình React Slick cho Mobile
  const mobileSliderSettings = {
    dots: true,
    infinite: originalItems.length > 1, // Tắt infinite nếu chỉ có 1 item
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    centerMode: true,
    centerPadding: "20px", // Hơi hở 2 card bên cạnh
    autoplay: true,
    autoplaySpeed: 5000,
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="p-8 text-center flex flex-col items-center justify-center h-64">
          <CircularProgress sx={{ color: "#DCB968" }} />
          <p className="mt-4 text-lg text-[#5E5E92]">Loading Upcoming Events</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center">
          <div className="relative w-[85vw] h-fit p-[4px] my-4 rounded-lg bg-gradient-to-b from-[#DCB968] to-[#F7D27F]">
            <div className="flex flex-col items-center justify-center w-full h-full bg-[#F9FAFB] rounded-[7px] text-center px-4 py-12">
              <p className="text-5xl font-bold mb-4">⚠️</p>
              <p className="text-lg md:text-xl text-[#2C305F]">{error}</p>
            </div>
          </div>
        </div>
      );
    }

    if (originalItems.length === 0) {
      return <NoEventsDisplay />;
    }

    // --- Logic render Carousel ---
    // Desktop
    const visible = Array.from(
      { length: 5 },
      (_, i) => items[i % items.length]
    );
    const activeItem = items[2]; // Desktop active item
    const activeIndex = originalItems.findIndex(
      (item) => item._id === activeItem?._id
    );

    return (
      <>
        {/* =======================
            MOBILE CAROUSEL (md:hidden)
            ======================= */}
        <div className="w-full md:hidden">
          <Slider {...mobileSliderSettings}>
            {originalItems.map((event) => (
              <MobileEventCard key={event._id} event={event} />
            ))}
          </Slider>
        </div>

        {/* =======================
            DESKTOP CAROUSEL (hidden md:block)
            ======================= */}
        <div className="hidden md:block w-full">
          <div className="h-[85vh] w-full relative mt-4">
            {/* 5 Card 3D */}
            {visible.map((ev, index) => {
              // Bỏ lỗi nếu 'ev' là undefined (khi < 5 events)
              if (!ev)
                return (
                  <div
                    key={`placeholder-${index}`}
                    className={clsx(styles.card, styles[`card_${index + 1}`])}
                  ></div>
                );

              const { day, month } = formatEventDate(ev.date);
              return (
                <div
                  key={`${ev._id}-${index}`}
                  ref={(el) => {
                    cardRef.current[index] = el;
                  }}
                  className={clsx(
                    styles.card,
                    styles[`card_${index + 1}`],
                    "grid place-items-center h-[77vh] w-[27vw] border-bluePrimary border-[0.5vh] rounded-[2vw] p-[2vh] bg-blueSlate"
                  )}
                  onClick={() => {
                    if (index === 1) handleClick("prev");
                    else if (index === 3) handleClick("next");
                  }}
                >
                  {/* ... (Nội dung card desktop giữ nguyên) ... */}
                  <p className="text-[1.5rem] leading-7 text-yellowSand uppercase text-center font-bold">
                    {ev.name}
                  </p>

                  <div
                    className="relative w-full h-[35vh] rounded-[3vh] p-[1.5vh]"
                    style={{
                      background:
                        "linear-gradient(to bottom, #C9D6EA, #DBB968)",
                    }}
                  >
                    <div
                      className="w-full h-full rounded-[2.5vh] bg-center bg-cover bg-no-repeat"
                      style={{ backgroundImage: `url(${ev.posterUrl})` }}
                    />
                  </div>

                  <div className="w-full h-[15vh] flex justify-between">
                    <div
                      className="h-full aspect-square rounded-[3vh] p-[1.5vh]"
                      style={{
                        background:
                          "linear-gradient(to bottom, #C9D6EA, #DBB968)",
                      }}
                    >
                      <div className="bg-ft-primary-yellow-50 w-full h-full rounded-[3vh] flex flex-col justify-center items-center">
                        <p className="text-[0.85rem] leading-[4vh] font-medium text-center">
                          {ev.time}
                        </p>
                        <p className="text-[0.85rem] leading-[4vh] font-medium text-center">
                          {day} {month}
                        </p>
                      </div>
                    </div>
                    <div
                      className="h-full w-full ml-[1vw] rounded-[3vh] p-[1.5vh] flex justify-center items-center"
                      style={{
                        background:
                          "linear-gradient(to bottom, #C9D6EA, #DBB968)",
                      }}
                    >
                      <div className="bg-white w-full h-full rounded-[2.5vh] flex flex-wrap justify-around items-center">
                        <p className="text-[0.9rem] leading-[4vh] font-bold text-ft-primary-blue-50 uppercase">
                          Location
                        </p>
                        <p className="text-[0.85rem] leading-[4vh] font-medium text-center text-bluePrimary">
                          {ev.location}
                        </p>
                      </div>
                    </div>
                    <div
                      className="h-full aspect-square rounded-[3vh] p-[1.5vh] ml-[1vw]"
                      style={{
                        background:
                          "linear-gradient(to bottom, #C9D6EA, #DBB968)",
                      }}
                    >
                      <div className="bg-ft-primary-yellow-50 w-full h-full rounded-[3vh] flex flex-col justify-center items-center">
                        <p className="text-[0.9rem] leading-[4vh] font-bold text-ft-primary-blue-50 uppercase">
                          Format
                        </p>
                        <p className="text-[0.85rem] leading-[4vh] font-medium text-center">
                          {ev.mode}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/events/${ev._id}`}
                    className="h-fit w-fit rounded-[4.5vh] py-[1vh] px-[0.5vw] cursor-pointer"
                    style={{
                      background: "linear-gradient(to bottom, #C9D6EA, #DBB968)",
                    }}
                  >
                    <div className="bg-ft-primary-yellow-50 w-full h-full rounded-[3vh] py-[1vh] px-[1vw] flex justify-center items-center transition-transform hover:scale-105">
                      <p className="text-[1rem] leading-[3.3vh] font-semibold text-center">
                        Explore More
                      </p>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Nút điều khiển Desktop */}
          <div className="w-full flex justify-center items-center gap-[1.5vw] mt-[-4vh] z-[10]">
            <button
              className="h-[5vh] w-[5vh] text-[3vh] leading-[4vh] rounded-full border border-[#ddd] grid place-items-center hover:bg-[#f7f7f7] disabled:opacity-50"
              onClick={() => handleClick("prev")}
              disabled={animating}
              aria-label="Previous"
            >
              <FontAwesomeIcon icon={faAngleLeft} />
            </button>
            <div className="flex items-center gap-[0.8vw]">
              {originalItems.map((_, i) => (
                <div
                  key={i}
                  className={`h-[2vh] aspect-square rounded-full ${
                    i === activeIndex ? "bg-yellowPrimary" : "bg-[#D9D9D9]"
                  }`}
                />
              ))}
            </div>
            <button
              className="h-[5vh] w-[5vh] text-[3vh] leading-[4vh] rounded-full border border-[#ddd] grid place-items-center hover:bg-[#f7f7f7] disabled:opacity-50"
              onClick={() => handleClick("next")}
              disabled={animating}
              aria-label="Next"
            >
              <FontAwesomeIcon icon={faAngleRight} />
            </button>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="h-fit w-[100vw] pt-6 md:pt-12 pb-8 relative flex flex-col items-center overflow-x-hidden">
      {/* Header (Responsive) */}
      <div className="h-fit w-fit relative mx-auto mt-[2vh] mb-[2vh] md:mb-[4vh]">
        <p className="text-3xl md:text-[4vw] text-[#2C305F] drop-shadow-[0_4px_4px_rgba(255,204,102,0.6)] font-bold text-center">
          Upcoming Events
        </p>
        {/* Stars (hidden on mobile) */}
        <div
          className="absolute -top-4 md:-top-8 left-2 h-[3vh] md:h-[5vh] aspect-square bg-center bg-no-repeat bg-contain"
          style={{
            backgroundImage:
              "url(https://d2uq10394z5icp.cloudfront.net/home/assets/YellowStar.svg)",
          }}
        />
        <div
          className="absolute -top-4 md:-top-8 left-[-8vh] md:left-[-13vh] h-[7vh] md:h-[12vh] aspect-square bg-center bg-no-repeat bg-contain"
          style={{
            backgroundImage:
              "url(https://d2uq10394z5icp.cloudfront.net/home/assets/YellowStar.svg)",
          }}
        />
        <div
          className="absolute top-0 md:-top-4 -right-8 md:right-[-11.5vh] h-[5vh] md:h-[10vh] aspect-square bg-center bg-no-repeat bg-contain"
          style={{
            backgroundImage:
              "url(https://d2uq10394z5icp.cloudfront.net/home/assets/YellowStar.svg)",
          }}
        />
        <div
          className="absolute top-8 md:top-10 right-[-2vw] md:right-[-1vw] h-[3vh] md:h-[5vh] aspect-square bg-center bg-no-repeat bg-contain"
          style={{
            backgroundImage:
              "url(https://d2uq10394z5icp.cloudfront.net/home/assets/YellowStar.svg)",
          }}
        />
      </div>
      {/* Conditionally render content */}
      {renderContent()}
    </div>
  );
}
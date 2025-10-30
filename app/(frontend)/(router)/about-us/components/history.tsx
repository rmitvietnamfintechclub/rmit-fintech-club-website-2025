import Image from "next/image";
import { fontSans } from "@/config/fonts";
import { motion, AnimatePresence } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useState, useRef, useCallback } from "react";

const historyData = [
  {
    year: "2019",
    title: "A Big-Four Inspiration",
    content:
      "Ms. Mai Hoang My Hao, our visionary leader, learned about the T-shaped knowledge concept while at a Big-4 firm internship and recognized its growing demand by employers internationally. Most RMIT clubs then were specialized, so she along with her friend Ms. Mai Doan Ngoc Han, co-founded a multi-disciplinary learning hub for Business, Finance, and Tech students to gain T-shaped skills, and explore the Finance-Technology intersection. With the support of Dr. Binh Nguyen, Senior Program Manager of RMIT’s Blockchain-Enabled Business major, the club was officially unveiled on February 10th, 2020!",
  },
  {
    year: "2020",
    title: "An Ambitious Vision",
    content:
      "Under Ms. Hao’s President tenure, she laid the club’s foundation for future growth. With her intellectual prowess, charitable heart, and ambitious passion, she spearheaded the club’s operations, initial projects, training workshops, collaborative efforts, and industry engagements to deliver value and foster an open-sharing FinTech Club environment. Her relentless efforts resulted in large numbers of talented students flocking to the club, further contributing to its acceleration and recognition in the RMIT community.",
  },
  {
    year: "2021",
    title: "Liftoff!",
    content:
      "Despite COVID-related disruptions, 2021 was an explosive year for FinTech Club. As Bitcoin prices peaked, FinTech-related investments soared, so was FinTech Club’s brand name elevated to the next level. We won “Best Academic Club of Semester” RMIT title for two semesters, successfully organized two major large-scale events envisioned by Ms. Hao, and our club members achieved significant recognition in international competitions. Apart from academics, we also initiated media endeavors like the FinTech Podcast, CafeFin weekly news, and the FinTech Magazine.",
  },
  {
    year: "2022",
    title: "Resilient As Ever",
    content:
      "With a bold mindset, FinTech Club ventured into a broad range of projects and activities in 2022, to deliver more diverse value and experiences for members. Apart from annualized events, we also initiated a charity-fundraising initiative for social causes, partnered with various industry partners, and initiated an internal blockchain development competition called “Star-Up” in collaboration with KardiaChain. Internally, we also created new bonding activity formats, such as the “End-of-Semester Trip” and the “FinTech Olympics”. Despite significant economic fluctuations, our FinTech Club remained resilient through an experimentative spirit.",
  },
  {
    year: "2023",
    title: "Without The People, There Wouldn’t Be A Club!",
    content:
      "In the pursuit of status, recognition and achievement, we as a club cannot forget what makes us who we are – the people. In 2023, our leadership philosophy shifted more towards fostering member well-being and skill/knowledge development. Our club members became more empowered, more connected with each other through this period, through projects such as the RMIT FinTech Blockchain Forum 2023, Club Day project, RMIT Business Plan Competition 2023, Finalytics Day, SnapID app development, and more. We learned that member empowerment is everything.",
  },
  {
    year: "2024",
    title: "Creating Exceptional Value",
    content:
      "After four years of trials-tribulations, our club had grown more experienced and more matured, readying us for a giant leap in 2024 and beyond! Our mission this year is to deliver exceptional value to internal club members, while further heightening our club’s presence in the RMIT community and abroad. To realize this objective, we aim to organize more Business & Tech skill workshops, upscale our media projects, and initiate more mutually beneficial collaborations with industry and student clubs to create real-life experiences for members. Ultimately, we want to further contribute to a FinTech Club that members are proud of, and that the community admires.",
  },
  {
    year: "2025",
    title: "Going Beyond!",
    content:
      "In 2025, FinTech Club looks ahead with a vision that extends beyond the walls of RMIT while staying rooted in the spirit of community. Externally, we aim to expand our influence by engaging more deeply with industry partners, universities, and national and international initiatives, bringing the name of the RMIT FinTech Club onto a larger stage. Internally, we continue cultivating an environment where members can learn, bond, and thrive, ensuring that everyone finds growth and belonging. This year is about balance: pushing outward to create impact while reinforcing the values, culture, and connections that make FinTech Club a home for its members.",
  },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: { zIndex: 1, x: 0, opacity: 1 },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 100 : -100,
    opacity: 0,
  }),
};

export default function HistorySection() {
  const [emblaHorizontalRef, emblaHorizontalApi] = useEmblaCarousel({
    loop: false,
    dragFree: true,
    align: "center",
  });

  const [centerSlideIndex, setCenterSlideIndex] = useState<number>(0);
  const prevIndexRef = useRef(centerSlideIndex);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const newDirection =
      centerSlideIndex > prevIndexRef.current
        ? 1
        : centerSlideIndex < prevIndexRef.current
        ? -1
        : 0;
    setDirection(newDirection);
    prevIndexRef.current = centerSlideIndex;
  }, [centerSlideIndex]);

  // --- EMBLA SYNC LOGIC ---

  // 1. Sync Carousel SWIPING to our React state
  const onSelect = useCallback(() => {
    if (!emblaHorizontalApi) return;
    const selectedIndex = emblaHorizontalApi.selectedScrollSnap();
    setCenterSlideIndex(selectedIndex);
  }, [emblaHorizontalApi]);

  useEffect(() => {
    if (!emblaHorizontalApi) return;
    emblaHorizontalApi.on("select", onSelect);
    return () => {
      emblaHorizontalApi.off("select", onSelect);
    };
  }, [emblaHorizontalApi, onSelect]);

  // 2. Sync React state TO the carousel
  useEffect(() => {
    if (emblaHorizontalApi) {
      emblaHorizontalApi.scrollTo(centerSlideIndex);
    }
  }, [emblaHorizontalApi, centerSlideIndex]);

  const handleYearClick = (index: number) => {
    setCenterSlideIndex(index);
  };

  return (
    <section className="bg-[#F9FAFB] w-full px-4 md:px-6 pt-[1.5rem] pb-8 md:pb-[10rem] text-center overflow-hidden">
      <div className="relative w-full">
        {/* --- DECORATIONS --- */}
        <Image
          src="https://d2uq10394z5icp.cloudfront.net/global/Mascot+-+M%E1%BA%B7t+tr%C6%B0%E1%BB%9Bc.svg"
          alt="Bear mascot"
          className="hidden md:block absolute w-[368px] left-[-8.5rem] top-[22rem] rotate-[50deg] z-30"
          width={400}
          height={400}
          loading="lazy"
        />
        <Image
          src="https://d2uq10394z5icp.cloudfront.net/global/Mascot+-+M%E1%BA%B7t+tr%C6%B0%E1%BB%9Bc.svg"
          alt="Bear mascot"
          className="hidden md:block absolute w-[368px] top-[23rem] right-[-8rem] rotate-[-50deg] z-30"
          width={400}
          height={400}
          loading="lazy"
        />
        <div className="hidden md:block absolute top-[4rem] left-[2rem] w-[1rem] h-[1rem] bg-[#2C305F] rounded-full z-10"></div>
        <div className="hidden md:block absolute top-[4rem] right-[2rem] w-[1rem] h-[1rem] bg-[#2C305F] rounded-full z-10"></div>
        <div className="hidden md:block absolute top-[4.35rem] left-[2.2rem] w-[12rem] h-[0.25rem] bg-[#2C305F] z-10"></div>
        <div className="hidden md:block absolute top-[4.35rem] right-[2.2rem] w-[12rem] h-[0.25rem] bg-[#2C305F] z-10"></div>

        <Image
          src="/Right_History_Decoration.svg"
          alt="Right History Decoration"
          className="hidden md:block absolute bottom-[-12rem] -right-[2rem] w-[25vw] h-auto z-10"
          width={70}
          height={70}
          loading="lazy"
        />
        <Image
          src="/Left_History_Decoration.svg"
          alt="Left History Decoration"
          className="hidden md:block absolute bottom-[-10rem] left-0 w-[19vw] h-auto z-10"
          width={70}
          height={70}
          loading="lazy"
        />

        {/* --- HEADER --- */}
        <div className="relative z-40">
          <h5
            className={`
                text-lg md:text-[1.5rem] text-[#2C305F] font-semibold 
                ${fontSans.style}
              `}
          >
            BACK TO TIME
          </h5>
          <h3
            className={`
                leading-snug md:leading-[3rem] text-[1.55rem] md:text-[3rem] font-bold md:mt-2
              `}
          >
            <span className="text-[#2C305F]">Discover the </span>
            <span className="text-[#DCB968]">FINTECH CLUB </span>
          </h3>
          <h3
            className={`
                leading-snug md:leading-[3rem] text-[1.55rem] md:text-[3rem] font-bold mt-2 md:mt-4 text-[#97ABD6]
              `}
          >
            Story & History
          </h3>
        </div>

        {/* --- YEAR SECTION --- */}
        <div className="my-4 md:my-[3.5rem] z-40 relative">
          {/* 1. DESKTOP VERSION (Animated) */}
          <div className="hidden md:flex justify-center items-center h-48 relative">
            {historyData.map((item, index) => {
              const position = index - centerSlideIndex;

              // 1. Define Animation Properties
              let x = "0rem";
              let scale = 1;
              let zIndex = 0;
              let opacity = 0;

              if (position === 0) {
                // Center
                zIndex = 3;
                opacity = 1;
                scale = 1;
                x = "0rem";
              } else if (position === -1) {
                // Left 1
                zIndex = 2;
                opacity = 1;
                scale = 7 / 12;
                x = "-13.5rem";
              } else if (position === 1) {
                // Right 1
                zIndex = 2;
                opacity = 1;
                scale = 7 / 12;
                x = "13.5rem";
              } else if (position === -2) {
                // Left 2
                zIndex = 1;
                opacity = 1;
                scale = 7 / 12;
                x = "-24.5rem";
              } else if (position === 2) {
                // Right 2
                zIndex = 1;
                opacity = 1;
                scale = 7 / 12;
                x = "24.5rem";
              } else if (position < -2) {
                // Far Left (hidden)
                zIndex = 0;
                opacity = 0;
                scale = 0.3;
                x = "-32rem";
              } else if (position > 2) {
                // Far Right (hidden)
                zIndex = 0;
                opacity = 0;
                scale = 0.3;
                x = "32rem";
              }

              // 2. Define Style Properties
              const isCenter = position === 0;

              return (
                <motion.div
                  key={item.year}
                  className={`
                        absolute w-48 h-48 rounded-full cursor-pointer 
                        flex items-center justify-center
                        transition-colors duration-300
                        ${
                          isCenter
                            ? "bg-[#262857]" // Center color
                            : "bg-[#FBDC83]" // Side color
                        }
                      `}
                  animate={{ x, scale, zIndex, opacity }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  onClick={() => handleYearClick(index)}
                >
                  <span
                    className={`
                          font-bold ${fontSans.style}
                          transition-all duration-300
                          ${
                            isCenter
                              ? "text-4xl text-[#FBDC83]" // Center text
                              : "text-3xl text-[#262857]" // Side text
                          }
                        `}
                  >
                    {item.year}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* 2. MOBILE VERSION: (Carousel, hidden on desktop) */}
          <div
            className="md:hidden w-full overflow-hidden"
            ref={emblaHorizontalRef}
          >
            {/* Thay đổi ở đây */}
            <div className="flex">
              {/* 1. Thêm một slide đệm ở ĐẦU */}
              <div className="flex-[0_0_33.3%] min-w-0" />

              {/* 2. Map qua các slide thật của bạn */}
              {historyData.map((item, index) => {
                const position = index - centerSlideIndex;
                const isCenter = position === 0;

                return (
                  <div
                    key={item.year}
                    className="flex-[0_0_33.3%] min-w-0 pl-3 pr-3"
                    onClick={() => handleYearClick(index)}
                  >
                    <div
                      className={`
                            flex items-center justify-center w-full rounded-full cursor-pointer 
                            transition-all duration-300 ease-out
                            ${
                              isCenter
                                ? "bg-[#262857] h-28" 
                                : "bg-[#FBDC83] h-24" 
                            }
                          `}
                      style={{ aspectRatio: "1" }}
                    >
                      <span
                        className={`
                            font-bold transition-all duration-300 ${
                              fontSans.style
                            }
                            ${
                              isCenter
                                ? "text-2xl text-[#FBDC83]"
                                : "text-xl text-[#262857]"
                            }
                          `}
                      >
                        {item.year}
                      </span>
                    </div>
                  </div>
                );
              })}

              <div className="flex-[0_0_33.3%] min-w-0" />
            </div>
          </div>
        </div>

        {/* --- CONTENT SECTION --- */}
        <motion.div
          layout
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            duration: 0.3,
          }}
          className="relative max-w-3xl mx-auto md:h-[320px] z-40"
        >
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={centerSlideIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="w-full px-0 md:px-[3rem]
                         md:absolute md:top-0 md:left-0"
            >
              <h4
                className={`
                    text-[1.55rem] md:text-4xl font-semibold text-[#97ABD6] mb-4 
                    ${fontSans.style}
                  `}
              >
                {historyData[centerSlideIndex].title}
              </h4>
              <p
                className={`
                    text-base md:text-lg text-justify text-[#000000] 
                    px-0 md:px-[3rem] ${fontSans.style}
                  `}
              >
                {historyData[centerSlideIndex].content}
              </p>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
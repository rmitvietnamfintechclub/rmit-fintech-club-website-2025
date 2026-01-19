"use client";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  PanInfo,
} from "framer-motion";
import {
  Flame,
  MousePointerClick,
  Star,
  Megaphone,
  Lightbulb,
} from "lucide-react";
import React, { useState, useEffect } from "react";

const bestClubImages = [
  {
    id: 5,
    image:
      "https://d2uq10394z5icp.cloudfront.net/home/achievement/BestClubSemA-2021.png",
  },
  {
    id: 4,
    image:
      "https://d2uq10394z5icp.cloudfront.net/home/achievement/BestClubSemB-2021.png",
  },
  {
    id: 3,
    image:
      "https://d2uq10394z5icp.cloudfront.net/home/achievement/BestClubSemA-2023.png",
  },
  {
    id: 2,
    image:
      "https://d2uq10394z5icp.cloudfront.net/home/achievement/BestClubSemB-2023.png",
  },
  {
    id: 1,
    image:
      "https://d2uq10394z5icp.cloudfront.net/home/achievement/BestClubSemC-2024.png",
  },
];

const NEW_AWARDS = {
  academic:
    "https://d2uq10394z5icp.cloudfront.net/home/achievement/AcademicClubOfTheYear-2025.jpg",
  eternal:
    "https://d2uq10394z5icp.cloudfront.net/home/achievement/EternalFlameAward-2025.jpg",
  innovation:
    "https://d2uq10394z5icp.cloudfront.net/home/achievement/InnovationAward-2023.png",
  publicity:
    "https://d2uq10394z5icp.cloudfront.net/home/achievement/PublicityAward-2024.png",
};

const CardStack = () => {
  const [cards, setCards] = useState(bestClubImages);

  const moveToEnd = (fromIndex: number) => {
    setCards((prev) => {
      const newCards = [...prev];
      const item = newCards.splice(fromIndex, 1)[0];
      newCards.unshift(item);
      return newCards;
    });
  };

  return (
    <div className="relative w-full h-[240px] md:h-[340px] flex items-center justify-center mt-4 perspective-1000 pb-8 md:pl-8 pl-12">
      {cards.map((card, index) => (
        <Card
          key={card.id}
          card={card}
          index={index}
          total={cards.length}
          moveToEnd={moveToEnd}
        />
      ))}

      {/* Hint */}
      <div className="min-w-[50vw] md:min-w-0 absolute bottom-[0.75rem] md:bottom-0 left-1/2 -translate-x-1/2 flex justify-center items-center gap-2 text-[#5E5E92]/60 text-xs md:text-sm font-medium z-0 animate-pulse select-none">
        <MousePointerClick size={14} /> Tap or Swipe to view history
      </div>
    </div>
  );
};

const Card = ({ card, index, total, moveToEnd }: any) => {
  const x = useMotionValue(0);
  const isFront = index === total - 1;
  const [multiplier, setMultiplier] = useState(18);

  useEffect(() => {
    const handleResize = () => {
      setMultiplier(window.innerWidth >= 768 ? 27 : 18);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const offset = total - 1 - index; 
  
  const xOffset = -offset * multiplier; 
  const yOffset = -offset * multiplier; 
  
  const scale = 1 - offset * 0.05;
  const zIndex = total - offset;

  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  useEffect(() => {
    if (!isFront) {
      x.set(0);
    }
  }, [isFront, x]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 50;
    if ((Math.abs(info.offset.x) > threshold || Math.abs(info.velocity.x) > 400) && isFront) {
      const direction = info.offset.x > 0 ? 1 : -1;
      
      animate(x, direction * 500, {
        duration: 0.4,
        ease: "easeIn",
        onComplete: () => {
          moveToEnd(index);
        },
      });
    } else {
      animate(x, 0, { type: "spring", stiffness: 300, damping: 25 });
    }
  };

  const handleClick = () => {
    if (isFront) {
      animate(x, 250, {
        duration: 0.3,
        ease: "easeIn",
        onComplete: () => {
          moveToEnd(index);
        },
      });
    }
  };

  return (
    <motion.div
      style={{
        x: isFront ? x : 0, 
        zIndex: zIndex,
        rotate: isFront ? rotate : 0,
        opacity: isFront ? opacity : 1,
        top: "10%", 
        position: "absolute",
        transformOrigin: "center bottom"
      }}
      animate={{
        x: isFront ? 0 : xOffset, 
        y: yOffset,
        scale: scale,
        opacity: index === 0 ? [0, 1] : 1 
      }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
      drag={isFront ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.1}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      whileHover={{
        scale: isFront ? 1.05 : scale,
        cursor: isFront ? "grab" : "default",
      }}
      whileTap={{ cursor: isFront ? "grabbing" : "default" }}
      className={`
        w-[260px] md:w-[420px] aspect-[16/10] rounded-xl shadow-xl 
        bg-white border-[4px] border-white overflow-hidden
        ${isFront ? "shadow-[0_20px_25px_-5px_rgba(0,0,0,0.3)]" : "shadow-sm"}
      `}
    >
      <Image
        src={card.image}
        alt="Achievement"
        fill
        className="object-fill pointer-events-none select-none"
        draggable={false}
      />
    </motion.div>
  );
};

const BentoItem = ({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
    className={`relative rounded-[2rem] overflow-hidden ${className}`}
  >
    {children}
  </motion.div>
);

// --- Main Component ---
const Achievements = () => {
  return (
    <section className="w-full py-8 md:py-16 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#DBB968] opacity-5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#2C305F] opacity-5 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-[#2C305F] mb-4 drop-shadow-sm"
          >
            Our <span className="text-[#DBB968]">Achievements</span>
          </motion.h2>
          <p className="text-[#5E5E92] text-lg md:text-xl font-medium max-w-2xl mx-auto">
            Milestones that mark our journey of dedication, innovation, and
            continuous growth at RMIT.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-auto">
          {/* ===================================================================================== */}
          {/* 1. ACADEMIC CLUB (Hero - Full Overlay on Hover) */}
          {/* ===================================================================================== */}
          <BentoItem className="md:col-span-8 bg-[#2C305F] text-white min-h-[350px] md:min-h-[500px] group shadow-2xl relative overflow-hidden cursor-default">
            <div className="absolute inset-0 z-0">
              <Image
                src={NEW_AWARDS.academic}
                alt="Academic Club of the Year Team"
                fill
                className="object-cover object-bottom transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2C305F] via-[#2C305F]/60 to-transparent opacity-90" />
            </div>

            {/* 2. LAYER CONTENT */}
            <div className="absolute inset-0 z-10 flex flex-col justify-end px-8 py-2 md:px-10 md:py-10">
              <div className="flex flex-col justify-end">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div className="max-w-2xl transition-all duration-500 ease-in-out">
                    {/* Badge & Title */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#DBB968] text-[#2C305F] font-bold text-xs rounded uppercase tracking-wider mb-3 shadow-lg">
                      <Star size={12} fill="#2C305F" /> Most Prestigious
                    </div>

                    <h3 className="text-3xl md:text-5xl font-bold mb-3 leading-tight text-white drop-shadow-lg">
                      Academic Club
                      <br className="hidden md:block" /> Of The Year{" "}
                      <span className="md:hidden">2025</span>
                    </h3>
                  </div>

                  <div className="hidden md:flex flex-col items-end shrink-0">
                    <span
                      className="text-8xl font-black drop-shadow-sm leading-none"
                      style={{
                        background:
                          "linear-gradient(to bottom, #F7D27F, #DBB968)",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                      }}
                    >
                      2025
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </BentoItem>

          {/* 2. ETERNAL FLAME */}
          <BentoItem
            delay={0.1}
            className="md:col-span-4 bg-gradient-to-br from-[#FFFDF5] to-[#fceeb5] border border-[#DBB968]/30 min-h-[450px] flex flex-col relative group shadow-xl"
          >
            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
              <Flame size={180} />
            </div>

            <div className="p-8 pb-4 z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="inline-flex items-center justify-center p-3 bg-white rounded-full shadow-md group-hover:scale-110 transition-transform duration-300">
                  <Flame
                    size={28}
                    className="text-[#DBB968] animate-pulse"
                    fill="#DBB968"
                  />
                </div>
                <div
                  className="text-white text-xs font-bold px-3 py-1 rounded-full shadow-md"
                  style={{
                    background: "linear-gradient(to bottom, #F7D27F, #DBB968)",
                  }}
                >
                  SINCE 2020
                </div>
              </div>

              <h3 className="text-2xl md:text-3xl font-bold text-[#2C305F] mb-2 leading-tight">
                Eternal Flame Award
              </h3>
              <p className="text-[#5E5E92] font-medium text-sm">
                5 Years of Continuous Dedication. Keeping the passion alive.
              </p>
            </div>

            <div className="flex-1 relative mx-6 mb-6 rounded-xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-4 border-white rotate-2 group-hover:rotate-0 transition-transform duration-500">
              <Image
                src={NEW_AWARDS.eternal}
                alt="Eternal Flame Award Team"
                fill
                className="object-cover"
              />
            </div>
          </BentoItem>

          {/* 3. BEST CLUB */}
          <BentoItem
            delay={0.2}
            className="md:col-span-6 bg-white border border-[#2C305F]/10 shadow-lg p-0 overflow-visible h-fit pb-4 flex flex-col"
          >
            <div className="p-8 pb-0 flex flex-col md:flex-row md:items-start justify-between md:gap-4">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-[#2C305F]">
                  Best Club of Semester
                </h3>
              </div>
              <div className="flex self-end items-center w-fit gap-2 md:px-4 md:py-2 md:bg-[#F7D27F]/20 md:rounded-lg">
                <span className="text-4xl font-bold text-[#DBB968]">5</span>
                <span className="text-[#2C305F] font-bold text-sm uppercase flex flex-col leading-none text-left">
                  <span>Times</span>
                </span>
              </div>
            </div>
            <div className="flex-1 w-full md:pb-4">
              <CardStack />
            </div>
          </BentoItem>

          {/* 4. OTHER AWARDS */}
          <div className="md:col-span-6 flex flex-col gap-6 h-full">
            {/* ================= INOVATION AWARD ================= */}
            <BentoItem
              delay={0.3}
              className="flex-[1.4] bg-white border border-gray-200 shadow-sm p-6 flex items-center gap-6"
            >
              <div className="w-40 h-full md:w-48 relative flex-shrink-0 rounded-xl overflow-hidden shadow-inner border border-gray-100">
                <Image
                  src={NEW_AWARDS.innovation}
                  alt="Innovation Award Front"
                  fill
                  className="object-fill z-10"
                />
              </div>

              <div className="flex-1 flex flex-col justify-center py-2">
                <div className="p-2 w-fit bg-[#2C305F]/10 rounded-lg mb-3">
                  <Lightbulb size={24} className="text-[#2C305F]" />
                </div>
                <h4 className="text-xl md:text-3xl font-bold text-[#2C305F] mb-2">
                  Innovation Award
                </h4>
                <span className="text-3xl font-black text-[#2C305F]/80 mt-auto">
                  2023
                </span>
              </div>
            </BentoItem>

            {/* ================= PUBLICITY AWARD ================= */}
            <BentoItem
              delay={0.4}
              className="flex-[1] bg-white border border-gray-200 shadow-sm p-6 flex items-center gap-6"
            >
              <div className="flex-1 flex flex-col justify-center py-2">
                {/* Icon & Title: Màu Vàng */}
                <div className="p-2 w-fit bg-[#DBB968]/15 rounded-lg mb-3">
                  <Megaphone size={24} className="text-[#DBB968]" />
                </div>
                <h4 className="text-xl md:text-3xl font-bold text-[#2C305F] mb-2">
                  Publicity Award
                </h4>
                {/* Năm: Màu Vàng luôn */}
                <span className="text-3xl font-black text-[#DBB968] mt-auto">
                  2024
                </span>
              </div>

              <div className="w-48 md:w-56 h-full relative flex-shrink-0 rounded-xl overflow-hidden shadow-inner border border-gray-100">
                <Image
                  src={NEW_AWARDS.publicity}
                  alt="Publicity Award Front"
                  fill
                  className="object-cover z-10"
                />
              </div>
            </BentoItem>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Achievements;

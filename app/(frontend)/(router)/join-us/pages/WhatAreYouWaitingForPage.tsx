"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

interface WhatAreYouWaitingForProps {
  id: string;
}

const WhatAreYouWaitingFor = ({ id }: WhatAreYouWaitingForProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });

  return (
    <div
      id={id}
      ref={ref}
      className="flex flex-col md:flex-row justify-center items-center w-full px-4 md:px-16 py-12 md:py-24 bg-white relative md:min-vh-100 overflow-visible"
    >
      <Image
        src="https://d2uq10394z5icp.cloudfront.net/global/Mascot+-+M%E1%BA%B7t+tr%C6%B0%E1%BB%9Bc.svg"
        alt="Decoration"
        height={100}
        width={100}
        fetchPriority="high"
        priority={true}
        loading="eager"
        className="absolute top-[-3rem] left-[-5rem] w-[12vw] md:w-[14vw] lg:w-[16vw] rotate-[25deg] pointer-events-none"
      />

      {/* --- SPEECH BUBBLE CONTAINER --- */}
      <motion.div
        className="relative flex-1 flex flex-col items-center text-center p-10 md:p-14 bg-white rounded-[3rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 z-10"
        initial={{ opacity: 0, scale: 0.8, x: -50 }}
        animate={isInView ? { opacity: 1, scale: 1, x: 0 } : {}}
        transition={{ type: "spring", bounce: 0.4, duration: 1 }}
      >
        <div 
          className="hidden md:block absolute top-1/2 -right-4 w-10 h-10 bg-white border-t border-r border-gray-100 transform -translate-y-1/2 rotate-45"
          style={{ 
             zIndex: 1,
             boxShadow: "4px -4px 4px -4px rgba(0,0,0,0.05)" 
          }} 
        />
        <div className="hidden md:block absolute top-1/2 right-0 w-6 h-12 bg-white transform -translate-y-1/2 z-10" />

        <div className="relative z-20 w-full">
            <motion.h2
              className="text-[1.45rem] md:text-4xl font-extrabold text-[#2C305F] mb-4 md:mb-8 tracking-tight"
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              What Are You Waiting For?
            </motion.h2>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              {/* Registration Button */}
              <motion.div
                 className="p-0.5 rounded-[12px] shadow-sm"
                 style={{ background: "linear-gradient(to bottom, #F7D27F, #DBB968)" }}
              >
                <a
                  href="https://bit.ly/2025C_FTC_RecruitmentForm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center px-8 py-4 bg-yellowPrimary text-[#2C305F] font-bold text-lg rounded-[10px] transition-all hover:bg-yellowEarth hover:text-white w-full sm:w-auto whitespace-nowrap"
                >
                  Registration Form
                </a>
              </motion.div>

              {/* Booklet Button */}
              <motion.div
                 className="p-0.5 rounded-[12px] shadow-sm"
                 style={{ background: "linear-gradient(to bottom, #C0C4DC, #5E5E92)" }}
              >
                <a
                  href="https://bit.ly/2025C_FTC_Booklet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center px-8 py-4 bg-white text-[#2C305F] font-bold text-lg rounded-[10px] transition-all hover:bg-blueSlate hover:text-white w-full sm:w-auto whitespace-nowrap"
                >
                  View Our Booklet
                </a>
              </motion.div>
            </div>
        </div>
      </motion.div>

      {/* --- MASCOT IMAGE --- */}
      <motion.div
        className="relative flex-1 flex items-center justify-center"
        initial={{ opacity: 0, x: 50, rotate: 10 }}
        whileHover={{ scale: 1.05, rotate: 0, transition: { duration: 0.3 } }}
        animate={isInView ? { opacity: 1, x: 0, rotate: 0 } : {}}
        transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.2 }}
      >
        <Image
          src="https://d2uq10394z5icp.cloudfront.net/join_us/DecorationBear.svg"
          alt="Fintech Bear saying hello"
          width={500}
          height={500}
          fetchPriority="high"
          priority={true}
          loading="eager"
          className="w-[70vw] sm:w-[50vw] md:w-[40vw] lg:w-[35vw] aspect-square object-contain drop-shadow-2xl"
          // Thêm style này để đảm bảo gấu không đè lên bóng thoại
          style={{ zIndex: 0 }}
        />
      </motion.div>
    </div>
  );
};

export default WhatAreYouWaitingFor;
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
      className="flex flex-col md:flex-row justify-center items-center w-full px-12 py-12 bg-white relative"
      style={{
        minHeight: "100vh",
      }}
    >
      <Image
        src="https://d2prwyp3rwi40.cloudfront.net/global/Mascot+-+M%E1%BA%B7t+tr%C6%B0%E1%BB%9Bc.svg"
        alt="Step 1"
        height={100}
        width={100}
        fetchPriority="high"
        priority={true}
        loading="eager"
        className="absolute top-[-4rem] left-[-6.5rem] w-[14vw] md:w-[16vw] lg:w-[18vw] rotate-[25deg]"
      />
      <motion.div
        className="flex flex-col items-center text-center mb-8"
        initial={{ opacity: 0, x: -50 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <motion.h2
          className="text-2xl md:text-4xl font-bold text-black mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          What Are You Waiting For?
        </motion.h2>
        {/* 2 divs as gradient border color to buttons */}
        <div className="flex gap-4 mb-2 items-center justify-center">
          <div
            className="p-0.5 rounded-[10px]"
            style={{
              background: "linear-gradient(to bottom, #F0EDFF, #5E5E92)",
            }}
          >
            <a
              href="https://forms.office.com/r/Z55Yha5E10"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-full h-full px-6 py-3 bg-yellowPrimary text-black font-semibold rounded-lg transition duration-600 ease-in-out hover:bg-yellowEarth hover:text-white text-center"
            >
              Registration Form
            </a>
          </div>
          <div
            className="p-0.5 rounded-[10px]"
            style={{
              background: "linear-gradient(to bottom, #F0EDFF, #5E5E92)",
            }}
          >
            <a
              href="https://bit.ly/FTC_Recruitment_Booklet_2024C"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-6 py-3 bg-blueMist text-black font-semibold rounded-lg transition duration-600 ease-in-out hover:bg-blueSlate hover:text-white text-center"
            >
              View Our Booklet
            </a>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="relative flex items-center justify-center w-auto h-auto"
        initial={{ opacity: 0, x: 50 }}
        whileHover={{ scale: 1.03 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        <Image
          src="https://d2prwyp3rwi40.cloudfront.net/join_us/DecorationBear.svg"
          alt="Fintech Bear"
          width={300}
          height={300}
          fetchPriority="high"
          priority={true}
          loading="eager"
          className="w-[35vw] lg:w-[40vw] aspect-square object-contain"
        />
      </motion.div>
    </div>
  );
};

export default WhatAreYouWaitingFor;

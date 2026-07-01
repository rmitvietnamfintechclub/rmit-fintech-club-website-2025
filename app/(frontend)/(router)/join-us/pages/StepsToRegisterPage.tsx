"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { ArrowDown } from "lucide-react";

interface StepsToRegisterPageProps {
  id: string;
}

const stepsData = [
  {
    id: 1,
    title: "RMIT Club Day",
    desc: "Discover our unique culture and activities.",
    imgUrl: "https://d2uq10394z5icp.cloudfront.net/join_us/Step+1.svg",
    isTop: true,
  },
  {
    id: 2,
    title: "Induction Day",
    desc: "Where you could find out more about us this semester.",
    imgUrl: "https://d2uq10394z5icp.cloudfront.net/join_us/Step+2.svg",
    isTop: false,
  },
  {
    id: 3,
    title: "Application Round",
    desc: "Prepare your CV and fill in our application form.",
    imgUrl: "https://d2uq10394z5icp.cloudfront.net/join_us/Step+3.svg",
    isTop: true,
  },
  {
    id: 4,
    title: "Interview Round",
    desc: "Ace your interview and enter the probation phase.",
    imgUrl: "https://d2uq10394z5icp.cloudfront.net/join_us/Step+4.svg",
    isTop: false,
  },
  {
    id: 5,
    title: "Probation Round",
    desc: "Showcase your passion and join the team!",
    imgUrl: "https://d2uq10394z5icp.cloudfront.net/join_us/Step+5+-+New.png",
    isTop: true,
  },
];

const StepsToRegisterPage = ({ id }: StepsToRegisterPageProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div
      id={id}
      ref={ref}
      className="w-full flex flex-col justify-center items-center bg-white relative pt-8 max-md:pt-4 md:px-8"
      style={{ minHeight: "100vh" }}
    >
      {/* Title Section */}
      <motion.div
        className="text-center max-md:pb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-[900] text-[#2C305F] mb-4 tracking-tight">
          Your Journey <span className="text-[#DBB968]">Starts Here</span>
        </h2>
        <p className="text-gray-500 text-base md:text-xl mx-auto font-medium">
          Follow these 5 simple steps to unlock your potential with RMIT FinTech Club.
        </p>
      </motion.div>

      {/* Steps Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "show" : "hidden"}
        className="flex flex-col lg:flex-row justify-center items-center lg:items-stretch w-full max-w-[1400px] gap-8 lg:gap-0 px-4"
      >
        {stepsData.map((step, index) => (
          <React.Fragment key={step.id}>
            <motion.div
              variants={itemVariants}
              className="flex-1 flex flex-col items-center w-full"
            >
              {/* ==================================================
                  DESKTOP ONLY: Top Text Container (Cố định chiều cao) 
                  ================================================== */}
              <div className="hidden lg:flex flex-col items-center justify-end text-center h-32 mb-6 w-full">
                {step.isTop && (
                  <>
                    <h3 className="text-lg xl:text-2xl font-bold text-[#2C305F] mb-2 leading-tight">
                      {step.title}
                    </h3>
                    <p className="text-sm xl:text-lg text-gray-500 font-normal">
                      {step.desc}
                    </p>
                  </>
                )}
              </div>

              <div className="relative w-56 h-56 shrink-0 hover:scale-105 transition-transform duration-300 drop-shadow-xl max-md:mb-2">
                <Image
                  src={step.imgUrl}
                  alt={step.title}
                  fill
                  sizes="(max-width: 1024px) 150px, 200px"
                  className="object-contain"
                  priority
                />
              </div>

              {/* ==================================================
                  MOBILE ONLY: Text luôn nằm dưới ảnh cho dễ đọc
                  ================================================== */}
              <div className="lg:hidden flex flex-col items-center text-center">
                <h3 className="text-2xl font-bold text-[#2C305F] mb-2">
                  {step.title}
                </h3>
                <p className="text-lg text-gray-500 font-normal">
                  {step.desc}
                </p>
              </div>

              {/* ==================================================
                  DESKTOP ONLY: Bottom Text Container (Cố định chiều cao)
                  ================================================== */}
              <div className="hidden lg:flex flex-col items-center justify-start text-center h-32 mt-6 w-full">
                {!step.isTop && (
                  <>
                    <h3 className="text-lg xl:text-2xl font-bold text-[#2C305F] mb-2 leading-tight">
                      {step.title}
                    </h3>
                    <p className="text-sm xl:text-lg text-gray-500 font-normal">
                      {step.desc}
                    </p>
                  </>
                )}
              </div>
            </motion.div>
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
};

export default StepsToRegisterPage;
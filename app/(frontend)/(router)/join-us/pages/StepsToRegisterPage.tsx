"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

interface StepsToRegisterPageProps {
  id: string;
}

const StepsToRegisterPage = ({ id }: StepsToRegisterPageProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });

  return (
    <div
      id={id}
      ref={ref}
      className="w-full flex flex-col justify-center items-center bg-white relative pt-10 md:px-16"
      style={{ minHeight: "100vh" }}
    >
      <motion.div
        className="text-center md:mb-12 mb-8 px-4"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2 className="text-3xl md:text-6xl font-extrabold text-[#2C305F] mb-4">
          Your Journey <span className="text-[#DBB968]">Starts Here</span>
        </h2>
        
        <p className="text-gray-500 text-base md:text-xl mx-auto font-light">
          Follow these 4 simple steps to unlock your potential with RMIT FinTech Club.
        </p>
      </motion.div>
      {/* ------------------------- */}

      <motion.div
        className="flex flex-col md:grid md:grid-cols-2 lg:flex lg:flex-row justify-center items-center w-full max-w-6xl lg:gap-x-6"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1, ease: "easeInOut", delay: 0.2 }} // Delay xíu để Title hiện trước
      >
        {/* Step 1 */}
        <div className="flex md:flex-col flex-col-reverse items-center text-center">
          <div className="max-w-md md:max-w-none">
            <p className="text-2xl font-semibold text-black mb-2">
              RMIT Club Day
            </p>
            <p className="text-lg text-gray-600 mb-4">
              Discover our unique culture and activities.
            </p>
          </div>

          <div>
            <Image
              src="https://d2uq10394z5icp.cloudfront.net/join_us/Step+1.svg"
              alt="Step 1"
              height={100}
              width={100}
              fetchPriority="high"
              priority={true}
              loading="eager"
              className="w-[40vw] md:w-[18vw]"
            />
          </div>
        </div>

        {/* Mobile Arrow */}
        <div className="md:hidden flex flex-col items-center mt-2">
          <img
            src="/joinUsPage/MobileArrow.svg"
            alt="Dotted Arrow"
            className="hidden md:block w-[10px] h-[70px]"
          />
        </div>

        {/* Step 2 */}
        <div className="flex flex-col items-center text-center">
          <div>
            <Image
              src="https://d2uq10394z5icp.cloudfront.net/join_us/Step+2.svg"
              alt="Step 2"
              height={100}
              width={100}
              fetchPriority="high"
              priority={true}
              loading="eager"
              className="w-[40vw] md:w-[18vw]"
            />
          </div>
          <p className="text-2xl font-semibold text-black mt-2">
            Induction Day
          </p>
          <p className="text-lg text-gray-600 mt-2 md:max-w-none max-w-md">
            Where you could find out more about us this semester.
          </p>
        </div>

        {/* Mobile Arrow */}
        <div className="md:hidden flex flex-col items-center m-3">
          <img
            src="/joinUsPage/MobileArrow.svg"
            alt="Dotted Arrow"
            className="hidden md:block w-[10px] h-[70px]"
          />
        </div>

        {/* Step 3 */}
        <div className="flex md:flex-col flex-col-reverse items-center text-center">
          <div className="md:max-w-none max-w-md">
            <p className="text-2xl font-semibold text-black mb-2">
              Application Round
            </p>
            <p className="text-lg text-gray-600 mb-4">
              Prepare your CV and fill in our application form.
            </p>
          </div>

          <div>
            <Image
              src="https://d2uq10394z5icp.cloudfront.net/join_us/Step+3.svg"
              alt="Step 3"
              height={100}
              width={100}
              fetchPriority="high"
              priority={true}
              loading="eager"
              className="w-[40vw] md:w-[18vw]"
            />
          </div>
        </div>

        {/* Mobile Arrow */}
        <div className="md:hidden flex flex-col items-center mt-2">
          <img
            src="/joinUsPage/MobileArrow.svg"
            alt="Dotted Arrow"
            className="hidden md:block w-[10px] h-[70px]"
          />
        </div>

        {/* Step 4 */}
        <div className="flex flex-col items-center text-center">
          <div>
            <Image
              src="https://d2uq10394z5icp.cloudfront.net/join_us/Step+4.svg"
              alt="Step 4"
              height={100}
              width={100}
              fetchPriority="high"
              priority={true}
              loading="eager"
              className="w-[40vw] md:w-[18vw]"
            />
          </div>
          <p className="text-2xl font-semibold text-black mt-4">
            Interview Round
          </p>
          <p className="text-lg text-gray-600 md:max-w-none max-w-md mt-1">
            Ace your interview and join the team!
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default StepsToRegisterPage;
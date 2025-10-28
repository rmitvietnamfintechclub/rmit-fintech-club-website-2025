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
      className="w-full flex justify-center items-center bg-white relative"
      style={{ minHeight: "100vh" }}
    >
      <motion.div
        className="flex flex-col md:grid md:grid-cols-2 lg:flex lg:flex-row justify-center items-center w-full max-w-6xl lg:gap-x-6"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        <div className="flex flex-col items-center text-center">
          <p className="text-xl md:text-xl lg:text-2xl font-semibold text-black mb-2">
            RMIT Club Day
          </p>
          <p className="text-lg md:text-base lg:text-lg text-gray-600 mb-4">
            Discover our unique <br /> culture and activities.
          </p>
          <div>
            <Image
              src="https://d2prwyp3rwi40.cloudfront.net/join_us/Step+1.svg"
              alt="Step 1"
              height={100}
              width={100}
              fetchPriority="high"
              priority={true}
              loading="eager"
              className="w-[14vw] md:w-[16vw] lg:w-[18vw]"
            />
          </div>
        </div>

        <div className="md:hidden flex flex-col items-center mt-2">
          <img
            src="/joinUsPage/MobileArrow.svg"
            alt="Dotted Arrow"
            className="w-[10px] h-[70px]"
          />
        </div>

        <div className="flex flex-col items-center text-center">
          <div>
            <Image
              src="https://d2prwyp3rwi40.cloudfront.net/join_us/Step+2.svg"
              alt="Step 2"
              height={100}
              width={100}
              fetchPriority="high"
              priority={true}
              loading="eager"
              className="w-[14vw] md:w-[16vw] lg:w-[18vw]"
            />
          </div>
          <p className="text-xl md:text-xl lg:text-2xl font-semibold text-black mt-4">
            Induction Day
          </p>
          <p className="text-lg md:text-base lg:text-lg text-gray-600">
            Where you could find out more <br /> about us this semester.
          </p>
        </div>

        <div className="md:hidden flex flex-col items-center m-3">
          <img
            src="/joinUsPage/MobileArrow.svg"
            alt="Dotted Arrow"
            className="w-[10px] h-[70px]"
          />
        </div>

        <div className="flex flex-col items-center text-center">
          <p className="text-xl md:text-xl lg:text-2xl font-semibold text-black mb-2">
            Application Round
          </p>
          <p className="text-lg md:text-base lg:text-lg text-gray-600 mb-4">
            Prepare your CV and fill in our <br /> application form.
          </p>
          <div>
            <Image
              src="https://d2prwyp3rwi40.cloudfront.net/join_us/Step+3.svg"
              alt="Step 3"
              height={100}
              width={100}
              fetchPriority="high"
              priority={true}
              loading="eager"
              className="w-[14vw] md:w-[16vw] lg:w-[18vw]"
            />
          </div>
        </div>

        <div className="md:hidden flex flex-col items-center mt-2">
          <img
            src="/joinUsPage/MobileArrow.svg"
            alt="Dotted Arrow"
            className="w-[10px] h-[70px]"
          />
        </div>

        <div className="flex flex-col items-center text-center">
          <div>
           <Image
              src="https://d2prwyp3rwi40.cloudfront.net/join_us/Step+4.svg"
              alt="Step 4"
              height={100}
              width={100}
              fetchPriority="high"
              priority={true}
              loading="eager"
              className="w-[14vw] md:w-[16vw] lg:w-[18vw]"
            />
          </div>
          <p className="text-xl md:text-xl lg:text-2xl font-semibold text-black mt-4">
            Interview Round
          </p>
          <p className="text-lg md:text-base lg:text-lg text-gray-600">
            Ace your interview <br /> and join the team!
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default StepsToRegisterPage;

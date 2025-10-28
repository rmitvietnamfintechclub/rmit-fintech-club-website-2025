import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

function III() {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.3, // how much needs to be visible
    triggerOnce: false, // allow re-trigger on scroll
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [inView, controls]);

  const fromLeft = {
    hidden: {
      opacity: 0,
      x: -100,
      transition: { duration: 0.6, ease: "easeInOut" },
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const fromRight = {
    hidden: {
      opacity: 0,
      x: 100,
      transition: { duration: 0.6, ease: "easeInOut" },
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <section
      ref={ref}
      className="content relative bg-[#F9FAFB] bg-cover bg-center pt-[52rem]"
    >
      <h1 className="absolute bg-[#2C305F] text-[6rem] text-white p-[1rem] w-[60rem] h-[6rem] top-12 rounded-br-3xl text-center shadow-2xl">
        WHAT WE TRULY BELIEVE IN
      </h1>

      <div className="absolute -translate-y-[41.5rem] z-20">
        <div className="grid grid-cols-[1fr,auto,1fr] grid-rows-3 w-[100vw] h-fit">
          {/* Row 1 */}
          <h2 className="text-[4rem]"> </h2>
          <div className="flex items-center justify-center w-fit py-[1.7rem]">
            <h1 className="text-[#2C305F] !text-[5rem]">I</h1>
          </div>
          <div className="flex items-center justify-start flex-1 overflow-hidden">
            <motion.h2
              className="text-[#5E5E92] font-extrabold text-[4rem]"
              variants={fromLeft}
              initial="hidden"
              animate={controls}
            >
              NNOVATIVE
            </motion.h2>
          </div>

          {/* Row 2 */}
          <div className="flex items-center justify-end flex-1 py-[1.9rem] overflow-hidden">
            <motion.h2
              className="text-[#5E5E92] text-[4rem]"
              variants={fromRight}
              initial="hidden"
              animate={controls}
            >
              INCUBAT
            </motion.h2>
          </div>
          <div className="flex items-center justify-center w-fit py-[1.9rem]">
            <h1 className="text-[#2C305F] !text-[5rem]">I</h1>
          </div>
          <div className="flex items-center justify-start flex-1 py-[1.9rem] overflow-hidden">
            <motion.h2
              className="text-[#5E5E92] text-[4rem]"
              variants={fromLeft}
              initial="hidden"
              animate={controls}
            >
              ON
            </motion.h2>
          </div>

          {/* Row 3 */}
          <div className="flex items-center justify-end flex-1 py-[1.9rem] overflow-hidden">
            <motion.h2
              className="text-[#5E5E92] text-[4rem]"
              variants={fromRight}
              initial="hidden"
              animate={controls}
            >
              INSP
            </motion.h2>
          </div>
          <div className="flex items-center justify-center w-fit py-[1.9rem]">
            <h1 className="text-[#2C305F] !text-[5rem]">I</h1>
          </div>
          <div className="flex items-center justify-start flex-1 py-[1.9rem] overflow-hidden">
            <motion.h2
              className="text-[#5E5E92] text-[4rem]"
              variants={fromLeft}
              initial="hidden"
              animate={controls}
            >
              RING
            </motion.h2>
          </div>
        </div>
      </div>

      <div className="absolute -translate-y-[42rem] z-10">
        <div className="grid grid-cols-[1fr,auto,1fr] grid-rows-3 w-[100vw] h-fit">
          {/* Row 1 */}
          <div className="relative flex items-center justify-end flex-1 mt-4 overflow-hidden">
            <motion.p
              className="text-[#0D1742] text-[1.25rem] max-w-[32rem] relative text-right mr-8"
              variants={fromRight}
              initial="hidden"
              animate={controls}
            >
              We embrace the idea of thinking beyond traditional boundaries and
              challenging the norm. Innovation involves transforming creative
              concepts into something truly valuable
            </motion.p>
          </div>
          <div className="relative flex items-center justify-center w-fit"></div>
          <div className="relative flex items-center justify-start flex-1"></div>
          {/* Row 2 */}
          <div className="relative flex items-center justify-end flex-1"></div>
          <div className="relative flex items-center justify-center w-fit"></div>
          <motion.div
            className="relative flex items-center justify-start flex-1"
            variants={fromLeft}
            initial="hidden"
            animate={controls}
          >
            <p className="text-[#0D1742] text-[1.25rem] max-w-[24rem] relative text-left ml-32">
              Nurturing the next generation of thinkers, pioneers, distributors,
              leaders, innovators, providing practical experience and
              opportunity.
            </p>
          </motion.div>
          {/* Row 3 */}
          <motion.div
            className="relative flex items-center justify-end flex-1"
            variants={fromRight}
            initial="hidden"
            animate={controls}
          >
            <p className="text-[#0D1742] text-[1.25rem] max-w-[24rem] relative text-right mr-44">
              We believe in building a club where members are inspired by their
              work and contributions.
            </p>
          </motion.div>
          <div className="relative flex items-center justify-center w-fit"></div>
          <motion.div
            className="relative flex items-center justify-start flex-1"
            variants={fromLeft}
            initial="hidden"
            animate={controls}
          >
            <p className="text-[#0D1742] text-[1.25rem] max-w-[24rem] relative text-left ml-48">
              We hope to ignite a sense of purpose and motivation in everyone
              involved, making it a vibrant community.
            </p>
          </motion.div>
        </div>
      </div>

			<div className="absolute w-[25rem] h-[25rem] bg-[#FFEFCA] rounded-full top-[46%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0"></div>
			<div className="absolute w-[20rem] h-[20rem] bg-[#F7D27F] rounded-full top-[3rem] right-[-11rem]"></div>
			<div className="absolute w-[3.5rem] h-[3.5rem] bg-[#F0EDFF] rounded-full top-[20rem] right-[7rem]"></div>
			<div className="absolute w-[6rem] h-[6rem] bg-[#FFEFCA] rounded-full top-[23rem] right-[1rem]"></div>
			<div className="absolute w-[7rem] h-[7rem] bg-[#FFEFCA] rounded-full top-[21rem] left-[1rem]"></div>
			<div className="absolute w-[18rem] h-[18rem] bg-[#F7D27F] rounded-full top-[22rem] left-[-12rem]"></div>
			<div className="absolute w-[3rem] h-[3rem] bg-[#F0EDFF] rounded-full top-[17rem] left-[1rem]"></div>

			<div className="absolute w-[10rem] h-[10rem] bg-[#C9D6EA] rounded-full top-[41rem] left-[-2.5rem]"></div>
			<div className="absolute w-[10rem] h-[10rem] bg-[#2B305E] rounded-full top-[46rem] left-[4rem]"></div>
			<div className="absolute w-[10rem] h-[10rem] bg-[#DBB968] rounded-full top-[53rem] left-[-4.5rem]"></div>

			<div className="absolute w-[2rem] h-[2rem] bg-[#2B305E] rounded-full top-[48rem] left-[18rem]"></div>
			<div className="absolute w-[2.5rem] h-[2.5rem] bg-[#DBB968] rounded-full top-[58rem] left-[8rem]"></div>
		</section>
	);
}

export default III;

"use client";

import { siteConfig } from "@/config/site";
import Link from "next/link";
import React, { useState, useEffect, type ButtonHTMLAttributes, useRef } from "react";
import {
  type Variant,
  motion,
  useAnimate,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { atom, useAtom } from "jotai";

const isOpenAtom = atom(false);
export let headerHeight: number;

const Navbar = () => {
  const [isOpen, setIsOpen] = useAtom(isOpenAtom);
  
  const [hidden, setHidden] = useState(false);
  const isOpenRef = useRef(isOpen);
  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  const { scrollY } = useScroll();

  // Optimized Scroll Handler using Framer Motion
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    
    // 1. If Mobile Menu is Open, NEVER hide navbar
    if (isOpenRef.current) {
      setHidden(false);
      return;
    }

    // 2. Logic: Show/Hide based on direction
    if (latest > previous && latest > 150) {
      // Scrolling DOWN and past 150px -> HIDE
      setHidden(true);
    } else {
      // Scrolling UP or at TOP -> SHOW
      setHidden(false);
    }
  });

  const ulVariants = {
    open: {
      right: 0,
      transition: { staggerChildren: 0.07, delayChildren: 0.2 },
    } as Variant,
    closed: {
      right: "-100%",
      transition: { staggerChildren: 0.05, staggerDirection: -1 },
    } as Variant,
  };

  const navBarItemVariants = {
    open: {
      y: 0,
      opacity: 1,
      transition: {
        y: { stiffness: 1000, velocity: -100 },
      },
    },
    closed: {
      y: 50,
      opacity: 0,
      transition: {
        y: { stiffness: 1000 },
      },
    },
  };

  return (
    <motion.nav
      // animate based on hidden state
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="sticky top-0 h-[8vh] py-[1vh] z-50 flex w-full transition-[colors, transform] duration-300 bg-ft-primary-blue shadow-md"
    >
      <div className="flex justify-between items-center pr-[2vw] w-full">
        <Link
          href="/"
          className="logo relative h-[6.4vh] px-[3vh] bg-[#E5E5E5] flex items-center rounded-r-[3vh] cursor-pointer"
        >
          <div
            className="h-[70%] aspect-square bg-center bg-contain bg-no-repeat"
            style={{
              backgroundImage: `url('https://d2uq10394z5icp.cloudfront.net/global/FTC-DefaultLogo-NoName.svg')`,
            }}
          ></div>
        </Link>
        <div className="md:hidden h-fit flex justify-center items-center">
          <AnimatedHamburger />
        </div>
        <motion.ul
          variants={ulVariants}
          // Use 'animate' prop directly controlled by isOpen state
          animate={isOpen ? "open" : "closed"}
          className={
            "fixed -right-full bottom-0 w-[50vw] bg-ft-primary-blue md:hidden"
          }
          // Adjust top position since we removed ref. Assuming standard header height or use fixed value.
          style={{ top: "8vh" }} 
        >
          {siteConfig.navItems.map((item) => (
            <motion.li
              variants={navBarItemVariants}
              key={item.href}
              className="my-6"
            >
              <Link
                className="font-bold text-white mx-6 hover:text-ft-secondary-yellow"
                href={item.href}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            </motion.li>
          ))}

          <motion.li variants={navBarItemVariants} className="mt-10">
            <Link
              className="transition-all duration-200 hover:brightness-110 hover:scale-105 py-[2vh] px-[4vw] mx-6 bg-[#DCB968] text-white rounded-[1vh] cursor-pointer font-bold"
              href="/join-us"
              onClick={() => setIsOpen(false)}
            >
              Join Us
            </Link>
          </motion.li>
        </motion.ul>
        <div className="hidden md:relative md:flex">
          <ul className="flex md:items-center space-x-[4vw]">
            {siteConfig.navItems.map((item) => (
              <li key={item.label}>
                <Link
                  className="font-bold text-white hover:text-ft-secondary-yellow text-[2vh] cursor-pointer"
                  href={item.href}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/join-us"
            className="transition-all duration-200 hover:brightness-110 hover:scale-105 text-[2vh] leading-[2vh] py-[2vh] ml-[6vw] flex items-center justify-center px-[1vw] bg-[#DCB968] text-white rounded-[1vh] cursor-pointer font-bold"
          >
            Join Us
          </Link>
        </div>
      </div>
    </motion.nav>
  );
};

interface AnimatedHamburgerProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  stroke?: number;
  size?: number;
}

const AnimatedHamburger = ({
  stroke = 2,
  size = 24,
}: AnimatedHamburgerProps) => {
  const [isOpen, setIsOpen] = useAtom(isOpenAtom);

  const [containerBarScope, animateContainerBar] = useAnimate();

  const [topBarScope, animateTopBar] = useAnimate();
  const [bottomBarScope, animateBottomBar] = useAnimate();

  const containerStyles = {
    position: "relative",
    width: `${size}px`,
    height: `${size}px`,
    cursor: "pointer",
  } as React.CSSProperties;

  const barStyles = {
    width: `${size}px`,
    position: "absolute",
    height: `${stroke}px`,
    backgroundColor: "white",
  } as React.CSSProperties;

  useEffect(() => {
    async function animateBars() {
      if (isOpen) {
        // Closing animation
        animateTopBar(
          topBarScope.current,
          { top: "50%" },
          {
            duration: 0.2,
            type: "tween",
            ease: "easeInOut",
          }
        );
        await animateBottomBar(
          bottomBarScope.current,
          { top: "50%" },
          {
            duration: 0.2,
            type: "tween",
            ease: "easeInOut",
          }
        );

        // Spinning
        animateTopBar(
          topBarScope.current,
          { rotate: 90 },
          {
            duration: 1.4,
            type: "spring",
            bounce: 0.4,
          }
        );
        animateContainerBar(
          containerBarScope.current,
          { rotate: 135 },
          {
            duration: 1.4,
            type: "spring",
            bounce: 0.4,
          }
        );
      } else {
        // Spin back
        animateContainerBar(
          containerBarScope.current,
          { rotate: -0 },
          {
            duration: 0.8,
            type: "spring",
            bounce: 0.2,
          }
        );
        await animateTopBar(
          topBarScope.current,
          { rotate: -0 },
          {
            duration: 0.8,
            type: "spring",
            bounce: 0.2,
          }
        );

        // Opening animation
        animateTopBar(
          topBarScope.current,
          { top: "0%" },
          {
            duration: 0.2,
            type: "tween",
            ease: "easeInOut",
          }
        );
        animateBottomBar(
          bottomBarScope.current,
          { top: "100%" },
          {
            duration: 0.2,
            type: "tween",
            ease: "easeInOut",
          }
        );
      }
    }
    animateBars();
  }, [isOpen]);

  return (
    <motion.button
      ref={containerBarScope}
      style={containerStyles}
      onClick={() => {
        setIsOpen(!isOpen);
        // Removed global variable toggle as we are using state
      }}
    >
      <motion.div
        ref={topBarScope}
        style={barStyles}
        className="top-0"
      ></motion.div>
      <motion.div style={barStyles}></motion.div>
      <motion.div
        ref={bottomBarScope}
        style={barStyles}
        className="top-full"
      ></motion.div>
    </motion.button>
  );
};

export default Navbar;
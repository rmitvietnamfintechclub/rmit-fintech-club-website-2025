"use client";

import { siteConfig } from "@/config/site";
import Link from "next/link";
import React, {
  useState,
  useEffect,
  type ButtonHTMLAttributes,
  useRef,
} from "react";
import {
  motion,
  useAnimate,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { atom, useAtom } from "jotai";

const isOpenAtom = atom(false);

const Navbar = () => {
  const [isOpen, setIsOpen] = useAtom(isOpenAtom);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isOpenRef = useRef(isOpen);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;

    if (latest > 20) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }

    if (isOpenRef.current || latest < 50) {
      setHidden(false);
      return;
    }

    if (latest > previous && latest > 150) {
      setHidden(true);
    }
    else if (latest < previous) {
      setHidden(false);
    }
  });

  // Variants animation
  const navbarVariants = {
    visible: { y: 0 },
    hidden: { y: "-100%" },
  };

  const ulVariants = {
    open: {
      right: 0,
      transition: { staggerChildren: 0.07, delayChildren: 0.2 },
    },
    closed: {
      right: "-100%",
      transition: { staggerChildren: 0.05, staggerDirection: -1 },
    },
  };

  const navBarItemVariants = {
    open: {
      y: 0,
      opacity: 1,
      transition: { y: { stiffness: 1000, velocity: -100 } },
    },
    closed: { y: 50, opacity: 0, transition: { y: { stiffness: 1000 } } },
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  return (
    <motion.nav
      variants={navbarVariants}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`sticky md:fixed top-0 left-0 right-0 z-50 h-[8vh] py-[1vh] flex w-full transition-colors duration-300 hover:bg-ft-primary-blue hover:shadow-md ${
        scrolled || isOpen
          ? "bg-ft-primary-blue shadow-md"
          : "md:bg-transparent md:shadow-none bg-ft-primary-blue shadow-md"
      }`}
    >
      <div className="flex justify-between items-center pr-[2vw] w-full">
        {/* Logo */}
        <Link
          href="/"
          className="logo relative h-[6.4vh] px-[3vh] bg-[#E5E5E5] flex items-center rounded-r-[3vh] cursor-pointer"
        >
          <div
            className="h-[70%] aspect-square bg-center bg-contain bg-no-repeat"
            style={{
              backgroundImage: `url('https://d2uq10394z5icp.cloudfront.net/global/FTC-DefaultLogo-NoName.svg')`,
            }}
          />
        </Link>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden h-fit flex justify-center items-center z-50">
          <AnimatedHamburger />
        </div>

        {/* Mobile Menu List */}
        <motion.ul
          variants={ulVariants}
          animate={isOpen ? "open" : "closed"}
          className="fixed top-0 right-0 bottom-0 w-[50vw] bg-ft-primary-blue md:hidden flex flex-col pt-[12vh] shadow-2xl"
        >
          {siteConfig.navItems.map((item) => (
            <motion.li
              variants={navBarItemVariants}
              key={item.href}
              className="my-6"
            >
              <Link
                className="font-bold text-white mx-6 hover:text-ft-secondary-yellow text-xl"
                href={item.href}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            </motion.li>
          ))}

          <motion.li variants={navBarItemVariants} className="mt-10 mx-6">
            <Link
              className="block w-full text-center transition-all duration-200 hover:brightness-110 hover:scale-105 py-[2vh] bg-[#DCB968] text-white rounded-[1vh] cursor-pointer font-bold"
              href="/join-us"
              onClick={() => setIsOpen(false)}
            >
              Join Us
            </Link>
          </motion.li>
        </motion.ul>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-[4vw]">
          <ul className="flex items-center space-x-[4vw]">
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

      {/* Backdrop mờ khi mở menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-[-1] bg-black/50 md:hidden backdrop-blur-sm"
        />
      )}
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
  const [scope, animate] = useAnimate();

  useEffect(() => {
    const animateIcon = async () => {
      if (isOpen) {
        // Animation đóng (thành dấu X)
        await Promise.all([
          animate(".top-bar", { top: "50%", rotate: 45 }, { duration: 0.3 }),
          animate(
            ".bottom-bar",
            { top: "50%", rotate: -45 },
            { duration: 0.3 }
          ),
          animate(".middle-bar", { opacity: 0 }, { duration: 0.1 }),
        ]);
      } else {
        // Animation mở (trở lại 3 gạch)
        await Promise.all([
          animate(".top-bar", { top: "0%", rotate: 0 }, { duration: 0.3 }),
          animate(".bottom-bar", { top: "100%", rotate: 0 }, { duration: 0.3 }),
          animate(".middle-bar", { opacity: 1 }, { duration: 0.3 }),
        ]);
      }
    };
    animateIcon();
  }, [isOpen, animate]);

  // CHÚ Ý: Đã thay thế style object bằng Tailwind Class để tránh lỗi
  return (
    <button
      ref={scope}
      onClick={() => setIsOpen(!isOpen)}
      className="relative flex flex-col justify-between z-50"
      style={{ width: size, height: size * 0.75 }}
      aria-label={isOpen ? "Close menu" : "Open menu"}
    >
      <motion.div
        className="absolute left-0 w-full bg-white rounded-full origin-center top-bar"
        style={{ height: stroke, top: "0%" }} // Set initial top bằng style để khớp với animation logic
      />
      <motion.div
        className="absolute left-0 w-full bg-white rounded-full origin-center middle-bar"
        style={{ height: stroke, top: "50%", translateY: "-50%" }}
      />
      <motion.div
        className="absolute left-0 w-full bg-white rounded-full origin-center bottom-bar"
        style={{ height: stroke, top: "100%" }}
      />
    </button>
  );
};

export default Navbar;

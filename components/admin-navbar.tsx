"use client";

import React, {
  useState,
  useEffect,
  useRef,
  type ButtonHTMLAttributes,
} from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import toast from "react-hot-toast";
import { siteConfig } from "@/config/site";
import { UserPayload } from "@/app/(backend)/libs/auth";
import { LogOut, LayoutDashboard } from "lucide-react";

// Animation & State
import {
  type Variant,
  motion,
  useAnimate,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { atom, useAtom } from "jotai";

// HeroUI Components for Dropdown
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@heroui/react";

interface AdminNavbarProps {
  user: UserPayload;
}

const isOpenAtom = atom(false);

const AdminNavbar = ({ user }: AdminNavbarProps) => {
  const [isOpen, setIsOpen] = useAtom(isOpenAtom);
  const [hidden, setHidden] = useState(false);
  const isOpenRef = useRef(isOpen);

  // Sync ref for scroll logic
  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (isOpenRef.current) {
      setHidden(false);
      return;
    }
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  // --- Logout Logic ---
  const handleLogout = async () => {
    try {
      await axios.post("/api/v1/auth/logout");
      toast.success("Logged out successfully");
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Logout failed");
    }
  };

  // --- Animation Variants ---
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
      transition: { y: { stiffness: 1000, velocity: -100 } },
    },
    closed: { y: 50, opacity: 0, transition: { y: { stiffness: 1000 } } },
  };

  return (
    <motion.nav
      variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="sticky top-0 h-[8vh] py-[1vh] z-[9999] flex w-full transition-[colors, transform] duration-300 bg-ft-primary-blue shadow-md overflow-visible"
    >
      <div className="flex justify-between items-center pr-[2vw] w-full">
        {/* --- Logo Section --- */}
        <Link
          href="/"
          className="logo relative h-[6.4vh] px-[3vh] bg-[#E5E5E5] flex items-center rounded-r-[3vh] cursor-pointer"
        >
          <div className="relative h-[70%] aspect-square">
            <Image
              src="https://d2uq10394z5icp.cloudfront.net/global/FTC-DefaultLogo-NoName.svg"
              alt="Logo"
              fill
              className="object-contain"
            />
          </div>
        </Link>

        {/* --- Mobile Hamburger Trigger --- */}
        <div className="md:hidden h-fit flex justify-center items-center">
          <AnimatedHamburger />
        </div>

        {/* --- Mobile Menu (Side Drawer) --- */}
        <motion.ul
          variants={ulVariants}
          animate={isOpen ? "open" : "closed"}
          className="fixed -right-full bottom-0 w-[60vw] bg-ft-primary-blue md:hidden shadow-2xl border-l border-white/10"
          style={{ top: "8vh" }}
        >
          {/* Admin Links Mobile */}
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

          <motion.li variants={navBarItemVariants} className="my-6">
            <Link
              className="font-bold text-white mx-6 hover:text-ft-secondary-yellow text-xl"
              href="/join-us"
              onClick={() => setIsOpen(false)}
            >
              Join Us
            </Link>
          </motion.li>

          {/* User Info Mobile */}
          <motion.li variants={navBarItemVariants} className="px-6 mt-10 mb-4">
            <div className="p-4 bg-white/10 rounded-lg">
              <p className="text-white text-sm font-light">Signed in as</p>
              <p className="text-ft-secondary-yellow font-bold truncate">
                {user.email}
              </p>
              <p className="text-xs text-white/50 uppercase mt-1">
                {user.role}
              </p>
            </div>
          </motion.li>

          {/* Logout Button Mobile */}
          <motion.li variants={navBarItemVariants}>
            <button
              onClick={handleLogout}
              className="w-[80%] mx-6 py-[2vh] bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold transition-all"
            >
              Log Out
            </button>
          </motion.li>
        </motion.ul>

        {/* --- Desktop Menu --- */}
        <div className="hidden md:flex items-center gap-[3vw]">
          {/* Navigation Links */}
          <ul className="flex items-center space-x-[3vw]">
            {siteConfig.navItems.map((item) => (
              <li key={item.label}>
                <Link
                  className="font-bold text-white hover:text-ft-secondary-yellow text-[2vh] cursor-pointer transition-colors"
                  href={item.href}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                className="font-bold text-white hover:text-ft-secondary-yellow text-[2vh] cursor-pointer transition-colors"
                href="/join-us"
              >
                Join Us
              </Link>
            </li>
          </ul>

          {/* User Avatar Dropdown */}
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform hover:scale-105"
                classNames={{
                  img: "opacity-100",
                }}
                color="warning"
                size="sm"
                src="https://d2uq10394z5icp.cloudfront.net/global/FTC-LogoWithName.jpg"
              />
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Profile Actions"
              variant="flat"
              className="bg-white border border-gray-200 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] rounded-xl p-2 min-w-[240px] z-[9999]"
            >
              {/* --- Profile Info --- */}
              <DropdownItem
                key="profile"
                className="h-16 cursor-default gap-2"
                textValue="Signed in as"
                isReadOnly
              >
                <p className="font-semibold text-ft-primary-blue-500">
                  {user.email}
                </p>
                <p className="font-bold uppercase bg-ft-primary-yellow px-2 py-0.5 rounded text-[10px] w-fit mt-1">
                  {user.role}
                </p>
              </DropdownItem>

              <DropdownItem
                key="divider"
                className="p-0 h-px bg-gray-200 my-1 pointer-events-none"
                textValue="divider"
              />

              {/* --- Dashboard --- */}
              <DropdownItem
                key="dashboard"
                href="/admin"
                textValue="Dashboard"
                startContent={
                  <LayoutDashboard size={18} className="text-gray-500" />
                }
              >
                Admin Dashboard
              </DropdownItem>

              <DropdownItem
                key="logout"
                onPress={handleLogout}
                textValue="Log Out"
                className="mt-2"
                startContent={<LogOut size={18} />}
              >
                <span className="font-bold">Log Out</span>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </motion.nav>
  );
};

interface AnimatedHamburgerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  stroke?: number;
  size?: number;
}

const AnimatedHamburger = ({
  stroke = 2,
  size = 24,
}: AnimatedHamburgerProps) => {
  const [isOpen, setIsOpen] = useAtom(isOpenAtom);
  const [scope, animate] = useAnimate();

  const containerStyles: React.CSSProperties = {
    position: "relative",
    width: `${size}px`,
    height: `${size}px`,
    cursor: "pointer",
  };

  const barStyles: React.CSSProperties = {
    width: `${size}px`,
    position: "absolute",
    height: `${stroke}px`,
    backgroundColor: "white",
  };

  useEffect(() => {
    const topBar = scope.current.children[0];
    const bottomBar = scope.current.children[2];
    const container = scope.current;

    async function animateBars() {
      if (isOpen) {
        animate(topBar, { top: "50%", rotate: 90 }, { duration: 0.4 });
        animate(bottomBar, { top: "50%", opacity: 0 }, { duration: 0.2 }); // Hide bottom or merge
        animate(container, { rotate: 135 }, { duration: 0.4 });
      } else {
        animate(topBar, { top: "0%", rotate: 0 }, { duration: 0.4 });
        animate(bottomBar, { top: "100%", opacity: 1 }, { duration: 0.4 });
        animate(container, { rotate: 0 }, { duration: 0.4 });
      }
    }
    animateBars();
  }, [isOpen]);

  return (
    <button
      ref={scope}
      style={containerStyles}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div style={{ ...barStyles, top: "0%" }} />
      <div
        style={{ ...barStyles, top: "50%", transform: "translateY(-50%)" }}
      />
      <div style={{ ...barStyles, top: "100%" }} />
    </button>
  );
};

export default AdminNavbar;

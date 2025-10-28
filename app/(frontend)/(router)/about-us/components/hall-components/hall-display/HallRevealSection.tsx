"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

export default function HallRevealSection({ children }: { children: React.ReactNode }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  const panelControls = useAnimation();
  const dotToLineControls = useAnimation();
  
  const [revealDone, setRevealDone] = useState(false);

  useEffect(() => {
    const alreadyPlayed = sessionStorage.getItem("hallRevealPlayed");

    if (isInView && !alreadyPlayed) {
      dotToLineControls.start("grow").then(() => {
        dotToLineControls.start("disappear");
        panelControls.start("visible");
      });

      sessionStorage.setItem("hallRevealPlayed", "true");

      const timeout = setTimeout(() => setRevealDone(true), 2000);
      return () => clearTimeout(timeout);
    } else if (alreadyPlayed) {
      setRevealDone(true); // immediately hide overlay
    }
  }, [isInView]);

  // Animation variants
  const leftPanel = {
    hidden: { x: 0 },
    visible: {
      x: "-100%",
      transition: { duration: 1.2, delay: 0.3, ease: "easeInOut" },
    },
  };

  const rightPanel = {
    hidden: { x: 0 },
    visible: {
      x: "100%",
      transition: { duration: 1.2, delay: 0.3, ease: "easeInOut" },
    },
  };

  const centerLine = {
    initial: {
      width: "4px",
      height: "4px",
      borderRadius: "9999px",
      backgroundColor: "#2C305F",
      opacity: 0,
    },
    grow: {
      width: "2px",
      height: "100%",
      borderRadius: "0px",
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    disappear: {
      opacity: 0,
      transition: { duration: 0.3, delay: 0.3 },
    },
  };

  return (
    <div ref={ref} className="relative overflow-hidden bg-[#F9FAFB]">
      {/* Content always visible underneath */}
      <div className="relative z-0">{children}</div>

      {/* Animated overlay that moves away */}
      {!revealDone && (
        <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center">
          {/* Left Panel */}
          <motion.div
            variants={leftPanel}
            initial="hidden"
            animate={panelControls}
            className="absolute top-0 left-0 w-1/2 h-full bg-[#DCB968]"
          />

          {/* Dot to Line */}
          <motion.div
            variants={centerLine}
            initial="initial"
            animate={dotToLineControls}
            className="z-50 bg-[#2C305F]"
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
            }}
          />

          {/* Right Panel */}
          <motion.div
            variants={rightPanel}
            initial="hidden"
            animate={panelControls}
            className="absolute top-0 right-0 w-1/2 h-full bg-[#DCB968]"
          />
        </div>
      )}
    </div>
  );
}
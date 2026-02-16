"use client";

import React, { useEffect, useState, memo, useMemo } from "react";
import { motion, useAnimationControls } from "framer-motion";
import ReactCountdown, { CountdownRendererFn, CountdownProps } from "react-countdown";
import { Megaphone } from "lucide-react";

// --- SUB-COMPONENTS FOR FLIP EFFECT ---

const StaticCard = ({ position, unit }: { position: "upper" | "lower"; unit: number | string }) => {
  return (
    <div
      className={`relative flex justify-center w-full h-[50%] overflow-hidden bg-[#2C305F] border border-[#DCB968]/30
        ${position === "upper" 
          ? "items-end rounded-t-lg border-b border-[#DCB968]" 
          : "items-start rounded-b-lg"
        }`}
    >
      <span
        className={`text-4xl md:text-6xl font-bold text-[#DCB968] 
          ${position === "upper" ? "translate-y-[50%]" : "-translate-y-[50%]"}`}
      >
        {unit}
      </span>
    </div>
  );
};

const AnimatedCard = memo(({ current, previous }: { current: number | string; previous: number | string }) => {
  const [displayUnit, setDisplayUnit] = useState(previous);
  const controls = useAnimationControls();

  useEffect(() => {
    controls.start({
      rotateX: [0, -180],
      transition: { duration: 0.6, ease: "easeInOut" },
    });
    setDisplayUnit(previous);
  }, [previous, controls]);

  return (
    <motion.div
      animate={controls}
      className="absolute top-0 w-full h-[50%] flex justify-center items-end bg-[#2C305F] rounded-t-lg border border-[#DCB968]/30 border-b-[#DCB968] overflow-hidden"
      style={{ backfaceVisibility: "hidden", transformStyle: "preserve-3d", transformOrigin: "50% 100%" }}
      onAnimationComplete={() => {
        setDisplayUnit(current);
        controls.set({ rotateX: 0 });
      }}
    >
      <span className="text-4xl md:text-6xl font-bold text-[#DCB968] translate-y-[50%]">
        {displayUnit}
      </span>
    </motion.div>
  );
});

const BottomAnimatedCard = ({ unit }: { unit: number | string }) => {
  const [displayUnit, setDisplayUnit] = useState(unit);
  const controls = useAnimationControls();

  useEffect(() => {
    controls.start({
      rotateX: [180, 0],
      transition: { duration: 0.6, ease: "easeInOut" },
    });
    setDisplayUnit(unit);
  }, [unit, controls]);

  return (
    <motion.div
      animate={controls}
      className="absolute top-[50%] left-0 w-full h-[50%] flex justify-center items-start bg-[#2C305F] rounded-b-lg border border-[#DCB968]/30 overflow-hidden"
      style={{ backfaceVisibility: "hidden", transformStyle: "preserve-3d", transformOrigin: "50% 0%" }}
    >
      <span className="text-4xl md:text-6xl font-bold text-[#DCB968] -translate-y-[50%]">
        {displayUnit}
      </span>
    </motion.div>
  );
};

const FlipContainer = ({ number, title }: { number: number; title: string }) => {
  const { current, previous } = useMemo(() => {
    const currentDigit = number;
    const previousDigit = number + 1;
    // Basic logic for visual demo, strictly ideally needs previous props from parent
    const currentStr = currentDigit < 10 ? `0${currentDigit}` : currentDigit;
    const previousStr = previousDigit < 10 ? `0${previousDigit}` : previousDigit;
    return { current: currentStr, previous: previousStr };
  }, [number]);

  return (
    <div className="flex flex-col items-center gap-2 md:gap-4">
      <div className="relative w-16 h-20 md:w-28 md:h-32 bg-[#12161C] rounded-lg shadow-xl perspective-1000">
        <StaticCard position="upper" unit={current} />
        <StaticCard position="lower" unit={previous} />
        <AnimatedCard current={current} previous={previous} />
        <BottomAnimatedCard unit={current} />
      </div>
      <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-[#2C305F]/70">
        {title}
      </span>
    </div>
  );
};

const renderer: CountdownRendererFn = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) return null;
  return (
    <div className="flex gap-3 md:gap-6 justify-center mt-8">
      <FlipContainer number={days} title="Days" />
      <FlipContainer number={hours} title="Hours" />
      <FlipContainer number={minutes} title="Mins" />
      <FlipContainer number={seconds} title="Secs" />
    </div>
  );
};

export const EventCountdown = ({ date }: Pick<CountdownProps, "date">) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => setHasMounted(true), []);
  if (!hasMounted) return null;

  return (
    <div className="w-full py-8">
      {isCompleted ? (
        <div className="w-full max-w-3xl mx-auto p-[2px] rounded-2xl bg-gradient-to-b from-[#DCB968] to-[#F7D27F]">
          <div className="flex flex-col items-center justify-center bg-[#2C305F] rounded-2xl py-12 px-6 text-center space-y-4">
            <Megaphone size={48} className="text-[#DCB968] animate-bounce" />
            <h3 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wider">
              Registration Has Closed
            </h3>
            <p className="text-gray-300">Thank you for your interest! Stay tuned for future events.</p>
          </div>
        </div>
      ) : (
        <>
          <h2 className="text-center text-xl md:text-2xl font-bold text-[#2C305F] mb-4 uppercase tracking-widest">
            Registration Closing In
          </h2>
          <ReactCountdown date={date} renderer={renderer} onComplete={() => setIsCompleted(true)} />
        </>
      )}
    </div>
  );
};
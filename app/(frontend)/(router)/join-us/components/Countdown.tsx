"use client";
import { motion, useAnimationControls } from "framer-motion";
import { memo, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import ReactCountdown, {
  CountdownProps,
  CountdownRendererFn,
} from "react-countdown";

// --- Types ---
type UnitType = "days" | "hours" | "mins" | "secs";

const FlipCardHalf = ({
  unit,
  position,
  animateProps,
}: {
  unit: string | number;
  position: "top" | "bottom";
  animateProps?: any; // Framer motion props
}) => {
  const isTop = position === "top";

  return (
    <motion.div
      {...animateProps}
      className={`
        absolute left-0 w-full h-[50%] flex justify-center overflow-hidden bg-[#2C305F]
        ${
          isTop
            ? "top-0 items-end rounded-t-[10px] sm:rounded-t-[18px] border-b-[2px] sm:border-b-[4px]"
            : "bottom-0 items-start rounded-b-[10px] sm:rounded-b-[18px] border-t-[2px] sm:border-t-[4px]"
        }
        border-[#C0C4DC]
      `}
      style={{
        backfaceVisibility: "hidden",
        transformStyle: "preserve-3d",
        transformOrigin: isTop ? "50% 100%" : "50% 0%",
        ...animateProps?.style,
      }}
    >
      <span
        className={`
          font-mono font-normal text-white leading-none shadow-md
          text-[40px] sm:text-[80px] md:text-[100px] lg:text-[120px] xl:text-[150px]
          ${isTop ? "translate-y-[50%]" : "-translate-y-[50%]"}
        `}
        style={{ textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)" }}
      >
        {unit}
      </span>
    </motion.div>
  );
};

// --- Animated Components ---
const AnimatedTopHalf = memo(
  ({
    current,
    previous,
  }: {
    current: string | number;
    previous: string | number;
  }) => {
    const [displayUnit, setDisplayUnit] = useState(previous);
    const controls = useAnimationControls();

    useEffect(() => {
      controls
        .start({
          rotateX: [0, -180],
          transition: { duration: 0.6, ease: "easeInOut" },
        })
        .then(() => {
          setDisplayUnit(current);
          controls.set({ rotateX: 0 });
        });
    }, [previous, current, controls]);

    return (
      <FlipCardHalf
        position="top"
        unit={displayUnit}
        animateProps={{ animate: controls, initial: { rotateX: 0 } }}
      />
    );
  }
);
AnimatedTopHalf.displayName = "AnimatedTopHalf";

const AnimatedBottomHalf = memo(({ unit }: { unit: string | number }) => {
  const controls = useAnimationControls();

  useEffect(() => {
    controls.start({
      rotateX: [180, 0],
      transition: { duration: 0.6, ease: "easeInOut" },
    });
  }, [unit, controls]);

  return (
    <FlipCardHalf
      position="bottom"
      unit={unit}
      animateProps={{ animate: controls, initial: { rotateX: 180 } }}
    />
  );
});
AnimatedBottomHalf.displayName = "AnimatedBottomHalf";

// --- Flip Digit Container ---
const FlipDigit = ({ number, title }: { number: number; title: UnitType }) => {
  const { current, previous } = useMemo(() => {
    const currentStr = number < 10 ? `0${number}` : number;
    const prevNum =
      title === "days" ? number + 1 : number === 59 ? 0 : number + 1;
    const prevStr = prevNum < 10 ? `0${prevNum}` : prevNum;

    return { current: currentStr, previous: prevStr };
  }, [number, title]);

  return (
    <div className="flex flex-col items-center gap-4 sm:gap-8">
      {/* Card Container */}
      <div
        className="relative w-[70px] h-[80px] sm:w-[140px] sm:h-[160px] md:w-[160px] md:h-[180px] lg:w-[200px] lg:h-[220px] bg-[#2C305F]/20 rounded-[10px] sm:rounded-[18px] shadow-2xl"
        style={{ perspective: "1000px" }}
      >
        <FlipCardHalf position="top" unit={current} />
        <FlipCardHalf position="bottom" unit={previous} />
        <AnimatedTopHalf current={current} previous={previous} />
        <AnimatedBottomHalf unit={current} />
      </div>

      {/* Label */}
      <span className="text-black font-bold text-sm sm:text-2xl md:text-3xl uppercase tracking-widest opacity-80">
        {title}
      </span>
    </div>
  );
};

// --- Main Renderer ---
const renderer: CountdownRendererFn = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) {
  return (
    <div className="flex flex-col items-center justify-center animate-in zoom-in-95 duration-700 px-4">
      {/* Glass Card Container */}
      <div className="max-w-4xl text-center">
        
        <div className="relative w-40 h-40 md:w-56 md:h-56 mb-6 mx-auto drop-shadow-2xl">
         <Image 
           src="https://d2uq10394z5icp.cloudfront.net/global/Mascot+-+M%E1%BA%B7t+tr%C6%B0%E1%BB%9Bc.svg" 
           alt="Mascot"
           fill
           className="object-contain"
         />
      </div>

        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-wide drop-shadow-md mb-4 uppercase">
          Applications Closed
        </h1>
        
        <p className="text-lg md:text-xl text-white/90 font-medium leading-relaxed mb-8">
          The recruitment form is officially closed. Thank you for your enthusiasm! 
          <br className="hidden md:block"/>
          Missed the chance? Don't worry, we'll be back soon.
        </p>
      </div>
    </div>
  );
}

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <h1 className="text-4xl md:text-6xl font-extrabold text-center text-white mt-8 drop-shadow-md tracking-tight leading-tight">
        COUNTDOWN TO FORM CLOSED
      </h1>

      <div
        className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8"
        role="timer"
        aria-label={`Countdown: ${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`}
      >
        <FlipDigit number={days} title="days" />
        <FlipDigit number={hours} title="hours" />
        <FlipDigit number={minutes} title="mins" />
        <FlipDigit number={seconds} title="secs" />
      </div>
    </div>
  );
};

export default function Countdown({ date }: Pick<CountdownProps, "date">) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Or a static loading skeleton to prevent hydration mismatch

  return <ReactCountdown date={date} renderer={renderer} />;
}

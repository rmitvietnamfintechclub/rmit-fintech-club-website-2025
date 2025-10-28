"use client";
import { Box, Center, Flex, HStack, Text } from "@chakra-ui/react";
import { motion, useAnimationControls } from "framer-motion";
import { memo, useEffect, useMemo, useState } from "react";
import ReactCountdown, { CountdownProps, CountdownRendererFn } from "react-countdown";

/* ----------------------------- Static Half Card ----------------------------- */
const StaticCard = ({
  position,
  unit,
}: {
  position: "upper" | "lower";
  unit: number | string;
}) => {
  const translateY =
    position === "upper" ? "translateY(50%)" : "translateY(-50%)";

  return (
    <Flex
      pos="relative"
      justifyContent="center"
      w="100%"
      h="50%"
      overflow="hidden"
      alignItems={position === "upper" ? "flex-end" : "flex-start"}
      bgColor="#2C305F"
      borderTopRadius={position === "upper" ? 18.51 : undefined}
      borderBottomRadius={position === "lower" ? 18.51 : undefined}
      borderBottom={
        position === "upper" ? `4.12px solid #C0C4DC` : undefined
      }
      borderTop={
        position === "lower" ? `4.12px solid #C0C4DC` : undefined
      }
    >
      <Text
        fontWeight="normal"
        transform={translateY}
        color="#FFFFFF"
        className="text-[80px] sm:text-[80px] md:text-[100px] lg:text-[150px] xl:text-[180px] 2xl:text-[200px] shadow-md"
        style={{
          textShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        }}
      >
        {unit}
      </Text>
    </Flex>
  );
};

/* ---------------------------- Motion Flex Wrapper --------------------------- */
const MotionFlex = motion.create(Flex);

/* --------------------------- Animated Upper Card --------------------------- */
const UpperAnimatedCard = memo(
  ({
    current,
    previous,
  }: {
    current: number | string;
    previous: number | string;
  }) => {
    const [displayUnit, setDisplayUnit] = useState(previous);
    const controls = useAnimationControls();

    useEffect(() => {
      controls.start({
        rotateX: [0, -180],
        transition: { duration: 0.9, ease: "easeInOut" },
      });
      setDisplayUnit(previous);
    }, [previous]);

    return (
      <MotionFlex
        animate={controls}
        justifyContent="center"
        pos="absolute"
        w="100%"
        h="50%"
        overflow="hidden"
        alignItems="flex-end"
        sx={{
          backfaceVisibility: "hidden",
          transformStyle: "preserve-3d",
        }}
        top={0}
        transformOrigin="50% 100%"
        transform="rotateX(0deg)"
        bgColor="#2C305F"
        borderTopRadius={18.51}
        borderBottom="4.12px solid #C0C4DC"
        onAnimationComplete={() => {
          setDisplayUnit(current);
          controls.set({ rotateX: 0 });
        }}
      >
        <Text
          fontWeight="normal"
          transform="translateY(50%)"
          color="#FFFFFF"
          className="text-[80px] sm:text-[80px] md:text-[100px] lg:text-[150px] xl:text-[180px] 2xl:text-[200px]"
        >
          {displayUnit}
        </Text>
      </MotionFlex>
    );
  }
);

/* --------------------------- Animated Bottom Card -------------------------- */
const BottomAnimatedCard = ({ unit }: { unit: number | string }) => {
  const [displayUnit, setDisplayUnit] = useState(unit);
  const controls = useAnimationControls();

  useEffect(() => {
    controls.start({
      rotateX: [180, 0],
      transition: { duration: 0.9, ease: "easeInOut" },
    });
    setDisplayUnit(unit);
  }, [unit]);

  return (
    <MotionFlex
      animate={controls}
      justifyContent="center"
      pos="absolute"
      left={0}
      w="100%"
      h="50%"
      overflow="hidden"
      alignItems="flex-start"
      sx={{ backfaceVisibility: "hidden", transformStyle: "preserve-3d" }}
      top="50%"
      transformOrigin="50% 0%"
      transform="rotateX(180deg)"
      bgColor="#2C305F"
      borderBottomRadius={18.51}
      borderTop="4.12px solid #C0C4DC"
    >
      <Text
        fontWeight="normal"
        transform="translateY(-50%)"
        color="#FFFFFF"
        className="text-[80px] sm:text-[80px] md:text-[100px] lg:text-[150px] xl:text-[180px] 2xl:text-[200px]"
      >
        {displayUnit}
      </Text>
    </MotionFlex>
  );
};

/* ------------------------------ Flip Container ----------------------------- */
const FlipContainer = ({
  number,
  title,
}: {
  number: number;
  title: "days" | "hours" | "mins" | "secs";
}) => {
  const { current, previous } = useMemo(() => {
    const currentDigit = number;
    const previousDigit = number + 1;

    const current =
      currentDigit < 10
        ? `0${currentDigit}`
        : (title === "secs" || title === "mins") && currentDigit === 60
        ? "00"
        : currentDigit;

    const previous =
      previousDigit < 10
        ? `0${previousDigit}`
        : (title === "secs" || title === "mins") && previousDigit === 60
        ? "00"
        : previousDigit;

    return { current, previous };
  }, [number]);

  return (
    <Box className="cols-span-1">
      <Box
        display="block"
        pos="relative"
        bgColor="#2C305F"
        rounded="18.51px"
        className="xl:w-[250px] xl:h-[200px] lg:w-[200px] lg:h-[170px] md:w-[170px] md:h-[160px] max-md:w-[150px] max-md:h-[160px] shadow-lg"
        sx={{ perspective: "800px", perspectiveOrigin: "50% 50%" }}
        style={{
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <StaticCard position="upper" unit={current} />
        <StaticCard position="lower" unit={previous} />
        <UpperAnimatedCard current={current} previous={previous} />
        <BottomAnimatedCard unit={current} />
      </Box>

      <Center py={20}>
        <Text
          fontWeight="light"
          textTransform="uppercase"
          color="black"
          className="lg:text-3xl md:text-4xl text-2xl font-sans font-semibold"
          style={{
            textShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        >
          {title}
        </Text>
      </Center>
    </Box>
  );
};

/* ----------------------------- Countdown Renderer ----------------------------- */
const renderer: CountdownRendererFn = ({
  hours,
  minutes,
  seconds,
  completed,
  days,
}) => {
  if (completed) return null;
  return (
    <Center>
      <HStack>
        <div className="grid md:grid-cols-4 gap-5 max-md:grid-cols-2 md:mt-[30px] max-md:mt-[40px] max-md:gap-x-[40px]">
          <FlipContainer number={days} title="days" />
          <FlipContainer number={hours} title="hours" />
          <FlipContainer number={minutes} title="mins" />
          <FlipContainer number={seconds} title="secs" />
        </div>
      </HStack>
    </Center>
  );
};

/* ---------------------------- Hydration-Safe Export --------------------------- */
export default function Countdown({ date }: Pick<CountdownProps, "date">) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // SSR fallback (safe HTML, no mismatch)
    return (
      <Center>
        <HStack>
          <div className="grid md:grid-cols-4 gap-5 max-md:grid-cols-2 md:mt-[30px] max-md:mt-[40px] max-md:gap-x-[40px]">
            <FlipContainer number={0} title="days" />
            <FlipContainer number={0} title="hours" />
            <FlipContainer number={0} title="mins" />
            <FlipContainer number={0} title="secs" />
          </div>
        </HStack>
      </Center>
    );
  }

  return <ReactCountdown date={date} renderer={renderer} />;
}

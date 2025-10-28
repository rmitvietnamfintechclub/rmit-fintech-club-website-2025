import React, { Suspense } from "react";
import Department from "./components/department";
import HeroSection from "./components/hero";
import HerosectionVid from "./components/heroVideoSection";
import IntroSection from "./components/intro";
import UpcomingEvent from "./components/upcomingEvent";
import Achievements from "./components/achievements";
import Partners from "./components/partners";
import { SpeedInsights } from "@vercel/speed-insights/next";
const Home = () => {
  return (
    <>
      <div className="flex min-h-screen flex-col justify-center items-center">
        <SpeedInsights />
        <HerosectionVid />
        <HeroSection />
        <IntroSection />
        <Achievements />
        <Partners />
        <Department />
        <UpcomingEvent />
      </div>
    </>
  );
};

export default Home;

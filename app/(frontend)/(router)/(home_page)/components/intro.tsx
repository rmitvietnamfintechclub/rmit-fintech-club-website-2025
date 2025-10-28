"use client";
import Image from "next/image";
import type React from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

const IntroSection = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5, // Adjust threshold as needed
  });

  return (
    <section className="content flex flex-col bg-[#F9FAFB] md:flex-row items-center md:gap-6 w-full p-4 md:p-14">
      <div className="block md:hidden mx-auto text-[#2C305F] max-md:text-3xl md:text-[1.5rem] font-bold max-md:mx-auto">Our Key Metrics</div>
      {/* Left text */}
      <div
        ref={ref}
        className="grid grid-rows-2 md:w-1/3 justify-center gap-y-8 md:gap-y-16"
      >
        <div className="flex flex-col justify-end text-center gap-3">
          <h4 className="text-ft-primary-yellow">
            <CountUp start={0} end={inView ? 80 : 0} duration={5}>
              {({ countUpRef }) => (
                <span ref={countUpRef} className="text-6xl font-semibold" />
              )}
            </CountUp>
            +
          </h4>

          <h5 className="text-ft-primary-blue">Active Club Members</h5>
          <p>
            From diverse backgrounds, be it Finance, Business, Technology,
            Marketing, Design Studies, and more.
          </p>
        </div>
        <div className="flex flex-col justify-start text-center gap-3">
          <h4 className="text-ft-primary-yellow">
            <CountUp start={0} end={inView ? 50 : 0} duration={5}>
              {({ countUpRef }) => (
                <span ref={countUpRef} className="text-6xl font-semibold" />
              )}
            </CountUp>
            +
          </h4>
          
          <h5 className="text-ft-primary-blue">Club Projects</h5>
          <p>
            Include academic events, competitions, workshops, training, creative
            & media projects, technical development, and organizational
            projects.
          </p>
        </div>
      </div>
      {/* Image */}
      <div className="md:w-1/3 hidden md:block content-center">
        <MaskImage src="https://d2prwyp3rwi40.cloudfront.net/home/assets/KeyMetrics-EditedVersion.png" />
      </div>
      {/* Right text */}
      <div className="grid grid-rows-2 md:w-1/3 justify-center mt-8 gap-y-8 md:gap-y-16">
        <div className="flex flex-col justify-start text-center gap-3">
          <h4 className="text-ft-primary-yellow">
            <CountUp start={0} end={inView ? 7000 : 0} duration={5}>
              {({ countUpRef }) => (
                <span ref={countUpRef} className="text-6xl font-semibold" />
              )}
            </CountUp>
            +
          </h4>
          
          <h5 className="text-ft-primary-blue">Social Media Followings</h5>
          <p>
            A testament to FinTech Club’s prominence in the RMIT Community and
            beyond!
          </p>
        </div>

        <div className="flex flex-col justify-start text-center gap-3">
          <h4 className="text-ft-primary-yellow">
            <CountUp start={0} end={inView ? 40 : 0} duration={5}>
              {({ countUpRef }) => (
                <span ref={countUpRef} className="text-6xl font-semibold" />
              )}
            </CountUp>
            +
          </h4>
          <h5 className="text-ft-primary-blue">Academic & Industry Partners</h5>
          <p>
            In broad industries such as Traditional FinTech, Web3 FinTech,
            Finance, Technology, Healthcare, Venture Capital, etc.
          </p>
        </div>
      </div>
    </section>
  );
};

type MaskImageProps = {
  src: string;
  mask?: string;
  maskSize?: string;
  maskPosition?: string;
  maskRepeat?: string;
};

const MaskImage: React.FC<MaskImageProps> = ({ src }) => {
  return (
    <Image
      width={1000}
      height={1000}
      className="object-cover w-full"
      src={src}
      alt="FinTech Club Key Metrics"
      fetchPriority="high"
      priority={true}
      loading="eager"
    />
  );
};

export default IntroSection;

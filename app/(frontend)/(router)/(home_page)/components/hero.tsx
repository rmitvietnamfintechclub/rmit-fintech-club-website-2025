import { Button } from "@heroui/react";
import React from "react";
import Link from "next/link";
import Image from "next/image";

const HeroSection = () => {
  return (
    <div className="w-screen bg-[#F9FAFB] lg:py-12 flex-col justify-start items-center p-side-margin-mobile md:p-20 gap-6 md:gap-12 flex">
      <div className=" justify-start items-center gap-6 md:gap-[60px] flex flex-col md:flex-row ">
        <div className="content w-full md:w-[45vw] h-full relative">
          <div className="absolute top-[2.5rem] right-[-1.5rem] max-md:top-[2.75rem] max-md:right-[0.5rem] max-md:w-[2rem] max-md:h-[2rem] md:w-[3rem] md:h-[3rem] bg-[#2C305F] rounded-full z-10"></div>
          <div className="absolute top-[-2.25rem] right-[-0.25rem] max-md:top-[-0.35rem] max-md:right-[1.2rem] max-md:w-[2rem] max-md:h-[2rem] md:w-[3rem] md:h-[3rem] bg-[#C9D6EA] rounded-full z-20"></div>
          <div className="absolute top-[-1.5rem] right-[2.5rem] max-md:top-[0.25rem] max-md:right-[3rem] max-md:w-[2rem] max-md:h-[2rem] md:w-[3rem] md:h-[3rem]  bg-[#DBB968] rounded-full z-10"></div>
          <div className="absolute top-[-1.5rem] right-[-2.5rem] max-md:top-[0.25rem] max-md:right-[0.1rem] max-md:w-[2rem] max-md:h-[2rem] md:w-[3rem] md:h-[3rem] bg-[#2C305F] rounded-full z-10"></div>
          <div className="absolute top-[2.25rem] right-[6rem] max-md:top-[2.5rem] max-md:right-[5.5rem] max-md:w-[0.75rem] max-md:h-[0.75rem] md:w-[1rem] md:h-[1rem]  bg-[#DBB968] rounded-full z-10"></div>
          <div className="absolute top-[7.25rem] right-[-1.5rem] max-md:top-[5.5rem] max-md:right-[0.5rem] max-md:w-[0.75rem] max-md:h-[0.75rem] md:w-[1rem] md:h-[1rem] bg-[#2C305F] rounded-full z-10"></div>
          <h2 className="max-md:hidden md:block">What is</h2>
          <h2 className="md:hidden max-md:block">Welcome to</h2>
          <h1 className="text-[#000A64] !font-black uppercase mt-[0.75rem] mb-[1.25rem] max-md:hidden md:block">
            <span className="text-[#DCB968]">Fin</span>Tech Club?
          </h1>
          <h1 className="text-[#000A64] !font-black uppercase mt-[0.75rem] mb-[1.25rem] md:hidden max-md:block">
            <span className="text-[#DCB968]">Fin</span>Tech Club!
          </h1>

          <p className="leading-relaxed text-justify text-[1rem] md:text-[1.25rem]">
            We are the first ever student-led Financial Technology initiative in
            Vietnam. Founded in early 2020, RMIT FinTech Club aims to unite
            students across diverse degree programs and offer valuable insights
            into the dynamic realm of Financial Technology. Through a wide range
            of initiatives, we empower our members with the necessary skills,
            mindset, and confidence to engage in the fast-growing FinTech
            industry.
          </p>

          <div className="justify-between md:justify-start items-center gap-8 md:gap-6 flex mt-6 md:mt-8">
            <Button
              className="bg-[#DBB968] text-[#2C305F] w-full md:w-[7rem] font-semibold rounded-lg"
              variant="solid"
            >
              <Link href="/about-us">Read More</Link>
            </Button>
            <Button
              className="bg-ft-primary-blue text-ft-text-bright w-full md:w-[7rem] font-semibold rounded-lg"
              variant="solid"
            >
              <Link href="/join-us">Join Us</Link>
            </Button>
          </div>
        </div>
        <div className="w-full md:w-[40vw] rounded-xl relative flex flex-col items-center justify-center">
          <Image
            className="w-full object-cover rounded-3xl"
            src="https://d2prwyp3rwi40.cloudfront.net/home/assets/IntroPhoto-ODay.png"
            alt="Intro Photo - Orientation Day"
            fetchPriority="high"
            loading="eager"
            width={1000}
            height={1000}
            priority={true}
          />
          <div className="md:hidden flex-row justify-between items-center flex w-full h-fit mt-4">
            <Image
              src="https://d2prwyp3rwi40.cloudfront.net/global/Mascot+-+M%E1%BA%B7t+tr%C6%B0%E1%BB%9Bc.svg"
              alt="Bear Mascot"
              width={1000}
              height={200}
              fetchPriority="high"
              loading="eager"
              priority={true}
              className="relative rounded-xl object-cover w-[20vw]"
            />
            <Image
              src="https://d2prwyp3rwi40.cloudfront.net/home/assets/IntroPhoto-EOSTrip.png"
              alt="Intro Photo - EOS Trip"
              width={1000}
              height={200}
              fetchPriority="high"
              loading="eager"
              priority={true}
              className="relative rounded-xl object-cover w-[27vw]"
            />
            <Image
              src="https://d2prwyp3rwi40.cloudfront.net/home/assets/IntroPhoto-ClubDay.png"
              alt="Intro Photo - Club Day"
              width={1000}
              height={200}
              fetchPriority="high"
              loading="eager"
              priority={true}
              className="relative rounded-xl object-cover w-[35vw]"
            />
          </div>
          <div className="mt-4 flex flex-col justify-center w-full">
            <p className="text-[#2C305F] max-md:text-3xl md:text-[1.5rem] font-bold max-md:mx-auto max-md:my-2">
              Our Core Activities
            </p>
            <div className="flex flex-row mt-2 justify-between items-center max-md:gap-4">
              <div className="bg-[#F8DA92] p-3 text-center w-full md:w-[11vw] border-0">
                Projects
              </div>
              <div className="bg-[#F8DA92] p-3 text-center w-full md:w-[11vw] border-0">
                Events
              </div>
              <div className="bg-[#F8DA92] p-3 text-center w-full md:w-[11vw] border-0">
                Workshops
              </div>
            </div>

            <div className="flex flex-row mt-2 justify-center gap-4 items-center max-md:mx-8">
              <div className="bg-[#F8DA92] p-3 text-center w-full md:w-[11vw] border-0">
                Competitions
              </div>
              <div className="bg-[#F8DA92] p-3 text-center w-full md:w-[11vw] border-0">
                Training
              </div>
            </div>

            <div className="flex flex-row mt-2 justify-between items-center max-md:gap-4">
              <div className="bg-[#F8DA92] p-3 text-center w-full md:w-[11vw] border-0">
                Networking
              </div>
              <div className="bg-[#F8DA92] p-3 text-center w-full md:w-[11vw] border-0">
                Media
              </div>
              <div className="bg-[#F8DA92] p-3 text-center w-full md:w-[11vw] border-0">
                Bonding
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden flex-row justify-between items-center md:flex w-full h-fit">
        <Image
          src="https://d2prwyp3rwi40.cloudfront.net/global/Mascot+-+M%E1%BA%B7t+tr%C6%B0%E1%BB%9Bc.svg"
          alt="Bear Mascot"
          width={1000}
          height={200}
          fetchPriority="high"
          loading="eager"
          priority={true}
          className="relative rounded-xl object-cover w-[20vw]"
        />
        <Image
          src="https://d2prwyp3rwi40.cloudfront.net/home/assets/IntroPhoto-EOSTrip.png"
          alt="Intro Photo - EOS Trip"
          width={1000}
          height={200}
          fetchPriority="high"
          loading="eager"
          priority={true}
          className="relative rounded-xl object-cover w-[27vw]"
        />
        <Image
          src="https://d2prwyp3rwi40.cloudfront.net/home/assets/IntroPhoto-ClubDay.png"
          alt="Intro Photo - Club Day"
          width={1000}
          height={200}
          fetchPriority="high"
          loading="eager"
          priority={true}
          className="relative rounded-xl object-cover w-[35vw]"
        />
      </div>
    </div>
  );
};

export default HeroSection;

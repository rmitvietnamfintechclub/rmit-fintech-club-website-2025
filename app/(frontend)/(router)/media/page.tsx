import React from "react";
import { Button } from "@heroui/react";
import Link from "next/link";
import Image from "next/image";

const DecorativeStar = ({ className = "" }: { className?: string }) => (
  <div className={`z-20 ${className}`}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="70"
      height="70"
      viewBox="0 0 158 170"
      fill="none"
    >
      <path
        d="M109.947 114.433L153.358 93.6823L154.111 93.2659C155.229 92.5574 156.138 91.5529 156.745 90.3549C157.353 89.1569 157.637 87.8083 157.57 86.4469C157.502 85.0854 157.085 83.76 156.36 82.6058C155.636 81.4516 154.63 80.5101 153.446 79.8773L110.323 56.761L103.743 7.4808L103.587 6.6406C103.262 5.31202 102.602 4.0894 101.673 3.0979C100.744 2.1064 99.5806 1.38168 98.3014 0.99792C97.0222 0.614161 95.6734 0.585176 94.393 0.913908C93.1126 1.24264 91.9467 1.91729 91.0146 2.86879L57.0972 37.4625L9.72125 27.7465L8.90419 27.6253C7.5802 27.5057 6.25586 27.7501 5.06705 28.3333C3.87823 28.9166 2.86772 29.8178 2.13921 30.9444C1.41069 32.0711 0.990361 33.3826 0.921367 34.7445C0.852378 36.1063 1.13721 37.4695 1.74663 38.6942L23.8802 83.2145L1.06692 126.517L0.702629 127.315C0.217939 128.571 0.0680532 129.943 0.268231 131.291C0.468409 132.64 1.0115 133.916 1.84217 134.991C2.67284 136.066 3.7614 136.9 4.99694 137.409C6.2325 137.918 7.57089 138.084 8.87575 137.889L56.4669 130.799L89.8606 167.233C90.8273 168.288 92.057 169.05 93.4102 169.432C94.7635 169.814 96.1864 169.8 97.5178 169.393C98.8493 168.985 100.036 168.2 100.944 167.127C101.852 166.053 102.444 164.733 102.655 163.317L109.947 114.433Z"
        fill="#F7D27F"
      />
    </svg>
  </div>
);

const Media = () => {
  return (
    <div
      style={{
        background: "linear-gradient(to top, #2C305F, #5E5E92)",
      }}
      className="overflow-x-hidden" // Prevent horizontal scroll from mascots
    >
      {/* --- Decorative Circles (Desktop Only) --- */}
      <div className="hidden md:block">
        <div className="absolute bottom-[-11rem] right-[5rem] w-[4rem] h-[4rem] bg-[#F0EDFF] rounded-full z-10"></div>
        <div className="absolute bottom-[-1rem] right-[-1rem] w-[4rem] h-[4rem] bg-[#A28436] rounded-full z-10"></div>
        <div className="absolute bottom-[-8rem] right-[-1rem] w-[8rem] h-[8rem] bg-[#DCB968] rounded-full z-20"></div>
        <div className="absolute bottom-[-2rem] right-[6.5rem] w-[2.5rem] h-[2.5rem] bg-[#F0EDFF] rounded-full z-10"></div>
        <div className="absolute bottom-[-4rem] right-[12rem] w-[2.5rem] h-[2.5rem] bg-gradient-to-t from-[#999] to-[#FFF] rounded-full z-10"></div>
      </div>

      {/* === SECTION 1: ARTICLE === */}
      {/* Mobile: Column layout. Desktop: Row layout. */}
      <section className="relative flex flex-col md:flex-row justify-center gap-8 md:gap-[5rem] items-center pt-16 md:pt-[3rem] pb-12 md:pb-[6rem] px-6 md:px-12">
        
        {/* --- Text Content (Order 2 on mobile, 1 on desktop) --- */}
        <div className="flex flex-col items-center md:items-start order-2 md:order-1 z-10">
          <h1 className="text-4xl md:text-[4rem] font-bold text-[#EBEBEB] text-center md:text-left">
            Bi-weekly Article
          </h1>
          <p className="text-base text-[#EBEBEB] max-w-[90vw] md:max-w-[45vw] text-justify mt-6">
            Welcome to the Bi-weekly Article Series, where curiosity meets
            analysis at the intersection of finance and technology. Our
            articles, crafted by dedicated members of the FinTech Club, blend
            academic depth with real-world relevance, providing you with
            rigorously researched insights into emerging industry trends
            alongside pivotal global economic events. Explore our latest work
            and discover what’s truly shaping the industry today.
          </p>
          <div
            className="w-full md:w-fit rounded-md p-[2px] mt-6 md:mt-[2rem]"
            style={{
              background: "linear-gradient(to bottom, #F0EDFF, #5E5E92)",
            }}
          >
            <Button
              as={Link}
              href="/media/article"
              size="md"
              className="bg-ft-primary-yellow text-[1rem] font-semibold text-[#2C305F] rounded-md w-full justify-center"
            >
              Explore Article Library
            </Button>
          </div>
        </div>

        {/* --- Image Content (Order 1 on mobile, 2 on desktop) --- */}
        <div className="relative order-1 md:order-2">
          {/* Desktop-only elements */}
          <div className="absolute right-1/2 max-md:right-[45%] w-[100vw] h-[4px] bg-[#F0EDFF] z-0"></div>
          <div className="absolute right-1/2 max-md:right-[45%] bottom-0 w-[100vw] h-[4px] bg-[#F0EDFF] z-0"></div>
          <div className="absolute right-[75%] max-md:right-[68%] bottom-[2rem] w-[100vw] h-[4px] bg-ft-primary-yellow z-0"></div>
          <Image
            src="https://d2uq10394z5icp.cloudfront.net/global/Mascot+-+M%E1%BA%B7t+b%C3%AAn.svg"
            alt="Bear mascot"
            className="hidden md:block absolute top-[16rem] left-[-6rem] scale-x-[-1] z-30"
            width={200}
            height={200}
            loading="lazy"
          />
          <DecorativeStar className="hidden md:block absolute left-[3rem] top-[1rem] rotate-[40deg]" />

          {/* Mobile-only elements (from your image) */}
          <Image
            src="https://d2uq10394z5icp.cloudfront.net/global/Mascot+-+M%E1%BA%B7t+b%C3%AAn.svg"
            alt="Bear mascot"
            className="block md:hidden absolute bottom-8 -left-2 w-28 h-28 z-30 scale-x-[-1]"
            width={100}
            height={100}
            loading="lazy"
          />
          <DecorativeStar className="block md:hidden absolute -top-4 right-6 w-8 h-8 z-20 rotate-[40deg]" />

          {/* Shared Circle */}
          <div className="relative flex justify-center items-center w-[75vw] h-[75vw] max-w-[300px] max-h-[300px] md:w-[30rem] md:h-[30rem] md:max-w-none md:max-h-none rounded-full border-4 border-[#F7D27F] mx-auto max-md:ml-14 z-10">
            <Image
              src="https://d2uq10394z5icp.cloudfront.net/media/article/BiWeeklyArticle-CirclePoster.png"
              alt="Biweekly Article Poster"
              className="w-[80vw] h-[80vw] md:w-[33rem] md:h-[33rem] rounded-full object-cover"
              width={528} // 33rem * 16
              height={528}
              fetchPriority="high"
              loading="eager"
              priority={true}
            />
          </div>
        </div>
      </section>

      {/* === SECTION 2: PODCAST === */}
      {/* Mobile: Column layout. Desktop: Row layout (Image first). */}
      <section className="relative flex flex-col md:flex-row justify-center gap-8 md:gap-[5rem] items-center pt-0 md:pt-[6rem] pb-16 md:pb-[5rem] px-6 md:px-12">
        
        {/* --- Text Content (Order 2 on mobile AND desktop) --- */}
        <div className="flex flex-col items-center md:items-start md:self-start md:mt-8 order-2 md:order-2 z-10">
          <h1 className="text-4xl md:text-[4rem] font-bold text-[#EBEBEB] text-center md:text-left">
            FinTechTainment
          </h1>
          <p className="text-base text-[#EBEBEB] max-w-[90vw] md:max-w-[45vw] text-justify mt-6">
            FinTechTainment is play of words between <strong>"Fintech"</strong>{" "}
            and
            <strong> "Entertainment"</strong>. It is a media project
            aimed at interviewing industry professionals with topics in the
            fields of:{" "}
            <strong>
              {" "}
              Business, Finance, Technology, and Entrepreneurship
            </strong>
            . Our approach is to have casual conversations about insightful
            academic/industry topics, in a way that is relatable and
            understandable by students.
          </p>
          <div
            className="w-full md:w-fit rounded-md p-[2px] mt-6 md:mt-[1.5rem] md:ml-[4rem]"
            style={{
              background: "linear-gradient(to bottom, #F0EDFF, #5E5E92)",
            }}
          >
            <Button
              as={Link}
              href="/media/fintechtainment"
              size="md"
              radius="md"
              className="bg-ft-primary-yellow text-[1rem] font-semibold text-[#2C305F] rounded-md w-full justify-center"
            >
              Explore FinTechTainment Library
            </Button>
          </div>
        </div>
        
        {/* --- Image Content (Order 1 on mobile AND desktop) --- */}
        <div className="relative order-1 md:order-1">
          {/* Desktop-only elements */}
          <div className="absolute left-1/2 max-md:left-[45%] bottom-0 w-[100vw] h-[4px] bg-[#DCB968] z-20"></div>
          <div className="absolute left-1/2 bottom-[3.9rem] w-[100vw] h-[4px] bg-[#DCB968] z-20"></div>
          <div className="absolute left-1/2 bottom-[0.5rem] w-[100vw] h-[2px] bg-[#DCB968] z-20"></div>
          <div className="absolute left-1/2 bottom-[3.5rem] w-[100vw] h-[2px] bg-[#DCB968] z-20"></div>
          <div className="absolute left-1/2 bottom-0 w-[100vw] h-[4rem] bg-[#2C305F] z-10"></div>
          <div className="absolute bottom-[1rem] left-1/2 overflow-hidden w-[100vw] bg-[#2C305F] z-10">
            <div className="flex animate-scroll whitespace-nowrap gap-4">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={`a-${i}`}
                  className="w-[2rem] h-[2rem] border-2 border-[#DCB968] shrink-0"
                />
              ))}
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={`b-${i}`}
                  className="w-[2rem] h-[2rem] border-2 border-[#DCB968] shrink-0"
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>
          <Image
            src="https://d2uq10394z5icp.cloudfront.net/global/Mascot+-+M%E1%BA%B7t+tr%C6%B0%E1%BB%9Bc.svg"
            alt="Bear mascot"
            className="hidden md:block absolute w-[17rem] bottom-[-0.5rem] right-[-9rem] rotate-[40deg] z-0"
            width={400}
            height={400}
            loading="lazy"
          />
          <DecorativeStar className="hidden md:block absolute z-40 right-[-2rem] top-[8rem]" />

          {/* Mobile-only elements */}
          <Image
            src="https://d2uq10394z5icp.cloudfront.net/global/Mascot+-+M%E1%BA%B7t+tr%C6%B0%E1%BB%9Bc.svg"
            alt="Bear mascot"
            className="block md:hidden absolute bottom-7 -right-4 w-32 h-32 rotate-[40deg] z-0"
            width={112}
            height={112}
            loading="lazy"
          />
          <DecorativeStar className="block md:hidden absolute top-12 right-16 w-[30px] h-[30px] z-40" />

          {/* Shared Circle */}
          <div className="relative flex justify-center items-center w-[75vw] h-[75vw] max-w-[300px] max-h-[300px] md:w-[30rem] md:h-[30rem] md:max-w-none md:max-h-none rounded-full border-4 border-[#F7D27F] max-md:mr-14 z-30 bg-[#2C305F]">
            <Image
              src="https://d2uq10394z5icp.cloudfront.net/media/podcast/FintechtainmentPoster-New.png"
              alt="FinTechTainment Poster"
              className="w-[60vw] h-[60vw] md:w-[26rem] md:h-[26rem] rounded-full object-cover"
              width={416} // 26rem * 16
              height={416}
              fetchPriority="high"
              loading="eager"
              priority={true}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Media;
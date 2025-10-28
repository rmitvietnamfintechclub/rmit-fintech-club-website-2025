import React from "react";
import { Button } from "@heroui/react";
import Link from "next/link";
import Image from "next/image";

const Media = () => {
  return (
    <div
      style={{
        background: "linear-gradient(to top, #2C305F, #5E5E92)",
      }}
    >
      <div className="absolute bottom-[-11rem] right-[5rem] w-[4rem] h-[4rem] bg-[#F0EDFF] rounded-full z-10"></div>
      <div className="absolute bottom-[-1rem] right-[-1rem] w-[4rem] h-[4rem] bg-[#A28436] rounded-full z-10"></div>
      <div className="absolute bottom-[-8rem] right-[-1rem] w-[8rem] h-[8rem] bg-[#DCB968] rounded-full z-20"></div>
      <div className="absolute bottom-[-2rem] right-[6.5rem] w-[2.5rem] h-[2.5rem] bg-[#F0EDFF] rounded-full z-10"></div>
      <div className="absolute bottom-[-4rem] right-[12rem] w-[2.5rem] h-[2.5rem] bg-gradient-to-t from-[#999] to-[#FFF] rounded-full z-10"></div>

      {/* Main content container */}
      <section className="pt-[3rem] pb-[6rem] flex justify-center gap-[5rem] items-center">
        {/* Left side - Content */}
        <div>
          <h1 className=" text-[4rem] font-bold text-[#EBEBEB]">
            Bi-weekly Article
          </h1>

          <p className="text-base text-[#EBEBEB] max-w-[45vw] text-justify">
            Welcome to the Bi-weekly Article Series, where curiosity meets
            analysis at the intersection of finance and technology. Our
            articles, crafted by dedicated members of the FinTech Club, blend
            academic depth with real-world relevance, providing you with
            rigorously researched insights into emerging industry trends
            alongside pivotal global economic events. Explore our latest work
            and discover what’s truly shaping the industry today.
          </p>
          <div
            className="w-fit h-fit rounded-md p-[2px] mt-[1.5rem] "
            style={{
              background: "linear-gradient(to bottom, #F0EDFF, #5E5E92)",
            }}
          >
            <Button
              as={Link}
              href="/media/article"
              size="md"
              className="bg-ft-primary-yellow text-[1rem] font-semibold text-[#2C305F] rounded-md"
            >
              Explore Article Library
            </Button>
          </div>
        </div>

        {/* Right side - Decorative illustration */}
        <div className="relative">
          <div className="absolute right-1/2 w-[100vw] h-[4px] bg-[#F0EDFF] z-0"></div>
          <div className="absolute right-1/2 bottom-0 w-[100vw] h-[4px] bg-[#F0EDFF] z-0"></div>
          <div className="absolute right-[75%] bottom-[2rem] w-[100vw] h-[4px] bg-[#DCB968] z-0"></div>
          <Image
            src="https://d2prwyp3rwi40.cloudfront.net/global/Mascot+-+M%E1%BA%B7t+b%C3%AAn.svg"
            alt="Bear mascot"
            className="absolute top-[16rem] left-[-6rem] scale-x-[-1] z-30"
            width={200}
            height={200}
            loading="lazy"
          />
          <div className="absolute z-20 left-[3rem] top-[1rem] rotate-[40deg]">
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
          {/* Large circle */}
          <div className="relative flex justify-center items-center w-[30rem] h-[30rem] rounded-full border-4 border-[#F7D27F] mx-auto z-10">
            <Image
              src="https://d2prwyp3rwi40.cloudfront.net/media/article/BiWeeklyArticle-CirclePoster.png"
              alt="Biweekly Article Poster"
              className="w-[33rem] h-[33rem] rounded-full object-cover"
              width={200}
              height={200}
              fetchPriority="high"
              loading="eager"
              priority={true}
            />
          </div>
        </div>
      </section>

      {/* Second section */}
      <section className="pt-[6rem] pb-[5rem] flex justify-center gap-[5rem] items-start">
        {/* Right side - Content */}
        <div className="relative">
          <div className="absolute left-1/2 bottom-[0rem] w-[100vw] h-[4px] bg-[#DCB968] z-20"></div>
          <div className="absolute left-1/2 bottom-[3.9rem] w-[100vw] h-[4px] bg-[#DCB968] z-20"></div>
          <div className="absolute left-1/2 bottom-[0.5rem] w-[100vw] h-[2px] bg-[#DCB968] z-20"></div>
          <div className="absolute left-1/2 bottom-[3.5rem] w-[100vw] h-[2px] bg-[#DCB968] z-20"></div>
          <div className="absolute left-1/2 bottom-0 w-[100vw] h-[4rem] bg-[#2C305F] z-10"></div>
          <div className="absolute bottom-[1rem] left-1/2 overflow-hidden w-[100vw] bg-[#2C305F] z-10">
            <div className="flex animate-scroll whitespace-nowrap gap-4">
              {/* Block A */}
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={`a-${i}`}
                  className="w-[2rem] h-[2rem] border-2 border-[#DCB968] shrink-0"
                />
              ))}
              {/* Block B (duplicate) */}
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
            src="https://d2prwyp3rwi40.cloudfront.net/global/Mascot+-+M%E1%BA%B7t+tr%C6%B0%E1%BB%9Bc.svg"
            alt="Bear mascot"
            className="absolute w-[17rem] bottom-[-0.5rem] right-[-9rem] rotate-[40deg] z-0"
            width={400}
            height={400}
            loading="lazy"
          />
          <div className="absolute z-40 right-[-2rem] top-[8rem]">
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
          {/* Large circle */}
          <div className="relative flex justify-center items-center w-[30rem] h-[30rem] rounded-full border-4 border-[#F7D27F] mx-auto z-30 bg-[#2C305F]">
            <Image
              src="https://d2prwyp3rwi40.cloudfront.net/media/podcast/FintechtainmentPoster-New.png"
              alt="FinTechTainment Poster"
              className="w-[26rem] h-[26rem] rounded-full object-cover"
              width={400}
              height={400}
              fetchPriority="high"
              loading="eager"
              priority={true}
            />
          </div>
        </div>
        {/* Left side - Effect */}
        <div>
          <h1 className=" text-[4rem] font-bold text-[#EBEBEB]">
            FinTechTainment
          </h1>

          <p className="text-base text-[#EBEBEB] max-w-[45vw] text-justify">
            FinTechTainment is play of words between <strong>"Fintech"</strong>{" "}
            and
            <strong> "Entertainment"</strong>. It is a media/podcast project
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
            className="w-fit h-fit rounded-md p-[2px] mt-[1.5rem] ml-[4rem]"
            style={{
              background: "linear-gradient(to bottom, #F0EDFF, #5E5E92)",
            }}
          >
            <Button
              as={Link}
              href="/media/fintechtainment"
              size="md"
              radius="md"
              className="bg-ft-primary-yellow text-[1rem] font-semibold text-[#2C305F] rounded-md"
            >
              Explore FinTechTainment Library
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Media;

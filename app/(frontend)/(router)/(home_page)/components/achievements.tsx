"use client";
import Image from "next/image";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import React, { Dispatch, SetStateAction, useState } from "react";

type CardStackProps = {
  id: number;
  image: string;
};

const achievementData = [
  {
    id: 1,
    image:
      "https://d2prwyp3rwi40.cloudfront.net/home/achievement/BestClubSemA-2021.png",
  },
  {
    id: 2,
    image:
      "https://d2prwyp3rwi40.cloudfront.net/home/achievement/BestClubSemB-2021.png",
  },
  {
    id: 3,
    image:
      "https://d2prwyp3rwi40.cloudfront.net/home/achievement/BestClubSemA-2023.png",
  },
  {
    id: 4,
    image:
      "https://d2prwyp3rwi40.cloudfront.net/home/achievement/BestClubSemB-2023.png",
  },
  {
    id: 5,
    image:
      "https://d2prwyp3rwi40.cloudfront.net/home/achievement/BestClubSemC-2024.png",
  },
];

const Achievements = () => {
  const [cards, setCards] = useState<CardStackProps[]>(achievementData);

  return (
    <section className="w-full pt-4 md:pt-16 pb-8 relative overflow-hidden">
      {/* --- Decorative Elements --- */}
      <Image
        src="https://d2prwyp3rwi40.cloudfront.net/global/Mascot+-+M%E1%BA%B7t+b%C3%AAn.svg"
        alt="Bear mascot"
        className="absolute right-[-10rem] top-[17rem] rotate-[-25deg] z-30 hidden md:block"
        width={400}
        height={400}
        loading="lazy"
      />

      {/* All decorative dots hidden on mobile */}
      <div className="absolute top-0 right-[8rem] w-[4.5rem] h-[4.5rem] bg-[#5E5E92] rounded-full z-20 hidden md:block"></div>
      <div className="absolute top-[4.3rem] right-[6rem] w-[1.7rem] h-[1.7rem] bg-[#5E5E92] rounded-full z-20 hidden md:block"></div>
      
      <div className="absolute top-[27rem] left-[3rem] w-[4rem] h-[4rem] bg-[#2C305F] rounded-full z-10 hidden md:block"></div>
      <div className="absolute top-[33rem] left-[-2rem] w-[4rem] h-[4rem] bg-[#C9D6EA] rounded-full z-20 hidden md:block"></div>
      <div className="absolute top-[35rem] left-[1.25rem] w-[4rem] h-[4rem] bg-[#DBB968] rounded-full z-10 hidden md:block"></div>
      <div className="absolute top-[30rem] left-[-2.5rem] w-[4rem] h-[4rem] bg-[#2C305F] rounded-full z-10 hidden md:block"></div>
      <div className="absolute top-[34rem] left-[7rem] w-[1rem] h-[1rem] bg-[#DBB968] rounded-full z-10 hidden md:block"></div>
      <div className="absolute top-[26rem] left-[7rem] w-[0.8rem] h-[0.8rem] bg-[#2C305F] rounded-full z-10 hidden md:block"></div>
      
      <div className="absolute bottom-[4rem] right-[14rem] w-[8rem] h-[8rem] bg-[#2C305F] rounded-full z-10 hidden md:block"></div>
      <div className="absolute bottom-[27rem] right-[-2.7rem] w-[8rem] h-[8rem] bg-[#DCB968] rounded-full z-20 hidden md:block"></div>
      <div className="absolute bottom-[6.5rem] right-[-5rem] w-[20rem] h-[20rem] bg-[#F7D27F] rounded-full z-10 hidden md:block"></div>
      <div className="absolute bottom-[7rem] right-[10.5rem] w-[5rem] h-[5rem] bg-[#5E5E92] rounded-full z-10 hidden md:block"></div>
      <div className="absolute bottom-[34rem] right-[6rem] w-[2rem] h-[2rem] bg-[#97ABD6] rounded-full z-10 hidden md:block"></div>

      <div className="px-4 md:pl-[7rem] md:px-0">
        <div className="text-[2rem] md:text-[2.5rem] max-md:relative max-md:text-center font-bold text-[#2C305F] [text-shadow:_0_3px_4px_rgba(0,0,0,0.5)]">
          Our Achievement
          <Image
            src="/Achievement_Decoration.svg"
            alt="Left Achievement_Decoration"
            className="absolute left-0 -top-2 z-10 md:hidden block"
            width={70}
            height={70}
            loading="lazy"
          />
          <Image
            src="/Achievement_Decoration.svg"
            alt="Left Achievement_Decoration"
            className="absolute right-0 -top-2 z-10 rotate-180 md:hidden block"
            width={70}
            height={70}
            loading="lazy"
          />
        </div>
        <h3 className="text-4xl md:text-[3.5rem] max-md:mt-8 font-bold text-[#DCB968] leading-tight md:leading-[6rem] [text-shadow:_0_3px_4px_rgba(0,0,0,0.5)]">
          Best Club of Semester
        </h3>
        {/* Removed horizontal padding for mobile, restored for desktop */}
        <p className="text-2xl md:text-[2.5rem] max-md:mt-2 max-md:text-right font-bold text-[#5E5E92] md:pl-[44rem]">
          5 times
        </p>

        <div className="-mt-12 md:mt-[5rem] md:pb-[9rem] md:-ml-[14rem]">
          {/* Set a min-height for mobile to contain the absolute cards */}
          <div className="min-h-[400px] md:min-h-[200px] flex justify-center items-center max-md:pl-4 relative">
            {cards.map((card) => (
              <CARD_STACK
                key={card.id}
                id={card.id}
                image={card.image}
                cards={cards}
                setCards={setCards}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Innovation Award Section */}
      <div className="flex flex-col-reverse md:items-center md:flex-row md:justify-between gap-4 md:gap-8 px-6 md:px-20">
        <Image
          src="https://d2prwyp3rwi40.cloudfront.net/home/achievement/InnovationAward-2023.png"
          className="object-cover w-full md:w-[35vw] h-auto rounded-lg shadow-lg hover:scale-105 transition-transform duration-200"
          width={400} 
          height={600}
          alt="Innovation Award"
          priority={true}
        />
        <div className="flex flex-col">
          <h3 className="text-4xl md:text-[3.5rem] font-bold text-[#DCB968] leading-tight md:leading-[3rem] [text-shadow:_0_3px_4px_rgba(0,0,0,0.5)] max-md:-mt-[4rem]">
            Innovation Award
          </h3>
          <div className="text-2xl md:text-[2.5rem] max-md:text-right max-md:mt-1 font-bold text-[#5E5E92] md:leading-[5rem]">
            2023
          </div>
        </div>
      </div>

      {/* Publicity Award Section */}
      <div className="px-6 md:pl-20 mt-4 md:mt-[2rem]">
        <h3 className="pt-4 md:pt-[2rem] text-4xl md:text-[3.5rem] font-bold text-[#DCB968] leading-tight md:leading-[3rem] [text-shadow:_0_3px_4px_rgba(0,0,0,0.5)]">
          Publicity Award
        </h3>
        <p className="mt-0 max-md:mb-1 text-2xl md:text-[2.5rem] max-md:text-right font-bold text-[#5E5E92] md:leading-[5rem]">
          2024
        </p>
        {/* Centered items on mobile */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-[7rem] relative items-center md:items-start">
          <div className="absolute z-10 left-[36.5rem] top-[-7rem] rotate-[-5deg] hidden md:block">
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
          <div className="absolute z-10 left-[41rem] top-[-3rem] rotate-[-5deg] hidden md:block">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 158 170"
              fill="none"
            >
              <path
                d="M109.947 114.433L153.358 93.6823L154.111 93.2659C155.229 92.5574 156.138 91.5529 156.745 90.3549C157.353 89.1569 157.637 87.8083 157.57 86.4469C157.502 85.0854 157.085 83.76 156.36 82.6058C155.636 81.4516 154.63 80.5101 153.446 79.8773L110.323 56.761L103.743 7.4808L103.587 6.6406C103.262 5.31202 102.602 4.0894 101.673 3.0979C100.744 2.1064 99.5806 1.38168 98.3014 0.99792C97.0222 0.614161 95.6734 0.585176 94.393 0.913908C93.1126 1.24264 91.9467 1.91729 91.0146 2.86879L57.0972 37.4625L9.72125 27.7465L8.90419 27.6253C7.5802 27.5057 6.25586 27.7501 5.06705 28.3333C3.87823 28.9166 2.86772 29.8178 2.13921 30.9444C1.41069 32.0711 0.990361 33.3826 0.921367 34.7445C0.852378 36.1063 1.13721 37.4695 1.74663 38.6942L23.8802 83.2145L1.06692 126.517L0.702629 127.315C0.217939 128.571 0.0680532 129.943 0.268231 131.291C0.468409 132.64 1.0115 133.916 1.84217 134.991C2.67284 136.066 3.7614 136.9 4.99694 137.409C6.2325 137.918 7.57089 138.084 8.87575 137.889L56.4669 130.799L89.8606 167.233C90.8273 168.288 92.057 169.05 93.4102 169.432C94.7635 169.814 96.1864 169.8 97.5178 169.393C98.8493 168.985 100.036 168.2 100.944 167.127C101.852 166.053 102.444 164.733 102.655 163.317L109.947 114.433Z"
                fill="#F7D27F"
              />
            </svg>
          </div>
          <Image
            src="https://d2prwyp3rwi40.cloudfront.net/home/achievement/PublicityAward-2024.png"
            className="max-md:self-start object-cover w-full max-md:max-w-md md:w-[32rem] md:ml-[9rem] rounded-lg shadow-lg hover:scale-105 transition-transform duration-200"
            width={400}
            height={300}
            alt="Publicity Award"
            priority={true}
          />
        </div>
      </div>
    </section>
  );
};

const CARD_STACK = ({
  id,
  image,
  cards,
  setCards,
}: {
  id: number;
  image: string;
  cards: CardStackProps[];
  setCards: Dispatch<SetStateAction<CardStackProps[]>>;
}) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-150, 150], [-18, 18]);

  const index = cards.findIndex((c) => c.id === id);
  const isFront = index === cards.length - 1;
  const offset = cards.length - 1 - index;
  const cardX = isFront ? x : -offset * 15;
  const cardY = -offset * 15;

  // Reduced hover effect
  const hoverTranslateY = isFront ? "0" : "-20px"; // Was -35px

  const handleDragEnd = () => {
    const threshold = 100; // Swipe threshold in pixels
    if (Math.abs(x.get()) > threshold) {
      const direction = x.get() > 0 ? 1 : -1;
      animate(x, direction * 1000, {
        duration: 0.35,
        ease: "easeInOut",
        onComplete: () => {
          setCards((prev) => {
            const swiped = prev[prev.length - 1];
            const rest = prev.slice(0, -1);
            return [swiped, ...rest];
          });
          x.set(0);
        },
      });
    } else {
      animate(x, 0, { duration: 0.125, ease: "linear" });
    }
  };

  React.useEffect(() => {
    if (!isFront) {
      x.set(0);
    }
  }, [isFront, x]);

  return (
    <motion.img
      src={image}
      alt={`Achievement ${id}`}
      className="object-cover w-full max-w-[20rem] md:w-[32rem] md:max-w-none hover:cursor-grab active:cursor-grabbing rounded-lg"
      style={{
        position: "absolute",
        x: cardX,
        y: cardY,
        rotate: isFront ? rotate : 0,
        transition: "0.125s transform",
        boxShadow: isFront
          ? "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)"
          : "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
        zIndex: cards.length - offset,
      }}
      drag={isFront ? "x" : false}
      dragConstraints={{
        left: 0,
        right: 0,
      }}
      onDragEnd={handleDragEnd}
      whileHover={{
        scale: isFront ? 1.05 : 1,
        transition: { duration: 0.2 },
        translateY: hoverTranslateY,
        rotate: isFront ? 7 : 0,
      }}
    />
  );
};

export default Achievements;

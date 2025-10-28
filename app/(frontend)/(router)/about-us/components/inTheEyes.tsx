import Image from "next/image";
import { fontSans } from "@/config/fonts";

export default function FinTechInTheEyes() {
  return (
    <div className="bg-[#F9FAFB]">
      <div className="relative w-full">
        <Image
          src="https://d2prwyp3rwi40.cloudfront.net/global/Mascot+-+M%E1%BA%B7t+tr%C6%B0%E1%BB%9Bc.svg"
          alt="Bear mascot"
          className="absolute w-[368px] -top-[10rem] right-[-8rem] rotate-[-50deg] z-30"
          width={400}
          height={400}
          loading="lazy"
        />
      </div>
      <section className="max-w-screen flex justify-center mr-[8vw] items-center">
        <div>
          <Image
            src="https://d2prwyp3rwi40.cloudfront.net/about_us/executive_board/President-TriTruong.png"
            alt="President Avatar"
            className="w-[30vw] aspect-auto object-cover"
            width={400}
            height={400}
            fetchPriority="high"
            loading="eager"
            priority={true}
          />
        </div>
        <div className="flex flex-col w-[47vw]">
          <div className="flex flex-col items-start">
            <h1 className={`text-6xl py-2 text-[#DBB968] font-[1000]`}>
              FINTECH
            </h1>
            <h2
              className={`text-4xl text-[#2B305E]  font-extrabold ${fontSans.style}`}
            >
              IN THE EYES OF
            </h2>
          </div>
          <div className="flex flex-col items-end">
            <h2
              className={`text-5xl text-[#DBB968]  font-extrabold ${fontSans.style}`}
            >
              President
            </h2>
            <h2
              className={`text-4xl text-[#2B305E]  font-extrabold ${fontSans.style}`}
            >
              Truong Quoc Tri
            </h2>
          </div>
          <div className="flex flex-col items-center">
            <p
              className={`text-[1.15rem] leading-7 text-justify mt-4 ${fontSans.style}`}
            >
              FinTech Club truly made my university life. Before joining, I was
              the type of student who just went to class and went home, not
              realizing how much more campus life could offer. Once I became
              part of the club, I discovered how exciting and meaningful my
              university journey could be, full of learning, fun, friendships,
              and mentorships. Through working on projects and bonding with
              clubmates, I found a place where I truly belonged, and I thrived
              in ways I had never expected. From that moment on, I knew I wanted
              to give back to this community that gave me so much. That
              motivation eventually led me to pursue the role of President, so I
              could help others experience the same growth and belonging that
              FinTech gave me.
            </p>
          </div>
        </div>
      </section>
      <div className="relative w-full">
        <div className="absolute bottom-[-1.5rem] right-[-4rem] w-[6rem] h-[6rem] bg-[#2C305F] rounded-full z-10"></div>
        <div className="absolute bottom-[3rem] right-[-3rem] w-[6rem] h-[6rem] bg-[#C9D6EA] rounded-full z-20"></div>
        <div className="absolute bottom-[5rem] right-[2.65rem] w-[6rem] h-[6rem] bg-[#DBB968] rounded-full z-10"></div>
        <div className="absolute bottom-[-7rem] right-[3rem] w-[7rem] h-[7rem] bg-[#2C305F] rounded-full z-10"></div>
        <div className="absolute bottom-[3rem] right-[9rem] w-[1.75rem] h-[1.75rem] bg-[#DBB968] rounded-full z-10"></div>
        <div className="absolute bottom-[-9.5rem] right-[8.5rem] w-[1.75rem] h-[1.75rem] bg-[#2C305F] rounded-full z-10"></div>
      </div>
    </div>
  );
}

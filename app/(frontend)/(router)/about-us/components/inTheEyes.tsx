import Image from "next/image";
import { fontSans } from "@/config/fonts";

export default function FinTechInTheEyes() {
  return (
    <div className="relative max-md:py-4 md:pt-0 md:pb-12">
      
      <Image
        src="https://d2uq10394z5icp.cloudfront.net/global/Mascot+-+M%E1%BA%B7t+tr%C6%B0%E1%BB%9Bc.svg"
        alt="Bear mascot"
        className="absolute w-[190px] -top-[5rem] right-[-4.75rem] rotate-[-50deg] z-30
                   md:w-[368px] md:-top-[12rem] md:right-[-8rem]"
        width={400}
        height={400}
        loading="lazy"
      />

      <section
        className="relative z-20 flex flex-col items-center max-w-6xl px-6 mx-auto
                   md:flex-row md:justify-center md:mr-[8vw] md:items-center"
      >
        <div className="hidden md:block md:w-auto md:mb-0">
          <Image
            src="https://d2uq10394z5icp.cloudfront.net/about_us/executive_board/President-TriTruong.png"
            alt="President Avatar"
            className="w-full object-cover
                       md:w-[30vw] md:aspect-auto"
            width={400}
            height={400}
            fetchPriority="high"
            loading="eager"
            priority={true}
          />
        </div>

        {/* === CỘT 2: TEXT === */}
        <div className="flex flex-col w-full md:w-[47vw] md:ml-12">
          
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <h1
              className="text-5xl py-2 text-[#DBB968] font-[1000] 
                         md:text-6xl"
            >
              FINTECH
            </h1>
            <h2
              className={`text-3xl text-[#2B305E] font-extrabold ${fontSans.style} 
                          md:text-4xl`}
            >
              IN THE EYES OF
            </h2>
          </div>

          <div
            className="flex flex-col items-center text-center mt-4 
                       md:items-end md:text-right md:mt-0"
          >
            <h2
              className={`text-4xl text-[#DBB968] font-extrabold ${fontSans.style} 
                          md:text-5xl`}
            >
              President
            </h2>
            <h2
              className={`text-[#2B305E] font-extrabold ${fontSans.style} text-4xl max-md:leading-snug`}
            >
              Truong Quoc Tri
            </h2>
          </div>

          <div className="flex flex-col items-center w-full mt-6">
            <p
              className={`text-base leading-7 w-full text-justify ${fontSans.style} 
                          md:text-[1.15rem]`}
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

      <div className="hidden md:block absolute bg-[#2C305F] rounded-full z-10 md:w-[6rem] md:h-[6rem] md:bottom-[-2rem] md:right-[-4rem]"></div>
      <div className="hidden md:block absolute bg-[#C9D6EA] rounded-full z-20 md:w-[6rem] md:h-[6rem] md:bottom-[3rem] md:right-[-3rem]"></div>
      <div className="hidden md:block absolute bg-[#DBB968] rounded-full z-10 md:w-[6rem] md:h-[6rem] md:bottom-[5rem] md:right-[2.65rem]"></div>
      
      {/* Ẩn các bong bóng nhỏ, phức tạp trên mobile */}
      <div className="hidden md:block absolute bottom-[-7rem] right-[3rem] w-[7rem] h-[7rem] bg-[#2C305F] rounded-full z-10"></div>
      <div className="hidden md:block absolute bottom-[3rem] right-[9rem] w-[1.75rem] h-[1.75rem] bg-[#DBB968] rounded-full z-10"></div>
      <div className="hidden md:block absolute bottom-[-9.5rem] right-[8.5rem] w-[1.75rem] h-[1.75rem] bg-[#2C305F] rounded-full z-10"></div>
    </div>
  );
}
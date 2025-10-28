import type React from "react";
import Image from "next/image";
import Link from "next/link";

const FooterNoRounded: React.FC = () => {
  return (
    <footer className="bg-ft-primary-blue text-white py-14 relative border-t-4 border-ft-primary-blue-300">
      <div className="container mx-auto flex flex-col lg:flex-row lg:justify-start lg:gap-[2vw] lg:items-start justify-center items-center px-12 lg:px-4 space-y-6 lg:space-y-0 lg:space-x-4">
        {/* Social Media Icons Section */}
        <div className="flex flex-col items-center lg:self-center space-y-6 lg:space-y-4 mt-4">
          <div className="flex flex-row lg:flex-col gap-4 lg:gap-6 justify-center items-center h-full">
            <Link
              href="https://www.facebook.com/rmitfintechclub"
              legacyBehavior
            >
              <a
                target="_blank"
                className="transform hover:scale-110 transition duration-200 cursor-pointer"
              >
                <Image
                  src="/footer/facebook.svg"
                  alt="Facebook"
                  width={20}
                  height={20}
                />
              </a>
            </Link>
            <Link
              href="https://www.instagram.com/rmitfintechclub"
              legacyBehavior
            >
              <a
                target="_blank"
                className="transform hover:scale-110 transition duration-200 cursor-pointer"
              >
                <Image
                  src="/footer/instagram1.svg"
                  alt="Instagram"
                  width={28}
                  height={28}
                />
              </a>
            </Link>
            <Link
              href="https://www.tiktok.com/@rmitfintechclub.sgs"
              legacyBehavior
            >
              <a
                target="_blank"
                className="transform hover:scale-110 transition duration-200 cursor-pointer"
              >
                <Image
                  src="/footer/tiktok-outline-svgrepo-com.svg"
                  alt="TikTok"
                  width={30}
                  height={30}
                />
              </a>
            </Link>
            <Link
              href="https://www.youtube.com/@rmitvietnamfintechclub"
              legacyBehavior
            >
              <a
                target="_blank"
                className="transform hover:scale-110 transition duration-200 cursor-pointer"
              >
                <Image
                  src="/footer/youtube.svg"
                  alt="YouTube"
                  width={30}
                  height={30}
                />
              </a>
            </Link>
            <Link
              href="https://www.linkedin.com/company/rmit-vietnam-fintech-club"
              legacyBehavior
            >
              <a
                target="_blank"
                className="transform hover:scale-110 transition duration-200 cursor-pointer"
              >
                <Image
                  src="/footer/linkedin-outline-svgrepo-com.svg"
                  alt="LinkedIn"
                  width={28}
                  height={28}
                />
              </a>
            </Link>

            <Link href="https://github.com/RMIT-FinTech-Club" legacyBehavior>
              <a
                target="_blank"
                className="transform hover:scale-110 transition duration-200 cursor-pointer"
              >
                <Image
                  src="/footer/github.svg"
                  alt="GitHub"
                  width={28}
                  height={28}
                />
              </a>
            </Link>
          </div>
        </div>

        <div className="flex justify-center lg:justify-start lg:self-center order-first lg:order-none items-stretch">
          <Image
            src="https://d2prwyp3rwi40.cloudfront.net/global/FTC-WhiteLogo-WithName.png"
            alt="FinTech Club Logo"
            width={360}
            height={360}
            className="w-auto"
            style={{
              width: "280px",
              maxWidth: "330px",
              maxHeight: "100%",
            }}
          />
        </div>

        <div className="flex flex-col items-center lg:items-start text-center lg:pr-[2vw] lg:text-left mx-auto lg:mx-0 lg:w-[40%] max-w-max">
          <h5 className="text-ft-primary-yellow font-bold text-lg lg:mb-[2vh]">
            ABOUT US
          </h5>
          <p className="text-base w-full text-justify">
            We are the first ever student-led Financial Technology initiative in
            Vietnam. Founded in early 2020, RMIT FinTech Club aims to unite
            students across diverse degree programs and offer valuable insights
            into the dynamic realm of Financial Technology. Through a wide range
            of initiatives, we empower our members with the necessary skills,
            mindset, and confidence to engage in the fast-growing FinTech
            industry.
          </p>

          <h5 className="text-ft-primary-yellow font-bold text-lg my-4">
            CONTACT US
          </h5>
          <div className="flex flex-col items-center lg:items-start space-y-2 text-base">
            <div className="flex items-center space-x-2 ">
              <Image
                src="/footer/location.svg"
                alt="Location"
                width={28}
                height={28}
              />
              <a
                href="https://maps.app.goo.gl/25WU2ZdmokQvidG66"
                target="_blank"
                className="text-white hover:underline leading-tight"
              >
                702 Nguyen Van Linh Boulevard, Tan Hung Ward, Ho Chi Minh City
              </a>
            </div>

            <div className="flex items-center space-x-2 space-y-2">
              <Image
                src="/footer/email.svg"
                alt="Email"
                width={28}
                height={28}
              />
              <a
                href="mailto:fintechclub@rmit.edu.com"
                className="text-white hover:underline leading-tight"
              >
                fintechclub.sgs@rmit.edu.vn
              </a>
            </div>
          </div>
        </div>

        {/* Important Links Section */}
        <div className="flex flex-col text-center lg:text-left space-y-4 max-w-max z-10">
          <h5 className="text-ft-primary-yellow font-bold text-lg">
            IMPORTANT LINKS
          </h5>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="hover:text-[#DBB968]">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about-us" className="hover:text-[#DBB968]">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/media" className="hover:text-[#DBB968]">
                Media
              </Link>
            </li>
            <li>
              <Link href="/projects" className="hover:text-[#DBB968]">
                Projects
              </Link>
            </li>
            <li>
              <Link href="/events" className="hover:text-[#DBB968]">
                Events
              </Link>
            </li>
            <li>
              <Link href="/join-us" className="hover:text-[#DBB968]">
                Join Us
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="container mx-auto text-center mt-[10vh] border-t border-gray-500 pt-4">
        <p className="text-sm">Copyright ©2025 All Rights Reserved.</p>
      </div>

      <Image
        src="/footer/Bear1.png"
        alt="Bear Mascot"
        width={200}
        height={200}
        className="absolute bottom-0 right-[-3rem] w-[30vw] h-auto"
      />
    </footer>
  );
};

export default FooterNoRounded;
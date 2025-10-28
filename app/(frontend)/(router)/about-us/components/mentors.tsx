import Image from "next/image";

export const ClubMentors = () => {
  return (
    <div className="bg-[#F9FAFB]">
      <div className="relative z-10">
        <div className="text-center pt-[4rem] font-sans font-bold text-6xl text-[#2C305F]">
          OUR CLUB <span className="text-[#DBB968]"> MENTORS</span>
        </div>
      </div>

      <div className="flex justify-around items-center pt-[2rem]">
        <div className="bg-[#F9FAFB] flex flex-col place-items-center">
          <div className="font-bold text-2xl text-[#2C305F]">
            <span>Assoc. Prof. BINH NGUYEN</span>
          </div>
          <div className="w-[25vw] h-auto object-cover overflow-hidden rounded-[50px] border-[#2C305F] border-5">
            <Image
              src="https://d2prwyp3rwi40.cloudfront.net/about_us/mentors/Mentor-BinhNguyen.png"
              alt="Mentor Binh Nguyen"
              className="w-full h-auto object-cover"
              width={400}
              height={400}
              fetchPriority="high"
              loading="eager"
              priority={true}
            />
          </div>
          <div className="relative">
            <div className="absolute rounded-lg pl-[10px] pr-[250px] ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="90"
                height="82"
                viewBox="0 0 90 82"
                fill="none"
              >
                <ellipse
                  cx="13.2273"
                  cy="12.9967"
                  rx="13.2273"
                  ry="12.9967"
                  transform="matrix(-1 0 0 1 55.9089 56.0066)"
                  fill="#2B305E"
                />
                <ellipse
                  cx="13.2273"
                  cy="12.9967"
                  rx="13.2273"
                  ry="12.9967"
                  transform="matrix(-1 0 0 1 75.8172 25.9932)"
                  fill="#2B305E"
                />
                <path
                  d="M86.5903 27.4932C85.511 27.4933 84.6812 28.3461 84.6811 29.3428C84.6811 30.3396 85.511 31.1924 86.5903 31.1924C87.6696 31.1924 88.4995 30.3396 88.4995 29.3428C88.4995 28.3461 87.6696 27.4932 86.5903 27.4932Z"
                  fill="#2B305E"
                  stroke="white"
                  strokeWidth="3"
                />
                <path
                  d="M13.227 26.4932C6.18969 26.4934 0.500412 32.0969 0.500412 38.9903C0.500616 45.8835 6.18981 51.4863 13.227 51.4864C20.2643 51.4864 25.9543 45.8836 25.9545 38.9903C25.9545 32.0968 20.2644 26.4932 13.227 26.4932Z"
                  fill="#DBB968"
                  stroke="#5E5E92"
                />
                <path
                  d="M10.3633 62.3043C10.3633 69.4822 16.2853 75.301 23.5906 75.301C30.8958 75.301 36.8178 69.4822 36.8178 62.3043C36.8178 55.1264 30.8958 49.3076 23.5906 49.3076C16.2853 49.3076 10.3633 55.1264 10.3633 62.3043Z"
                  fill="#C9D6EA"
                />
                <ellipse
                  cx="3.40909"
                  cy="3.34967"
                  rx="3.40909"
                  ry="3.34967"
                  transform="matrix(-1 0 0 1 19.9089 0)"
                  fill="#DBB968"
                />
              </svg>
            </div>

            <div className="rounded-[50px] w-[400px] h-[86px] bg-[#DBB968] mt-6 ">
              <div className="relative">
                <div className=" absolute rounded-lg pl-[300px] pr-2 pt-1">
                  <div className="transition duration-300 transform hover:scale-110 hover:brightness-150 hover:drop-shadow-[0_0_6px_#FFEFCA]">
                    <a
                      href="http://linkedin.com/in/dr-binh-nguyen-thanh"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="77"
                        height="77"
                        viewBox="0 0 77 77"
                        fill="none"
                      >
                        <path
                          d="M12.8333 19.25C12.8333 17.5482 13.5094 15.9161 14.7127 14.7127C15.9161 13.5094 17.5482 12.8333 19.25 12.8333H57.75C59.4518 12.8333 61.0839 13.5094 62.2872 14.7127C63.4906 15.9161 64.1666 17.5482 64.1666 19.25V57.75C64.1666 59.4518 63.4906 61.0839 62.2872 62.2872C61.0839 63.4906 59.4518 64.1666 57.75 64.1666H19.25C17.5482 64.1666 15.9161 63.4906 14.7127 62.2872C13.5094 61.0839 12.8333 59.4518 12.8333 57.75V19.25Z"
                          stroke="#2C305F"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M25.6667 35.2917V51.3334"
                          stroke="#2C305F"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M25.6667 25.6667V25.6992"
                          stroke="#2C305F"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M38.5 51.3334V35.2917"
                          stroke="#2C305F"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M51.3333 51.3334V41.7084C51.3333 40.0065 50.6573 38.3744 49.4539 37.1711C48.2506 35.9677 46.6185 35.2917 44.9167 35.2917C43.2149 35.2917 41.5828 35.9677 40.3794 37.1711C39.176 38.3744 38.5 40.0065 38.5 41.7084"
                          stroke="#2C305F"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
                <div className="  rounded-lg pl-[100px] pr-[110px] pt-4 text-sm  text-center">
                  SENIOR PROGRAM MANAGER OF BLOCKCHAIN ENABLED BUSINESS
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#F9FAFB] flex flex-col place-items-center">
          <div className="font-bold text-2xl text-[#2C305F]">
            <span>Dr. HUY PHAM</span>
          </div>
          <div className="w-[25vw] h-auto object-cover overflow-hidden rounded-[50px] border-[#2C305F] border-5">
            <Image
              src="https://d2prwyp3rwi40.cloudfront.net/about_us/mentors/Mentor-HuyPham.png"
              alt="Mentor Huy Pham"
              className="w-full h-auto object-cover"
              width={400}
              height={400}
              fetchPriority="high"
              loading="eager"
              priority={true}
            />
          </div>
          <div className="relative">
            <div className="absolute rounded-lg pl-[10px] pr-[250px] ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="90"
                height="82"
                viewBox="0 0 90 82"
                fill="none"
              >
                <ellipse
                  cx="13.2273"
                  cy="12.9967"
                  rx="13.2273"
                  ry="12.9967"
                  transform="matrix(-1 0 0 1 55.9089 56.0066)"
                  fill="#2B305E"
                />
                <ellipse
                  cx="13.2273"
                  cy="12.9967"
                  rx="13.2273"
                  ry="12.9967"
                  transform="matrix(-1 0 0 1 75.8172 25.9932)"
                  fill="#2B305E"
                />
                <path
                  d="M86.5903 27.4932C85.511 27.4933 84.6812 28.3461 84.6811 29.3428C84.6811 30.3396 85.511 31.1924 86.5903 31.1924C87.6696 31.1924 88.4995 30.3396 88.4995 29.3428C88.4995 28.3461 87.6696 27.4932 86.5903 27.4932Z"
                  fill="#2B305E"
                  stroke="white"
                  strokeWidth="3"
                />
                <path
                  d="M13.227 26.4932C6.18969 26.4934 0.500412 32.0969 0.500412 38.9903C0.500616 45.8835 6.18981 51.4863 13.227 51.4864C20.2643 51.4864 25.9543 45.8836 25.9545 38.9903C25.9545 32.0968 20.2644 26.4932 13.227 26.4932Z"
                  fill="#DBB968"
                  stroke="#5E5E92"
                />
                <path
                  d="M10.3633 62.3043C10.3633 69.4822 16.2853 75.301 23.5906 75.301C30.8958 75.301 36.8178 69.4822 36.8178 62.3043C36.8178 55.1264 30.8958 49.3076 23.5906 49.3076C16.2853 49.3076 10.3633 55.1264 10.3633 62.3043Z"
                  fill="#C9D6EA"
                />
                <ellipse
                  cx="3.40909"
                  cy="3.34967"
                  rx="3.40909"
                  ry="3.34967"
                  transform="matrix(-1 0 0 1 19.9089 0)"
                  fill="#DBB968"
                />
              </svg>
            </div>

            <div className="rounded-[50px] w-[400px] h-[86px] bg-[#DBB968] mt-6 ">
              <div className="relative">
                <div className=" absolute rounded-lg pl-[315px] pt-1">
                  <div className="transition duration-300 transform hover:scale-110 hover:brightness-150 hover:drop-shadow-[0_0_6px_#FFEFCA]">
                    <a
                      href="mailto:huy.phamnguyenanh@rmit.edu.vn"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="p-[0.3rem] mt-3 border-[2px] border-ft-primary-blue-50 rounded-md">
                        <Image
                          src="/outlook.svg"
                          alt="Outlook"
                          width={40}
                          height={40}
                          loading="lazy"
                        />
                      </div>
                    </a>
                  </div>
                </div>
                <div className="  rounded-lg pl-[100px] pr-[110px] pt-6 text-sm  text-center">
                  SENIOR LECTURER OF FINANCE
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#F9FAFB] flex flex-col place-items-center">
          <div className="font-bold text-2xl text-[#2C305F]">
            <span>Dr. HIEU THAI</span>
          </div>
          <div className="w-[25vw] h-auto object-cover overflow-hidden rounded-[50px] border-[#2C305F] border-5">
            <Image
              src="https://d2prwyp3rwi40.cloudfront.net/about_us/mentors/Mentor-HieuThai.png"
              alt="Mentor Hieu Thai"
              className="w-full h-auto object-cover"
              width={400}
              height={400}
              fetchPriority="high"
              loading="eager"
              priority={true}
            />
          </div>
          <div className="relative">
            <div className="absolute rounded-lg pl-[10px] pr-[250px] ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="90"
                height="82"
                viewBox="0 0 90 82"
                fill="none"
              >
                <ellipse
                  cx="13.2273"
                  cy="12.9967"
                  rx="13.2273"
                  ry="12.9967"
                  transform="matrix(-1 0 0 1 55.9089 56.0066)"
                  fill="#2B305E"
                />
                <ellipse
                  cx="13.2273"
                  cy="12.9967"
                  rx="13.2273"
                  ry="12.9967"
                  transform="matrix(-1 0 0 1 75.8172 25.9932)"
                  fill="#2B305E"
                />
                <path
                  d="M86.5903 27.4932C85.511 27.4933 84.6812 28.3461 84.6811 29.3428C84.6811 30.3396 85.511 31.1924 86.5903 31.1924C87.6696 31.1924 88.4995 30.3396 88.4995 29.3428C88.4995 28.3461 87.6696 27.4932 86.5903 27.4932Z"
                  fill="#2B305E"
                  stroke="white"
                  strokeWidth="3"
                />
                <path
                  d="M13.227 26.4932C6.18969 26.4934 0.500412 32.0969 0.500412 38.9903C0.500616 45.8835 6.18981 51.4863 13.227 51.4864C20.2643 51.4864 25.9543 45.8836 25.9545 38.9903C25.9545 32.0968 20.2644 26.4932 13.227 26.4932Z"
                  fill="#DBB968"
                  stroke="#5E5E92"
                />
                <path
                  d="M10.3633 62.3043C10.3633 69.4822 16.2853 75.301 23.5906 75.301C30.8958 75.301 36.8178 69.4822 36.8178 62.3043C36.8178 55.1264 30.8958 49.3076 23.5906 49.3076C16.2853 49.3076 10.3633 55.1264 10.3633 62.3043Z"
                  fill="#C9D6EA"
                />
                <ellipse
                  cx="3.40909"
                  cy="3.34967"
                  rx="3.40909"
                  ry="3.34967"
                  transform="matrix(-1 0 0 1 19.9089 0)"
                  fill="#DBB968"
                />
              </svg>
            </div>

            <div className=" rounded-[50px] w-[400px] h-[86px] bg-[#DBB968] mt-6 ">
              <div className="relative">
                <div className=" absolute rounded-lg pl-[300px] pr-2 pt-1">
                  <div className="transition duration-300 transform hover:scale-110 hover:brightness-150 hover:drop-shadow-[0_0_6px_#FFEFCA]">
                    <a
                      href="https://www.linkedin.com/in/hieu-thai-0a29b6ab/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="77"
                        height="77"
                        viewBox="0 0 77 77"
                        fill="none"
                      >
                        <path
                          d="M12.8333 19.25C12.8333 17.5482 13.5094 15.9161 14.7127 14.7127C15.9161 13.5094 17.5482 12.8333 19.25 12.8333H57.75C59.4518 12.8333 61.0839 13.5094 62.2872 14.7127C63.4906 15.9161 64.1666 17.5482 64.1666 19.25V57.75C64.1666 59.4518 63.4906 61.0839 62.2872 62.2872C61.0839 63.4906 59.4518 64.1666 57.75 64.1666H19.25C17.5482 64.1666 15.9161 63.4906 14.7127 62.2872C13.5094 61.0839 12.8333 59.4518 12.8333 57.75V19.25Z"
                          stroke="#2C305F"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M25.6667 35.2917V51.3334"
                          stroke="#2C305F"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M25.6667 25.6667V25.6992"
                          stroke="#2C305F"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M38.5 51.3334V35.2917"
                          stroke="#2C305F"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M51.3333 51.3334V41.7084C51.3333 40.0065 50.6573 38.3744 49.4539 37.1711C48.2506 35.9677 46.6185 35.2917 44.9167 35.2917C43.2149 35.2917 41.5828 35.9677 40.3794 37.1711C39.176 38.3744 38.5 40.0065 38.5 41.7084"
                          stroke="#2C305F"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
                <div className="rounded-lg pl-[100px] pr-[110px] pt-6 text-sm text-center">
                  LECTURER OF BLOCKCHAIN ENABLED BUSINESS
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

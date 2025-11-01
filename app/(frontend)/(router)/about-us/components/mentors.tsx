import Image from "next/image";

// --- Data Array ---
const mentorData = [
  {
    name: "Assoc. Prof. BINH NGUYEN",
    title: "SENIOR PROGRAM MANAGER OF BLOCKCHAIN ENABLED BUSINESS",
    imageUrl:
      "https://d2uq10394z5icp.cloudfront.net/about_us/mentors/Mentor-BinhNguyen.png",
    social: {
      type: "linkedin",
      href: "http://linkedin.com/in/dr-binh-nguyen-thanh",
    },
    isPriority: true, // Mark only the first one as priority for LCP
  },
  {
    name: "Dr. HUY PHAM",
    title: "SENIOR LECTURER OF FINANCE",
    imageUrl:
      "https://d2uq10394z5icp.cloudfront.net/about_us/mentors/Mentor-HuyPham.png",
    social: {
      type: "email",
      href: "mailto:huy.phamnguyenanh@rmit.edu.vn",
    },
    isPriority: false,
  },
  {
    name: "Dr. HIEU THAI",
    title: "LECTURER OF BLOCKCHAIN ENABLED BUSINESS",
    imageUrl:
      "https://d2uq10394z5icp.cloudfront.net/about_us/mentors/Mentor-HieuThai.png",
    social: {
      type: "linkedin",
      href: "https://www.linkedin.com/in/hieu-thai-0a29b6ab/",
    },
    isPriority: false,
  },
];

// --- Icon Components ---
// Reusable icon components for cleanliness

const LinkedInIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="65"
    height="65"
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
);

const OutlookIcon = () => (
  <div className="p-[0.3rem] border-[2px] border-[#2C305F] rounded-md">
    <Image
      src="/outlook.svg"
      alt="Outlook"
      width={35}
      height={35}
      loading="lazy"
    />
  </div>
);

// --- Mentor Card Component ---
type MentorCardProps = (typeof mentorData)[0];

const MentorCard = ({
  name,
  title,
  imageUrl,
  social,
  isPriority,
}: MentorCardProps) => {
  return (
    <div className="flex flex-col items-center w-full md:max-w-xs max-md:px-6">
      <div className="font-bold text-2xl text-[#2C305F] text-center mb-4">
        <span>{name}</span>
      </div>
      <div className="w-full h-auto object-cover overflow-hidden rounded-[50px] border-[#2C305F] border-5">
        <Image
          src={imageUrl}
          alt={`Mentor ${name}`}
          className="w-full h-auto object-cover"
          width={400}
          height={400}
          priority={isPriority}
          loading={isPriority ? "eager" : "lazy"}
          fetchPriority={isPriority ? "high" : undefined}
        />
      </div>
      <div className="relative w-full mt-6">
        {/* This container uses flexbox for robust, responsive layout */}
        <div className="relative z-0 rounded-[50px] w-full min-h-[100px] bg-[#DBB968] flex justify-between items-center px-6 py-4">
          <div className="flex-1 text-center text-sm font-medium text-[#2C305F] mr-4">
            {title}
          </div>
          <div className="flex-shrink-0">
            <a
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="transition duration-300 transform hover:scale-110 hover:brightness-150 hover:drop-shadow-[0_0_6px_#FFEFCA]"
            >
              {social.type === "linkedin" && <LinkedInIcon />}
              {social.type === "email" && <OutlookIcon />}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---

export const ClubMentors = () => {
  return (
    <div className="md:px-20">
      <div className="container mx-auto">
        <div className="text-center pt-8 font-sans font-bold text-4xl md:text-6xl text-[#2C305F]">
          OUR CLUB <span className="text-[#DBB968]"> MENTORS</span>
        </div>

        {/* Responsive flex container */}
        <div className="flex flex-col md:flex-row justify-center md:justify-between items-center md:items-start flex-wrap gap-12 pt-8 md:pt-20">
          {mentorData.map((mentor) => (
            <MentorCard key={mentor.name} {...mentor} />
          ))}
        </div>
      </div>
    </div>
  );
};
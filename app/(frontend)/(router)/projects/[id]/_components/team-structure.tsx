import { Accordion, AccordionItem, Link } from "@heroui/react";
import SectionTitle from "./SectionTitle";
import Image from "next/image";
import { Leader, Team } from "./types";
import { CheckCircle, ChevronLeft } from "lucide-react";
// --- Prop Types (Không đổi) ---
type TeamStructureProps = {
  leaders: Leader[];
  teams: Team[];
};

// --- LinkedinIcon (Không đổi) ---
const LinkedinIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.25 6.5 1.75 1.75 0 016.5 8.25zM19 19h-3v-4.75c0-1.4-.5-2-1.5-2s-1.5.6-1.5 2V19h-3v-9h3V11c.5-.75 1.5-1.5 2.5-1.5s2.5 1 2.5 3.5V19z" />
  </svg>
);

const ProjectLeaderSpotlight = ({ leader }: { leader: Leader }) => (
  <div className="flex flex-col items-center text-center transition-transform duration-300 ease-in-out hover:scale-105 group">
    <div className="relative mb-4">
      <Image
        src={leader.avatarUrl}
        alt={`${leader.name}'s Avatar`}
        width={192}
        height={192}
        loading="lazy"
        className="w-48 h-48 rounded-full object-contain shadow-lg
                   ring-4 ring-[#DBB968]"
      />
    </div>
    <h3 className="text-2xl font-bold text-[#2C305F] mb-1">{leader.name}</h3>
    <p className="text-gray-600 font-medium mb-4">{leader.role}</p>
    {leader.linkedinUrl && (
      <Link
        href={leader.linkedinUrl}
        isExternal
        className="inline-flex items-center justify-center gap-2 bg-[#DBB968] text-[#2C305F] font-semibold px-4 py-2 
                   rounded-lg transition-colors duration-300 hover:bg-[#DBB968]/80"
      >
        <LinkedinIcon />
        LinkedIn
      </Link>
    )}
  </div>
);

// Dùng cho cả Accordion và TeamBar
const TeamLeaderTag = ({ name }: { name: string }) => (
  <span className="flex items-center gap-2 bg-[#DBB968] text-[#2C305F] font-bold px-3 py-1.5 rounded-full text-sm shadow-sm">
    <img width="20" height="20" src="/leader.png" alt="" />
    {name}
  </span>
);

const TeamBar = ({ team }: { team: Team }) => (
  <div className="group rounded-xl !border-none mb-4 shadow-md bg-[#2C305F] p-4">
    <div className="flex flex-wrap justify-between items-center gap-y-3 gap-x-4">
      <h3 className="text-white font-bold text-lg md:text-xl">{team.role}</h3>
      <div className="flex flex-wrap gap-2 justify-end">
        {team.leader_name?.map((leader) => (
          <TeamLeaderTag key={leader} name={leader} />
        ))}
      </div>
    </div>
  </div>
);

const TagList = ({ title, items }: { title: string; items: string[] }) => {
  if (!items || items.length === 0) return null;
  return (
    <div className="mb-4">
      <h4 className="font-bold text-lg text-gray-900 mb-3">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <span
            key={index}
            className="flex items-center gap-1.5 bg-blue-100 text-blue-800 font-medium px-3 py-1.5 rounded-full text-sm"
          >
            <CheckCircle className="w-4 h-4" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

// --- [MAIN] TeamStructure Component ---
export default function TeamStructure({
  leaders = [],
  teams = [],
}: TeamStructureProps) {
  const hasProjectLeaders = leaders && leaders.length > 0;
  const hasTeams = teams && teams.length > 0;

  if (!hasProjectLeaders && !hasTeams) {
    return null;
  }

  // --- Splitting logic (LOGIC QUAN TRỌNG NHẤT) ---
  const teamsWithContent: Team[] = [];
  const teamsWithoutContent: Team[] = [];

  teams.forEach((team) => {
    // Kiểm tra xem team có "responsibilities" hoặc "skills" không
    const hasResponsibilities =
      team.responsibilities && team.responsibilities.length > 0;
    const hasSkills = team.skills && team.skills.length > 0;

    if (hasResponsibilities || hasSkills) {
      teamsWithContent.push(team); // Team có nội dung
    } else {
      teamsWithoutContent.push(team); // Team KHÔNG có nội dung
    }
  });

  return (
    <section className="py-8 md:py-12">
      <div className="mx-auto px-4 md:px-12 lg:px-20">
        <SectionTitle>Team Structure</SectionTitle>

        {hasProjectLeaders && (
          <div className="flex flex-wrap justify-center items-start gap-x-8 gap-y-12 px-4 mt-12">
            {leaders.map((leader) => (
              <div key={leader.name} className="w-full max-w-xs flex-shrink-0">
                <ProjectLeaderSpotlight leader={leader} />
              </div>
            ))}
          </div>
        )}

        {hasProjectLeaders && hasTeams && (
          <div className="w-full max-w-2xl mx-auto my-16 border-b-2 border-[#DBB968]/30"></div>
        )}

        {hasTeams && (
          <div className="w-full mx-auto mt-12">
            <Accordion
              defaultExpandedKeys={[teamsWithContent[0]?.role]}
              itemClasses={{
                base: "group rounded-xl !border-none mb-4 shadow-md",
                title: "text-white font-bold text-lg md:text-xl",
                trigger:
                  "p-5 bg-[#2C305F] rounded-xl hover:bg-[#3e358a] transition-colors",
                content: "bg-white rounded-b-xl p-6",
              }}
            >
              {teamsWithContent.map((team) => (
                <AccordionItem
                  key={team.role}
                  aria-label={team.role}
                  title={team.role}
                  subtitle={
                    <div className="flex flex-wrap gap-2 justify-end">
                      {team.leader_name?.map((leader) => (
                        <TeamLeaderTag key={leader} name={leader} />
                      ))}
                    </div>
                  }
                  indicator={({ isOpen }) => (
                    <ChevronLeft
                      className={`text-2xl font-bold text-white transition-transform duration-300 ease-in-out ${
                        isOpen ? "-rotate-90" : "rotate-0"
                      }`}
                    />
                  )}
                >
                  {/* Responsibilities & Skills */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <TagList
                      title="Responsibilities"
                      items={team.responsibilities || []}
                    />
                    <TagList title="Skills" items={team.skills || []} />
                  </div>
                </AccordionItem>
              ))}
            </Accordion>

            {teamsWithoutContent.map((team) => (
              <TeamBar key={team.role} team={team} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

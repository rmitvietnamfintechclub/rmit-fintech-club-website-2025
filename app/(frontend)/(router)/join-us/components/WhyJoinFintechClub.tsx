import Image from "next/image";
import { motion } from "framer-motion";

const WhyJoinFintechClub = () => {
  return (
    <section className="px-4 py-12 sm:px-8 lg:px-16">
      <div className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-5 items-start">
        <motion.div
          className="relative h-full col-span-3 flex flex-col items-center justify-center text-center md:text-center lg:col-span-2"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          {/* Decoration above the Title */}
          <div className="absolute -top-4 -left-4 md:-top-4 hidden sm:block"></div>
          {/* Text Container */}
          <div className="max-w-2xl space-y-6">
            <h2
              className="text-3xl text-center font-bold text-gray-900 sm:text-4xl md:text-6xl mb-4"
              style={{ lineHeight: 1.1 }}
            >
              Why Join <span className="text-bluePrimary">RMIT Vietnam</span>{" "}
              <span className="text-yellowPrimary">FinTech Club?</span>
            </h2>

            <p
              className="mt-6 text-lg text-gray-700"
              style={{ textShadow: "0px 1px 2px rgba(0, 0, 0, 0.15)" }}
            >
              As a member of our dynamic community, you’ll unlock opportunities
              and experiences that will shape your future. Here’s what you’ll
              gain:
            </p>
          </div>
          {/* Decoration below the title */}
          <div className="absolute -bottom-6 -right-4 md:-right-8 hidden sm:block"></div>
        </motion.div>

        {/* 1 guy 3 boxes */}
        <motion.div
          className="flex flex-col gap-6 col-span-3"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="flex-1">
            <div className="bg-white shadow-2xl rounded-lg p-6 text-left flex flex-col flex-grow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full border border-[#DBB968] flex items-center justify-center min-w-[48px]">
                  <Image
                    src="/joinUsPage/innovation-hub.svg"
                    alt="Innovation Hub"
                    loading="lazy"
                    width={24}
                    height={24}
                  />
                </div>
                <h3 className="ml-4 text-xl font-semibold text-gray-900">
                  Innovation Hub
                </h3>
              </div>
              <p className="text-gray-700 flex-grow">
                Collaborate on cutting-edge FinTech projects that bring
                real-world solutions to life. You'll have the freedom to
                experiment, innovate, and push boundaries through department and
                club-wide activities.
              </p>
            </div>
          </div>

          <div className="flex gap-6 lg:flex-row flex-col items-stretch">
            <div className="flex-1 bg-white shadow-2xl rounded-lg p-6 text-left flex flex-col flex-grow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full border border-[#DBB968] flex items-center justify-center min-w-[48px]">
                  <Image
                    src="/joinUsPage/skill-building.svg"
                    alt="Skill Building"
                    loading="lazy"
                    width={24}
                    height={24}
                  />
                </div>
                <h3 className="ml-4 text-xl font-semibold text-gray-900">
                  Skill Building
                </h3>
              </div>
              <p className="text-gray-700 flex-grow">
                Enhance your skills in problem-solving, teamwork, leadership,
                and technical knowledge; Gain hands-on experience within each
                training sessions and projects.
              </p>
            </div>

            <div className="flex-1 bg-white shadow-2xl rounded-lg p-6 text-left flex flex-col flex-grow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full border border-[#DBB968] flex items-center justify-center min-w-[48px]">
                  <Image
                    src="/joinUsPage/professional-networking.svg"
                    alt="Professional Networking"
                    loading="lazy"
                    width={24}
                    height={24}
                  />
                </div>
                <h3 className="ml-4 text-xl font-semibold text-gray-900">
                  Professional Networking
                </h3>
              </div>
              <p className="text-gray-700 flex-grow">
                Connect with talented members, industry expertises; Attend
                exclusive events, specialized workshops; Acquiring
                mind-blowing knowledge in different areas.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyJoinFintechClub;

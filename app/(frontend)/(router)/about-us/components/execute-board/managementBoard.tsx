import { Card, CardBody, CardHeader } from "@heroui/react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { IconBrandLinkedin } from "@tabler/icons-react";
import { motion, useInView } from "framer-motion";
import "./styles.css";
import Link from "next/link";
import axios from "axios";
import { CircularProgress } from "@mui/material";

type ManagementBoardMember = {
  photo_url: string;
  name: string;
  position: string;
  linkedin_url: string;
};

const ManagementBoard = () => {
  const [members, setMembers] = useState<ManagementBoardMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Fetch data on component mount
  useEffect(() => {
    const fetchManagementBoard = async () => {
      try {
        const response = await axios.get("/api/v1/managementBoard");

        if (response.data.status === 200 && response.data.members) {
          setMembers(response.data.members);
        } else {
          setError(
            response.data.message ||
              "Failed to load management board data. Please try again later."
          );
        }
      } catch (err: any) {
        console.error("Error fetching management board: ", err);

        // Set error message
        if (err.response?.status === 404) {
          setError("Management board API not found");
        } else if (err.code === "ERR_NETWORK") {
          setError("Network error");
        } else {
          setError("Failed to load management board data");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchManagementBoard();
  }, []);

  // Loading state
  if (loading) {
    return (
      <section className="relative bg-[#F9FAFB] bg-cover bg-center pt-[5rem]">
        <Image
          src="https://d2prwyp3rwi40.cloudfront.net/global/Mascot+-+M%E1%BA%B7t+b%C3%AAn.svg"
          alt="Bear mascot"
          className="absolute left-[-8rem] top-0 rotate-[35deg] scale-x-[-1] z-30"
          width={368}
          height={368}
          loading="lazy"
        />
        <div className="absolute bottom-[-2rem] right-[8rem] w-[7rem] h-[7rem] bg-[#C9D6EA] rounded-full z-20"></div>
        <div className="absolute bottom-[-2rem] right-[13rem] w-[3.7rem] h-[3.7rem] bg-[#DBB968] rounded-full z-10"></div>
        <div className="absolute bottom-[0.5rem] right-[16rem] w-[3.7rem] h-[3.7rem] bg-[#2C305F] rounded-full z-10"></div>
        <div className="absolute bottom-[0.2rem] right-[21rem] w-[1.8rem] h-[1.8rem] bg-[#2C305F] rounded-full z-10"></div>
        <div className="absolute bottom-[4.8rem] right-[15rem] w-[1.3rem] h-[1.3rem] bg-[#C9D6EA] rounded-full z-10"></div>
        <div className="absolute bottom-[3rem] right-[5.5rem] w-[1.3rem] h-[1.3rem] bg-[#C9D6EA] rounded-full z-10"></div>
        <div className="absolute bottom-[3rem] right-[2.4rem] w-[4rem] h-[4rem] bg-[#2C305F] rounded-full z-10"></div>

        <main className="mx-[64px] 2xl:mx-[10rem]">
          <div className="content grid text-right">
            <h2 className="leading-8 text-[#5E5E92] text-[2.2rem] font-bold">
              Meet Our
            </h2>
            <h1 className=" text-[#DCB968] text-[4.3rem]">Management Board</h1>
            <p className="leading-8 w-full text-[#000000]">
              Meet the talented representatives behind the four pillars of RMIT
              Vietnam FinTech Club!
            </p>
          </div>
          <div className="p-8 text-center flex flex-col items-center justify-center h-64">
            <CircularProgress sx={{ color: "#DCB968" }} />
            <p className="mt-4 text-lg text-[#5E5E92]">
              Loading Management Board
            </p>
          </div>
        </main>
      </section>
    );
  }

  return (
    <section className="relative bg-[#F9FAFB] bg-cover bg-center pt-[5rem]">
      <Image
        src="https://d2prwyp3rwi40.cloudfront.net/global/Mascot+-+M%E1%BA%B7t+b%C3%AAn.svg"
        alt="Bear mascot"
        className="absolute left-[-8rem] top-[-3rem] rotate-[35deg] scale-x-[-1] z-30"
        width={380}
        height={380}
        loading="lazy"
      />
      <div className="absolute bottom-[-2rem] right-[8rem] w-[7rem] h-[7rem] bg-[#C9D6EA] rounded-full z-20"></div>
      <div className="absolute bottom-[-2rem] right-[13rem] w-[3.7rem] h-[3.7rem] bg-[#DBB968] rounded-full z-10"></div>
      <div className="absolute bottom-[0.5rem] right-[16rem] w-[3.7rem] h-[3.7rem] bg-[#2C305F] rounded-full z-10"></div>
      <div className="absolute bottom-[0.2rem] right-[21rem] w-[1.8rem] h-[1.8rem] bg-[#2C305F] rounded-full z-10"></div>
      <div className="absolute bottom-[4.8rem] right-[15rem] w-[1.3rem] h-[1.3rem] bg-[#C9D6EA] rounded-full z-10"></div>
      <div className="absolute bottom-[3rem] right-[5.5rem] w-[1.3rem] h-[1.3rem] bg-[#C9D6EA] rounded-full z-10"></div>
      <div className="absolute bottom-[3rem] right-[2.4rem] w-[4rem] h-[4rem] bg-[#2C305F] rounded-full z-10"></div>

      <main className="mx-[64px] 2xl:mx-[10rem]">
        <div className="content grid text-right">
          <h2 className="leading-8 text-[#5E5E92] text-[2.2rem] font-bold">
            Meet Our
          </h2>
          <h1 className=" text-[#DCB968] text-[4.3rem]">Management Board</h1>
          <p className="leading-8 w-full text-[#000000]">
            Meet the talented representatives behind the four pillars of RMIT
            Vietnam FinTech Club!
          </p>
        </div>

        {/* Display error message */}
        {error && (
          <div className="relative w-[87vw] h-48 mx-auto mt-10 md:h-64 p-[4px] rounded-lg bg-gradient-to-b from-[#DCB968] to-[#F7D27F]">
            <div className="flex flex-col items-center justify-center w-full h-full bg-[#F9FAFB] rounded-[7px] text-center px-4">
              <p className="text-5xl font-bold mb-4">⚠️</p>
              <p className="text-[#2C305F] text-xl">{error}</p>
            </div>
          </div>
        )}

        <div className=" pt-16 pb-[8rem] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[3rem] 2xl:gap-[5rem]">
          {members.map((item, index) => (
            <MemberCard key={index} {...item} index={index} />
          ))}
        </div>
      </main>
    </section>
  );
};

function MemberCard({
  photo_url,
  name,
  position,
  linkedin_url,
  index,
}: ManagementBoardMember & { index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref);

  return (
    <motion.div
      ref={ref}
      animate={{
        y: isInView ? (index % 2 === 0 ? 25 : -25) : 0,
        opacity: isInView ? 1 : 0.7,
      }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <Card className="relative mt-[1.5rem] rounded-2xl border-[4px] border-[#F7D27F] border-solid overflow-hidden">
        <CardHeader className="pb-0 pt-0 h-[12rem] 2xl:h-[16rem]">
          <div className="z-0">
            <Image
              alt={`${name} profile`}
              src={photo_url}
              className="object-cover w-full h-full translate-y-[13%]"
              width={400}
              height={400}
              fetchPriority="high"
              loading="eager"
              priority={true}
            />
          </div>
        </CardHeader>
        <CardBody className=" relative z-10 overflow-visible pb-[0.5rem] pl-[1rem] pt-[1.5rem] bg-[#F7D27F] rounded-t-[30px] flex justify-between">
          <div className="flex justify-between items-start">
            <div>
              <h6 className="leading-6 font-semibold text-[0.9rem] text-[#2C305F]">
                {name}
              </h6>
              <p className="leading-5 text-[#2C305F] text-[0.7rem]">
                {position}
              </p>
            </div>
            {linkedin_url && linkedin_url.trim() ? (
              <Link
                href={linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                title="Visit LinkedIn"
              >
                <IconBrandLinkedin
                  size={40}
                  color="#2C305F"
                  strokeWidth={0.8}
                  className="transition duration-300 transform hover:scale-110 hover:brightness-150 hover:drop-shadow-[0_0_6px_#2C305F]"
                />
              </Link>
            ) : (
              <IconBrandLinkedin
                size={40}
                color="#9CA3AF"
                strokeWidth={0.8}
                className="opacity-50 cursor-not-allowed"
                title="LinkedIn not available"
              />
            )}
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}

export default ManagementBoard;

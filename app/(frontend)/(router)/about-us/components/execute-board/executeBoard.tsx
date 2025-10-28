import { Card, CardBody, CardHeader } from "@heroui/react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import "./styles.css";
import Link from "next/link";
import { IconBrandLinkedin } from "@tabler/icons-react";
import { motion, useInView } from "framer-motion";
import axios from "axios";
import { CircularProgress } from "@mui/material";

type ExecutiveBoardMember = {
  photo_url: string;
  name: string;
  position: string;
  linkedin_url: string;
};

const ExecutiveBoard = () => {
  const [members, setMembers] = useState<ExecutiveBoardMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Fetch data on component mount
  useEffect(() => {
    const fetchExecutiveBoard = async () => {
      try {
        const response = await axios.get("/api/v1/executivemembers");

        if (response.data.status === 200 && response.data.members) {
          setMembers(response.data.members);
        } else {
          setError(
            response.data.message ||
              "Failed to load executive board data. Please try again later."
          );
        }
      } catch (err: any) {
        console.error("Error fetching executive board: ", err);

        // Set error message
        if (err.response?.status === 404) {
          setError("Executive board API not found");
        } else if (err.code === "ERR_NETWORK") {
          setError("Network error");
        } else {
          setError("Failed to load executive board data");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchExecutiveBoard();
  }, []);

  if (loading) {
    return (
      <section className="relative bg-[#F9FAFB] bg-cover bg-center pt-[4rem]">
        <div className="absolute top-[4.3rem] right-[1.8rem] w-[4rem] h-[4rem] bg-[#C9D6EA] rounded-full"></div>
        <div className="absolute top-[11rem] right-[5rem] w-[2.5rem] h-[2.5rem] bg-[#DBB968] rounded-full"></div>
        <div className="absolute bottom-[-1rem] right-[-2.4rem] w-[6rem] h-[6rem] bg-[#DBB968] rounded-full z-20"></div>
        <div className="absolute bottom-[-2rem] right-[1.8rem] w-[3.7rem] h-[3.7rem] bg-[#2C305F] rounded-full z-10"></div>
        <div className="absolute bottom-[-6rem] left-[1rem] w-[8rem] h-[8rem] bg-[#2C305F] rounded-full z-10"></div>
        <div className="absolute bottom-[2rem] left-[8.5rem] w-[2.8rem] h-[2.8rem] bg-[#C9D6EA] rounded-full z-10"></div>
        <div className="absolute bottom-[-1.8rem] left-[12rem] w-[4.3rem] h-[4.3rem] bg-[#DBB968] rounded-full z-10"></div>
        <div className="absolute bottom-[5rem] left-[15rem] w-[2rem] h-[2rem] bg-[#DBB968] rounded-full z-10"></div>
        <div className="absolute bottom-[1rem] left-[21rem] w-[1.6rem] h-[1.6rem] bg-[#C9D6EA] rounded-full z-10"></div>

        <main className="mx-[64px] 2xl:mx-[10rem]">
          <div className="content grid">
            <h2 className="leading-8 text-[#5E5E92] text-[2.2rem] font-bold">
              Meet Our
            </h2>
            <h1 className=" text-[#2C305F] text-[4.3rem]">Executive Board</h1>
            <p className="leading-8 w-full text-[#000000]">
              Meet the fierce, brilliant, and passionate minds behind the
              FinTech Club machine!
            </p>
          </div>
          <div className="p-8 text-center flex flex-col items-center justify-center h-64">
            <CircularProgress sx={{ color: "#DCB968" }} />
            <p className="mt-4 text-lg text-[#5E5E92]">
              Loading Executive Board
            </p>
          </div>
        </main>
      </section>
    );
  }
  return (
    // using hex color (invalid)
    <section className="relative bg-[#F9FAFB] bg-cover bg-center pt-[4rem]">
      <div className="absolute top-[4.3rem] right-[1.8rem] w-[4rem] h-[4rem] bg-[#C9D6EA] rounded-full"></div>
      <div className="absolute top-[11rem] right-[5rem] w-[2.5rem] h-[2.5rem] bg-[#DBB968] rounded-full"></div>
      <div className="absolute bottom-[1rem] right-[-2.4rem] w-[6rem] h-[6rem] bg-[#DBB968] rounded-full z-20"></div>
      <div className="absolute bottom-0 right-[1.8rem] w-[3.7rem] h-[3.7rem] bg-[#2C305F] rounded-full z-10"></div>
      <div className="absolute bottom-[-4rem] left-[1rem] w-[8rem] h-[8rem] bg-[#2C305F] rounded-full z-10"></div>
      <div className="absolute bottom-[4rem] left-[8.5rem] w-[2.8rem] h-[2.8rem] bg-[#C9D6EA] rounded-full z-10"></div>
      <div className="absolute bottom-[0.8rem] left-[12rem] w-[4.3rem] h-[4.3rem] bg-[#DBB968] rounded-full z-10"></div>
      <div className="absolute bottom-[7rem] left-[15rem] w-[2rem] h-[2rem] bg-[#DBB968] rounded-full z-10"></div>
      <div className="absolute bottom-[3rem] left-[21rem] w-[1.6rem] h-[1.6rem] bg-[#C9D6EA] rounded-full z-10"></div>

      <main className="mx-[4rem] 2xl:mx-[10rem]">
        <div className="content grid">
          <h2 className="leading-8 text-[#5E5E92] text-[2.2rem] font-bold">
            Meet Our
          </h2>
          <h1 className=" text-[#2C305F] text-[4.3rem]">Executive Board</h1>
          <p className="leading-8 w-full text-[#000000]">
            Meet the fierce, brilliant, and passionate minds behind the FinTech
            Club machine!
          </p>
        </div>

        {/* Display error message */}
        {error && (
          <div className="relative w-[90vw] h-48 mx-auto mt-10 md:h-64 p-[4px] rounded-lg bg-gradient-to-b from-[#DCB968] to-[#F7D27F]">
            <div className="flex flex-col items-center justify-center w-full h-full bg-[#F9FAFB] rounded-[7px] text-center px-4">
              <p className="text-5xl font-bold mb-4">⚠️</p>
              <p className="text-[#2C305F] text-xl">{error}</p>
            </div>
          </div>
        )}

        <div className=" pt-16 pb-[8rem] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[3rem] 2xl:gap-[5rem]">
          {members.map((item, index) => (
            <ExecutiveBoardCard key={index} {...item} index={index} />
          ))}
        </div>
      </main>
    </section>
  );
};

function ExecutiveBoardCard({
  photo_url,
  name,
  position,
  linkedin_url,
  index,
}: ExecutiveBoardMember & { index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref);

  return (
    <motion.div
      ref={ref}
      animate={{
        y: isInView ? (index % 2 === 0 ? -25 : 25) : 0,
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

export default ExecutiveBoard;

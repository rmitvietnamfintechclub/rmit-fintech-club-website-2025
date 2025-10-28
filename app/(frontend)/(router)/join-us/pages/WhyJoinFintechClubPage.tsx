"use client";
import WhyJoinFintechClub from "../components/WhyJoinFintechClub";

interface WhyJoinFinTechClubPageProps {
  id: string;
}

const WhyJoinFintechClubPage = ({id}: WhyJoinFinTechClubPageProps) => {
  return (
    <div 
      id={id} 
      className="flex flex-col items-center justify-center min-h-screen bg-white">
      <WhyJoinFintechClub />
    </div>
  );
};

export default WhyJoinFintechClubPage;

"use client";
import ExecuteBoard from "./components/execute-board/executeBoard";
import ManagementBoard from "./components/execute-board/managementBoard";
import III from "./components/III/III";
import HistorySection from "./components/history";
import FinTechInTheEyes from "./components/inTheEyes";
import Members from "./components/members";
import { ClubMentors } from "./components/mentors";
import VisionMission from "./components/vision-mission/missionVision";
import HallOfFamePage from "./components/hallOfFamePage";

const AboutUs = () => {
	return (
		<>
			<HistorySection />
			<VisionMission />
			<III />
			<FinTechInTheEyes />
			<ClubMentors />
			<ExecuteBoard />
			<ManagementBoard />
			<HallOfFamePage />
			{/* <Members /> */}
		</>)
};

export default AboutUs;

import ContentContainer from "./contentContainer";
import PuzzleContainer from "./puzzleContainer";

const VisionMission = () => {
	const mainContent = {
		mission: {
			title: "MISSION",
			content:
				"To realize our vision, our objective in 2024 is to create impactful high-scale events, organize more meaningful and member-centric workshops, and diversify our projects to create more opportunities for members to learn and connect with real-world experts, gaining them valuable industry insights.",
		},
		vision: {
			title: "VISION",
			content:
				"Our vision is simple: to build a valuable hub for Finance, Technology, Business, and FinTech enthusiasts. Valuable to us means a club that can incubate knowledge, skills, practical experience and connections for its members, while engaging and educating the community into the FinTech industry.",
		},
	};

	return (
		<div className="w-full md:py-[5rem] flex flex-col-reverse justify-center items-center md:flex-row bg-[#F9FAFB]">
			<ContentContainer
				title={mainContent.vision.title}
				content={mainContent.vision.content}
				headingColor={"text-ft-primary-blue"}
				textColor={"text-black"}
				bgColor={"bg-ft-primary-yellow"}
				rounded={
					"md:rounded-br-[60px] md:rounded-tr-[60px] md:rounded-tl-[60px]"
				}
				shadowPosition={"shadow-[rgba(0,0,15,0.2)_-10px_5px_4px_0px]"}
			/>
			<ContentContainer
				title={mainContent.mission.title}
				content={mainContent.mission.content}
				headingColor={"text-ft-primary-yellow"}
				textColor={"text-white"}
				bgColor={"bg-ft-primary-blue"}
				rounded={
					"md:rounded-bl-[60px] md:rounded-tl-[60px] md:rounded-tr-[60px]"
				}
				shadowPosition={"shadow-[rgba(0,0,15,0.2)_-10px_5px_4px_0px]"}
			/>
			<PuzzleContainer />
		</div>
	);
};

export default VisionMission;

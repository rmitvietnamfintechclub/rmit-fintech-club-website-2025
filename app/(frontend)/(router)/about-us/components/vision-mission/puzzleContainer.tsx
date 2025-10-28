import PuzzleItem from "./puzzleItem";

const PuzzleContainer = () => {
	return (
		<div className="absolute -rotate-90 flex flex-col md:rotate-0">
			<PuzzleItem
				bgColor={"bg-ft-primary-blue"}
				circleColor={"bg-ft-primary-yellow"}
				borderRadius={"rounded-es-[2rem] rounded-ee-[3rem]"}
				circlePosition={"top-3 left-[18px]"}
				shadowPosition={"shadow-[rgba(0,0,15,0.2)_-10px_5px_4px_0px]"}
			/>
			<PuzzleItem
				bgColor={"bg-ft-primary-yellow"}
				circleColor={"bg-ft-primary-blue"}
				borderRadius={"rounded-ss-[3rem] rounded-se-[2rem]"}
				circlePosition={"bottom-3 right-[18px]"}
				shadowPosition={
					"shadow-[inset_rgba(0,0,15,0.2)_-10px_5px_4px_0px]"
				}
			/>
		</div>
	);
};

export default PuzzleContainer;

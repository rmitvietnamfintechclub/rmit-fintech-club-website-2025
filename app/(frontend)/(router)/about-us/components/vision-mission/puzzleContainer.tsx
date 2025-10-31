import PuzzleItem from "./puzzleItem";

const PuzzleContainer = () => {
	return (
		<div className="absolute -rotate-90 flex flex-col md:rotate-0 max-md:-translate-y-2">
			<PuzzleItem
				bgColor={"bg-ft-primary-blue"}
				circleColor={"bg-ft-primary-yellow"}
				borderRadius={"rounded-bl-[2rem]"}
				circlePosition={"top-3 left-[20px] md:left-[18px]"}
				shadowPosition={"md:shadow-[rgba(0,0,15,0.2)_-10px_5px_4px_0px]"}
			/>
			<PuzzleItem
				bgColor={"bg-ft-primary-yellow"}
				circleColor={"bg-ft-primary-blue"}
				borderRadius={"rounded-tr-[2rem]"}
				circlePosition={"bottom-3 right-[20px] md:right-[18px]"}
				shadowPosition={
					"md:shadow-[inset_rgba(0,0,15,0.2)_-10px_0px_0px_0px]"
				}
			/>
		</div>
	);
};

export default PuzzleContainer;

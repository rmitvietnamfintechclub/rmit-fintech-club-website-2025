import clsx from "clsx";
import type React from "react";

type PuzzleItemProps = {
	bgColor: string;
	circleColor: string;
	borderRadius: string;
	circlePosition: string;
	shadowPosition: string;
};

const PuzzleItem: React.FC<PuzzleItemProps> = ({
	bgColor,
	circleColor,
	borderRadius,
	circlePosition,
	shadowPosition,
}) => {
	return (
		<div
			className={clsx(
				"w-16 md:w-24 h-[12.5rem] md:h-48 z-10 md:right-[100%] md:top-24 md:rotate-0",
				bgColor,
				borderRadius,
				shadowPosition,
			)}
		>
			<div
				className={clsx(
					"absolute w-3 h-3 rounded-full",
					circleColor,
					circlePosition,
				)}
			/>
		</div>
	);
};

export default PuzzleItem;

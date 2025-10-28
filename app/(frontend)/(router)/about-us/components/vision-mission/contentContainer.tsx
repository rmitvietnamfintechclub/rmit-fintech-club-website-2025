import clsx from "clsx";
import type React from "react";

type ContentContainerProps = {
	title: string;
	content: string;
	headingColor: string;
	textColor: string;
	bgColor: string;
	rounded: string;
	shadowPosition: string;
};

const ContentContainer: React.FC<ContentContainerProps> = ({
	title,
	content,
	headingColor,
	textColor,
	bgColor,
	rounded,
	shadowPosition,
}) => {
	return (
		<div
			className={clsx(
				"content relative md:min-h-[31rem] md:max-w-[45vw] flex flex-col justify-center items-center py-15 px-20",
				rounded,
				bgColor,
				shadowPosition,
			)}
		>
			<h1 className={clsx("text-center text-6xl my-8", headingColor)}>
				{" "}
				{title}{" "}
			</h1>
			<div
				className={clsx(
					"text-[1.25rem] leading-[1.75rem] text-justify relative max-w-[30rem]",
					textColor,
				)}
			>
				{" "}
				{content}{" "}
			</div>
		</div>
	);
};

export default ContentContainer;

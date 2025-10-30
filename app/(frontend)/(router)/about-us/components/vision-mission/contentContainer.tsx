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
				"content relative md:min-h-[31rem] md:max-w-[45vw] flex flex-col justify-center items-center px-6 md:px-20 max-md:pb-12",
				rounded,
				bgColor,
				shadowPosition,
			)}
		>
			<h1 className={clsx("text-center text-6xl !font-extrabold max-md:mt-12 max-md:mb-4 md:my-8", headingColor)}>
				{title}
			</h1>
			<div
				className={clsx(
					"text-[1.25rem] leading-[1.75rem] text-center md:text-justify relative max-w-[30rem]",
					textColor,
				)}
			>
				{content}
			</div>
		</div>
	);
};

export default ContentContainer;

"use client";

import type React from "react";
import { useEffect, useState } from "react";

type HeaderTitlePageProps = {
	text: string;
};

const HeaderTitlePage: React.FC<HeaderTitlePageProps> = ({ text }) => {
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);
	const [displayText, setDisplayText] = useState(text);

	// Effect to handle window resizing
	useEffect(() => {
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	// Adjust displayed text based on the window width
	useEffect(() => {
		if (windowWidth < 640) {
			// Assuming 640px is the breakpoint for mobile
			setDisplayText("upcoming events");
		} else {
			setDisplayText(text);
		}
	}, [windowWidth, text]);

	const [first, middle, last] = displayText.split(" ");

	return (
		<section className="flex justify-center my-4 mx-auto items-center max-w-4xl w-full relative">
			<div className="relative flex items-center w-full lg:w-auto">
				{/* Left arrow */}
				<div className="bg-ft-primary-blue-500 h-1 w-full lg:w-64 lg:block hidden" />
				<div className="absolute bg-ft-primary-blue-500 h-4 w-full lg:w-4 rounded-full lg:block hidden" />
			</div>
			<img
				src="https://fintech-club-website.s3.ap-southeast-2.amazonaws.com/events/balloon-bottom-left.svg"
				className="decoration absolute md:hidden bottom-0 left-0 h-12 w-12"
			/>
			<img
				src="https://fintech-club-website.s3.ap-southeast-2.amazonaws.com/events/balloon-bottom-left.svg"
				className="decoration absolute md:hidden top-0 right-0 h-12 w-12"
			/>
			{/* Text with spacing adjustments */}
			<div
				className={`flex mx-8 xl:mx-16 text-center w-full ${
					windowWidth < 640 ? "flex-col" : "flex-row"
				}`}
			>
				{windowWidth < 640 ? (
					<section className="relative">
						<h5 className="uppercase text-ft-primary-yellow font-bold flex-grow leading-10">
							upcoming
						</h5>
						<h5 className="uppercase text-ft-primary-blue-500 font-bold flex-grow ">
							events
						</h5>
					</section>
				) : (
					<>
						<h5 className="uppercase text-ft-primary-blue-500 font-bold flex-grow px-2">
							{first}
						</h5>
						<h5 className="uppercase text-ft-primary-yellow font-bold flex-grow px-2">
							{middle}
						</h5>
						<h5 className="uppercase text-ft-primary-blue-500 font-bold flex-grow px-2">
							{last}
						</h5>
					</>
				)}
			</div>
			{/* Right arrow*/}
			<div className="relative flex items-center w-full lg:w-auto">
				<div className="bg-ft-primary-blue-500 h-1 w-full lg:w-64 lg:block hidden" />
				<div className="bg-ft-primary-blue-500 h-4 w-full lg:w-4 rounded-full lg:block hidden" />
			</div>
		</section>
	);
};

export default HeaderTitlePage;

"use client";
import type { Event } from "../../components/types";
import { Button } from "@heroui/react";
import type React from "react";

const EventDetail: React.FC<{ event: Event }> = ({ event }) => {
	console.log(event);
	return (
		<div className="items-center w-full h-full lg:mx-side-margin 2xl:mx-16 my-4 2xl:my-8 justify-between">
			<section
				className="relative flex flex-col md:flex-row justify-center md:justify-between items-center w-full h-[50vh] rounded-2xl bg-cover bg-center"
				style={{
					backgroundImage: `url(${event?.imageUrl})`,
					backgroundRepeat: "no-repeat",
					backgroundSize: "cover",
					backgroundClip: "border-box",
				}}
			>
				<div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/50 rounded-2xl" />
				<div className="relative z-10 w-full p-6 text-white">
					<h1 className="text-3xl md:text-5xl max-md:text-center font-black my-5 max-w-[800px] leading-loose">
						{event?.name}
					</h1>
					<h5 className="text-md md:text-lg mb-3 font-medium max-xl:hidden">
						{event?.description}
					</h5>
					<div className="flex flex-row gap-4 mt-4 max-md:justify-center">
						<a href={event?.registrationLink}>
							<Button
								size="lg"
								variant="solid"
								className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
							>
								Join Event
							</Button>
						</a>
						<a href={event?.registrationLink}>
							<Button
								size="lg"
								variant="bordered"
								className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black font-bold"
							>
								Event Booklet
							</Button>
						</a>
					</div>
				</div>
			</section>

			<section className="w-full my-10 flex flex-col md:flex-row">
				{/* Left content */}
				<div className="w-full md:h-full flex flex-col justify-between md:w-2/5 md:px-4">
					<div className="my-1 py-1 2xl:my-2 2xl:py-4">
						<h6 className="font-black py-1 2xl:py-2 text-left text-ft-primary-blue-500">
							Objectives
						</h6>
						<p className="py-1 2xl:py-2 text-justify">
							{event?.objective}
						</p>
					</div>
					<div className="my-1 py-1 2xl:my-2 2xl:py-4">
						<h6 className="font-black py-1 2xl:py-2 text-left text-ft-primary-blue-500">
							Who can join?
						</h6>
						<p className="py-1 2xl:py-2 text-justify">
							{event?.participants}
						</p>
					</div>
					<div className="my-1 py-1 2xl:my-2 2xl:py-4">
						<h6 className="font-black py-1 2xl:py-2 text-left text-ft-primary-blue-500">
							Event Date & Time
						</h6>
						<p className="py-1 2xl:py-2 text-justify break-all">
							<span className="text-ft-primary-yellow-600 font-bold">
								Date:{" "}
							</span>
							{event?.time.split(",")[0]}
						</p>
						<p className="py-1 2xl:py-2 text-justify break-all">
							<span className="text-ft-primary-yellow-600 font-bold">
								Time:{" "}
							</span>
							{event?.time === "To be updated"
								? "All day"
								: event?.time.split(",")[1]}
						</p>
					</div>
				</div>
				{/* Right content */}
				<div className="py-4 lg:py-1 md:px-4 2xl:py-4 md:w-3/5">
					<h5 className="font-black py-1 2xl:py-2 mb-4 text-left text-ft-primary-blue-500">
						Event Location
					</h5>
					<iframe
						src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62713.703081693166!2d106.6549008613193!3d10.764783831994377!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752fbea5fe3db1%3A0xfae94aca5709003f!2zxJDhuqFpIEjhu41jIFJNSVQgTmFtIFPDoGkgR8Oybg!5e0!3m2!1svi!2s!4v1714499338949!5m2!1svi!2s"
						loading="lazy"
						title="Event Location Google Map"
						className="w-full object-cover h-[360px] 2xl:h-[480px] rounded-xl"
					/>
				</div>
			</section>
		</div>
	);
};

export default EventDetail;

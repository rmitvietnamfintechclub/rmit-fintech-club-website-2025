import {
	IconBuildingCommunity,
	IconClock,
	IconLink,
	IconMapPin,
} from "@tabler/icons-react";
import type React from "react";
import type { Event } from "./types";
import Image from "next/image";
import Link from "next/link";

const EventCard: React.FC<{ event: Event }> = ({ event }) => {
	// Define your theme colors
	const primaryYellow = "#DCB968"; // Make sure this color is defined correctly

	return (
		<div className="grid grid-rows-1 grid-cols-12 gap-2 md:max-h-60 md:grid-rows-1 md:gap-4 border rounded-2xl shadow-md overflow-hidden max-w-4xl w-full mx-auto my-4">
			{/* Event Image */}
			<div className="row-span-1 col-span-12 md:col-span-4 w-full">
				<Image
					src={event.imageUrl}
					alt="Event"
					width={1000}
					height={1000}
				/>
			</div>

			{/* Event Info */}
			<div className="date row-span-1 col-span-3 flex flex-col justify-between p-2 md:p-4 py-auto space-y-2 text-center align-middle mb-2">
				<div className="flex flex-col align-middle h-full">
					<p className="my-auto text-ft-primary-yellow-500 text-2xl font-bold">
						{event.date}
					</p>
				</div>
			</div>
			<div className="row-span-1 col-span-9 md:col-span-6 flex flex-col justify-center p-1 md:p-4 space-y-2 mb-2">
				<h3 className="text-xl font-bold">{event.name}</h3>
				<div className="flex items-center text-md">
					<IconClock
						className="mr-2 text-lg"
						stroke={primaryYellow}
						strokeWidth={2}
						style={{ color: primaryYellow }}
					/>
					{event.date}
				</div>
				<div className="flex items-center text-md">
					{event.type === "Offline" ? (
						<IconBuildingCommunity
							className="mr-2 text-lg"
							stroke={primaryYellow}
							strokeWidth={2}
							style={{ color: primaryYellow }}
						/>
					) : (
						<IconLink
							className="mr-2 text-lg"
							stroke={primaryYellow}
							strokeWidth={2}
							style={{ color: primaryYellow }}
						/>
					)}
					{event.type}
				</div>
				<div className="flex items-center text-md">
					<IconMapPin
						className="mr-2 text-lg"
						stroke={primaryYellow}
						strokeWidth={2}
						style={{ color: primaryYellow }}
					/>
					{event.location}
				</div>
			</div>

			{/* Explore More Section */}
			<div className="col-span-2 flex items-center justify-center bg-ft-primary-blue relative explore">
				<div
					className="absolute left-0 top-0 bottom-0 w-px"
					style={{
						borderLeft: "1px dashed white",
						backgroundImage:
							"linear-gradient(to bottom, white 50%, transparent 50%)",
						backgroundSize: "100% 12px",
					}}
				/>
				<Link
					href={`/events/event-detail/${event._id}`}
					className="text-ft-primary-yellow rotate-90 text-lg font-semibold z-10 uppercase"
				>
					Explore More
				</Link>
			</div>
		</div>
	);
};

export default EventCard;

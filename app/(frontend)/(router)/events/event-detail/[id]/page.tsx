"use client";
import axios from "axios";
// import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import EventDetail from "../components/eventDetail";
import EventLocation from "../components/eventLocation";
import ClipLoader from "react-spinners/ClipLoader";
import type { EventDetails } from "../components/types";
import type { Event } from "../../components/types";
import { Card, CardBody, CardFooter, Image, Skeleton } from "@heroui/react";

const EventDateAndLocation = ({ params }: { params: { id: string } }) => {
	const [data, setData] = useState<Event>();
	const [isLoading, setIsLoading] = useState(true);
	const [eventList, setEventList] = useState<Event[]>();
	const [imageLoading, setImageLoading] = useState(false);

	useEffect(() => {
		// console.log(eventId);
		const configuration = {
			method: "get",
			url: `/api/v1/events/upcoming/${params.id}`,
		};
		axios(configuration)
			.then((result) => {
				setData(result.data.data);
				setIsLoading(false);
				// console.log(result.data.data);
			})
			.catch((error) => {
				console.log(error);
			});
	}, [params.id]);

	useEffect(() => {
		// console.log(eventId);
		const configuration = {
			method: "get",
			url: "/api/v1/events/upcoming",
		};
		axios(configuration)
			.then((result) => {
				setEventList(result.data.data);
				setIsLoading(false);
				// console.log(result.data.data);
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);

	// handle click on card to change data infor
	const handleClick = (item: Event) => {
		console.log(item);
		setData(item);
	};
	return isLoading ? (
		<section className="flex flex-col items-center h-screen w-full justify-center">
			<ClipLoader color="#2C305F" size={60} />
		</section>
	) : (
		<div className="flex flex-col my-16 mx-side-margin-mobile md:mx-[80px]">
			<div className="w-full lg:flex">
				{/* <EventDetail event={eventData} /> */}
				<EventDetail event={data!} />
				{/* <EventLocation /> */}
			</div>
			<div className="hidden lg:flex lg:absolute lg:top-1/3 lg:right-0">
				<Skeleton isLoaded={imageLoading}>
					<Image
						loading="lazy"
						src="/SideFinTechBearForEventDateAndLocation.svg"
						alt="above decoration for event date and location"
						width={200}
						height={200}
						onLoad={() => setImageLoading(true)}
					/>
				</Skeleton>
			</div>
			<div className="hidden lg:flex lg:justify-center lg:my-4">
				{/* Below Decoration for Event Date and Location */}
				<Skeleton isLoaded={imageLoading}>
					<Image
						loading="lazy"
						src="/ThreeBearsAndDecorationsForEventDateAndLocation.svg"
						alt="below decoration for event date and location"
						width={1000}
						height={250}
						onLoad={() => {
							setImageLoading(true);
						}}
					/>
				</Skeleton>
			</div>
			<div className="mx-24">
				<p className="font-black text-2xl my-10">
					Other events that you might be interested
				</p>
				<div className=" gap-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
					{eventList?.map((item, index) => (
						<Card
							shadow="sm"
							key={index}
							isPressable
							onClick={() => handleClick(item)}
						>
							<CardBody className="overflow-visible p-0">
								<Skeleton isLoaded={imageLoading}>
									<Image
										loading="lazy"
										shadow="sm"
										radius="none"
										width="100%"
										alt={item.name}
										className="w-full object-cover h-[140px] rounded-t-lg"
										src={item.imageUrl}
										onLoad={() => setImageLoading(true)}
									/>
								</Skeleton>
							</CardBody>
							<CardFooter className="w-full p-5 flex-row justify-between">
								{/* <Skeleton> */}
								<div className="w-1/6">
									<p className="font-black">
										{item.date === "To be updated"
											? "TBD"
											: item.date}
									</p>
								</div>
								<div className="w-4/5 text-center">
									<b className="text-lg font-[600] text-justify">
										{item.name}
									</b>
								</div>
								{/* </Skeleton> */}
							</CardFooter>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
};

export default EventDateAndLocation;

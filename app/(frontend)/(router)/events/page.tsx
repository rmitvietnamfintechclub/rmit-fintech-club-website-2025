"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import EventCard from "./components/eventCard";
import HeaderTitlePage from "./components/headerTitlePage";
import ClipLoader from "react-spinners/ClipLoader";

const Events = () => {
	const [eventsData, setEventsData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	useEffect(() => {
		const configuration = {
			method: "get",
			url: "/api/v1/events/upcoming",
		};
		axios(configuration)
			.then((result) => {
				setEventsData(result.data.data);
				setIsLoading(false);
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);
	return isLoading ? (
		<section className="flex flex-col items-center h-screen w-full justify-center">
			<ClipLoader color="#2C305F" size={60} />
		</section>
	) : (
		<section className="relative">
			<div className=" flex flex-col gap-8 items-center justify-center px-side-margin-mobile w-full mb-10 md:w-screen">
				<HeaderTitlePage text="Our Upcoming Events" />

				{eventsData?.map((event) => (
					<EventCard event={event} />
				))}
			</div>
		</section>
	);
};

export default Events;

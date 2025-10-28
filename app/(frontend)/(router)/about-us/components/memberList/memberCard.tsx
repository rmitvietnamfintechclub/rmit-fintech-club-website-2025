"use client";
import clsx from "clsx";
import type React from "react";
import { useState } from "react";
import type ClubMember from "./clubMember";
import { Skeleton } from "@heroui/react";

type MemberCardProps = {
	member: ClubMember;
};

const MemberCard: React.FC<MemberCardProps> = ({ member }) => {
	const [imageLoading, setImageLoading] = useState(false);
	return (
		<div className="flex flex-col items-center m-4">
			<Skeleton isLoaded={imageLoading}>
				<img
					className="w-28 h-28 xl:w-32 xl:h-32 2xl:w-44 2xl:h-44 rounded-2xl"
					src={member.avatarSrc}
					alt={member.name}
					onLoad={() => {
						setImageLoading(true);
					}}
				/>
			</Skeleton>
			<p className="text-center text-ft-text-dark">{member.name}</p>
		</div>
	);
};

export default MemberCard;

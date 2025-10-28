import Link from "next/link";
import type React from "react";

interface ButtonProps {
	children?: React.ReactNode;
	classes?: string;
	customBG?: string;
	href?: string;
	onClick?: Function;
}

const Button: React.FC<ButtonProps> = ({
	children,
	classes = "",
	customBG = "",
	href = "",
	onClick,
}) => {
	const Comp = href ? Link : "button";

	const btnClick = () => {
		if (href) window.scrollTo({ top: 0 });
		onClick?.();
	};

	return (
		<Comp
			onClick={btnClick}
			href={href}
			className={`${classes} ${customBG || "bg-gold"} font-semibold text-white transition duration-200 text-[5vw] px-[15vw] py-[2vw] tracking-[0.1vw] md:text-[1.3vw] md:px-[3vw] md:py-[0.4vw] rounded-[10px] hover:contrast-150`}
		>
			{children}
		</Comp>
	);
};

export default Button;

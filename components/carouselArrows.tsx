import clsx from "clsx";
import type { HTMLAttributes } from "react";
import { ChevronLeft, ChevronRight } from "tabler-icons-react";

interface ArrowProps extends HTMLAttributes<HTMLDivElement> {
	buttonOnClick?: () => void;
}

export const PreArrow: React.FC<ArrowProps> = ({ buttonOnClick, ...props }) => {
	return (
		<div {...props} className={clsx("z-10", props.className)}>
			<button
				type="button"
				title="Previous"
				onClick={buttonOnClick}
				className="flex justify-center w-10 h-10 rounded-full bg-ft-primary-yellow hover:bg-ft-primary-yellow-600"
			>
				<ChevronLeft size={40} color="white" />
			</button>
		</div>
	);
};

export const NextArrow: React.FC<ArrowProps> = ({
	buttonOnClick,
	...props
}) => {
	return (
		<div {...props} className={clsx("absolute z-10", props.className)}>
			<button
				type="button"
				title="Next"
				onClick={buttonOnClick}
				className="flex justify-center w-10 h-10 rounded-full bg-ft-primary-yellow hover:bg-ft-primary-yellow-600"
			>
				<ChevronRight size={40} color="white" />
			</button>
		</div>
	);
};

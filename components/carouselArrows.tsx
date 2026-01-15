import clsx from "clsx";
import type { HTMLAttributes } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
                className="flex justify-center items-center w-10 h-10 rounded-full bg-[#DCB968] hover:brightness-110 transition-all"
            >
                {/* 2. Lucide dùng props tương tự */}
                <ChevronLeft size={32} color="white" />
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
                className="flex justify-center items-center w-10 h-10 rounded-full bg-[#DCB968] hover:brightness-110 transition-all"
            >
                <ChevronRight size={32} color="white" />
            </button>
        </div>
    );
};
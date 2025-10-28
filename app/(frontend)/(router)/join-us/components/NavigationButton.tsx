import React from "react";

interface NavigationButtonProps {
  text: string;
  link: string;
}

const NavigationButton = ({ text, link }: NavigationButtonProps) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (link.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(link);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <a
      href={link}
      onClick={handleClick}
      className="flex flex-1 justify-center items-center py-4 px-8 bg-ft-primary-blue hover:bg-ft-primary-blue-200 text-white border rounded-b-3xl text-center font-semibold"
    >
      {text}
    </a>
  );
};

export default NavigationButton;

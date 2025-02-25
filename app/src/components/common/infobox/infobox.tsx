import { FC } from "react";

interface InfoboxProps {
  onClick: () => void;
  width?: number;
  height?: number;
}

const Infobox: FC<InfoboxProps> = ({ onClick, width = 22, height = 22 }) => {
  return (
    <div
      onClick={onClick}
      className={`dark:text-defaulttextcolor/70 cursor-pointer transition-transform duration-200 hover:scale-110 rounded-full z-10`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-circle-help"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <path d="M12 17h.01" />
      </svg>
    </div>
  );
};

export default Infobox;

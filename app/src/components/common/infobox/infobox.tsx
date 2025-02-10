import { Info } from "lucide-react";
import { FC } from "react";

interface InfoboxProps {
  onClick: () => void;
}

const Infobox: FC<InfoboxProps> = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      className="dark:text-defaulttextcolor/70 cursor-pointer transition-transform duration-200 hover:scale-110 bg-black/20 hover:bg-black/30 rounded-full p-1.5"
    >
      <Info />
    </div>
  );
};

export default Infobox;

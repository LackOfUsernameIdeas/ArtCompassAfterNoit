import { FC, useState, useRef } from "react";
import { Book } from "../../booksRecommendations-types";

interface GenresProps {
  recommendation: Book;
}

const AwardsSection: FC<GenresProps> = ({ recommendation }) => {
  const [showAwards, setShowAwards] = useState(false);
  const awardsContainerRef = useRef<HTMLDivElement | null>(null);

  const toggleAwardsVisibility = () => {
    setShowAwards((prevState) => !prevState);
  };

  return (
    <div className="awards-container">
      <div className="flex items-center space-x-4">
        <h3
          className="text-lg underline italic font-semibold cursor-pointer mt-2 underline-offset-lower hover:scale-105 transition"
          onClick={toggleAwardsVisibility}
        >
          Вижте литературни награди
        </h3>
      </div>

      <div
        ref={awardsContainerRef}
        className={`flex flex-wrap gap-2 mt-2 overflow-hidden transition-all duration-500 ease-in-out`}
        style={{
          maxHeight: showAwards
            ? `${awardsContainerRef.current?.scrollHeight}px`
            : "0px"
        }}
      >
        {recommendation.literary_awards ? (
          recommendation.literary_awards.split(", ").map((award, index) => (
            <span
              key={index}
              className="inline-block text-[#FFCC33] bg-[#bf9413]/70 dark:bg-[#FFCC33]/25 px-3 py-1 rounded-md text-sm"
            >
              {award}
            </span>
          ))
        ) : (
          <span className="text-gray-500">N/A</span>
        )}
      </div>
    </div>
  );
};

export default AwardsSection;

import React, { useState } from "react";
import MoviesAndSeriesRecommendationsTable from "./MoviesAndSeriesRecommendationsTable";
import ActorsDirectorsWritersTable from "./ActorsDirectorsWritersTable";
import GenresBarChart from "./GenresBarChart";
import CountWidgets from "./CountWidgets";
import { Count, DataType, Recommendation } from "../individualStats-types";

interface AccordionItemProps {
  title: string;
  type: "recommendations" | "watchlist";
  data: DataType;
  handleBookmarkClick: (movie: Recommendation) => void;
  bookmarkedMovies: {
    [key: string]: any;
  };
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  type,
  data,
  handleBookmarkClick,
  bookmarkedMovies
}) => {
  const [isOpen, setIsOpen] = useState(false); // Manage the open/close state of the accordion item

  const recommendationsData =
    type === "watchlist"
      ? data.topRecommendationsWatchlist.watchlist
      : data.topRecommendations.recommendations;

  const recommendationsCount: Count =
    type === "watchlist"
      ? {
          movies: data.topRecommendationsWatchlist.watchlist.filter(
            (item) => item.type === "movie"
          ).length,
          series: data.topRecommendationsWatchlist.watchlist.filter(
            (item) => item.type === "series"
          ).length
        }
      : {
          movies: data.topRecommendations.recommendations.filter(
            (item) => item.type === "movie"
          ).length,
          series: data.topRecommendations.recommendations.filter(
            (item) => item.type === "series"
          ).length
        };

  const toggleAccordion = () => {
    setIsOpen((prev) => !prev); // Toggle the accordion open/close state
  };

  return (
    <div className="hs-accordion accordion-item overflow-hidden">
      <button
        className="hs-accordion-toggle accordion-button hs-accordion-active:text-primary hs-accordion-active:pb-3 group py-0 inline-flex items-center justify-between gap-x-3 w-full font-semibold text-start text-gray-800 transition hover:text-secondary dark:hs-accordion-active:text-primary dark:text-gray-200 dark:hover:text-secondary"
        aria-controls={`hs-${title}-collapse`}
        type="button"
        onClick={toggleAccordion} // Attach the toggle function to the button
      >
        {title}
        <svg
          className={`hs-accordion-active:hidden hs-accordion-active:text-primary hs-accordion-active:group-hover:text-primary ${
            isOpen ? "hidden" : "block"
          } w-3 h-3 text-gray-600 group-hover:text-secondary dark:text-[#8c9097] dark:text-white/50`}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 5L8.16086 10.6869C8.35239 10.8637 8.64761 10.8637 8.83914 10.6869L15 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <svg
          className={`hs-accordion-active:block hs-accordion-active:text-primary hs-accordion-active:group-hover:text-primary ${
            isOpen ? "block" : "hidden"
          } w-3 h-3 text-gray-600 group-hover:text-secondary dark:text-[#8c9097] dark:text-white/50`}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 11L8.16086 5.31305C8.35239 5.13625 8.64761 5.13625 8.83914 5.31305L15 11"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <div
        id={`hs-${title}-collapse`}
        className={`hs-accordion-content w-full overflow-hidden transition-[height] duration-300 ${
          isOpen ? "max-h-screen" : "max-h-0"
        }`}
        aria-labelledby={`hs-${title}-heading`}
      >
        <div className="grid grid-cols-12 gap-x-6 mt-5 ml-5 mr-5">
          <div className="xxl:col-span-6 col-span-12">
            <MoviesAndSeriesRecommendationsTable
              type={type}
              data={recommendationsData}
              handleBookmarkClick={handleBookmarkClick}
              bookmarkedMovies={bookmarkedMovies}
            />
          </div>
          <div className="xxl:col-span-6 col-span-12">
            <ActorsDirectorsWritersTable data={data} type={type} />
          </div>
        </div>
        <div className="grid grid-cols-12 gap-x-6 ml-5 mr-5">
          <div className="xxl:col-span-6 col-span-12">
            <GenresBarChart type={type} data={data.topGenres} />
          </div>
          <div className="xxl:col-span-6 col-span-12">
            <CountWidgets
              type={type}
              recommendationsCount={recommendationsCount}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccordionItem;

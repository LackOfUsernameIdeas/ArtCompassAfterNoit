import { FC, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { RecommendationsProps } from "../recommendations-types";
import { MovieCard } from "./MovieCard";
import { PlotModal } from "./PlotModal";

export const RecommendationsList: FC<RecommendationsProps> = ({
  recommendationList
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inTransition, setInTransition] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const animationDuration = 500;

  if (!recommendationList.length) {
    return <div>No recommendations available.</div>;
  }

  const handleNext = () => {
    setDirection("right");
    setInTransition(true);

    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === recommendationList.length - 1 ? 0 : prevIndex + 1
      );
      setIsExpanded(false);
      setInTransition(false);
    }, 500);
  };

  const handlePrevious = () => {
    setDirection("left");
    setInTransition(true);

    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? recommendationList.length - 1 : prevIndex - 1
      );
      setIsExpanded(false);
      setInTransition(false);
    }, 500);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="relative flex items-center justify-between">
      <CSSTransition
        in={!inTransition}
        timeout={animationDuration}
        classNames="arrows"
        onExited={() => setInTransition(false)}
        unmountOnExit
      >
        <button
          onClick={handlePrevious}
          className="absolute left-[-120px] top-1/2 transform -translate-y-1/2 dark:text-white text-black text-6xl dark:hover:text-gray-400 hover:text-black hover:text-opacity-60 transition"
        >
          &lt;
        </button>
      </CSSTransition>

      <CSSTransition
        in={!inTransition}
        timeout={animationDuration}
        classNames={`slide-${direction}`}
        onExited={() => setInTransition(false)}
        unmountOnExit
      >
        <MovieCard
          recommendationList={recommendationList}
          currentIndex={currentIndex}
          isExpanded={isExpanded}
          openModal={openModal}
        />
      </CSSTransition>
      <CSSTransition
        in={!inTransition}
        timeout={animationDuration}
        classNames="arrows"
        onExited={() => setInTransition(false)}
        unmountOnExit
      >
        <button
          onClick={handleNext}
          className="absolute right-[-120px] top-1/2 transform -translate-y-1/2 dark:text-white text-black text-6xl dark:hover:text-gray-400 hover:text-black hover:text-opacity-60 transition"
        >
          &gt;
        </button>
      </CSSTransition>
      <CSSTransition
        in={isModalOpen}
        timeout={300}
        classNames="fade-no-transform"
        unmountOnExit
      >
        <PlotModal
          recommendationList={recommendationList}
          currentIndex={currentIndex}
          closeModal={closeModal}
        />
      </CSSTransition>
    </div>
  );
};

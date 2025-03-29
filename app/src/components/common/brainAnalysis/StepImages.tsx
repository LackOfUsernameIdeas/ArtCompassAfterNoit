import { Step } from "@/container/types_common";
import { useEffect, useState, useRef } from "react";
import { CSSTransition } from "react-transition-group";

const StepImages = ({
  currentStep,
  setSelectedImage
}: {
  currentStep: Step;
  setSelectedImage: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  // Използваме useRef, за да запазим състоянието на зареждане на изображенията между рендерирането
  const loadingImagesRef = useRef<boolean[]>([]);

  useEffect(() => {
    if (currentStep.images?.length) {
      // Инициализираме състоянието на зареждане само когато изображенията се променят
      loadingImagesRef.current = new Array(currentStep.images.length).fill(
        true
      );
    }
  }, [currentStep.images]);

  const handleImageLoad = (index: number) => {
    setTimeout(() => {
      // Актуализираме референцията и ако е необходимо, предизвикваме ререндериране чрез state
      loadingImagesRef.current[index] = false;
    });
  };

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {currentStep.images?.map((imgSrc, index) => (
        <div key={index} className="relative">
          {/* Анимация за показване на индикатор за зареждане */}
          <CSSTransition
            in={loadingImagesRef.current[index]}
            timeout={100}
            classNames="fade"
            unmountOnExit
          >
            <div
              className={`w-32 h-32 rounded-lg bg-gray-700 animate-pulse border-2 border-primary flex items-center justify-center ${
                loadingImagesRef.current[index] ? "" : "hidden"
              }`}
            >
              {/* SVG икона за индикатор на зареждане */}
              <svg
                className="w-12 h-12 text-gray-400 dark:text-gray-500 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          </CSSTransition>

          {/* Анимация за показване на изображението след зареждане */}
          <CSSTransition
            in={!loadingImagesRef.current[index]}
            timeout={100}
            classNames="fade"
            unmountOnExit
          >
            <img
              src={imgSrc}
              alt={`Изображение ${index}`}
              className={`h-32 cursor-pointer rounded-lg object-contain border-2 border-primary transition-transform hover:scale-105 ${
                loadingImagesRef.current[index] ? "hidden" : ""
              }`}
              onLoad={() => handleImageLoad(index)}
              onClick={() => setSelectedImage(imgSrc)}
            />
          </CSSTransition>
        </div>
      ))}
    </div>
  );
};

export default StepImages;

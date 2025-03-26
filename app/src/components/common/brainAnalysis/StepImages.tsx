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
  // Use a ref to persist the loading state across renders
  const loadingImagesRef = useRef<boolean[]>([]);

  useEffect(() => {
    if (currentStep.images?.length) {
      // Initialize loading state only when images change
      loadingImagesRef.current = new Array(currentStep.images.length).fill(
        true
      );
    }
  }, [currentStep.images]);

  const handleImageLoad = (index: number) => {
    setTimeout(() => {
      // Update the ref and force a re-render by using state if necessary
      loadingImagesRef.current[index] = false;
    });
  };

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {currentStep.images?.map((imgSrc, index) => (
        <div key={index} className="relative">
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

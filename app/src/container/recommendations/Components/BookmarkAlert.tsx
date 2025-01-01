import React, { useEffect } from "react";

interface BookmarkAlertProps {
  isBookmarked: boolean;
  onDismiss: () => void; // Added dismiss function
}

const BookmarkAlert: React.FC<BookmarkAlertProps> = ({
  isBookmarked,
  onDismiss
}) => {
  // Automatically close the alert after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 3000);

    return () => clearTimeout(timer); // Cleanup the timer when the component is unmounted
  }, [onDismiss]);

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 p-4 w-full max-w-sm bg-gray-50 border border-gray-200 dark:bg-light dark:border-defaultborder/10 ${
        isBookmarked ? "bg-green-50" : "bg-red-50"
      }`}
      role="alert"
    >
      <div className="flex">
        <div className="sm:flex-shrink-0">
          <svg
            className={`h-4 w-4 mt-0.5 ${
              isBookmarked ? "text-green-500" : "text-red-500"
            }`}
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path
              d={
                isBookmarked
                  ? "M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"
                  : "M8 0a8 8 0 1 0 8 8A8 8 0 0 0 8 0zm0 14a6 6 0 1 1 6-6 6 6 0 0 1-6 6zm1-8a1 1 0 1 0 2 0 1 1 0 0 0-2 0zm-2 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0z"
              }
            />
          </svg>
        </div>
        <div className="flex-1 md:flex md:justify-between ms-2">
          <p
            className={`text-sm dark:text-defaulttextcolor/70 ${
              isBookmarked ? "text-green-800" : "text-red-800"
            }`}
          >
            {isBookmarked
              ? "Your movie has been saved to your favorites!"
              : "This movie has been removed from your favorites!"}
          </p>
          <p className="text-sm mt-3 md:mt-0 md:ms-6">
            <a
              className="dark:text-defaulttextcolor/70 hover:text-gray-500 font-medium whitespace-nowrap"
              href="#"
            >
              Details
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookmarkAlert;

import { FC, useState, useEffect } from "react";
import {
  Recommendation,
  WatchlistRecommendation
} from "../individualStats-types";

interface RecommendationCardAlertProps {
  selectedItem: Recommendation | WatchlistRecommendation | null;
  onClose: () => void;
}

const RecommendationCardAlert: FC<RecommendationCardAlertProps> = ({
  selectedItem,
  onClose
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (selectedItem) {
      setVisible(true); // Show the alert when a new item is selected
    }
  }, [selectedItem]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // Match animation duration
  };

  if (!selectedItem) return null;

  const getTranslatedType = (type: string) => {
    switch (type) {
      case "movie":
        return "филм";
      case "series":
        return "сериал";
      default:
        return type;
    }
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50 transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`p-6 rounded-lg shadow-lg bg-[rgb(var(--body-bg))] glow-effect border-2 dark:border-white border-secondary text-center w-96 transform transition-transform duration-300 ${
          visible ? "scale-100" : "scale-75"
        }`}
      >
        <h2 className="text-xl font-bold mb-4">{selectedItem.title_bg}</h2>
        <p className="text-lg mb-6">
          Type: {getTranslatedType(selectedItem.type)}
        </p>
        <button
          className="px-6 py-3 bg-white dark:text-black text-secondary font-bold rounded-lg hover:bg-gray-200 transition-colors"
          onClick={handleClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default RecommendationCardAlert;

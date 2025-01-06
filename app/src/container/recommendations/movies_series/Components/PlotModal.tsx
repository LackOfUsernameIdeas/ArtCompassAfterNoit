import { FC } from "react";
import { PlotModalProps } from "../recommendations-types";

export const PlotModal: FC<PlotModalProps> = ({
  recommendationList,
  currentIndex,
  closeModal
}) => {
  if (!recommendationList.length) {
    return <div>No recommendations available.</div>;
  }

  const movie = recommendationList[currentIndex];

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black bg-opacity-70 z-40"></div>
      <div className="plot-modal">
        <h2 className="text-lg font-semibold">Пълен сюжет</h2>
        <p className="text-sm">{movie.description}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={closeModal}
            className="bg-primary text-white rounded-lg px-4 py-2 hover:bg-secondary transform transition-transform duration-200 hover:scale-105"
          >
            Затвори
          </button>
        </div>
      </div>
    </div>
  );
};

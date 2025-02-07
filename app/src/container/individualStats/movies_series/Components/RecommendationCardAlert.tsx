import { FC, useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { SiRottentomatoes } from "react-icons/si";
import { PlotModal } from "./PlotModal";
import {
  Rating,
  RecommendationCardAlertProps
} from "../moviesSeriesIndividualStats-types";
import {
  handleMovieSeriesBookmarkClick,
  translate
} from "../../../helper_functions_common";

const RecommendationCardAlert: FC<RecommendationCardAlertProps> = ({
  selectedItem,
  onClose,
  setBookmarkedMovies,
  setCurrentBookmarkStatus,
  setAlertVisible,
  bookmarkedMovies
}) => {
  const [translatedDirectors, setTranslatedDirectors] = useState<string>("");
  const [translatedWriters, setTranslatedWriters] = useState<string>("");
  const [translatedActors, setTranslatedActors] = useState<string>("");
  const [translatedAwards, setTranslatedAwards] = useState<string>("");

  const [visible, setVisible] = useState(false);
  const [isPlotModalOpen, setIsPlotModalOpen] = useState(false); // State to handle PlotModal visibility
  const plotPreviewLength = 70;

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

  const handleOpenPlotModal = () => {
    setIsPlotModalOpen(true); // Open PlotModal
  };

  const handleClosePlotModal = () => {
    setIsPlotModalOpen(false); // Close PlotModal
  };

  useEffect(() => {
    if (selectedItem?.director !== null) {
      async function fetchDirectorTranslation() {
        const translated =
          selectedItem?.director && (await translate(selectedItem.director));
        translated && setTranslatedDirectors(translated);
      }
      fetchDirectorTranslation();
    }
  }, [selectedItem?.director]);

  useEffect(() => {
    if (selectedItem?.writer) {
      async function fetchWriterTranslation() {
        const translated =
          selectedItem?.writer && (await translate(selectedItem.writer));
        translated && setTranslatedWriters(translated);
      }
      fetchWriterTranslation();
    }
  }, [selectedItem?.writer]);

  useEffect(() => {
    if (selectedItem?.actors) {
      async function fetchActorsTranslation() {
        const translated =
          selectedItem?.actors && (await translate(selectedItem.actors));
        translated && setTranslatedActors(translated);
      }
      fetchActorsTranslation();
    }
  }, [selectedItem?.actors]);

  useEffect(() => {
    if (selectedItem?.awards) {
      async function fetchAwardsTranslation() {
        const translated =
          selectedItem?.awards && (await translate(selectedItem.awards));
        translated && setTranslatedAwards(translated);
      }
      fetchAwardsTranslation();
    }
  }, [selectedItem?.awards]);

  if (!selectedItem) return null;

  const translatedGenres = selectedItem.genre_bg || "Жанр неизвестен";
  const ratings: Rating[] = Array.isArray(selectedItem.ratings)
    ? selectedItem.ratings
    : JSON.parse(selectedItem.ratings || "[]"); // Parse ratings if it's a string

  console.log("ratings: ", ratings);
  const rottenTomatoesRating = Array.isArray(ratings)
    ? ratings.find((rating) => rating.Source === "Rotten Tomatoes")?.Value ||
      "N/A"
    : "N/A";

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50 transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`p-6 rounded-lg shadow-lg bg-[rgb(var(--body-bg))] glow-effect border-2 dark:border-white border-secondary text-center max-w-full transform transition-transform duration-300 ${
          visible ? "scale-100" : "scale-75"
        } md:w-[75%] lg:w-[85%] xl:w-[70%] 2xl:w-[50%]`}
      >
        <div className="recommendation-card">
          <div className="flex items-center justify-between">
            <div className="relative flex-shrink-0 w-full md:w-1/3">
              <img
                src={selectedItem.poster}
                alt={`${selectedItem.title_bg || "Movie"} Poster`}
                className="rounded-lg w-full h-auto"
              />
              <button
                onClick={() =>
                  handleMovieSeriesBookmarkClick(
                    selectedItem,
                    setBookmarkedMovies,
                    setCurrentBookmarkStatus,
                    setAlertVisible
                  )
                }
                className="absolute top-4 left-4 p-2 text-[#FFCC33] bg-black/50 bg-opacity-60 rounded-full transition-all duration-300 transform hover:scale-110 z-20"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="35"
                  height="35"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  {bookmarkedMovies[selectedItem.imdbID] ? (
                    <>
                      <path d="M18 2H6c-1.103 0-2 .897-2 2v18l8-4.572L20 22V4c0-1.103-.897-2-2-2zm0 16.553L12 15.125 6 18.553V4h12v14.553z"></path>
                      <path d="M6 18.553V4h12v14.553L12 15.125l-6 3.428z"></path>
                    </>
                  ) : (
                    <path d="M18 2H6c-1.103 0-2 .897-2 2v18l8-4.572L20 22V4c0-1.103-.897-2-2-2zm0 16.553-6-3.428-6 3.428V4h12v14.553z"></path>
                  )}
                </svg>
              </button>
            </div>

            <div className="flex-grow w-full md:w-2/3 text-left ml-8">
              <div className="top-0 z-10 pb-4 mb-4">
                <a
                  href="#"
                  className="block text-2xl sm:text-xl md:text-2xl font-bold mb-1"
                >
                  {selectedItem.title_bg || "Заглавие не е налично"}
                </a>
                <a
                  href="#"
                  className="block text-md sm:text-sm md:text-lg font-semibold text-opacity-60 italic mb-2"
                >
                  {selectedItem.title_en ||
                    "Заглавие на английски не е налично"}
                </a>
                <p className="recommendation-small-details text-sm sm:text-xs md:text-sm">
                  {translatedGenres} |{" "}
                  {selectedItem.year || "Година неизвестна"} | Рейтинг:{" "}
                  {selectedItem.rated || "N/A"}
                </p>
                <div className="flex items-center space-x-8 mb-4">
                  <div
                    className="flex items-center space-x-2"
                    title="IMDb рейтинг: Базиран на отзиви и оценки от потребители."
                  >
                    <FaStar className="dark:text-[#FFCC33] text-[#bf9413] w-[2rem] h-[2rem] sm:w-[2rem] sm:h-[2rem] md:w-[2.2rem] md:h-[2.2rem]" />
                    <span className="dark:text-[#FFCC33] text-[#bf9413] font-bold text-md sm:text-sm md:text-lg leading-none">
                      {selectedItem.imdbRating || "N/A"}
                    </span>
                  </div>

                  <div
                    className="flex items-center space-x-2"
                    title="Метаскор: Средно претеглена оценка от критически рецензии за филма."
                  >
                    <div
                      className={`flex items-center justify-center rounded-md text-white ${
                        parseInt(selectedItem.metascore) >= 60
                          ? "bg-[#54A72A]"
                          : parseInt(selectedItem.metascore) >= 40
                          ? "bg-[#FFCC33]"
                          : "bg-[#FF0000]"
                      }`}
                      style={{ width: "2.2rem", height: "2.2rem" }}
                    >
                      <span
                        className={`${
                          selectedItem.metascore === "N/A" ||
                          !selectedItem.metascore
                            ? "text-sm"
                            : "text-xl"
                        }`}
                      >
                        {selectedItem.metascore || "N/A"}
                      </span>
                    </div>
                    <span className="font-semibold text-md sm:text-sm md:text-lg">
                      Метаскор
                    </span>
                  </div>

                  <div
                    className="flex items-center space-x-2"
                    title="Rotten Tomatoes рейтинг: Процент положителни рецензии от професионални критици."
                  >
                    <SiRottentomatoes className="text-[#FF0000] w-[2rem] h-[2rem] sm:w-[2rem] sm:h-[2rem] md:w-[2.2rem] md:h-[2.2rem]" />
                    <span className="text-red-400 font-semibold text-md sm:text-sm md:text-lg">
                      {rottenTomatoesRating}
                    </span>
                  </div>
                </div>
              </div>

              {selectedItem.reason && (
                <div className="mb-4">
                  <h3 className="text-lg sm:text-md md:text-lg font-semibold mb-2">
                    Защо препоръчваме {selectedItem.title_bg}?
                  </h3>
                  <p className="text-opacity-80 italic text-sm sm:text-xs md:text-sm">
                    {selectedItem.reason}
                  </p>
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-lg sm:text-md md:text-lg font-semibold mb-2">
                  Сюжет
                </h3>
                <div className="overflow-hidden transition-all duration-500 ease-in-out max-h-[1.3rem] opacity-70">
                  <p className="text-opacity-80 italic text-sm sm:text-xs md:text-sm">
                    {selectedItem.description.length > plotPreviewLength
                      ? `${selectedItem.description.substring(
                          0,
                          plotPreviewLength
                        )}...`
                      : selectedItem.description}
                  </p>
                </div>
                {selectedItem.description &&
                  selectedItem.description.length > plotPreviewLength && (
                    <button
                      onClick={handleOpenPlotModal}
                      className="mt-2 underline text-sm sm:text-xs md:text-sm"
                    >
                      Пълен сюжет
                    </button>
                  )}
              </div>

              <div className="mb-4">
                <h3 className="text-lg sm:text-md md:text-lg font-semibold mb-2">
                  Допълнителна информация
                </h3>
                <ul className="text-opacity-80 space-y-1">
                  <li>
                    <strong className="text-primary">Режисьор:</strong>{" "}
                    {translatedDirectors && translatedDirectors !== "N/A"
                      ? translatedDirectors
                      : "Неизвестен"}
                  </li>
                  <li>
                    <strong className="text-primary">Сценаристи:</strong>{" "}
                    {translatedWriters && translatedWriters !== "N/A"
                      ? translatedWriters
                      : "Неизвестни"}
                  </li>
                  <li>
                    <strong className="text-primary">Актьори:</strong>{" "}
                    {translatedActors && translatedActors !== "N/A"
                      ? translatedActors
                      : "Неизвестни"}
                  </li>
                  <li>
                    <strong className="text-primary">Награди:</strong>{" "}
                    {translatedAwards && translatedAwards !== "N/A"
                      ? translatedAwards
                      : "Няма"}
                  </li>
                  <li>
                    <strong className="text-primary">Боксофис:</strong>{" "}
                    {selectedItem.boxOffice === "$0"
                      ? "N/A"
                      : selectedItem.boxOffice || "N/A"}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-[#FFCC33] bg-opacity-60 rounded-full transition-transform duration-300 transform hover:scale-110 z-10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="50"
            height="50"
            viewBox="0 0 48 48"
          >
            <linearGradient
              id="hbE9Evnj3wAjjA2RX0We2a_OZuepOQd0omj_gr1"
              x1="7.534"
              x2="27.557"
              y1="7.534"
              y2="27.557"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stop-color="#f44f5a"></stop>
              <stop offset=".443" stop-color="#ee3d4a"></stop>
              <stop offset="1" stop-color="#e52030"></stop>
            </linearGradient>
            <path
              fill="url(#hbE9Evnj3wAjjA2RX0We2a_OZuepOQd0omj_gr1)"
              d="M42.42,12.401c0.774-0.774,0.774-2.028,0-2.802L38.401,5.58c-0.774-0.774-2.028-0.774-2.802,0	L24,17.179L12.401,5.58c-0.774-0.774-2.028-0.774-2.802,0L5.58,9.599c-0.774,0.774-0.774,2.028,0,2.802L17.179,24L5.58,35.599	c-0.774,0.774-0.774,2.028,0,2.802l4.019,4.019c0.774,0.774,2.028,0.774,2.802,0L42.42,12.401z"
            ></path>
            <linearGradient
              id="hbE9Evnj3wAjjA2RX0We2b_OZuepOQd0omj_gr2"
              x1="27.373"
              x2="40.507"
              y1="27.373"
              y2="40.507"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stop-color="#a8142e"></stop>
              <stop offset=".179" stop-color="#ba1632"></stop>
              <stop offset=".243" stop-color="#c21734"></stop>
            </linearGradient>
            <path
              fill="url(#hbE9Evnj3wAjjA2RX0We2b_OZuepOQd0omj_gr2)"
              d="M24,30.821L35.599,42.42c0.774,0.774,2.028,0.774,2.802,0l4.019-4.019	c0.774-0.774,0.774-2.028,0-2.802L30.821,24L24,30.821z"
            ></path>
          </svg>
        </button>
      </div>
      <PlotModal
        isOpen={isPlotModalOpen}
        onClose={handleClosePlotModal}
        plot={selectedItem.description}
      />
    </div>
  );
};

export default RecommendationCardAlert;

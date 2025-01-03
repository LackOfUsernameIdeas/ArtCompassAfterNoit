import { FC, useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { SiRottentomatoes } from "react-icons/si";
import { RecommendationCardProps } from "../recommendations-types";
import { translate } from "../helper_functions";

const RecommendationCard: FC<RecommendationCardProps> = ({
  recommendationList,
  currentIndex,
  openModal,
  handleBookmarkClick,
  bookmarkedMovies
}) => {
  const [translatedDirectors, setTranslatedDirectors] = useState<string>("");
  const [translatedWriters, setTranslatedWriters] = useState<string>("");
  const [translatedActors, setTranslatedActors] = useState<string>("");
  const [translatedAwards, setTranslatedAwards] = useState<string>("");
  const [translatedGenres, setTranslatedGenres] = useState<string>("");
  const plotPreviewLength = 110;

  if (!recommendationList.length) {
    return <div>No recommendations available.</div>;
  }

  const recommendation = recommendationList[currentIndex];
  const rottenTomatoesRating =
    recommendation.ratings?.find(
      (rating) => rating.Source === "Rotten Tomatoes"
    )?.Value || "N/A";

  useEffect(() => {
    async function fetchDirectorTranslation() {
      const translated = await translate(recommendation.director);
      setTranslatedDirectors(translated);
    }

    fetchDirectorTranslation();
  }, [recommendation.director]);

  useEffect(() => {
    async function fetchWriterTranslation() {
      const translated = await translate(recommendation.writer);
      setTranslatedWriters(translated);
    }

    fetchWriterTranslation();
  }, [recommendation.writer]);

  useEffect(() => {
    async function fetchActorsTranslation() {
      const translated = await translate(recommendation.actors);
      setTranslatedActors(translated);
    }

    fetchActorsTranslation();
  }, [recommendation.actors]);

  useEffect(() => {
    async function fetchAwardsTranslation() {
      const translated = await translate(recommendation.awards);
      setTranslatedAwards(translated);
    }

    fetchAwardsTranslation();
  }, [recommendation.awards]);

  useEffect(() => {
    async function fetchGenresTranslation() {
      const translated = await translate(recommendation.genre);
      setTranslatedGenres(translated);
    }

    fetchGenresTranslation();
  }, [recommendation.genre]);

  return (
    <div className="recommendation-card">
      <div className="flex w-full items-center">
        <div className="relative flex-shrink-0 mr-8">
          <img
            src={recommendation.poster}
            alt={`${recommendation.bgName || "Movie"} Poster`}
            className="rounded-lg w-96 h-auto"
          />
          <button
            onClick={() => handleBookmarkClick(recommendation)}
            className="absolute top-4 left-4 p-2 text-[#FFCC33] bg-black/50 bg-opacity-60 rounded-full transition-all duration-300 transform hover:scale-110"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="35"
              height="35"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              {bookmarkedMovies[recommendation.imdbID] ? (
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

        <div className="flex-grow">
          <div className="sticky top-0 z-10 pb-4 mb-4">
            <a href="#" className="block text-3xl font-bold mb-1">
              {recommendation.bgName || "Заглавие не е налично"}
            </a>
            <a
              href="#"
              className="block text-lg font-semibold text-opacity-60 italic mb-2"
            >
              {recommendation.title || "Заглавие на английски не е налично"}
            </a>
            <p className="recommendation-small-details">
              {translatedGenres || "Жанр неизвестен"} |{" "}
              {recommendation.year || "Година неизвестна"} | Рейтинг:{" "}
              {recommendation.rated || "N/A"}
            </p>
            <div className="flex items-center space-x-8 mb-4">
              <div
                className="flex items-center space-x-2"
                title="IMDb рейтинг: Базиран на отзиви и оценки от потребители."
              >
                <FaStar className="dark:text-[#FFCC33] text-[#bf9413] w-8 h-8" />
                <span className="dark:text-[#FFCC33] text-[#bf9413] font-bold text-lg">
                  {recommendation.imdbRating || "N/A"}
                </span>
              </div>
              <div
                className="flex items-center space-x-2"
                title="Метаскор: Средно претеглена оценка от критически рецензии за филма."
              >
                <div
                  className={`flex items-center justify-center rounded-md text-white ${
                    parseInt(recommendation.metascore) >= 60
                      ? "bg-[#54A72A]"
                      : parseInt(recommendation.metascore) >= 40
                      ? "bg-[#FFCC33]"
                      : "bg-[#FF0000]"
                  }`}
                  style={{ width: "35px", height: "35px" }}
                >
                  <span
                    className={`${
                      recommendation.metascore === "N/A" ||
                      !recommendation.metascore
                        ? "text-sm"
                        : "text-xl"
                    }`}
                  >
                    {recommendation.metascore || "N/A"}
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
                <SiRottentomatoes className="text-[#FF0000] w-8 h-8" />
                <span className="text-red-400 font-semibold text-md sm:text-sm md:text-lg">
                  {rottenTomatoesRating}
                </span>
              </div>
            </div>
          </div>

          {recommendation.reason && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">
                Защо препоръчваме {recommendation.bgName}?
              </h3>
              <p className="text-opacity-80 italic">{recommendation.reason}</p>
            </div>
          )}

          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Сюжет</h3>
            <div className="overflow-hidden transition-all duration-500 ease-in-out max-h-[20px] opacity-70">
              <p className="text-opacity-80 italic">
                {recommendation.description.length > plotPreviewLength
                  ? `${recommendation.description.substring(
                      0,
                      plotPreviewLength
                    )}...`
                  : recommendation.description}
              </p>
            </div>

            {recommendation.description &&
              recommendation.description.length > plotPreviewLength && (
                <button onClick={openModal} className="mt-2 underline">
                  Пълен сюжет
                </button>
              )}
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">
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
                {recommendation.boxOffice || "N/A"}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;

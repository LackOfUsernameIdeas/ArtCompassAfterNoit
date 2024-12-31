import { FC, useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { SiRottentomatoes } from "react-icons/si";
import { MovieCardProps } from "../recommendations-types";
import { translate } from "../helper_functions";

export const MovieCard: FC<MovieCardProps> = ({
  recommendationList,
  currentIndex,
  openModal
}) => {
  const [translatedDirector, setTranslatedDirector] = useState<string>("");
  const [translatedWriters, setTranslatedWriters] = useState<string>("");
  const [translatedActors, setTranslatedActors] = useState<string>("");
  const [translatedAwards, setTranslatedAwards] = useState<string>("");
  const [translatedGenres, setTranslatedGenres] = useState<string>("");
  const plotPreviewLength = 110;

  if (!recommendationList.length) {
    return <div>No recommendations available.</div>;
  }

  const movie = recommendationList[currentIndex];
  const rottenTomatoesRating =
    movie.ratings?.find((rating) => rating.Source === "Rotten Tomatoes")
      ?.Value || "N/A";

  useEffect(() => {
    async function fetchDirectorTranslation() {
      const translated = await translate(movie.director);
      setTranslatedDirector(translated);
    }

    fetchDirectorTranslation();
  }, [movie.director]);

  useEffect(() => {
    async function fetchWriterTranslation() {
      const translated = await translate(movie.writer);
      setTranslatedWriters(translated);
    }

    fetchWriterTranslation();
  }, [movie.writer]);

  useEffect(() => {
    async function fetchActorsTranslation() {
      const translated = await translate(movie.actors);
      setTranslatedActors(translated);
    }

    fetchActorsTranslation();
  }, [movie.actors]);

  useEffect(() => {
    async function fetchAwardsTranslation() {
      const translated = await translate(movie.awards);
      setTranslatedAwards(translated);
    }

    fetchAwardsTranslation();
  }, [movie.awards]);

  useEffect(() => {
    async function fetchGenresTranslation() {
      const translated = await translate(movie.genre);
      setTranslatedGenres(translated);
    }

    fetchGenresTranslation();
  }, [movie.genre]);

  return (
    <div className="movie-card">
      <div className="flex w-full items-center">
        <div className="relative flex-shrink-0 mr-8">
          <img
            src={movie.poster}
            alt={`${movie.bgName || "Movie"} Poster`}
            className="rounded-lg w-96 h-auto"
          />
          <button
            style={{
              backgroundColor: "#1a1a1a", // Dark background color
              color: "white", // White for the plus sign
              width: "160px", // Increased width
              height: "200px", // Increased height
              position: "absolute",
              top: "1rem", // Sticking to the very top
              left: "1rem", // Sticking to the very left
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              clipPath:
                "polygon(24% 0%, 0% 0%, 0% 32%, 12.24% 26.29%, 24% 31.77%)", // Shape using provided points
              border: "none",
              cursor: "pointer"
            }}
            className="border border-solid border-defaultborder dark:border-defaultborder/10"
            onClick={() => alert("Added to Watch List!")}
            title="Add to Watch List"
          >
            +
          </button>
        </div>

        <div className="flex-grow">
          <div className="sticky top-0 z-10 pb-4 mb-4">
            <a href="#" className="block text-3xl font-bold mb-1">
              {movie.bgName || "Заглавие не е налично"}
            </a>
            <a
              href="#"
              className="block text-lg font-semibold text-opacity-60 italic mb-2"
            >
              {movie.title || "Заглавие на английски не е налично"}
            </a>
            <p className="movie-small-details">
              {translatedGenres || "Жанр неизвестен"} |{" "}
              {movie.year || "Година неизвестна"} | Рейтинг:{" "}
              {movie.rated || "N/A"}
            </p>
            <div className="flex items-center space-x-8 mb-4">
              <div
                className="flex items-center space-x-2"
                title="IMDb рейтинг: Базиран на отзиви и оценки от потребители."
              >
                <FaStar className="dark:text-[#FFCC33] text-[#bf9413] w-8 h-8" />
                <span className="dark:text-[#FFCC33] text-[#bf9413] font-bold text-lg">
                  {movie.imdbRating || "N/A"}
                </span>
              </div>
              <div
                className="flex items-center space-x-2"
                title="Метаскор: Средно претеглена оценка от критически рецензии за филма."
              >
                <div
                  className={`flex items-center justify-center rounded-md text-white ${
                    parseInt(movie.metascore) >= 60
                      ? "bg-[#54A72A]"
                      : parseInt(movie.metascore) >= 40
                      ? "bg-[#FFCC33]"
                      : "bg-[#FF0000]"
                  }`}
                  style={{ width: "35px", height: "35px" }}
                >
                  <span
                    className={`${
                      movie.metascore === "N/A" || !movie.metascore
                        ? "text-sm"
                        : "text-xl"
                    }`}
                  >
                    {movie.metascore || "N/A"}
                  </span>
                </div>
                <span className="font-semibold">Метаскор</span>
              </div>
              <div
                className="flex items-center space-x-2"
                title="Rotten Tomatoes рейтинг: Процент положителни рецензии от професионални критици."
              >
                <SiRottentomatoes className="text-[#FF0000] w-8 h-8" />
                <span className="text-red-400 font-semibold">
                  {rottenTomatoesRating}
                </span>
              </div>
            </div>
          </div>

          {movie.reason && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">
                Защо препоръчваме {movie.bgName}?
              </h3>
              <p className="text-opacity-80 italic">{movie.reason}</p>
            </div>
          )}

          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Сюжет</h3>
            <div className="overflow-hidden transition-all duration-500 ease-in-out max-h-[20px] opacity-70">
              <p className="text-opacity-80 italic">
                {movie.description.length > plotPreviewLength
                  ? `${movie.description.substring(0, plotPreviewLength)}...`
                  : movie.description}
              </p>
            </div>

            {movie.description &&
              movie.description.length > plotPreviewLength && (
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
                {translatedDirector && translatedDirector !== "N/A"
                  ? translatedDirector
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
                {movie.boxOffice || "N/A"}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

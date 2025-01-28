import { FC, useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import {
  BookFormat,
  RecommendationCardProps
} from "../../booksRecommendations-types";
import Genres from "./Genres";
import AwardsSection from "./Awards";
import { handleBookmarkClick } from "../../helper_functions";

const RecommendationCard: FC<RecommendationCardProps> = ({
  recommendationList,
  currentIndex,
  openModal,
  setBookmarkedBooks,
  setCurrentBookmarkStatus,
  setAlertVisible,
  bookmarkedBooks
}) => {
  const [description, setDescription] = useState<string | null>(null);
  const [author, setAuthor] = useState<string | null>(null);
  const [language, setLanguage] = useState<string | null>(null);
  const [genres, setGenres] = useState<string[]>([]);
  const plotPreviewLength = 150;

  const recommendation = recommendationList[currentIndex];
  const source = recommendation.source;
  const isGoodreads = source === "Goodreads";
  useEffect(() => {
    const resolveDescription = async () => {
      if (recommendation.description instanceof Promise) {
        const resolvedDescription = await recommendation.description;
        setDescription(resolvedDescription);
      } else {
        setDescription(recommendation.description);
      }
    };

    resolveDescription();
  }, [recommendation.description]);

  useEffect(() => {
    const resolveAuthor = async () => {
      if (recommendation.author instanceof Promise) {
        const resolvedAuthor = await recommendation.author;
        setAuthor(resolvedAuthor);
      } else {
        setAuthor(recommendation.author);
      }
    };

    resolveAuthor();
  }, [recommendation.author]);

  useEffect(() => {
    const resolveLanguage = async () => {
      if (recommendation.language instanceof Promise) {
        const resolvedLanguage = await recommendation.language;
        setLanguage(resolvedLanguage);
      } else {
        setLanguage(recommendation.language);
      }
    };

    resolveLanguage();
  }, [recommendation.language]);

  useEffect(() => {
    const resolveGenres = async () => {
      let resolvedGenres;

      try {
        if (recommendation.genres_bg instanceof Promise) {
          resolvedGenres = await recommendation.genres_bg;
        } else {
          resolvedGenres = recommendation.genres_bg;
        }

        if (isGoodreads) {
          if (typeof resolvedGenres === "string") {
            const genreStrings = resolvedGenres
              .split(",")
              .map((genre) => genre.trim());
            setGenres(genreStrings);
          } else {
            console.warn(
              "Unexpected format for Goodreads genres_bg:",
              resolvedGenres
            );
          }
        } else if (source === "Google Books") {
          if (typeof resolvedGenres === "object" && resolvedGenres !== null) {
            const genreEntries = Object.entries(resolvedGenres);
            const genreStrings = genreEntries.map(([category, subGenres]) => {
              return `${category}: ${
                Array.isArray(subGenres)
                  ? subGenres.join(", ")
                  : subGenres || "Няма поджанрове"
              }`;
            });
            setGenres(genreStrings);
          } else {
            console.warn(
              "Unexpected format for GoogleBooks genres_bg:",
              resolvedGenres
            );
          }
        } else {
          console.error("Unknown source type:", source);
        }
      } catch (error) {
        console.error("Error resolving genres_bg:", error);
        setGenres([]);
      }
    };

    resolveGenres();
  }, [recommendation.genres_bg]);

  return (
    <div className="recommendation-card">
      <div className="flex w-full items-start">
        <div className="relative flex-shrink-0 mr-8 flex flex-col items-center">
          <img
            src={recommendation.imageLink}
            alt={`${recommendation.title_bg || "Book"} Poster`}
            className="rounded-lg w-[15rem] h-auto"
          />
          <button
            onClick={() =>
              handleBookmarkClick(
                recommendation,
                setBookmarkedBooks,
                setCurrentBookmarkStatus,
                setAlertVisible
              )
            }
            className="absolute top-4 left-4 p-2 text-[#FFCC33] bg-black/50 bg-opacity-60 rounded-full transition-all duration-300 transform hover:scale-110"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="35"
              height="35"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              {bookmarkedBooks[
                recommendation.google_books_id || recommendation.goodreads_id
              ] ? (
                <>
                  <path d="M18 2H6c-1.103 0-2 .897-2 2v18l8-4.572L20 22V4c0-1.103-.897-2-2-2zm0 16.553L12 15.125 6 18.553V4h12v14.553z"></path>
                  <path d="M6 18.553V4h12v14.553L12 15.125l-6 3.428z"></path>
                </>
              ) : (
                <path d="M18 2H6c-1.103 0-2 .897-2 2v18l8-4.572L20 22V4c0-1.103-.897-2-2-2zm0 16.553-6-3.428-6 3.428V4h12v14.553z"></path>
              )}
            </svg>
          </button>
          {isGoodreads && (
            <div>
              <strong className="text-xl text-defaulttextcolor/85 block text-center">
                Герои:
              </strong>
              <div className="mt-5">
                {recommendation.characters ? (
                  <ul className="list-disc list-inside">
                    {recommendation.characters
                      .split(", ")
                      .map((character, index) => (
                        <li key={index}>
                          <span className="text-sm font-semibold text-defaulttextcolor/70">
                            {character}
                          </span>
                        </li>
                      ))}
                  </ul>
                ) : (
                  <p className="text-center">Няма информация за героите</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex-grow flex flex-col justify-between">
          <div className="flex-grow flex flex-col justify-between">
            <div className="grid grid-cols-2 gap-8">
              <div className="mb-2">
                <a href="#" className="block text-3xl font-bold">
                  {recommendation.title_bg || "Заглавие не е налично"}
                </a>
                <a
                  href="#"
                  className="block text-lg font-semibold text-opacity-60 italic mb-2"
                >
                  {recommendation.title_en ||
                    "Заглавие на английски не е налично"}
                </a>
                <p className="text-sm italic text-defaulttextcolor/70">
                  {author || "Неизвестен автор"},{" "}
                  {recommendation.page_count || "неизвестен брой"} страници
                </p>
              </div>

              <div className="mb-4">
                {isGoodreads && (
                  <div>
                    <strong className="text-xl text-defaulttextcolor/85">
                      Част от поредица:
                    </strong>
                    <p className="text-base italic text-defaulttextcolor/70 mb-2">
                      {recommendation.series || "Не"}
                    </p>
                  </div>
                )}
                <strong className="text-xl text-defaulttextcolor/85">
                  Адаптации:
                </strong>
                <p className="text-base italic text-defaulttextcolor/70">
                  {recommendation.adaptations ||
                    "Няма налична информация за адаптации :("}
                </p>
              </div>
            </div>
          </div>

          <Genres genres={genres} />
          <div className="flex items-center space-x-8">
            <div
              className="flex dark:text-[#FFCC33] text-[#bf9413] items-center space-x-2"
              title="Goodreads рейтинг: Базиран на отзиви и оценки от потребители."
            >
              <span className="font-bold text-lg">Рейтинг в Goodreads:</span>
              <FaStar className="w-6 h-6" />
              <span className="font-bold text-lg">
                {recommendation.goodreads_rating || "N/A"}{" "}
                {isGoodreads &&
                  `/ ${recommendation.goodreads_ratings_count.toLocaleString(
                    "bg-BG"
                  )} гласа`}
              </span>
            </div>
          </div>
          <span className="italic text-sm mb-4 dark:text-[#FFCC33]/70 text-[#bf9413]">
            {isGoodreads &&
              `Общо ${recommendation.goodreads_reviews_count.toLocaleString(
                "bg-BG"
              )} ревюта в Goodreads`}
          </span>
          {recommendation.reason && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">
                Защо препоръчваме{" "}
                {recommendation.title_bg || "Заглавие не е налично"}?
              </h3>
              <p className="text-opacity-80 italic">{recommendation.reason}</p>
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold mb-2">Описание</h3>
            <div className="overflow-hidden transition-all duration-500 ease-in-out max-h-[3rem] opacity-70">
              <p className="text-opacity-80 italic">
                {description && description.length > plotPreviewLength
                  ? `${description.substring(0, plotPreviewLength)}...`
                  : description}
              </p>
            </div>

            {description && description.length > plotPreviewLength && (
              <button
                onClick={openModal}
                className="mt-2 underline hover:scale-105 transition"
              >
                Пълно описание
              </button>
            )}
          </div>
          {isGoodreads && <AwardsSection recommendation={recommendation} />}
          <div className="mt-2">
            <h3 className="text-lg font-semibold mb-2">
              Допълнителна информация:
            </h3>
            <ul className="flex flex-wrap gap-x-4 text-opacity-80">
              <li>
                <strong className="text-primary">Произход:</strong>{" "}
                {recommendation.origin || "Неизвестен"}
              </li>
              <li>
                <strong className="text-primary">Език:</strong>{" "}
                {language || "Неизвестен"}
              </li>
              {isGoodreads && (
                <li>
                  <strong className="text-primary">Вид:</strong>{" "}
                  {recommendation.book_format
                    ? BookFormat[
                        recommendation.book_format as keyof typeof BookFormat
                      ]
                    : "Няма информация"}
                </li>
              )}
              {isGoodreads && (
                <li>
                  <strong className="text-primary">Местообстановка:</strong>{" "}
                  {recommendation.setting || "Неизвестна"}
                </li>
              )}
              <li>
                <strong className="text-primary">Издателство:</strong>{" "}
                {recommendation.publisher || "Неизвестно"}
              </li>
              <li>
                <strong className="text-primary">
                  Година на публикуване на първо издание:
                </strong>{" "}
                {recommendation.date_of_first_issue || "Неизвестна"}
              </li>
              <li>
                <strong className="text-primary">
                  Дата на публикуване на това издание:
                </strong>{" "}
                {recommendation.date_of_issue || "Неизвестна"}
              </li>

              <li>
                <strong className="text-primary">ISBN_10 (ISBN_13):</strong>{" "}
                {`${recommendation.ISBN_10 || "N/A"} (${
                  recommendation.ISBN_13 || "N/A"
                })`}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;

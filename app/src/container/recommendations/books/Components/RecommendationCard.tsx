import { FC, useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { SiRottentomatoes } from "react-icons/si";
import { RecommendationCardProps } from "../booksRecommendations-types";
import { translate } from "../../../helper_functions_common";

const RecommendationCard: FC<RecommendationCardProps> = ({
  recommendationList,
  currentIndex,
  openModal,
  handleBookmarkClick,
  bookmarkedMovies
}) => {
  const [description, setDescription] = useState<string | null>(null);
  const [author, setAuthor] = useState<string | null>(null);
  const [language, setLanguage] = useState<string | null>(null);
  const [genres, setGenres] = useState<string[]>([]);
  const plotPreviewLength = 150;

  if (!recommendationList.length) {
    return <div>No recommendations available.</div>;
  }

  const recommendation = recommendationList[currentIndex];
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
      if (recommendation.genres_bg instanceof Promise) {
        const resolvedGenres = await recommendation.genres_bg;
        // Flatten the genres, assuming genres_bg contains categories of genres.
        const genreEntries = Object.entries(resolvedGenres); // [ [category, [sub-genres]] ]
        const genreStrings = genreEntries.map(([category, subGenres]) => {
          // Join the sub-genres with dashes
          return `${category}: ${
            Array.isArray(subGenres) ? subGenres.join(", ") : subGenres
          }`;
        });
        setGenres(genreStrings);
      } else {
        // If genres_bg is not a promise, handle it directly.
        const genreEntries = Object.entries(recommendation.genres_bg); // [ [category, [sub-genres]] ]
        const genreStrings = genreEntries.map(([category, subGenres]) => {
          // Join the sub-genres with dashes
          return `${category}: ${
            Array.isArray(subGenres) ? subGenres.join(", ") : subGenres
          }`;
        });
        setGenres(genreStrings);
      }
    };

    resolveGenres();
  }, [recommendation.genres_bg]);

  return (
    <div className="recommendation-card">
      <div className="flex w-full items-start">
        <div className="relative flex-shrink-0 mr-8">
          <img
            src={recommendation.imageLink}
            alt={`${recommendation.title_bg || "Book"} Poster`}
            className="rounded-lg w-[15rem] h-auto"
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
              {bookmarkedMovies[recommendation.google_books_id] ? (
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
          <div className="pb-4 mb-4">
            <a href="#" className="block text-3xl font-bold mb-1">
              {recommendation.title_bg || "Заглавие не е налично"}
            </a>
            <a
              href="#"
              className="block text-lg font-semibold text-opacity-60 italic mb-2"
            >
              {recommendation.title_en || "Заглавие на английски не е налично"}
            </a>
            <p className="recommendation-small-details">
              <strong>Жанрове:</strong>
              <ul>
                {genres.map((genre, index) => {
                  const [mainCategory, subGenres] = genre.split(": ");
                  return (
                    <li key={index}>
                      <span>- {mainCategory}</span>: <i>{subGenres}</i>
                    </li>
                  );
                })}
              </ul>
            </p>
          </div>

          <div className="flex items-center space-x-8 mb-4">
            <div
              className="flex items-center space-x-2"
              title="Goodreads рейтинг: Базиран на отзиви и оценки от потребители."
            >
              <FaStar className="dark:text-[#FFCC33] text-[#bf9413] w-8 h-8" />
              <span className="dark:text-[#FFCC33] text-[#bf9413] font-bold text-lg">
                {recommendation.goodreads_rating || "N/A"}
              </span>
            </div>
          </div>

          {recommendation.reason && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">
                Защо препоръчваме {recommendation.title_bg}?
              </h3>
              <p className="text-opacity-80 italic">{recommendation.reason}</p>
            </div>
          )}

          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Сюжет</h3>
            <div className="overflow-hidden transition-all duration-500 ease-in-out max-h-[3rem] opacity-70">
              <p className="text-opacity-80 italic">
                {description && description.length > plotPreviewLength
                  ? `${description.substring(0, plotPreviewLength)}...`
                  : description}
              </p>
            </div>

            {description && description.length > plotPreviewLength && (
              <button onClick={openModal} className="mt-2 underline">
                Пълен сюжет
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">
          Допълнителна <br /> информация:
        </h3>
        <ul className="text-opacity-80 grid grid-cols-3 gap-4">
          <li>
            <strong className="text-primary">Автор:</strong> {author || "N/A"}
          </li>
          <li>
            <strong className="text-primary">ISBN_10 (ISBN_13):</strong>{" "}
            {`${recommendation.ISBN_10 || "N/A"} (${
              recommendation.ISBN_13 || "N/A"
            })` || "N/A"}
          </li>
          <li>
            <strong className="text-primary">Адаптации:</strong>{" "}
            {recommendation.adaptations || "N/A"}
          </li>
          <li>
            <strong className="text-primary">
              Година на публикуване на първо издание:
            </strong>{" "}
            {recommendation.date_of_first_issue || "N/A"}
          </li>
          <li>
            <strong className="text-primary">
              Дата на публикуване на това издание:
            </strong>{" "}
            {recommendation.date_of_issue || "N/A"}
          </li>
          <li>
            <strong className="text-primary">Брой принтирани страници:</strong>{" "}
            {recommendation.page_count || "N/A"}
          </li>
          <li>
            <strong className="text-primary">Език:</strong> {language || "N/A"}
          </li>
          <li>
            <strong className="text-primary">Държава:</strong>{" "}
            {recommendation.country || "N/A"}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default RecommendationCard;

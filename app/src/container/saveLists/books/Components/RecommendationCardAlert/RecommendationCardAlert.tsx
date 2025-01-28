import { FC, useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { BookFormat } from "../../../../recommendations/books/booksRecommendations-types";
import { Recommendation } from "../../readlist-types";
import Genres from "./Genres";
import AwardsSection from "./Awards";
import { PlotModal } from "../PlotModal";
import {
  parseResolvedGenres,
  processGenresForGoodreads,
  processGenresForGoogleBooks
} from "../../helper_functions";

export interface RecommendationCardProps {
  selectedItem: Recommendation | null; // Списък с препоръчани книги
  onClose: () => void; // Функция за отваряне на модала
  handleBookmarkClick: (book: Recommendation) => void; // Функция за маркиране на книга
  bookmarkedBooks: { [key: string]: Recommendation }; // Списък с маркирани книги
}

const RecommendationCardAlert: FC<RecommendationCardProps> = ({
  selectedItem,
  onClose,
  handleBookmarkClick,
  bookmarkedBooks
}) => {
  const [description, setDescription] = useState<string>("");
  const [author, setAuthor] = useState<string | null>(null);
  const [language, setLanguage] = useState<string | null>(null);
  const [genres, setGenres] = useState<string[]>([]);
  const [isPlotModalOpen, setIsPlotModalOpen] = useState(false);
  const plotPreviewLength = 150;
  const source = selectedItem?.source;
  const isGoodreads = source === "Goodreads";
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

  const handleOpenPlotModal = () => {
    setIsPlotModalOpen(true); // Open PlotModal
  };

  const handleClosePlotModal = () => {
    setIsPlotModalOpen(false); // Close PlotModal
  };

  useEffect(() => {
    const resolveAuthor = async () => {
      if (selectedItem?.author) {
        try {
          const resolvedAuthor =
            typeof selectedItem.author === "string"
              ? selectedItem.author
              : await selectedItem.author;
          setAuthor(resolvedAuthor);
        } catch (error) {
          console.error("Error resolving author:", error);
          setAuthor(null);
        }
      } else {
        setAuthor(null);
      }
    };

    resolveAuthor();
  }, [selectedItem?.author]);

  useEffect(() => {
    const resolveDescription = async () => {
      if (selectedItem?.description) {
        try {
          const resolvedDescription =
            typeof selectedItem.description === "string"
              ? selectedItem.description
              : await selectedItem.description;
          setDescription(resolvedDescription);
        } catch (error) {
          console.error("Error resolving description:", error);
          setDescription("Няма описание");
        }
      } else {
        setDescription("Няма описание");
      }
    };

    resolveDescription();
  }, [selectedItem?.description]);

  useEffect(() => {
    const resolveLanguage = async () => {
      if (selectedItem?.language) {
        try {
          const resolvedLanguage =
            typeof selectedItem.language === "string"
              ? selectedItem.language
              : await selectedItem.language;
          setLanguage(resolvedLanguage);
        } catch (error) {
          console.error("Error resolving language:", error);
          setLanguage(null);
        }
      } else {
        setLanguage(null);
      }
    };

    resolveLanguage();
  }, [selectedItem?.language]);

  useEffect(() => {
    const resolveGenres = async () => {
      try {
        let resolvedGenres = selectedItem?.genre_bg;
        if (resolvedGenres instanceof Promise) {
          resolvedGenres = await resolvedGenres;
        }

        if (isGoodreads) {
          processGenresForGoodreads(resolvedGenres, setGenres);
        } else if (source === "Google Books") {
          resolvedGenres = await parseResolvedGenres(resolvedGenres);
          processGenresForGoogleBooks(resolvedGenres, setGenres);
        } else {
          console.error("Unknown source type:", source);
          setGenres(["Неизвестен източник за жанрове."]);
        }
      } catch (error) {
        console.error("Error resolving genre_bg:", error);
        setGenres([]);
      }
    };

    resolveGenres();
  }, [selectedItem?.genre_bg]);

  if (!selectedItem) return null;
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
          <div className="flex w-full items-start">
            <div className="relative flex-shrink-0 mr-8 flex flex-col items-center">
              <img
                src={selectedItem.imageLink}
                alt={`${selectedItem.title_bg || "Book"} Poster`}
                className="rounded-lg w-[15rem] h-auto"
              />
              <button
                onClick={() => handleBookmarkClick(selectedItem)}
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
                    selectedItem.google_books_id || selectedItem.goodreads_id
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
                    {selectedItem.characters ? (
                      <ul className="list-disc list-inside">
                        {selectedItem.characters
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

            <div className="flex-grow w-full md:w-2/3 text-left ml-8">
              <div className="flex-grow flex flex-col justify-between">
                <div className="grid grid-cols-2 gap-8">
                  <div className="mb-2">
                    <p className="block text-3xl font-bold">
                      {selectedItem.title_bg || "Заглавие не е налично"}
                    </p>
                    <p className="block text-lg font-semibold text-opacity-60 italic mb-2">
                      {selectedItem.title_en ||
                        "Заглавие на английски не е налично"}
                    </p>
                    <p className="text-sm italic text-defaulttextcolor/70">
                      {author || "Неизвестен автор"},{" "}
                      {selectedItem.page_count || "неизвестен брой"} страници
                    </p>
                  </div>

                  <div className="mb-4">
                    {isGoodreads && (
                      <div>
                        <strong className="text-xl text-defaulttextcolor/85">
                          Част от поредица:
                        </strong>
                        <p className="text-base italic text-defaulttextcolor/70 mb-2">
                          {selectedItem.series || "Не"}
                        </p>
                      </div>
                    )}
                    <strong className="text-xl text-defaulttextcolor/85">
                      Адаптации:
                    </strong>
                    <p className="text-base italic text-defaulttextcolor/70">
                      {selectedItem.adaptations ||
                        "Няма налична информация за адаптации :("}
                    </p>
                  </div>
                </div>
              </div>

              <Genres genres={genres} source={source} />
              <div className="flex items-center space-x-8">
                <div
                  className="flex dark:text-[#FFCC33] text-[#bf9413] items-center space-x-2"
                  title="Goodreads рейтинг: Базиран на отзиви и оценки от потребители."
                >
                  <span className="font-bold text-lg">
                    Рейтинг в Goodreads:
                  </span>
                  <FaStar className="w-6 h-6" />
                  <span className="font-bold text-lg">
                    {selectedItem.goodreads_rating || "N/A"}{" "}
                    {isGoodreads &&
                      `/ ${selectedItem.goodreads_ratings_count.toLocaleString(
                        "bg-BG"
                      )} гласа`}
                  </span>
                </div>
              </div>
              <span className="italic text-sm mb-4 dark:text-[#FFCC33]/70 text-[#bf9413]">
                {isGoodreads &&
                  `Общо ${selectedItem.goodreads_reviews_count.toLocaleString(
                    "bg-BG"
                  )} ревюта в Goodreads`}
              </span>
              {selectedItem.reason && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">
                    Защо препоръчваме {selectedItem.title_bg}?
                  </h3>
                  <p className="text-opacity-80 italic">
                    {selectedItem.reason}
                  </p>
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
                    onClick={handleOpenPlotModal}
                    className="mt-2 underline hover:scale-105 transition"
                  >
                    Пълно описание
                  </button>
                )}
              </div>
              {isGoodreads && <AwardsSection recommendation={selectedItem} />}
              <div className="mt-2">
                <h3 className="text-lg font-semibold mb-2">
                  Допълнителна информация:
                </h3>
                <ul className="flex flex-wrap gap-x-4 text-opacity-80">
                  <li>
                    <strong className="text-primary">Произход:</strong>{" "}
                    {selectedItem.origin || "N/A"}
                  </li>
                  <li>
                    <strong className="text-primary">Език:</strong>{" "}
                    {language || "N/A"}
                  </li>
                  {isGoodreads && (
                    <li>
                      <strong className="text-primary">Вид:</strong>{" "}
                      {selectedItem.book_format
                        ? BookFormat[
                            selectedItem.book_format as keyof typeof BookFormat
                          ]
                        : "Няма информация"}
                    </li>
                  )}
                  {isGoodreads && (
                    <li>
                      <strong className="text-primary">Местообстановка:</strong>{" "}
                      {selectedItem.setting || "N/A"}
                    </li>
                  )}
                  <li>
                    <strong className="text-primary">Издателство:</strong>{" "}
                    {selectedItem.publisher || "N/A"}
                  </li>
                  <li>
                    <strong className="text-primary">
                      Година на публикуване на първо издание:
                    </strong>{" "}
                    {selectedItem.date_of_first_issue || "N/A"}
                  </li>
                  <li>
                    <strong className="text-primary">
                      Дата на публикуване на това издание:
                    </strong>{" "}
                    {selectedItem.date_of_issue || "N/A"}
                  </li>

                  <li>
                    <strong className="text-primary">ISBN_10 (ISBN_13):</strong>{" "}
                    {`${selectedItem.ISBN_10 || "N/A"} (${
                      selectedItem.ISBN_13 || "N/A"
                    })`}
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
        plot={description}
      />
    </div>
  );
};

export default RecommendationCardAlert;

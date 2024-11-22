import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { SiRottentomatoes } from "react-icons/si";
import { CSSTransition } from "react-transition-group";

interface Genre {
  en: string;
  bg: string;
}

export interface Rating {
  Source: string;
  Value: string;
}

async function translate(entry: string) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=bg&dt=t&q=${encodeURIComponent(
    entry
  )}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const flattenedTranslation = data[0]
      .map((item: [string]) => item[0])
      .join(" ");

    const mergedTranslation = flattenedTranslation.replace(/\s+/g, " ").trim();
    return mergedTranslation;
  } catch (error) {
    console.error(`Error translating entry: ${entry}`, error);
    return entry;
  }
}

interface Movie {
  id: string; // ID of the movie
  user_id: string; // ID of the user associated with the movie
  imdbID: string; // IMDb identifier
  title: string; // English title of the movie
  bgName: string; // Bulgarian title of the movie
  genre: string; // Genres in English
  reason: string; // Reason for recommending the movie
  description: string; // Description of the movie
  year: string; // Year of release
  rated: string; // Age rating
  released: string; // Release date
  runtime: string; // Runtime in minutes
  director: string; // Director's name
  writer: string; // Writer's name
  actors: string; // List of actors
  plot: string; // Plot of the movie
  language: string; // Languages used in the movie
  country: string; // Countries involved in production
  awards: string; // Awards won
  poster: string; // URL to the poster
  ratings: { Source: string; Value: string }[]; // Array of rating sources and values
  metascore: string; // Metascore value
  imdbRating: string; // IMDb rating
  imdbVotes: string; // Number of IMDb votes
  type: string; // Type (e.g., movie)
  DVD: string; // DVD release info (if available)
  boxOffice: string; // Box office earnings
  production: string; // Production studio (if available)
  website: string; // Official website (if available)
  totalSeasons: string | null; // Total seasons (if applicable, for series)
  date: string; // Date of data entry
}

interface QuizQuestionProps {
  setSelectedAnswer: Dispatch<SetStateAction<string[] | null>>;
  showQuestion: boolean; // Whether the question should be visible
  currentQuestion: any;
  currentQuestionIndex: number; // Index of the current question
  totalQuestions: number; // Total number of questions in the quiz
  selectedAnswer?: string[] | null; // Array of selected answers (if any)
  interests: string; // Current input for interests
  handleInputChange: (setter: (value: string) => void, value: string) => void; // Function to handle input changes
  handleAnswerClick: (setter: (value: string) => void, answer: string) => void; // Function to handle option clicks
  handleNext: () => void; // Function to move to the next question
  handleBack: () => void;
  isBackDisabled: boolean;
  handleSubmit: () => Promise<void>; // Function to submit the quiz
  setInterests: Dispatch<SetStateAction<string>>;
  recommendationList: any[];
  handleViewRecommendations: () => void;
  submitted: boolean;
}

export const QuizQuestion: FC<QuizQuestionProps> = ({
  setSelectedAnswer,
  showQuestion,
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  selectedAnswer,
  interests,
  handleInputChange,
  handleAnswerClick,
  handleNext,
  handleBack,
  isBackDisabled,
  handleSubmit,
  setInterests,
  recommendationList,
  handleViewRecommendations,
  submitted
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (currentQuestion?.value) {
      if (
        Array.isArray(currentQuestion.options) &&
        currentQuestion.options.every(isGenreOption)
      ) {
        const genreBgValues = Array.isArray(currentQuestion.value)
          ? currentQuestion.value.map(
              (value: { en: string; bg: string }) => value.bg
            )
          : [
              currentQuestion.value,
              currentQuestion.options.find(
                (option: { en: string; bg: string }) =>
                  option.en === currentQuestion.value
              )?.bg || currentQuestion.value
            ];

        if (JSON.stringify(genreBgValues) !== JSON.stringify(selectedAnswer)) {
          console.log("genreBgValues: ", genreBgValues);
          setSelectedAnswer(genreBgValues);
        }
      } else {
        const newValue = Array.isArray(currentQuestion.value)
          ? currentQuestion.value
          : [currentQuestion.value];

        if (JSON.stringify(newValue) !== JSON.stringify(selectedAnswer)) {
          setSelectedAnswer(newValue);
        }
      }
    }
  }, [currentQuestion, selectedAnswer]);
  function isGenreOption(option: any): option is Genre {
    return (
      option && typeof option.en === "string" && typeof option.bg === "string"
    );
  }
  return (
    <div>
      {recommendationList.length > 0 && !submitted && (
        <div className="mt-6 text-center">
          <p className="text-lg text-gray-600">
            Искате да се върнете при препоръките?{" "}
            <button
              onClick={handleViewRecommendations}
              className="text-primary font-semibold hover:text-secondary transition-colors underline"
            >
              Върнете се
            </button>
          </p>
        </div>
      )}
      <CSSTransition
        in={showQuestion}
        timeout={500}
        classNames="fade"
        unmountOnExit
      >
        <div className="w-full max-w-4xl py-8 px-4">
          <div className="question bg-opacity-70 border-2 text-white rounded-lg p-4 glow-effect transition-all duration-300">
            <h2 className="text-xl font-semibold break-words">
              {currentQuestion.question}
            </h2>
            {currentQuestion.description && (
              <p className="text-sm text-gray-500 mt-2">
                {currentQuestion.description}
              </p>
            )}
          </div>
          <div className={isBackDisabled ? "my-8" : "mb-2"}>
            {!isBackDisabled && (
              <div className="flex justify-start ">
                <button
                  onClick={handleBack}
                  className="back-button text-blue-600 text-3xl transition-all duration-300 hover:text-blue-800"
                >
                  &#8592;
                </button>
              </div>
            )}
          </div>
          {currentQuestion.isInput ? (
            <div className="mb-4">
              {currentQuestion.setter === setInterests ? (
                <div>
                  <textarea
                    className="form-control bg-opacity-70 border-2 rounded-lg p-4 mb-4 text-white glow-effect transition-all duration-300 hover:text-[#d94545]"
                    placeholder={currentQuestion.placeholder}
                    value={interests}
                    onChange={(e) => {
                      handleInputChange(currentQuestion.setter, e.target.value);

                      if (e.target.value.trim() === "") {
                        setSelectedAnswer([]);
                      } else {
                        setSelectedAnswer([e.target.value]);
                      }
                    }}
                    rows={4}
                    maxLength={200}
                  />
                  <div className="flex justify-between mx-2">
                    <label className="flex items-center cursor-pointer hover:text-[#d94545]">
                      <input
                        type="checkbox"
                        className="checkbox"
                        checked={
                          currentQuestion.value === "Нямам предпочитания"
                        }
                        onChange={() => {
                          const newValue =
                            currentQuestion.value === "Нямам предпочитания"
                              ? ""
                              : "Нямам предпочитания";
                          currentQuestion.setter(newValue);
                          setSelectedAnswer(newValue === "" ? [] : [newValue]);
                        }}
                      />
                      <span>Нямам предпочитания</span>
                    </label>
                    <div className="text-right mt-2">
                      <small>{`${interests.length} / 200`}</small>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <input
                    type="text"
                    className="input-field form-control bg-opacity-70 border-2 rounded-lg p-4 mb-4 text-white glow-effect transition-all duration-300 hover:text-[#d94545]"
                    placeholder={currentQuestion.placeholder}
                    value={currentQuestion.value}
                    onChange={(e) => {
                      handleInputChange(currentQuestion.setter, e.target.value);
                      if (e.target.value.trim() === "") {
                        setSelectedAnswer([]);
                      } else {
                        setSelectedAnswer([e.target.value]);
                      }
                    }}
                    required
                  />
                  <div className="flex items-center text-white">
                    <label className="flex items-center ml-2 cursor-pointer hover:text-[#d94545]">
                      <input
                        type="checkbox"
                        className="checkbox"
                        checked={
                          currentQuestion.value === "Нямам предпочитания"
                        }
                        onChange={() => {
                          const newValue =
                            currentQuestion.value === "Нямам предпочитания"
                              ? ""
                              : "Нямам предпочитания";
                          currentQuestion.setter(newValue);
                          setSelectedAnswer(newValue === "" ? [] : [newValue]);
                        }}
                      />
                      <span className="ml-2">Нямам предпочитания</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div
              className={`grid gap-4 ${
                (currentQuestion.options?.length ?? 0) > 6
                  ? "grid-cols-2 md:grid-cols-5"
                  : "grid-cols-1"
              }`}
            >
              {currentQuestion.options?.map((option: any, index: number) => {
                if (
                  Array.isArray(currentQuestion.options) &&
                  currentQuestion.options.every(isGenreOption)
                ) {
                  return (
                    <div
                      key={index}
                      className={`${
                        selectedAnswer && selectedAnswer.includes(option.bg)
                          ? "selected-answer"
                          : "question"
                      } bg-opacity-70 p-4 text-white rounded-lg glow-effect transition-all duration-300 ${
                        selectedAnswer && selectedAnswer.includes(option.bg)
                          ? "transform scale-105"
                          : "hover:bg-[#d94545] hover:text-white"
                      }`}
                    >
                      <button
                        className="block w-full p-2 rounded"
                        onClick={() =>
                          handleAnswerClick(currentQuestion.setter, option.bg)
                        }
                      >
                        {option.bg}
                      </button>
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={index}
                      className={`${
                        selectedAnswer && selectedAnswer.includes(option)
                          ? "selected-answer"
                          : "question"
                      } bg-opacity-70 p-4 text-white rounded-lg glow-effect transition-all duration-300 ${
                        selectedAnswer && selectedAnswer.includes(option)
                          ? "transform scale-105"
                          : "hover:bg-[#d94545] hover:text-white"
                      }`}
                    >
                      <button
                        className="block w-full p-2 rounded"
                        onClick={() =>
                          handleAnswerClick(currentQuestion.setter, option)
                        }
                      >
                        {option}
                      </button>
                    </div>
                  );
                }
              })}
            </div>
          )}

          <div
            className={`next bg-red-600 bg-opacity-70 text-white rounded-lg p-4 mt-4 transition-all duration-200 ${
              (selectedAnswer && selectedAnswer.length > 0) ||
              (currentQuestion.isInput &&
                typeof currentQuestion.value === "string" &&
                currentQuestion.value.trim() !== "")
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }}`}
          >
            {currentQuestionIndex === totalQuestions - 1 ? (
              <div>
                <button
                  onClick={() => {
                    if (recommendationList.length > 0) {
                      handleOpenModal();
                    } else {
                      handleSubmit();
                    }
                  }}
                  className="block w-full p-2 text-white rounded hover:bg-red-700"
                  disabled={
                    !(
                      (selectedAnswer && selectedAnswer.length > 0) ||
                      (currentQuestion.value &&
                        currentQuestion.value.trim() !== "")
                    )
                  }
                >
                  Изпрати
                </button>
                {isModalOpen && recommendationList.length > 0 && (
                  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="question p-6 rounded-lg shadow-lg space-y-4">
                      <h2 className="text-lg font-semibold">
                        Сигурни ли сте, че искате да изпратите въпросника?
                      </h2>
                      <p className="text-sm text-gray-600 italic">
                        След като го изпратите, ще ви се премахнат миналите
                        препоръчвания и ще бъдат генерирани нови.
                      </p>
                      <div className="flex justify-end space-x-4">
                        <button
                          onClick={handleCloseModal}
                          className="bg-primary hover:bg-secondary px-4 py-2 bg-gray-300 text-white rounded-lg hover:bg-gray-400"
                        >
                          Отказ
                        </button>
                        <button
                          onClick={() => {
                            handleSubmit();
                            handleCloseModal();
                          }}
                          className="bg-primary hover:bg-secondary px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          Потвърди
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleNext}
                className="block w-full p-2 text-white"
                disabled={
                  !(
                    (selectedAnswer && selectedAnswer.length > 0) ||
                    (typeof currentQuestion.value === "string" &&
                      currentQuestion.value.trim() !== "")
                  )
                }
              >
                Следващ въпрос
              </button>
            )}
          </div>
        </div>
      </CSSTransition>
    </div>
  );
};

interface RecommendationsProps {
  recommendationList: Movie[];
}

export const Recommendations: FC<RecommendationsProps> = ({
  recommendationList
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inTransition, setInTransition] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [translatedDirector, setTranslatedDirector] = useState<string>("");
  const [translatedWriters, setTranslatedWriters] = useState<string>("");
  const [translatedActors, setTranslatedActors] = useState<string>("");
  const [translatedAwards, setTranslatedAwards] = useState<string>("");
  const [translatedGenres, setTranslatedGenres] = useState<string>("");
  const plotPreviewLength = 110;
  const animationDuration = 500;

  if (!recommendationList.length) {
    return <div>No recommendations available.</div>;
  }

  const movie = recommendationList[currentIndex];
  const rottenTomatoesRating =
    movie.ratings?.find((rating) => rating.Source === "Rotten Tomatoes")
      ?.Value || "N/A";

  const handleNext = () => {
    setDirection("right");
    setInTransition(true);

    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === recommendationList.length - 1 ? 0 : prevIndex + 1
      );
      setIsExpanded(false);
      setInTransition(false);
    }, 500);
  };

  const handlePrevious = () => {
    setDirection("left");
    setInTransition(true);

    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? recommendationList.length - 1 : prevIndex - 1
      );
      setIsExpanded(false);
      setInTransition(false);
    }, 500);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

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
    <div className="relative flex items-center justify-between">
      <CSSTransition
        in={!inTransition}
        timeout={animationDuration}
        classNames="arrows"
        onExited={() => setInTransition(false)}
        unmountOnExit
      >
        <button
          onClick={handlePrevious}
          className="absolute left-[-120px] top-1/2 transform -translate-y-1/2 dark:text-white text-black text-6xl dark:hover:text-gray-400 hover:text-black hover:text-opacity-60 transition"
        >
          &lt;
        </button>
      </CSSTransition>

      <CSSTransition
        in={!inTransition}
        timeout={animationDuration}
        classNames={`slide-${direction}`}
        onExited={() => setInTransition(false)}
        unmountOnExit
      >
        <div className="movie-card">
          <div className="flex w-full items-center">
            <div className="flex-shrink-0 mr-8">
              <img
                src={movie.poster}
                alt={`${movie.bgName || "Movie"} Poster`}
                className="rounded-lg w-96 h-auto"
              />
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
                  <div className="flex items-center space-x-2">
                    <FaStar className="dark:text-[#FFCC33] text-[#bf9413] w-8 h-8" />
                    <span className="dark:text-[#FFCC33] text-[#bf9413] font-bold text-lg">
                      {movie.imdbRating || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
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
                      <span className="text-xl">
                        {movie.metascore || "N/A"}
                      </span>
                    </div>
                    <span className="font-semibold">Метаскор</span>
                  </div>
                  <div className="flex items-center space-x-2">
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
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out`}
                  style={{
                    maxHeight: isExpanded ? "400px" : "20px",
                    opacity: isExpanded ? 0.9 : 0.7
                  }}
                >
                  <p className="text-opacity-80 italic">
                    {isExpanded
                      ? movie.description
                      : `${movie.description.substring(
                          0,
                          plotPreviewLength
                        )}...`}
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
                    {translatedDirector || "Неизвестен"}
                  </li>
                  <li>
                    <strong className="text-primary">Сценаристи:</strong>{" "}
                    {translatedWriters || "Неизвестени"}
                  </li>
                  <li>
                    <strong className="text-primary">Актьори:</strong>{" "}
                    {translatedActors || "Неизвестени"}
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
      </CSSTransition>
      <CSSTransition
        in={!inTransition}
        timeout={animationDuration}
        classNames="arrows"
        onExited={() => setInTransition(false)}
        unmountOnExit
      >
        <button
          onClick={handleNext}
          className="absolute right-[-120px] top-1/2 transform -translate-y-1/2 dark:text-white text-black text-6xl dark:hover:text-gray-400 hover:text-black hover:text-opacity-60 transition"
        >
          &gt;
        </button>
      </CSSTransition>
      <CSSTransition
        in={isModalOpen}
        timeout={300}
        classNames="fade-no-transform"
        unmountOnExit
      >
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black bg-opacity-70 z-40"></div>
          <div className="question p-6 rounded-lg shadow-lg bg-white w-full max-w-lg space-y-4 z-50">
            <h2 className="text-lg font-semibold">Пълен сюжет</h2>
            <p className="text-sm italic">{movie.description}</p>
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
      </CSSTransition>
    </div>
  );
};

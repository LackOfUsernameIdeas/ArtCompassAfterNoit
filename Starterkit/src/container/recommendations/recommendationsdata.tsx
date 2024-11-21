import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useRef,
  useState
} from "react";
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

    // Flatten the response array to get only the translated text
    const flattenedTranslation = data[0]
      .map((item: [string]) => item[0])
      .join(" ");

    // Replace multiple spaces with a single space and trim the result
    const mergedTranslation = flattenedTranslation.replace(/\s+/g, " ").trim();
    // Return the cleaned translation
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

const fakeMovieData = [
  {
    id: "200",
    user_id: "1",
    imdbID: "tt3890160",
    title_en: "Baby Driver",
    title_bg: "Бейби Драйвър",
    genre_en: "Action, Crime, Drama",
    genre_bg: "Екшън, Криминален, Драма",
    reason:
      "Филмът предлага бързо темпо и напрежение, което съответства на предпочитанието за динамичност, и съдържа ясни сюжетни линии. Тийнейджърският аспект на героя също го прави подходящ за целевата група.",
    description:
      "Млад шофьор, който слуша музика нон-стоп, е принуден да работи за голям престъпник и да участва в обири. aa aaaaa aaa aaaaaaa aaaaa aaaaaaaa aaaaa aaaa aaaaaaa aa aaaaa aaa aaaaaaa aaaaa aaaaaaaa aaaaa aaaaaa aaaaa aaa aaaaaaa aaaaa aaaaaaaa aaaaa aaaaaa aaaaa aaa aaaaaaa aaaaa aaaaaaaa aaaaa aaaaaa aaaaa aaa aaaaaaa aaaaa aaaaaaaa aaaaa aaaaaa aaaaa aaa aaaaaaa aaaaa aaaaaaaa aaaaa aaaaaa aaaaa aaa aaaaaaa aaaaa aaaaaaaa aaaaa aaaaaa aaaaa aaa aaaaaaa aaaaa aaaaaaaa aaaaa aaaaaa aaaaa aaa aaaaaaa aaaaa aaaaaaaa aaaaa aaaaaa aaaaa aaa aaaaaaa aaaaa aaaaaaaa aaaaa aaaa",
    year: "2017",
    rated: "R",
    released: "28 Jun 2017",
    runtime: "113 min",
    director: "Edgar Wright",
    writer: "Edgar Wright",
    actors: "Ansel Elgort, Jon Bernthal, Jon Hamm",
    plot: "Doc forces Baby, a former getaway driver, to partake in a heist, threatening to hurt his girlfriend if he refuses. But the plan goes awry when their arms dealers turn out to be undercover officers.",
    language: "English, American Sign ",
    country: "United Kingdom, United States",
    awards: "Nominated for 3 Oscars. 43 wins & 66 nominations total",
    poster:
      "https://m.media-amazon.com/images/M/MV5BMjM3MjQ1MzkxNl5BMl5BanBnXkFtZTgwODk1ODgyMjI@._V1_SX300.jpg",
    ratings: [
      { Source: "Internet Movie Database", Value: "7.5/10" },
      { Source: "Rotten Tomatoes", Value: "92%" },
      { Source: "Metacritic", Value: "86/100" }
    ],
    metascore: "86",
    imdbRating: "7.5",
    imdbVotes: "627,620",
    type: "movie",
    DVD: "N/A",
    boxOffice: "$107,825,862",
    production: "N/A",
    website: "N/A",
    totalSeasons: null,
    date: "2024-10-31 07:47:48"
  },
  {
    id: "202",
    user_id: "1",
    imdbID: "tt1631867",
    title_en: "Edge of Tomorrow",
    title_bg: "На края на утрешния ден",
    genre_en: "Action, Adventure, Sci-Fi",
    genre_bg: "Екшън, Приключенски, Научна фантастика",
    reason:
      "Този филм е пълен с екшън и напрежение, подходящ за повереното емоционално състояние, и осигурява ясна, постепенна развръзка на събитията.",
    description:
      "Войник е хванат в времеви цикъл, в който трябва многократно да преживява битка с извънземни.",
    year: "2014",
    rated: "PG-13",
    released: "06 Jun 2014",
    runtime: "113 min",
    director: "Doug Liman",
    writer: "Christopher McQuarrie, Jez Butterworth, John-Henry Butterworth",
    actors: "Tom Cruise, Emily Blunt, Bill Paxton",
    plot: "A soldier fighting aliens gets to relive the same day over and over again, the day restarting every time he dies.",
    language: "English",
    country: "United States, Canada, India",
    awards: "11 wins & 38 nominations",
    poster:
      "https://m.media-amazon.com/images/M/MV5BMTc5OTk4MTM3M15BMl5BanBnXkFtZTgwODcxNjg3MDE@._V1_SX300.jpg",
    ratings: [
      { Source: "Internet Movie Database", Value: "7.9/10" },
      { Source: "Rotten Tomatoes", Value: "91%" },
      { Source: "Metacritic", Value: "71/100" }
    ],
    metascore: "71",
    imdbRating: "7.9",
    imdbVotes: "753,821",
    type: "movie",
    DVD: "N/A",
    boxOffice: "$100,206,256",
    production: "N/A",
    website: "N/A",
    totalSeasons: null,
    date: "2024-10-31 07:47:48"
  },
  {
    id: "204",
    user_id: "1",
    imdbID: "tt1392170",
    title_en: "The Hunger Games",
    title_bg: "Игрите на глада",
    genre_en: "Action, Adventure, Sci-Fi",
    genre_bg: "Екшън, Приключенски, Научна фантастика",
    reason:
      "Сюжетът предлага интензивност и тематика, която е насочена към тийнейджъри, със средно динамично съдържание и сериално разгръщане на основната история.",
    description:
      "Катнис Евърдийн участва в смъртоносна арена, където трябва да използва своите умения за оцеляване, за да спечели.",
    year: "2012",
    rated: "PG-13",
    released: "23 Mar 2012",
    runtime: "142 min",
    director: "Gary Ross",
    writer: "Gary Ross, Suzanne Collins, Billy Ray",
    actors: "Jennifer Lawrence, Josh Hutcherson, Liam Hemsworth",
    plot: "Katniss Everdeen voluntarily takes her younger sister's place in the Hunger Games: a televised competition in which two teenagers from each of the twelve Districts of Panem are chosen at random to fight to the death.",
    language: "English",
    country: "United States",
    awards: "Won 1 BAFTA Award34 wins & 49 nominations total",
    poster:
      "https://m.media-amazon.com/images/M/MV5BMWI1OGM4YjQtNmIxNi00YmE2LWJkNTAtY2Q0YjU4NTI5NWQyXkEyXkFqcGc@._V1_SX300.jpg",
    ratings: [
      { Source: "Internet Movie Database", Value: "7.2/10" },
      { Source: "Rotten Tomatoes", Value: "84%" },
      { Source: "Metacritic", Value: "68/100" }
    ],
    metascore: "68",
    imdbRating: "7.2",
    imdbVotes: "1,020,548",
    type: "movie",
    DVD: "N/A",
    boxOffice: "$408,010,692",
    production: "N/A",
    website: "N/A",
    totalSeasons: null,
    date: "2024-10-31 07:47:48"
  },
  {
    id: "208",
    user_id: "1",
    imdbID: "tt1677720",
    title_en: "Ready Player One",
    title_bg: "Играч първи, приготви се",
    genre_en: "Action, Adventure, Sci-Fi",
    genre_bg: "Екшън, Приключенски, Научна фантастика",
    reason:
      "Този филм предлага вълнуваща комбинация от приключения и научна фантастика, като вкарва зрителите в свят пълен с действие и напрежение. С ясна сюжетна линия, това е перфектен избор, когато разполагате с ограничено време.",
    description:
      "Виртуалната реалност е новата норма, докато играчи се съревновават за наследство на изгубено съкровище скрито в играта Оазис.",
    year: "2018",
    rated: "PG-13",
    released: "29 Mar 2018",
    runtime: "140 min",
    director: "Steven Spielberg",
    writer: "Zak Penn, Ernest Cline",
    actors: "Tye Sheridan, Olivia Cooke, Ben Mendelsohn",
    plot: "When the creator of a virtual reality called the OASIS dies, he makes a posthumous challenge to all OASIS users to find his Easter Egg, which will give the finder his fortune and control of his world.",
    language: "English, Japanese",
    country:
      "United States, India, Singapore, Canada, United Kingdom, Japan, Australia",
    awards: "Nominated for 1 Oscar. 11 wins & 57 nominations total",
    poster:
      "https://m.media-amazon.com/images/M/MV5BNzVkMTgzODQtMWIwZC00NzE4LTgzZjYtMzAwM2I5OGZhNjE4XkEyXkFqcGc@._V1_SX300.jpg",
    ratings: [
      { Source: "Internet Movie Database", Value: "7.4/10" },
      { Source: "Rotten Tomatoes", Value: "72%" },
      { Source: "Metacritic", Value: "64/100" }
    ],
    metascore: "64",
    imdbRating: "7.4",
    imdbVotes: "498,502",
    type: "movie",
    DVD: "N/A",
    boxOffice: "$137,715,350",
    production: "N/A",
    website: "N/A",
    totalSeasons: null,
    date: "2024-10-31 08:08:19"
  }
];

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
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal

  const handleOpenModal = () => {
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  useEffect(() => {
    // Only update if the selected answer is different from the current question value
    if (currentQuestion?.value) {
      // If the options are genres, only set the 'bg' properties
      if (
        Array.isArray(currentQuestion.options) &&
        currentQuestion.options.every(isGenreOption) // Assuming `isGenreOption` verifies genre objects
      ) {
        // Check if selectedAnswer needs to be updated to avoid unnecessary re-renders
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

        // Only set the selectedAnswer if it has changed
        if (JSON.stringify(genreBgValues) !== JSON.stringify(selectedAnswer)) {
          console.log("genreBgValues: ", genreBgValues);
          setSelectedAnswer(genreBgValues); // Set only the 'bg' properties
        }
      } else {
        // For other questions, set the value as is (no mapping needed)
        const newValue = Array.isArray(currentQuestion.value)
          ? currentQuestion.value
          : [currentQuestion.value];

        // Only set the selectedAnswer if it has changed
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
                      // Update the value based on input change
                      handleInputChange(currentQuestion.setter, e.target.value);

                      if (e.target.value.trim() === "") {
                        setSelectedAnswer([]); // Hide the button if input is empty
                      } else {
                        setSelectedAnswer([e.target.value]); // Show the button if input has value
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
                // Check if the question is specifically about genres (objects with en and bg properties)
                if (
                  Array.isArray(currentQuestion.options) &&
                  currentQuestion.options.every(isGenreOption)
                ) {
                  // Here we assume 'option' is of type { en: string; bg: string } for genres
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
                        onClick={
                          () =>
                            handleAnswerClick(currentQuestion.setter, option.bg) // Pass the full genre object
                        }
                      >
                        {option.bg} {/* Display the Bulgarian name */}
                      </button>
                    </div>
                  );
                } else {
                  // Handle regular questions (strings or string arrays)
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
                        onClick={
                          () =>
                            handleAnswerClick(currentQuestion.setter, option) // Pass the answer string
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
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state for full plot
  const [translatedDirector, setTranslatedDirector] = useState<string>("");
  const [translatedWriters, setTranslatedWriters] = useState<string>("");
  const [translatedActors, setTranslatedActors] = useState<string>("");

  const plotPreviewLength = 110; // Character limit for preview
  const animationDuration = 500; // Duration of animation in milliseconds

  if (!recommendationList.length) {
    return <div>No recommendations available.</div>;
  }

  const movie = recommendationList[currentIndex];
  const rottenTomatoesRating =
    movie.ratings?.find((rating) => rating.Source === "Rotten Tomatoes")
      ?.Value || "N/A";

  const handleNext = () => {
    setDirection("right");
    setInTransition(true); // Start the transition

    // Wait for the fade-out transition to complete (500ms)
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === recommendationList.length - 1 ? 0 : prevIndex + 1
      );
      setIsExpanded(false); // Collapse the plot when moving to next
      setInTransition(false); // End the transition
    }, 500); // 500ms delay for fade-out
  };

  const handlePrevious = () => {
    setDirection("left");
    setInTransition(true); // Start the transition

    // Wait for the fade-out transition to complete (500ms)
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? recommendationList.length - 1 : prevIndex - 1
      );
      setIsExpanded(false); // Collapse the plot when moving to previous
      setInTransition(false); // End the transition
    }, 500); // 500ms delay for fade-out
  };

  const openModal = () => {
    setIsModalOpen(true); // Open the modal with full plot
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  // Translate the director when the component mounts or when movie.director changes
  useEffect(() => {
    async function fetchDirectorTranslation() {
      const translated = await translate(movie.director);
      setTranslatedDirector(translated);
    }

    fetchDirectorTranslation();
  }, [movie.director]);

  // Translate the writer when the component mounts or when movie.writer changes
  useEffect(() => {
    async function fetchWriterTranslation() {
      const translated = await translate(movie.writer);
      setTranslatedWriters(translated);
    }

    fetchWriterTranslation();
  }, [movie.writer]);

  // Translate the actors when the component mounts or when movie.actors changes
  useEffect(() => {
    async function fetchActorsTranslation() {
      const translated = await translate(movie.actors);
      setTranslatedActors(translated);
    }

    fetchActorsTranslation();
  }, [movie.actors]);

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

      {/* MOVIE CARD */}
      <CSSTransition
        in={!inTransition}
        timeout={animationDuration}
        classNames={`slide-${direction}`}
        onExited={() => setInTransition(false)}
        unmountOnExit
      >
        <div className="movie-card">
          <div className="flex w-full items-center">
            {/* Poster Section */}
            <div className="flex-shrink-0 mr-8">
              <img
                src={movie.poster}
                alt={`${movie.bgName || "Movie"} Poster`}
                className="rounded-lg w-96 h-auto"
              />
            </div>

            {/* Details Section */}
            <div className="flex-grow">
              {/* Sticky Title and Ratings */}
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
                  {movie.genre || "Жанр неизвестен"} |{" "}
                  {movie.year || "Година неизвестна"} | Рейтинг:{" "}
                  {movie.rated || "N/A"}
                </p>
                <div className="flex items-center space-x-8 mb-4">
                  {/* IMDB Rating */}
                  <div className="flex items-center space-x-2">
                    <FaStar className="dark:text-[#FFCC33] text-[#bf9413] w-8 h-8" />
                    <span className="dark:text-[#FFCC33] text-[#bf9413] font-bold text-lg">
                      {movie.imdbRating || "N/A"}
                    </span>
                  </div>
                  {/* Metascore */}
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
                  {/* Rotten Tomatoes Rating */}
                  <div className="flex items-center space-x-2">
                    <SiRottentomatoes className="text-[#FF0000] w-8 h-8" />
                    <span className="text-red-400 font-semibold">
                      {rottenTomatoesRating}
                    </span>
                  </div>
                </div>
              </div>

              {/* Why We Recommend */}
              {movie.reason && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">
                    Защо препоръчваме {movie.bgName}?
                  </h3>
                  <p className="text-opacity-80 italic">{movie.reason}</p>
                </div>
              )}

              {/* Plot */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Сюжет</h3>
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out`}
                  style={{
                    maxHeight: isExpanded ? "400px" : "20px", // Smooth expand/collapse effect
                    opacity: isExpanded ? 0.9 : 0.7 // Fade in/out effect
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

                {/* Show less or show more button */}
                {movie.description &&
                  movie.description.length > plotPreviewLength && (
                    <button
                      onClick={openModal} // Open modal instead of expanding plot
                      className="mt-2 underline"
                    >
                      Пълен сюжет
                    </button>
                  )}
              </div>

              {/* Movie Details */}
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
                    {movie.awards || "Няма"}
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

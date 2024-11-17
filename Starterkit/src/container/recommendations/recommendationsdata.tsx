import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState
} from "react";
import { FaStar } from "react-icons/fa";
import { SiRottentomatoes } from "react-icons/si";
import { CSSTransition } from "react-transition-group";

export interface Rating {
  Source: string;
  Value: string;
}

interface Movie {
  id: string; // ID of the movie
  user_id: string; // ID of the user associated with the movie
  imdbID: string; // IMDb identifier
  title_en: string; // English title of the movie
  title_bg: string; // Bulgarian title of the movie
  genre_en: string; // Genres in English
  genre_bg: string; // Genres in Bulgarian
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

export const fetchFakeMovieDataForTesting = (
  setter: React.Dispatch<React.SetStateAction<Movie[]>>
) => {
  setter((prevData) => [...prevData, ...fakeMovieData]);
};

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
  handleSubmitTest: () => void; // Function to submit the quiz
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
  handleSubmitTest,
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
    // Check if the current question value is different from the current selected answer
    if (
      currentQuestion?.value &&
      JSON.stringify(selectedAnswer) !==
        JSON.stringify(
          Array.isArray(currentQuestion.value)
            ? currentQuestion.value
            : [currentQuestion.value]
        )
    ) {
      setSelectedAnswer(
        Array.isArray(currentQuestion.value)
          ? currentQuestion.value
          : [currentQuestion.value]
      );
    }
  }, [currentQuestion, selectedAnswer]);

  return (
    <CSSTransition
      in={showQuestion}
      timeout={300}
      classNames="fade"
      unmountOnExit
    >
      <div className="w-full max-w-3xl px-4 py-8">
        {/* Question Content */}
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
        {/* Input or Options */}
        {currentQuestion.isInput ? (
          <div className="mb-4">
            {currentQuestion.setter === setInterests ? (
              <div>
                <textarea
                  className="form-control bg-opacity-70 border-2 rounded-lg p-4 mb-2 text-white glow-effect transition-all duration-300 hover:text-[#d94545]"
                  placeholder={currentQuestion.placeholder}
                  value={interests}
                  onChange={(e) =>
                    handleInputChange(currentQuestion.setter, e.target.value)
                  }
                  rows={4}
                  maxLength={200}
                />
                <div className="flex justify-between">
                  <div className="flex items-center text-white">
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={currentQuestion.value === "Нямам предпочитания"}
                      onChange={() => {
                        currentQuestion.setter(
                          currentQuestion.value === "Нямам предпочитания"
                            ? ""
                            : "Нямам предпочитания"
                        );
                      }}
                    />
                    <label className="ml-2 cursor-pointer hover:text-[#d94545]">
                      Нямам предпочитания
                    </label>
                  </div>
                  <div className="text-right mt-2">
                    <small>{`${interests.length} / 200`}</small>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <input
                  type="text"
                  className="input-field form-control bg-opacity-70 border-2 rounded-lg p-4 mb-2 text-white glow-effect transition-all duration-300 hover:text-[#d94545]"
                  placeholder={currentQuestion.placeholder}
                  value={currentQuestion.value}
                  onChange={(e) =>
                    handleInputChange(currentQuestion.setter, e.target.value)
                  }
                  required
                />
                <div className="flex items-center text-white">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={currentQuestion.value === "Нямам предпочитания"}
                    onChange={() => {
                      currentQuestion.setter(
                        currentQuestion.value === "Нямам предпочитания"
                          ? ""
                          : "Нямам предпочитания"
                      );
                    }}
                  />
                  <label className="ml-2 cursor-pointer hover:text-[#d94545]">
                    Нямам предпочитания
                  </label>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div
            className={`grid gap-4 ${
              (currentQuestion.options?.length ?? 0) > 6
                ? "grid-cols-2 md:grid-cols-4"
                : "grid-cols-1"
            }`}
          >
            {currentQuestion.options?.map((answer: string, index: number) => (
              <div
                key={index}
                className={`${
                  selectedAnswer && selectedAnswer.includes(answer)
                    ? "selected-answer"
                    : "question"
                } bg-opacity-70 border-2 text-white rounded-lg p-4 glow-effect transition-all duration-300 ${
                  selectedAnswer && selectedAnswer.includes(answer)
                    ? "transform scale-105"
                    : "hover:bg-[#d94545] hover:text-white"
                }`}
              >
                <button
                  className="block w-full p-2 rounded"
                  onClick={() =>
                    handleAnswerClick(currentQuestion.setter, answer)
                  }
                >
                  {answer}
                </button>
              </div>
            ))}
          </div>
        )}

        <div
          className={`next bg-red-600 bg-opacity-70 text-white rounded-lg p-4 mt-4 transition-all duration-500 ${
            (selectedAnswer && selectedAnswer.length > 0) ||
            (currentQuestion.isInput && currentQuestion.value)
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          {currentQuestionIndex === totalQuestions - 1 ? (
            <div>
              <button
                onClick={() => {
                  if (recommendationList.length > 0) {
                    handleOpenModal(); // Open modal for confirmation
                  } else {
                    handleSubmitTest(); // Directly submit if no recommendations
                  }
                }}
                className="block w-full p-2 text-white rounded hover:bg-red-700"
                disabled={
                  !(
                    (selectedAnswer && selectedAnswer.length > 0) ||
                    currentQuestion.value
                  )
                }
              >
                Submit
              </button>
              {isModalOpen && recommendationList.length > 0 && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="bg-white p-6 rounded shadow-lg space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                      Are you sure you want to submit the test?
                    </h2>
                    <p className="text-sm text-gray-600">
                      Once submitted, you cannot change your answers.
                    </p>
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={handleCloseModal}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          handleSubmitTest(); // Submit the test
                          handleCloseModal(); // Close the modal
                        }}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={handleNext}
              className="block w-full p-2 text-white rounded hover:bg-red-700"
              disabled={
                !(
                  (selectedAnswer && selectedAnswer.length > 0) ||
                  currentQuestion.value
                )
              }
            >
              Next Question
            </button>
          )}
        </div>
        {recommendationList.length > 0 && !submitted && (
          <div
            className={`absolute top-0 left-0 w-full flex justify-center items-center transition-transform duration-500 ${
              (selectedAnswer && selectedAnswer.length > 0) ||
              (currentQuestion.isInput && currentQuestion.value)
                ? "translate-y-16"
                : "translate-y-0"
            }`}
          >
            <button
              onClick={handleViewRecommendations}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition"
            >
              View Recommendations
            </button>
          </div>
        )}
      </div>
    </CSSTransition>
  );
};

interface RecommendationsProps {
  recommendationList: Movie[];
}

export const Recommendations: FC<RecommendationsProps> = ({
  recommendationList
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [allowHideText, setAllowHideText] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!recommendationList.length) {
    return <div>No recommendations available.</div>;
  }

  const movie = recommendationList[currentIndex];
  const rottenTomatoesRating =
    movie.ratings?.find((rating) => rating.Source === "Rotten Tomatoes")
      ?.Value || "N/A";

  const plotPreviewLength = 150;
  const animationDuration = 800;

  const toggleExpand = () => {
    if (isExpanded) {
      setAllowHideText(false);
      setTimeout(() => setAllowHideText(true), animationDuration);
    }
    setIsExpanded((prev) => !prev);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === recommendationList.length - 1 ? 0 : prevIndex + 1
    );
    setIsExpanded(false);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? recommendationList.length - 1 : prevIndex - 1
    );
    setIsExpanded(false);
  };

  const shouldShowFullPlot =
    isExpanded || (!allowHideText && movie.plot?.length > plotPreviewLength);

  return (
    <div className="relative flex items-center justify-between bg-gray-800 text-white rounded-lg p-8 mt-4 max-w-7xl mx-auto">
      {/* Left Arrow - Outside the Card */}
      <button
        onClick={handlePrevious}
        className="absolute left-[-120px] top-1/2 transform -translate-y-1/2 text-white text-6xl hover:text-gray-400 transition"
      >
        &lt;
      </button>

      {/* Movie Details Card */}
      <div className="flex w-full items-center">
        {/* Poster Section */}
        <div className="flex-shrink-0 mr-8">
          <img
            src={movie.poster}
            alt={`${movie.title_en || "Movie"} Poster`}
            className="rounded-lg w-96 h-auto"
          />
        </div>

        {/* Details Section */}
        <div className="flex-grow">
          {/* Sticky Title and Ratings */}
          <div className="sticky top-0 bg-gray-800 z-10 pb-4 mb-4">
            <h2 className="text-3xl font-bold mb-1">
              {movie.title_bg || "Title Not Available"}
            </h2>
            <p className="text-lg font-semibold text-gray-400 mb-2">
              {movie.title_en || "English Title Not Available"}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              {movie.genre_bg || "Genre Unknown"} |{" "}
              {movie.year || "Year Unknown"} | Rated: {movie.rated || "N/A"}
            </p>
            <div className="flex items-center space-x-8 mb-4">
              {/* IMDB Rating */}
              <div className="flex items-center space-x-2">
                <FaStar className="text-[#FFCC33] w-8 h-8" />
                <span className="text-[#FFCC33] font-bold text-lg">
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
                  <span className="text-xl">{movie.metascore || "N/A"}</span>
                </div>
                <span className="text-white font-semibold">Metascore</span>
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
              <h3 className="text-lg font-semibold mb-2">Why We Recommend</h3>
              <p className="text-gray-300">{movie.reason}</p>
            </div>
          )}

          {/* Plot */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Plot</h3>
            <div
              className={`transition-all duration-[800ms] ease-in-out overflow-hidden ${
                isExpanded
                  ? "max-h-[1000px] opacity-100"
                  : "max-h-20 opacity-80"
              }`}
            >
              <p className="text-gray-300">
                {movie.description &&
                movie.description.length <= plotPreviewLength
                  ? movie.description
                  : shouldShowFullPlot
                  ? movie.description
                  : `${movie.description?.substring(0, plotPreviewLength)}...`}
              </p>
            </div>
            {movie.description &&
              movie.description.length > plotPreviewLength && (
                <button
                  onClick={toggleExpand}
                  className="mt-2 text-blue-400 underline hover:text-blue-300 transition"
                >
                  {isExpanded ? "Show Less" : "Show More"}
                </button>
              )}
          </div>

          {/* Movie Details */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Details</h3>
            <ul className="text-gray-300 space-y-1">
              <li>
                <strong>Director:</strong> {movie.director || "Unknown"}
              </li>
              <li>
                <strong>Writers:</strong> {movie.writer || "Unknown"}
              </li>
              <li>
                <strong>Actors:</strong> {movie.actors || "Unknown"}
              </li>
              <li>
                <strong>Awards:</strong> {movie.awards || "None"}
              </li>
              <li>
                <strong>Box Office:</strong> {movie.boxOffice || "N/A"}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <button
        onClick={handleNext}
        className="absolute right-[-120px] top-1/2 transform -translate-y-1/2 text-white text-6xl hover:text-gray-400 transition"
      >
        &gt;
      </button>
    </div>
  );
};

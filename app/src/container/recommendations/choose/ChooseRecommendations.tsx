import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import FadeInWrapper from "../../../components/common/loader/fadeinwrapper";
import Loader from "../../../components/common/loader/Loader";
import WidgetCards from "./components/WidgetCardsComponents";
import { DataType, UserData } from "./choose-types";
import { fetchData } from "./helper_functions";

const ChooseRecommendations: FC = () => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Състояния за задържане на извлечени данни
  const [data, setData] = useState<DataType>({
    usersCount: [], // Броя на потребителите
    topGenres: [], // Топ жанрове
    oscarsByMovie: [], // Оскари по филми
    totalAwards: [], // Общо награди
    averageBoxOfficeAndScores: [] // Среден боксофис и оценки
  });

  // Състояние за потребителски данни
  const [userData, setUserData] = useState<UserData>({
    id: 0, // ID на потребителя
    first_name: "", // Име на потребителя
    last_name: "", // Фамилия на потребителя
    email: "" // Имейл на потребителя
  });

  const question = {
    question: "Какво искате да разгледате в момента?",
    options: ["Филми и сериали", "Книги"]
  };

  const handleAnswerClick = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleClick = () => {
    if (!selectedAnswer) return;

    setLoading(true); // Set loading to true when navigation starts

    // Navigate to the respective route after the fade-out effect
    if (selectedAnswer === "Филми и сериали") {
      navigate("/app/recommendations/movies_series");
    } else if (selectedAnswer === "Книги") {
      navigate("/app/recommendations/books");
    }

    setLoading(false); // Stop loading after navigation
  };

  useEffect(() => {
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken"); // Вземане на токен от localStorage или sessionStorage
    if (token) {
      fetchData(token, setData, setUserData); // Извличане на данни с помощта на fetchData функцията
      console.log("fetching"); // Лог за следене на извличането на данни
    }
  }, []); // Празен масив като зависимост, за да се извика само веднъж при рендиране на компонента

  return (
    <FadeInWrapper>
      <CSSTransition
        in={!loading}
        timeout={500}
        classNames="fade"
        unmountOnExit
      >
        <div>
          <div className="md:flex block items-center justify-between my-[1.5rem] page-header-breadcrumb">
            <div>
              <p className="font-semibold text-[1.125rem] text-defaulttextcolor dark:text-defaulttextcolor/70 !mb-0 ">
                Здравейте, {userData.first_name} {userData.last_name}!
              </p>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-x-6">
            <WidgetCards data={data} />
          </div>

          <div className="flex items-center justify-center px-4">
            <div className="w-full max-w-4xl py-8 px-4">
              <div className="question bg-opacity-70 border-2 text-white rounded-lg p-4 glow-effect transition-all duration-300">
                <h2 className="text-xl font-semibold break-words">
                  {question.question}
                </h2>
              </div>

              <div
                className={`grid gap-4 mt-8 ${
                  (question.options.length ?? 0) > 6
                    ? "grid-cols-2 md:grid-cols-5"
                    : "grid-cols-1"
                }`}
              >
                {question.options.map((option) => (
                  <div
                    key={option}
                    onClick={() => handleAnswerClick(option)}
                    className={`${
                      selectedAnswer === option
                        ? "selected-answer transform scale-105"
                        : "question hover:bg-secondary hover:text-white"
                    } bg-opacity-70 p-6 text-white rounded-lg glow-effect transition-all duration-300 cursor-pointer flex justify-center items-center text-center`}
                  >
                    {option}
                  </div>
                ))}
              </div>

              <button
                onClick={handleClick}
                className={`next glow-next bg-opacity-70 text-white font-bold rounded-lg p-6 mt-4 flex justify-center items-center w-full transition-all duration-300 ease-in-out transform ${
                  selectedAnswer
                    ? "opacity-100 pointer-events-auto cursor-pointer hover:scale-105"
                    : "opacity-50 pointer-events-none cursor-not-allowed"
                }`}
                disabled={!selectedAnswer}
              >
                Следващ въпрос
              </button>
            </div>
          </div>
        </div>
      </CSSTransition>

      <CSSTransition
        in={loading}
        timeout={500}
        classNames="fade"
        unmountOnExit
        key="loading"
      >
        <Loader />
      </CSSTransition>
    </FadeInWrapper>
  );
};

export default ChooseRecommendations;

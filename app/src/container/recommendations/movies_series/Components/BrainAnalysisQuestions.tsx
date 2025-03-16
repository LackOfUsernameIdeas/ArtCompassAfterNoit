import { FC, useState } from "react";
import { CSSTransition } from "react-transition-group";
import {
  MoviesSeriesUserPreferences,
  NotificationState,
  RecommendationsAnalysis
} from "../moviesSeriesRecommendations-types";
import { handleSubmit } from "../helper_functions";
import BrainAnalysisTrackStats from "./BrainAnalysisTrackStats";

// Компонент за въпросите по време на мозъчния анализ
export const BrainAnalysisQuestions: FC<{
  setLoading: React.Dispatch<React.SetStateAction<boolean>>; // Функция за задаване на състоянието за зареждане
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>; // Функция за задаване на състоянието за изпращане
  setNotification: React.Dispatch<
    React.SetStateAction<NotificationState | null>
  >;
  setRecommendationList: React.Dispatch<React.SetStateAction<any[]>>;
  setRecommendationsAnalysis: React.Dispatch<
    React.SetStateAction<RecommendationsAnalysis>
  >;
  setBookmarkedMovies: React.Dispatch<
    React.SetStateAction<{ [key: string]: any }>
  >;
  token: string | null;
  submitCount: number;
  setSubmitCount: React.Dispatch<React.SetStateAction<number>>;
}> = ({
  setLoading,
  setSubmitted,
  setNotification,
  setRecommendationList,
  setRecommendationsAnalysis,
  setBookmarkedMovies,
  token,
  submitCount,
  setSubmitCount
}) => {
  // Състояния за текущия индекс на въпроса, показване на въпроса, дали анализът е завършен и cooldown между въпроси
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showQuestion, setShowQuestion] = useState(true);
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false);
  const [isOnCooldown, setIsOnCooldown] = useState(false);

  // Примерни въпроси за мозъчния анализ
  const questions = [
    {
      question: "Analyzing your emotional response to drama",
      description:
        "The device is measuring your brain's reaction to dramatic scenes",
      image: "example image 1"
    },
    {
      question: "Examining your response to comedy",
      description:
        "The device is detecting patterns in your response to humorous content",
      image: "example image 2"
    },
    {
      question: "Testing your engagement with action sequences",
      description:
        "The system is tracking how your brain processes fast-paced content",
      image: "example image 3"
    },
    {
      question: "Analyzing your attention to detail",
      description:
        "The device is measuring how your brain focuses on visual details",
      image: "example image 4"
    },
    {
      question: "Examining your emotional memory connections",
      description:
        "The system is detecting how your brain connects emotions to memories",
      image: "example image 5"
    }
  ];

  // Общо количество въпроси
  const totalQuestions = questions.length;
  // Текущият въпрос, който ще бъде показан
  const currentQuestion = questions[currentQuestionIndex];

  const moviesSeriesUserPreferences: MoviesSeriesUserPreferences = {
    recommendationType: "", // Вид на предпочитанията
    genres: [], // Жанрове на английски и български
    moods: [], // Настроения
    timeAvailability: "", // Наличност на време
    age: "", // Възраст
    actors: "", // Любими актьори
    directors: "", // Любими режисьори
    interests: "", // Интереси
    countries: "", // Предпочитани държави
    pacing: "", // Бързина на сюжетното действие
    depth: "", // Дълбочина на историята
    targetGroup: "" // Целева група
  };

  // Функция за преминаване към следващия въпрос
  const handleNext = () => {
    // Ако има активен cooldown, не се активира функцията
    if (isOnCooldown) return;
    setIsOnCooldown(true); // Слагаме cooldown
    // Изключваме показването на въпроса (за анимация)
    setShowQuestion(false);
    setTimeout(() => {
      // Проверяваме дали има още въпроси
      if (currentQuestionIndex < totalQuestions - 1) {
        // Ако има, увеличаваме индекса на въпроса
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      } else {
        // Ако няма повече въпроси, маркираме анализата като завършена
        setIsAnalysisComplete(true);
      }
      // Включваме отново показването на въпроса
      setShowQuestion(true);
      setTimeout(() => {
        setIsOnCooldown(false); // Премахваме cooldown
      }, 600);
    }, 500); // Задаваме забавяне за анимацията
  };

  // Функция за изпращане на заявки за препоръки
  const handleRecommendationsSubmit = async () => {
    await handleSubmit(
      setNotification,
      setLoading,
      setSubmitted,
      setSubmitCount,
      setRecommendationList,
      setRecommendationsAnalysis,
      setBookmarkedMovies,
      token,
      submitCount,
      true,
      moviesSeriesUserPreferences
    );
  };

  return (
    <div>
      <CSSTransition
        in={showQuestion}
        timeout={500} // Време за анимация
        classNames="fade"
        unmountOnExit
      >
        <div className="w-full max-w-4xl">
          {isAnalysisComplete ? (
            <BrainAnalysisTrackStats
              handleRecommendationsSubmit={handleRecommendationsSubmit}
            />
          ) : (
            <>
              <div className="question bg-opacity-70 border-2 text-white rounded-lg p-4 glow-effect transition-all duration-300">
                <h2 className="text-xl font-semibold break-words">
                  {currentQuestion.question}
                </h2>
                <p className="text-sm text-gray-500 mt-2">
                  {currentQuestion.description}
                </p>
              </div>

              {/* Показваме изображението за пример (като част от въпроса) */}
              <div className="mt-8 border-2 rounded-lg p-4 bg-opacity-50 bg-black text-white">
                <div className="flex justify-center items-center h-64 bg-gray-800 rounded-lg">
                  <p className="text-lg text-center">{currentQuestion.image}</p>
                </div>
                <div className="mt-4 flex justify-center">
                  <div className="h-4 w-full max-w-md bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-secondary transition-all duration-3000 ease-linear"
                      style={{
                        width: `${
                          ((currentQuestionIndex + 1) / totalQuestions) * 100
                        }%`
                      }}
                    ></div>
                  </div>
                </div>
                <p className="text-center mt-2 text-gray-400">
                  Analyzing brain responses... {currentQuestionIndex + 1}/
                  {totalQuestions}
                </p>
              </div>

              {/* Бутон за преминаване към следващия въпрос или завършване на анализа */}
              <div
                onClick={handleNext}
                className="next glow-next bg-opacity-70 text-white font-bold rounded-lg p-6 mt-6 flex justify-center items-center transition-all duration-300 ease-in-out transform opacity-100 cursor-pointer hover:scale-105"
              >
                {currentQuestionIndex === totalQuestions - 1
                  ? "Complete Analysis"
                  : "Next Question"}
              </div>
            </>
          )}
        </div>
      </CSSTransition>
    </div>
  );
};

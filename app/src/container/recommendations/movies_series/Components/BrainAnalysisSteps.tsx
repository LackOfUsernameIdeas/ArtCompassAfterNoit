import { FC, useState, useEffect } from "react";
import { CSSTransition } from "react-transition-group";
import {
  MoviesSeriesUserPreferences,
  NotificationState,
  RecommendationsAnalysis
} from "../moviesSeriesRecommendations-types";
import { handleSubmit } from "../helper_functions";
import BrainAnalysisTrackStats from "../../../../components/common/brainAnalysis/BrainAnalysisTrackStats";
import { BrainData } from "@/container/types_common";
import Loader from "@/components/common/loader/Loader";
import {
  connectSocketIO,
  MAX_DATA_POINTS,
  updateSeriesData
} from "@/container/helper_functions_common";
import { steps } from "@/container/data_common";

// Компонент за въпросите по време на мозъчния анализ
export const BrainAnalysisSteps: FC<{
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
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
  submitted: boolean;
  token: string | null;
  submitCount: number;
  setSubmitCount: React.Dispatch<React.SetStateAction<number>>;
  setIsBrainAnalysisComplete: React.Dispatch<React.SetStateAction<boolean>>;
  isBrainAnalysisComplete: boolean;
}> = ({
  setSubmitted,
  setNotification,
  setRecommendationList,
  setRecommendationsAnalysis,
  setBookmarkedMovies,
  submitted,
  token,
  submitCount,
  setSubmitCount,
  setIsBrainAnalysisComplete,
  isBrainAnalysisComplete
}) => {
  // Състояния за текущия индекс на въпроса, показване на въпроса, дали анализът е завършен и cooldown между въпроси
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showStep, setShowStep] = useState(true);
  const [transmissionComplete, setTransmissionComplete] = useState(false);
  const [isOnCooldown, setIsOnCooldown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [chartData, setChartData] = useState<BrainData | null>(null);
  const [seriesData, setSeriesData] = useState<BrainData[]>([]);
  const [attentionMeditation, setAttentionMeditation] = useState<
    {
      name: string;
      data: { x: string; y: number }[];
    }[]
  >([
    { name: "Attention", data: [] },
    { name: "Meditation", data: [] }
  ]);

  const [selectedImage, setSelectedImage] = useState<string | null>(null); // Състояние за избраното изображение (за показване в пълен размер)
  const closeModal = () => setSelectedImage(null); // Функция за затваряне на прозорецa с изображението

  useEffect(() => {
    if (isBrainAnalysisComplete) {
      connectSocketIO(
        setChartData,
        setTransmissionComplete,
        setConnectionError
      );
    }

    return () => {
      if (isBrainAnalysisComplete) {
        console.log(
          "Component unmounted, WebSocket connection should be closed."
        );
      }
    };
  }, [isBrainAnalysisComplete]);

  const retryConnection = () => {
    setConnectionError(false);
    connectSocketIO(setChartData, setTransmissionComplete, setConnectionError);
  };

  useEffect(() => {
    if (!chartData) return;
    if (!submitted) setLoading(false);

    setSeriesData((prevData) => {
      const newData = [...prevData, { ...chartData }];

      // Филтриране на данните – изключва обекти, в които ВСИЧКИ стойности са 0
      const filteredData = newData.filter(
        (data) =>
          !(
            data.attention === 0 &&
            data.meditation === 0 &&
            data.delta === 0 &&
            data.theta === 0 &&
            data.lowAlpha === 0 &&
            data.highAlpha === 0 &&
            data.lowBeta === 0 &&
            data.highBeta === 0 &&
            data.lowGamma === 0 &&
            data.highGamma === 0
          )
      );
      return filteredData.length > MAX_DATA_POINTS
        ? filteredData.slice(-MAX_DATA_POINTS)
        : filteredData;
    });

    setAttentionMeditation((prevData) =>
      prevData.map((stat, index) => {
        const key = index === 0 ? "attention" : "meditation";
        const value = chartData[key];
        return {
          ...stat,
          data: updateSeriesData(
            stat.data,
            chartData.time,
            typeof value === "number" ? value : 0
          )
        };
      })
    );
  }, [chartData]);

  // Общо количество стъпки
  const totalSteps = steps.length;
  // Текущата стъпка, който ще бъде показан
  const currentStep = steps[currentStepIndex];

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
    setShowStep(false);
    setTimeout(() => {
      // Проверяваме дали има още въпроси
      if (currentStepIndex < totalSteps - 1) {
        // Ако има, увеличаваме индекса на въпроса
        setCurrentStepIndex((prevIndex) => prevIndex + 1);
      } else {
        // Ако няма повече въпроси, маркираме анализата като завършена
        setIsBrainAnalysisComplete(true);
        setLoading(true);
      }
      // Включваме отново показването на въпроса
      setShowStep(true);
      setTimeout(() => {
        setIsOnCooldown(false); // Премахваме cooldown
      }, 500);
    }, 500); // Задаваме забавяне за анимацията
  };

  const isBackDisabled = currentStepIndex === 0;

  // Функция за връщане на предишна стъпка
  const handleBack = () => {
    if (currentStepIndex > 0) {
      setShowStep(false); // Пускане на анимация
      setTimeout(() => {
        setCurrentStepIndex((prevIndex) => prevIndex - 1);
        setShowStep(true);
      }, 500); // Задаваме забавяне за анимацията
    }
  };

  // Функция за пропускане на стъпките
  const handleSkipAll = () => {
    setIsBrainAnalysisComplete(true); // Mark analysis as completed
    setLoading(true);
  };

  // Функция за изпращане на заявки за препоръки
  const handleRecommendationsSubmit = async (brainData: BrainData[]) => {
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
      moviesSeriesUserPreferences,
      brainData,
      "movies_series"
    );
  };

  return (
    <div>
      {/* Everything disappears when there's a connection error */}
      <CSSTransition
        in={!connectionError}
        timeout={400}
        classNames="fade"
        unmountOnExit
      >
        <div>
          <CSSTransition
            in={loading}
            timeout={500} // Време за анимация
            classNames="fade"
            unmountOnExit
          >
            <Loader brainAnalysis />
          </CSSTransition>
          <CSSTransition
            in={!loading && !isBrainAnalysisComplete && showStep}
            timeout={500} // Време за анимация
            classNames="fade"
            unmountOnExit
          >
            <div className="w-full max-w-4xl">
              <div className="question bg-opacity-70 border-2 text-white rounded-lg p-4 glow-effect transition-all duration-300">
                <h2 className="text-xl font-semibold break-words">
                  {currentStep.step}
                </h2>
                <p className="text-sm text-gray-500 mt-2">
                  {currentStep.description}
                </p>
              </div>

              <div
                className={`flex ${
                  isBackDisabled ? "justify-end" : "justify-between"
                }`}
              >
                {!isBackDisabled && (
                  <div className="flex justify-start">
                    <button
                      onClick={handleBack}
                      className="back-button text-secondary dark:text-white hover:opacity-70 text-3xl transition-all duration-300 "
                    >
                      &#8592;
                    </button>
                  </div>
                )}
                {!isBrainAnalysisComplete && (
                  <button
                    onClick={handleSkipAll}
                    className="back-button text-secondary dark:text-white hover:opacity-70 text-3xl transition-all duration-300 flex items-center gap-2"
                  >
                    <span className="text-sm">Пропускане на стъпките</span>{" "}
                    &#8594;
                  </button>
                )}
              </div>

              {/* Показваме изображението за пример (като част от въпроса) */}
              <div className="border-2 border-primary rounded-lg p-4 bg-opacity-50 bg-bodybg text-white">
                <div className="flex flex-wrap justify-center gap-4">
                  {currentStep.images?.map((imgSrc, index) => (
                    <img
                      key={index}
                      src={imgSrc}
                      alt={`Изображение ${index}`}
                      className="h-32 cursor-pointer rounded-lg object-contain border-2 border-primary transition-transform hover:scale-105"
                      onClick={() => setSelectedImage(imgSrc)}
                    />
                  ))}
                </div>
                {currentStep.fileName && (
                  <a
                    href={`https://noit.eu/${currentStep.fileName}`} // Adjusted URL to your server location
                    download
                    style={{
                      marginTop: "10px",
                      padding: "10px 20px",
                      backgroundColor: "#28a745",
                      color: "white",
                      textDecoration: "none",
                      borderRadius: "5px",
                      display: "inline-block",
                      fontSize: "16px"
                    }}
                  >
                    ⬇️ Свали програмата
                  </a>
                )}
                {selectedImage && (
                  <div
                    className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
                    onClick={closeModal}
                  >
                    <img
                      src={selectedImage}
                      alt="Full-size"
                      className="max-w-full max-h-full rounded-lg shadow-lg"
                      onClick={(e) => e.stopPropagation()} // Предотвратява затварянето при клик върху изображението
                    />
                    {/* Х Бутон */}
                    <button
                      onClick={closeModal}
                      className="absolute top-4 right-4 p-2 bg-opacity-60 rounded-full transition-transform duration-300 transform hover:scale-110 z-10"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
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
                          <stop offset="0" stopColor="#f44f5a"></stop>
                          <stop offset=".443" stopColor="#ee3d4a"></stop>
                          <stop offset="1" stopColor="#e52030"></stop>
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
                          <stop offset="0" stopColor="#a8142e"></stop>
                          <stop offset=".179" stopColor="#ba1632"></stop>
                          <stop offset=".243" stopColor="#c21734"></stop>
                        </linearGradient>
                        <path
                          fill="url(#hbE9Evnj3wAjjA2RX0We2b_OZuepOQd0omj_gr2)"
                          d="M24,30.821L35.599,42.42c0.774,0.774,2.028,0.774,2.802,0l4.019-4.019	c0.774-0.774,0.774-2.028,0-2.802L30.821,24L24,30.821z"
                        ></path>
                      </svg>
                    </button>
                  </div>
                )}

                <div className="mt-4 flex justify-center">
                  <div className="h-4 w-full max-w-md bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-secondary transition-all duration-3000 ease-linear"
                      style={{
                        width: `${(currentStepIndex / (totalSteps - 1)) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
                <p className="text-center mt-2 text-gray-400">
                  Разглеждане на стъпките... {currentStepIndex}/{totalSteps - 1}
                </p>
              </div>
              {/* Бутон за преминаване към следващия въпрос или завършване на анализа */}
              <div
                onClick={handleNext}
                className="next glow-next bg-opacity-70 text-white font-bold rounded-lg p-6 mt-6 flex justify-center items-center transition-all duration-300 ease-in-out transform opacity-100 cursor-pointer hover:scale-105"
              >
                {currentStepIndex === totalSteps - 1
                  ? "Напред към анализа"
                  : "Следваща стъпка"}
              </div>
            </div>
          </CSSTransition>
          <CSSTransition
            in={!loading && isBrainAnalysisComplete}
            timeout={500} // Време за анимация
            classNames="fade"
            unmountOnExit
          >
            <div className="w-full">
              <BrainAnalysisTrackStats
                handleRecommendationsSubmit={handleRecommendationsSubmit}
                transmissionComplete={transmissionComplete}
                seriesData={seriesData}
                chartData={chartData}
                attentionMeditation={attentionMeditation}
              />
            </div>
          </CSSTransition>
        </div>
      </CSSTransition>

      {/* Fade-in error message when connection fails */}
      <CSSTransition
        in={connectionError}
        timeout={500}
        classNames="fade"
        unmountOnExit
      >
        <div className="fixed inset-0 flex flex-col items-center justify-center space-y-4 text-center">
          <p>⚠️ Неуспешно свързване със сървъра.</p>
          <button
            onClick={retryConnection}
            className="mt-2 px-4 py-2 font-semibold rounded-lg hover:bg-opacity-80 transition"
          >
            🔄 Опитай отново
          </button>
        </div>
      </CSSTransition>
    </div>
  );
};

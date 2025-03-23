import { FC, useState, useEffect } from "react";
import { CSSTransition } from "react-transition-group";
import img0 from "@/assets/images/steps/0.jpg";
import img1_1 from "@/assets/images/steps/1.1.png";
import img1_2 from "@/assets/images/steps/1.2.png";
import img1_3 from "@/assets/images/steps/1.3.png";
import img1_4 from "@/assets/images/steps/1.4.png";
import img2 from "@/assets/images/steps/2.jpg";
import img3_1 from "@/assets/images/steps/3.1.png";
import img3_2 from "@/assets/images/steps/3.2.png";
import img3_3 from "@/assets/images/steps/3.3.png";
import img3_4 from "@/assets/images/steps/3.4.png";
import img4_1 from "@/assets/images/steps/4.1.png";
import img4_2 from "@/assets/images/steps/4.2.png";
import img5 from "@/assets/images/steps/5.png";
import img6_1 from "@/assets/images/steps/6.1.png";
import img6_2 from "@/assets/images/steps/6.2.png";
import img6_3 from "@/assets/images/steps/6.3.png";
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
  setIsAnalysisComplete: React.Dispatch<React.SetStateAction<boolean>>;
  isAnalysisComplete: boolean;
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
  setIsAnalysisComplete,
  isAnalysisComplete
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
    if (isAnalysisComplete) {
      connectSocketIO(
        setChartData,
        setTransmissionComplete,
        setConnectionError
      );
    }

    return () => {
      if (isAnalysisComplete) {
        console.log(
          "Component unmounted, WebSocket connection should be closed."
        );
      }
    };
  }, [isAnalysisComplete]);

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

  // Стъпки за успешно съставяне на мозъчен анализ
  const steps = [
    {
      step: "0. Въведение",
      description:
        "За да започнете мозъчния анализ, трябва да се сдобиете с устройството NeuroSky MindWave Mobile 2. Следвайте следващите стъпки, за да го използвате успешно.",
      images: [img0]
    },
    {
      step: "1. Сваляне на ThinkGear програмата - mwm2.neurosky.com",
      description:
        "Оттам избирате от опциите за изтегляне, спрямо вашата операционната система. След това разархивирате сваления файл и стартирате ThinkGear Connector - зелената иконка. Трябва да се появи долу вдясно иконка, наподобяваща мозък.",
      images: [img1_1, img1_2, img1_3, img1_4]
    },
    {
      step: "2. Пускане на устройството.",
      description: "Излиза синя светлина, когато е пуснато.",
      images: [img2]
    },
    {
      step: "3. Свързване на устройството.",
      description:
        "Трябва вашият компютър да поддържа Bluetooth (или да имате Bluetooth Adapter). Пускате го от настройките и натискате на опцията за добавяне на ново устройство. Свързвате се към MindWave Mobile (изчаквате, докато не видите иконката със СЛУШАЛКИ).",
      images: [img3_1, img3_2, img3_3, img3_4]
    },
    {
      step: "4. Конфигуриране на COM порт.",
      description:
        "След успешно свързване, отивате на More Bluetooth options и оттам в раздела COM ports. Трябва да видите на кой от тях е свързано устройството и ако не е, да добавите порт към него. Интересува ни OUTGOING порта. Той се обозначава с COM и съответната цифра (в примера от снимките, това е COM4). След като идентифицирате правилния порт, отивате и го пишете (пример: „COM4“) в ThinkGear Connector приложението на показаното поле.",
      images: [img4_1, img4_2]
    },
    {
      step: "5. Сваляне на програмата за свързване с АртКомпас",
      description:
        "След сваляне на архива го разархивирате и отваряте. Трябва да виждате .exe файла за свързване.",
      images: [img5],
      fileName: "artcompass_brain_analysis.zip"
    },
    {
      step: "6. Същинско свързване",
      description:
        "Ако първо сте пуснали ThinkGear Connector, след което сте включили устройството, след което Bluetooth на вашия компютър и най-накрая нашата програмата и видите, че иконката на ThinkGear долу вдясно е в синьо и пише, че има връзка с устройството и също така ви излезе прозореца за започване на сесията, значи успешно сте свързали устройството. **Ако все пак не излиза в command prompt-а съобщението за успешно свързване и не се появява прозореца на програмата, но въпреки това ThinkGear посочва, че има връзка, опитайте да рестартирате.**",
      images: [img6_1, img6_2, img6_3]
    }
  ];

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
        setIsAnalysisComplete(true);
        setLoading(true);
      }
      // Включваме отново показването на въпроса
      setShowStep(true);
      setTimeout(() => {
        setIsOnCooldown(false); // Премахваме cooldown
      }, 500);
    }, 500); // Задаваме забавяне за анимацията
  };

  // Функция за пропускане на въпросите
  const handleSkipAll = () => {
    setIsAnalysisComplete(true); // Mark analysis as completed
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
            in={!loading && !isAnalysisComplete && showStep}
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

              <div className="flex justify-end">
                {!isAnalysisComplete && (
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
              <div className="border-2 rounded-lg p-4 bg-opacity-50 bg-black text-white">
                <div className="flex flex-wrap justify-center gap-4">
                  {currentStep.images?.map((imgSrc, index) => {
                    console.log(imgSrc);
                    return (
                      <img
                        key={index}
                        src={imgSrc}
                        alt={`Изображение ${index}`}
                        className="h-32 cursor-pointer rounded-lg object-contain border-2 transition-transform hover:scale-105"
                        onClick={() => setSelectedImage(imgSrc)}
                      />
                    );
                  })}
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
            in={!loading && isAnalysisComplete}
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

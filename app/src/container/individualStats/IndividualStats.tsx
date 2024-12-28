import { FC, Fragment, useEffect, useState } from "react";
import { DataType, UserData } from "./individualStats-types";
import { checkTokenValidity, fetchData } from "./helper_functions";
import ProsperityTable from "./Components/ProsperityTable";
import { useNavigate } from "react-router-dom";
import FadeInWrapper from "../../components/common/loader/fadeinwrapper";
import { showNotification } from "../recommendations/helper_functions";
import Notification from "../../components/common/notification/Notification";
import { NotificationState } from "../recommendations/recommendations-types";
import RecommendationsTable from "./Components/RecommendationsTable";

interface IndividualStatsProps {}

const IndividualStats: FC<IndividualStatsProps> = () => {
  // Състояния за задържане на извлечени данни
  const [data, setData] = useState<DataType>({
    usersCount: [], // Броя на потребителите
    topRecommendations: {
      recommendationsCount: {
        movies: 0,
        series: 0
      },
      recommendations: []
    }, // Топ препоръки
    topGenres: [], // Топ жанрове
    genrePopularityOverTime: {}, // Популярност на жанровете през времето
    topActors: [], // Топ актьори
    topDirectors: [], // Топ режисьори
    topWriters: [], // Топ сценаристи
    oscarsByMovie: [], // Оскари по филми
    totalAwardsByMovieOrSeries: [], // Общо награди по филми или сериали
    totalAwards: [], // Общо награди
    sortedDirectorsByProsperity: [], // Режисьори, сортирани по процъфтяване
    sortedActorsByProsperity: [], // Актьори, сортирани по процъфтяване
    sortedWritersByProsperity: [], // Сценаристи, сортирани по процъфтяване
    sortedMoviesByProsperity: [], // Филми, сортирани по процъфтяване
    sortedMoviesAndSeriesByMetascore: [], // Филми и сериали, сортирани по Metascore
    sortedMoviesAndSeriesByIMDbRating: [], // Филми и сериали, сортирани по IMDb рейтинг
    sortedMoviesAndSeriesByRottenTomatoesRating: [], // Филми и сериали, сортирани по Rotten Tomatoes рейтинг
    averageBoxOfficeAndScores: [], // Среден боксофис и оценки
    topCountries: [] // Топ държави
  });

  // Състояние за потребителски данни
  const [userData, setUserData] = useState<UserData>({
    id: 0, // ID на потребителя
    first_name: "", // Име на потребителя
    last_name: "", // Фамилия на потребителя
    email: "" // Имейл на потребителя
  });

  const [notification, setNotification] = useState<NotificationState | null>(
    null
  ); // Състояние за показване на известия (например съобщения за грешки, успехи или предупреждения)

  const navigate = useNavigate();

  const handleNotificationClose = () => {
    // Функция за затваряне на известията
    if (notification?.type === "error") {
      // Ако известието е от тип "грешка", пренасочване към страницата за вход
      navigate("/signin");
    }
    setNotification(null); // Зануляване на известието
  };

  useEffect(() => {
    const validateToken = async () => {
      // Функция за проверка валидността на потребителския токен
      const redirectUrl = await checkTokenValidity(); // Извикване на помощна функция за валидиране на токена
      if (redirectUrl) {
        // Ако токенът е невалиден, показване на известие
        showNotification(
          setNotification, // Функция за задаване на известие
          "Вашата сесия е изтекла. Моля, влезте в профила Ви отново.", // Съобщение за известието
          "error" // Типът на известието (грешка)
        );
      }
    };

    validateToken(); // Стартиране на проверката на токена при първоначално зареждане на компонента
  }, []);

  useEffect(() => {
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken"); // Вземане на токен от localStorage или sessionStorage

    if (token) {
      fetchData(token, setUserData, setData); // Извличане на данни с помощта на fetchData функцията
      console.log("fetching"); // Лог за следене на извличането на данни
    }
  }, []); // Празен масив като зависимост, за да се извика само веднъж при рендиране на компонента

  return (
    <FadeInWrapper>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={handleNotificationClose}
        />
      )}
      <Fragment>
        <div className="md:flex block items-center justify-between my-[1.5rem] page-header-breadcrumb">
          <div>
            <p className="font-semibold text-[1.125rem] text-defaulttextcolor dark:text-defaulttextcolor/70 !mb-0 ">
              Здравейте, {userData.first_name} {userData.last_name}!
            </p>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-x-6">
          <div className="xxl:col-span-6 col-span-12">
            <RecommendationsTable data={data} />
          </div>

          <div className="xxl:col-span-6 col-span-12">
            <ProsperityTable data={data} />
          </div>
        </div>
        <div className="grid grid-cols-12 gap-x-6"></div>
        <div className="transition fixed inset-0 z-50 bg-gray-900 bg-opacity-50 dark:bg-opacity-80 opacity-0 hidden"></div>
      </Fragment>
    </FadeInWrapper>
  );
};

export default IndividualStats;

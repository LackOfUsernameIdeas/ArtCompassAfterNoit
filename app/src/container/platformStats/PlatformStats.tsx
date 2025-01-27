import { FC, Fragment, useEffect, useState } from "react";
import { DataType, UserData } from "./platformStats-types";
import { fetchData } from "./helper_functions";
import ActorsDirectorsWritersTable from "./Components/ActorsDirectorsWritersTable";
import ActorsDirectorsWritersTreemap from "./Components/ActorsDirectorsWritersTreemap";
import TopRecommendationsChartComponent from "./Components/TopRecommendationsChartComponent";
import CountryBarChartComponent from "./Components/CountryBarChartComponent";
import MoviesByProsperityBubbleChartComponent from "./Components/MoviesByProsperityBubbleChart";
import GenrePopularityOverTimeComponent from "./Components/GenrePopularityOverTimeComponent";
import MoviesAndSeriesByRatingsChartComponent from "./Components/MoviesAndSeriesByRatingsChartComponent";
import { useNavigate } from "react-router-dom";
import FadeInWrapper from "../../components/common/loader/fadeinwrapper";
import { validateToken } from "../helper_functions_common";
import Notification from "../../components/common/notification/Notification";
import { NotificationState } from "../types_common";

interface CrmProps {}

const Home: FC<CrmProps> = () => {
  // Състояния за задържане на извлечени данни
  const [data, setData] = useState<DataType>({
    topRecommendations: [], // Топ препоръки
    genrePopularityOverTime: {}, // Популярност на жанровете през времето
    topActors: [], // Топ актьори
    topDirectors: [], // Топ режисьори
    topWriters: [], // Топ сценаристи
    totalAwardsByMovieOrSeries: [], // Общо награди по филми или сериали
    sortedDirectorsByProsperity: [], // Режисьори, сортирани по просперитет
    sortedActorsByProsperity: [], // Актьори, сортирани по просперитет
    sortedWritersByProsperity: [], // Сценаристи, сортирани по просперитет
    sortedMoviesByProsperity: [], // Филми, сортирани по процъфтяване
    sortedMoviesAndSeriesByMetascore: [], // Филми и сериали, сортирани по Metascore
    sortedMoviesAndSeriesByIMDbRating: [], // Филми и сериали, сортирани по IMDb рейтинг
    sortedMoviesAndSeriesByRottenTomatoesRating: [], // Филми и сериали, сортирани по Rotten Tomatoes рейтинг
    topCountries: [] // Топ държави
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
    validateToken(setNotification); // Стартиране на проверката на токена при първоначално зареждане на компонента
  }, []);

  useEffect(() => {
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken"); // Вземане на токен от localStorage или sessionStorage
    if (token) {
      fetchData(token, setData); // Извличане на данни с помощта на fetchData функцията
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
        <div className="grid grid-cols-12 gap-x-6 mt-[1.5rem]">
          <div className="xxl:col-span-6 col-span-12">
            <div className="xxl:col-span-6 col-span-12">
              <MoviesByProsperityBubbleChartComponent data={data} />
              <GenrePopularityOverTimeComponent data={data} />
              <MoviesAndSeriesByRatingsChartComponent data={data} />
            </div>
          </div>
          <div className="xxl:col-span-6 col-span-12">
            <ActorsDirectorsWritersTable data={data} />
            <TopRecommendationsChartComponent data={data} />
            <ActorsDirectorsWritersTreemap data={data} />
            <CountryBarChartComponent data={data} />
          </div>
        </div>
      </Fragment>
    </FadeInWrapper>
  );
};

export default Home;

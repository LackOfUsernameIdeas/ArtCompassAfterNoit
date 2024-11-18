import { FC, Fragment, useEffect, useState } from "react";
import { DataType, UserData } from "./home-types";
import { checkTokenValidity, fetchData } from "./helper_functions";
import TableComponent from "./Statistics/TableComponent";
import TreemapComponent from "./Statistics/TreemapComponent";
import TopRecommendationsBarChartComponent from "./Statistics/TopRecommendationsBarChart";
import CountryBarChartComponent from "./Statistics/CountryBarChartComponent";
import MoviesByProsperityBubbleChartComponent from "./Statistics/MoviesByProsperityBubbleChartComponent";
import GenrePopularityOverTimeComponent from "./Statistics/GenrePopularityOverTimeComponent";
import MoviesAndSeriesByRatingsChartComponent from "./Statistics/MoviesAndSeriesByRatingsChartComponent";
import WidgetCards from "./Statistics/WidgetCards";
import { useNavigate } from "react-router-dom";

interface CrmProps {}

const Home: FC<CrmProps> = () => {
  // Състояния за задържане на извлечени данни
  const [data, setData] = useState<DataType>({
    usersCount: [], // Броя на потребителите
    topRecommendations: [], // Топ препоръки
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

  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      const redirectUrl = await checkTokenValidity(); // Проверка на валидността на токена
      if (redirectUrl) {
        navigate(redirectUrl); // Пренасочване, ако токенът не е валиден
      }
    };

    validateToken();
  }, [navigate]); // Добавяне на navigate като зависимост

  // Извличане на данни за потребителя и статистики за платформата (комбинирано в едно useEffect)
  useEffect(() => {
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken"); // Вземане на токен от localStorage или sessionStorage
    if (token) {
      fetchData(token, setUserData, setData); // Извличане на данни с помощта на fetchData функцията
      console.log("fetching"); // Лог за следене на извличането на данни
    }
  }, []); // Празен масив като зависимост, за да се извика само веднъж при рендиране на компонента

  return (
    <Fragment>
      <div className="md:flex block items-center justify-between my-[1.5rem] page-header-breadcrumb">
        <div>
          <p className="font-semibold text-[1.125rem] text-defaulttextcolor dark:text-defaulttextcolor/70 !mb-0 ">
            Здравейте, {userData.first_name} {userData.last_name}!
          </p>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-x-6">
        <WidgetCards data={data} />
        <div className="xxl:col-span-6 col-span-12">
          <div className="xxl:col-span-6 col-span-12">
            <MoviesByProsperityBubbleChartComponent data={data} />
            <GenrePopularityOverTimeComponent data={data} />
            <MoviesAndSeriesByRatingsChartComponent data={data} />
          </div>
        </div>
        <div className="xxl:col-span-6 col-span-12">
          <TableComponent data={data} />
          <TopRecommendationsBarChartComponent data={data} />
          <TreemapComponent data={data} />
          <CountryBarChartComponent data={data} />
        </div>
      </div>
      <div className="grid grid-cols-12 gap-x-6"></div>
      <div className="transition fixed inset-0 z-50 bg-gray-900 bg-opacity-50 dark:bg-opacity-80 opacity-0 hidden"></div>
    </Fragment>
  );
};

export default Home;

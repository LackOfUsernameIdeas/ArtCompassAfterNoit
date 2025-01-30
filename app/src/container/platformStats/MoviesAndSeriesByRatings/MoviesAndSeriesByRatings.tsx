import { FC, Fragment, useEffect, useState } from "react";
import { MoviesAndSeriesByRatingsDataType } from "../platformStats-types";
import { fetchData } from "../helper_functions";
import MoviesAndSeriesByRatingsComponent from "./Components/MoviesAndSeriesByRatingsChartComponent";
import { useNavigate } from "react-router-dom";
import FadeInWrapper from "../../../components/common/loader/fadeinwrapper";
import { validateToken } from "../../helper_functions_common";
import Notification from "../../../components/common/notification/Notification";
import { NotificationState } from "../../types_common";

interface MoviesAndSeriesByRatingsProps {}

const MoviesAndSeriesByRatings: FC<MoviesAndSeriesByRatingsProps> = () => {
  // Състояния за задържане на извлечени данни
  const [data, setData] = useState<MoviesAndSeriesByRatingsDataType>({
    sortedMoviesAndSeriesByMetascore: [], // Филми и сериали, сортирани по Metascore
    sortedMoviesAndSeriesByIMDbRating: [], // Филми и сериали, сортирани по IMDb рейтинг
    sortedMoviesAndSeriesByRottenTomatoesRating: [] // Филми и сериали, сортирани по Rotten Tomatoes рейтинг
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
      fetchData(token, setData, [
        "sortedMoviesAndSeriesByMetascore",
        "sortedMoviesAndSeriesByIMDbRating",
        "sortedMoviesAndSeriesByRottenTomatoesRating"
      ]); // Извличане на данни с помощта на fetchData функцията
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
        <div className="mt-[1.5rem]">
          <MoviesAndSeriesByRatingsComponent data={data} />
        </div>
      </Fragment>
    </FadeInWrapper>
  );
};

export default MoviesAndSeriesByRatings;

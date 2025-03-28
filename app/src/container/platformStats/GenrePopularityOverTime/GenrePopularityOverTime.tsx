import { FC, Fragment, useEffect, useState } from "react";
import { GenrePopularityOverTimeDataType } from "../platformStats-types";
import { fetchData } from "../helper_functions";
import GenrePopularityOverTimeComponent from "./Components/GenrePopularityOverTimeComponent";
import { useNavigate } from "react-router-dom";
import FadeInWrapper from "../../../components/common/loader/fadeinwrapper";
import { validateToken } from "../../helper_functions_common";
import Notification from "../../../components/common/notification/Notification";
import { NotificationState } from "../../types_common";

interface GenrePopularityOverTimeProps {}

const GenrePopularityOverTime: FC<GenrePopularityOverTimeProps> = () => {
  // Състояния за задържане на извлечени данни
  const [data, setData] = useState<GenrePopularityOverTimeDataType>({
    genrePopularityOverTime: {} // Популярност на жанровете през времето
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
      fetchData(token, setData, ["genrePopularityOverTime"]); // Извличане на данни с помощта на fetchData функцията
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
          <GenrePopularityOverTimeComponent data={data} />
        </div>
      </Fragment>
    </FadeInWrapper>
  );
};

export default GenrePopularityOverTime;

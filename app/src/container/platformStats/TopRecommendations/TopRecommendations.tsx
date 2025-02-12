import { FC, Fragment, useEffect, useState } from "react";
import { TopRecommendationsDataType } from "../platformStats-types";
import { fetchData } from "../helper_functions";
import { useNavigate } from "react-router-dom";
import FadeInWrapper from "../../../components/common/loader/fadeinwrapper";
import { validateToken } from "../../helper_functions_common";
import Notification from "../../../components/common/notification/Notification";
import { NotificationState } from "../../types_common";
import TopActorsDirectorsWritersComponent from "./Components/TopActorsDirectorsWritersComponent";
import TopMoviesSeriesComponent from "./Components/TopMoviesSeriesComponent";

interface TopRecommendationsProps {}

const TopRecommendations: FC<TopRecommendationsProps> = () => {
  // Състояния за задържане на извлечени данни
  const [data, setData] = useState<TopRecommendationsDataType>({
    topActors: [], // Топ актьори
    topDirectors: [], // Топ режисьори
    topWriters: [], // Топ сценаристи
    topRecommendations: [] // Топ препоръки
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
        "topActors",
        "topDirectors",
        "topWriters",
        "topRecommendations"
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
        <div className="text-center !text-lg box p-6 flex flex-col mt-[1.5rem]">
          <h2 className="text-2xl opsilion text-defaulttextcolor dark:text-white/80">
            Тук може да видите кои са най-често препоръчваните{" "}
            <span className="font-bold text-primary">
              актьори, режисьори, сценаристи, филми и сериали{" "}
            </span>
            !
          </h2>
        </div>
        <div className="grid grid-cols-12 gap-x-6 mt-[1.5rem]">
          <div className="xxl:col-span-6 col-span-12">
            <TopActorsDirectorsWritersComponent data={data} />
          </div>
          <div className="xxl:col-span-6 col-span-12">
            <TopMoviesSeriesComponent data={data} />
          </div>
        </div>
      </Fragment>
    </FadeInWrapper>
  );
};

export default TopRecommendations;

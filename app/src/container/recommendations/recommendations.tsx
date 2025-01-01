import { FC, useEffect, useState } from "react";
import { Quiz } from "./Components/Quiz";
import { useNavigate } from "react-router-dom";
import { checkTokenValidity } from "../home/helper_functions";
import { showNotification } from "./helper_functions";
import FadeInWrapper from "../../components/common/loader/fadeinwrapper";
import Notification from "../../components/common/notification/Notification";
import { NotificationState } from "./recommendations-types";
import BookmarkAlert from "./Components/BookmarkAlert";

interface RecommendationsProps {}

const Recommendations: FC<RecommendationsProps> = () => {
  const navigate = useNavigate();
  const [notification, setNotification] = useState<NotificationState | null>(
    null // Състояние за съхраняване на текущото известие (съобщение и тип)
  );

  const [bookmarkedMovies, setBookmarkedMovies] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    const validateToken = async () => {
      // Функция за проверка валидността на токена на потребителя
      const redirectUrl = await checkTokenValidity(); // Извикване на помощна функция за валидиране на токена
      if (redirectUrl) {
        // Ако токенът е невалиден, показване на известие за грешка
        showNotification(
          setNotification, // Функция за задаване на известие
          "Вашата сесия е изтекла. Моля, влезте в профила Ви отново.", // Съобщение за известието
          "error" // Тип на известието (грешка)
        );
      }
    };

    validateToken(); // Стартиране на валидиране на токена при зареждане на компонента
  }, []); // Празен масив зависимости, за да се извика само веднъж

  const handleNotificationClose = () => {
    // Функция за затваряне на текущото известие
    if (notification?.type === "error") {
      // Ако известието е от тип "грешка", пренасочване към страницата за вход
      navigate("/signin");
    }
    setNotification(null); // Зануляване на състоянието за известието
  };

  const handleBookmarkClick = (imdbID: string) => {
    setBookmarkedMovies((prev) => ({
      ...prev,
      [imdbID]: !prev[imdbID] // Toggle the bookmark status
    }));
  };

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={handleNotificationClose}
        />
      )}
      {/* <BookmarkAlert isBookmarked={bookmarkedMovies} /> */}
      <FadeInWrapper>
        <Quiz
          bookmarkedMovies={bookmarkedMovies}
          handleBookmarkClick={handleBookmarkClick}
        />
      </FadeInWrapper>
    </>
  );
};

export default Recommendations;

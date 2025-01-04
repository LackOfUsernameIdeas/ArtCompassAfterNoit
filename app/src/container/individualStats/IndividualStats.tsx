import { FC, Fragment, useEffect, useState } from "react";
import { DataType } from "./individualStats-types";
import {
  checkRecommendationExistsInWatchlist,
  checkTokenValidity,
  fetchData,
  handleBookmarkClick,
  removeFromWatchlist,
  saveToWatchlist
} from "./helper_functions";
import { useNavigate } from "react-router-dom";
import FadeInWrapper from "../../components/common/loader/fadeinwrapper";
import { showNotification } from "../recommendations/helper_functions";
import Notification from "../../components/common/notification/Notification";
import { NotificationState } from "../recommendations/recommendations-types";
import BookmarkAlert from "./Components/BookmarkAlert";
import AccordionItem from "./Components/AccordionItem";

interface IndividualStatsProps {}

const IndividualStats: FC<IndividualStatsProps> = () => {
  // Състояния за задържане на извлечени данни
  const [data, setData] = useState<DataType>({
    topRecommendations: {
      recommendationsCount: {
        movies: 0,
        series: 0
      },
      recommendations: []
    }, // Топ препоръки
    topRecommendationsWatchlist: {
      savedCount: {
        movies: 0,
        series: 0
      },
      watchlist: []
    }, // Запазени филми/сериали в списък за гледане
    topGenres: [], // Топ жанрове
    topGenresWatchlist: [], // Топ запазени жанрове
    sortedDirectorsByRecommendationCount: [], // Режисьори, сортирани по просперитет
    sortedActorsByRecommendationCount: [], // Актьори, сортирани по просперитет
    sortedWritersByRecommendationCount: [], // Сценаристи, сортирани по просперитет
    sortedDirectorsBySavedCount: [], // Режисьори, сортирани по просперитет
    sortedActorsBySavedCount: [], // Актьори, сортирани по просперитет
    sortedWritersBySavedCount: [] // Сценаристи, сортирани по просперитет
  });

  const [notification, setNotification] = useState<NotificationState | null>(
    null
  ); // Състояние за показване на известия (например съобщения за грешки, успехи или предупреждения)
  const [bookmarkedMovies, setBookmarkedMovies] = useState<{
    [key: string]: any;
  }>({});
  const [alertVisible, setAlertVisible] = useState(false); // To control alert visibility
  const [currentBookmarkStatus, setCurrentBookmarkStatus] = useState(false); // Track current bookmark status

  const [loading, setLoading] = useState<boolean>(true);
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

    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken"); // Вземане на токен от localStorage или sessionStorage

    if (token) {
      setLoading(true);
      fetchData(token, setData, setLoading); // Извличане на данни с помощта на fetchData функцията
      console.log("fetching"); // Лог за следене на извличането на данни
    }
  }, []);

  useEffect(() => {
    const loadBookmarkStatus = async () => {
      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");

      if (token) {
        const updatedBookmarks: { [key: string]: any } = {};
        if (data.topRecommendationsWatchlist.watchlist) {
          for (const movie of data.topRecommendationsWatchlist.watchlist) {
            try {
              const isBookmarked = await checkRecommendationExistsInWatchlist(
                movie.imdbID,
                token
              );
              if (isBookmarked) {
                updatedBookmarks[movie.imdbID] = movie;
              }
            } catch (error) {
              console.error("Error checking watchlist status:", error);
            }
          }
        }
        setBookmarkedMovies(updatedBookmarks);
      }
    };

    loadBookmarkStatus();
  }, [data.topRecommendationsWatchlist.watchlist]);

  if (loading) {
    return (
      <FadeInWrapper loadingTimeout={30000}>
        <div></div>
      </FadeInWrapper>
    );
  }

  if (
    !data.topRecommendations.recommendations ||
    data.topRecommendations.recommendations.length === 0 ||
    !data.topGenres.length ||
    !data.sortedDirectorsByRecommendationCount.length ||
    !data.sortedActorsByRecommendationCount.length ||
    !data.sortedWritersByRecommendationCount.length
  ) {
    return (
      <FadeInWrapper>
        <div className="flex justify-center items-center bg-bodybg mt-[15rem] text-center p-6 rounded-lg shadow-xl">
          <p className="text-2xl font-extrabold text-defaulttextcolor drop-shadow-lg">
            🔍 За да можете да разгледате Вашите индивидуални статистики, моля,
            първо генерирайте препоръки. Това ще ни позволи да съберем
            необходимите данни и да Ви предоставим подробен анализ 📊, съобразен
            с Вашите предпочитания. ⚙️
          </p>
        </div>
      </FadeInWrapper>
    );
  }

  const handleDismiss = () => {
    setAlertVisible(false);
  };

  return (
    <FadeInWrapper>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={handleNotificationClose}
        />
      )}
      {alertVisible && (
        <BookmarkAlert
          isBookmarked={currentBookmarkStatus}
          onDismiss={handleDismiss}
        />
      )}
      <Fragment>
        <div className="md:flex block items-center justify-between my-[1.5rem] page-header-breadcrumb">
          <div>
            <p className="font-semibold text-[1.125rem] text-defaulttextcolor dark:text-defaulttextcolor/70 !mb-0 "></p>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-6">
          <div className="xl:col-span-12 col-span-12">
            <div
              className="accordion accordionicon-left accordions-items-separate"
              id="accordioniconLeft"
            >
              <div
                className="hs-accordion-group"
                data-hs-accordion-always-open=""
              >
                <div
                  className="hs-accordion accordion-item overflow-hidden active"
                  id="hs-basic-with-title-and-arrow-stretched-heading-one"
                >
                  <AccordionItem
                    title="Моите Топ Препоръки - Статистики"
                    type="recommendations"
                    data={data}
                    handleBookmarkClick={handleBookmarkClick}
                    bookmarkedMovies={bookmarkedMovies}
                  />
                </div>
                {data.topRecommendationsWatchlist.watchlist ||
                data.topGenresWatchlist.length ||
                data.sortedDirectorsBySavedCount.length ||
                data.sortedActorsBySavedCount.length ||
                data.sortedWritersBySavedCount.length ? (
                  <AccordionItem
                    title="Моята Колекция за Гледане - Статистики"
                    type="watchlist"
                    data={data}
                    handleBookmarkClick={handleBookmarkClick}
                    bookmarkedMovies={bookmarkedMovies}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    </FadeInWrapper>
  );
};

export default IndividualStats;

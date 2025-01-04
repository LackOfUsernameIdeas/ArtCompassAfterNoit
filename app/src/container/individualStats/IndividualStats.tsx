import { FC, Fragment, useEffect, useState } from "react";
import { DataType } from "./individualStats-types";
import {
  checkRecommendationExistsInWatchlist,
  checkTokenValidity,
  fetchData,
  handleBookmarkClick
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
  const [data, setData] = useState<DataType>({
    topRecommendations: {
      recommendationsCount: { movies: 0, series: 0 },
      recommendations: []
    },
    topRecommendationsWatchlist: {
      savedCount: { movies: 0, series: 0 },
      watchlist: []
    },
    topGenres: [],
    topGenresWatchlist: [],
    sortedDirectorsByRecommendationCount: [],
    sortedActorsByRecommendationCount: [],
    sortedWritersByRecommendationCount: [],
    sortedDirectorsBySavedCount: [],
    sortedActorsBySavedCount: [],
    sortedWritersBySavedCount: []
  });

  const [notification, setNotification] = useState<NotificationState | null>(
    null
  );
  const [bookmarkedMovies, setBookmarkedMovies] = useState<{
    [key: string]: any;
  }>({});
  const [alertVisible, setAlertVisible] = useState(false);
  const [currentBookmarkStatus, setCurrentBookmarkStatus] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Utility function to get token
  const getToken = () =>
    localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

  // Handle notification close
  const handleNotificationClose = () => {
    if (notification?.type === "error") navigate("/signin");
    setNotification(null);
  };

  // Validate token and show notification if expired
  useEffect(() => {
    const validateToken = async () => {
      const redirectUrl = await checkTokenValidity();
      if (redirectUrl) {
        showNotification(
          setNotification,
          "Вашата сесия е изтекла. Моля, влезте в профила Ви отново.",
          "error"
        );
      }
    };
    validateToken();

    const token = getToken();
    if (token) {
      setLoading(true);
      fetchData(token, setData, setLoading);
    }
  }, []);

  // Handle loading bookmark status
  useEffect(() => {
    const loadBookmarkStatus = async () => {
      const token = getToken();
      if (!token) return;

      const updatedBookmarks: { [key: string]: any } = {};
      for (const movie of data.topRecommendationsWatchlist.watchlist) {
        try {
          const isBookmarked = await checkRecommendationExistsInWatchlist(
            movie.imdbID,
            token
          );
          if (isBookmarked) updatedBookmarks[movie.imdbID] = movie;
        } catch (error) {
          console.error("Error checking watchlist status:", error);
        }
      }
      setBookmarkedMovies(updatedBookmarks);
    };

    loadBookmarkStatus();
  }, [data.topRecommendationsWatchlist.watchlist]);

  // Loading state and empty data check
  if (loading) {
    return (
      <FadeInWrapper loadingTimeout={30000}>
        <div></div>
      </FadeInWrapper>
    );
  }

  if (
    !data.topRecommendations.recommendations?.length ||
    !data.topGenres.length ||
    !data.sortedDirectorsByRecommendationCount.length
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
          onDismiss={() => setAlertVisible(false)}
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
                {(data.topRecommendationsWatchlist.watchlist ||
                  data.topGenresWatchlist.length ||
                  data.sortedDirectorsBySavedCount.length) && (
                  <AccordionItem
                    title="Моята Колекция за Гледане - Статистики"
                    type="watchlist"
                    data={data}
                    handleBookmarkClick={handleBookmarkClick}
                    bookmarkedMovies={bookmarkedMovies}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    </FadeInWrapper>
  );
};

export default IndividualStats;

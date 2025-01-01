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
    [key: string]: any;
  }>({});

  const [alertVisible, setAlertVisible] = useState(false); // To control alert visibility
  const [currentBookmarkStatus, setCurrentBookmarkStatus] = useState(false); // Track current bookmark status

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
  }, []);

  const handleNotificationClose = () => {
    if (notification?.type === "error") {
      navigate("/signin");
    }
    setNotification(null);
  };

  const handleBookmarkClick = (movie: {
    imdbID: string;
    [key: string]: any;
  }) => {
    setBookmarkedMovies((prev) => {
      const isBookmarked = !!prev[movie.imdbID];
      const updatedBookmarks = { ...prev };

      if (isBookmarked) {
        // Remove the movie from bookmarks if it's already bookmarked
        delete updatedBookmarks[movie.imdbID];
      } else {
        // Add the movie to bookmarks if it's not already bookmarked
        updatedBookmarks[movie.imdbID] = movie;
      }

      setCurrentBookmarkStatus(!isBookmarked); // Update the current bookmark status
      setAlertVisible(true); // Show the alert
      setTimeout(() => setAlertVisible(false), 3000); // Hide alert after 3 seconds

      return updatedBookmarks; // Return the updated bookmarks object
    });
  };

  console.log("bookmarkedMovies", bookmarkedMovies);

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={handleNotificationClose}
        />
      )}
      {alertVisible && <BookmarkAlert isBookmarked={currentBookmarkStatus} />}
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

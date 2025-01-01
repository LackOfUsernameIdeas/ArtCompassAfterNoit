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

  const handleBookmarkClick = (imdbID: string) => {
    setBookmarkedMovies((prev) => {
      const newStatus = !prev[imdbID];
      setCurrentBookmarkStatus(newStatus); // Update the current bookmark status
      setAlertVisible(true); // Show the alert
      setTimeout(() => setAlertVisible(false), 3000); // Hide alert after 3 seconds

      return {
        ...prev,
        [imdbID]: newStatus // Toggle the bookmark status
      };
    });
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

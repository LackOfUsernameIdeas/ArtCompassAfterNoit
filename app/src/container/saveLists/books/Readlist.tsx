import { FC, Fragment, useEffect, useState } from "react";
import { DataType } from "./readlist-types";
import { fetchData } from "./helper_functions";
import {
  checkRecommendationExistsInReadlist,
  validateToken
} from "../../helper_functions_common";
import { useNavigate } from "react-router-dom";
import FadeInWrapper from "../../../components/common/loader/fadeinwrapper";
import Notification from "../../../components/common/notification/Notification";
import { NotificationState } from "../../types_common";
import BooksTable from "./Components/BooksTable";
import BookmarkAlert from "./Components/BookmarkAlert";
import ErrorCard from "../../../components/common/error/error";

interface ReadlistProps {}

const Readlist: FC<ReadlistProps> = () => {
  // Състояния за задържане на извлечени данни
  const [data, setData] = useState<DataType>({
    topRecommendationsReadlist: [] // Запазени книги в списък за четене
  });

  const [notification, setNotification] = useState<NotificationState | null>(
    null
  ); // Състояние за показване на известия (например съобщения за грешки, успехи или предупреждения)
  const [bookmarkedBooks, setBookmarkedBooks] = useState<{
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
    validateToken(setNotification); // Стартиране на проверката на токена при първоначално зареждане на компонента

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
        if (data.topRecommendationsReadlist) {
          for (const book of data.topRecommendationsReadlist) {
            try {
              const isBookmarked = await checkRecommendationExistsInReadlist(
                book.source === "GoogleBooks"
                  ? book.google_books_id
                  : book.goodreads_id,
                token,
                book.source
              );
              if (isBookmarked) {
                updatedBookmarks[
                  book.source === "GoogleBooks"
                    ? book.google_books_id
                    : book.goodreads_id
                ] = book;
              }
            } catch (error) {
              console.error("Error checking readlist status:", error);
            }
          }
        }
        setBookmarkedBooks(updatedBookmarks);
      }
    };

    loadBookmarkStatus();
  }, [data.topRecommendationsReadlist]);

  if (loading) {
    return (
      <FadeInWrapper loadingTimeout={30000}>
        <div></div>
      </FadeInWrapper>
    );
  }

  if (
    !data.topRecommendationsReadlist ||
    data.topRecommendationsReadlist.length === 0
  ) {
    return (
      <ErrorCard
        message="🔍 За да можете да разгледате Вашите списъци, моля, първо генерирайте препоръки. 
          Това ще ни позволи да съберем необходимите данни и да Ви предоставим 
          подробен анализ 📊, съобразен с Вашите предпочитания. ⚙️"
      />
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
        <div className="mt-[1.5rem]">
          <BooksTable
            data={data.topRecommendationsReadlist}
            setBookmarkedBooks={setBookmarkedBooks}
            setCurrentBookmarkStatus={setCurrentBookmarkStatus}
            setAlertVisible={setAlertVisible}
            bookmarkedBooks={bookmarkedBooks}
          />
        </div>
      </Fragment>
    </FadeInWrapper>
  );
};

export default Readlist;

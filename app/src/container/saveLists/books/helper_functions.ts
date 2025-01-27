// ==============================
// Импортиране на типове и интерфейси
// ==============================
import { DataType } from "./readlist-types";
import {
  removeFromReadlist,
  saveToReadlist
} from "../../helper_functions_common";

// ==============================
// Функции за работа с данни
// ==============================

/**
 * Извлича данни от API за платформата и ги запазва в състоянието.
 *
 * @param {string} token - Токен за удостоверяване.
 * @param {React.Dispatch<React.SetStateAction<any>>} setData - Функция за задаване на общи данни.
 * @throws {Error} - Хвърля грешка, ако заявката е неуспешна.
 */
export const fetchData = async (
  token: string,
  setData: React.Dispatch<React.SetStateAction<any>>,
  setLoading: React.Dispatch<React.SetStateAction<any>>
): Promise<void> => {
  try {
    // Fetch statistics data independently
    const endpoints = [
      {
        key: "topRecommendationsReadlist",
        endpoint: "/stats/individual/readlist",
        method: "POST",
        body: { token: token }
      }
    ];

    // Loop over each endpoint, fetch data, and update state independently
    const fetchPromises = endpoints.map(
      async ({ key, endpoint, method, body }) => {
        try {
          const res = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}${endpoint}`,
            {
              method: method,
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
              },
              body: method === "POST" ? JSON.stringify(body) : undefined
            }
          );
          const data = await res.json();
          // Replace response with an empty array if it contains a `message` field
          const processedData =
            data && typeof data === "object" && data.message ? [] : data;
          setData((prevState: DataType) => ({
            ...prevState,
            [key]: processedData
          }));
        } catch (error) {
          return console.error(`Error fetching ${key}:`, error);
        }
      }
    );
    Promise.all(fetchPromises).finally(() => setLoading(false));
  } catch (error) {
    console.error("Error in fetchData:", error);
    throw error;
  }
};

// ==============================
// Handle функции
// ==============================

/**
 * Добавя или премахва книга от списъка с отметки на потребителя.
 * Актуализира състоянията на компонентите чрез подадените функции.
 *
 * @param {object} book - Книгата, която ще бъде добавена или премахната от отметките.
 * @param {string} book.google_books_id - Уникален идентификатор за Google Books.
 * @param {string} book.goodreads_id - Уникален идентификатор за Goodreads.
 * @param {Function} setBookmarkedBooks - Функция за актуализиране на състоянието на списъка с отметки.
 * @param {Function} setCurrentBookmarkStatus - Функция за актуализиране на текущия статус на отметката.
 * @param {Function} setAlertVisible - Функция за показване на известие.
 * @returns {void} - Функцията не връща стойност.
 */
export const handleBookmarkClick = (
  book: {
    google_books_id: string;
    goodreads_id: string;
    [key: string]: any;
  },
  setBookmarkedBooks?: React.Dispatch<
    React.SetStateAction<{ [key: string]: any }>
  >,
  setCurrentBookmarkStatus?: React.Dispatch<React.SetStateAction<boolean>>,
  setAlertVisible?: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setBookmarkedBooks &&
    setBookmarkedBooks((prev) => {
      // Проверка дали книгата вече е добавена в списъка с отметки
      const isBookmarked = !!prev[book.google_books_id || book.goodreads_id];
      const updatedBookmarks = { ...prev };
      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");

      if (isBookmarked) {
        // Премахване на книгата от списъка с отметки, ако вече е добавена
        delete updatedBookmarks[book.google_books_id || book.goodreads_id];

        removeFromReadlist(
          book.google_books_id || book.goodreads_id,
          token
        ).catch((error) => {
          console.error("Грешка при премахване от списъка за четене:", error);
        });
      } else {
        // Добавяне на книгата в списъка с отметки, ако все още не е добавена
        updatedBookmarks[book.google_books_id || book.goodreads_id] = book;

        saveToReadlist(book, token).catch((error) => {
          console.error("Грешка при запазване в списъка за четене:", error);
        });
      }

      // Актуализиране на текущия статус на отметката
      setCurrentBookmarkStatus && setCurrentBookmarkStatus(!isBookmarked);

      // Показване на известие
      setAlertVisible && setAlertVisible(true);

      // Връщане на актуализирания обект със списъка с отметки
      return updatedBookmarks;
    });
};

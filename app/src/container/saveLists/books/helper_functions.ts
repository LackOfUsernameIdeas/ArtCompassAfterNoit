// ==============================
// Импортиране на типове и интерфейси
// ==============================
import { DataType } from "./readlist-types";
import { SetStateAction } from "react";

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

/**
 * Функция за обработка на жанрове.
 * Ако жанровете са подадени като string, се опитваме да ги парсираме в JSON формат.
 * Ако парсирането не успее, се връща null.
 *
 * @param {any} resolvedGenres - Жанрове, които могат да бъдат string или обект.
 * @returns {any} Върща парсираните жанрове или оригиналния обект.
 */
export const parseResolvedGenres = async (resolvedGenres: any) => {
  // Обработка на string
  if (typeof resolvedGenres === "string") {
    try {
      return JSON.parse(resolvedGenres); // Опит за парсиране на JSON ако е string
    } catch (error) {
      console.warn("Неуспешно парсиране на жанрове от string:", resolvedGenres);
      return null; // Връщане на null, ако парсирането не е успешно
    }
  }
  return resolvedGenres;
};

/**
 * Функция за обработка на жанровете за Google Books API.
 * Преобразува жанровете в string-ове, които могат да се покажат на потребителя.
 *
 * @param {any} genres - Жанровете, които ще бъдат обработени.
 * @param {(value: SetStateAction<string[]>) => void} setGenres - Функция за сетване на жанровете в state.
 */
export const processGenresForGoogleBooks = (
  genres: any,
  setGenres: (value: SetStateAction<string[]>) => void
) => {
  if (genres && typeof genres === "object") {
    const genreEntries = Object.entries(genres);
    const genreStrings = genreEntries.map(([category, subGenres]) => {
      return `${category}: ${
        Array.isArray(subGenres)
          ? subGenres.join(", ")
          : subGenres || "Няма поджанрове"
      }`;
    });
    setGenres(genreStrings);
  } else {
    console.warn("Неочакван формат за жанровете на Google Books:", genres);
    setGenres(["Няма жанрове за показване."]);
  }
};

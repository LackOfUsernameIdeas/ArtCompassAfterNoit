// ==============================
// Импортиране на типове и интерфейси
// ==============================
import { DataType } from "./watchlist-types";

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
        key: "topRecommendationsWatchlist",
        endpoint: "/stats/individual/watchlist",
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
 * Извлича автори, режисьори, сценаристи и езици от подадения обект, като премахва дублиращите се стойности.
 *
 * @param {Object} item - Обектът, съдържащ информация за книгата или филма.
 * @param {string} [item.actors] - Списък с актьори, разделени със запетая.
 * @param {string} [item.director] - Списък с режисьори, разделени със запетая.
 * @param {string} [item.writer] - Списък с сценаристи, разделени със запетая.
 * @param {string} [item.language] - Списък с езици, разделени със запетая.
 * @returns {Object} - Обект със свойства `actors`, `directors`, `writers` и `languages`, всеки от които е масив от уникални низове.
 */
export const extractItemFromStringList = (
  item: any
): {
  actors: string[];
  directors: string[];
  writers: string[];
  languages: string[];
} => {
  const uniqueValues = (str?: string): string[] => {
    return str ? [...new Set(str.split(",").map((value) => value.trim()))] : [];
  };

  return {
    actors: uniqueValues(item.actors),
    directors: uniqueValues(item.director),
    writers: uniqueValues(item.writer),
    languages: uniqueValues(item.language)
  };
};

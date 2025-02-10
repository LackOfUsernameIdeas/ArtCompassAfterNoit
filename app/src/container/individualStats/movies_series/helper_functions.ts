// ==============================
// Импортиране на типове и интерфейси
// ==============================
import { FilteredTableData, DataType } from "./a";
import {
  removeFromWatchlist,
  saveToWatchlist
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
        key: "topRecommendations",
        endpoint: "/stats/individual/top-recommendations",
        method: "POST",
        body: { token: token }
      },
      {
        key: "topRecommendationsWatchlist",
        endpoint: "/stats/individual/watchlist",
        method: "POST",
        body: { token: token }
      },
      {
        key: "topGenres",
        endpoint: "/stats/individual/top-genres",
        method: "POST",
        body: { token: token }
      },
      {
        key: "topGenresWatchlist",
        endpoint: "/stats/individual/watchlist-top-genres",
        method: "POST",
        body: { token: token }
      },
      {
        key: "sortedDirectorsByRecommendationCount",
        endpoint: "/stats/individual/top-directors",
        method: "POST",
        body: { token: token }
      },
      {
        key: "sortedDirectorsBySavedCount",
        endpoint: "/stats/individual/watchlist-top-directors",
        method: "POST",
        body: { token: token }
      },
      {
        key: "sortedActorsByRecommendationCount",
        endpoint: "/stats/individual/top-actors",
        method: "POST",
        body: { token: token }
      },
      {
        key: "sortedActorsBySavedCount",
        endpoint: "/stats/individual/watchlist-top-actors",
        method: "POST",
        body: { token: token }
      },
      {
        key: "sortedWritersByRecommendationCount",
        endpoint: "/stats/individual/top-writers",
        method: "POST",
        body: { token: token }
      },
      {
        key: "sortedWritersBySavedCount",
        endpoint: "/stats/individual/watchlist-top-writers",
        method: "POST",
        body: { token: token }
      }
    ];

    // Loop over each endpoint, fetch data, and update state independently
    const fetchPromises = endpoints.map(({ key, endpoint, method, body }) => {
      return fetch(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: method === "POST" ? JSON.stringify(body) : undefined
      })
        .then((res) => res.json())
        .then((data) => {
          // Replace response with an empty array if it contains a `message` field
          const processedData =
            data && typeof data === "object" && data.message ? [] : data;
          setData((prevState: DataType) => ({
            ...prevState,
            [key]: processedData
          }));
        })
        .catch((error) => console.error(`Error fetching ${key}:`, error));
    });
    Promise.all(fetchPromises).finally(() => setLoading(false));
  } catch (error) {
    console.error("Error in fetchData:", error);
    throw error;
  }
};

/**
 * Филтрира данни за таблица според категорията и връща определена страница.
 *
 * @param {FilteredTableData} filteredTableData - Данни за филтриране.
 * @param {string} prosperitySortCategory - Категория за сортиране.
 * @param {number} currentTablePage - Номер на текущата страница.
 * @param {number} itemsPerTablePage - Брой елементи на страница.
 * @returns {FilteredTableData} - Филтрирани и странирани данни.
 */
export const filterTableData = (
  filteredTableData: FilteredTableData,
  prosperitySortCategory: string,
  currentTablePage: number,
  itemsPerTablePage: number
): FilteredTableData => {
  let newItems: FilteredTableData = [];
  switch (prosperitySortCategory) {
    case "Directors":
      newItems = filteredTableData.filter((item) => "director_en" in item);
      break;
    case "Actors":
      newItems = filteredTableData.filter((item) => "actor_en" in item);
      break;
    case "Writers":
      newItems = filteredTableData.filter((item) => "writer_en" in item);
      break;
    default:
      newItems = [];
  }

  return newItems.slice(
    (currentTablePage - 1) * itemsPerTablePage,
    currentTablePage * itemsPerTablePage
  );
};

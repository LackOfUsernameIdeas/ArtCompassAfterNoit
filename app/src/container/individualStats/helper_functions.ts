// ==============================
// Импортиране на типове и интерфейси
// ==============================
import {
  FilteredTableData,
  DirectorData,
  ActorData,
  WriterData,
  GenrePopularityData,
  HeatmapData,
  MovieProsperityData,
  MovieData,
  RecommendationData,
  Category,
  DataType
} from "./individualStats-types";

// ==============================
// Type Guards
// ==============================

/**
 * Проверява дали даден обект е от тип DirectorData.
 *
 * @param {any} item - Обектът за проверка.
 * @returns {boolean} - Вярно, ако обектът е DirectorData.
 */
export const isDirector = (item: any): item is DirectorData =>
  item && "director_bg" in item;

/**
 * Проверява дали даден обект е от тип ActorData.
 *
 * @param {any} item - Обектът за проверка.
 * @returns {boolean} - Вярно, ако обектът е ActorData.
 */
export const isActor = (item: any): item is ActorData =>
  item && "actor_bg" in item;

/**
 * Проверява дали даден обект е от тип WriterData.
 *
 * @param {any} item - Обектът за проверка.
 * @returns {boolean} - Вярно, ако обектът е WriterData.
 */
export const isWriter = (item: any): item is WriterData =>
  item && "writer_bg" in item;

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
        key: "topGenres",
        endpoint: "/stats/individual/top-genres",
        method: "POST",
        body: { token: token }
      },
      {
        key: "sortedDirectorsByProsperity",
        endpoint: "/stats/individual/top-directors",
        method: "POST",
        body: { token: token }
      },
      {
        key: "sortedActorsByProsperity",
        endpoint: "/stats/individual/top-actors",
        method: "POST",
        body: { token: token }
      },
      {
        key: "sortedWritersByProsperity",
        endpoint: "/stats/individual/top-writers",
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
          setData((prevState: DataType) => ({
            ...prevState,
            [key]: data
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
 * Проверява дали токенът, съхранен в localStorage или sessionStorage, е валиден,
 * и връща URL за пренасочване, ако токенът не е валиден.
 *
 * @async
 * @function checkTokenValidity
 * @returns {Promise<string | null>} - Връща URL за пренасочване или null, ако токенът е валиден.
 * @throws {Error} - Хвърля грешка, ако заявката за проверка на токена е неуспешна.
 */
export const checkTokenValidity = async (): Promise<string | null> => {
  // Извличане на токена от localStorage или sessionStorage
  const token =
    localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

  if (!token) {
    // Ако няма намерен токен, връща URL за пренасочване
    return "/signin";
  }

  try {
    // Изпращане на заявка за валидиране на токена
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/token-validation`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ token }) // Предаване на токена в тялото на заявката
      }
    );

    const data = await response.json(); // Извличане на отговора като JSON

    if (!data.valid) {
      // Ако "valid" в отговора е false, връща URL за пренасочване
      console.warn("Token is invalid, redirecting to /signin...");
      return "/signin";
    }

    return null; // Токенът е валиден, няма нужда от пренасочване
  } catch (error) {
    // Обработка на грешки при валидирането на токена
    console.error("Error validating token:", error);
    return "/signin"; // Пренасочване към страницата за вход
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

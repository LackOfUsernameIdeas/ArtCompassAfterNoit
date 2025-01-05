// ==============================
// Импортиране на типове и интерфейси
// ==============================
import { genreOptions } from "./individualStats-data";
import {
  FilteredTableData,
  DirectorData,
  ActorData,
  WriterData,
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
 * Превежда текста от английски на български, като използва Google Translate API.
 * Ако заявката за превод е неуспешна, се връща оригиналният текст.
 *
 * @async
 * @function translate
 * @param {string} entry - Текстът, който трябва да бъде преведен.
 * @returns {Promise<string>} - Преведеният текст на български език.
 * @throws {Error} - Хвърля грешка, ако не успее да преведе текста.
 */
export async function translate(entry: string): Promise<string> {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=bg&dt=t&q=${encodeURIComponent(
    entry
  )}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const flattenedTranslation = data[0]
      .map((item: [string]) => item[0])
      .join(" ");

    const mergedTranslation = flattenedTranslation.replace(/\s+/g, " ").trim();
    return mergedTranslation;
  } catch (error) {
    console.error(`Error translating entry: ${entry}`, error);
    return entry;
  }
}

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

/**
 * Проверява дали препоръката вече съществува в списъка за гледане на потребителя.
 *
 * @async
 * @function checkRecommendationExistsInWatchlist
 * @param {string} imdbID - IMDb ID на препоръката.
 * @param {string | null} token - Токен за автентикация на потребителя.
 * @returns {Promise<boolean>} - Връща true, ако препоръката вече съществува.
 * @throws {Error} - Хвърля грешка, ако проверката не може да бъде извършена.
 */
export const checkRecommendationExistsInWatchlist = async (
  imdbID: string,
  token: string | null
): Promise<boolean> => {
  try {
    const response = await fetch(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/check-for-recommendation-in-watchlist`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ token, imdbID })
      }
    );

    if (response.status === 404) {
      throw new Error("Грешка при проверка на списъка за гледане.");
    }

    const result = await response.json();
    console.log("result: ", result.exists, imdbID);

    return result.exists || false;
  } catch (error) {
    console.error("Грешка при проверката:", error);
    return false;
  }
};

/**
 * Записва препоръка за филм или сериал в списъка за гледане на потребителя.
 * Препоръката съдържа подробности като заглавие, жанр, рейтинг и други.
 * След успешното записване, данните се изпращат до сървъра чрез съответния API маршрут.
 *
 * @async
 * @function saveToWatchlist
 * @param {any} recommendation - Обект с данни за препоръката (филм или сериал).
 * @param {string | null} token - Токен за автентикация на потребителя.
 * @returns {Promise<void>} - Няма върнат резултат, но изпраща заявка към сървъра.
 * @throws {Error} - Хвърля грешка, ако данните не могат да бъдат записани.
 */
export const saveToWatchlist = async (
  recommendation: any,
  token: string | null
): Promise<void> => {
  try {
    if (!recommendation || typeof recommendation !== "object") {
      console.warn("Няма валидни данни за препоръката.");
      return;
    }

    // Проверка дали съществува в списъка за гледане
    const exists = await checkRecommendationExistsInWatchlist(
      recommendation.imdbID,
      token
    );

    if (exists) {
      console.log("Препоръката вече е добавена в списъка за гледане.");
      return;
    }

    console.log("recommendation: ", recommendation);
    const genresEn = recommendation.genre_en
      ? recommendation.genre_en.split(", ")
      : null;

    const genresBg = genresEn.map((genre: string) => {
      const matchedGenre = genreOptions.find(
        (option) => option.en.trim() === genre.trim()
      );
      return matchedGenre ? matchedGenre.bg : null;
    });

    const runtime = recommendation.runtimeGoogle || recommendation.runtime;
    const imdbRating =
      recommendation.imdbRatingGoogle || recommendation.imdbRating;

    const formattedRecommendation = {
      token,
      imdbID: recommendation.imdbID || null,
      title_en: recommendation.title_en || null,
      title_bg: recommendation.title_bg || null,
      genre_en: genresEn.join(", "),
      genre_bg: genresBg.join(", "),
      reason: recommendation.reason || null,
      description: recommendation.description || null,
      year: recommendation.year || null,
      rated: recommendation.rated || null,
      released: recommendation.released || null,
      runtime: runtime || null,
      director: recommendation.director || null,
      writer: recommendation.writer || null,
      actors: recommendation.actors || null,
      plot: recommendation.plot || null,
      language: recommendation.language || null,
      country: recommendation.country || null,
      awards: recommendation.awards || null,
      poster: recommendation.poster || null,
      ratings: recommendation.ratings || [],
      metascore: recommendation.metascore || null,
      imdbRating: imdbRating || null,
      imdbVotes: recommendation.imdbVotes || null,
      type: recommendation.type || null,
      DVD: recommendation.DVD || null,
      boxOffice: recommendation.boxOffice || null,
      production: recommendation.production || null,
      website: recommendation.website || null,
      totalSeasons: recommendation.totalSeasons || null
    };

    console.log("formattedRecommendation: ", formattedRecommendation);
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/save-to-watchlist`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formattedRecommendation)
      }
    );

    if (!response.ok) {
      throw new Error(
        "Неуспешно записване на препоръката в списъка за гледане."
      );
    }

    const result = await response.json();
    console.log("Препоръката е успешно добавена:", result);
  } catch (error) {
    console.error("Грешка при записването в списъка за гледане:", error);
  }
};

/**
 * Премахва филм или сериал от списъка за гледане на потребителя.
 *
 * @async
 * @function removeFromWatchlist
 * @param {string} imdbID - Уникален идентификатор на филма или сериала (IMDb ID).
 * @param {string | null} token - Токен за автентикация на потребителя.
 * @returns {Promise<void>} - Няма върнат резултат, но изпраща заявка към сървъра.
 * @throws {Error} - Хвърля грешка, ако данните не могат да бъдат премахнати.
 */
export const removeFromWatchlist = async (
  imdbID: string,
  token: string | null
): Promise<void> => {
  try {
    if (!imdbID) {
      console.warn("IMDb ID is required to remove a movie from the watchlist.");
      return;
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/remove-from-watchlist`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ token, imdbID })
      }
    );

    if (!response.ok) {
      throw new Error(
        "Failed to remove the movie or series from the watchlist."
      );
    }

    const result = await response.json();
    console.log("Successfully removed from watchlist:", result);
  } catch (error) {
    console.error("Error removing from watchlist:", error);
  }
};

// ==============================
// Handle функции
// ==============================

/**
 * Добавя или премахва филм от списъка с любими на потребителя.
 * Прикрепя състоянията на компонентите като параметри, за да актуализира състоянието.
 *
 * @param {object} movie - Филмът, който ще бъде добавен или премахнат.
 * @param {string} movie.imdbID - Уникален идентификатор на филма (IMDb ID).
 * @param {Function} setBookmarkedMovies - Функция за актуализиране на състоянието на отметките.
 * @param {Function} setCurrentBookmarkStatus - Функция за актуализиране на текущия статус на отметката.
 * @param {Function} setAlertVisible - Функция за показване на алармата.
 * @returns {void} - Функцията не връща стойност.
 */
export const handleBookmarkClick = (
  movie: { imdbID: string; [key: string]: any },
  setBookmarkedMovies?: React.Dispatch<
    React.SetStateAction<{ [key: string]: any }>
  >,
  setCurrentBookmarkStatus?: React.Dispatch<React.SetStateAction<boolean>>,
  setAlertVisible?: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setBookmarkedMovies &&
    setBookmarkedMovies((prev) => {
      const isBookmarked = !!prev[movie.imdbID];
      const updatedBookmarks = { ...prev };
      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");

      if (isBookmarked) {
        // Remove the movie from bookmarks if it's already bookmarked
        delete updatedBookmarks[movie.imdbID];

        // Call removeFromWatchlist API
        removeFromWatchlist(movie.imdbID, token).catch((error) => {
          console.error("Error removing from watchlist:", error);
        });
      } else {
        // Add the movie to bookmarks if it's not already bookmarked
        updatedBookmarks[movie.imdbID] = movie;

        // Call saveToWatchlist API
        saveToWatchlist(movie, token).catch((error) => {
          console.error("Error saving to watchlist:", error);
        });
      }

      setCurrentBookmarkStatus && setCurrentBookmarkStatus(!isBookmarked); // Update the current bookmark status
      setAlertVisible && setAlertVisible(true); // Show the alert

      return updatedBookmarks; // Return the updated bookmarks object
    });
};

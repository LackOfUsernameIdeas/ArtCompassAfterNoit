// ==============================
// Импортиране на типове и интерфейси
// ==============================
import {
  FilteredTableData,
  GenrePopularityData,
  HeatmapData,
  MovieProsperityData,
  MovieData,
  RecommendationData,
  Category,
  DataType
} from "./platformStats-types";

// ==============================
// Функции за работа с данни
// ==============================

/**
 * Извлича данни от API за платформата и ги запазва в състоянието.
 * @param {string} token - Токен за удостоверяване.
 * @param {React.Dispatch<React.SetStateAction<any>>} setData - Функция за задаване на общи данни.
 * @throws {Error} - Хвърля грешка, ако заявката е неуспешна.
 */
export const fetchData = async (
  token: string,
  setData: React.Dispatch<React.SetStateAction<any>>
): Promise<void> => {
  try {
    // Fetch user data independently
    fetch(`${import.meta.env.VITE_API_BASE_URL}/user-data`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .catch((error) => console.error("Error fetching user data:", error));

    // Fetch statistics data independently
    const endpoints = [
      {
        key: "topRecommendations",
        endpoint: "/stats/platform/top-recommendations"
      },
      {
        key: "genrePopularityOverTime",
        endpoint: "/stats/platform/genre-popularity-over-time"
      },
      { key: "topActors", endpoint: "/stats/platform/top-actors" },
      { key: "topCountries", endpoint: "/stats/platform/top-countries" },
      { key: "topDirectors", endpoint: "/stats/platform/top-directors" },
      { key: "topWriters", endpoint: "/stats/platform/top-writers" },
      {
        key: "totalAwardsByMovieOrSeries",
        endpoint: "/stats/platform/total-awards-by-movie"
      },
      {
        key: "sortedDirectorsByProsperity",
        endpoint: "/stats/platform/sorted-directors-by-prosperity"
      },
      {
        key: "sortedActorsByProsperity",
        endpoint: "/stats/platform/sorted-actors-by-prosperity"
      },
      {
        key: "sortedWritersByProsperity",
        endpoint: "/stats/platform/sorted-writers-by-prosperity"
      },
      {
        key: "sortedMoviesByProsperity",
        endpoint: "/stats/platform/sorted-movies-by-prosperity"
      },
      {
        key: "sortedMoviesAndSeriesByMetascore",
        endpoint: "/stats/platform/sorted-movies-and-series-by-metascore"
      },
      {
        key: "sortedMoviesAndSeriesByIMDbRating",
        endpoint: "/stats/platform/sorted-movies-and-series-by-imdb-rating"
      },
      {
        key: "sortedMoviesAndSeriesByRottenTomatoesRating",
        endpoint:
          "/stats/platform/sorted-movies-and-series-by-rotten-tomatoes-rating"
      }
    ];

    // Loop over each endpoint, fetch data, and update state independently
    endpoints.forEach(({ key, endpoint }) => {
      fetch(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
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
      newItems = filteredTableData.filter((item) => "director" in item);
      break;
    case "Actors":
      newItems = filteredTableData.filter((item) => "actor" in item);
      break;
    case "Writers":
      newItems = filteredTableData.filter((item) => "writer" in item);
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
 * Пагинира данни за таблица.
 *
 * @param {FilteredTableData} filteredTableData - Филтрираните данни.
 * @param {number} currentTablePage - Текуща страница.
 * @param {number} itemsPerTablePage - Брой елементи на страница.
 * @returns {FilteredTableData} - Пагинирани данни.
 */
export const paginateData = (
  filteredTableData: FilteredTableData,
  currentTablePage: number,
  itemsPerTablePage: number
): FilteredTableData => {
  return filteredTableData.slice(
    (currentTablePage - 1) * itemsPerTablePage,
    currentTablePage * itemsPerTablePage
  );
};

/**
 * Сортира данни за филми/сериали по категория.
 *
 * @param {MovieData[]} seriesData - Списък с данни за филми/сериали.
 * @param {string} category - Категория за сортиране (IMDb, Metascore, Rotten Tomatoes).
 * @returns {MovieData[]} - Сортирани данни.
 */
const sortByCategory = (
  seriesData: MovieData[],
  category: string
): MovieData[] => {
  const sorters: { [key: string]: (a: MovieData, b: MovieData) => number } = {
    IMDb: (a, b) => b.imdbRating - a.imdbRating,
    Metascore: (a, b) => b.metascore - a.metascore,
    RottenTomatoes: (a, b) => b.rottenTomatoes - a.rottenTomatoes
  };
  return sorters[category] ? seriesData.sort(sorters[category]) : seriesData;
};

/**
 * Пагинира сортирани данни за бар-чарт.
 *
 * @param {MovieData[] | RecommendationData[]} seriesData - Списък с данни за филми/сериали.
 * @param {number} currentPage - Текуща страница.
 * @param {number} pageSize - Брой елементи на страница.
 * @param {string} [category] - Категория за сортиране.
 * @returns {MovieData[] | RecommendationData[]} - Пагинирани и сортирани данни.
 */
export const paginateBarChartData = (
  seriesData: (MovieData | RecommendationData)[], // Union of MovieData and RecommendationData
  currentPage: number,
  pageSize: number,
  category?: string
): (MovieData | RecommendationData)[] => {
  // Return type is also a union
  const sortedData = category
    ? sortByCategory(seriesData, category)
    : seriesData;
  const start = (currentPage - 1) * pageSize;

  return sortedData.slice(start, start + pageSize);
};

/**
 * Променя текущата страница на бар-чарт при навигация.
 *
 * @param {"next" | "prev"} direction - Посока (next или prev).
 * @param {number} currentPage - Текуща страница.
 * @param {number} pageSize - Брой елементи на страница.
 * @param {number} totalItems - Общ брой елементи.
 * @param {React.Dispatch<React.SetStateAction<number>>} setCurrentPage - Функция за задаване на текуща страница.
 */
export const handleBarChartPageChange = (
  direction: "next" | "prev",
  currentPage: number,
  pageSize: number,
  totalItems: number,
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
) => {
  const totalPages = Math.ceil(totalItems / pageSize);
  const newPage =
    direction === "next"
      ? Math.min(currentPage + 1, totalPages)
      : Math.max(currentPage - 1, 1);
  setCurrentPage(newPage);
};

/**
 * Изчислява общия брой страници за бар-чарт.
 *
 * @param {number} totalItems - Общ брой елементи.
 * @param {number} pageSize - Брой елементи на страница.
 * @returns {number} - Общ брой страници.
 */
export const getTotalBarChartPages = (
  totalItems: number,
  pageSize: number
): number => Math.ceil(totalItems / pageSize);

/**
 * Генерира данни за heatmap.
 *
 * @param {GenrePopularityData} data - Данни за популярност на жанровете.
 * @returns {HeatmapData} - Данни за heatmap.
 */
export const generateHeatmapSeriesData = (
  data: GenrePopularityData
): HeatmapData => {
  const years = Object.keys(data);
  const genreNames = new Set<string>();

  years.forEach((year) => {
    Object.keys(data[year]).forEach((genreKey) =>
      genreNames.add(data[year][genreKey].genre_bg)
    );
  });

  return [...genreNames].map((genreBg) => ({
    name: genreBg,
    data: years.map((year) => {
      const genre = Object.values(data[year]).find(
        (item) => item.genre_bg === genreBg
      );
      return { x: year, y: genre ? genre.genre_count : 0 };
    })
  }));
};

/**
 * Генерира данни за scatter plot.
 *
 * @param {MovieProsperityData[]} movies - Данни за просперитет на филми.
 * @returns {MovieData[]} - Данни за scatter plot.
 */
export const generateScatterSeriesData = (
  movies: MovieProsperityData[]
): MovieData[] =>
  movies.map((movie) => ({
    title: movie.title_bg,
    title_bg: movie.title_bg,
    title_en: movie.title_en,
    boxOffice: parseBoxOffice(movie.total_box_office),
    imdbRating: parseFloat(movie.imdbRating),
    metascore: parseFloat(movie.metascore),
    rottenTomatoes: parseFloat(movie.rotten_tomatoes)
  }));

/**
 * Преобразува стойност на приходи в число.
 *
 * @param {string | number} value - Стойност на приходи.
 * @returns {number} - Числова стойност.
 */
export function parseBoxOffice(value: string | number): number {
  return typeof value === "string"
    ? parseFloat(value.replace(/[\$,]/g, ""))
    : value;
}

// ==============================
// Handle функции
// ==============================

/**
 * Задава категория за сортиране на таблицата за просперитет.
 *
 * @param {string} category - Избраната категория.
 * @param {React.Dispatch<React.SetStateAction<string>>} setProsperitySortCategory - Функция за задаване на категорията.
 */
export const handleProsperityTableClick = (
  category: string,
  setProsperitySortCategory: React.Dispatch<React.SetStateAction<string>>
) => {
  setProsperitySortCategory(category);
};

/**
 * Задава категория за сортиране на секция "Филми и сериали".
 *
 * @param {string} category - Избраната категория.
 * @param {React.Dispatch<React.SetStateAction<string>>} setMoviesAndSeriesSortCategory - Функция за задаване на категорията.
 */
export const handleMoviesAndSeriesSortCategory = (
  category: string,
  setMoviesAndSeriesSortCategory: React.Dispatch<React.SetStateAction<string>>
) => {
  setMoviesAndSeriesSortCategory(category);
};

/**
 * Задава категория за сортиране на топ статистики.
 *
 * @param {string} category - Избраната категория.
 * @param {React.Dispatch<React.SetStateAction<string>>} setTopStatsSortCategory - Функция за задаване на категорията.
 */
export const handleTopStatsSortCategory = (
  category: Category,
  setTopStatsSortCategory: React.Dispatch<React.SetStateAction<Category>>
) => {
  setTopStatsSortCategory(category);
};

/**
 * Обработва избор от dropdown меню.
 *
 * @param {React.Dispatch<React.SetStateAction<string>>} setName - Функция за задаване на име.
 * @param {React.Dispatch<React.SetStateAction<number>>} setValue - Функция за задаване на стойност.
 * @param {string} name - Избраното име.
 * @param {number} value - Избраната стойност.
 */
export const handleDropdownClick = (
  setName: React.Dispatch<React.SetStateAction<string>>,
  setValue: React.Dispatch<React.SetStateAction<number>>,
  name: string,
  value: number
) => {
  setName(name);
  setValue(value);
};

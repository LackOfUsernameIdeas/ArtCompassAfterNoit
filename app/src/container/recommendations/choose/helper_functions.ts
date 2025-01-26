import { DataType } from "./choose-types";

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

/**
 * Извлича данни от API за платформата и ги запазва в състоянието.
 *
 * @param {string} token - Токен за удостоверяване.
 * @param {React.Dispatch<React.SetStateAction<any>>} setUserData - Функция за задаване на потребителски данни.
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
      { key: "usersCount", endpoint: "/stats/platform/users-count" },
      {
        key: "topRecommendations",
        endpoint: "/stats/platform/top-recommendations"
      },
      { key: "topGenres", endpoint: "/stats/platform/top-genres" },
      {
        key: "genrePopularityOverTime",
        endpoint: "/stats/platform/genre-popularity-over-time"
      },
      { key: "topActors", endpoint: "/stats/platform/top-actors" },
      {
        key: "averageBoxOfficeAndScores",
        endpoint: "/stats/platform/average-scores"
      },
      { key: "topCountries", endpoint: "/stats/platform/top-countries" },
      { key: "topDirectors", endpoint: "/stats/platform/top-directors" },
      { key: "topWriters", endpoint: "/stats/platform/top-writers" },
      { key: "oscarsByMovie", endpoint: "/stats/platform/oscars-by-movie" },
      {
        key: "totalAwardsByMovieOrSeries",
        endpoint: "/stats/platform/total-awards-by-movie"
      },
      { key: "totalAwards", endpoint: "/stats/platform/total-awards" },
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

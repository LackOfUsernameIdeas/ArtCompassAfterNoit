import { DataType } from "./landing-types";

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
 * @param {React.Dispatch<React.SetStateAction<any>>} setUserData - Функция за задаване на потребителски данни.
 * @throws {Error} - Хвърля грешка, ако заявката е неуспешна.
 */
export const fetchData = async (
  setData: React.Dispatch<React.SetStateAction<any>>
): Promise<void> => {
  try {
    // Fetch statistics data independently
    const endpoints = [
      { key: "usersCount", endpoint: "/stats/platform/users-count" },
      { key: "topGenres", endpoint: "/stats/platform/top-genres" },
      { key: "totalAwards", endpoint: "/stats/platform/total-awards" },
      {
        key: "averageBoxOfficeAndScores",
        endpoint: "/stats/platform/average-scores"
      },
      { key: "booksAdaptationsCount", endpoint: "/stats/platform/adaptations" }
    ];

    // Loop over each endpoint, fetch data, and update state independently
    endpoints.forEach(({ key, endpoint }) => {
      fetch(`/api${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
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

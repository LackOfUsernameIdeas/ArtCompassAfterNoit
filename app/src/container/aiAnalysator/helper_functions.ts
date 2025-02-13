import {
  F1ScoreData,
  PrecisionData,
  RecallData,
  RelevanceResponse,
  UserPreferences
} from "./aiAnalysator-types";

/**
 * @function checkRelevanceAI
 * @description Изпраща заявка до сървъра за проверка на релевантността на филми/сериали
 * спрямо последните потребителски предпочитания.
 * @param {string} token - Токен за удостоверяване.
 * @returns {Promise<Object>} Промис, който връща JSON с резултатите за релевантност.
 */
export const checkRelevanceForLastSavedRecommendations = async (
  token: string,
  setShowError: React.Dispatch<React.SetStateAction<boolean>>
): Promise<RelevanceResponse> => {
  try {
    const response = await fetch(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/check-relevance-for-last-saved-recommendations`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ token })
      }
    );

    const data = await response.json();

    const isError =
      !response.ok || data.message === "No user preferences found.";

    setShowError(isError);

    if (!response.ok) {
      throw new Error(`Error with request: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    console.error("Грешка при проверката на релевантността:", error);
    throw error;
  }
};

/**
 * @function getPrecisionTotal
 * @description Изпраща заявка към сървъра за изчисляване на Precision на база всички препоръки, правени някога за даден потребител.
 * @param {string} token - Токен за удостоверяване.
 * @param {Object} userPreferences - Предпочитанията на потребителя.
 * @returns {Promise<PrecisionData>} Промис, който връща JSON с резултатите за Precision.
 */
export const getPrecisionTotal = async (
  token: string,
  userPreferences: UserPreferences
): Promise<PrecisionData> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/stats/ai/precision-total`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ token, userPreferences })
      }
    );

    if (!response.ok) {
      throw new Error(`Error with request: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Грешка при изчисляване на Precision:", error);
    throw error;
  }
};

/**
 * @function getRecallTotal
 * @description Изпраща заявка към сървъра за изчисляване на Recall на база всички препоръки, правени някога в платформата.
 * @param {string} token - Токен за удостоверяване.
 * @param {Object} userPreferences - Предпочитанията на потребителя.
 * @returns {Promise<RecallData>} Промис, който връща JSON с резултатите за Recall.
 */
export const getRecallTotal = async (
  token: string,
  userPreferences: UserPreferences
): Promise<RecallData> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/stats/ai/recall-total`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ token, userPreferences })
      }
    );

    if (!response.ok) {
      throw new Error(`Error with request: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Грешка при изчисляване на Recall:", error);
    throw error;
  }
};

/**
 * @function getF1Score
 * @description Изпраща заявка към сървъра за изчисляване на F1-score на база Precision и Recall.
 * @param {number} precision_exact - Точната стойност на Precision.
 * @param {number} recall_exact - Точната стойност на Recall.
 * @returns {Promise<F1ScoreData>} Промис, който връща JSON с резултатите за F1-score.
 */
export const getF1Score = async (
  precision_exact: number,
  recall_exact: number
): Promise<F1ScoreData> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/stats/ai/f1-score`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ precision_exact, recall_exact })
      }
    );

    if (!response.ok) {
      throw new Error(`Error with request: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Грешка при изчисляване на F1-score:", error);
    throw error;
  }
};

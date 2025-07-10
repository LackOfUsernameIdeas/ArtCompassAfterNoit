import { MovieSeriesUserPreferencesAfterSaving } from "../types_common";
import {
  F1ScoreData,
  PrecisionData,
  RecallData,
  RelevanceResponse,
  SecondaryMetricData
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
      `/api/check-relevance-for-last-saved-recommendations`,
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
  userPreferences: MovieSeriesUserPreferencesAfterSaving
): Promise<PrecisionData> => {
  try {
    const response = await fetch(`/api/stats/individual/ai/precision-total`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ token, userPreferences })
    });

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
  userPreferences: MovieSeriesUserPreferencesAfterSaving
): Promise<RecallData> => {
  try {
    const response = await fetch(`/api/stats/individual/ai/recall-total`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ token, userPreferences })
    });

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
 * @param {string} token - Токен за удостоверяване.
 * @param {number} precision_exact - Точната стойност на Precision.
 * @param {number} recall_exact - Точната стойност на Recall.
 * @returns {Promise<F1ScoreData>} Промис, който връща JSON с резултатите за F1-score.
 */
export const getF1Score = async (
  token: string,
  precision_exact: number,
  recall_exact: number
): Promise<F1ScoreData> => {
  try {
    const response = await fetch(`/api/stats/individual/ai/f1-score`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ token, precision_exact, recall_exact })
    });

    if (!response.ok) {
      throw new Error(`Error with request: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Грешка при изчисляване на F1-score:", error);
    throw error;
  }
};

/**
 * Изпраща заявка към сървъра за изчисляване на средните метрики по дни за всички потребители.
 *
 * @returns {Promise<Object>} Промис, който връща JSON с резултатите за средните метрики в платформата измежду всички потребители.
 */
export const getHistoricalAverageMetrics = async () => {
  try {
    const response = await fetch(
      `/api/stats/platform/ai/historical-average-metrics`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Грешка при заявката: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("HistoricalAverageMetrics: ", result);
    return result; // Връща JSON с резултати за средните метрики
  } catch (error) {
    console.error("Грешка при изчисляването на метриките:", error);
    throw error;
  }
};

/**
 * Изпраща заявка към сървъра за изчисляване на средните метрики по дни за специфичен потребител.
 *
 * @param {string} token - Токен за удостоверяване.
 * @returns {Promise<Object>} Промис, който връща JSON с резултатите за средните метрики на потребителя.
 */
export const getHistoricalAverageMetricsForUser = async (token: string) => {
  try {
    const response = await fetch(
      `/api/stats/individual/ai/historical-average-metrics`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ token }) // Изпраща токена в body-то на заявката
      }
    );

    if (!response.ok) {
      throw new Error(`Грешка при заявката: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("HistoricalAverageMetricsForUser: ", result);
    return result; // Връща JSON с резултати за средните метрики на потребителя
  } catch (error) {
    console.error(
      "Грешка при изчисляването на метриките за потребителя:",
      error
    );
    throw error;
  }
};

/**
 * Извлича и комбинира данни от четири API крайни точки за вторични AI метрики.
 *
 * @async
 * @function getSecondaryMetricsData
 * @param {string} token - Токен за удостоверяване на заявката.
 * @param {MovieSeriesUserPreferencesAfterSaving} userPreferences - Потребителски предпочитания, използвани за изчисленията.
 * @returns {Promise<SecondaryMetricData[]>} - Масив от обекти с комбинирани метрики: точност (accuracy), специфичност (specificity),
 * честота на пропускане (FNR) и честота на фалшиви открития (FPR).
 * @throws {Error} - Ако заявката към някоя от крайните точки е неуспешна.
 *
 * @example
 * getSecondaryMetricsData(token, userPreferences)
 *   .then((data) => console.log("Вторични метрики:", data))
 *   .catch((error) => console.error("Грешка при зареждане на метрики:", error));
 */
export const getSecondaryMetricsData = async (
  token: string,
  userPreferences: MovieSeriesUserPreferencesAfterSaving
): Promise<SecondaryMetricData[]> => {
  try {
    const endpoints = [
      "accuracy-total",
      "specificity-total",
      "fnr-total",
      "fpr-total"
    ];

    const requests = endpoints.map(async (endpoint) => {
      const response = await fetch(`/api/stats/individual/ai/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ token, userPreferences })
      });

      if (!response.ok) {
        throw new Error(
          `Error with request to ${endpoint}: ${response.statusText}`
        );
      }

      return response.json();
    });

    // Изчакваме всички заявки и запазваме резултатите
    const [accuracy, specificity, fnr, fpr] = await Promise.all(requests);

    return [
      {
        fpr_exact: fpr?.fpr_exact,
        fpr_fixed: fpr?.fpr_fixed,
        fpr_percentage: fpr?.fpr_percentage,
        irrelevant_user_recommendations_count:
          fpr?.irrelevant_user_recommendations_count,
        user_recommendations_count: fpr?.user_recommendations_count,
        irrelevant_platform_recommendations_count:
          fpr?.irrelevant_platform_recommendations_count,
        total_platform_recommendations_count:
          fpr?.total_platform_recommendations_count
      },
      {
        fnr_exact: fnr?.fnr_exact,
        fnr_fixed: fnr?.fnr_fixed,
        fnr_percentage: fnr?.fnr_percentage,
        relevant_non_given_recommendations_count:
          fnr?.relevant_non_given_recommendations_count,
        relevant_user_recommendations_count:
          fnr?.relevant_user_recommendations_count,
        user_recommendations_count: fnr?.user_recommendations_count,
        relevant_platform_recommendations_count:
          fnr?.relevant_platform_recommendations_count,
        total_platform_recommendations_count:
          fnr?.total_platform_recommendations_count
      },
      {
        specificity_exact: specificity?.specificity_exact,
        specificity_fixed: specificity?.specificity_fixed,
        specificity_percentage: specificity?.specificity_percentage,
        irrelevant_non_given_recommendations_count:
          specificity?.irrelevant_non_given_recommendations_count,
        non_given_recommendations_count:
          specificity?.non_given_recommendations_count,
        irrelevant_user_recommendations_count:
          specificity?.irrelevant_user_recommendations_count,
        user_recommendations_count: specificity?.user_recommendations_count,
        irrelevant_platform_recommendations_count:
          specificity?.irrelevant_platform_recommendations_count,
        total_platform_recommendations_count:
          specificity?.total_platform_recommendations_count
      },
      {
        accuracy_exact: accuracy?.accuracy_exact,
        accuracy_fixed: accuracy?.accuracy_fixed,
        accuracy_percentage: accuracy?.accuracy_percentage,
        irrelevant_non_given_recommendations_count:
          accuracy?.irrelevant_non_given_recommendations_count,
        relevant_non_given_recommendations_count:
          accuracy?.relevant_non_given_recommendations_count,
        non_given_recommendations_count:
          accuracy?.non_given_recommendations_count,
        relevant_user_recommendations_count:
          accuracy?.relevant_user_recommendations_count,
        user_recommendations_count: accuracy?.user_recommendations_count,
        relevant_platform_recommendations_count:
          accuracy?.relevant_platform_recommendations_count,
        total_platform_recommendations_count:
          accuracy?.total_platform_recommendations_count
      }
    ];
  } catch (error) {
    console.error("Грешка при изчисляване на вторичните метрики:", error);
    throw error;
  }
};

import {
  MovieSeriesRecommendationAfterSaving,
  MovieSeriesUserPreferencesAfterSaving
} from "../types_common";

// Тип за данните за Precision
export type PrecisionData = {
  precision_exact: number; // Точен Precision
  precision_fixed: number; // Коригиран Precision
  precision_percentage: number; // Precision в проценти
  relevant_recommendations_count: number; // Брой релевантни препоръки
  total_recommendations_count: number; // Общо препоръки
};

// Тип за данните за възвръщаемост (recall)
export type RecallData = {
  recall_exact: number; // Точна възвръщаемост
  recall_fixed: number; // Коригирана възвръщаемост
  recall_percentage: number; // Възвръщаемост в проценти
  relevant_user_recommendations_count: number; // Брой релевантни препоръки от потребителя
  relevant_platform_recommendations_count: number; // Брой релевантни препоръки от платформата
  total_user_recommendations_count: number; // Общо препоръки от потребителя
  total_platform_recommendations_count: number; // Общо препоръки от платформата
};

// Тип за данните за F1-оценка (F1 Score)
export type F1ScoreData = {
  f1_score_exact: number; // Точна F1-оценка
  f1_score_fixed: number; // Коригирана F1-оценка
  f1_score_percentage: number; // F1-оценка в проценти
};

// Тип за данните за всички показатели за оценка на машинното обучение (Precision, Recall, F1 Score)
export type Metrics = {
  record_date: string; // Дата на запис
  average_precision: string; // Средна точност
  average_precision_percentage: string; // Среден процент на точност
  average_recall: string; // Среден припомняне
  average_recall_percentage: string; // Среден процент на припомняне
  average_f1_score: string; // Среден F1 резултат
  average_f1_score_percentage: string; // Среден процент на F1 резултат
  average_precision_last_round: string; // Средна точност за последния кръг
  average_precision_last_round_percentage: string; // Среден процент на точност за последния кръг
};

// Интерфейс за свойствата на таблото за анализ на изкуствения интелект
export interface AIAnalysisDashboardProps {
  precisionData: PrecisionData; // Данни за Precision
  recallData: RecallData; // Данни за възвръщаемост
  f1ScoreData: F1ScoreData; // Данни за F1-оценка
}

// Интерфейс за карта със статистика
export interface StatisticCardProps {
  title: string; // Заглавие на картата
  value: number | string; // Стойност на показателя
}

// Интерфейс за карта с метрика
export interface MetricCardProps {
  title: string; // Заглавие на картата
  value: number | string; // Стойност на метриката
  description: string; // Описание на метриката
  progress: number; // Прогрес на стойността (например процент)
}

// Интерфейс за критериите на модала за оценяване
export interface CriteriaScores {
  genres: number; // Съвпадение по жанрове
  type: number; // Съвпадение по тип (филм/сериал)
  mood: number; // Съвпадение по настроение
  timeAvailability: number; // Наличност на време за гледане
  preferredAge: number; // Предпочитана възраст (спрямо година на издаване)
  targetGroup: number; // Целева аудитория
}

// Интерфейс за анализа на препоръките
export interface Analysis {
  imdbID: string; // Уникален идентификатор на филма/сериала в IMDb
  title_en: string; // Английско заглавие на филма/сериала
  title_bg: string; // Българско заглавие на филма/сериала
  isRelevant: boolean; // Дали препоръката е релевантна
  relevanceScore: number; // Общ резултат за релевантност
  criteriaScores: CriteriaScores; // Подробен резултат по отделни критерии
}

// Интерфейс за пропсовете на MetricCharts
export interface MetricChartsProps {
  historicalMetrics: Metrics[] | null; // Исторически данни за метрики (глобални)
  historicalUserMetrics: Metrics[] | null; // Исторически данни за метрики на конкретен потребител
}

// Тип за анализа на препоръките
export type RecommendationsAnalysis = {
  relevantCount: number; // Брой релевантни препоръки
  totalCount: number; // Общ брой препоръки
  precisionValue: number; // Стойност на Precision
  precisionPercentage: number; // Процентна стойност на Precision
  relevantRecommendations: Analysis[]; // Списък с релевантни препоръки (imdbID)
};

// Тип, който описва отговора на заявката за релевантност на последно генерираните препоръките
export type RelevanceResponse = {
  lastSavedUserPreferences: MovieSeriesUserPreferencesAfterSaving; // Предпочитания на потребителя (по избор)
  lastSavedRecommendations: MovieSeriesRecommendationAfterSaving[]; // Списък с последно генерирани препоръки
  relevanceResults: Analysis[]; // Списък с релевантни препоръки
};

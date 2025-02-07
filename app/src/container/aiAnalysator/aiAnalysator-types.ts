export type PrecisionData = {
  precision_exact: number;
  precision_fixed: number;
  precision_percentage: number;
  relevant_recommendations_count: number;
  total_recommendations_count: number;
};

export type RecallData = {
  recall_exact: number;
  recall_fixed: number;
  recall_percentage: number;
  relevant_user_recommendations_count: number;
  relevant_platform_recommendations_count: number;
  total_user_recommendations_count: number;
  total_platform_recommendations_count: number;
};

export type F1ScoreData = {
  f1_score_exact: number;
  f1_score_fixed: number;
  f1_score_percentage: number;
};

export interface AIAnalysisDashboardProps {
  precisionData: PrecisionData;
  recallData: RecallData;
  f1ScoreData: F1ScoreData;
}

export interface StatisticCardProps {
  title: string;
  value: number | string;
}

export interface MetricCardProps {
  title: string;
  value: number | string;
  description: string;
  progress: number;
}

// Интерфейс за критериите на модала за оценяване
export interface CriteriaScores {
  genres: number; // жанровете
  type: number; // типа (филм/сериал)
  mood: number; // настроението
  timeAvailability: number; // наличното време за гледане
  preferredAge: number; // предпочитаната възраст (спрямо година на издаване)
  targetGroup: number; // целевата аудитория
}

export interface Analysis {
  imdbID: string; // Уникален идентификатор на филма/сериала в IMDb
  isRelevant: boolean; // Дали препоръката е подходяща според критериите
  relevanceScore: number; // Общ резултат за релевантност
  criteriaScores: CriteriaScores; // Подробен резултат по отделни критерии
}

export type RecommendationsAnalysis = {
  relevantCount: number; // Броят на релевантните препоръки
  totalCount: number; // Общо броят на препоръките
  precisionValue: number; // Стойността на прецизността
  precisionPercentage: number; // Процентното изражение на прецизността
  relevantRecommendations: Analysis[]; // Списък с релевантни препоръки (imdbID)
};

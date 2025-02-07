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

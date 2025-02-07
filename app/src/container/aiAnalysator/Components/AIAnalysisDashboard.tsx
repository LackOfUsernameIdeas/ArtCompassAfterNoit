import { FC } from "react";
import { AIAnalysisDashboardProps } from "../AIAnalysator-types";
import { MetricCard } from "./MetricCard";
import { StatisticCard } from "./StatisticCard";

const AIAnalysisDashboard: FC<AIAnalysisDashboardProps> = ({
  precisionData,
  recallData,
  f1ScoreData
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">
        AI Analysis Dashboard
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="Precision"
          value={precisionData.precision_percentage.toFixed(2)}
          description={`${precisionData.relevant_recommendations_count} out of ${precisionData.total_recommendations_count} recommendations were relevant`}
          progress={precisionData.precision_percentage}
        />
        <MetricCard
          title="Recall"
          value={recallData.recall_percentage.toFixed(2)}
          description={`${recallData.relevant_user_recommendations_count} out of ${recallData.relevant_platform_recommendations_count} relevant recommendations were made`}
          progress={recallData.recall_percentage}
        />
        <MetricCard
          title="F1 Score"
          value={f1ScoreData.f1_score_percentage.toFixed(2)}
          description="Balance between Precision and Recall"
          progress={f1ScoreData.f1_score_percentage}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatisticCard
          title="Total Recommendations"
          value={precisionData.total_recommendations_count}
        />
        <StatisticCard
          title="Relevant Recommendations"
          value={precisionData.relevant_recommendations_count}
        />
        <StatisticCard
          title="Platform Recommendations"
          value={recallData.total_platform_recommendations_count}
        />
        <StatisticCard
          title="Relevant Platform Recommendations"
          value={recallData.relevant_platform_recommendations_count}
        />
      </div>
    </div>
  );
};

export default AIAnalysisDashboard;

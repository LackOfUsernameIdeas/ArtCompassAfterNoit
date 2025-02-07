import { FC } from "react";
import { AIAnalysisDashboardProps } from "../aiAnalysator-types";
import MainMetricsWidget from "./MainMetricsWidget";
import Widget from "../../../components/common/widget/widget";

const AIAnalysisDashboard: FC<AIAnalysisDashboardProps> = ({
  precisionData,
  recallData,
  f1ScoreData
}) => {
  return (
    <div className="bg-bodybg mt-4 p-6 rounded-xl shadow-lg space-y-6">
      <h2 className="text-2xl font-bold mb-4">AI Analysis Dashboard</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <MainMetricsWidget
          icon={<i className="ti ti-bullseye text-3xl"></i>}
          title="Precision"
          value={`${precisionData.precision_percentage.toFixed(2)}%`}
          description={`${precisionData.relevant_recommendations_count} out of ${precisionData.total_recommendations_count} recommendations were relevant`}
          progress={precisionData.precision_percentage}
        />
        <MainMetricsWidget
          icon={<i className="ti ti-zoom-scan text-3xl"></i>}
          title="Recall"
          value={`${recallData.recall_percentage.toFixed(2)}%`}
          description={`${recallData.relevant_user_recommendations_count} out of ${recallData.relevant_platform_recommendations_count} relevant recommendations were made`}
          progress={recallData.recall_percentage}
        />
        <MainMetricsWidget
          icon={<i className="ti ti-chart-bar text-3xl"></i>}
          title="F1 Score"
          value={`${f1ScoreData.f1_score_percentage.toFixed(2)}%`}
          description="Balance between Precision and Recall"
          progress={f1ScoreData.f1_score_percentage}
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <Widget
          icon={<i className="ti ti-list-numbers text-3xl"></i>}
          title="Total Recommendations"
          value={precisionData.total_recommendations_count}
        />
        <Widget
          icon={<i className="ti ti-check-list text-3xl"></i>}
          title="Relevant Recommendations"
          value={precisionData.relevant_recommendations_count}
        />
        <Widget
          icon={<i className="ti ti-server text-3xl"></i>}
          title="Platform Recommendations"
          value={recallData.total_platform_recommendations_count}
        />
        <Widget
          icon={<i className="ti ti-check-circle text-3xl"></i>}
          title="Relevant Platform Recommendations"
          value={recallData.relevant_platform_recommendations_count}
        />
      </div>
    </div>
  );
};

export default AIAnalysisDashboard;

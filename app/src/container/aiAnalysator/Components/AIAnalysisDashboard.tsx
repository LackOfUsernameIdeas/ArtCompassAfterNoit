import { FC } from "react";
import { AIAnalysisDashboardProps } from "../AIAnalysator-types";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import React from "react";

const AIAnalysisDashboard: FC<AIAnalysisDashboardProps> = ({
  precisionData,
  recallData,
  f1ScoreData
}) => {
  return (
    <div className="bg-bodybg mt-4 p-6 rounded-xl shadow-lg space-y-6">
      <h2 className="text-2xl font-bold mb-4">AI Analysis Dashboard</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Widget
          icon={<i className="ti ti-bullseye text-3xl"></i>}
          title="Precision"
          value={`${precisionData.precision_percentage.toFixed(2)}%`}
          description={`${precisionData.relevant_recommendations_count} out of ${precisionData.total_recommendations_count} recommendations were relevant`}
          progress={precisionData.precision_percentage}
        />
        <Widget
          icon={<i className="ti ti-zoom-scan text-3xl"></i>}
          title="Recall"
          value={`${recallData.recall_percentage.toFixed(2)}%`}
          description={`${recallData.relevant_user_recommendations_count} out of ${recallData.relevant_platform_recommendations_count} relevant recommendations were made`}
          progress={recallData.recall_percentage}
        />
        <Widget
          icon={<i className="ti ti-chart-bar text-3xl"></i>}
          title="F1 Score"
          value={`${f1ScoreData.f1_score_percentage.toFixed(2)}%`}
          description="Balance between Precision and Recall"
          progress={f1ScoreData.f1_score_percentage}
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <StatWidget
          icon={<i className="ti ti-list-numbers text-3xl"></i>}
          title="Total Recommendations"
          value={precisionData.total_recommendations_count}
        />
        <StatWidget
          icon={<i className="ti ti-check-list text-3xl"></i>}
          title="Relevant Recommendations"
          value={precisionData.relevant_recommendations_count}
        />
        <StatWidget
          icon={<i className="ti ti-server text-3xl"></i>}
          title="Platform Recommendations"
          value={recallData.total_platform_recommendations_count}
        />
        <StatWidget
          icon={<i className="ti ti-check-circle text-3xl"></i>}
          title="Relevant Platform Recommendations"
          value={recallData.relevant_platform_recommendations_count}
        />
      </div>
    </div>
  );
};

const Widget: FC<{
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
  progress: number;
}> = ({ icon, title, value, description, progress }) => (
  <Card className="bg-white dark:bg-bodybg2 dark:text-defaulttextcolor/70 p-4 rounded-lg transition-all duration-300 hover:shadow-md">
    <CardContent className="p-0">
      <div className="flex items-center mb-2">
        {icon}
        <h3 className="ml-2 text-sm font-semibold">{title}</h3>
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
      <Progress value={progress} className="mt-2" />
    </CardContent>
  </Card>
);

const StatWidget: FC<{
  icon: React.ReactNode;
  title: string;
  value: number;
}> = ({ icon, title, value }) => (
  <Card className="bg-white dark:bg-bodybg2 dark:text-defaulttextcolor/70 p-4 rounded-lg transition-all duration-300 hover:shadow-md">
    <CardContent className="p-0">
      <div className="flex items-center mb-2">
        {icon}
        <h3 className="ml-2 text-sm font-semibold">{title}</h3>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </CardContent>
  </Card>
);

export default AIAnalysisDashboard;

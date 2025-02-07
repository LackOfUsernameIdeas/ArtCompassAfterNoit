import { FC } from "react";
import FadeInWrapper from "../../components/common/loader/fadeinwrapper";
import AIAnalysisDashboard from "./Components/AIAnalysisDashboard";
import { F1ScoreData, PrecisionData, RecallData } from "./AIAnalysator-types";

const precisionData: PrecisionData = {
  precision_exact: 0.2932098765432099,
  precision_fixed: 0.29,
  precision_percentage: 29.32,
  relevant_recommendations_count: 95,
  total_recommendations_count: 324
};

const recallData: RecallData = {
  recall_exact: 0.8260869565217391,
  recall_fixed: 0.83,
  recall_percentage: 82.61,
  relevant_user_recommendations_count: 95,
  relevant_platform_recommendations_count: 115,
  total_user_recommendations_count: 324,
  total_platform_recommendations_count: 380
};

const f1ScoreData: F1ScoreData = {
  f1_score_exact: 0.6679841897233201,
  f1_score_fixed: 0.67,
  f1_score_percentage: 66.8
};

const AIAnalysator: FC = () => {
  return (
    <FadeInWrapper>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
          <AIAnalysisDashboard
            precisionData={precisionData}
            recallData={recallData}
            f1ScoreData={f1ScoreData}
          />
        </div>
      </main>
    </FadeInWrapper>
  );
};

export default AIAnalysator;

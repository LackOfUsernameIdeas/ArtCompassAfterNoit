import type React from "react";
import PrecisionFormula from "./PrecisionFormula";
import Collapsible from "./Collapsible";
import RelevantRecommendations from "./RelevantRecommendations";

interface RecommendationAnalysis {
  relevantCount: number;
  totalCount: number;
  precisionValue: number;
  precisionPercentage: number;
  relevantRecommendations: Array<{
    imdbID: string;
    isRelevant: boolean;
    relevanceScore: number;
    criteriaScores: {
      genres: number;
      type: number;
      mood: number;
      timeAvailability: number;
      preferredAge: number;
      targetGroup: number;
    };
  }>;
}

interface MovieDataWidgetsProps {
  recommendationsAnalysis: RecommendationAnalysis;
}

const MovieDataWidgets: React.FC<MovieDataWidgetsProps> = ({
  recommendationsAnalysis
}) => {
  const {
    relevantCount,
    totalCount,
    precisionValue,
    precisionPercentage,
    relevantRecommendations
  } = recommendationsAnalysis;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Анализ на препоръките
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Widget
          icon={<i className="ti ti-checklist text-3xl"></i>}
          title="Брой релевантни неща"
          value={relevantCount}
        />
        <Widget
          icon={<i className="ti ti-list text-3xl"></i>}
          title="Общ брой препоръки"
          value={totalCount}
        />
        <Widget
          icon={<i className="ti ti-percentage text-3xl"></i>}
          title="Precision в процент"
          value={`${precisionPercentage}%`}
        />
        <Widget
          icon={<i className="ti ti-star text-3xl"></i>}
          title="Средна релевантност"
          value={(
            relevantRecommendations.reduce(
              (acc, rec) => acc + rec.relevanceScore,
              0
            ) / relevantRecommendations.length
          ).toFixed(2)}
        />
      </div>
      <Collapsible
        title={
          <div className="flex items-center">
            <i className="ti ti-math-function text-2xl mr-2"></i>
            Формула за изчисление на Precision
          </div>
        }
      >
        <PrecisionFormula
          relevantCount={relevantCount}
          totalCount={totalCount}
          precisionValue={precisionValue}
          precisionPercentage={precisionPercentage}
        />
      </Collapsible>
      <RelevantRecommendations recommendations={relevantRecommendations} />
    </div>
  );
};

const Widget: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: string | number;
}> = ({ icon, title, value }) => (
  <div className="bg-gray-50 p-4 rounded-lg transition-all duration-300 hover:shadow-md">
    <div className="flex items-center mb-2">
      {icon}
      <h3 className="ml-2 text-sm font-semibold text-gray-700">{title}</h3>
    </div>
    <p className="text-2xl font-bold text-gray-800">{value}</p>
  </div>
);

export default MovieDataWidgets;

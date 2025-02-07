import React from "react";
import PrecisionFormula from "./PrecisionFormula";
import Collapsible from "./Collapsible";
import RelevantRecommendations from "./RelevantRecommendations";
import Widget from "../../../components/common/widget/widget";

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

interface MovieSeriesDataWidgetsProps {
  recommendationsAnalysis: RecommendationAnalysis;
  currentIndex: number;
  handlePrev: () => void;
  handleNext: () => void;
}

const MovieSeriesDataWidgets: React.FC<MovieSeriesDataWidgetsProps> = ({
  recommendationsAnalysis,
  currentIndex,
  handlePrev,
  handleNext
}) => {
  const {
    relevantCount,
    totalCount,
    precisionValue,
    precisionPercentage,
    relevantRecommendations
  } = recommendationsAnalysis;

  return (
    <div className="bg-bodybg mt-4 p-6 rounded-xl shadow-lg space-y-6">
      <h2 className="text-2xl font-bold mb-4">Анализ на препоръките</h2>
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
      <div className="relative w-full mt-4">
        <svg
          onClick={handlePrev}
          className="absolute top-1/2 transform -translate-y-1/2 left-[-7rem] text-6xl cursor-pointer hover:text-primary hover:scale-110 transition duration-200"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            width: "5rem",
            height: "5rem",
            filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.3))"
          }}
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>

        <RelevantRecommendations
          recommendations={relevantRecommendations}
          currentIndex={currentIndex}
        />

        <svg
          onClick={handleNext}
          className="absolute top-1/2 transform -translate-y-1/2 right-[-7rem] text-6xl cursor-pointer hover:text-primary hover:scale-110 transition duration-200"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            width: "5rem",
            height: "5rem",
            filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.3))"
          }}
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </div>
    </div>
  );
};

export default MovieSeriesDataWidgets;

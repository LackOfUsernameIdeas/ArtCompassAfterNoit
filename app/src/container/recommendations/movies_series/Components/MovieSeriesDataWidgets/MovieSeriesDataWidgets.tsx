import type React from "react";
import PrecisionFormula from "./PrecisionFormula";
import Collapsible from "./Collapsible";
import { RecommendationsAnalysis } from "../../moviesSeriesRecommendations-types";

interface MovieDataWidgetsProps {
  recommendationsAnalysis: RecommendationsAnalysis;
}

const MovieDataWidgets: React.FC<MovieDataWidgetsProps> = ({
  recommendationsAnalysis
}) => {
  const { relevantCount, totalCount, precisionValue } = recommendationsAnalysis;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Анализ на препоръките
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Widget
          icon={<i className="ti ti-checklist text-3xl"></i>}
          title="Брой релевантни неща"
          value={relevantCount}
        />
        <Widget
          icon={<i className="ti ti-list text-3xl"></i>}
          title="Брой на препоръки"
          value={totalCount}
        />
        <Widget
          icon={<i className="ti ti-percentage text-3xl"></i>}
          title="Precision в процент"
          value={`${(precisionValue * 100).toFixed(2)}%`}
        />
      </div>
      <Collapsible
        title={
          <div className="flex items-center">
            <i className="ti ti-math-function mr-2 text-2xl"></i>
            Формула за изчисление на Precision
          </div>
        }
      >
        <PrecisionFormula
          relevantCount={relevantCount}
          totalCount={totalCount}
          precisionValue={precisionValue}
        />
      </Collapsible>
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

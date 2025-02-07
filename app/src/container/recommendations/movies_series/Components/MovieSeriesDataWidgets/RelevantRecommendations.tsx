import type React from "react";

interface Recommendation {
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
}

interface RelevantRecommendationsProps {
  recommendations: Recommendation[];
  currentIndex: number;
}

const RelevantRecommendations: React.FC<RelevantRecommendationsProps> = ({
  recommendations,
  currentIndex
}) => {
  const recommendation = recommendations[currentIndex]; // Генерираният филм/сериал

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div key={recommendation.imdbID} className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">
              IMDB ID: {recommendation.imdbID}
            </span>
            <span className="flex items-center">
              {recommendation.isRelevant ? (
                <i className="ti ti-check text-green-500 mr-1 text-xl"></i>
              ) : (
                <i className="ti ti-x text-red-500 mr-1 text-xl"></i>
              )}
              {recommendation.isRelevant ? "Релевантен" : "Нерелевантен"}
            </span>
          </div>
          <div className="mb-2">
            <span className="font-semibold">Релевантност: </span>
            {recommendation.relevanceScore}
          </div>
          <div>
            <span className="font-semibold">Критерии:</span>
            <ul className="list-disc list-inside">
              <li>Жанрове: {recommendation.criteriaScores.genres}</li>
              <li>Тип: {recommendation.criteriaScores.type}</li>
              <li>Настроение: {recommendation.criteriaScores.mood}</li>
              <li>Време: {recommendation.criteriaScores.timeAvailability}</li>
              <li>
                Възрастова група: {recommendation.criteriaScores.preferredAge}
              </li>
              <li>Целева група: {recommendation.criteriaScores.targetGroup}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelevantRecommendations;

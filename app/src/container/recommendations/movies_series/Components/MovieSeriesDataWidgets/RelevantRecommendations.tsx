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
}

const RelevantRecommendations: React.FC<RelevantRecommendationsProps> = ({
  recommendations
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800">
        Релевантни препоръки
      </h3>
      <div className="space-y-4">
        {recommendations.map((rec) => (
          <div key={rec.imdbID} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">IMDB ID: {rec.imdbID}</span>
              <span className="flex items-center">
                {rec.isRelevant ? (
                  <i className="ti ti-check text-green-500 mr-1 text-xl"></i>
                ) : (
                  <i className="ti ti-x text-red-500 mr-1 text-xl"></i>
                )}
                {rec.isRelevant ? "Релевантен" : "Нерелевантен"}
              </span>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Релевантност: </span>
              {rec.relevanceScore}
            </div>
            <div>
              <span className="font-semibold">Критерии:</span>
              <ul className="list-disc list-inside">
                <li>Жанрове: {rec.criteriaScores.genres}</li>
                <li>Тип: {rec.criteriaScores.type}</li>
                <li>Настроение: {rec.criteriaScores.mood}</li>
                <li>Време: {rec.criteriaScores.timeAvailability}</li>
                <li>Възрастова група: {rec.criteriaScores.preferredAge}</li>
                <li>Целева група: {rec.criteriaScores.targetGroup}</li>
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelevantRecommendations;

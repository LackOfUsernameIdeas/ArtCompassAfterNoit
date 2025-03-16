import { connectSocketIO } from "@/container/helper_functions_common";
import { BrainData } from "@/container/types_common";
import React, { useEffect, useState } from "react";

interface BrainAnalysisTrackStatsProps {
  handleRecommendationsSubmit: () => void;
}

const BrainAnalysisTrackStats: React.FC<BrainAnalysisTrackStatsProps> = ({
  handleRecommendationsSubmit
}) => {
  // Състояние за данните от Socket.IO
  const [chartData, setChartData] = useState<BrainData | null>(null);

  useEffect(() => {
    // Свързване със Socket.IO, когато компонентът се монтира
    connectSocketIO(setChartData);

    // Можете да добавите логика за прекъсване на връзката, ако е необходимо
    return () => {
      console.log(
        "Компонентът е демонтиран, връзката с WebSocket трябва да бъде затворена."
      );
    };
  }, []);

  return (
    <div className="question bg-opacity-70 border-2 text-white rounded-lg p-4 glow-effect transition-all duration-300">
      <h2 className="text-xl font-semibold break-words">
        Brain Analysis Complete
      </h2>
      <p className="text-sm text-gray-500 mt-2">
        Your brain profile has been analyzed. Here are your personalized
        recommendations.
      </p>
      <div className="flex justify-center gap-6 mt-6">
        <div
          onClick={handleRecommendationsSubmit}
          className="next glow-next bg-opacity-70 text-white font-bold rounded-lg p-6 mt-4 cursor-pointer hover:scale-105 transition-all duration-300"
        >
          View Recommendations
        </div>
      </div>

      {chartData && (
        <div>
          {/* Може да използваш библиотека за графики като Chart.js или D3.js */}
          <p>Received Data for Chart: {JSON.stringify(chartData)}</p>
        </div>
      )}
    </div>
  );
};

export default BrainAnalysisTrackStats;

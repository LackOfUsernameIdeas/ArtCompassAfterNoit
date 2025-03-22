import type React from "react";
import type { BrainData } from "@/container/types_common";
import BrainWaveChart from "./BrainWaveChart";
import AttentionMeditationChart from "./AttentionMediationChart";
import BrainActivityCard from "./BrainActivityCard";

interface BrainAnalysisTrackStatsProps {
  handleRecommendationsSubmit: (brainData: BrainData[]) => void;
  transmissionComplete: boolean;
  chartData: BrainData | null;
  seriesData: BrainData[];
  attentionMeditation: {
    name: string;
    data: { x: string; y: number }[];
  }[];
}

const BrainAnalysisTrackStats: React.FC<BrainAnalysisTrackStatsProps> = ({
  handleRecommendationsSubmit,
  transmissionComplete,
  chartData,
  seriesData,
  attentionMeditation
}) => {
  // Brain wave configuration with colors
  const brainWaveConfig: Array<{
    key: keyof BrainData;
    title: string;
    color: string;
  }> = [
    { key: "delta", title: "Delta", color: "#8884d8" },
    { key: "theta", title: "Theta", color: "#82ca9d" },
    { key: "lowAlpha", title: "Low Alpha", color: "#ffc658" },
    { key: "highAlpha", title: "High Alpha", color: "#ff8042" },
    { key: "lowBeta", title: "Low Beta", color: "#0088FE" },
    { key: "highBeta", title: "High Beta", color: "#00C49F" },
    { key: "lowGamma", title: "Low Gamma", color: "#FFBB28" },
    { key: "highGamma", title: "High Gamma", color: "#FF8042" }
  ];

  const handleSubmitClick = () => {
    if (!transmissionComplete || seriesData.length === 0) return;
    handleRecommendationsSubmit(seriesData);
  };

  return (
    <div className="text-white rounded-lg p-4 transition-all duration-300">
      {/* This div breaks out of the parent container's max-width constraint */}
      <div className="relative mx-auto">
        {chartData && (
          <div className="space-y-4">
            {/* Real-time Data Card */}
            <BrainActivityCard data={chartData} />

            {/* Chart Layout */}
            <div className="space-y-4">
              {/* Attention & Meditation Chart - Full Width */}
              <AttentionMeditationChart
                attentionMeditation={attentionMeditation}
              />

              {/* Brain Wave Charts - Horizontal Layout */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {brainWaveConfig.slice(0, 4).map((wave) => (
                  <div key={wave.key}>
                    <BrainWaveChart
                      title={wave.title}
                      brainWaveKey={wave.key}
                      seriesData={seriesData}
                      color={wave.color}
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {brainWaveConfig.slice(4).map((wave) => (
                  <div key={wave.key}>
                    <BrainWaveChart
                      title={wave.title}
                      brainWaveKey={wave.key}
                      seriesData={seriesData}
                      color={wave.color}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {transmissionComplete && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleSubmitClick}
            className="next glow-next bg-opacity-70 text-white font-bold rounded-lg px-6 py-3 cursor-pointer hover:scale-105 transition-all duration-300"
          >
            View Recommendations
          </button>
        </div>
      )}
    </div>
  );
};

export default BrainAnalysisTrackStats;

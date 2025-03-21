import type React from "react";
import { useEffect, useState, useRef } from "react";
import { connectSocketIO } from "@/container/helper_functions_common";
import type { BrainData } from "@/container/types_common";
import BrainWaveChart from "./BrainWaveChart";
import AttentionMeditationChart from "./AttentionMediationChart";
import BrainActivityCard from "./BrainActivityCard";

interface BrainAnalysisTrackStatsProps {
  handleRecommendationsSubmit: (brainData: BrainData[]) => void;
}

const BrainAnalysisTrackStats: React.FC<BrainAnalysisTrackStatsProps> = ({
  handleRecommendationsSubmit
}) => {
  // State for Socket.IO data
  const [chartData, setChartData] = useState<BrainData | null>(null);

  // State for time-series data
  const [seriesData, setSeriesData] = useState<BrainData[]>([]);

  // State for attention and meditation
  const [attentionMeditation, setAttentionMeditation] = useState<
    {
      name: string;
      data: { x: number; y: number }[];
    }[]
  >([
    { name: "Attention", data: [] },
    { name: "Meditation", data: [] }
  ]);

  // Reference to track if component is mounted
  const isMounted = useRef(true);

  // Max number of data points to show
  const MAX_DATA_POINTS = 30;

  // Counter for x-axis (since we don't have timestamps in the data)
  const [timeCounter, setTimeCounter] = useState(0);

  useEffect(() => {
    // Connect to Socket.IO when component mounts
    connectSocketIO(setChartData, setTimeCounter);

    // Clean up when component unmounts
    return () => {
      console.log(
        "Component unmounted, WebSocket connection should be closed."
      );
    };
  }, []);

  // Update chart data when new data arrives
  useEffect(() => {
    if (!chartData) return;

    setSeriesData((prevData) => {
      const newData = [...prevData, { ...chartData, timestamp: timeCounter }];

      // Keep only the most recent data points
      return newData.length > MAX_DATA_POINTS
        ? newData.slice(-MAX_DATA_POINTS)
        : newData;
    });

    setAttentionMeditation((prevData) =>
      prevData.map((stat, index) => {
        const key = index === 0 ? "attention" : "meditation";
        const value = chartData[key];

        return {
          ...stat,
          data: updateSeriesData(
            stat.data,
            timeCounter,
            typeof value === "number" ? value : 0
          )
        };
      })
    );
  }, [chartData, timeCounter]);

  // Helper function to update series data
  const updateSeriesData = (
    currentData: { x: number; y: number }[],
    timestamp: number,
    value: number
  ) => {
    const newData = [...currentData, { x: timestamp, y: value }];

    // Keep only the most recent data points
    if (newData.length > MAX_DATA_POINTS) {
      return newData.slice(newData.length - MAX_DATA_POINTS);
    }

    return newData;
  };

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
    { key: "highGamma", title: "Mid Gamma", color: "#FF8042" }
  ];

  const handleSubmitClick = () => {
    if (seriesData.length === 0) return;
    handleRecommendationsSubmit(seriesData);
  };

  return (
    <div className="question bg-opacity-70 border-2 text-white rounded-lg p-3 glow-effect transition-all duration-300">
      <h2 className="text-lg font-semibold break-words mb-1">
        Brain Analysis Complete
      </h2>
      <p className="text-xs text-gray-400 mb-3">
        Your brain profile has been analyzed. Here are your personalized
        recommendations.
      </p>

      {chartData && (
        <div className="space-y-3">
          {/* Real-time Data Card */}
          <BrainActivityCard data={chartData} />

          {/* Chart Layout */}
          <div className="space-y-3">
            {/* Attention & Meditation Chart - Full Width */}
            <div className="h-[120px]">
              <AttentionMeditationChart
                attentionMeditation={attentionMeditation}
              />
            </div>

            {/* Brain Wave Charts - Horizontal Layout with fewer columns */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {brainWaveConfig.slice(0, 6).map((wave) => (
                <div key={wave.key} className="h-[80px]">
                  <BrainWaveChart
                    title={wave.title}
                    brainWaveKey={wave.key}
                    seriesData={seriesData}
                    color={wave.color}
                    timeCounter={timeCounter}
                    maxDataPoints={MAX_DATA_POINTS}
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {brainWaveConfig.slice(6).map((wave) => (
                <div key={wave.key} className="h-[80px]">
                  <BrainWaveChart
                    title={wave.title}
                    brainWaveKey={wave.key}
                    seriesData={seriesData}
                    color={wave.color}
                    timeCounter={timeCounter}
                    maxDataPoints={MAX_DATA_POINTS}
                  />
                </div>
              ))}

              {/* Empty divs to maintain grid alignment */}
              {brainWaveConfig.slice(6).length < 3 && (
                <>
                  <div className="h-[80px] hidden sm:block"></div>
                  <div className="h-[80px] hidden sm:block"></div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {seriesData.length > 0 && (
        <div className="flex justify-center mt-4">
          <button
            onClick={handleSubmitClick}
            className="next glow-next bg-opacity-70 text-white font-bold rounded-lg px-4 py-2 text-sm cursor-pointer hover:scale-105 transition-all duration-300"
          >
            View Recommendations
          </button>
        </div>
      )}
    </div>
  );
};

export default BrainAnalysisTrackStats;

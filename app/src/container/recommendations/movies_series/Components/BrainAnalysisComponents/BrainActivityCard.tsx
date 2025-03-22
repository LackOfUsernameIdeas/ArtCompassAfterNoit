import { useRef } from "react";
import type React from "react";
import type { BrainData } from "@/container/types_common";
import { Activity, Brain, BarChart2 } from "lucide-react";

interface RealTimeDataCardProps {
  data: BrainData | null;
}

const RealTimeDataCard: React.FC<RealTimeDataCardProps> = ({ data }) => {
  const prevValidData = useRef<BrainData | null>(null);

  if (!data) return null;

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

  const shouldKeepPreviousData = brainWaveConfig.every(
    ({ key }) => data[key] === 0
  );

  const displayData =
    shouldKeepPreviousData && prevValidData.current
      ? prevValidData.current
      : data;

  if (!shouldKeepPreviousData) {
    prevValidData.current = data;
  }

  return (
    <div className="bg-black bg-opacity-30 rounded-xl p-4 backdrop-blur-sm shadow-lg">
      <h3 className="text-lg font-medium mb-3 flex items-center">
        <Activity className="mr-2 h-5 w-5 text-emerald-400" />
        <span>Real-Time Brain Activity</span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-black bg-opacity-30 rounded-lg p-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center justify-center">
              <div className="text-xs text-gray-400 mb-1">Attention</div>
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="transparent"
                    stroke="#374151"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="transparent"
                    stroke="#f59e0b"
                    strokeWidth="8"
                    strokeDasharray={`${
                      2.83 * (displayData.attention || 0)
                    } 283`}
                    strokeDashoffset="0"
                    transform="rotate(-90 50 50)"
                    className="transition-all duration-300"
                  />
                </svg>
                <div className="absolute text-lg font-semibold">
                  {displayData.attention || 0}
                </div>
              </div>
            </div>

            {/* Meditation Indicator */}
            <div className="flex flex-col items-center justify-center">
              <div className="text-xs text-gray-400 mb-1">Meditation</div>
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="transparent"
                    stroke="#374151"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="transparent"
                    stroke="#0ea5e9"
                    strokeWidth="8"
                    strokeDasharray={`${
                      2.83 * (displayData.meditation || 0)
                    } 283`}
                    strokeDashoffset="0"
                    transform="rotate(-90 50 50)"
                    className="transition-all duration-300"
                  />
                </svg>
                <div className="absolute text-lg font-semibold">
                  {displayData.meditation || 0}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-black bg-opacity-30 rounded-lg p-3">
          <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
            <BarChart2 className="mr-1 h-4 w-4 text-purple-400" />
            <span>Brain Waves</span>
          </h4>
          <div className="grid grid-cols-4 gap-x-4 gap-y-1">
            {brainWaveConfig.map((wave) => (
              <div key={wave.key} className="flex items-center justify-between">
                <span className="text-xs text-gray-400 truncate mr-1">
                  {wave.title}
                </span>
                <span
                  className="text-xs font-medium"
                  style={{ color: wave.color }}
                >
                  {Math.round(Number(displayData[wave.key]) || 0)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeDataCard;

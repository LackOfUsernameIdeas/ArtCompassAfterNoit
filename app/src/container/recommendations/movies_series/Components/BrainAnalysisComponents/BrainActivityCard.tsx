import type React from "react";
import type { BrainData } from "@/container/types_common";
import { Activity, Brain, BarChart2 } from "lucide-react";

interface BrainActivityCardProps {
  data: BrainData | null;
}

const BrainActivityCard: React.FC<BrainActivityCardProps> = ({ data }) => {
  if (!data) return null;

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

  return (
    <div className="bg-black bg-opacity-40 rounded-xl p-3 backdrop-blur-sm border border-gray-700 shadow-lg">
      <h3 className="text-sm font-medium mb-2 flex items-center">
        <Activity className="mr-1 h-4 w-4 text-emerald-400" />
        <span>Real-Time Brain Activity</span>
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Attention & Meditation */}
        <div className="bg-black bg-opacity-30 rounded-lg p-2">
          <h4 className="text-xs font-medium text-gray-300 mb-1 flex items-center">
            <Brain className="mr-1 h-3 w-3 text-blue-400" />
            <span>Mental State</span>
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col">
              <span className="text-xs text-gray-400">Attention</span>
              <div className="flex items-center">
                <div
                  className="h-1.5 rounded-full bg-gradient-to-r from-yellow-500 to-red-500 mt-1"
                  style={{ width: `${data.attention || 0}%` }}
                ></div>
                <span className="ml-1 text-xs font-medium">
                  {data.attention || 0}
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-400">Meditation</span>
              <div className="flex items-center">
                <div
                  className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-green-500 mt-1"
                  style={{ width: `${data.meditation || 0}%` }}
                ></div>
                <span className="ml-1 text-xs font-medium">
                  {data.meditation || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Brain Waves */}
        <div className="bg-black bg-opacity-30 rounded-lg p-2">
          <h4 className="text-xs font-medium text-gray-300 mb-1 flex items-center">
            <BarChart2 className="mr-1 h-3 w-3 text-purple-400" />
            <span>Brain Waves</span>
          </h4>
          <div className="grid grid-cols-4 gap-x-2 gap-y-1">
            {brainWaveConfig.map((wave) => (
              <div key={wave.key} className="flex items-center justify-between">
                <span className="text-[10px] text-gray-400 truncate mr-1">
                  {wave.title.split(" ")[0]}
                </span>
                <span
                  className="text-[10px] font-medium"
                  style={{ color: wave.color }}
                >
                  {Math.round(Number(data[wave.key]) || 0)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrainActivityCard;

import type React from "react";
import { useEffect, useState, useRef } from "react";
import { connectSocketIO } from "@/container/helper_functions_common";
import type { BrainData } from "@/container/types_common";
import ApexCharts from "react-apexcharts";
import { getBrainWaveKey } from "../helper_functions";

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

  console.log("series", seriesData);
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
    // Свързване със Socket.IO, когато компонентът се монтира
    connectSocketIO(setChartData, setTimeCounter);

    // Можете да добавите логика за прекъсване на връзката, ако е необходимо
    return () => {
      console.log(
        "Компонентът е демонтиран, връзката с WebSocket трябва да бъде затворена."
      );
    };
  }, []);

  // Update chart data when new data arrives
  useEffect(() => {
    if (!chartData) return;

    console.log("chartData received:", chartData); // Debugging log
    console.log("chartData received2:", chartData.attention);
    console.log("chartData received3:", chartData);
    const brainWaveKeys: (keyof BrainData)[] = [
      "delta",
      "theta",
      "lowAlpha",
      "highAlpha",
      "lowBeta",
      "highBeta",
      "lowGamma",
      "highGamma"
    ];

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

        console.log(`Updating ${key}: ${value}`); // Debugging log

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
    console.log("currentData", currentData);
    console.log("newData", newData);
    // Keep only the most recent data points
    if (newData.length > MAX_DATA_POINTS) {
      return newData.slice(newData.length - MAX_DATA_POINTS);
    }

    return newData;
  };

  const brainWaveKeys: (keyof BrainData)[] = [
    "delta",
    "theta",
    "lowAlpha",
    "highAlpha",
    "lowBeta",
    "highBeta",
    "lowGamma",
    "highGamma"
  ];

  const formattedSeries = brainWaveKeys.map((key) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize names
    data: seriesData.map((entry, index) => ({
      x: entry.time || index,
      y: entry[key] || 0
    }))
  }));

  // Chart options for brain waves
  const brainWaveOptions: ApexCharts.ApexOptions = {
    chart: {
      id: "brain-waves-chart",
      type: "line",
      animations: {
        enabled: true,
        easing: "linear",
        dynamicAnimation: {
          speed: 1000
        }
      },
      toolbar: {
        show: false
      },
      background: "transparent"
    },
    colors: [
      "#8884d8",
      "#82ca9d",
      "#ffc658",
      "#ff8042",
      "#0088FE",
      "#00C49F",
      "#FFBB28",
      "#FF8042"
    ],
    stroke: {
      curve: "smooth",
      width: 2
    },
    grid: {
      borderColor: "rgba(255, 255, 255, 0.1)",
      row: {
        colors: ["transparent"],
        opacity: 0.5
      }
    },
    markers: {
      size: 0
    },
    xaxis: {
      type: "numeric",
      labels: {
        formatter: (value) => `${value}s`,
        style: {
          colors: "rgba(255, 255, 255, 0.7)"
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: "rgba(255, 255, 255, 0.7)"
        }
      },
      logarithmic: true,
      min: 1
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      floating: true,
      offsetY: -25,
      offsetX: -5,
      labels: {
        colors: "rgba(255, 255, 255, 0.9)"
      }
    },
    tooltip: {
      theme: "dark"
    },
    dataLabels: {
      enabled: false
    }
  };

  // Chart options for attention and meditation
  const attentionMeditationOptions: ApexCharts.ApexOptions = {
    chart: {
      id: "attention-meditation-chart",
      type: "line",
      animations: {
        enabled: true,
        easing: "linear",
        dynamicAnimation: {
          speed: 1000
        }
      },
      toolbar: {
        show: false
      },
      background: "transparent"
    },
    colors: ["#FF5722", "#4CAF50"],
    stroke: {
      curve: "smooth",
      width: 3
    },
    grid: {
      borderColor: "rgba(255, 255, 255, 0.1)",
      row: {
        colors: ["transparent"],
        opacity: 0.5
      }
    },
    markers: {
      size: 4
    },
    xaxis: {
      type: "numeric",
      labels: {
        formatter: (value) => `${value}s`,
        style: {
          colors: "rgba(255, 255, 255, 0.7)"
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      min: 0,
      max: 100,
      labels: {
        style: {
          colors: "rgba(255, 255, 255, 0.7)"
        }
      }
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      floating: true,
      offsetY: -25,
      offsetX: -5,
      labels: {
        colors: "rgba(255, 255, 255, 0.9)"
      }
    },
    tooltip: {
      theme: "dark"
    },
    dataLabels: {
      enabled: false
    }
  };

  const handleSubmitClick = () => {
    handleRecommendationsSubmit(seriesData);
  };

  console.log("chartData", chartData);
  return (
    <div className="question bg-opacity-70 border-2 text-white rounded-lg p-4 glow-effect transition-all duration-300">
      <h2 className="text-xl font-semibold break-words">
        Brain Analysis Complete
      </h2>
      <p className="text-sm text-gray-500 mt-2">
        Your brain profile has been analyzed. Here are your personalized
        recommendations.
      </p>

      {chartData && (
        <div className="mt-4 space-y-6">
          <div className="p-2 bg-black bg-opacity-30 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Attention & Meditation</h3>
            <div className="h-[200px]">
              <ApexCharts
                options={attentionMeditationOptions}
                series={attentionMeditation}
                type="line"
                height="100%"
              />
            </div>
          </div>

          <div className="p-2 bg-black bg-opacity-30 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Brain Wave Activity</h3>
            <div className="h-[300px]">
              <ApexCharts
                options={brainWaveOptions}
                series={formattedSeries}
                type="line"
                height="100%"
              />
            </div>
            <div className="grid grid-cols-4 gap-2 mt-2 text-xs">
              <div className="flex items-center">
                <span
                  className="w-3 h-3 inline-block mr-1 rounded-full"
                  style={{ backgroundColor: "#8884d8" }}
                ></span>
                <span>Delta</span>
              </div>
              <div className="flex items-center">
                <span
                  className="w-3 h-3 inline-block mr-1 rounded-full"
                  style={{ backgroundColor: "#82ca9d" }}
                ></span>
                <span>Theta</span>
              </div>
              <div className="flex items-center">
                <span
                  className="w-3 h-3 inline-block mr-1 rounded-full"
                  style={{ backgroundColor: "#ffc658" }}
                ></span>
                <span>Low Alpha</span>
              </div>
              <div className="flex items-center">
                <span
                  className="w-3 h-3 inline-block mr-1 rounded-full"
                  style={{ backgroundColor: "#ff8042" }}
                ></span>
                <span>High Alpha</span>
              </div>
              <div className="flex items-center">
                <span
                  className="w-3 h-3 inline-block mr-1 rounded-full"
                  style={{ backgroundColor: "#0088FE" }}
                ></span>
                <span>Low Beta</span>
              </div>
              <div className="flex items-center">
                <span
                  className="w-3 h-3 inline-block mr-1 rounded-full"
                  style={{ backgroundColor: "#00C49F" }}
                ></span>
                <span>High Beta</span>
              </div>
              <div className="flex items-center">
                <span
                  className="w-3 h-3 inline-block mr-1 rounded-full"
                  style={{ backgroundColor: "#FFBB28" }}
                ></span>
                <span>Low Gamma</span>
              </div>
              <div className="flex items-center">
                <span
                  className="w-3 h-3 inline-block mr-1 rounded-full"
                  style={{ backgroundColor: "#FF8042" }}
                ></span>
                <span>Mid Gamma</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center gap-6 mt-6">
        <div
          onClick={handleSubmitClick}
          className="next glow-next bg-opacity-70 text-white font-bold rounded-lg p-6 mt-4 cursor-pointer hover:scale-105 transition-all duration-300"
        >
          View Recommendations
        </div>
      </div>
    </div>
  );
};

export default BrainAnalysisTrackStats;

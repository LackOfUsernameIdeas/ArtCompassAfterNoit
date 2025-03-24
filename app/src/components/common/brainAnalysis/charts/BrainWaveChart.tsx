import type React from "react";
import ApexCharts from "react-apexcharts";
import type { BrainData } from "@/container/types_common";
import { useEffect, useState } from "react";

interface BrainWaveChartProps {
  title: string;
  brainWaveKey: keyof BrainData;
  seriesData: BrainData[];
  color: string;
}

const getThemeOptions = (
  mode: "light" | "dark",
  color: string
): ApexCharts.ApexOptions => {
  const baseOptions: ApexCharts.ApexOptions = {
    chart: {
      id: "brainwave-chart",
      type: "line",
      animations: {
        enabled: true,
        easing: "linear",
        dynamicAnimation: {
          speed: 1000
        }
      },
      toolbar: { show: false },
      background: "transparent",
      sparkline: { enabled: false }
    },
    colors: [color],
    stroke: {
      curve: "smooth",
      width: 3
    },
    markers: {
      size: 0,
      hover: { size: 4 }
    },
    xaxis: {
      type: "numeric",
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: { show: false },
      logarithmic: true,
      min: 1
    },
    dataLabels: { enabled: false },
    legend: { show: false }
  };

  return {
    ...baseOptions,
    fill: {
      type: "gradient",
      gradient: {
        shade: mode,
        type: "vertical",
        shadeIntensity: mode === "dark" ? 0.3 : 0.2,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 100]
      }
    },
    grid: {
      borderColor:
        mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
      row: {
        colors: ["transparent"],
        opacity: 0.5
      },
      padding: { left: 10, right: 10 }
    },
    tooltip: {
      theme: mode,
      x: { show: false }
    }
  };
};

const BrainWaveChart: React.FC<BrainWaveChartProps> = ({
  title,
  brainWaveKey,
  seriesData,
  color
}) => {
  const [mode, setMode] = useState<"light" | "dark">(
    (localStorage.getItem("artMenu") as "light" | "dark") || "light"
  );

  useEffect(() => {
    const handleStorageChange = () => {
      const currentMode = localStorage.getItem("artMenu") as "light" | "dark";
      if (currentMode) setMode(currentMode);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const formattedSeries = [
    {
      name: title,
      data: seriesData.map((entry) => ({
        x: entry.time || 0,
        y: entry[brainWaveKey] || 0
      }))
    }
  ];

  const latestValue =
    seriesData.length > 0
      ? Math.round(Number(seriesData[seriesData.length - 1][brainWaveKey]) || 0)
      : 0;

  return (
    <div className="bg-white dark:bg-black dark:bg-opacity-30 rounded-lg p-3 pb-0 h-full flex flex-col border border-gray-200 dark:border-transparent shadow-sm dark:shadow-none">
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {title}
        </h3>
        <span className="text-sm font-bold" style={{ color }}>
          {latestValue}
        </span>
      </div>
      <div className="flex-grow">
        <ApexCharts
          options={getThemeOptions(mode, color)}
          series={formattedSeries}
          type="area"
          height="100%"
        />
      </div>
    </div>
  );
};

export default BrainWaveChart;

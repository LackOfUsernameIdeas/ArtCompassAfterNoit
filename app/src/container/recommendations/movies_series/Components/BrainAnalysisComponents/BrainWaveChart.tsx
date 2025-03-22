import type React from "react";
import ApexCharts from "react-apexcharts";
import type { BrainData } from "@/container/types_common";

interface BrainWaveChartProps {
  title: string;
  brainWaveKey: keyof BrainData;
  seriesData: BrainData[];
  color: string;
}

const BrainWaveChart: React.FC<BrainWaveChartProps> = ({
  title,
  brainWaveKey,
  seriesData,
  color
}) => {
  const formattedSeries = [
    {
      name: title,
      data: seriesData.map((entry) => ({
        x: entry.time || entry.time || 0,
        y: entry[brainWaveKey] || 0
      }))
    }
  ];

  const latestValue =
    seriesData.length > 0
      ? Math.round(Number(seriesData[seriesData.length - 1][brainWaveKey]) || 0)
      : 0;

  const brainWaveOptions: ApexCharts.ApexOptions = {
    chart: {
      id: `${brainWaveKey}-chart`,
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
      background: "transparent",
      sparkline: {
        enabled: false
      }
    },
    colors: [color],
    stroke: {
      curve: "smooth",
      width: 3
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "vertical",
        shadeIntensity: 0.3,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 100]
      }
    },
    grid: {
      borderColor: "rgba(255, 255, 255, 0.1)",
      row: {
        colors: ["transparent"],
        opacity: 0.5
      },
      padding: {
        left: 10,
        right: 10
      }
    },
    markers: {
      size: 0,
      hover: {
        size: 4
      }
    },
    xaxis: {
      type: "numeric",
      labels: {
        show: false
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
        show: false
      },
      logarithmic: true,
      min: 1
    },
    tooltip: {
      theme: "dark",
      x: {
        show: false
      }
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      show: false
    }
  };

  return (
    <div className="bg-black bg-opacity-30 rounded-lg p-3 pb-0 h-full flex flex-col">
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-sm font-medium text-gray-200">{title}</h3>
        <span className="text-sm font-bold" style={{ color }}>
          {latestValue}
        </span>
      </div>
      <div className="flex-grow">
        <ApexCharts
          options={brainWaveOptions}
          series={formattedSeries}
          type="area"
          height="100%"
        />
      </div>
    </div>
  );
};

export default BrainWaveChart;

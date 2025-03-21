import type React from "react";
import ApexCharts from "react-apexcharts";
import type { BrainData } from "@/container/types_common";

interface BrainWaveChartProps {
  title: string;
  brainWaveKey: keyof BrainData;
  seriesData: BrainData[];
  color: string;
  timeCounter: number;
  maxDataPoints?: number;
}

const BrainWaveChart: React.FC<BrainWaveChartProps> = ({
  title,
  brainWaveKey,
  seriesData,
  color
}) => {
  // Format the data for this specific brain wave
  const formattedSeries = [
    {
      name: title,
      data: seriesData.map((entry) => ({
        x: entry.time || entry.time || 0,
        y: entry[brainWaveKey] || 0
      }))
    }
  ];

  // Get the latest value for this brain wave
  const latestValue =
    seriesData.length > 0
      ? Math.round(Number(seriesData[seriesData.length - 1][brainWaveKey]) || 0)
      : 0;

  // Chart options for brain waves
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
        enabled: true
      }
    },
    colors: [color],
    stroke: {
      curve: "smooth",
      width: 2
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
      show: false
    },
    markers: {
      size: 0,
      hover: {
        size: 3
      }
    },
    xaxis: {
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
      }
    },
    tooltip: {
      theme: "dark",
      x: {
        show: false
      },
      y: {
        formatter: (value) => Math.round(value).toString()
      },
      marker: {
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
    <div className="bg-black bg-opacity-30 rounded-lg p-2 h-full flex flex-col">
      <div className="flex justify-between items-center mb-0">
        <h3 className="text-xs font-medium text-gray-200 truncate">{title}</h3>
        <span className="text-xs font-bold" style={{ color }}>
          {latestValue}
        </span>
      </div>
      <div className="flex-grow min-h-[60px]">
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

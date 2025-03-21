import type React from "react";
import ApexCharts from "react-apexcharts";

interface AttentionMeditationChartProps {
  attentionMeditation: {
    name: string;
    data: { x: number; y: number }[];
  }[];
}

const AttentionMeditationChart: React.FC<AttentionMeditationChartProps> = ({
  attentionMeditation
}) => {
  // Get latest values
  const attentionValue =
    attentionMeditation[0].data.length > 0
      ? Math.round(
          attentionMeditation[0].data[attentionMeditation[0].data.length - 1].y
        )
      : 0;

  const meditationValue =
    attentionMeditation[1].data.length > 0
      ? Math.round(
          attentionMeditation[1].data[attentionMeditation[1].data.length - 1].y
        )
      : 0;

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
      background: "transparent",
      height: 120
    },
    colors: ["#FF5722", "#4CAF50"],
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
      borderColor: "rgba(255, 255, 255, 0.1)",
      row: {
        colors: ["transparent"],
        opacity: 0.5
      },
      padding: {
        left: 5,
        right: 5
      }
    },
    markers: {
      size: 0,
      hover: {
        size: 3
      }
    },
    xaxis: {
      type: "numeric",
      labels: {
        formatter: (value) => `${value}s`,
        style: {
          colors: "rgba(255, 255, 255, 0.7)",
          fontSize: "8px"
        },
        offsetY: -2
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
          colors: "rgba(255, 255, 255, 0.7)",
          fontSize: "8px"
        },
        formatter: (value) => Math.round(value).toString()
      }
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
      position: "top",
      horizontalAlign: "right",
      floating: true,
      offsetY: -5,
      offsetX: -5,
      fontSize: "10px",
      labels: {
        colors: "rgba(255, 255, 255, 0.9)"
      },
      itemMargin: {
        horizontal: 5
      }
    }
  };

  return (
    <div className="bg-black bg-opacity-30 rounded-lg p-2 h-full flex flex-col">
      <div className="flex justify-between items-center mb-0">
        <h3 className="text-xs font-medium text-gray-200">Mental State</h3>
        <div className="flex space-x-2">
          <span className="text-xs font-bold text-[#FF5722]">
            A: {attentionValue}
          </span>
          <span className="text-xs font-bold text-[#4CAF50]">
            M: {meditationValue}
          </span>
        </div>
      </div>
      <div className="flex-grow min-h-[100px]">
        <ApexCharts
          options={attentionMeditationOptions}
          series={attentionMeditation}
          type="area"
          height="100%"
        />
      </div>
    </div>
  );
};

export default AttentionMeditationChart;

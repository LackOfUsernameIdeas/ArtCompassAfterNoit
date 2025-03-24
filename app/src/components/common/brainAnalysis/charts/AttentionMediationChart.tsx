import type React from "react";
import ApexCharts from "react-apexcharts";

interface AttentionMeditationChartProps {
  attentionMeditation: {
    name: string;
    data: { x: string; y: number }[];
  }[];
}

const AttentionMeditationChart: React.FC<AttentionMeditationChartProps> = ({
  attentionMeditation
}) => {
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
      min: 0,
      max: 100,
      labels: {
        style: {
          colors: "rgba(255, 255, 255, 0.7)",
          fontSize: "10px"
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
      labels: {
        colors: "rgba(255, 255, 255, 0.9)"
      }
    }
  };

  return (
    <div className="bg-black bg-opacity-30 rounded-lg p-3 h-full flex flex-col">
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-sm font-medium text-gray-200">
          Менталното Ви състояние
        </h3>
        <div className="flex space-x-3">
          <span className="text-sm font-bold text-[#FF5722]">
            {attentionValue}
          </span>
          <span className="text-sm font-bold text-[#4CAF50]">
            {meditationValue}
          </span>
        </div>
      </div>
      <div className="flex-grow mb-2">
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

import { Component } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

// Интерфейс за свойствата на компонента
interface AverageMetricsTrendProps {
  seriesData: {
    record_date: string;
    average_precision_percentage: string;
    average_recall_percentage: string;
    average_f1_score_percentage: string;
  }[];
}

// Интерфейс за състоянието на компонента
interface AverageMetricsTrendState {
  options: ApexOptions;
  series: ApexAxisChartSeries;
}

// Компонент за визуализация на метриките
export class AverageMetricsTrend extends Component<
  AverageMetricsTrendProps,
  AverageMetricsTrendState
> {
  constructor(props: AverageMetricsTrendProps) {
    super(props);
    this.state = {
      options: this.getUpdatedOptions(),
      series: this.transformData(props.seriesData)
    };
  }

  componentDidUpdate(prevProps: AverageMetricsTrendProps) {
    if (prevProps.seriesData !== this.props.seriesData) {
      this.setState({ series: this.transformData(this.props.seriesData) });
    }
  }

  // Преобразуване на входните данни към подходящ формат за ApexCharts
  transformData(data: AverageMetricsTrendProps["seriesData"]) {
    return [
      {
        name: "Precision (%)",
        data: data.map((entry) => ({
          x: entry.record_date,
          y: parseFloat(entry.average_precision_percentage)
        }))
      },
      {
        name: "Recall (%)",
        data: data.map((entry) => ({
          x: entry.record_date,
          y: parseFloat(entry.average_recall_percentage)
        }))
      },
      {
        name: "F1 Score (%)",
        data: data.map((entry) => ({
          x: entry.record_date,
          y: parseFloat(entry.average_f1_score_percentage)
        }))
      }
    ];
  }

  // Опции за графиката
  getUpdatedOptions(): ApexOptions {
    return {
      chart: {
        type: "line",
        toolbar: { show: false }
      },
      stroke: {
        curve: "smooth",
        width: 2
      },
      markers: {
        size: 4
      },
      colors: ["#FF4560", "#00E396", "#008FFB"],
      xaxis: {
        type: "category",
        labels: { show: true }
      },
      yaxis: {
        labels: { show: true }
      },
      tooltip: {
        theme: "dark"
      }
    };
  }

  render() {
    return (
      <ReactApexChart
        options={this.state.options}
        series={this.state.series}
        type="line"
        height={350}
        width="100%"
      />
    );
  }
}

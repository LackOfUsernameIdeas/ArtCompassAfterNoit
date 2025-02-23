import { Component } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

// Генерира данни за heatmap диаграмата
export function generateData(count: any, yrange: any) {
  let i = 0;
  const series = [];
  while (i < count) {
    const x = "w" + (i + 1).toString();
    const y =
      Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

    series.push({
      x: x,
      y: y
    });
    i++;
  }
  return series;
}

// Преобразува RGB цвят в HEX формат
const rgbToHex = (rgb: string): string => {
  // Уверява се, че входният цвят е във формат "rgb(r, g, b)"
  const result = rgb.match(/\d+/g);
  if (!result || result.length !== 3) {
    throw new Error("Невалиден RGB формат на цвета");
  }

  return `#${result
    .map((x) => parseInt(x).toString(16).padStart(2, "0")) // Преобразува всяка стойност на RGB в HEX
    .join("")}`;
};

// Обновява основния цвят на базата на CSS променливи
const updatePrimaryColor = () => {
  const rootStyles = getComputedStyle(document.documentElement);
  const primary = rootStyles.getPropertyValue("--primary").trim();
  const primaryWithCommas = primary.split(" ").join(",");
  const primaryHex = rgbToHex(primaryWithCommas);

  return primaryHex;
};

// Интерфейс за свойствата на компонента
interface GenrePopularityOverTimeProps {
  seriesData: ApexAxisChartSeries;
}

// Интерфейс за състоянието на компонента
interface GenrePopularityOverTimeState {
  options: ApexOptions;
  series: ApexAxisChartSeries;
}

// Компонент за визуализация на данни като линейна диаграма
export class GenrePopularityOverTime extends Component<
  GenrePopularityOverTimeProps,
  GenrePopularityOverTimeState
> {
  private observer?: MutationObserver;

  constructor(props: GenrePopularityOverTimeProps) {
    super(props);
    this.state = {
      options: this.getUpdatedOptions(),
      series: props.seriesData
    };
  }

  componentDidMount() {
    this.observer = new MutationObserver(this.updateColorRange);
    this.observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"]
    });
  }

  componentWillUnmount() {
    this.observer?.disconnect();
  }

  updateColorRange = () => {
    this.setState({ options: this.getUpdatedOptions() });
  };

  getUpdatedOptions(): ApexOptions {
    const primaryHex = updatePrimaryColor();
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
        size: 4,
        colors: [primaryHex],
        strokeWidth: 2
      },
      colors: [primaryHex],
      xaxis: {
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

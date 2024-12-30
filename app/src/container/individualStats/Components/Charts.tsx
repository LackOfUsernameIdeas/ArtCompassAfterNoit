import { Component } from "react";
import ReactApexChart from "react-apexcharts";
import chroma from "chroma-js";
import { ApexOptions } from "apexcharts";
import { Genre } from "../individualStats-types";

// Revenue Statistics
interface spark3 {
  options?: ApexOptions;
  width?: string | number;
  height?: string | number;
  series?: ApexOptions["series"];
  [key: string]: any;
  label?: XAxisAnnotations | string;
  endingShape?: string;
}

// Преобразува RGB цвят в HEX формат
const rgbToHex = (rgb: string): string => {
  const result = rgb.match(/\d+/g);
  if (!result || result.length !== 3) {
    throw new Error("Невалиден RGB формат на цвета");
  }

  return `#${result
    .map((x) => parseInt(x).toString(16).padStart(2, "0"))
    .join("")}`;
};

// Обновява основния цвят на базата на CSS променливи
const updatePrimaryColor = () => {
  const rootStyles = getComputedStyle(document.documentElement);
  const primary = rootStyles.getPropertyValue("--primary").trim();
  const primaryWithCommas = primary.split(" ").join(",");
  return rgbToHex(primaryWithCommas);
};

interface CategorybarProps {
  data: { topGenres: Genre[] };
}

interface State {
  series: { data: number[] }[];
  options: any;
}

export class Categorybar extends Component<CategorybarProps, State> {
  observer: MutationObserver | null = null;

  constructor(props: CategorybarProps) {
    super(props);

    const { topGenres } = props.data;
    const { categories, values } = this.transformData(topGenres);

    console.log(
      "topGenres: ",
      topGenres,
      "categories, values: ",
      categories,
      values
    );
    this.state = {
      series: [{ data: values }],
      options: this.generateOptions(categories, values)
    };
  }

  componentDidUpdate(prevProps: CategorybarProps) {
    if (prevProps.data.topGenres !== this.props.data.topGenres) {
      this.updateChart();
    }
  }

  componentDidMount() {
    this.observer = new MutationObserver(() => {
      this.updateChartColors();
    });

    this.observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"]
    });
  }

  componentWillUnmount() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  transformData(topGenres: Genre[]) {
    const categories = topGenres.map((genre) => genre.genre_bg);
    const values = topGenres.map((genre) => genre.count);
    return { categories, values };
  }

  generateOptions(categories: string[], values: number[]) {
    const primaryHex = updatePrimaryColor();
    const colorScale = chroma
      .scale([
        chroma(primaryHex).brighten(1).hex(),
        chroma(primaryHex).saturate(2).darken(2).hex()
      ])
      .mode("lab")
      .domain([0, categories.length - 1])
      .colors(categories.length);

    return {
      chart: {
        type: "bar",
        height: 500,
        toolbar: { show: false }
      },
      plotOptions: {
        bar: {
          barHeight: "90%",
          distributed: true,
          horizontal: true,
          dataLabels: { position: "bottom" }
        }
      },
      grid: { borderColor: "#f2f5f7" },
      dataLabels: {
        enabled: true,
        textAnchor: "start",
        style: { colors: ["#fff"] },
        formatter: (val: number, opt: any) =>
          `${categories[opt.dataPointIndex]}: ${val}`,
        offsetX: 0,
        dropShadow: { enabled: false }
      },
      stroke: { width: 1, colors: ["#fff"] },
      xaxis: {
        categories,
        labels: {
          show: true,
          style: {
            colors: "#8c9097",
            fontSize: "11px",
            fontWeight: 600,
            cssClass: "apexcharts-xaxis-label"
          }
        }
      },
      yaxis: { labels: { show: false } },
      tooltip: {
        theme: "dark",
        x: { show: false },
        y: {
          title: {
            formatter: () => ""
          }
        }
      },
      colors: colorScale,
      legend: {
        show: false // Изключваме легендата
      }
    };
  }

  updateChart() {
    const { topGenres } = this.props.data;
    const { categories, values } = this.transformData(topGenres);

    this.setState({
      series: [{ data: values }],
      options: this.generateOptions(categories, values)
    });
  }

  updateChartColors() {
    const { topGenres } = this.props.data;
    const { categories } = this.transformData(topGenres);

    const primaryHex = updatePrimaryColor();
    const colorScale = chroma
      .scale([
        chroma(primaryHex).brighten(1).hex(),
        chroma(primaryHex).saturate(2).darken(2).hex()
      ])
      .mode("lab")
      .domain([0, categories.length - 1])
      .colors(categories.length);

    this.setState((prevState) => ({
      options: {
        ...prevState.options,
        colors: colorScale
      }
    }));
  }

  render() {
    return (
      <ReactApexChart
        options={this.state.options}
        series={this.state.series}
        type="bar"
        height={350}
      />
    );
  }
}

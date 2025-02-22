import { Component } from "react";
import ReactApexChart from "react-apexcharts";
import chroma from "chroma-js";
import { TopGenres } from "../booksIndividualStats-types";

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
  data: TopGenres;
}

interface State {
  series: { name: string; data: number[] }[];
  options: any;
}

export class Categorybar extends Component<CategorybarProps, State> {
  observer: MutationObserver | null = null;

  constructor(props: CategorybarProps) {
    super(props);

    // Трансформиране на входните данни в категории и стойности
    const { categories, values } = this.transformData(props.data);

    console.log(
      "topGenres: ",
      props.data,
      "categories, values: ",
      categories,
      values
    );

    // Инициализиране на състоянието с данните за графиката
    this.state = {
      series: [
        {
          name: "Top Genres",
          data: values
        }
      ],
      options: this.generateOptions(categories, values)
    };
  }

  componentDidUpdate(prevProps: CategorybarProps) {
    // Проверка дали входните данни са се променили
    if (prevProps.data !== this.props.data) {
      this.updateChart();
    }
  }

  componentDidMount() {
    // Създаване на наблюдател за промени в класовете на документа (за тъмна/светла тема)
    this.observer = new MutationObserver(() => {
      this.updateChartColors();
    });

    this.observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"]
    });
  }

  componentWillUnmount() {
    // Спиране на наблюдателя при демонтиране на компонента
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  transformData(data: TopGenres) {
    // Преобразуване на масива с жанрове в отделни масиви за категории и стойности
    const categories = data.map((genre) => genre.genre_bg);
    const values = data.map((genre) => genre.count);
    return { categories, values };
  }

  generateOptions(categories: string[], _values: number[]) {
    // Определяне на основния цвят и създаване на цветова скала за графиката
    const primaryHex = updatePrimaryColor();
    const colorScale = chroma
      .scale([
        chroma(primaryHex).hex(),
        chroma(primaryHex).saturate(2).darken(2).hex()
      ])
      .mode("lab")
      .domain([0, categories.length - 1])
      .colors(categories.length);

    return {
      chart: {
        toolbar: {
          show: false // Скриване на тулбара на графиката
        },
        height: 320,
        type: "bar",
        events: {
          mounted: (chart: any) => {
            chart.windowResizeHandler(); // Обновяване на графиката при промяна на размера на прозореца
          }
        }
      },
      grid: {
        borderColor: "#f2f5f7" // Цвят на мрежата в графиката
      },
      plotOptions: {
        bar: {
          borderRadius: 10, // Закръглени ъгли на колоните
          dataLabels: {
            position: "top" // Позиция на етикетите върху колоните
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => `${val}`, // Форматиране на стойностите
        offsetY: -20,
        style: {
          fontSize: "12px",
          colors: ["#8c9097"]
        }
      },
      colors: colorScale, // Задаване на цветовата схема
      xaxis: {
        categories, // Категориите на X оста (жанровете)
        position: "top",
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        crosshairs: {
          fill: {
            type: "gradient",
            gradient: {
              colorFrom: "#D8E3F0",
              colorTo: "#BED1E6",
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5
            }
          }
        },
        tooltip: {
          enabled: false
        },
        labels: {
          show: false,
          style: {
            colors: "#8c9097",
            fontSize: "11px",
            fontWeight: 600,
            cssClass: "apexcharts-xaxis-label"
          }
        }
      },
      yaxis: {
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        labels: {
          show: false
        }
      },
      title: {
        floating: true,
        offsetY: 330,
        align: "center",
        style: {
          color: "#444"
        }
      },
      tooltip: {
        theme: "dark",
        x: {
          show: false
        },
        y: {
          title: {
            formatter: (_val: any, opts: any) => {
              // Показване на жанра в tooltip-а
              const genre = categories[opts.dataPointIndex];
              return `${genre}:`;
            }
          }
        }
      },
      legend: {
        show: false // Скриване на легендата
      }
    };
  }

  updateChart() {
    // Обновяване на графиката при промяна на входните данни
    const { categories, values } = this.transformData(this.props.data);

    this.setState({
      series: [
        {
          name: "Top Genres",
          data: values
        }
      ],
      options: this.generateOptions(categories, values)
    });
  }

  updateChartColors() {
    // Обновяване на цветовата схема при промяна на темата (тъмен/светъл режим)
    const { categories } = this.transformData(this.props.data);

    const primaryHex = updatePrimaryColor();
    const colorScale = chroma
      .scale([
        chroma(primaryHex).hex(),
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

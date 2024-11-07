import { Component } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import face4 from "../../../assets/images/faces/4.jpg";
import face15 from "../../../assets/images/faces/15.jpg";
import face11 from "../../../assets/images/faces/11.jpg";
import face8 from "../../../assets/images/faces/8.jpg";
import face9 from "../../../assets/images/faces/9.jpg";
import { MovieData } from "../home-types";

//
interface spark3 {
  options?: ApexOptions;
  width?: string | number;
  height?: string | number;
  series?: ApexOptions["series"];
  [key: string]: any;
  label?: XAxisAnnotations;
  endingShape?: string;
}

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

export class Totalcustomers extends Component<{}, spark3> {
  constructor(props: {} | Readonly<{}>) {
    super(props);

    this.state = {
      series: [
        {
          name: "Value",
          data: [20, 14, 19, 10, 23, 20, 22, 9, 12]
        }
      ],
      options: {
        colors: ["rgb(132, 90, 223)"],
        chart: {
          type: "line",
          height: 40,
          width: 100,
          sparkline: {
            enabled: true
          },
          events: {
            mounted: (chart: any) => {
              chart.windowResizeHandler();
            }
          }
        },
        stroke: {
          show: true,
          curve: "smooth",
          lineCap: "butt",
          colors: undefined,
          width: 1.5,
          dashArray: 0
        },
        fill: {
          type: "gradient",
          gradient: {
            opacityFrom: 0.9,
            opacityTo: 0.9,
            stops: [0, 98]
          }
        },
        yaxis: {
          min: 0,
          show: false,
          axisBorder: {
            show: false
          }
        },
        xaxis: {
          // show: false,
          axisBorder: {
            show: false
          }
        },
        tooltip: {
          enabled: false
        }
      }
    };
  }

  render() {
    return (
      <div>
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="line"
          height={40}
          width={100}
        />
      </div>
    );
  }
}
//
export class Totalrevenue extends Component<{}, spark3> {
  constructor(props: {} | Readonly<{}>) {
    super(props);

    this.state = {
      series: [
        {
          name: "Value",
          data: [20, 14, 20, 22, 9, 12, 19, 10, 25]
        }
      ],
      options: {
        colors: ["rgb(35, 183, 229)"],
        chart: {
          type: "line",
          height: 40,
          width: 100,
          sparkline: {
            enabled: true
          },
          events: {
            mounted: (chart: any) => {
              chart.windowResizeHandler();
            }
          }
        },
        stroke: {
          show: true,
          curve: "smooth",
          lineCap: "butt",
          colors: undefined,
          width: 1.5,
          dashArray: 0
        },
        fill: {
          type: "gradient",
          gradient: {
            opacityFrom: 0.9,
            opacityTo: 0.9,
            stops: [0, 98]
          }
        },
        yaxis: {
          min: 0,
          show: false,
          axisBorder: {
            show: false
          }
        },
        xaxis: {
          axisBorder: {
            show: false
          }
        },
        tooltip: {
          enabled: false
        }
      }
    };
  }

  render() {
    return (
      <div>
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="line"
          height={40}
          width={100}
        />
      </div>
    );
  }
}

//
export class Conversionratio extends Component<{}, spark3> {
  constructor(props: {} | Readonly<{}>) {
    super(props);

    this.state = {
      series: [
        {
          name: "Value",
          data: [20, 20, 22, 9, 14, 19, 10, 25, 12]
        }
      ],
      options: {
        colors: ["rgb(38, 191, 148)"],
        chart: {
          type: "line",
          height: 40,
          width: 100,
          sparkline: {
            enabled: true
          },
          events: {
            mounted: (chart: any) => {
              chart.windowResizeHandler();
            }
          }
        },
        stroke: {
          show: true,
          curve: "smooth",
          lineCap: "butt",
          colors: undefined,
          width: 1.5,
          dashArray: 0
        },
        fill: {
          type: "gradient",
          gradient: {
            opacityFrom: 0.9,
            opacityTo: 0.9,
            stops: [0, 98]
          }
        },

        yaxis: {
          min: 0,
          show: false,
          axisBorder: {
            show: false
          }
        },
        xaxis: {
          axisBorder: {
            show: false
          }
        },
        tooltip: {
          enabled: false
        }
      }
    };
  }

  render() {
    return (
      <div>
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="line"
          height={40}
          width={100}
        />
      </div>
    );
  }
}
//
export class Totaldeals extends Component<{}, spark3> {
  constructor(props: {} | Readonly<{}>) {
    super(props);

    this.state = {
      series: [
        {
          name: "Value",
          data: [20, 20, 22, 9, 12, 14, 19, 10, 25]
        }
      ],
      options: {
        colors: ["rgb(245, 184, 73)"],
        chart: {
          type: "line",
          height: 40,
          width: 100,
          sparkline: {
            enabled: true
          },
          events: {
            mounted: (chart: any) => {
              chart.windowResizeHandler();
            }
          }
        },
        stroke: {
          show: true,
          curve: "smooth",
          lineCap: "butt",
          colors: undefined,
          width: 1.5,
          dashArray: 0
        },
        fill: {
          type: "gradient",
          gradient: {
            opacityFrom: 0.9,
            opacityTo: 0.9,
            stops: [0, 98]
          }
        },
        yaxis: {
          min: 0,
          show: false,
          axisBorder: {
            show: false
          }
        },
        xaxis: {
          // show: false,
          axisBorder: {
            show: false
          }
        },
        tooltip: {
          enabled: false
        }
      }
    };
  }

  render() {
    return (
      <div>
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="line"
          height={40}
          width={100}
        />
      </div>
    );
  }
}

interface RevenueAnalyticsProps {
  genrePopularityOverTime: {
    [key: string]: {
      [genre: string]: { genre_en: string; genre_count: number };
    };
  };
}

export class Revenueanalytics extends Component<
  RevenueAnalyticsProps,
  { series: any; options: any }
> {
  constructor(props: RevenueAnalyticsProps) {
    super(props);

    const { genrePopularityOverTime } = this.props;

    // Prepare data for the chart series
    const genres = new Set<string>();
    // Collect all genres from genrePopularityOverTime
    Object.values(genrePopularityOverTime).forEach((yearData) => {
      Object.keys(yearData).forEach((genre) => {
        genres.add(genre);
      });
    });

    // Prepare the chart series data for all genres
    const series = Array.from(genres).map((genre) => {
      return {
        type: "line",
        name: genre, // Use genre name
        data: Object.keys(genrePopularityOverTime).map((year) => {
          const genreData = genrePopularityOverTime[year][genre];
          return genreData ? genreData.genre_count : 0;
        })
      };
    });

    this.state = {
      series: series,
      options: {
        chart: {
          height: 350,
          animations: {
            speed: 500
          },
          dropShadow: {
            enabled: true,
            top: 8,
            left: 0,
            blur: 3,
            color: "#000",
            opacity: 0.1
          },
          toolbar: {
            show: false
          }
        },
        colors: [
          "rgb(132, 90, 223)",
          "rgba(35, 183, 229, 0.85)",
          "rgba(119, 119, 142, 0.05)"
        ],
        dataLabels: {
          enabled: false
        },
        grid: {
          borderColor: "#f1f1f1",
          strokeDashArray: 3
        },
        stroke: {
          curve: "smooth",
          width: [2, 2, 0],
          dashArray: [0, 5, 0]
        },
        xaxis: {
          categories: Object.keys(genrePopularityOverTime), // Years (1944, 1947, 1950, ...)
          axisTicks: {
            show: false
          }
        },
        yaxis: {
          labels: {
            formatter: function (value: number) {
              return value;
            }
          }
        },
        tooltip: {
          y: [
            {
              formatter: function (e: number) {
                return void 0 !== e ? e.toFixed(0) : e;
              }
            }
          ]
        },
        markers: {
          hover: {
            sizeOffset: 5
          }
        }
      }
    };
  }

  render() {
    return (
      <div>
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="line"
          height={350}
        />
      </div>
    );
  }
}
//
//ProfitEarned
export class Profitearned extends Component<{}, spark3> {
  constructor(props: {} | Readonly<{}>) {
    super(props);

    this.state = {
      series: [
        {
          name: "Profit Earned",
          data: [44, 42, 57, 86, 58, 55, 70]
        },
        {
          name: "Total Sales",
          data: [34, 22, 37, 56, 21, 35, 60]
        }
      ],
      options: {
        chart: {
          type: "bar",
          height: 180,
          toolbar: {
            show: false
          },
          events: {
            mounted: (chart: any) => {
              chart.windowResizeHandler();
            }
          }
        },
        grid: {
          borderColor: "#f1f1f1",
          strokeDashArray: 3
        },
        colors: ["rgb(132, 90, 223)", "#e4e7ed"],
        plotOptions: {
          bar: {
            colors: {
              ranges: [
                {
                  from: -100,
                  to: -46,
                  color: "#ebeff5"
                },
                {
                  from: -45,
                  to: 0,
                  color: "#ebeff5"
                }
              ]
            },
            columnWidth: "60%",
            borderRadius: 5
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 2,
          colors: undefined
        },
        legend: {
          show: false,
          position: "top"
        },
        yaxis: {
          title: {
            style: {
              color: "#adb5be",
              fontSize: "13px",
              fontFamily: "poppins, sans-serif",
              fontWeight: 600,
              cssClass: "apexcharts-yaxis-label"
            }
          },
          labels: {
            formatter: function (y) {
              return y.toFixed(0) + "";
            }
          }
        },
        xaxis: {
          categories: ["S", "M", "T", "W", "T", "F", "S"],
          axisBorder: {
            show: true,
            color: "rgba(119, 119, 142, 0.05)",
            offsetX: 0,
            offsetY: 0
          },
          axisTicks: {
            show: true,
            borderType: "solid",
            color: "rgba(119, 119, 142, 0.05)",
            offsetX: 0,
            offsetY: 0
          },
          labels: {
            rotate: -90
          }
        }
      }
    };
  }

  render() {
    return (
      <div>
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="bar"
          height={180}
        />
      </div>
    );
  }
}
//Leads by Source

export class Sourcedata extends Component<{}, spark3> {
  constructor(props: {} | Readonly<{}>) {
    super(props);

    this.state = {
      series: [32, 27, 25, 16],
      options: {
        labels: ["My First Dataset"],
        chart: {
          events: {
            mounted: (chart: any) => {
              chart.windowResizeHandler();
            }
          },
          height: 250,
          type: "donut"
        },
        dataLabels: {
          enabled: false
        },

        legend: {
          show: false
        },
        stroke: {
          show: true,
          curve: "smooth",
          lineCap: "round",
          colors: ["#fff"],
          width: 0,
          dashArray: 0
        },
        plotOptions: {
          pie: {
            expandOnClick: false,
            donut: {
              size: "82%",
              labels: {
                show: false,
                name: {
                  show: true,
                  fontSize: "20px",
                  color: "#495057",
                  offsetY: -4
                },
                value: {
                  show: true,
                  fontSize: "18px",
                  color: undefined,
                  offsetY: 8,
                  formatter: function (val) {
                    return val + "%";
                  }
                }
              }
            }
          }
        },
        colors: [
          "rgb(132, 90, 223)",
          "rgb(35, 183, 229)",
          "rgb(245, 184, 73)",
          "rgb(38, 191, 148)"
        ]
      }
    };
  }

  render() {
    return (
      <div>
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="donut"
          height={250}
        />
      </div>
    );
  }
}

export class Profit extends Component<{}, spark3> {
  constructor(props: {} | Readonly<{}>) {
    super(props);

    this.state = {
      series: [48],
      options: {
        chart: {
          height: 127,
          width: 100,
          type: "radialBar",
          events: {
            mounted: (chart: any) => {
              chart.windowResizeHandler();
            }
          }
        },
        colors: ["rgba(255,255,255,0.9)"],
        plotOptions: {
          radialBar: {
            hollow: {
              margin: 0,
              size: "55%",
              background: "#fff"
            },
            dataLabels: {
              name: {
                offsetY: -10,
                color: "#4b9bfa",
                fontSize: ".625rem",
                show: false
              },
              value: {
                offsetY: 5,
                color: "#4b9bfa",
                fontSize: ".875rem",
                show: true,
                fontWeight: 600
              }
            }
          }
        },
        stroke: {
          lineCap: "round"
        },
        labels: ["Status"]
      }
    };
  }

  render() {
    return (
      <div id="chart">
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="radialBar"
          width={100}
          height={127}
        />
      </div>
    );
  }
}
// Deals Statistics

export const Dealsstatistics = [
  {
    id: "1",
    src: face4,
    name: "Mayor Kelly",
    role: "Manufacture",
    mail: "mayorkelly@gmail.com",
    location: "Germany",
    date: "Sep 15 - Oct 12, 2023",
    color: "info",
    checked: ""
  },
  {
    id: "2",
    src: face15,
    name: "Andrew Garfield",
    role: "Development",
    mail: "andrewgarfield@gmail.com",
    location: "Canada",
    date: "Apr 10 - Dec 12, 2023",
    color: "primary",
    checked: "defaultChecked"
  },
  {
    id: "3",
    src: face11,
    name: "Simon Cowel",
    role: "Service",
    mail: "simoncowel234@gmail.com",
    location: "Europe",
    date: "Sep 15 - Oct 12, 2023",
    color: "danger",
    checked: ""
  },
  {
    id: "4",
    src: face8,
    name: "Mirinda Hers",
    role: "Marketing",
    mail: "mirindahers@gmail.com",
    location: "USA",
    date: "Apr 14 - Dec 14, 2023",
    color: "warning",
    checked: "defaultChecked"
  },
  {
    id: "5",
    src: face9,
    name: "Jacob Smith",
    role: "Social Plataform",
    mail: "jacobsmith@gmail.com",
    location: "Singapore",
    date: "Feb 25 - Nov 25, 2023",
    color: "success",
    checked: "defaultChecked"
  }
];

interface GenrePopularityOverTimeProps {
  seriesData: any[]; // Array of dynamic data for the heatmap
}

interface State {
  options: any; // Keeps chart configuration options
  series?: { name: string; data: number[][] }[]; // Optional series for flexibility
  currentPage?: number;
  pageSize?: number;
}

//color range
export class GenrePopularityOverTime extends Component<
  GenrePopularityOverTimeProps,
  State
> {
  constructor(props: GenrePopularityOverTimeProps) {
    super(props);

    this.state = {
      options: {
        chart: {
          height: 350,
          type: "heatmap",
          events: {
            mounted: (chart: any) => {
              chart.windowResizeHandler();
            }
          }
        },
        plotOptions: {
          heatmap: {
            shadeIntensity: 0.5,
            radius: 0,
            useFillColorAsStroke: true,
            colorScale: {
              ranges: [
                {
                  from: -30,
                  to: 5,
                  name: "малък брой",
                  color: "#845adf"
                },
                {
                  from: 6,
                  to: 20,
                  name: "среден брой",
                  color: "#23b7e5"
                },
                {
                  from: 21,
                  to: 45,
                  name: "висок брой",
                  color: "#f5b849"
                },
                {
                  from: 46,
                  to: 55,
                  name: "много висок брой",
                  color: "#FF5733"
                }
              ]
            }
          }
        },
        dataLabels: {
          enabled: false
        },
        grid: {
          borderColor: ""
        },
        stroke: {
          width: 1
        },
        title: {
          text: "HeatMap Chart with Color Range",
          align: "left",
          style: {
            fontSize: "13px",
            fontWeight: "bold",
            color: "#8c9097"
          }
        },
        xaxis: {
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
        yaxis: {
          labels: {
            show: true,
            style: {
              colors: "#8c9097",
              fontSize: "11px",
              fontWeight: 600,
              cssClass: "apexcharts-yaxis-label"
            }
          }
        }
      }
    };
  }

  // Use dynamic data passed as props
  static getDerivedStateFromProps(
    nextProps: GenrePopularityOverTimeProps,
    nextState: State
  ) {
    const { seriesData } = nextProps;

    // Update the series data dynamically based on the passed prop
    if (seriesData && seriesData.length > 0) {
      const updatedSeries = seriesData.map((data: any) => ({
        name: data.name,
        data: data.data
      }));

      return {
        series: updatedSeries
      };
    }

    return null; // No changes to state if the data is not available
  }

  render() {
    return (
      <ReactApexChart
        options={this.state.options}
        series={this.props.seriesData}
        type="heatmap"
        height={350}
      />
    );
  }
}

interface BoxOfficeVsIMDBRatingProps {
  seriesData: MovieData[];
}

export class BoxOfficeVsIMDBRating extends Component<
  BoxOfficeVsIMDBRatingProps,
  State
> {
  constructor(props: BoxOfficeVsIMDBRatingProps) {
    super(props);

    this.state = {
      options: {
        chart: {
          height: 320,
          type: "scatter",
          zoom: {
            enabled: true,
            type: "xy"
          },
          events: {
            mounted: (chart: any) => {
              chart.windowResizeHandler();
            }
          }
        },
        grid: {
          borderColor: "#f2f5f7"
        },
        colors: ["#845adf"],
        xaxis: {
          title: {
            text: "Box Office Revenue (in Millions)"
          },
          tickAmount: 10,
          labels: {
            formatter: (val: any) => `$${Math.round(val)}M`, // Round box office for x-axis
            style: {
              colors: "#8c9097",
              fontSize: "11px",
              fontWeight: 600
            }
          }
        },
        yaxis: {
          title: {
            text: "IMDb Rating"
          },
          tickAmount: 7,
          labels: {
            style: {
              colors: "#8c9097",
              fontSize: "11px",
              fontWeight: 600
            }
          }
        },
        tooltip: {
          shared: false,
          intersect: true,
          custom: function ({ seriesIndex, dataPointIndex, w }: any) {
            console.log("w.globals.series: ", w.globals.series);
            console.log("seriesIndex: ", seriesIndex);
            console.log("dataPointIndex: ", dataPointIndex);
            const movieData = w.globals.series[seriesIndex][dataPointIndex];
            console.log("movieData: ", movieData);
            if (movieData) {
              const movieTitle = movieData.name || "Unknown Movie"; // Movie title
              const imdbRating = movieData.y || "N/A"; // IMDb rating (y-axis)
              const boxOffice = movieData.x * 1e6 || "N/A"; // Convert box office back to full value
              const formattedBoxOffice = `$${boxOffice.toLocaleString()}`;

              return `
                <div style="padding: 10px;">
                  <strong>${movieTitle}</strong><br />
                  IMDb Rating: ${imdbRating}/10<br />
                  Box Office: ${formattedBoxOffice}
                </div>
              `;
            }
            return ""; // Return empty if no data found
          }
        }
      },
      series: []
    };
  }

  static getDerivedStateFromProps(
    nextProps: BoxOfficeVsIMDBRatingProps,
    prevState: State
  ) {
    if (nextProps.seriesData.length > 0) {
      // Modify the seriesData structure to include 'name', 'x', and 'y' for each movie
      const seriesData = nextProps.seriesData.map((movie) => ({
        name: movie.title, // Store movie title in name
        data: [
          {
            x: movie.boxOffice / 1e6, // Convert box office to millions
            y: movie.imdbRating, // IMDb rating
            name: movie.title // Store movie title in each data point
          }
        ]
      }));

      // Log the series data for debugging
      console.log("Series Data:", seriesData);

      return { ...prevState, series: seriesData };
    }
    return null;
  }

  render() {
    return (
      <ReactApexChart
        options={this.state.options}
        series={this.state.series}
        type="scatter"
        height={320}
      />
    );
  }
}

export class MovieBarChart extends Component<
  { seriesData: MovieData[] },
  State
> {
  constructor(
    props: { seriesData: MovieData[] } | Readonly<{ seriesData: MovieData[] }>
  ) {
    super(props);

    this.state = {
      currentPage: 0, // Default to the first page
      pageSize: 10, // Default to displaying 10 movies per page
      series: [],
      options: {
        chart: {
          type: "bar",
          height: 320,
          events: {
            mounted: (chart: any) => {
              chart.windowResizeHandler();
            }
          }
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: true
          }
        },
        colors: ["#845adf"],
        grid: {
          borderColor: "#f2f5f7"
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          title: {
            text: "Movie"
          },
          categories: [], // Movie titles (to be populated)
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
        yaxis: {
          title: {
            text: "IMDb Rating"
          },
          labels: {
            show: true,
            style: {
              colors: "#8c9097",
              fontSize: "11px",
              fontWeight: 600,
              cssClass: "apexcharts-yaxis-label"
            }
          }
        }
      }
    };
  }

  static getDerivedStateFromProps(
    nextProps: { seriesData: MovieData[] },
    prevState: State
  ) {
    if (nextProps.seriesData.length > 0) {
      // Sort the movies by IMDb rating (descending order)
      const sortedMovies = nextProps.seriesData.sort(
        (a, b) => b.imdbRating - a.imdbRating
      );

      // Ensure currentPage and pageSize are defined (use defaults if undefined)
      const currentPage = prevState.currentPage ?? 0; // Default to page 0 if undefined
      const pageSize = prevState.pageSize ?? 10; // Default to 10 items per page if undefined

      // Paginate the data based on the current page
      const start = currentPage * pageSize;
      const end = start + pageSize;
      const paginatedMovies = sortedMovies.slice(start, end);

      // Create the series data for the chart
      const seriesData = {
        name: "IMDb Rating",
        data: paginatedMovies.map((movie) => movie.imdbRating)
      };

      // Create categories (movie titles) for the x-axis
      const categories = paginatedMovies.map((movie) => movie.title);

      return {
        ...prevState,
        series: [seriesData],
        options: {
          ...prevState.options,
          xaxis: {
            ...prevState.options.xaxis,
            categories: categories // Set the movie titles on the y-axis
          }
        }
      };
    }
    return null;
  }

  handlePageChange = (direction: "next" | "prev") => {
    this.setState((prevState) => {
      // Ensure pageSize and currentPage are defined (use defaults if undefined)
      const pageSize = prevState.pageSize ?? 10; // Default to 10 items per page if undefined
      const currentPage = prevState.currentPage ?? 0; // Default to page 0 if undefined

      // Calculate the total number of pages
      const totalPages = Math.ceil(this.props.seriesData.length / pageSize);
      let newPage = currentPage;

      // Handle next or previous page change
      if (direction === "next" && newPage < totalPages - 1) {
        newPage++;
      } else if (direction === "prev" && newPage > 0) {
        newPage--;
      }

      // Return the new page state
      return { currentPage: newPage };
    });
  };

  render() {
    const currentPage = this.state.currentPage ?? 0; // Default to 0 if undefined
    const pageSize = this.state.pageSize ?? 10; // Default to 10 if undefined
    const totalPages = Math.ceil(this.props.seriesData.length / pageSize);

    return (
      <div>
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="bar"
          height={320}
        />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <nav aria-label="Page navigation" className="pagination-style-4">
            <ul className="ti-pagination mb-0">
              <li className="page-item">
                <button
                  onClick={() => this.handlePageChange("prev")}
                  disabled={currentPage === 0}
                  className="page-link"
                >
                  Prev
                </button>
              </li>
              <li className={`page-item ${currentPage ? "active" : ""}`}>
                <span>{currentPage + 1}</span>
              </li>
              <li className="page-item">
                <button
                  onClick={() => this.handlePageChange("next")}
                  disabled={currentPage === totalPages - 1}
                  className="page-link"
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    );
  }
}

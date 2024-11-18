import { Component, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import chroma from "chroma-js";

import {
  ActorData,
  AverageBoxOfficeAndScores,
  CountryData,
  DirectorData,
  MovieData,
  MovieProsperityData,
  RecommendationData,
  RoleData,
  WriterData
} from "../home-types";
import { parseBoxOffice } from "../helper_functions";
import { Link } from "react-router-dom";

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

const rgbToHex = (rgb: string): string => {
  // Ensure the input is in the format "rgb(r, g, b)"
  const result = rgb.match(/\d+/g);
  if (!result || result.length !== 3) {
    throw new Error("Invalid RGB color format");
  }

  return `#${result
    .map((x) => parseInt(x).toString(16).padStart(2, "0")) // Convert each RGB value to hex
    .join("")}`;
};

const updatePrimaryColor = () => {
  const rootStyles = getComputedStyle(document.documentElement);
  const primary = rootStyles.getPropertyValue("--primary").trim();
  const primaryWithCommas = primary.split(" ").join(",");
  const primaryHex = rgbToHex(primaryWithCommas);

  return primaryHex;
};

interface GenrePopularityOverTimeProps {
  seriesData: any[]; // Array of dynamic data for the heatmap
}

interface State {
  options: any; // Keeps chart configuration options
  series?: { name: string; data: (number | null)[] }[]; // Optional series for flexibility
}

export class GenrePopularityOverTime extends Component<
  GenrePopularityOverTimeProps,
  State
> {
  private observer: MutationObserver | null = null;

  constructor(props: GenrePopularityOverTimeProps) {
    super(props);

    const initialColor = updatePrimaryColor();
    const initialColorRange = chroma
      .scale([
        chroma(initialColor).darken(0.5).hex(),
        chroma(initialColor).darken(1).hex()
      ])
      .mode("lab")
      .domain([0, 100]) // Adjust domain values to fit your data
      .colors(10);

    this.state = {
      options: {
        chart: {
          type: "heatmap",
          toolbar: {
            show: false
          }
        },
        plotOptions: {
          heatmap: {
            shadeIntensity: 0.5,
            radius: 0,
            useFillColorAsStroke: true,
            colorScale: {
              ranges: initialColorRange.map((color, index) => ({
                from: index * 10,
                to: (index + 1) * 10,
                color: color
              }))
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
        xaxis: {
          labels: {
            show: true,
            style: {
              colors: "#8c9097",
              fontSize: "11px",
              fontWeight: 600,
              cssClass: "apexcharts-xaxis-label"
            },
            margin: 10
          },
          tickAmount: 12,
          axisTicks: {
            show: true,
            interval: 1
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
        },
        tooltip: {
          custom: function ({
            seriesIndex,
            dataPointIndex,
            w
          }: {
            seriesIndex: number;
            dataPointIndex: number;
            w: any;
          }) {
            const genre = w.config.series[seriesIndex].name;
            const count = w.config.series[seriesIndex].data[dataPointIndex].y;

            return `<div style="padding: 10px;">
                      <strong>Жанр: ${genre}</strong><br>
                      <span>Брой препоръчвания: ${count}</span>
                    </div>`;
          }
        }
      }
    };
  }

  componentDidMount() {
    this.updateColorRange();

    // Initialize the MutationObserver to watch for class changes on document.documentElement
    this.observer = new MutationObserver(() => {
      this.updateColorRange();
    });

    // Observe changes in the classList of the document's root element (theme changes)
    this.observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"]
    });
  }

  componentWillUnmount() {
    // Clean up the MutationObserver when the component is unmounted
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  updateColorRange() {
    const primaryHex = updatePrimaryColor();

    // Generate the new color range based on the primary color
    const newColorRange = chroma
      .scale([
        chroma(primaryHex).darken(0.5).hex(),
        chroma(primaryHex).darken(1).hex()
      ]) // Slightly darker colors
      .mode("lab")
      .domain([0, 100]) // Adjust domain values to fit your data
      .colors(10); // Generate 10 colors based on the primary color

    // Update the state with the new color range
    this.setState((prevState) => ({
      options: {
        ...prevState.options,
        plotOptions: {
          ...prevState.options.plotOptions,
          heatmap: {
            ...prevState.options.plotOptions.heatmap,
            colorScale: {
              ranges: newColorRange.map((color, index) => ({
                from: index * 10,
                to: (index + 1) * 10,
                color: color
              }))
            }
          }
        }
      }
    }));
  }

  render() {
    return (
      <ReactApexChart
        options={this.state.options}
        series={this.props.seriesData}
        type="heatmap"
        height={350}
        width="100%" // Ensure it resizes with the container
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
            type: "x",
            autoScaleYaxis: false,
            zoomedArea: {
              fill: {
                color: "#90CAF9",
                opacity: 0.4
              },
              stroke: {
                color: "#0D47A1",
                opacity: 0.4,
                width: 1
              }
            }
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
        colors: ["#be1313"],
        xaxis: {
          title: {
            text: "Приходи от боксофиса (в милиони)"
          },
          tickAmount: 10,
          labels: {
            formatter: (val: any) => `$${Math.round(val)}M`,
            style: {
              colors: "#8c9097",
              fontSize: "11px",
              fontWeight: 600
            }
          }
        },
        yaxis: {
          title: {
            text: "IMDb рейтинг"
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
            // Access the full movie data object directly from the series data
            const movieData = w.config.series[seriesIndex].data[dataPointIndex];

            if (movieData) {
              const movieTitleEn = movieData.title_en || "Unknown Movie";
              const movieTitleBg = movieData.title_bg || "Unknown Movie";
              const imdbRating =
                movieData.y !== undefined ? movieData.y : "N/A";
              const boxOffice =
                movieData.x !== undefined ? movieData.x * 1e6 : "N/A";
              const formattedBoxOffice =
                boxOffice !== "N/A" ? `$${boxOffice.toLocaleString()}` : "N/A";

              return `
                <div style="padding: 10px;">
                  <strong>${movieTitleBg} (${movieTitleEn})</strong><br />
                  IMDb рейтинг: ${imdbRating}/10<br />
                  Боксофис: ${formattedBoxOffice}
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
      // Map over the movies to set up series data
      const seriesData = [
        {
          name: "Movies",
          data: nextProps.seriesData.map((movie) => ({
            x: parseBoxOffice(movie.boxOffice) / 1e6, // Box Office in millions for x-axis
            y: movie.imdbRating, // IMDb Rating for y-axis
            title_en: movie.title_en,
            title_bg: movie.title_bg
          }))
        }
      ];

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
  { seriesData: MovieData[]; category: string },
  State
> {
  private observer: MutationObserver | null = null;

  constructor(props: { seriesData: MovieData[]; category: string }) {
    super(props);

    // Get the initial color for the theme
    const initialColor = updatePrimaryColor();

    this.state = {
      series: [],
      options: {
        chart: {
          type: "bar",
          toolbar: { show: false }
        },
        plotOptions: { bar: { borderRadius: 4, horizontal: true } },
        grid: { borderColor: "#f2f5f7" },
        dataLabels: { enabled: false },
        xaxis: {
          title: { text: [] },
          categories: []
        },
        yaxis: { title: { text: "Заглавие" } },
        colors: [
          chroma(initialColor).darken(0.6).hex(), // Brighter color for Movies
          chroma(initialColor).brighten(0.6).hex() // Darker color for Series
        ]
      }
    };
  }

  static getDerivedStateFromProps(
    nextProps: { seriesData: MovieData[]; category: string },
    prevState: State
  ) {
    if (nextProps.seriesData && nextProps.seriesData.length > 0) {
      const sortCategory = nextProps.category;
      const sortedMovies =
        sortCategory === "IMDb"
          ? nextProps.seriesData.sort((a, b) => b.imdbRating - a.imdbRating)
          : sortCategory === "Metascore"
          ? nextProps.seriesData.sort((a, b) => b.metascore - a.metascore)
          : nextProps.seriesData.sort(
              (a, b) => b.rottenTomatoes - a.rottenTomatoes
            );

      return {
        series: [
          {
            name:
              sortCategory === "IMDb"
                ? "IMDb рейтинг"
                : sortCategory === "Metascore"
                ? "Метаскор"
                : "Rotten Tomatoes рейтинг",
            data: sortedMovies.map((movie) => {
              // Determine the color based on the type (Movie or Series)
              const color =
                movie.type === "movie"
                  ? prevState.options.colors[0] // Brighter color for movies
                  : prevState.options.colors[1]; // Darker color for series

              return {
                x: `${movie.title_bg} (${movie.title_en})`,
                y:
                  sortCategory === "IMDb"
                    ? movie.imdbRating
                    : sortCategory === "Metascore"
                    ? movie.metascore
                    : movie.rottenTomatoes,
                fillColor: color // Use dynamic color for each movie/series
              };
            })
          }
        ],
        options: {
          ...prevState.options,
          xaxis: {
            ...prevState.options.xaxis,
            title: {
              text:
                sortCategory === "IMDb"
                  ? "IMDb рейтинг"
                  : sortCategory === "Metascore"
                  ? "Метаскор"
                  : "Rotten Tomatoes рейтинг"
            },
            categories: sortedMovies.map(
              (movie) => `${movie.title_bg} (${movie.title_en})`
            )
          }
        }
      };
    }

    return null;
  }

  componentDidMount() {
    this.updateColorRange();

    // Initialize the MutationObserver to watch for class changes on document.documentElement
    this.observer = new MutationObserver(() => {
      this.updateColorRange();
    });

    // Observe changes in the classList of the document's root element (theme changes)
    this.observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"]
    });
  }

  componentWillUnmount() {
    // Clean up the MutationObserver when the component is unmounted
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  updateColorRange() {
    const primaryHex = updatePrimaryColor(); // Get the updated theme color

    // Define the distinct colors based on the updated primary color
    const movieColor = chroma(primaryHex).darken(0.6).hex(); // Brighter movie color
    const seriesColor = chroma(primaryHex).brighten(0.6).hex(); // Darker series color

    // Update the state with the new color values
    this.setState((prevState) => ({
      options: {
        ...prevState.options,
        colors: [movieColor, seriesColor] // Update colors for both categories
      }
    }));
  }

  render() {
    const movieColor = this.state.options.colors[0];
    const seriesColor = this.state.options.colors[1];

    return (
      <div>
        <div className="flex justify-center items-center">
          <div className="flex items-center mr-4">
            <span
              className="w-3 h-3 mr-1 rounded-full inline-block"
              style={{ backgroundColor: movieColor }}
            ></span>
            <span>Филм</span>
          </div>
          <div className="flex items-center">
            <span
              className="w-3 h-3 mr-1 rounded-full inline-block"
              style={{ backgroundColor: seriesColor }}
            ></span>
            <span>Сериал</span>
          </div>
        </div>

        {this.state.series && this.state.series.length > 0 ? (
          <ReactApexChart
            options={this.state.options}
            series={this.state.series}
            type="bar"
            height={320}
          />
        ) : (
          <p>No data available</p>
        )}
      </div>
    );
  }
}

interface AverageScoresStackedBarChartProps {
  averageBoxOfficeAndScores: AverageBoxOfficeAndScores[];
}

export class AverageScoresStackedBarChart extends Component<
  AverageScoresStackedBarChartProps,
  State
> {
  constructor(props: AverageScoresStackedBarChartProps) {
    super(props);

    this.state = {
      series: [
        { name: "Average Box Office", data: [null] },
        { name: "Average Metascore", data: [null] },
        { name: "Average IMDb Rating", data: [null] },
        { name: "Average Rotten Tomatoes", data: [null] }
      ],
      options: {
        chart: {
          type: "bar",
          height: 320,
          stacked: true,
          events: {
            mounted: (chart: any) => {
              chart.windowResizeHandler();
            }
          }
        },
        plotOptions: {
          bar: {
            horizontal: true
          }
        },
        stroke: {
          width: 1,
          colors: ["#fff"]
        },
        colors: ["#845adf", "#23b7e5", "#f5b849", "#38bf94"],
        grid: {
          borderColor: "#f2f5f7"
        },
        xaxis: {
          categories: ["Average Scores"],
          labels: {
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
            style: {
              colors: "#8c9097",
              fontSize: "11px",
              fontWeight: 600,
              cssClass: "apexcharts-yaxis-label"
            }
          }
        },
        tooltip: {
          y: {
            formatter: function (val: number | null) {
              return val !== null ? val.toString() : ""; // Display only non-null values
            }
          }
        },
        fill: {
          opacity: 1
        },
        legend: {
          position: "top",
          horizontalAlign: "left",
          offsetX: 40
        }
      }
    };
  }

  static getDerivedStateFromProps(
    nextProps: AverageScoresStackedBarChartProps,
    prevState: State
  ) {
    if (
      !nextProps.averageBoxOfficeAndScores ||
      nextProps.averageBoxOfficeAndScores.length === 0
    ) {
      // If data is not yet available, return early to avoid unnecessary state updates
      return null;
    }

    const boxOfficeData = nextProps.averageBoxOfficeAndScores[0];
    const averageBoxOffice =
      parseFloat(boxOfficeData.average_box_office.replace(/[^0-9.-]+/g, "")) /
      1e6;
    const averageMetascore = parseFloat(boxOfficeData.average_metascore);
    const averageIMDbRating = parseFloat(boxOfficeData.average_imdb_rating);
    const averageRottenTomatoes = parseFloat(
      boxOfficeData.average_rotten_tomatoes.replace("%", "")
    );

    const updatedSeries = [
      { name: "Average Box Office (Millions)", data: [averageBoxOffice] },
      { name: "Average Metascore", data: [averageMetascore] },
      { name: "Average IMDb Rating", data: [averageIMDbRating] },
      { name: "Average Rotten Tomatoes (%)", data: [averageRottenTomatoes] }
    ];

    if (JSON.stringify(updatedSeries) !== JSON.stringify(prevState.series)) {
      return { series: updatedSeries };
    }
    return null;
  }

  render() {
    const { averageBoxOfficeAndScores } = this.props;

    // Check if data has been fetched
    if (!averageBoxOfficeAndScores || averageBoxOfficeAndScores.length === 0) {
      return <div>Зареждане...</div>;
    }

    return (
      <ReactApexChart
        options={this.state.options}
        series={this.state.series}
        type="bar"
        height={320}
      />
    );
  }
}

interface CountryBarProps {
  topCountries: CountryData[] | null;
}

export const CountryBarChart: React.FC<CountryBarProps> = ({
  topCountries
}) => {
  const [primaryColor, setPrimaryColor] = useState<string>("#ffffff");

  useEffect(() => {
    // Initial color update on mount
    setPrimaryColor(updatePrimaryColor());

    // Listener to detect theme changes by monitoring the body or html class
    const observer = new MutationObserver(() => {
      setPrimaryColor(updatePrimaryColor());
    });

    // Observe changes in classList (e.g., dark/light mode changes)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"] // Only track class changes
    });

    // Cleanup observer on component unmount
    return () => {
      observer.disconnect();
    };
  }, []);

  if (!topCountries) {
    return <div>Зареждане...</div>;
  }

  const totalCount = topCountries.reduce(
    (sum, country) => sum + country.count,
    0
  );

  // Generate a color scale based on the primary color
  const colorScale = chroma
    .scale([
      chroma(primaryColor).brighten(0.5).saturate(1).hex(), // Slightly lighter, subtle change
      chroma(primaryColor).brighten(3).saturate(0.5).hex(), // Brightened midpoint
      chroma(primaryColor).darken(1).saturate(1).hex() // Slightly darker end
    ])
    .mode("lab")
    .domain([0, topCountries.length - 1])
    .colors(topCountries.length);

  // Pagination state
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCountries = topCountries.slice(startIndex, endIndex);

  const totalPages = Math.ceil(topCountries.length / itemsPerPage);

  const handlePrevChartPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextChartPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div>
      <div className="flex w-full h-[0.3125rem] mb-6 rounded-full overflow-hidden">
        {topCountries.map((country, index) => {
          const widthPercentage = (country.count / totalCount) * 100;
          const color = colorScale[index];

          return (
            <div
              key={country.country_en}
              className="flex flex-col justify-center overflow-hidden"
              style={{
                width: `${widthPercentage}%`,
                backgroundColor: color
              }}
              aria-valuenow={widthPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
              title={`${country.country_bg}: ${country.count}`}
            ></div>
          );
        })}
      </div>

      {/* Total Count */}
      <div className="mb-4 text-sm text-gray-500">
        <strong>Общ брой на препоръки:</strong> {totalCount}
      </div>

      {/* External Legend */}
      <ul className="list-none mb-6 pt-2 crm-deals-status flex flex-col">
        {currentCountries.map((country, index) => {
          const color =
            currentPage === 1 ? colorScale[index] : colorScale[index + 5];

          return (
            <li
              key={country.country_en}
              className="flex items-center text-sm mb-2"
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
                aria-label={country.country_en}
              ></div>
              <span className="ml-2">
                {country.country_bg}: {country.count} пъти
              </span>
            </li>
          );
        })}
      </ul>

      {totalPages > 1 && (
        <div className="flex justify-center">
          <nav aria-label="Page navigation" className="pagination-style-4">
            <ul className="ti-pagination mb-0">
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <Link
                  className="page-link"
                  to="#"
                  onClick={handlePrevChartPage}
                  style={{
                    padding: "0.25rem 0.5rem",
                    fontSize: "0.8rem",
                    lineHeight: "1.25"
                  }}
                >
                  Предишна
                </Link>
              </li>
              {[...Array(totalPages)].map((_, index) => (
                <li
                  key={index}
                  className={`page-item ${
                    currentPage === index + 1 ? "active" : ""
                  }`}
                >
                  <Link
                    className="page-link"
                    to="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(index + 1);
                    }}
                    style={{
                      padding: "0.25rem 0.5rem",
                      fontSize: "0.8rem",
                      lineHeight: "1.25"
                    }}
                  >
                    {index + 1}
                  </Link>
                </li>
              ))}
              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <Link
                  className="page-link"
                  to="#"
                  onClick={handleNextChartPage}
                  style={{
                    padding: "0.25rem 0.5rem",
                    fontSize: "0.8rem",
                    lineHeight: "1.25"
                  }}
                >
                  Следваща
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};
interface MovieProsperityBubbleChartProps {
  sortedMoviesByProsperity: MovieProsperityData[];
}

export class MovieProsperityBubbleChart extends Component<
  MovieProsperityBubbleChartProps,
  State
> {
  constructor(props: MovieProsperityBubbleChartProps) {
    super(props);

    this.state = {
      series: [],
      options: {
        chart: {
          type: "bubble",
          events: {
            mounted: (chart: any) => {
              chart.windowResizeHandler();
            }
          },
          toolbar: {
            show: false
          },
          zoom: {
            enabled: false
          }
        },
        plotOptions: {
          bubble: {
            minBubbleRadius: 5,
            maxBubbleRadius: 2000
          }
        },
        dataLabels: { enabled: false },
        fill: { opacity: 0.8 },
        colors: [], // Empty, we will fill it manually
        xaxis: {
          tickAmount: 10,
          labels: {
            formatter: (val: any) => `$${Math.round(val)}M`,
            style: { colors: "#8c9097", fontSize: "11px", fontWeight: 600 }
          },
          title: {
            text: "Приходи от боксофиса (в милиони)",
            style: { fontSize: "12px", fontWeight: "bold", color: "#8c9097" }
          }
        },
        yaxis: {
          tickAmount: 7,
          max: 10,
          min: 5,
          labels: {
            style: { colors: "#8c9097", fontSize: "11px", fontWeight: 600 }
          },
          title: {
            text: "IMDb рейтинг",
            style: { fontSize: "12px", fontWeight: "bold", color: "#8c9097" }
          }
        },
        legend: {
          show: true,
          position: "top",
          markers: {
            width: 10,
            height: 10,
            radius: 12
          },
          itemMargin: {
            horizontal: 10,
            vertical: 5
          },
          formatter: (seriesName: string) => seriesName // Simplified
        },
        tooltip: {
          shared: false,
          intersect: true,
          custom: ({ seriesIndex, dataPointIndex, w }: any) => {
            const movieData = w.config.series[seriesIndex].data[dataPointIndex];

            if (movieData) {
              const movieTitleEn = movieData.title_en || "Unknown Movie";
              const movieTitleBg = movieData.title_bg || "Unknown Movie";
              const imdbRating =
                movieData.y !== undefined ? movieData.y : "N/A";
              const boxOffice =
                movieData.x !== undefined ? movieData.x * 1e6 : "N/A";
              const formattedBoxOffice =
                boxOffice !== "N/A" ? `$${boxOffice.toLocaleString()}` : "N/A";

              return `
                <div style="padding: 10px;">
                  <strong>${movieTitleBg} (${movieTitleEn})</strong><br />
                  IMDb рейтинг: ${imdbRating}/10<br />
                  Боксофис: ${formattedBoxOffice}
                </div>
              `;
            }
            return "";
          }
        }
      }
    };
  }

  // Helper function to get the color based on the first genre
  getColorForGenre(genre: string): string {
    const genreColorMap: { [key: string]: string } = {
      Приключенски: "#1f0302",
      Екшън: "#3e0704",
      Комедия: "#5c0a06",
      Драма: "#7b0e08",
      Трилър: "#9a110a",
      Романтичен: "#ae413b",
      Анимация: "#c2706c",
      "Филм-ноар": "#cd8885"
    };

    const firstGenre = genre.split(",")[0].trim();
    return genreColorMap[firstGenre] || "#8c9097";
  }

  static getDerivedStateFromProps(
    nextProps: MovieProsperityBubbleChartProps,
    prevState: State
  ) {
    const { sortedMoviesByProsperity } = nextProps;
    const instance = new MovieProsperityBubbleChart(nextProps);
    const genreMap: { [key: string]: any[] } = {};

    sortedMoviesByProsperity.forEach((movie) => {
      const prosperityScore = movie.prosperityScore || 0;
      const boxOffice =
        parseFloat(movie.total_box_office.replace(/[^0-9.-]+/g, "")) / 1e6;
      const imdbRating = parseFloat(movie.imdbRating) || 0;
      const genreColor = movie.genre_bg
        ? instance.getColorForGenre(movie.genre_bg)
        : "#8c9097";
      const titleEnglish = movie.title_en;
      const titleBulgarian = movie.title_bg;
      const genre = movie.genre_bg.split(",")[0].trim();

      if (!genreMap[genre]) {
        genreMap[genre] = [];
      }

      genreMap[genre].push({
        x: boxOffice,
        y: imdbRating,
        z: prosperityScore,
        title_en: titleEnglish,
        title_bg: titleBulgarian,
        color: genreColor // Use color directly, no need for fillColor
      });
    });

    const series = Object.keys(genreMap).map((genre) => ({
      name: genre,
      data: genreMap[genre],
      color: instance.getColorForGenre(genre)
    }));

    const colors = [...new Set(series.map((s) => s.color))];

    if (JSON.stringify(series) !== JSON.stringify(prevState.series)) {
      return { series, options: { ...prevState.options, colors } };
    }

    return null;
  }

  render() {
    return (
      <ReactApexChart
        options={this.state.options}
        series={this.state.series}
        type="bubble"
        height="350px"
      />
    );
  }
}

interface BasicTreemapProps {
  data: RoleData;
  role: string;
}

interface BasicTreemapState {
  series: any[];
  options: any;
}

export class Treemap extends Component<BasicTreemapProps, BasicTreemapState> {
  private observer: MutationObserver | null = null;

  constructor(props: BasicTreemapProps) {
    super(props);

    const initialColor = updatePrimaryColor();
    const initialColorRange = chroma
      .scale([
        chroma(initialColor).darken(0.5).hex(),
        chroma(initialColor).darken(1).hex()
      ])
      .mode("lab")
      .domain([0, 100])
      .colors(10); // Generates a range of 10 colors

    this.state = {
      series: [
        {
          data: Treemap.formatData(props.data, props.role)
        }
      ],
      options: {
        chart: {
          type: "treemap",
          toolbar: {
            show: false
          }
        },
        colors: initialColorRange, // Set initial colors based on the theme
        legend: {
          show: false
        }
      }
    };
  }

  // Static method to derive state from props
  static getDerivedStateFromProps(
    nextProps: BasicTreemapProps,
    prevState: BasicTreemapState
  ) {
    if (
      nextProps.data !== prevState.series[0].data ||
      nextProps.role !== prevState.options.title?.text?.split(" ")[1]
    ) {
      return {
        series: [
          {
            data: Treemap.formatData(nextProps.data, nextProps.role)
          }
        ]
      };
    }
    return null;
  }

  // Static method to format the data
  static formatData(data: RoleData, role: string) {
    return data.map((item) => {
      let name = "";
      let count = 0;

      if (role === "Actors" && "actor_bg" in item) {
        name = (item as ActorData).actor_bg!;
        count = (item as ActorData).actor_count!;
      } else if (role === "Directors" && "director_bg" in item) {
        name = (item as DirectorData).director_bg!;
        count = (item as DirectorData).director_count!;
      } else if (role === "Writers" && "writer_bg" in item) {
        name = (item as WriterData).writer_bg!;
        count = (item as WriterData).writer_count!;
      }

      return { x: name, y: count };
    });
  }

  // Function to get the primary color based on the theme
  getPrimaryColor() {
    const root = document.documentElement;
    const primaryColor = window
      .getComputedStyle(root)
      .getPropertyValue("--primary-color");
    return primaryColor || "#9a110a"; // Default to a red color if primary color is not found
  }

  // Function to update the color scale
  updateColorRange() {
    const primaryHex = updatePrimaryColor();
    console.log("primaryHex: ", primaryHex);
    const newColorRange = chroma
      .scale([
        chroma(primaryHex).darken(0.5).hex(),
        chroma(primaryHex).darken(1).hex()
      ])
      .mode("lab")
      .domain([0, 100])
      .colors(10);

    this.setState((prevState) => ({
      options: {
        ...prevState.options,
        colors: newColorRange // Update the colors
      }
    }));
  }

  componentDidMount() {
    // Observe theme changes to update the color scale dynamically
    this.observer = new MutationObserver(() => {
      this.updateColorRange();
    });

    this.observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"]
    });
  }

  componentWillUnmount() {
    // Cleanup observer when the component unmounts
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  render() {
    return (
      <ReactApexChart
        options={this.state.options}
        series={this.state.series}
        type="treemap"
        height={350}
      />
    );
  }
}

export class TopRecommendationsBarChart extends Component<
  { seriesData: RecommendationData[] | MovieData[] },
  State
> {
  private observer: MutationObserver | null = null;

  constructor(props: { seriesData: RecommendationData[] }) {
    super(props);

    // Get the initial color for the theme
    const initialColor = updatePrimaryColor();

    // Set the distinct colors for Movies and Series based on the primary color
    this.state = {
      series: [],
      options: {
        chart: {
          type: "bar",
          toolbar: { show: false }
        },
        plotOptions: { bar: { borderRadius: 4, horizontal: true } },
        grid: { borderColor: "#f2f5f7" },
        dataLabels: { enabled: false },
        xaxis: {
          title: { text: "Брой препоръчвания" },
          categories: []
        },
        yaxis: { title: { text: "Заглавие" } },
        // Adjust brightness more for Movies (brighter) and darken more for Series (darker)
        colors: [
          chroma(initialColor).darken(0.6).hex(), // Brighter color for Movies
          chroma(initialColor).brighten(0.6).hex() // Darker color for Series
        ],
        legend: {
          show: true,
          position: "top", // Optionally change legend position
          labels: {
            colors: ["#000", "#000"] // You can adjust the legend text color here
          }
        }
      }
    };
  }

  static getDerivedStateFromProps(
    nextProps: { seriesData: RecommendationData[] },
    prevState: State
  ) {
    if (nextProps.seriesData && nextProps.seriesData.length > 0) {
      const sortedMovies = nextProps.seriesData.sort(
        (a, b) => b.recommendations - a.recommendations
      );

      const updatedSeries = sortedMovies.map((movie) => {
        // Apply distinct colors for movies and series
        const isMovie = movie.type === "movie";

        // Get the color for the movie or series
        const color = isMovie
          ? prevState.options.colors[0] // Brighter Movie color
          : prevState.options.colors[1]; // Darker Series color

        return {
          x: `${movie.title_bg} (${movie.title_en})`,
          y: movie.recommendations,
          fillColor: color // Set the dynamic color based on movie type
        };
      });

      return {
        series: [
          {
            name: "Препоръчвания",
            data: updatedSeries
          }
        ],
        options: {
          ...prevState.options,
          xaxis: {
            ...prevState.options.xaxis,
            categories: sortedMovies.map(
              (movie) => `${movie.title_bg} (${movie.title_en})`
            )
          }
        }
      };
    }

    return null;
  }

  componentDidMount() {
    this.updateColorRange();

    // Initialize the MutationObserver to watch for class changes on document.documentElement
    this.observer = new MutationObserver(() => {
      this.updateColorRange();
    });

    // Observe changes in the classList of the document's root element (theme changes)
    this.observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"]
    });
  }

  componentWillUnmount() {
    // Clean up the MutationObserver when the component is unmounted
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  updateColorRange() {
    const primaryHex = updatePrimaryColor(); // Get the updated theme color

    // Define the distinct colors based on the updated primary color
    const movieColor = chroma(primaryHex).darken(0.6).hex(); // Much brighter movie color
    const seriesColor = chroma(primaryHex).brighten(0.6).hex(); // Darker series color

    // Update the state with the new color values
    this.setState((prevState) => ({
      options: {
        ...prevState.options,
        colors: [movieColor, seriesColor] // Update colors for both categories
      }
    }));
  }

  render() {
    const movieColor = this.state.options.colors[0];
    const seriesColor = this.state.options.colors[1];

    return (
      <div>
        <div className="flex justify-center items-center">
          <div className="flex items-center mr-4">
            <span
              className="w-3 h-3 mr-1 rounded-full inline-block"
              style={{ backgroundColor: movieColor }}
            ></span>
            <span>Филм</span>
          </div>
          <div className="flex items-center">
            <span
              className="w-3 h-3 mr-1 rounded-full inline-block"
              style={{ backgroundColor: seriesColor }}
            ></span>
            <span>Сериал</span>
          </div>
        </div>

        {this.state.series && this.state.series.length > 0 ? (
          <ReactApexChart
            options={this.state.options}
            series={this.state.series}
            type="bar"
            height={320}
          />
        ) : (
          <p>No data available</p>
        )}
      </div>
    );
  }
}

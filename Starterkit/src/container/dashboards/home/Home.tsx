import { FC, Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DataType } from "../home-types";
import {
  fetchData,
  generateHeatmapSeriesData,
  generateScatterSeriesData,
  paginateBarChartData,
  getTotalBarChartPages,
  handleBarChartPageChange,
  handleDropdownClickAverages,
  handleDropdownClickAwards
} from "../helper_functions";
import { useMediaQuery } from "react-responsive";
import TableComponent from "./Statistics/TableComponent";
import TreemapComponent from "./Statistics/TreemapComponent";
import TopRecommendationsBarChartComponent from "./Statistics/TopRecommendationsBarChart";
import CountryBarChartComponent from "./Statistics/CountryBarChartComponent";
import MovieProsperityBubbleChartComponent from "./Statistics/MovieProsperityBubbleChartComponent";
import GenrePopularityOverTimeComponent from "./Statistics/GenrePopularityOverTimeComponent";
import MovieBarChartComponent from "./Statistics/MovieBarChartComponent";
import WidgetCards from "./Statistics/WidgetCards";

interface CrmProps {}

const Home: FC<CrmProps> = () => {
  // States for holding fetched data
  const [data, setData] = useState<DataType>({
    usersCount: [],
    topRecommendations: [],
    topGenres: [],
    genrePopularityOverTime: {},
    topActors: [],
    topDirectors: [],
    topWriters: [],
    oscarsByMovie: [],
    totalAwardsByMovieOrSeries: [],
    totalAwards: [],
    sortedDirectorsByProsperity: [],
    sortedActorsByProsperity: [],
    sortedWritersByProsperity: [],
    sortedMoviesByProsperity: [],
    sortedMoviesAndSeriesByMetascore: [],
    sortedMoviesAndSeriesByIMDbRating: [],
    sortedMoviesAndSeriesByRottenTomatoesRating: [],
    averageBoxOfficeAndScores: [],
    topCountries: []
  });

  const pageSize = 5; // Number of entries per page for the chartaa
  const [currentChartPage, setCurrentChartPage] = useState(1); // Current page for the chart
  const [seriesDataForMovieBarChart, setSeriesDataForMovieBarChart] = useState<
    any[]
  >([]);

  const [moviesAndSeriesSortCategory, setMoviesAndSeriesSortCategory] =
    useState("IMDb");

  // User data state
  const [userData, setUserData] = useState({
    id: 0,
    first_name: "",
    last_name: "",
    email: ""
  });

  // Data fetching for user and platform stats (combined into one useEffect)
  useEffect(() => {
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (token) {
      fetchData(token, setUserData, setData);
      console.log("fetching");
    }
  }, []);

  // Updated useEffect to sort data based on selected category
  useEffect(() => {
    const sortedData =
      moviesAndSeriesSortCategory === "IMDb"
        ? data.sortedMoviesAndSeriesByIMDbRating
        : moviesAndSeriesSortCategory === "Metascore"
        ? data.sortedMoviesAndSeriesByMetascore
        : data.sortedMoviesAndSeriesByRottenTomatoesRating;

    const paginatedDataForMovieBarChart = paginateBarChartData(
      sortedData,
      currentChartPage,
      pageSize,
      moviesAndSeriesSortCategory
    );
    setSeriesDataForMovieBarChart(paginatedDataForMovieBarChart);
  }, [currentChartPage, moviesAndSeriesSortCategory, data]);

  // Generate the seriesData for heatmap
  const seriesDataForHeatmap = generateHeatmapSeriesData(
    data.genrePopularityOverTime
  );
  const seriesDataForScatterChart = generateScatterSeriesData(
    data.sortedMoviesByProsperity
  );

  const awardOptions = [
    {
      label: "Общ брой спечелени награди",
      value: data.totalAwards?.[0]?.total_awards_wins || 0
    },
    {
      label: "Общ брой номинации за награди",
      value: data.totalAwards?.[0]?.total_awards_nominations || 0
    },
    {
      label: "Общ брой спечелени Оскари",
      value: data.totalAwards?.[0]?.total_oscar_wins || 0
    },
    {
      label: "Общ брой номинации за Оскари",
      value: data.totalAwards?.[0]?.total_oscar_nominations || 0
    }
  ];

  const averagesOptions = [
    {
      label: "Среден Боксофис",
      value: data.averageBoxOfficeAndScores?.[0]?.average_box_office || 0
    },
    {
      label: "Среден Метаскор",
      value: data.averageBoxOfficeAndScores?.[0]?.average_metascore || 0
    },
    {
      label: "Среден IMDb Рейтинг",
      value: data.averageBoxOfficeAndScores?.[0]?.average_imdb_rating || 0
    },
    {
      label: "Среден Rotten Tomatoes Рейтинг",
      value: data.averageBoxOfficeAndScores?.[0]?.average_rotten_tomatoes || 0
    }
  ];
  // Total number of pages for pagination
  const totalChartPages = getTotalBarChartPages(
    data.sortedMoviesAndSeriesByIMDbRating.length,
    pageSize
  );

  const handlePrevChartPage = () => {
    handleBarChartPageChange(
      "prev",
      currentChartPage,
      pageSize,
      data.sortedMoviesAndSeriesByIMDbRating.length,
      setCurrentChartPage
    );
  };

  const handleNextChartPage = () => {
    handleBarChartPageChange(
      "next",
      currentChartPage,
      pageSize,
      data.sortedMoviesAndSeriesByIMDbRating.length,
      setCurrentChartPage
    );
  };

  const moviesAndSeriesCategoryDisplayNames: Record<
    "IMDb" | "Metascore" | "RottenTomatoes",
    string
  > = {
    IMDb: "IMDb Рейтинг",
    Metascore: "Метаскор",
    RottenTomatoes: "Rotten Tomatoes Рейтинг"
  };

  const is1803 = useMediaQuery({ query: "(max-width: 1803px)" });
  const is1441 = useMediaQuery({ query: "(max-width: 1441px)" });
  const is1461 = useMediaQuery({ query: "(max-width: 1461px)" });
  const is1546 = useMediaQuery({ query: "(max-width: 1546px)" });
  const is1675 = useMediaQuery({ query: "(max-width: 1675px)" });

  console.log("seriesDataForScatterChart: ", seriesDataForScatterChart);
  return (
    <Fragment>
      <div className="md:flex block items-center justify-between my-[1.5rem] page-header-breadcrumb">
        <div>
          <p className="font-semibold text-[1.125rem] text-defaulttextcolor dark:text-defaulttextcolor/70 !mb-0 ">
            Здравейте, {userData.first_name} {userData.last_name}!
          </p>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-x-6">
        <WidgetCards data={data} />
        <div className="xxl:col-span-6 col-span-12">
          <div className="xxl:col-span-6 col-span-12">
            <MovieProsperityBubbleChartComponent data={data} />
            <GenrePopularityOverTimeComponent data={data} />
            <MovieBarChartComponent data={data} />
          </div>
        </div>
        <div className="xxl:col-span-6 col-span-12">
          <TableComponent data={data} />
          <TopRecommendationsBarChartComponent data={data} />
          <TreemapComponent data={data} />
          <CountryBarChartComponent data={data} />
        </div>
      </div>
      <div className="grid grid-cols-12 gap-x-6"></div>
      <div className="transition fixed inset-0 z-50 bg-gray-900 bg-opacity-50 dark:bg-opacity-80 opacity-0 hidden"></div>
    </Fragment>
  );
};

export default Home;

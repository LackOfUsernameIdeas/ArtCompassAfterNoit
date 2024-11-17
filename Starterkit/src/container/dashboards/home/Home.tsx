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

  const [displayedNameAwards, setDisplayedNameAwards] = useState(
    "Общ брой спечелени награди"
  );
  const [displayedValueAverages, setDisplayedValueAverages] =
    useState<number>(0);
  const [displayedNameAverages, setDisplayedNameAverages] =
    useState("Среден Боксофис");

  const [isAveragesMenuOpen, setIsAveragesMenuOpen] = useState(false);
  const [isAwardsMenuOpen, setIsAwardsMenuOpen] = useState(false);

  const [displayedValueAwards, setDisplayedValueAwards] = useState<number>(0);

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

  useEffect(() => {
    if (
      data.totalAwards.length > 0 &&
      data.averageBoxOfficeAndScores.length > 0
    ) {
      setDisplayedValueAwards(data.totalAwards[0].total_awards_wins);
      setDisplayedValueAverages(
        data.averageBoxOfficeAndScores[0].average_box_office
      );
      console.log(
        "BAR CHART RECOMMENDATIONS SHIT ---->",
        data.topRecommendations
      );
    }
  }, [data]);

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

  const toggleAwardsMenu = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsAwardsMenuOpen((prev) => !prev);
  };

  const toggleAveragesMenu = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsAveragesMenuOpen((prev) => !prev);
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
        <div className="xxl:col-span-3 xl:col-span-3 col-span-12">
          <div className="box custom-box">
            <div className="box-body h-[5.5rem]">
              <div className="flex items-center justify-between">
                <div className="flex-grow">
                  <p
                    className={`mb-0 text-[#8c9097] dark:text-white/50 ${
                      is1803 && "text-xs"
                    }`}
                  >
                    Общ брой потребители
                  </p>
                  <div className="flex items-center">
                    <span
                      className={`text-[${
                        is1803 ? "1.25rem" : "1.125rem"
                      }] font-semibold`}
                    >
                      {data.usersCount?.[0]?.user_count || 0}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="avatar avatar-md !rounded-full bg-primary/10 !text-secondary text-[1.125rem]">
                    <i
                      className={`bi bi-person text-primary text-[${
                        is1803 ? "1rem" : "0.875rem"
                      }]`}
                    ></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="xxl:col-span-3 xl:col-span-3 col-span-12">
          <div className="box custom-box">
            <div className="box-body h-[5.5rem]">
              <div className="flex items-center justify-between">
                <div className="flex-grow">
                  <p
                    className={`mb-0 text-[#8c9097] dark:text-white/50 ${
                      is1803 && "text-xs"
                    }`}
                  >
                    Най-препоръчан жанр
                  </p>
                  <div className="flex items-center">
                    <span
                      className={`text-[${
                        is1803 ? "1.25rem" : "1.125rem"
                      }] font-semibold`}
                    >
                      {data.topGenres[0]?.genre_bg}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="avatar avatar-md !rounded-full bg-primary/10 !text-secondary text-[1.125rem]">
                    <i
                      className={`bi bi-film text-primary text-[${
                        is1803 ? "1rem" : "0.875rem"
                      }]`}
                    ></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="xxl:col-span-3 xl:col-span-3 col-span-12">
          <div className="box custom-box">
            <div className="box-body h-[5.5rem]">
              <div className="flex items-center justify-between">
                <div className="flex-grow">
                  <div className="flex flex-wrap items-start">
                    <div className="flex items-center space-x-2">
                      <p
                        className={`mb-0 text-[#8c9097] dark:text-white/50 ${
                          is1803 &&
                          "truncate overflow-hidden max-w-[130px] whitespace-nowrap text-xs"
                        }`}
                      >
                        {displayedNameAverages}
                      </p>
                      <div className="hs-dropdown ti-dropdown">
                        <Link
                          to="#"
                          className={`flex items-center ${
                            is1803
                              ? "px-1 py-0.5 text-xs"
                              : "px-0.5 py-0.25 text-[0.70rem]"
                          } font-medium text-primary border border-primary rounded-sm hover:bg-primary/10 transition-all`}
                          onClick={toggleAveragesMenu}
                          aria-expanded={isAveragesMenuOpen ? "true" : "false"}
                        >
                          {is1441 ? (
                            <i
                              className={`ri-arrow-${
                                isAveragesMenuOpen ? "up" : "down"
                              }-s-line text-sm`}
                            ></i>
                          ) : (
                            <>
                              <span>Сортирай по</span>
                              <i
                                className={`ri-arrow-${
                                  isAveragesMenuOpen ? "up" : "down"
                                }-s-line ml-0.5 text-sm`}
                              ></i>
                            </>
                          )}
                        </Link>
                        <ul
                          className={`hs-dropdown-menu ti-dropdown-menu ${
                            isAveragesMenuOpen ? "block" : "hidden"
                          }`}
                          role="menu"
                        >
                          {averagesOptions.map(({ label, value }) => (
                            <li key={label}>
                              <Link
                                onClick={() =>
                                  handleDropdownClickAverages(
                                    setDisplayedNameAverages,
                                    setDisplayedValueAverages,
                                    label,
                                    value
                                  )
                                }
                                className={`ti-dropdown-item ${
                                  displayedNameAverages === label
                                    ? "active"
                                    : ""
                                } ${
                                  displayedNameAverages === label
                                    ? "disabled"
                                    : ""
                                }`}
                                to="#"
                              >
                                {label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span
                      className={`text-[${
                        is1803 ? "1.25rem" : "1.125rem"
                      }] font-semibold`}
                    >
                      {displayedValueAverages}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="avatar avatar-md !rounded-full bg-primary/10 !text-secondary text-[1.125rem]">
                    <i
                      className={`bi bi-${
                        displayedNameAverages == "Среден Боксофис"
                          ? "ticket-perforated"
                          : "bi bi-clipboard-data"
                      } text-[${is1803 ? "1rem" : "0.875rem"}] text-primary`}
                    ></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="xxl:col-span-3 xl:col-span-3 col-span-12">
          <div className="box custom-box">
            <div className="box-body h-[5.5rem]">
              <div className="flex items-center justify-between">
                <div className="flex-grow">
                  <div
                    className={`flex items-center space-x-${is1803 ? 2 : 1}`}
                  >
                    <p
                      className={`mb-0 text-[#8c9097] dark:text-white/50 ${
                        is1803 &&
                        "truncate overflow-hidden max-w-[130px] whitespace-nowrap text-xs"
                      }`}
                    >
                      {displayedNameAwards}
                    </p>
                    <div className="hs-dropdown ti-dropdown">
                      <Link
                        to="#"
                        className={`flex items-center ${
                          is1803
                            ? "px-1 py-0.5 text-xs"
                            : "px-0.5 py-0.25 text-[0.70rem]"
                        } font-medium text-primary border border-primary rounded-sm hover:bg-primary/10 transition-all`}
                        onClick={toggleAwardsMenu}
                        aria-expanded={isAveragesMenuOpen ? "true" : "false"}
                      >
                        {is1441 ? (
                          <i
                            className={`ri-arrow-${
                              isAwardsMenuOpen ? "up" : "down"
                            }-s-line text-sm`}
                          ></i>
                        ) : (
                          <>
                            <span>Сортирай по</span>
                            <i
                              className={`ri-arrow-${
                                isAwardsMenuOpen ? "up" : "down"
                              }-s-line ml-0.5 text-sm`}
                            ></i>
                          </>
                        )}
                      </Link>
                      <ul
                        className={`hs-dropdown-menu ti-dropdown-menu ${
                          isAwardsMenuOpen ? "block" : "hidden"
                        }`}
                        role="menu"
                      >
                        {awardOptions.map(({ label, value }) => (
                          <li key={label}>
                            <Link
                              onClick={() =>
                                handleDropdownClickAwards(
                                  setDisplayedNameAwards,
                                  setDisplayedValueAwards,
                                  label,
                                  value
                                )
                              }
                              className={`ti-dropdown-item ${
                                displayedNameAwards === label ? "active" : ""
                              } ${
                                displayedNameAwards === label ? "disabled" : ""
                              }`}
                              to="#"
                            >
                              {label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span
                      className={`text-[${
                        is1803 ? "1.25rem" : "1.125rem"
                      }] font-semibold`}
                    >
                      {displayedValueAwards}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="avatar avatar-md !rounded-full bg-primary/10 !text-secondary text-[1.125rem]">
                    <i
                      className={`bi bi-trophy text-[${
                        is1803 ? "1rem" : "0.875rem"
                      }] text-primary`}
                    ></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
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

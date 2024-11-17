import { FC, Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MovieBarChart } from "./Charts";
import { DataType } from "../../home-types";
import {
  fetchData,
  generateHeatmapSeriesData,
  generateScatterSeriesData,
  paginateBarChartData,
  getTotalBarChartPages,
  handleBarChartPageChange,
  handleMoviesAndSeriesSortCategory
} from "../../helper_functions";
import { useMediaQuery } from "react-responsive";

interface MovieBarChartComponentProps {
  data: DataType;
}

const MovieBarChartComponent: FC<MovieBarChartComponentProps> = () => {
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
      <div className="xl:col-span-6 col-span-12">
        <div className="box custom-box">
          <div className="custom-box-header justify-between">
            <div
              className="box-title"
              style={{
                maxWidth:
                  window.innerWidth < 1400
                    ? "100%"
                    : is1675
                    ? is1461
                      ? "200px"
                      : "250px"
                    : "100%"
              }}
            >
              {`Филми и сериали по ${
                moviesAndSeriesCategoryDisplayNames[
                  moviesAndSeriesSortCategory as keyof typeof moviesAndSeriesCategoryDisplayNames
                ]
              }`}
            </div>

            <div className="flex flex-wrap gap-2">
              <div
                className="inline-flex rounded-md shadow-sm"
                role="group"
                aria-label="Sort By"
              >
                {["IMDb", "Metascore", "RottenTomatoes"].map(
                  (category, index) => (
                    <button
                      key={category}
                      type="button"
                      className={`ti-btn-group !border-0 !text-xs !py-2 !px-3 ${
                        category === moviesAndSeriesSortCategory
                          ? "ti-btn-primary-full text-white"
                          : "text-[#CC3333] bg-[#be1313] bg-opacity-10"
                      } ${
                        index === 0
                          ? "rounded-l-md"
                          : index === 2
                          ? "rounded-r-md"
                          : ""
                      }`}
                      onClick={() =>
                        handleMoviesAndSeriesSortCategory(
                          category,
                          setMoviesAndSeriesSortCategory
                        )
                      }
                    >
                      {
                        moviesAndSeriesCategoryDisplayNames[
                          category as keyof typeof moviesAndSeriesCategoryDisplayNames
                        ]
                      }
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="box-body h-[21.75rem]">
            <div id="bar-basic">
              <MovieBarChart
                seriesData={seriesDataForMovieBarChart}
                category={moviesAndSeriesSortCategory}
              />
            </div>
          </div>
          <div className="box-footer">
            <div className="sm:flex items-center">
              <div
                className={`text-defaulttextcolor dark:text-defaulttextcolor/70 text-[${
                  is1546 ? "0.65rem" : "0.70rem"
                }]`}
              >
                Показване на резултати от{" "}
                <b>
                  {currentChartPage === 1 ? 1 : (currentChartPage - 1) * 5 + 1}{" "}
                </b>
                до{" "}
                <b>
                  {currentChartPage === totalChartPages
                    ? data.sortedMoviesAndSeriesByIMDbRating.length
                    : currentChartPage * 5}{" "}
                </b>
                от общо <b>{data.sortedMoviesAndSeriesByIMDbRating.length}</b>{" "}
                (Страница <b>{currentChartPage}</b> )
                <i className="bi bi-arrow-right ms-2 font-semibold"></i>
              </div>
              <div className="ms-auto">
                <nav
                  aria-label="Page navigation"
                  className="pagination-style-4"
                >
                  <ul className="ti-pagination mb-0">
                    <li
                      className={`page-item ${
                        currentChartPage === 1 ? "disabled" : ""
                      }`}
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
                    {[...Array(totalChartPages)].map((_, index) => (
                      <li
                        key={index}
                        className={`page-item ${
                          currentChartPage === index + 1 ? "active" : ""
                        }`}
                      >
                        <Link
                          className="page-link"
                          to="#"
                          onClick={() => setCurrentChartPage(index + 1)}
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
                        currentChartPage === totalChartPages ? "disabled" : ""
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
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default MovieBarChartComponent;

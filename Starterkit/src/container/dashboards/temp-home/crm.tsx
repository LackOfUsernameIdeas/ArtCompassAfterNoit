import { FC, Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  GenrePopularityOverTime,
  Dealsstatistics,
  generateData,
  Profitearned,
  BoxOfficeVsIMDBRating,
  MovieBarChart,
  AwardsDonutChart,
  AverageScoresStackedBarChart,
  CountryBarChart
} from "./crmdata";
import {
  DataType,
  FilteredTableData,
  GenrePopularityData,
  HeatmapData,
  MovieData
} from "../home-types";
import {
  fetchData,
  filterTableData,
  handleDropdownClick,
  handleProsperityTableClick,
  myFunction,
  isDirector,
  isActor,
  isWriter,
  generateHeatmapSeriesData,
  generateScatterSeriesData,
  paginateBarChartData,
  getTotalBarChartPages,
  handleBarChartPageChange
} from "../helper_functions";
import face10 from "../../../assets/images/faces/10.jpg";
import face12 from "../../../assets/images/faces/12.jpg";

interface CrmProps {}

const TempHome: FC<CrmProps> = () => {
  // States for holding fetched data
  const [Data, setData] = useState<DataType>({
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
    averageBoxOfficeAndScores: [],
    topCountries: []
  });

  const [displayedNameAwards, setDisplayedNameAwards] =
    useState("Total Award Wins");
  const [displayedValueAwards, setDisplayedValueAwards] = useState<number>(0);
  // Table data filtering and pagination
  const [filteredTableData, setFilteredTableData] = useState<FilteredTableData>(
    []
  );
  const pageSize = 5; // Number of entries per page for the chart
  const [currentChartPage, setCurrentChartPage] = useState(1); // Current page for the chart
  const [seriesDataForMovieBarChart, setSeriesDataForMovieBarChart] = useState<
    any[]
  >([]);
  const [currentTablePage, setCurrentTablePage] = useState(1);
  const itemsPerTablePage = 5;
  const [currentTableItems, setCurrentTableItems] = useState<FilteredTableData>(
    []
  );
  const [prosperitySortCategory, setProsperitySortCategory] =
    useState("Directors");

  // User data state
  const [userData, setUserData] = useState({
    id: 0,
    first_name: "",
    last_name: "",
    email: ""
  });

  // Pagination logic
  const totalItems = filteredTableData.length;
  const totalTablePages = Math.ceil(totalItems / itemsPerTablePage);

  // Data fetching for user and platform stats (combined into one useEffect)
  useEffect(() => {
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (token) {
      fetchData(
        token,
        prosperitySortCategory,
        setUserData,
        setData,
        setFilteredTableData
      );
    }
  }, [prosperitySortCategory]);

  useEffect(() => {
    console.log("Data: ", Data);
    if (Data.totalAwards.length > 0) {
      setDisplayedValueAwards(Data.totalAwards[0].total_awards_wins);
    }
  }, [Data]);

  useEffect(() => {
    const paginatedData = paginateBarChartData(
      Data.sortedMoviesAndSeriesByIMDbRating,
      currentChartPage,
      pageSize
    );
    setSeriesDataForMovieBarChart(paginatedData);
    console.log("paginatedData: ", paginatedData);
  }, [currentChartPage, Data.sortedMoviesAndSeriesByIMDbRating]);

  // Fetch filtered table data based on category
  useEffect(() => {
    const newItems = filterTableData(
      filteredTableData,
      prosperitySortCategory,
      currentTablePage,
      itemsPerTablePage
    );
    setCurrentTableItems(newItems);
  }, [currentTablePage, prosperitySortCategory, filteredTableData]);

  // Generate the seriesData for heatmap
  const seriesDataForHeatmap = generateHeatmapSeriesData(
    Data.genrePopularityOverTime
  );
  const seriesDataForScatterChart = generateScatterSeriesData(
    Data.sortedMoviesByProsperity
  );

  const awardOptions = [
    {
      label: "Total Award Wins",
      value: Data.totalAwards?.[0]?.total_awards_wins || 0
    },
    {
      label: "Total Award Nominations",
      value: Data.totalAwards?.[0]?.total_awards_nominations || 0
    },
    {
      label: "Total Oscar Wins",
      value: Data.totalAwards?.[0]?.total_oscar_wins || 0
    },
    {
      label: "Total Oscar Nominations",
      value: Data.totalAwards?.[0]?.total_oscar_nominations || 0
    }
  ];

  // Total number of pages for pagination
  const totalChartPages = getTotalBarChartPages(
    Data.sortedMoviesAndSeriesByIMDbRating.length,
    pageSize
  );

  const handlePrevChartPage = () => {
    handleBarChartPageChange(
      "prev",
      currentChartPage,
      pageSize,
      Data.sortedMoviesAndSeriesByIMDbRating.length,
      setCurrentChartPage
    );
  };

  const handleNextChartPage = () => {
    handleBarChartPageChange(
      "next",
      currentChartPage,
      pageSize,
      Data.sortedMoviesAndSeriesByIMDbRating.length,
      setCurrentChartPage
    );
  };

  const handleNextTablePage = () => {
    if (currentTablePage < totalTablePages) {
      setCurrentTablePage((prev) => prev + 1);
    }
  };

  // Handle Previous Page Logic
  const handlePrevTablePage = () => {
    if (currentTablePage > 1) {
      setCurrentTablePage((prev) => prev - 1);
    }
  };

  const categoryDisplayNames: Record<
    "Directors" | "Actors" | "Writers",
    string
  > = {
    Directors: "Режисьори",
    Actors: "Актьори",
    Writers: "Сценаристи"
  };

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
        <div className="xxl:col-span-9 xl:col-span-12  col-span-12">
          <div className="grid grid-cols-12 gap-x-6">
            <div className="xxl:col-span-4 xl:col-span-4  col-span-12">
              <div className="xxl:col-span-6 xl:col-span-6 col-span-12">
                <div className="box custom-box">
                  <div className="box-body">
                    <div className="flex flex-wrap items-start justify-between">
                      <div className="flex-grow">
                        <p className="mb-0 text-[#8c9097] dark:text-white/50">
                          Общ брой потребители
                        </p>
                        <div className="flex items-center">
                          <span className="text-[1.25rem] font-semibold">
                            {Data.usersCount?.[0]?.user_count || 0}
                          </span>
                          <span className="text-[0.75rem] text-success ms-2">
                            <i className="ti ti-trending-up me-1 inline-block"></i>
                            0.42%
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="avatar avatar-md !rounded-full bg-secondary/10 !text-secondary text-[1.125rem]">
                          <i className="bi bi-person-lines-fill text-[1rem]"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="xxl:col-span-8  xl:col-span-8  col-span-12">
              <div className="grid grid-cols-12 gap-x-6">
                <div className="xxl:col-span-6 xl:col-span-6 col-span-12">
                  <div className="box custom-box">
                    <div className="box-body">
                      <div className="flex flex-wrap items-start justify-between">
                        <div className="flex-grow">
                          <div className="flex flex-wrap items-start">
                            <p className="mb-0 text-[#8c9097] dark:text-white/50">
                              {displayedNameAwards}
                            </p>
                            <div className="hs-dropdown ti-dropdown">
                              <Link
                                to="#"
                                className="text-[0.75rem] px-2 font-normal text-primary"
                                aria-expanded="false"
                              >
                                View All
                                <i className="ri-arrow-down-s-line align-middle ms-1 inline-block"></i>
                              </Link>
                              <ul
                                className="hs-dropdown-menu ti-dropdown-menu hidden"
                                role="menu"
                              >
                                {awardOptions.map(({ label, value }) => (
                                  <li key={label}>
                                    <Link
                                      onClick={() =>
                                        handleDropdownClick(
                                          setDisplayedNameAwards,
                                          setDisplayedValueAwards,
                                          label,
                                          value
                                        )
                                      }
                                      className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
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
                            <span className="text-[1.25rem] font-semibold">
                              {displayedValueAwards}
                            </span>
                            <span className="text-[0.75rem] text-success ms-2">
                              <i className="ti ti-trending-up me-1 inline-block"></i>
                              0.42%
                            </span>
                          </div>
                        </div>
                        <div>
                          <span className="avatar avatar-md !rounded-full bg-secondary/10 !text-secondary text-[1.125rem]">
                            <i className="bi bi-person-lines-fill text-[1rem]"></i>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="xxl:col-span-6 xl:col-span-6 col-span-12">
                  <div className="box custom-box">
                    <div className="box-body">
                      <div className="flex flex-wrap items-start justify-between">
                        <div className="flex-grow">
                          <p className="mb-0 text-[#8c9097] dark:text-white/50">
                            Most Recommended
                          </p>
                          <div className="flex items-center">
                            <span className="text-[1.25rem] font-semibold">
                              {Data.topRecommendations[0]?.title_bg}
                            </span>
                          </div>
                        </div>
                        <div>
                          <span className="avatar avatar-md !rounded-full bg-secondary/10 !text-secondary text-[1.125rem]">
                            <i className="bi bi-person-lines-fill text-[1rem]"></i>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
            <div className="box custom-card">
              <div className="box-header justify-between">
                <div className="box-title">
                  {
                    categoryDisplayNames[
                      prosperitySortCategory as keyof typeof categoryDisplayNames
                    ]
                  }{" "}
                  по просперитет
                </div>
                <div className="flex flex-wrap gap-2">
                  <div
                    className="inline-flex rounded-md shadow-sm"
                    role="group"
                    aria-label="Sort By"
                  >
                    {["Directors", "Actors", "Writers"].map(
                      (category, index) => (
                        <button
                          key={category}
                          type="button"
                          className={`ti-btn-group !border-0 !text-xs !py-2 !px-3 ${
                            category === prosperitySortCategory
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
                            handleProsperityTableClick(
                              category,
                              setProsperitySortCategory
                            )
                          }
                        >
                          {
                            categoryDisplayNames[
                              category as keyof typeof categoryDisplayNames
                            ]
                          }
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
              <div className="box-body">
                <div className="overflow-x-auto">
                  <table
                    key={prosperitySortCategory}
                    className="table min-w-full whitespace-nowrap table-hover border table-bordered"
                  >
                    <thead>
                      <tr className="border border-inherit border-solid dark:border-defaultborder/10">
                        <th
                          scope="col"
                          className="!text-start !text-[0.85rem] w-[40px]"
                        >
                          #
                        </th>
                        <th scope="col" className="!text-start !text-[0.85rem]">
                          {
                            categoryDisplayNames[
                              prosperitySortCategory as keyof typeof categoryDisplayNames
                            ]
                          }
                        </th>
                        <th scope="col" className="!text-start !text-[0.85rem]">
                          Просперитетен рейтинг
                        </th>
                        <th scope="col" className="!text-start !text-[0.85rem]">
                          IMDB рейтинг
                        </th>
                        <th scope="col" className="!text-start !text-[0.85rem]">
                          Бокс офис
                        </th>
                        <th scope="col" className="!text-start !text-[0.85rem]">
                          Брой филми
                        </th>
                        <th scope="col" className="!text-start !text-[0.85rem]">
                          Общо препоръки
                        </th>
                        <th scope="col" className="!text-start !text-[0.85rem]">
                          Победи на награди
                        </th>
                        <th scope="col" className="!text-start !text-[0.85rem]">
                          Номинации за награди
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentTableItems.map((item, index) => (
                        <tr
                          key={index}
                          className="border border-inherit border-solid hover:bg-gray-100 dark:border-defaultborder/10 dark:hover:bg-light"
                        >
                          <td>{(currentTablePage - 1) * 5 + index + 1}</td>
                          <td>
                            {isDirector(item)
                              ? item.director
                              : isActor(item)
                              ? item.actor
                              : isWriter(item)
                              ? item.writer
                              : ""}
                          </td>
                          <td>{item.prosperityScore}</td>
                          <td>{item.avg_imdb_rating}</td>
                          <td>{item.total_box_office}</td>
                          <td>{item.movie_count}</td>
                          <td>{item.total_recommendations}</td>
                          <td>{item.total_wins}</td>
                          <td>{item.total_nominations}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="box-footer">
                <div className="sm:flex items-center">
                  <div className="text-defaulttextcolor dark:text-defaulttextcolor/70">
                    Показване на резултати от{" "}
                    <b>
                      {currentTablePage === 1
                        ? 1
                        : (currentTablePage - 1) * 5 + 1}{" "}
                    </b>
                    до{" "}
                    <b>
                      {currentTablePage === totalTablePages
                        ? totalItems
                        : currentTablePage * 5}{" "}
                    </b>
                    от общо <b>{totalItems}</b> ( Страница{" "}
                    <b>{currentTablePage}</b> )
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
                            currentTablePage === 1 ? "disabled" : ""
                          }`}
                        >
                          <Link
                            className="page-link"
                            to="#"
                            onClick={handlePrevTablePage}
                          >
                            Предишна
                          </Link>
                        </li>
                        {[...Array(totalTablePages)].map((_, index) => (
                          <li
                            key={index}
                            className={`page-item ${
                              currentTablePage === index + 1 ? "active" : ""
                            }`}
                          >
                            <Link
                              className="page-link"
                              to="#"
                              onClick={() => setCurrentTablePage(index + 1)}
                            >
                              {index + 1}
                            </Link>
                          </li>
                        ))}
                        <li
                          className={`page-item ${
                            currentTablePage === totalTablePages
                              ? "disabled"
                              : ""
                          }`}
                        >
                          <Link
                            className="page-link"
                            to="#"
                            onClick={handleNextTablePage}
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

          <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
            <div className="box">
              <div className="box-header !gap-0 !m-0 justify-between">
                <div className="box-title">Genre popularity over time</div>
                <div className="hs-dropdown ti-dropdown">
                  <Link
                    to="#"
                    className="text-[0.75rem] px-2 font-normal text-[#8c9097] dark:text-white/50"
                    aria-expanded="false"
                  >
                    View All
                    <i className="ri-arrow-down-s-line align-middle ms-1 inline-block"></i>
                  </Link>
                  <ul
                    className="hs-dropdown-menu ti-dropdown-menu hidden"
                    role="menu"
                  >
                    <li>
                      <Link
                        className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                        to="#"
                      >
                        Today
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                        to="#"
                      >
                        This Week
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                        to="#"
                      >
                        Last Week
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="xl:col-span-6 col-span-12">
                <div className="box custom-box">
                  <div className="box-body">
                    <div id="heatmap-colorrange">
                      <GenrePopularityOverTime
                        seriesData={seriesDataForHeatmap}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="xl:col-span-6 col-span-12">
            <div className="box custom-box">
              <div className="box-header">
                <div className="box-title">
                  Movies by Box Office and IMDb Rating
                </div>
              </div>
              <div className="box-body">
                <div id="scatter-basic">
                  <BoxOfficeVsIMDBRating
                    seriesData={seriesDataForScatterChart}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="xl:col-span-6 col-span-12">
            <div className="box custom-box">
              <div className="box-header">
                <div className="box-title">
                  Movies and Series by IMDb Rating
                </div>
              </div>
              <div className="box-body">
                <div id="bar-basic">
                  {/* Pass only the paginated data to MovieBarChart */}
                  <MovieBarChart seriesData={seriesDataForMovieBarChart} />
                </div>
              </div>
              <div className="box-footer">
                <div className="sm:flex items-center">
                  <div className="text-defaulttextcolor dark:text-defaulttextcolor/70">
                    Showing {pageSize} Entries{" "}
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
                          >
                            Prev
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
                            >
                              {index + 1}
                            </Link>
                          </li>
                        ))}
                        <li
                          className={`page-item ${
                            currentChartPage === totalChartPages
                              ? "disabled"
                              : ""
                          }`}
                        >
                          <Link
                            className="page-link"
                            to="#"
                            onClick={handleNextChartPage}
                          >
                            Next
                          </Link>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="xl:col-span-6 col-span-12">
            <div className="box custom-box">
              <div className="box-header">
                <div className="box-title">Stacked Bar Chart</div>
              </div>
              <div className="box-body">
                <div id="bar-stacked">
                  <AverageScoresStackedBarChart
                    averageBoxOfficeAndScores={Data?.averageBoxOfficeAndScores}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
            <div className="box">
              <div className="box-header flex justify-between">
                <div className="box-title">Top Deals</div>
                <div className="hs-dropdown ti-dropdown">
                  <Link
                    aria-label="anchor"
                    to="#"
                    className="flex items-center justify-center w-[1.75rem] h-[1.75rem]  !text-[0.8rem] !py-1 !px-2 rounded-sm bg-light border-light shadow-none !font-medium"
                    aria-expanded="false"
                  >
                    <i className="fe fe-more-vertical text-[0.8rem]"></i>
                  </Link>
                  <ul className="hs-dropdown-menu ti-dropdown-menu hidden">
                    <li>
                      <Link
                        className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                        to="#"
                      >
                        Week
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                        to="#"
                      >
                        Month
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                        to="#"
                      >
                        Year
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="box-body">
                <ul className="list-none crm-top-deals mb-0">
                  <li className="mb-[0.9rem]">
                    <div className="flex items-start flex-wrap">
                      <div className="me-2">
                        <span className=" inline-flex items-center justify-center">
                          <img
                            src={face10}
                            alt=""
                            className="w-[1.75rem] h-[1.75rem] leading-[1.75rem] text-[0.65rem]  rounded-full"
                          />
                        </span>
                      </div>
                      <div className="flex-grow">
                        <p className="font-semibold mb-[1.4px]  text-[0.813rem]">
                          Michael Jordan
                        </p>
                        <p className="text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                          michael.jordan@example.com
                        </p>
                      </div>
                      <div className="font-semibold text-[0.9375rem] ">
                        $2,893
                      </div>
                    </div>
                  </li>
                  <li className="mb-[0.9rem]">
                    <div className="flex items-start flex-wrap">
                      <div className="me-2">
                        <span className="inline-flex items-center justify-center !w-[1.75rem] !h-[1.75rem] leading-[1.75rem] text-[0.65rem]  rounded-full text-warning  bg-warning/10 font-semibold">
                          EK
                        </span>
                      </div>
                      <div className="flex-grow">
                        <p className="font-semibold mb-[1.4px]  text-[0.813rem]">
                          Emigo Kiaren
                        </p>
                        <p className="text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                          emigo.kiaren@gmail.com
                        </p>
                      </div>
                      <div className="font-semibold text-[0.9375rem] ">
                        $4,289
                      </div>
                    </div>
                  </li>
                  <li className="mb-[0.9rem]">
                    <div className="flex items-top flex-wrap">
                      <div className="me-2">
                        <span className="inline-flex items-center justify-center">
                          <img
                            src={face12}
                            alt=""
                            className="!w-[1.75rem] !h-[1.75rem] leading-[1.75rem] text-[0.65rem]  rounded-full"
                          />
                        </span>
                      </div>
                      <div className="flex-grow">
                        <p className="font-semibold mb-[1.4px]  text-[0.813rem]">
                          Randy Origoan
                        </p>
                        <p className="text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                          randy.origoan@gmail.com
                        </p>
                      </div>
                      <div className="font-semibold text-[0.9375rem] ">
                        $6,347
                      </div>
                    </div>
                  </li>
                  <li className="mb-[0.9rem]">
                    <div className="flex items-top flex-wrap">
                      <div className="me-2">
                        <span className="inline-flex items-center justify-center !w-[1.75rem] !h-[1.75rem] leading-[1.75rem] text-[0.65rem]  rounded-full text-success bg-success/10 font-semibold">
                          GP
                        </span>
                      </div>
                      <div className="flex-grow">
                        <p className="font-semibold mb-[1.4px]  text-[0.813rem]">
                          George Pieterson
                        </p>
                        <p className="text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                          george.pieterson@gmail.com
                        </p>
                      </div>
                      <div className="font-semibold text-[0.9375rem] ">
                        $3,894
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-top flex-wrap">
                      <div className="me-2">
                        <span className="inline-flex items-center justify-center !w-[1.75rem] !h-[1.75rem] leading-[1.75rem] text-[0.65rem]  rounded-full text-primary bg-primary/10 font-semibold">
                          KA
                        </span>
                      </div>
                      <div className="flex-grow">
                        <p className="font-semibold mb-[1.4px]  text-[0.813rem]">
                          Kiara Advain
                        </p>
                        <p className="text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                          kiaraadvain214@gmail.com
                        </p>
                      </div>
                      <div className="font-semibold text-[0.9375rem] ">
                        $2,679
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
            <div className="box">
              <div className="box-header justify-between">
                <div className="box-title">Profit Earned</div>
                <div className="hs-dropdown ti-dropdown">
                  <Link
                    to="#"
                    className="px-2 font-normal text-[0.75rem] text-[#8c9097] dark:text-white/50"
                    aria-expanded="false"
                  >
                    View All
                    <i className="ri-arrow-down-s-line align-middle ms-1 inline-block"></i>
                  </Link>
                  <ul
                    className="hs-dropdown-menu ti-dropdown-menu hidden"
                    role="menu"
                  >
                    <li>
                      <Link
                        className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                        to="#"
                      >
                        Today
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                        to="#"
                      >
                        This Week
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                        to="#"
                      >
                        Last Week
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="box-body !py-0 !ps-0">
                <div id="crm-profits-earned">
                  <Profitearned />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="xxl:col-span-3 xl:col-span-12 col-span-12">
          <div className="grid grid-cols-12 gap-x-6">
            <div className="xxl:col-span-12 xl:col-span-6 col-span-12">
              <div className="box custom-box">
                <div className="box-body">
                  <div className="flex flex-wrap items-start justify-between">
                    <div className="flex-grow">
                      <p className="mb-0 text-[#8c9097] dark:text-white/50">
                        Top Genre
                      </p>
                      <div className="flex items-center">
                        <span className="text-[1.25rem] font-semibold">
                          {Data.topGenres[0]?.genre_bg}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="avatar avatar-md !rounded-full bg-secondary/10 !text-secondary text-[1.125rem]">
                        <i className="bi bi-person-lines-fill text-[1rem]"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="xxl:col-span-12 xl:col-span-6  col-span-12">
              <div className="box">
                <div className="box-header justify-between">
                  <div className="box-title">
                    {" "}
                    Топ държави с най-много препоръки
                  </div>
                </div>
                <div className="box-body">
                  <CountryBarChart topCountries={Data?.topCountries} />
                </div>
              </div>
            </div>
            <div className="xxl:col-span-12 xl:col-span-6  col-span-12">
              <div className="box">
                <div className="box-header justify-between">
                  <div className="box-title">Recent Activity</div>
                  <div className="hs-dropdown ti-dropdown">
                    <Link
                      to="#"
                      className="text-[0.75rem] px-2 font-normal text-[#8c9097] dark:text-white/50"
                      aria-expanded="false"
                    >
                      View All
                      <i className="ri-arrow-down-s-line align-middle ms-1 inline-block"></i>
                    </Link>
                    <ul
                      className="hs-dropdown-menu ti-dropdown-menu hidden"
                      role="menu"
                    >
                      <li>
                        <Link
                          className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                          to="#"
                        >
                          Today
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                          to="#"
                        >
                          This Week
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                          to="#"
                        >
                          Last Week
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="box-body">
                  <div>
                    <ul className="list-none mb-0 crm-recent-activity">
                      <li className="crm-recent-activity-content">
                        <div className="flex items-start">
                          <div className="me-4">
                            <span className="w-[1.25rem] h-[1.25rem] inline-flex items-center justify-center font-medium leading-[1.25rem] text-[0.65rem] text-primary bg-primary/10 rounded-full">
                              <i className="bi bi-circle-fill text-[0.5rem]"></i>
                            </span>
                          </div>
                          <div className="crm-timeline-content text-defaultsize">
                            <span className="font-semibold ">
                              Update of calendar events &amp;
                            </span>
                            <span>
                              <Link
                                to="#"
                                className="text-primary font-semibold"
                              >
                                Added new events in next week.
                              </Link>
                            </span>
                          </div>
                          <div className="flex-grow text-end">
                            <span className="block text-[#8c9097] dark:text-white/50 text-[0.6875rem] opacity-[0.7]">
                              4:45PM
                            </span>
                          </div>
                        </div>
                      </li>
                      <li className="crm-recent-activity-content">
                        <div className="flex items-start  text-defaultsize">
                          <div className="me-4">
                            <span className="w-[1.25rem] h-[1.25rem] leading-[1.25rem] inline-flex items-center justify-center font-medium text-[0.65rem] text-secondary bg-secondary/10 rounded-full">
                              <i className="bi bi-circle-fill text-[0.5rem]"></i>
                            </span>
                          </div>
                          <div className="crm-timeline-content">
                            <span>
                              New theme for{" "}
                              <span className="font-semibold">
                                Spruko Website
                              </span>{" "}
                              completed
                            </span>
                            <span className="block text-[0.75rem] text-[#8c9097] dark:text-white/50">
                              Lorem ipsum, dolor sit amet.
                            </span>
                          </div>
                          <div className="flex-grow text-end">
                            <span className="block text-[#8c9097] dark:text-white/50 text-[0.6875rem] opacity-[0.7]">
                              3 hrs
                            </span>
                          </div>
                        </div>
                      </li>
                      <li className="crm-recent-activity-content  text-defaultsize">
                        <div className="flex items-start">
                          <div className="me-4">
                            <span className="w-[1.25rem] h-[1.25rem] leading-[1.25rem] inline-flex items-center justify-center font-medium text-[0.65rem] text-success bg-success/10 rounded-full">
                              <i className="bi bi-circle-fill  text-[0.5rem]"></i>
                            </span>
                          </div>
                          <div className="crm-timeline-content">
                            <span>
                              Created a{" "}
                              <span className="text-success font-semibold">
                                New Task
                              </span>{" "}
                              today{" "}
                              <span className="w-[1.25rem] h-[1.25rem] leading-[1.25rem] text-[0.65rem] inline-flex items-center justify-center font-medium bg-purple/10 rounded-full ms-1">
                                <i className="ri-add-fill text-purple text-[0.75rem]"></i>
                              </span>
                            </span>
                          </div>
                          <div className="flex-grow text-end">
                            <span className="block text-[#8c9097] dark:text-white/50 text-[0.6875rem] opacity-[0.7]">
                              22 hrs
                            </span>
                          </div>
                        </div>
                      </li>
                      <li className="crm-recent-activity-content  text-defaultsize">
                        <div className="flex items-start">
                          <div className="me-4">
                            <span className="w-[1.25rem] h-[1.25rem] leading-[1.25rem] inline-flex items-center justify-center font-medium text-[0.65rem] text-pink bg-pink/10 rounded-full">
                              <i className="bi bi-circle-fill text-[0.5rem]"></i>
                            </span>
                          </div>
                          <div className="crm-timeline-content">
                            <span>
                              New member{" "}
                              <span className="py-[0.2rem] px-[0.45rem] font-semibold rounded-sm text-pink text-[0.75em] bg-pink/10">
                                @andreas gurrero
                              </span>{" "}
                              added today to AI Summit.
                            </span>
                          </div>
                          <div className="flex-grow text-end">
                            <span className="block text-[#8c9097] dark:text-white/50 text-[0.6875rem] opacity-[0.7]">
                              Today
                            </span>
                          </div>
                        </div>
                      </li>
                      <li className="crm-recent-activity-content  text-defaultsize">
                        <div className="flex items-start">
                          <div className="me-4">
                            <span className="w-[1.25rem] h-[1.25rem] leading-[1.25rem] inline-flex items-center justify-center font-medium text-[0.65rem] text-warning bg-warning/10 rounded-full">
                              <i className="bi bi-circle-fill text-[0.5rem]"></i>
                            </span>
                          </div>
                          <div className="crm-timeline-content">
                            <span>32 New people joined summit.</span>
                          </div>
                          <div className="flex-grow text-end">
                            <span className="block text-[#8c9097] dark:text-white/50 text-[0.6875rem] opacity-[0.7]">
                              22 hrs
                            </span>
                          </div>
                        </div>
                      </li>
                      <li className="crm-recent-activity-content  text-defaultsize">
                        <div className="flex items-start">
                          <div className="me-4">
                            <span className="w-[1.25rem] h-[1.25rem] leading-[1.25rem] inline-flex items-center justify-center font-medium text-[0.65rem] text-info bg-info/10 rounded-full">
                              <i className="bi bi-circle-fill text-[0.5rem]"></i>
                            </span>
                          </div>
                          <div className="crm-timeline-content">
                            <span>
                              Neon Tarly added{" "}
                              <span className="text-info font-semibold">
                                Robert Bright
                              </span>{" "}
                              to AI summit project.
                            </span>
                          </div>
                          <div className="flex-grow text-end">
                            <span className="block text-[#8c9097] dark:text-white/50 text-[0.6875rem] opacity-[0.7]">
                              12 hrs
                            </span>
                          </div>
                        </div>
                      </li>
                      <li className="crm-recent-activity-content  text-defaultsize">
                        <div className="flex items-start">
                          <div className="me-4">
                            <span className="w-[1.25rem] h-[1.25rem] leading-[1.25rem] inline-flex items-center justify-center font-medium text-[0.65rem] text-[#232323] dark:text-white bg-[#232323]/10 dark:bg-white/20 rounded-full">
                              <i className="bi bi-circle-fill text-[0.5rem]"></i>
                            </span>
                          </div>
                          <div className="crm-timeline-content">
                            <span>
                              Replied to new support request{" "}
                              <i className="ri-checkbox-circle-line text-success text-[1rem] align-middle"></i>
                            </span>
                          </div>
                          <div className="flex-grow text-end">
                            <span className="block text-[#8c9097] dark:text-white/50 text-[0.6875rem] opacity-[0.7]">
                              4 hrs
                            </span>
                          </div>
                        </div>
                      </li>
                      <li className="crm-recent-activity-content  text-defaultsize">
                        <div className="flex items-start">
                          <div className="me-4">
                            <span className="w-[1.25rem] h-[1.25rem] leading-[1.25rem] inline-flex items-center justify-center font-medium text-[0.65rem] text-purple bg-purple/10 rounded-full">
                              <i className="bi bi-circle-fill text-[0.5rem]"></i>
                            </span>
                          </div>
                          <div className="crm-timeline-content">
                            <span>
                              Completed documentation of{" "}
                              <Link
                                to="#"
                                className="text-purple underline font-semibold"
                              >
                                AI Summit.
                              </Link>
                            </span>
                          </div>
                          <div className="flex-grow text-end">
                            <span className="block text-[#8c9097] dark:text-white/50 text-[0.6875rem] opacity-[0.7]">
                              4 hrs
                            </span>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="transition fixed inset-0 z-50 bg-gray-900 bg-opacity-50 dark:bg-opacity-80 opacity-0 hidden"></div>
    </Fragment>
  );
};

export default TempHome;

import { FC, Fragment, useEffect, useState } from "react";
import { DataType, FilteredTableData } from "../../home-types";
import {
  filterTableData,
  getTotalBarChartPages,
  handleBarChartPageChange,
  handleDropdownClickAverages,
  handleDropdownClickAwards,
  paginateBarChartData
} from "../../helper_functions";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";

interface WidgetCardsComponentProps {
  data: DataType;
}

const WidgetCardsComponent: FC<WidgetCardsComponentProps> = ({ data }) => {
  console.log("data: ", data);
  const [prosperitySortCategory, setProsperitySortCategory] =
    useState("Directors");
  const [displayedNameAverages, setDisplayedNameAverages] =
    useState("Среден Боксофис");
  const [displayedValueAverages, setDisplayedValueAverages] =
    useState<number>(0);

  const [displayedNameAwards, setDisplayedNameAwards] = useState(
    "Общ брой спечелени награди"
  );
  const [displayedValueAwards, setDisplayedValueAwards] = useState<number>(0);

  const [topStatsSortCategory, setTopStatsSortCategory] = useState("Actors");
  const [seriesDataForTopStatsBarChart, setSeriesDataForTopStatsChart] =
    useState<any[]>([]);
  const [filteredTableData, setFilteredTableData] = useState<FilteredTableData>(
    []
  );
  const [currentTableItems, setCurrentTableItems] = useState<FilteredTableData>(
    []
  );
  const pageSize = 5;
  const [currentTopChartPage, setCurrentTopChartPage] = useState(1); // Current page for the chart
  const [currentTablePage, setCurrentTablePage] = useState(1);
  const itemsPerTablePage = 5;

  const [isAveragesMenuOpen, setIsAveragesMenuOpen] = useState(false);
  const [isAwardsMenuOpen, setIsAwardsMenuOpen] = useState(false);

  const tableCategoryDisplayNames: Record<
    "Directors" | "Actors" | "Writers",
    string
  > = {
    Directors: "Режисьори",
    Actors: "Актьори",
    Writers: "Сценаристи"
  };

  const totalItems = filteredTableData.length;
  const totalTablePages = Math.ceil(totalItems / itemsPerTablePage);

  const totalTopChartPages = getTotalBarChartPages(
    data.topRecommendations.length,
    pageSize
  );

  // Watch for changes in `data` and update filtered table data accordingly
  useEffect(() => {
    const initialFilteredData =
      data[`sorted${prosperitySortCategory}ByProsperity`];
    setFilteredTableData(initialFilteredData);
  }, [data, prosperitySortCategory]);

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

  useEffect(() => {
    const paginatedDataForTopStats = paginateBarChartData(
      data.topRecommendations,
      currentTopChartPage,
      pageSize
    );
    setSeriesDataForTopStatsChart(paginatedDataForTopStats);
  }, [currentTopChartPage, topStatsSortCategory, data]);

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

  const handleCategoryChange = (category: string) => {
    // Switch the filtered data based on the selected category
    setFilteredTableData(data[`sorted${category}ByProsperity`]);
    setProsperitySortCategory(category);
  };

  // Handle Previous Page Logic
  const handlePrevTablePage = () => {
    if (currentTablePage > 1) {
      setCurrentTablePage((prev) => prev - 1);
    }
  };

  const handleNextTablePage = () => {
    if (currentTablePage < totalTablePages) {
      setCurrentTablePage((prev) => prev + 1);
    }
  };

  const handlePrevTopChartPage = () => {
    handleBarChartPageChange(
      "prev",
      currentTopChartPage,
      pageSize,
      data.topRecommendations.length,
      setCurrentTopChartPage
    );
  };

  const handleNextTopChartPage = () => {
    handleBarChartPageChange(
      "next",
      currentTopChartPage,
      pageSize,
      data.topRecommendations.length,
      setCurrentTopChartPage
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

  const is1803 = useMediaQuery({ query: "(max-width: 1803px)" });
  const is1441 = useMediaQuery({ query: "(max-width: 1441px)" });
  const is1461 = useMediaQuery({ query: "(max-width: 1461px)" });
  const is1546 = useMediaQuery({ query: "(max-width: 1546px)" });
  const is1675 = useMediaQuery({ query: "(max-width: 1675px)" });

  return (
    <Fragment>
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
                                displayedNameAverages === label ? "active" : ""
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
                <div className={`flex items-center space-x-${is1803 ? 2 : 1}`}>
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
    </Fragment>
  );
};

export default WidgetCardsComponent;

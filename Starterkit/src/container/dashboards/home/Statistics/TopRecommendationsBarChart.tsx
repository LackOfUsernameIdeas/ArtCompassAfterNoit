import { FC, Fragment, useEffect, useState } from "react";
import { DataType, FilteredTableData } from "../../home-types";
import {
  filterTableData,
  getTotalBarChartPages,
  handleBarChartPageChange,
  handleTopStatsSortCategory,
  isActor,
  isDirector,
  isWriter,
  paginateBarChartData
} from "../../helper_functions";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import { CountryBarChart, TopRecommendationsBarChart, Treemap } from "./Charts";
import Table from "./TableComponent";

interface TopRecommendationsBarChartComponentProps {
  data: DataType;
}

const TopRecommendationsBarChartComponent: FC<
  TopRecommendationsBarChartComponentProps
> = ({ data }) => {
  console.log("data: ", data);
  const [prosperitySortCategory, setProsperitySortCategory] =
    useState("Directors");

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

  const is1546 = useMediaQuery({ query: "(max-width: 1546px)" });

  return (
    <Fragment>
      <div className="xxl:col-span-6 xl:col-span-12 col-span-12">
        <div className="xl:col-span-6 col-span-12">
          <div className="box custom-box">
            <div className="custom-box-header">
              <div className="box-title">Най-често препоръчвани филми</div>
            </div>
            <div className="box-body h-[22rem]">
              <div id="donut-simple">
                <TopRecommendationsBarChart
                  seriesData={seriesDataForTopStatsBarChart}
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
                    {currentTopChartPage === 1
                      ? 1
                      : (currentTopChartPage - 1) * 5 + 1}{" "}
                  </b>
                  до{" "}
                  <b>
                    {currentTopChartPage === totalTopChartPages
                      ? data.topRecommendations.length
                      : currentTopChartPage * 5}{" "}
                  </b>
                  от общо <b>{data.topRecommendations.length}</b> ( Страница{" "}
                  <b>{currentTopChartPage}</b> )
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
                          currentTopChartPage === 1 ? "disabled" : ""
                        }`}
                      >
                        <Link
                          className="page-link"
                          to="#"
                          onClick={handlePrevTopChartPage}
                          style={{
                            padding: "0.25rem 0.5rem",
                            fontSize: "0.8rem",
                            lineHeight: "1.25"
                          }}
                        >
                          Предишна
                        </Link>
                      </li>
                      {[...Array(totalTopChartPages)].map((_, index) => (
                        <li
                          key={index}
                          className={`page-item ${
                            currentTopChartPage === index + 1 ? "active" : ""
                          }`}
                        >
                          <Link
                            className="page-link"
                            to="#"
                            onClick={() => setCurrentTopChartPage(index + 1)}
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
                          currentTopChartPage === totalTopChartPages
                            ? "disabled"
                            : ""
                        }`}
                      >
                        <Link
                          className="page-link"
                          to="#"
                          onClick={handleNextTopChartPage}
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
      </div>
    </Fragment>
  );
};

export default TopRecommendationsBarChartComponent;

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
import TopRecommendationsBarChartComponent from "./TopRecommendationsBarChart";
import TableComponent from "./TableComponent";

interface TreemapComponentProps {
  data: DataType;
}

const TreemapComponent: FC<TreemapComponentProps> = ({ data }) => {
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

  return (
    <Fragment>
      <div className="xl:col-span-6 col-span-12">
        <div className="box custom-box h-[30rem]">
          <div className="box-header justify-between">
            <div className="box-title">
              {
                tableCategoryDisplayNames[
                  topStatsSortCategory as keyof typeof tableCategoryDisplayNames
                ]
              }{" "}
              по бройка
            </div>
            <div className="flex flex-wrap gap-2">
              <div
                className="inline-flex rounded-md shadow-sm"
                role="group"
                aria-label="Sort By"
              >
                {["Actors", "Directors", "Writers"].map((category, index) => (
                  <button
                    key={category}
                    type="button"
                    className={`ti-btn-group !border-0 !text-xs !py-2 !px-3 ${
                      category === topStatsSortCategory
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
                      handleTopStatsSortCategory(
                        category,
                        setTopStatsSortCategory
                      )
                    }
                  >
                    {
                      tableCategoryDisplayNames[
                        category as keyof typeof tableCategoryDisplayNames
                      ]
                    }
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="box-body flex justify-center items-center">
            <div id="treemap-basic" className="w-full">
              <Treemap
                data={
                  topStatsSortCategory === "Actors"
                    ? data.topActors
                    : topStatsSortCategory === "Directors"
                    ? data.topDirectors
                    : data.topWriters
                }
                role={topStatsSortCategory}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default TreemapComponent;

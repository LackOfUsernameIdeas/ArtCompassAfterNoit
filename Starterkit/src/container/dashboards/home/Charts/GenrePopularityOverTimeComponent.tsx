import { FC, Fragment, useEffect, useState } from "react";
import { DataType, FilteredTableData } from "../../home-types";
import {
  filterTableData,
  generateHeatmapSeriesData,
  getTotalBarChartPages,
  handleBarChartPageChange,
  paginateBarChartData
} from "../../helper_functions";
import { GenrePopularityOverTime } from "./Charts";

interface GenrePopularityOverTimeComponentProps {
  data: DataType;
}

const GenrePopularityOverTimeComponent: FC<
  GenrePopularityOverTimeComponentProps
> = ({ data }) => {
  console.log("data: ", data);
  const [prosperitySortCategory, setProsperitySortCategory] =
    useState("Directors");

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

  const seriesDataForHeatmap = generateHeatmapSeriesData(
    data.genrePopularityOverTime
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
  }, [currentTopChartPage, data]);

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
      <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
        <div className="box">
          <div className="box-header !gap-0 !m-0 justify-between">
            <div className="box-title">
              Популярност на жанровете през времето
            </div>
          </div>
          <div className="xl:col-span-6 col-span-12">
            <div className="box custom-box">
              <div className="box-body">
                <div id="heatmap-colorrange">
                  <GenrePopularityOverTime seriesData={seriesDataForHeatmap} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default GenrePopularityOverTimeComponent;

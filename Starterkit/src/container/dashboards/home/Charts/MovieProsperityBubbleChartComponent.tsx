import { FC, Fragment, useEffect, useState } from "react";
import { DataType, FilteredTableData } from "../../home-types";
import {
  filterTableData,
  getTotalBarChartPages,
  handleBarChartPageChange,
  paginateBarChartData
} from "../../helper_functions";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import { MovieProsperityBubbleChart } from "./Charts";

interface MovieProsperityBubbleChartComponentProps {
  data: DataType;
}

const MovieProsperityBubbleChartComponent: FC<
  MovieProsperityBubbleChartComponentProps
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

  return (
    <Fragment>
      <div className="xl:col-span-6 col-span-12">
        <div className="box custom-box h-[27.75rem]">
          <div className="box-header">
            <div className="box-title">
              Най-успешни филми по IMDb Рейтинг и Боксофис
            </div>
          </div>
          <div className="box-body">
            <div id="bubble-simple">
              <MovieProsperityBubbleChart
                sortedMoviesByProsperity={data.sortedMoviesByProsperity}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default MovieProsperityBubbleChartComponent;

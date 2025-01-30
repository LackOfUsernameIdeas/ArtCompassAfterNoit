import { FC, Fragment, useEffect, useState } from "react";
import {
  TopRecommendationsDataType,
  MovieData,
  RecommendationData
} from "../../platformStats-types";
import {
  getTotalBarChartPages,
  handleBarChartPageChange,
  paginateBarChartData
} from "../../helper_functions";
import { useMediaQuery } from "react-responsive";
import { TopRecommendationsBarChart } from "../../charts";
import Pagination from "../../../../components/common/pagination/pagination";

interface TopMoviesSeriesComponentProps {
  data: TopRecommendationsDataType;
}

const TopMoviesSeriesComponent: FC<TopMoviesSeriesComponentProps> = ({
  data
}) => {
  const [seriesDataForTopStatsChart, setSeriesDataForTopStatsChart] = useState<
    (MovieData | RecommendationData)[]
  >([]);

  const pageSize = 5;
  const [currentChartPage, setCurrentChartPage] = useState(1);

  const totalChartPages = getTotalBarChartPages(
    data.topRecommendations.length,
    pageSize
  );

  useEffect(() => {
    const paginatedDataForTopStats = paginateBarChartData(
      data.topRecommendations,
      currentChartPage,
      pageSize
    );
    setSeriesDataForTopStatsChart(paginatedDataForTopStats);
  }, [currentChartPage, data]);

  const handlePrevChartPage = () => {
    handleBarChartPageChange(
      "prev",
      currentChartPage,
      pageSize,
      data.topRecommendations.length,
      setCurrentChartPage
    );
  };

  const handleNextChartPage = () => {
    handleBarChartPageChange(
      "next",
      currentChartPage,
      pageSize,
      data.topRecommendations.length,
      setCurrentChartPage
    );
  };

  const is1546 = useMediaQuery({ query: "(max-width: 1546px)" });

  return (
    <Fragment>
      <div className="xxl:col-span-6 xl:col-span-12 col-span-12">
        <div className="xl:col-span-6 col-span-12">
          <div className="box custom-box">
            <div className="custom-box-header">
              <div className="box-title !font-Opsilon !font-light !tracking-wide">
                Най-често препоръчвани филми и сериали
              </div>
            </div>
            <div className="box-body h-[22rem]">
              <div id="donut-simple">
                <TopRecommendationsBarChart
                  seriesData={seriesDataForTopStatsChart}
                />
              </div>
            </div>
            <div className="box-footer">
              <Pagination
                currentPage={currentChartPage}
                totalItems={data.topRecommendations.length}
                itemsPerPage={5}
                totalTablePages={totalChartPages}
                isSmallScreen={is1546}
                handlePrevPage={handlePrevChartPage}
                handleNextPage={handleNextChartPage}
                setCurrentPage={setCurrentChartPage}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default TopMoviesSeriesComponent;

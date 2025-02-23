import { FC, Fragment, useEffect, useState } from "react";
import {
  TopRecommendationsDataType,
  MovieData,
  RecommendationData
} from "../../platformStats-types";
import { TopRecommendationsBarChart } from "../../a";

interface TopMoviesSeriesComponentProps {
  data: TopRecommendationsDataType;
}

const TopMoviesSeriesComponent: FC<TopMoviesSeriesComponentProps> = ({
  data
}) => {
  const [seriesDataForTopStatsChart, setSeriesDataForTopStatsChart] = useState<
    (MovieData | RecommendationData)[]
  >([]);

  useEffect(() => {
    setSeriesDataForTopStatsChart(data.topRecommendations);
  }, [data]);

  return (
    <Fragment>
      <div className="xxl:col-span-6 xl:col-span-12 col-span-12">
        <div className="xl:col-span-6 col-span-12">
          <div className="box custom-box">
            <div className="custom-box-header">
              <div className="box-title opsilion">
                Топ 10 най-препоръчвани филми и сериали
              </div>
            </div>
            <div className="box-body">
              <div id="donut-simple">
                <TopRecommendationsBarChart
                  seriesData={seriesDataForTopStatsChart}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default TopMoviesSeriesComponent;

import { FC, Fragment } from "react";
import { GenrePopularityOverTimeDataType } from "../../platformStats-types";
import { generateHeatmapSeriesData } from "../../helper_functions";
import { GenrePopularityOverTime } from "../../charts";

interface GenrePopularityOverTimeComponentProps {
  data: GenrePopularityOverTimeDataType;
}

const GenrePopularityOverTimeComponent: FC<
  GenrePopularityOverTimeComponentProps
> = ({ data }) => {
  const seriesDataForHeatmap = generateHeatmapSeriesData(
    data.genrePopularityOverTime
  );

  return (
    <Fragment>
      <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="text-center !text-sm box p-6 flex flex-col ">
            <p>
              Тук може да видите колко пъти са препоръчвани различните жанровете филми излезнали през съответната годината.<br/>
              По-тъмните квадрати означават по-голяма популярност, докато по-светлите – по-малка. 
            </p>
            <p>
              <strong>Оста X</strong> представя
              годината.
            </p>
            <p>
              <strong>Оста Y</strong> представя
              жанра.
            </p>
          </div>
        <div className="box">
          <div className="box-header !gap-0 !m-0 justify-between">
            <div className="box-title opsilion">
              Популярност на жанровете през времето
            </div>
          </div>
          <div className="box custom-box !shadow-none">
            <div className="box-body">
              <div id="heatmap-colorrange">
                <GenrePopularityOverTime seriesData={seriesDataForHeatmap} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default GenrePopularityOverTimeComponent;

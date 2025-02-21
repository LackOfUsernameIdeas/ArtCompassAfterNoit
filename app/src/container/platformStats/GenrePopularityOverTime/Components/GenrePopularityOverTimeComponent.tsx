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
        <div className="text-center !text-lg box p-6 flex flex-col">
          <h2 className="text-lg text-defaulttextcolor dark:text-white/80">
            Тук може да видите колко{" "}
            <span className="font-semibold text-primary">пъти</span> са{" "}
            <span className="font-semibold text-primary">препоръчвани</span>{" "}
            различните{" "}
            <span className="font-semibold text-primary">жанрове </span>
            филми и сериали, излезнали през съответната годината.
            <br />
            По-тъмните квадрати означават по-голяма популярност, докато
            по-светлите – по-малка.
            <br />
            <span className="font-semibold text-primary">Оста X</span> представя
            годината.
            <br />
            <span className="font-semibold text-primary">Оста Y </span>представя
            жанра.
          </h2>
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

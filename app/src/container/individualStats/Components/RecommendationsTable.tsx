import { FC, Fragment, useEffect, useState } from "react";
import { DataType, Recommendation } from "../individualStats-types";
import { Grid } from "gridjs-react";

interface RecommendationsTableProps {
  data: DataType;
}

const RecommendationsTable: FC<RecommendationsTableProps> = ({ data }) => {
  const [filteredTableData, setFilteredTableData] = useState<Recommendation[]>(
    []
  );

  useEffect(() => {
    setFilteredTableData(
      data.topRecommendations.recommendations as Recommendation[]
    );
  }, [data]);

  // Prepare data for Grid component
  const gridData = filteredTableData.map((recommendation) => [
    recommendation.title_bg,
    recommendation.recommendations,
    recommendation.oscar_wins,
    recommendation.oscar_nominations,
    recommendation.total_wins,
    recommendation.total_nominations,
    recommendation.imdbRating,
    recommendation.metascore,
    recommendation.boxOffice,
    recommendation.prosperityScore
  ]);

  // Define column headers
  const columns = [
    "Заглавие",
    "Препоръки",
    "Оскар Победи",
    "Оскар Номинации",
    "Общо Победи",
    "Общо Номинации",
    "IMDb Рейтинг",
    "Metascore",
    "Боксофис",
    "Процъфтяване"
  ];

  return (
    <Fragment>
      <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
        <div className="box custom-card h-[27.75rem]">
          <div className="box-header justify-between">
            <div className="box-title">Моите топ филми и сериали</div>
          </div>
          <div className="box-body">
            <div id="grid-wide">
              <div
                className="table-responsive"
                style={{
                  maxHeight: "20rem", // Limit table height
                  overflowY: "auto" // Enable vertical scroll
                }}
              >
                <Grid
                  data={gridData}
                  columns={columns}
                  sort={true}
                  resizable={true}
                  pagination={{
                    limit: 5, // Items per page
                    server: false // Set true if using server-side pagination
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default RecommendationsTable;

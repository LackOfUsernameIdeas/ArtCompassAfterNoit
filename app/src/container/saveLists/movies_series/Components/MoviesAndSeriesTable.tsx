import { FC, Fragment, useEffect, useState } from "react";
import { MoviesAndSeriesTableProps } from "../watchlist-types";
import { Link } from "react-router-dom";
import RecommendationCardAlert from "./RecommendationCardAlert";
import { translate } from "../../../helper_functions_common";
import { MovieSeriesRecommendation } from "../../../types_common";

const MoviesAndSeriesTable: FC<MoviesAndSeriesTableProps> = ({
  data,
  bookmarkedMovies,
  setBookmarkedMovies,
  setCurrentBookmarkStatus,
  setAlertVisible
}) => {
  const [selectedItem, setSelectedItem] = useState<MovieSeriesRecommendation | null>(null);
  const [filteredTableData, setFilteredTableData] = useState<MovieSeriesRecommendation[]>(data);
  const [translatedTypes, setTranslatedTypes] = useState<string>(""); // Преведените режисьори

  useEffect(() => {
    setFilteredTableData(data || []);
  }, [data]);

  const handleMovieClick = (item: MovieSeriesRecommendation) =>
    setSelectedItem(item);

  // // useEffect за превод на типа 
  // useEffect(() => {
  //   async function fetchTypeTranslation() {
  //     const translated = await translate(item.type);
  //     setTranslatedTypes(translated);
  //   }

  //   fetchTypeTranslation();
  // }, [type]);

  return (
    <Fragment>
      <RecommendationCardAlert
        selectedItem={selectedItem}
        onClose={() => setSelectedItem(null)}
        setBookmarkedMovies={setBookmarkedMovies}
        setCurrentBookmarkStatus={setCurrentBookmarkStatus}
        setAlertVisible={setAlertVisible}
        bookmarkedMovies={bookmarkedMovies}
      />
      <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
        <div className="box custom-card">
          <div className="box-header justify-between">
            <div className="box-title">Списък За Гледане</div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
            {filteredTableData.map((item, index) => (
              <div
                key={index}
                className="bg-white dark:bg-bodybg2/50 shadow-lg rounded-2xl p-4 cursor-pointer hover:bg-primary dark:hover:bg-primary hover:text-white transition grid grid-cols-[auto,1fr] items-center gap-2 text-center"
                onClick={() => handleMovieClick(item)}
              >
                <div className="grid grid-cols-[auto,1fr] items-center gap-2 w-full">
                  <img
                    src={item.poster}
                    alt={`${item.title_bg || "Movie"} Poster`}
                    className="rounded-lg w-20 h-auto shadow-lg"
                  />
                  <p>{item.genre_bg}</p>
                  <p>{item.type}</p>
                  <p>{item.runtime}</p>
                  {/* {translatedTypes} */}
                </div>
                <h5 className="opsilion col-span-2 mt-2 text-center box">{item.title_en}/{item.title_bg}</h5>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default MoviesAndSeriesTable;
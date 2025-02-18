import { FC, Fragment, useState } from "react";
import { MoviesAndSeriesTableProps } from "../watchlist-types";
import RecommendationCardAlert from "./RecommendationCardAlert";
import { MovieSeriesRecommendation } from "../../../types_common";
import FilterSidebar from "./FilterSidebar";

const MoviesAndSeriesTable: FC<MoviesAndSeriesTableProps> = ({
  data,
  bookmarkedMovies,
  setBookmarkedMovies,
  setCurrentBookmarkStatus,
  setAlertVisible,
}) => {
  const [selectedItem, setSelectedItem] = useState<MovieSeriesRecommendation | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filteredData, setFilteredData] = useState(data);

  const handleMovieClick = (item: MovieSeriesRecommendation) => setSelectedItem(item);

  const getTranslatedType = (type: string) => (type === "movie" ? "Филм" : type === "series" ? "Сериал" : type);

  const handleApplyFilters = (filters: {
    genres: string[];
    runtime: string[];
    type: string[];
    year: string[];
  }) => {
    const filtered = data.filter((item) => {
      const matchesGenre = filters.genres.length === 0 || filters.genres.includes(item.genre_bg);

      // Convert runtime to a number for comparison
      const runtime = parseInt(item.runtime, 10);
      const matchesRuntime = filters.runtime.length === 0 || filters.runtime.some((r) => {
        if (r === "Под 60 минути") return runtime < 60;
        if (r === "60 до 120 минути") return runtime >= 60 && runtime <= 120;
        if (r === "120 до 180 минути") return runtime > 120 && runtime <= 180;
        if (r === "Повече от 180 минути") return runtime > 180;
        return true;
      });

      const matchesType = filters.type.length === 0 || filters.type.includes(getTranslatedType(item.type));

      // Convert year to a number for comparison
      const year = parseInt(item.year, 10);
      const matchesYear = filters.year.length === 0 || filters.year.some((y) => {
        if (y === "Преди 2000") return year < 2000;
        if (y === "2000 до 2010") return year >= 2000 && year <= 2010;
        if (y === "2010 до 2020") return year > 2010 && year <= 2020;
        if (y === "След 2020") return year > 2020;
        return true;
      });

      return matchesGenre && matchesRuntime && matchesType && matchesYear;
    });

    setFilteredData(filtered);
  };

  return (
    <Fragment>
      {isFilterOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsFilterOpen(false)}
        />
      )}
      <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={handleApplyFilters}
      />
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
          <div className="box-header justify-between flex items-center">
            <div className="box-title">Списък За Гледане</div>
            <button
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition"
              onClick={() => setIsFilterOpen(true)}
            >
              Филтриране
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
            {filteredData.map((item, index) => (
              <div
                key={index}
                className="bg-white dark:bg-bodybg2/50 shadow-lg rounded-lg p-4 cursor-pointer hover:bg-primary dark:hover:bg-primary hover:text-white transition flex flex-col items-center"
                onClick={() => handleMovieClick(item)}
              >
                <div className="flex items-center gap-4 w-full">
                  <img
                    src={item.poster}
                    alt={`${item.title_bg || "Movie"} Poster`}
                    className="rounded-lg w-32 h-auto !shadow-lg"
                  />
                  <div className="flex flex-col items-start">
                    <span className="opsilion">
                      Жанр: <p className="font-Equilibrist">{item.genre_bg}</p>
                    </span>
                    <span className="opsilion">
                      Продължителност: <p className="font-Equilibrist">{item.runtime}</p>
                    </span>
                    <span className="opsilion">
                      Вид: <p className="font-Equilibrist">{getTranslatedType(item.type)}</p>
                    </span>
                    <span className="opsilion">
                      Година на излизане: <p className="font-Equilibrist">{item.year}</p>
                    </span>
                  </div>
                </div>
                <div className="w-full bg-white bg-bodybg/50 dark:bg-bodybg2/50 dark:border-black/10 rounded-md shadow-lg dark:shadow-xl text-center mt-4">
                  <h5 className="opsilion text-xl text-defaulttextcolor dark:text-white/80">
                    {item.title_en}/{item.title_bg}
                  </h5>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default MoviesAndSeriesTable;
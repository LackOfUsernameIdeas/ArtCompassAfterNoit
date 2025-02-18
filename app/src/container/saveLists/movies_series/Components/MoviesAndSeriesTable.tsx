import { FC, Fragment, useState } from "react";
import { MoviesAndSeriesTableProps } from "../watchlist-types";
import RecommendationCardAlert from "./RecommendationCardAlert";
import { MovieSeriesRecommendation } from "../../../types_common";
import FilterSidebar from "./FilterSidebar";

// Custom CSS for the dropdown arrow
const customStyles = `
  .custom-select {
    appearance: none;
    background: transparent;
    padding-right: 2rem; /* Space for the arrow */
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236b7280'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 0.5rem center;
    background-size: 1.5em;
  }
  .custom-select:hover {
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffffff'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e");
  }
`;

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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12); // Default items per page

  const handleMovieClick = (item: MovieSeriesRecommendation) => setSelectedItem(item);

  const getTranslatedType = (type: string) => (type === "movie" ? "Филм" : type === "series" ? "Сериал" : type);

  const handleApplyFilters = (filters: {
    genres: string[];
    runtime: string[];
    type: string[];
    year: string[];
  }) => {
    const filtered = data.filter((item) => {
      const movieGenres = item.genre_bg.split(",").map((genre) => genre.trim());
      const matchesGenre =
        filters.genres.length === 0 ||
        filters.genres.some((selectedGenre) => movieGenres.includes(selectedGenre));

      const runtime = parseInt(item.runtime.replace(/\D/g, ""), 10);
      const matchesRuntime = filters.runtime.length === 0 || filters.runtime.some((r) => {
        if (r === "Под 60 минути") return runtime < 60;
        if (r === "60 до 120 минути") return runtime >= 60 && runtime <= 120;
        if (r === "120 до 180 минути") return runtime > 120 && runtime <= 180;
        if (r === "Повече от 180 минути") return runtime > 180;
        return true;
      });

      const matchesType = filters.type.length === 0 || filters.type.includes(getTranslatedType(item.type));

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
    setCurrentPage(1); // Reset to the first page when filters are applied
  };

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Get the current page's data
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to the first page when items per page changes
  };

  return (
    <Fragment>
      {/* Inject custom styles for the dropdown arrow */}
      <style>{customStyles}</style>

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
            <div className="box-title flex items-center gap-4">
              Списък За Гледане
              <select
                className="custom-select bg-transparent text-primary border border-primary rounded-md px-3 py-1.5 text-sm focus:outline-none hover:bg-primary hover:text-white transition"
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
              >
                <option value={6}>6 елемента на страница</option>
                <option value={12}>12 елемента на страница</option>
                <option value={24}>24 елемента на страница</option>
                <option value={36}>36 елемента на страница</option>
                <option value={48}>48 елемента на страница</option>
              </select>
            </div>
            <button
              className="bg-transparent text-primary border border-primary rounded-md px-3 py-1.5 text-sm focus:outline-none hover:bg-primary hover:text-white transition"
              onClick={() => setIsFilterOpen(true)}
            >
              Филтриране
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
            {currentData.map((item, index) => (
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
          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-4 mt-4">
            <button
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              Предишна
            </button>
            <span className="text-defaulttextcolor dark:text-white/80">
              Страница {currentPage} от {totalPages}
            </span>
            <button
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Следваща
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default MoviesAndSeriesTable;
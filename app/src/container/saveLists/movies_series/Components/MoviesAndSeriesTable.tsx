import { FC, Fragment, useState } from "react";
import { MoviesAndSeriesTableProps } from "../watchlist-types";
import RecommendationCardAlert from "./RecommendationCardAlert";
import { MovieSeriesRecommendation } from "../../../types_common";
import FilterSidebar from "./FilterSidebar";
import { ChevronDownIcon } from "lucide-react";
import { useMediaQuery } from "react-responsive";

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
  setAlertVisible
}) => {
  const [selectedItem, setSelectedItem] =
    useState<MovieSeriesRecommendation | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filteredData, setFilteredData] = useState(data);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12); // Default items per page
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const handleMovieClick = (item: MovieSeriesRecommendation) =>
    setSelectedItem(item);

  const getTranslatedType = (type: string) =>
    type === "movie" ? "Филм" : type === "series" ? "Сериал" : type;

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
        filters.genres.some((selectedGenre) =>
          movieGenres.includes(selectedGenre)
        );

      const runtime = parseInt(item.runtime.replace(/\D/g, ""), 10);
      const matchesRuntime =
        filters.runtime.length === 0 ||
        filters.runtime.some((r) => {
          if (r === "Под 60 минути") return runtime < 60;
          if (r === "60 до 120 минути") return runtime >= 60 && runtime <= 120;
          if (r === "120 до 180 минути") return runtime > 120 && runtime <= 180;
          if (r === "Повече от 180 минути") return runtime > 180;
          return true;
        });

      const matchesType =
        filters.type.length === 0 ||
        filters.type.includes(getTranslatedType(item.type));

      const year = parseInt(item.year, 10);
      const matchesYear =
        filters.year.length === 0 ||
        filters.year.some((y) => {
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

  const handleItemsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to the first page when items per page changes
  };

  const is1546 = useMediaQuery({ query: "(max-width: 1546px)" });
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
            <div className="flex items-center gap-4">
              <p className="box-title">Списък За Гледане</p>
              <div className="relative inline-block text-left">
                <div>
                  <button
                    type="button"
                    className="inline-flex justify-between items-center w-full px-3 py-1.5 text-sm font-medium text-primary bg-primary/10 border border-primary rounded-md shadow-sm hover:bg-primary hover:text-white focus:bg-primary focus:text-white transition-all duration-300 ease-in-out"
                    onClick={() => setIsSelectOpen(!isSelectOpen)}
                  >
                    {itemsPerPage} елемента на страница
                    <ChevronDownIcon
                      className={`w-5 h-5 ml-2 -mr-1 transition-transform duration-300 ${
                        isSelectOpen ? "transform rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                </div>

                {isSelectOpen && (
                  <div className="origin-top-right absolute w-full right-0 mt-2 rounded-md shadow-lg bg-white dark:bg-bodybg border border-primary z-10 animate-dropdown">
                    <div
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="options-menu"
                    >
                      {[6, 12, 24, 36, 48].map((value) => (
                        <button
                          key={value}
                          className={`
                            group flex items-center w-full px-4 py-2 text-sm bg-primary/10
                            ${
                              itemsPerPage === value
                                ? "text-white !bg-primary font-medium"
                                : "text-defaulttextcolor dark:text-white/80"
                            }
                            hover:bg-primary/50 rounded-sm
                            transition-all duration-300 ease-in-out
                          `}
                          role="menuitem"
                          onClick={() => {
                            setItemsPerPage(value);
                            setIsSelectOpen(false);
                          }}
                        >
                          {value} елемента на страница
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <select
                  className="sr-only"
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  aria-label="Select number of items per page"
                >
                  <option value={6}>6 елемента на страница</option>
                  <option value={12}>12 елемента на страница</option>
                  <option value={24}>24 елемента на страница</option>
                  <option value={36}>36 елемента на страница</option>
                  <option value={48}>48 елемента на страница</option>
                </select>
              </div>
            </div>
            <button
              className="bg-primary/10 text-primary border border-primary rounded-md px-3 py-1.5 text-sm focus:outline-none hover:bg-primary hover:text-white transition"
              onClick={() => setIsFilterOpen(true)}
            >
              Филтриране
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
            {currentData.map((item, index) => (
              <div
                key={index}
                className="bg-white dark:bg-bodybg2/50 shadow-lg rounded-lg p-4 cursor-pointer hover:bg-primary dark:hover:bg-primary hover:text-white transition duration-300 flex flex-col items-center"
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
                      {item.type === "movie"
                        ? "Продължителност"
                        : "Средна продължителност"}
                      : <p className="font-Equilibrist">{item.runtime}</p>
                    </span>
                    <span className="opsilion">
                      Вид:{" "}
                      <p className="font-Equilibrist">
                        {getTranslatedType(item.type)}
                      </p>
                    </span>
                    <span className="opsilion">
                      Година на излизане:{" "}
                      <p className="font-Equilibrist">{item.year}</p>
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
          {totalPages > 1 && (
            <div className="box-footer flex justify-center items-center gap-4">
              <span className="text-defaulttextcolor dark:text-white/80">
                Страница {currentPage} от {totalPages}
              </span>
              <div className="flex justify-center">
                <nav
                  aria-label="Page navigation"
                  className="pagination-style-4"
                >
                  <ul className="ti-pagination mb-0 gap-3">
                    {/* Бутон за предишна страница */}
                    <li
                      className={`page-item ${
                        currentPage === 1 ? "disabled" : ""
                      }`}
                    >
                      <button
                        className="bg-primary/10 hover:bg-primary/50 border border-primary text-primary px-5 py-3 rounded-lg transition"
                        onClick={handlePreviousPage}
                        style={{
                          padding: is1546 ? "0.4rem 0.6rem" : "0.35rem 0.7rem",
                          fontSize: is1546 ? "0.75rem" : "0.85rem",
                          lineHeight: "1.4"
                        }}
                      >
                        Предишна
                      </button>
                    </li>

                    {/* Индекси на страниците */}
                    {[...Array(totalPages)].map((_, index) => (
                      <li
                        key={index}
                        className={`page-item ${
                          currentPage === index + 1 ? "active" : ""
                        }`}
                      >
                        <button
                          className="page-link "
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(index + 1);
                          }}
                          style={{
                            padding: is1546
                              ? "0.4rem 0.6rem"
                              : "0.35rem 0.7rem",
                            fontSize: is1546 ? "0.75rem" : "0.85rem",
                            lineHeight: "1.4"
                          }}
                        >
                          {index + 1}
                        </button>
                      </li>
                    ))}

                    {/* Бутон за следваща страница */}
                    <li
                      className={`page-item ${
                        currentPage === totalPages ? "disabled" : ""
                      }`}
                    >
                      <button
                        className="bg-primary/10 hover:bg-primary/50 border border-primary text-primary px-5 py-3 rounded-lg transition"
                        onClick={handleNextPage}
                        style={{
                          padding: is1546 ? "0.4rem 0.6rem" : "0.35rem 0.7rem",
                          fontSize: is1546 ? "0.75rem" : "0.85rem",
                          lineHeight: "1.4"
                        }}
                      >
                        Следваща
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default MoviesAndSeriesTable;

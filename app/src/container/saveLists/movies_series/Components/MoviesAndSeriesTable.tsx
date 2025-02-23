import { FC, Fragment, useEffect, useState } from "react";
import { MoviesAndSeriesTableProps } from "../watchlist-types";
import RecommendationCardAlert from "./RecommendationCardAlert";
import { MovieSeriesRecommendation } from "../../../types_common";
import FilterSidebar from "./FilterSidebar";
import { ChevronDownIcon } from "lucide-react";
import { useMediaQuery } from "react-responsive";
import { extractItemFromStringList } from "../helper_functions";
import { translate } from "@/container/helper_functions_common";

const MoviesAndSeriesTable: FC<MoviesAndSeriesTableProps> = ({
  data,
  bookmarkedMovies,
  setBookmarkedMovies,
  setCurrentBookmarkStatus,
  setAlertVisible
}) => {
  // Държи избрания филм или сериал, или null, ако няма избран елемент.
  const [selectedItem, setSelectedItem] =
    useState<MovieSeriesRecommendation | null>(null);
  // Съхранява списък с актьори, режисьори, сценаристи и езици, запазени в списъка.
  const [listData, setListData] = useState<{
    actor: string[];
    director: string[];
    writer: string[];
    language: string[];
  }>({
    actor: [""],
    director: [""],
    writer: [""],
    language: [""]
  });
  // Управлява състоянието на панела с филтри (отворен/затворен).
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  // Държи филтрираните данни според избраните критерии.
  const [filteredData, setFilteredData] = useState(data);
  // Следи текущата страница при пагинация.
  const [currentPage, setCurrentPage] = useState(1);
  // Определя броя на елементите, които да се показват на страница (по подразбиране 12).
  const [itemsPerPage, setItemsPerPage] = useState(12);
  // Управлява състоянието на селект менюто (отворено/затворено).
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  // Query-то, въведено в менюто за търсене.
  const [searchQuery, setSearchQuery] = useState<string>("");
  // Задава избрания филм или сериал при клик върху него.
  const handleMovieClick = (item: MovieSeriesRecommendation) =>
    setSelectedItem(item);
  // Превежда типа на филма или сериала на български.
  const getTranslatedType = (type: string) =>
    type === "movie" ? "Филм" : type === "series" ? "Сериал" : type;

  /**
   * Филтрира данните според подадените критерии за жанрове, продължителност, вид и година на издаване.
   *
   * @param {Object} filters - Обект с филтри, които ще се приложат към данните.
   * @param {string[]} filters.genres - Списък с избрани жанрове, по които да се филтрират книгите.
   * @param {string[]} filters.runtime - Списък с диапазони за продължителността (напр. "Под 60 минути").
   * @param {string[]} filters.type - Видът - филм или сериал.
   * @param {string[]} filters.year - Списък с времеви интервали за годината на издаване (напр. "След 2020").
   *
   * Функцията обработва масив от филми и сериали, като проверява дали те отговарят на избраните критерии.
   * Ако даден филтър е празен, той не ограничава резултатите. Филмите и сериалите се сравняват по жанр,
   * продължителност, вид и година на издаване.
   *
   * @returns {void} - Актуализира състоянието на филтрираните данни и нулира страницата на резултатите.
   */
  const handleApplyFilters = (filters: {
    genres: string[];
    runtime: string[];
    actor: string[];
    director: string[];
    writer: string[];
    language: string[];
    type: string[];
    imdbRating: string[];
    metascore: string[];
    boxOffice: string[];
    year: string[];
  }) => {
    const filtered = data.filter((item) => {
      const { actors, directors, writers, languages } =
        extractItemFromStringList(item);
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

      const matchesActors =
        filters.actor.length === 0 ||
        filters.actor.some((selectedActor) =>
          actors.some((actor) =>
            actor.toLowerCase().includes(selectedActor.toLowerCase())
          )
        );

      const matchesDirector =
        filters.director.length === 0 ||
        filters.director.some((selectedDirector) =>
          directors.some((director) =>
            director.toLowerCase().includes(selectedDirector.toLowerCase())
          )
        );

      const matchesWriter =
        filters.writer.length === 0 ||
        filters.writer.some((selectedWriter) =>
          writers.some((writer) =>
            writer.toLowerCase().includes(selectedWriter.toLowerCase())
          )
        );

      const matchesLanguage =
        filters.language.length === 0 ||
        filters.language.some((selectedLanguage) =>
          languages.some((language) =>
            language.toLowerCase().includes(selectedLanguage.toLowerCase())
          )
        );

      const imdbRating = parseInt(item.imdbRating, 10);
      const matchesImdbRating =
        filters.imdbRating.length === 0 ||
        filters.imdbRating.some((r) => {
          if (r === "Под 5.0") return imdbRating < 5.0;
          if (r === "5.0 до 7.0") return imdbRating >= 5.0 && imdbRating < 7.0;
          if (r === "7.0 до 8.5") return imdbRating >= 7.0 && imdbRating < 8.5;
          if (r === "8.5 до 9.5") return imdbRating >= 8.5 && imdbRating < 9.5;
          if (r === "Над 9.5") return imdbRating >= 9.5;
          return true;
        });

      const metascore = parseInt(item.metascore, 10);
      const matchesMetascore =
        filters.metascore.length === 0 ||
        filters.metascore.some((m) => {
          if (item.type === "series") return false;
          if (m === "Под 35") return metascore < 35;
          if (m === "35 до 50") return metascore >= 35 && metascore < 50;
          if (m === "50 до 75") return metascore >= 50 && metascore < 75;
          if (m === "75 до 95") return metascore >= 75 && metascore < 95;
          if (m === "Над 95") return metascore >= 95;
          return true;
        });

      const boxOffice = parseInt(item.boxOffice.replace(/\D/g, ""), 10) || 0;
      const matchesBoxOffice =
        filters.boxOffice.length === 0 ||
        filters.boxOffice.some((b) => {
          if (item.type === "series") return false;

          if (b === "Без приходи") return boxOffice === 0;
          if (b === "Под 50 млн.")
            return boxOffice > 0 && boxOffice < 50_000_000;
          if (b === "50 до 150 млн.")
            return boxOffice >= 50_000_000 && boxOffice < 150_000_000;
          if (b === "150 до 300 млн.")
            return boxOffice >= 150_000_000 && boxOffice < 300_000_000;
          if (b === "Над 300 млн.") return boxOffice >= 300_000_000;

          return true;
        });

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

      return (
        matchesGenre &&
        matchesRuntime &&
        matchesActors &&
        matchesDirector &&
        matchesWriter &&
        matchesLanguage &&
        matchesType &&
        matchesYear &&
        matchesImdbRating &&
        matchesMetascore &&
        matchesBoxOffice
      );
    });

    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
  };

  const searchData = filteredData.filter((item) =>
    [
      item.title_bg,
      item.title_en,
      item.genre_bg,
      item.actors,
      item.director,
      item.writer,
      item.year,
      item.runtime,
      item.imdbID
    ].some((field) =>
      field
        ? field.toString().toLowerCase().includes(searchQuery.toLowerCase())
        : false
    )
  );

  // Изчислява общия брой страници на база дължината на филтрираните данни и броя елементи на страница.
  const totalPages = Math.ceil(searchData.length / itemsPerPage);

  // Определя текущите данни за показване в зависимост от активната страница.
  const currentData = searchData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Отива на следващата страница, ако текущата не е последната.
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Отива на предишната страница, ако текущата не е първата.
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Променя броя на елементите на страница и връща на първа страница след промяната.
  const handleItemsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchAndSetData = async () => {
      const newActors = new Set<string>();
      const newDirectors = new Set<string>();
      const newWriters = new Set<string>();
      const newLanguages = new Set<string>();

      for (let i = 0; i < data.length; i++) {
        const { actors, directors, writers, languages } =
          extractItemFromStringList(data[i]);

        const translatedLanguages = await Promise.all(
          languages.map((language) => translate(language))
        );

        actors.forEach((actor) => newActors.add(actor));
        directors.forEach((director) => newDirectors.add(director));
        writers.forEach((writer) => newWriters.add(writer));
        translatedLanguages.forEach((language) => newLanguages.add(language));
      }

      setListData({
        actor: Array.from(newActors),
        director: Array.from(newDirectors),
        writer: Array.from(newWriters),
        language: Array.from(newLanguages)
      });
    };

    fetchAndSetData();
  }, [filteredData]);

  // useEffect(() => {
  //   const fetchAndSetData = async () => {
  //     const newActors = new Set<string>();
  //     const newDirectors = new Set<string>();
  //     const newWriters = new Set<string>();
  //     const newLanguages = new Set<string>();

  //     for (let i = 0; i < filteredData.length; i++) {
  //       const { actors, directors, writers, languages } =
  //         extractItemFromStringList(filteredData[i]);

  //       const translatedActors = await Promise.all(
  //         actors.map((actor) => translate(actor))
  //       );
  //       const translatedDirectors = await Promise.all(
  //         directors.map((director) => translate(director))
  //       );
  //       const translatedWriters = await Promise.all(
  //         writers.map((writer) => translate(writer))
  //       );
  //       const translatedLanguages = await Promise.all(
  //         languages.map((language) => translate(language))
  //       );
  //       //
  //       translatedActors.forEach((actor) => newActors.add(actor));
  //       translatedDirectors.forEach((director) => newDirectors.add(director));
  //       translatedWriters.forEach((writer) => newWriters.add(writer));
  //       translatedLanguages.forEach((language) => newLanguages.add(language));
  //     }

  //     setListData({
  //       actor: Array.from(newActors),
  //       director: Array.from(newDirectors),
  //       writer: Array.from(newWriters),
  //       language: Array.from(newLanguages)
  //     });
  //   };

  //   fetchAndSetData();
  // }, [filteredData]);

  // Проверява дали екранната ширина е 1546px или по-малка.
  const is1546 = useMediaQuery({ query: "(max-width: 1546px)" });
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
        listData={listData}
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
              <div className="xl:col-span-4 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12">
                <input
                  type="search"
                  className="form-control search-input"
                  id="input-search"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <div className="relative inline-block text-left">
                <div>
                  <button
                    type="button"
                    className="inline-flex justify-between items-center w-full px-3 py-1.5 text-sm font-medium bg-primary hover:bg-primary/75 text-white dark:text-white/80 rounded-md shadow-sm focus:bg-primary focus:text-white transition-all duration-300 ease-in-out"
                    onClick={() => setIsSelectOpen(!isSelectOpen)}
                  >
                    {itemsPerPage} елемента на страница
                    <ChevronDownIcon
                      className={`w-5 h-5 ml-2 mr-1 transition-transform duration-300 ${
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
                          className={`group flex items-center w-full px-4 py-2 text-sm bg-primary/10 ${
                            itemsPerPage === value
                              ? "text-white !bg-primary font-medium"
                              : "text-defaulttextcolor dark:text-white/80"
                          } hover:bg-primary/50 rounded-sm transition-all duration-300 ease-in-out`}
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
                  aria-label="Изберете брой елемента на страница"
                >
                  <option value={6}>6 елемента на страница</option>
                  <option value={12}>12 елемента на страница</option>
                  <option value={24}>24 елемента на страница</option>
                  <option value={36}>36 елемента на страница</option>
                  <option value={48}>48 елемента на страница</option>
                </select>
              </div>
              <button
                className="inline-flex justify-between items-center px-3 py-1.5 text-sm font-medium bg-primary hover:bg-primary/75 text-white dark:text-white/80 rounded-md shadow-sm focus:bg-primary focus:text-white transition-all duration-300 ease-in-out"
                onClick={() => setIsFilterOpen(true)}
              >
                <i
                  className="bx bx-sort-up text-lg w-5 h-5 mr-2"
                  aria-hidden="true"
                ></i>
                Филтриране
              </button>
            </div>
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
          {/* Пагинация */}
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

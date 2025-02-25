import { FC, Fragment, useEffect, useState } from "react";
import { MoviesAndSeriesTableProps } from "../watchlist-types";
import RecommendationCardAlert from "./RecommendationCardAlert";
import { MovieSeriesRecommendation } from "../../../types_common";
import FilterSidebar from "./FilterSidebar";
import { ChevronDownIcon } from "lucide-react";
import { useMediaQuery } from "react-responsive";
import {
  extractItemFromStringList,
  getTranslatedType
} from "../helper_functions";
import { translate } from "@/container/helper_functions_common";
import { InfoboxModal } from "@/components/common/infobox/InfoboxModal";
import Infobox from "@/components/common/infobox/infobox";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from "@/components/ui/accordion";

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
    actor: [],
    director: [],
    writer: [],
    language: []
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
  // State за отваряне/затваряне на InfoBox
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  // Задава избрания филм или сериал при клик върху него.
  const handleMovieClick = (item: MovieSeriesRecommendation) =>
    setSelectedItem(item);

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

        actors.forEach((actor) => newActors.add(actor));
        directors.forEach((director) => newDirectors.add(director));
        writers.forEach((writer) => newWriters.add(writer));
        languages.forEach((language) => newLanguages.add(language));
      }

      setListData({
        actor: Array.from(newActors),
        director: Array.from(newDirectors),
        writer: Array.from(newWriters),
        language: Array.from(newLanguages)
      });

      const translatedActors = await Promise.all(
        Array.from(newActors).map((actor) => translate(actor))
      );
      const translatedDirectors = await Promise.all(
        Array.from(newDirectors).map((director) => translate(director))
      );
      const translatedWriters = await Promise.all(
        Array.from(newWriters).map((writer) => translate(writer))
      );
      const translatedLanguages = await Promise.all(
        Array.from(newLanguages).map((language) => translate(language))
      );

      setListData({
        actor: translatedActors,
        director: translatedDirectors,
        writer: translatedWriters,
        language: translatedLanguages
      });
    };

    fetchAndSetData();
  }, [filteredData]);

  // Отваря/затваря InfoBox
  const handleInfoButtonClick = () => {
    setIsModalOpen((prev) => !prev);
  };

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
        data={data}
        setFilteredData={setFilteredData}
        setCurrentPage={setCurrentPage}
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
              <p className="box-title opsilion !text-xl">Списък За Гледане</p>
              <div className="flex items-center gap-4 xl:col-span-4 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12">
                <input
                  type="search"
                  className="form-control search-input"
                  id="input-search"
                  placeholder="Потърсете по име, жанр..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <Infobox onClick={handleInfoButtonClick} />
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
      <InfoboxModal
        onClick={handleInfoButtonClick}
        isModalOpen={isModalOpen}
        title="Търсачка"
        description={
          <>
            <p>
              <span className="font-semibold">Търсачката</span> е инструмент,
              който Ви позволява да търсите за{" "}
              <span className="font-semibold">конкретни препоръки</span>, които
              сте запазвали във вашия списък за гледане и искате да намерите. Тя
              взима въведения в нея текст и го сравнява със{" "}
              <span className="font-semibold">следните категории:</span>
            </p>
            <Accordion type="single" collapsible className="space-y-4 pt-5">
              <AccordionItem value="title">
                <AccordionTrigger>🎬 Заглавие</AccordionTrigger>
                <AccordionContent>
                  Можете да намерите търсеният от Вас филм или сериал,
                  въвеждайки заглавието му, както на български, така и на
                  английски език
                  <ul className="list-disc pl-6 mt-4">
                    <li>
                      <strong>Пример за заглавие на български:</strong>{" "}
                      Наследствено
                    </li>
                    <li>
                      <strong>Пример за заглавие на английски:</strong>{" "}
                      Hereditary
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="genre">
                <AccordionTrigger>🎬 Жанр</AccordionTrigger>
                <AccordionContent>
                  Можете да намерите търсеният от Вас филм или сериал,
                  въвеждайки жанровете му
                  <ul className="list-disc pl-6 mt-4">
                    <li>
                      <strong>Пример за жанр:</strong> Екшън, Драма и т.н.
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="crew">
                <AccordionTrigger>
                  🎭 Актьори, режисьори и сценаристи
                </AccordionTrigger>
                <AccordionContent>
                  Можете да намерите търсеният от Вас филм или сериал,
                  въвеждайки имената на основните лица, участващи в разработката
                  му.
                  <ul className="list-disc pl-6 mt-4">
                    <li>
                      <strong>Пример за актьор:</strong> Тони Колет
                    </li>
                    <li>
                      <strong>Пример за режисьор:</strong> Ари Астър
                    </li>
                    <li>
                      <strong>Пример за сценарист:</strong> Алисън Шрьодер
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="year">
                <AccordionTrigger>📅 Година на излизане</AccordionTrigger>
                <AccordionContent>
                  Можете да намерите търсеният от Вас филм или сериал,
                  въвеждайки годината на премиерата му.
                  <ul className="list-disc pl-6 mt-4">
                    <li>
                      <strong>Пример за година:</strong> 2018
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="runtime">
                <AccordionTrigger>⏱️ Продължителност</AccordionTrigger>
                <AccordionContent>
                  Можете да намерите търсеният от Вас филм или сериал,
                  въвеждайки продължителността му. За сериал, въведете неговата
                  средната продължителност
                  <ul className="list-disc pl-6 mt-4">
                    <li>
                      <strong>Пример за продължителност на филм:</strong> 2ч 7м
                    </li>
                    <li>
                      <strong>
                        Пример за средна продължителност на сериал:
                      </strong>{" "}
                      30м
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="id">
                <AccordionTrigger>🔍 ID</AccordionTrigger>
                <AccordionContent>
                  Можете да намерите търсеният от Вас филм или сериал,
                  въвеждайки уникалният му идентификатор в IMDb.
                  <ul className="list-disc pl-6 mt-4">
                    <li>
                      <strong>Пример за IMDb ID:</strong> tt7784604
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </>
        }
      />
    </Fragment>
  );
};

export default MoviesAndSeriesTable;

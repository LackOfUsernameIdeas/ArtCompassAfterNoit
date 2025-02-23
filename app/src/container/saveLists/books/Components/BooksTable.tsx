import { FC, Fragment, useEffect, useState } from "react";
import { BooksTableProps } from "../readlist-types";
import RecommendationCardAlert from "./RecommendationCardAlert/RecommendationCardAlert";
import { BookRecommendation } from "../../../types_common";
import FilterSidebar from "./FilterSidebar";
import { ChevronDownIcon } from "lucide-react";
import { useMediaQuery } from "react-responsive";
import {
  extractItemFromStringList,
  extractYear,
  formatGenres,
  getRelatedGenres
} from "../helper_functions";
import { InfoboxModal } from "@/components/common/infobox/InfoboxModal";
import Infobox from "@/components/common/infobox/infobox";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from "@/components/ui/accordion";

const BooksTable: FC<BooksTableProps> = ({
  data,
  bookmarkedBooks,
  setBookmarkedBooks,
  setCurrentBookmarkStatus,
  setAlertVisible
}) => {
  // Държи избраната книга или null, ако няма избрана книга.
  const [selectedItem, setSelectedItem] = useState<BookRecommendation | null>(
    null
  );
  // Съхранява списък с автори и издатели, запазени в списъка.
  const [listData, setListData] = useState<{
    authors: string[];
    publishers: string[];
  }>({ authors: [""], publishers: [""] });
  // Управлява състоянието на панела с филтри (отворен/затворен).
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  // Държи филтрираните данни според избраните критерии.
  const [filteredData, setFilteredData] = useState(data);
  // Следи текущата страница при пагинация.
  const [currentPage, setCurrentPage] = useState(1);
  // Определя броя на елементите, които да се показват на страница.
  const [itemsPerPage, setItemsPerPage] = useState(12);
  // Управлява състоянието на селект менюто (отворено/затворено).
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  // Query-то, въведено в менюто за търсене.
  const [searchQuery, setSearchQuery] = useState<string>("");
  // State за отваряне/затваряне на InfoBox
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  // Задава избраната книга при клик върху нея.
  const handleBookClick = (item: BookRecommendation) => setSelectedItem(item);

  /**
   * Филтрира данните според подадените критерии за жанрове, брой страници, автори и година на писане.
   *
   * @param {Object} filters - Обект с филтри, които ще се приложат към данните.
   * @param {string[]} filters.genres - Списък с избрани жанрове, по които да се филтрират книгите.
   * @param {string[]} filters.pages - Списък с диапазони за броя страници (напр. "Под 100 страници").
   * @param {string[]} filters.author - Списък с автори, чиито книги да бъдат показани.
   * @param {string[]} filters.year - Списък с времеви интервали за годината на писане (напр. "След 2010").
   *
   * Функцията обработва масив от книги, като проверява дали всяка книга отговаря на избраните критерии.
   * Ако даден филтър е празен, той не ограничава резултатите. Книгите се сравняват по жанр,
   * брой страници, автор и година на писане.
   *
   * @returns {void} - Актуализира състоянието на филтрираните данни и нулира страницата на резултатите.
   */
  const handleApplyFilters = (filters: {
    genres: string[]; // Филтър по жанрове
    pages: string[]; // Филтър по брой страници
    author: string[]; // Филтър по автори
    publisher: string[]; // Филтър по издатели
    goodreadsRatings: string[]; // Филтър по рейтинг в goodreads
    year: string[]; // Филтър по година на писане
  }) => {
    const filtered = data.filter((item) => {
      const { authors, publishers } = extractItemFromStringList(item);
      const bookGenres = formatGenres(item.genre_bg)
        .split(",")
        .map((genre) => genre.trim());

      const matchesGenre =
        filters.genres.length === 0 ||
        filters.genres.some((selectedGenre) =>
          bookGenres.some((bookGenre) =>
            getRelatedGenres(selectedGenre).some((relatedGenre) =>
              bookGenre.toLowerCase().includes(relatedGenre.toLowerCase())
            )
          )
        );

      const matchesPages =
        filters.pages.length === 0 ||
        filters.pages.some((p) => {
          if (p === "Под 100 страници") return item.page_count < 100;
          if (p === "100 до 200 страници")
            return item.page_count >= 100 && item.page_count <= 200;
          if (p === "200 до 300 страници")
            return item.page_count > 200 && item.page_count <= 300;
          if (p === "300 до 400 страници")
            return item.page_count > 300 && item.page_count <= 400;
          if (p === "400 до 500 страници")
            return item.page_count > 400 && item.page_count <= 500;
          if (p === "Повече от 500 страници") return item.page_count > 500;
          return true;
        });

      const matchesAuthor =
        filters.author.length === 0 ||
        filters.author.some((selectedAuthor) =>
          authors.some((bookAuthor) =>
            bookAuthor.toLowerCase().includes(selectedAuthor.toLowerCase())
          )
        );
      const matchesPublisher =
        filters.publisher.length === 0 ||
        filters.publisher.some((selectedPublisher) =>
          publishers.some((bookPublisher) =>
            bookPublisher
              .toLowerCase()
              .includes(selectedPublisher.toLowerCase())
          )
        );
      const matchesGoodreadsRating =
        filters.goodreadsRatings.length === 0 ||
        filters.goodreadsRatings.some((range) => {
          const rating = item.goodreads_rating
            ? item.goodreads_rating.toString().trim()
            : "";
          const numericRating = parseFloat(rating); // Това е безопасно, защото 'rating' вече е string
          if (isNaN(numericRating)) return false;

          if (range === "Под 3.0") return numericRating < 3.0;
          if (range === "3.0 до 3.5")
            return numericRating >= 3.0 && numericRating < 3.5;
          if (range === "3.5 до 4.0")
            return numericRating >= 3.5 && numericRating < 4.0;
          if (range === "4.0 до 4.5")
            return numericRating >= 4.0 && numericRating < 4.5;
          if (range === "Над 4.5") return numericRating >= 4.5;

          return true;
        });

      const year = extractYear(item.date_of_issue);
      const matchesYear =
        filters.year.length === 0 ||
        filters.year.some((y) => {
          if (year === null) return false;
          if (y === "Преди 1900") return year < 1900;
          if (y === "1900 до 1950") return year >= 1900 && year <= 1950;
          if (y === "1950 до 1980") return year > 1950 && year <= 1980;
          if (y === "1980 до 2000") return year > 1980 && year <= 2000;
          if (y === "2000 до 2010") return year > 2000 && year <= 2010;
          if (y === "След 2010") return year > 2010;
          return true;
        });

      return (
        matchesGenre &&
        matchesPages &&
        matchesAuthor &&
        matchesPublisher &&
        matchesGoodreadsRating &&
        matchesYear
      );
    });

    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
  };

  const searchData = filteredData.filter((book) =>
    [
      book.title_bg,
      book.title_en,
      book.genre_bg,
      book.author,
      book.date_of_issue,
      book.date_of_first_issue,
      book.ISBN_10,
      book.ISBN_13,
      book.goodreads_id,
      book.google_books_id,
      book.publisher
    ].some((field) =>
      field
        ? field.toString().toLowerCase().includes(searchQuery.toLowerCase())
        : false
    )
  );

  // Изчислява общия брой страници, необходими за показване на всички филтрирани данни.
  const totalPages = Math.ceil(searchData.length / itemsPerPage);

  // Извлича текущите данни, които трябва да се покажат на страницата, в зависимост от избрания номер на страница.
  const currentData = searchData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Преминава към следващата страница, ако все още не е достигната последната.
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Връща се към предишната страница, ако текущата страница не е първата.
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

  // При всяка промяна в `data` извлича авторите от книгите и обновява състоянието.
  useEffect(() => {
    const newAuthors: string[] = [];
    const newPublishers: string[] = [];

    for (let i = 0; i < data.length; i++) {
      const { authors, publishers } = extractItemFromStringList(searchData[i]);

      newAuthors.push(...authors);
      newPublishers.push(...publishers);
    }

    setListData({
      authors: newAuthors,
      publishers: newPublishers
    });
  }, [data]);

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
        onApplyFilters={handleApplyFilters}
        listData={listData}
      />
      <RecommendationCardAlert
        selectedItem={selectedItem}
        onClose={() => setSelectedItem(null)}
        setBookmarkedBooks={setBookmarkedBooks}
        setCurrentBookmarkStatus={setCurrentBookmarkStatus}
        setAlertVisible={setAlertVisible}
        bookmarkedBooks={bookmarkedBooks}
      />
      <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
        <div className="box custom-card">
          <div className="box-header justify-between flex items-center">
            <div className="flex items-center gap-4">
              <p className="box-title">Списък За Четене</p>
              <div className="flex items-center gap-4 xl:col-span-4 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12">
                <input
                  type="search"
                  className="form-control search-input"
                  id="input-search"
                  placeholder="Потърсете тук..."
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
                onClick={() => handleBookClick(item)}
              >
                <div className="flex items-center gap-4 w-full mb-4">
                  <img
                    src={item.imageLink}
                    alt={`${item.title_bg || "Book"} Cover`}
                    className="rounded-lg w-32 h-auto !shadow-lg"
                  />
                  <div className="flex flex-col items-start">
                    <span className="opsilion">
                      Жанр:{" "}
                      <p className="font-Equilibrist">
                        {formatGenres(item.genre_bg)}
                      </p>
                    </span>
                    <span className="opsilion">
                      Страници:{" "}
                      <p className="font-Equilibrist">{item.page_count}</p>
                    </span>
                    <span className="opsilion">
                      Автор: <p className="font-Equilibrist">{item.author}</p>
                    </span>
                    <span className="opsilion">
                      Година на писане:{" "}
                      <p className="font-Equilibrist">
                        {extractYear(item.date_of_issue)}
                      </p>
                    </span>
                  </div>
                </div>
                <div className="w-full bg-white bg-bodybg/50 dark:bg-bodybg2/50 dark:border-black/10 rounded-md shadow-lg dark:shadow-xl text-center mt-auto">
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
              <span className="font-semibold">
                конкретни препоръки, които искате да намерите.{" "}
              </span>
              Тя взима въведения в нея текст и го сравнява със{" "}
              <span className="font-semibold">следните категории:</span>
            </p>
            <Accordion type="single" collapsible className="space-y-4 pt-5">
              <AccordionItem value="title">
                <AccordionTrigger>📖 Заглавие</AccordionTrigger>
                <AccordionContent>
                  Заглавието на книгата, както на български, така и на английски
                  език.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="genre">
                <AccordionTrigger>📖 Жанр</AccordionTrigger>
                <AccordionContent>
                  Основните жанрове на книгата (екшън, драма и т.н.).
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="author">
                <AccordionTrigger>✍️ Автор</AccordionTrigger>
                <AccordionContent>
                  Писателя, който е написал книгата.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="year">
                <AccordionTrigger>📅 Година на писане</AccordionTrigger>
                <AccordionContent>
                  Годината на писането на книгата. Това важи както и за
                  препоръчаното издание, така и за оригиналното издание (ако са
                  различни).
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="isbn">
                <AccordionTrigger>🔢 ISBN/ASIN</AccordionTrigger>
                <AccordionContent>
                  Стандартизираният номер, съответстващ на книгата. Може да се
                  намери спрямо ISBN 10, ISBN 13 и ASIN.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="id">
                <AccordionTrigger>🔍 ID</AccordionTrigger>
                <AccordionContent>
                  Уникалният идентификатор на книгата, както в Goodreads, така и
                  в Google Books.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="publisher">
                <AccordionTrigger>🏢 Издател</AccordionTrigger>
                <AccordionContent>Издателят на книгата.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </>
        }
      />
    </Fragment>
  );
};

export default BooksTable;

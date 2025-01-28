import { FC, Fragment, useEffect, useState, useMemo, useCallback } from "react";
import { MoviesAndSeriesTableProps, Rating } from "../watchlist-types";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import RecommendationCardAlert from "./RecommendationCardAlert";
import Pagination from "../../../../components/common/pagination/pagination";
import { MovieSeriesRecommendation } from "../../../types_common";

const MoviesAndSeriesTable: FC<MoviesAndSeriesTableProps> = ({
  data,
  type,
  bookmarkedMovies,
  setBookmarkedMovies,
  setCurrentBookmarkStatus,
  setAlertVisible
}) => {
  const [currentTablePage, setCurrentTablePage] = useState(1); // Текуща страница на таблицата
  const itemsPerTablePage = 5; // Брой елементи на страница
  const [sortBy, setSortBy] = useState<
    keyof MovieSeriesRecommendation | "default"
  >("default"); // Ключ за сортиране
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc"); // Посока на сортиране (възходящо/низходящо)
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false); // Видимост на менюто за сортиране
  const [selectedItem, setSelectedItem] =
    useState<MovieSeriesRecommendation | null>(null); // Избран филм/сериал

  const [filteredTableData, setFilteredTableData] =
    useState<MovieSeriesRecommendation[]>(data); // Дани за таблицата, филтрирани по нужда

  // useEffect за set-ване на данните
  useEffect(() => {
    setFilteredTableData(data || []);
  }, [data]);

  // Опции за сортиране въз основа на типа на данните
  const sortOptions = useMemo(() => {
    const options = [
      { label: "Просперитет", value: "prosperityScore" },
      { label: "Боксофис", value: "boxOffice" }
    ];

    if (type === "recommendations") {
      options.unshift({ label: "Брой Препоръки", value: "recommendations" });
    }

    return options;
  }, [type]);

  // Съответствие на заглавията на колоните в таблицата спрямо сортирането
  const sortTitles: Record<string, string> = {
    recommendations: "Най-Често Препоръчваните Филми и Сериали За Мен",
    prosperityScore: "Филми и Сериали По Просперитет",
    boxOffice: "Най-Печеливши Филми и Сериали"
  };

  // Изчисляване на сортираните данни на базата на избраните опции
  const sortedData = useMemo(() => {
    // Филтриране на данни по тип (само филми или сериали)
    const filteredByTypeData = ["boxOffice", "prosperityScore"].includes(sortBy)
      ? filteredTableData.filter((item) => item.type === "movie")
      : filteredTableData;

    // Ако сортираме по подразбиране, връщаме филтрираните данни
    if (sortBy === "default") {
      return filteredByTypeData;
    }

    // Сортиране на данните въз основа на избраните опции
    return [...filteredByTypeData].sort((a, b) => {
      const parseNumber = (value: any) => {
        // Преобразуване на стойности към числови, ако са форматирани като текст (например "1,000,000" -> 1000000)
        if (typeof value === "string") {
          return parseFloat(value.replace(/,/g, ""));
        }
        return value || 0; // Обработване на null или undefined
      };

      // Функция за извличане на числовата стойност на различни типове стойности
      const extractNumericValue = (
        value: string | number | Rating[]
      ): number => {
        if (typeof value === "string") {
          // Почиства стринга и го преобразува в число
          return parseFloat(value.replace(/[^\d.-]/g, ""));
        } else if (typeof value === "number") {
          return value; // Ако е число, го връщаме
        } else if (Array.isArray(value)) {
          // Ако е масив от рейтинги, връщаме 0 (или съответна стойност)
          return 0; // Може да се добави логика за специфично обработване
        }
        return 0; // За всички други случаи връщаме 0
      };

      // Извличане на стойности за сортиране
      const valueA = extractNumericValue(a[sortBy as keyof typeof a]);
      const valueB = extractNumericValue(b[sortBy as keyof typeof b]);

      // Връщане на стойност за сортиране в зависимост от посоката (възходящо или низходящо)
      if (valueA === valueB) return 0;

      return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
    });
  }, [filteredTableData, sortBy, sortOrder]);

  const totalItems = sortedData.length; // Общо количество елементи
  const totalTablePages = Math.ceil(totalItems / itemsPerTablePage); // Общо количество страници

  // Разделяне на данните на страници
  const paginatedData = useMemo(() => {
    const start = (currentTablePage - 1) * itemsPerTablePage;
    return sortedData.slice(start, start + itemsPerTablePage);
  }, [sortedData, currentTablePage]);

  // Функции за навигация между страниците
  const handlePrevTablePage = useCallback(() => {
    if (currentTablePage > 1) setCurrentTablePage((prev) => prev - 1);
  }, [currentTablePage]);

  const handleNextTablePage = useCallback(() => {
    if (currentTablePage < totalTablePages)
      setCurrentTablePage((prev) => prev + 1);
  }, [currentTablePage, totalTablePages]);

  // Използване на медийни заявки за адаптиране на компонента към различни размери на екрана
  const is1399 = useMediaQuery({ query: "(max-width: 1399px)" });
  const is1557 = useMediaQuery({ query: "(max-width: 1557px)" });

  // Toggle за отваряне/затваряне на менюто за сортиране
  const toggleSortMenu = () => setIsSortMenuOpen((prev) => !prev);

  // Обработване на избора на опция за сортиране
  const handleSortOptionSelect = useCallback(
    (value: keyof MovieSeriesRecommendation) => {
      setSortBy(value); // Задаваме избраната опция за сортиране
      setIsSortMenuOpen(false); // Затваряме менюто за сортиране
    },
    []
  );

  // Функция за получаване на преведен тип (филм или сериал)
  const getTranslatedType = (type: string) =>
    type === "movie" ? "филм" : type === "series" ? "сериал" : type;

  // Обработване на клик върху ред от таблицата (избиране на елемент)
  const handleRowClick = (item: MovieSeriesRecommendation) =>
    setSelectedItem(item); // Задаваме избрания елемент като активен
  return (
    <Fragment>
      {/* Компонент за показване на избран филм/сериал като alert*/}
      <RecommendationCardAlert
        selectedItem={selectedItem}
        onClose={() => setSelectedItem(null)}
        setBookmarkedMovies={setBookmarkedMovies}
        setCurrentBookmarkStatus={setCurrentBookmarkStatus}
        setAlertVisible={setAlertVisible}
        bookmarkedMovies={bookmarkedMovies}
      />
      <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
        <div className="box custom-card h-[27.75rem]">
          <div className="box-header justify-between">
            <div
              className={`box-title whitespace-nowrap overflow-hidden text-ellipsis ${
                is1399 ? "max-w-full" : "max-w-[20rem]"
              }`}
              data-tooltip-id="box-title-tooltip"
              data-tooltip-content={
                type == "watchlist"
                  ? "Списък За Гледане"
                  : sortBy === "default"
                  ? "Най-Често Препоръчваните Филми и Сериали За Мен"
                  : sortTitles[sortBy]
              }
            >
              {type == "watchlist"
                ? "Списък За Гледане"
                : sortBy === "default"
                ? "Най-Често Препоръчваните Филми и Сериали За Мен"
                : sortTitles[sortBy]}
            </div>
            <Tooltip id="box-title-tooltip" />
            <div className="relative flex items-center space-x-2">
              <div className="hs-dropdown ti-dropdown">
                <Link
                  to="#"
                  className={`flex items-center ${
                    is1557
                      ? "px-2.5 py-1 text-[0.75rem]"
                      : "px-3 py-1 text-[0.85rem]"
                  } font-medium text-primary border border-primary rounded-sm hover:bg-primary/10 transition-all`}
                  onClick={toggleSortMenu}
                  aria-expanded={isSortMenuOpen ? "true" : "false"}
                >
                  <span className={`${sortBy === "default" ? "" : "hidden"}`}>
                    Сортирай по
                  </span>
                  <span
                    className={`${
                      sortBy === "default" ? "hidden" : ""
                    } text-sm`}
                  >
                    {sortOptions.find((option) => option.value === sortBy)
                      ?.label || "Сортирай по"}
                  </span>
                  <i
                    className={`ri-arrow-${
                      isSortMenuOpen ? "up" : "down"
                    }-s-line ${!is1557 && "ml-1"} text-base`}
                  ></i>
                </Link>
                <ul
                  className={`hs-dropdown-menu ti-dropdown-menu ${
                    isSortMenuOpen ? "block" : "hidden"
                  }`}
                  role="menu"
                >
                  {sortOptions.map(({ label, value }) => (
                    <li key={value}>
                      <Link
                        onClick={() =>
                          handleSortOptionSelect(
                            value as keyof MovieSeriesRecommendation
                          )
                        }
                        className={`ti-dropdown-item ${
                          sortBy === value ? "active" : ""
                        }`}
                        to="#"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                className="px-3 py-1.5 text-[0.85rem] bg-primary text-white border border-primary rounded-sm text-base font-medium hover:bg-primary/10 transition-all flex items-center justify-center"
                onClick={() => {
                  if (sortBy === "default") {
                    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
                    setSortBy("prosperityScore");
                  } else {
                    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
                  }
                }}
              >
                {sortOrder === "asc" ? (
                  <i className="bx bx-sort-up text-lg"></i>
                ) : (
                  <i className="bx bx-sort-down text-lg"></i>
                )}
              </button>
            </div>
          </div>
          <div className="box-body">
            <div className="overflow-x-auto">
              <table className="table min-w-full whitespace-nowrap table-hover border table-bordered no-hover-text">
                <thead>
                  <tr className="border border-inherit">
                    <th>#</th>
                    <th>Заглавие</th>
                    <th>Заглавие - Английски</th>
                    <th>Тип</th>
                    {type === "recommendations" && <th>Брой Препоръки</th>}
                    <th>Просперитет</th>
                    <th>Боксофис</th>
                    <th>Общо Победи</th>
                    <th>Общо Номинации</th>
                    <th>IMDb Рейтинг</th>
                    <th>Metascore</th>
                  </tr>
                </thead>
                {/* Данните за филмите/сериалите в таблицата*/}
                <tbody className="no-hover-text">
                  {paginatedData.map((item, index) => (
                    <tr
                      key={index}
                      className="border border-inherit border-solid hover:bg-primary/70 dark:border-defaultborder/10 dark:hover:bg-primary/50 cursor-pointer hover:text-white"
                      onClick={() => handleRowClick(item)}
                    >
                      <td>
                        {(currentTablePage - 1) * itemsPerTablePage + index + 1}
                      </td>
                      <td>{item.title_bg}</td>
                      <td>{item.title_en}</td>
                      <td>{getTranslatedType(item.type)}</td>
                      {type == "recommendations" &&
                        "recommendations" in item && (
                          <td>{item.recommendations}</td>
                        )}
                      <td>{item.prosperityScore}</td>
                      <td>{item.boxOffice}</td>
                      <td>{item.total_wins}</td>
                      <td>{item.total_nominations}</td>
                      <td>{item.imdbRating}</td>
                      <td>{item.metascore}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Пагинация */}
          <div className="box-footer">
            <Pagination
              currentPage={currentTablePage}
              totalItems={totalItems}
              itemsPerPage={itemsPerTablePage}
              totalTablePages={totalTablePages}
              isSmallScreen={is1557}
              handlePrevPage={handlePrevTablePage}
              handleNextPage={handleNextTablePage}
              setCurrentPage={setCurrentTablePage}
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default MoviesAndSeriesTable;

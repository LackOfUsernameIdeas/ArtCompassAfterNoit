import { FC, Fragment, useEffect, useState, useMemo } from "react";
import {
  Category,
  DataType,
  FilteredTableData
} from "../individualStats-types";
import {
  filterTableData,
  isActor,
  isDirector,
  isWriter
} from "../helper_functions";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import { tableCategoryDisplayNames } from "../individualStats-data";
import { Categorybar } from "./Charts";

interface GenresBarChartProps {
  data: DataType;
}

const GenresBarChart: FC<GenresBarChartProps> = ({ data }) => {
  const [prosperitySortCategory, setProsperitySortCategory] =
    useState<Category>("Directors");

  const [filteredTableData, setFilteredTableData] = useState<FilteredTableData>(
    []
  );
  const [currentTablePage, setCurrentTablePage] = useState(1);
  const itemsPerTablePage = 5;

  const totalItems = filteredTableData.length;
  const totalTablePages = Math.ceil(totalItems / itemsPerTablePage);

  // Следи за промени в `data` и актуализира филтрираните данни в таблицата съответно
  useEffect(() => {
    const initialFilteredData =
      data[`sorted${prosperitySortCategory}ByProsperity`];
    setFilteredTableData(initialFilteredData);
  }, [data, prosperitySortCategory]);

  // Използва useMemo за запаметяване на изчисляването на филтрираните данни
  const memoizedFilteredData = useMemo(
    () =>
      filterTableData(
        filteredTableData,
        prosperitySortCategory,
        currentTablePage,
        itemsPerTablePage
      ),
    [filteredTableData, prosperitySortCategory, currentTablePage]
  );

  console.log("filteredTableData: ", filteredTableData);
  console.log("prosperitySortCategory: ", prosperitySortCategory);

  const handleCategoryChange = (category: Category) => {
    // Превключва филтрираните данни в зависимост от избраната категория
    setFilteredTableData(data[`sorted${category}ByProsperity`]);
    setProsperitySortCategory(category);
  };

  // Обработка на логиката за предишна страница
  const handlePrevTablePage = () => {
    if (currentTablePage > 1) {
      setCurrentTablePage((prev) => prev - 1);
    }
  };

  const handleNextTablePage = () => {
    if (currentTablePage < totalTablePages) {
      setCurrentTablePage((prev) => prev + 1);
    }
  };

  const getCategoryName = (item: FilteredTableData[number]) => {
    if (isDirector(item)) return item.director_bg;
    if (isActor(item)) return item.actor_bg;
    if (isWriter(item)) return item.writer_bg;
    return "";
  };

  const is1546 = useMediaQuery({ query: "(max-width: 1546px)" });
  const is1477 = useMediaQuery({ query: "(max-width: 1477px)" });

  return (
    <Fragment>
      <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
        <div className="box custom-card h-[27.75rem]">
          <div className="box-header justify-between">
            <div className="box-title">по Брой Препоръки</div>
          </div>
          <div className="box-body">
            <Categorybar />
          </div>
          <div className="box-footer">
            <div className="sm:flex items-center">
              <div
                className={`text-defaulttextcolor dark:text-defaulttextcolor/70 text-[${
                  is1546 ? "0.55rem" : "0.70rem"
                }]`}
              >
                Показване на резултати от{" "}
                <b>
                  {currentTablePage === 1 ? 1 : (currentTablePage - 1) * 5 + 1}{" "}
                </b>
                до{" "}
                <b>
                  {currentTablePage === totalTablePages
                    ? totalItems
                    : currentTablePage * 5}{" "}
                </b>
                от общо <b>{totalItems}</b>
                <i className="bi bi-arrow-right ms-2 font-semibold"></i>
              </div>
              <div className="ms-auto">
                <nav
                  aria-label="Page navigation"
                  className={`pagination-style-4 ${
                    is1546 ? "text-[0.55rem]" : "text-[0.70rem]"
                  }`}
                >
                  <ul className="ti-pagination mb-0 flex-wrap">
                    <li
                      className={`page-item ${
                        currentTablePage === 1 ? "disabled" : ""
                      }`}
                      style={{ marginRight: "0.25rem" }}
                    >
                      <Link
                        className="page-link"
                        to="#"
                        onClick={handlePrevTablePage}
                        style={{
                          padding: is1546
                            ? "0.25rem 0.35rem"
                            : "0.2rem 0.45rem",
                          fontSize: is1546 ? "0.6rem" : "0.7rem",
                          lineHeight: "1.25"
                        }}
                      >
                        Предишна
                      </Link>
                    </li>

                    {Array.from({ length: totalTablePages }).map((_, index) => {
                      const pageNumber = index + 1;

                      if (
                        pageNumber === 1 ||
                        pageNumber === totalTablePages ||
                        Math.abs(pageNumber - currentTablePage) <= 1
                      ) {
                        return (
                          <li
                            key={pageNumber}
                            className={`page-item ${
                              pageNumber === currentTablePage ? "active" : ""
                            }`}
                            style={{ marginRight: "0.25rem" }}
                          >
                            <Link
                              className="page-link"
                              to="#"
                              onClick={() => setCurrentTablePage(pageNumber)}
                              style={{
                                padding: is1546
                                  ? "0.25rem 0.35rem"
                                  : "0.2rem 0.45rem",
                                fontSize: is1546 ? "0.6rem" : "0.7rem",
                                lineHeight: "1.25"
                              }}
                            >
                              {pageNumber}
                            </Link>
                          </li>
                        );
                      }

                      if (
                        (pageNumber === currentTablePage - 2 ||
                          pageNumber === currentTablePage + 2) &&
                        totalTablePages > 5
                      ) {
                        return (
                          <li
                            key={pageNumber}
                            className="page-item disabled"
                            style={{ marginRight: "0.25rem" }}
                          >
                            <Link
                              className="page-link"
                              to="#"
                              style={{
                                padding: is1546
                                  ? "0.25rem 0.35rem"
                                  : "0.2rem 0.45rem",
                                fontSize: is1546 ? "0.6rem" : "0.7rem",
                                lineHeight: "1.25"
                              }}
                            >
                              ...
                            </Link>
                          </li>
                        );
                      }

                      return null;
                    })}

                    <li
                      className={`page-item ${
                        currentTablePage === totalTablePages ? "disabled" : ""
                      }`}
                      style={{ marginLeft: "0.25rem" }}
                    >
                      <Link
                        className="page-link"
                        to="#"
                        onClick={handleNextTablePage}
                        style={{
                          padding: is1546
                            ? "0.25rem 0.35rem"
                            : "0.2rem 0.45rem",
                          fontSize: is1546 ? "0.6rem" : "0.7rem",
                          lineHeight: "1.25"
                        }}
                      >
                        Следваща
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default GenresBarChart;

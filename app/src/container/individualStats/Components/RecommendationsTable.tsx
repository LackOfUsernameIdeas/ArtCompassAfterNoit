import { FC, Fragment, useEffect, useState, useMemo } from "react";
import { DataType, Recommendation } from "../individualStats-types";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom"; // Make sure this is imported

interface RecommendationsTableProps {
  data: DataType;
}

const RecommendationsTable: FC<RecommendationsTableProps> = ({ data }) => {
  const [currentTablePage, setCurrentTablePage] = useState(1);
  const itemsPerTablePage = 5;

  const [sortBy, setSortBy] = useState<keyof Recommendation | "default">(
    "default"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [filteredTableData, setFilteredTableData] = useState<Recommendation[]>(
    []
  );
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);

  const totalItems = filteredTableData.length;
  const totalTablePages = Math.ceil(totalItems / itemsPerTablePage);

  useEffect(() => {
    setFilteredTableData(
      data.topRecommendations.recommendations as Recommendation[]
    );
  }, [data]);

  const sortedData = useMemo(() => {
    // Filter the data to only include 'movie' type when sorting by 'boxOffice' or 'prosperityScore'
    const filteredByTypeData = ["boxOffice", "prosperityScore"].includes(sortBy)
      ? filteredTableData.filter((item) => item.type === "movie")
      : filteredTableData;

    if (sortBy === "default") {
      return filteredByTypeData; // Or use a default sorting field here, e.g., sorted by date or another field
    }

    return [...filteredByTypeData].sort((a, b) => {
      const valueA = a[sortBy];
      const valueB = b[sortBy];

      if (valueA === valueB) return 0;
      return sortOrder === "asc"
        ? (valueA as number) - (valueB as number)
        : (valueB as number) - (valueA as number);
    });
  }, [filteredTableData, sortBy, sortOrder]);

  const paginatedData = useMemo(() => {
    const start = (currentTablePage - 1) * itemsPerTablePage;
    return sortedData.slice(start, start + itemsPerTablePage);
  }, [sortedData, currentTablePage]);

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

  const is1546 = useMediaQuery({ query: "(max-width: 1546px)" });

  const sortOptions = [
    { label: "Препоръки", value: "recommendations" },
    { label: "Просперитет", value: "prosperityScore" },
    { label: "Боксофис", value: "boxOffice" }
  ];

  const toggleSortMenu = () => setIsSortMenuOpen((prev) => !prev);

  const handleSortOptionSelect = (value: keyof Recommendation) => {
    setSortBy(value);
    setIsSortMenuOpen(false); // Close the menu after selecting an option
  };

  // Map sorting options to more descriptive titles
  const sortTitles: Record<string, string> = {
    recommendations: "Най-често препоръваните филми и сериали за мен",
    prosperityScore: "Филми и сериали по просперитет",
    boxOffice: "Най-печеливши филми и сериали"
  };

  return (
    <Fragment>
      <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
        <div className="box custom-card h-[27.75rem]">
          <div className="box-header justify-between">
            {/* Динамично сортиране на заглавие базирано на избраната опция */}
            <div className="box-title">
              {sortBy === "default"
                ? "Най-често препоръчваните филми и сериали за мен"
                : sortTitles[sortBy]}
            </div>
            <div className="relative flex items-center space-x-2">
              <div className="hs-dropdown ti-dropdown">
                <Link
                  to="#"
                  className={`flex items-center ${
                    is1546
                      ? "px-3 py-1.5 text-[0.85rem]"
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
                    }-s-line ${!is1546 && "ml-1"} text-base`}
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
                          handleSortOptionSelect(value as keyof Recommendation)
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
                className="px-3 py-1.5 bg-primary text-white border border-primary rounded-sm text-base font-medium hover:bg-primary/10 transition-all flex items-center justify-center"
                onClick={() =>
                  setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                }
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
              <table className="table min-w-full whitespace-nowrap table-hover border table-bordered">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Заглавие</th>
                    <th>Тип</th>
                    <th>Препоръки</th>
                    <th>Оскар Победи</th>
                    <th>Оскар Номинации</th>
                    <th>Общо Победи</th>
                    <th>Общо Номинации</th>
                    <th>IMDb Рейтинг</th>
                    <th>Metascore</th>
                    <th>Боксофис</th>
                    <th>Просперитет</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((item, index) => (
                    <tr key={index}>
                      <td>
                        {(currentTablePage - 1) * itemsPerTablePage + index + 1}
                      </td>
                      <td>{item.title_bg}</td>
                      <td>{item.type}</td>
                      <td>{item.recommendations}</td>
                      <td>{item.oscar_wins}</td>
                      <td>{item.oscar_nominations}</td>
                      <td>{item.total_wins}</td>
                      <td>{item.total_nominations}</td>
                      <td>{item.imdbRating}</td>
                      <td>{item.metascore}</td>
                      <td>{item.boxOffice}</td>
                      <td>{item.prosperityScore}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
                      style={{
                        marginRight: "0.25rem"
                      }}
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
                      style={{
                        marginLeft: "0.25rem"
                      }}
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

export default RecommendationsTable;

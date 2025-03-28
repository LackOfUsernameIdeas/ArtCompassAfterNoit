import React from "react";
import { Link } from "react-router-dom";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  totalTablePages: number;
  isSmallScreen: boolean;
  handlePrevPage: () => void;
  handleNextPage: () => void;
  setCurrentPage: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  totalTablePages,
  isSmallScreen,
  handlePrevPage,
  handleNextPage,
  setCurrentPage
}) => {
  return (
    <div className="sm:flex items-center">
      <div className="text-defaulttextcolor dark:text-defaulttextcolor/70 text-[0.65rem] sm:text-[0.55rem]">
        Показване на резултати от{" "}
        <b>{currentPage === 1 ? 1 : (currentPage - 1) * itemsPerPage + 1}</b> до{" "}
        <b>
          {currentPage === totalTablePages
            ? totalItems
            : currentPage * itemsPerPage}
        </b>{" "}
        от общо <b>{totalItems}</b>
        <i className="bi bi-arrow-right ms-2 font-semibold hidden sm:inline"></i>
      </div>

      <div className="ms-auto">
        <nav
          aria-label="Page navigation"
          className={`pagination-style-4 ${
            isSmallScreen ? "text-[0.55rem]" : "text-[0.70rem]"
          }`}
        >
          <ul className="ti-pagination mb-0 flex-wrap">
            <li
              className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              style={{ marginRight: "0.25rem" }}
            >
              <Link
                className="page-link"
                to="#"
                onClick={handlePrevPage}
                style={{
                  padding: isSmallScreen ? "0.25rem 0.35rem" : "0.2rem 0.45rem",
                  fontSize: isSmallScreen ? "0.6rem" : "0.7rem",
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
                Math.abs(pageNumber - currentPage) <= 1
              ) {
                return (
                  <li
                    key={pageNumber}
                    className={`page-item ${
                      pageNumber === currentPage ? "active" : ""
                    }`}
                    style={{ marginRight: "0.25rem" }}
                  >
                    <Link
                      className="page-link"
                      to="#"
                      onClick={() => setCurrentPage(pageNumber)}
                      style={{
                        padding: isSmallScreen
                          ? "0.25rem 0.35rem"
                          : "0.2rem 0.45rem",
                        fontSize: isSmallScreen ? "0.6rem" : "0.7rem",
                        lineHeight: "1.25"
                      }}
                    >
                      {pageNumber}
                    </Link>
                  </li>
                );
              }

              if (
                (pageNumber === currentPage - 2 ||
                  pageNumber === currentPage + 2) &&
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
                        padding: isSmallScreen
                          ? "0.25rem 0.35rem"
                          : "0.2rem 0.45rem",
                        fontSize: isSmallScreen ? "0.6rem" : "0.7rem",
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
                currentPage === totalTablePages ? "disabled" : ""
              }`}
              style={{ marginLeft: "0.25rem" }}
            >
              <Link
                className="page-link"
                to="#"
                onClick={handleNextPage}
                style={{
                  padding: isSmallScreen ? "0.25rem 0.35rem" : "0.2rem 0.45rem",
                  fontSize: isSmallScreen ? "0.6rem" : "0.7rem",
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
  );
};

export default Pagination;

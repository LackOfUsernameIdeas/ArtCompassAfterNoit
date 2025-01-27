import { FC, Fragment, useState, useMemo, useCallback } from "react";
import { Recommendation } from "../readlist-types";
import { useMediaQuery } from "react-responsive";
import { Tooltip } from "react-tooltip";
// import RecommendationCardAlert from "./RecommendationCardAlert/RecommendationCardAlert";
import Pagination from "../../../../components/common/pagination/pagination";

interface BooksTableProps {
  data: Recommendation[];
  type: "recommendations" | "watchlist";
  handleBookmarkClick: (book: {
    google_books_id: string;
    goodreads_id: string;
    [key: string]: any;
  }) => void;
  bookmarkedMovies: { [key: string]: Recommendation };
}

const BooksTable: FC<BooksTableProps> = ({
  data,
  type,
  handleBookmarkClick,
  bookmarkedMovies
}) => {
  const [currentTablePage, setCurrentTablePage] = useState(1);
  const itemsPerTablePage = 5;
  const [selectedItem, setSelectedItem] = useState<Recommendation | null>(null);

  const totalItems = data.length;
  const totalTablePages = Math.ceil(totalItems / itemsPerTablePage);

  const paginatedData = useMemo(() => {
    const start = (currentTablePage - 1) * itemsPerTablePage;
    return data.slice(start, start + itemsPerTablePage);
  }, [data, currentTablePage]);

  const handlePrevTablePage = useCallback(() => {
    if (currentTablePage > 1) setCurrentTablePage((prev) => prev - 1);
  }, [currentTablePage]);

  const handleNextTablePage = useCallback(() => {
    if (currentTablePage < totalTablePages)
      setCurrentTablePage((prev) => prev + 1);
  }, [currentTablePage, totalTablePages]);

  const is1399 = useMediaQuery({ query: "(max-width: 1399px)" });
  const is1557 = useMediaQuery({ query: "(max-width: 1557px)" });

  const handleRowClick = (item: Recommendation) => setSelectedItem(item);

  return (
    <Fragment>
      {/* <RecommendationCardAlert
        selectedItem={selectedItem}
        onClose={() => setSelectedItem(null)}
        handleBookmarkClick={handleBookmarkClick}
        bookmarkedMovies={bookmarkedMovies}
      /> */}
      <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
        <div className="box custom-card h-[27.75rem]">
          <div className="box-header justify-between">
            <div
              className={`box-title whitespace-nowrap overflow-hidden text-ellipsis ${
                is1399 ? "max-w-full" : "max-w-[20rem]"
              }`}
              data-tooltip-id="box-title-tooltip"
              data-tooltip-content="Списък За Четене"
            >
              Списък За Четене
            </div>
            <Tooltip id="box-title-tooltip" />
          </div>
          <div className="box-body">
            <div className="overflow-x-auto">
              <table className="table min-w-full whitespace-nowrap table-hover border table-bordered no-hover-text">
                <thead>
                  <tr className="border border-inherit">
                    <th>#</th>
                    <th>Заглавие</th>
                    <th>Оригинално заглавие</th>
                    <th>Част от поредица</th>
                    <th>Goodreads Рейтинг</th>
                    <th>Брой ревюта</th>
                    <th>Адаптации</th>
                  </tr>
                </thead>
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
                      <td>{item.real_edition_title}</td>
                      <td>{item.series || "N/A"}</td>
                      <td>{item.goodreads_rating}</td>
                      <td>{item.goodreads_reviews_count || "N/A"}</td>
                      <td>{item.adaptations}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
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

export default BooksTable;

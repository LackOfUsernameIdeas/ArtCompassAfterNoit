import { FC, Fragment, useState, useMemo, useCallback } from "react";
import { BooksTableProps } from "../readlist-types";
import { useMediaQuery } from "react-responsive";
import RecommendationCardAlert from "./RecommendationCardAlert/RecommendationCardAlert";
import Pagination from "../../../../components/common/pagination/pagination";
import { BookRecommendation } from "../../../types_common";

// Компонент за таблица на книгите, добавени в readlist
const BooksTable: FC<BooksTableProps> = ({
  data,
  bookmarkedBooks,
  setBookmarkedBooks,
  setCurrentBookmarkStatus,
  setAlertVisible
}) => {
  // Състояние за текущата страница на таблицата
  const [currentTablePage, setCurrentTablePage] = useState(1);
  const itemsPerTablePage = 5; // Броя на елементите на страница
  const [selectedItem, setSelectedItem] = useState<BookRecommendation | null>(
    null
  );

  // Изчисляваме общия брой елементи и страници
  const totalItems = data.length;
  const totalTablePages = Math.ceil(totalItems / itemsPerTablePage);

  // Генерираме данни за текущата страница
  const paginatedData = useMemo(() => {
    const start = (currentTablePage - 1) * itemsPerTablePage;
    return data.slice(start, start + itemsPerTablePage);
  }, [data, currentTablePage]);

  // Функции за навигация през страниците
  const handlePrevTablePage = useCallback(() => {
    if (currentTablePage > 1) setCurrentTablePage((prev) => prev - 1);
  }, [currentTablePage]);

  const handleNextTablePage = useCallback(() => {
    if (currentTablePage < totalTablePages)
      setCurrentTablePage((prev) => prev + 1);
  }, [currentTablePage, totalTablePages]);

  // Медиен чек за екрани с ширина под 1399px и 1557px
  const is1399 = useMediaQuery({ query: "(max-width: 1399px)" });
  const is1557 = useMediaQuery({ query: "(max-width: 1557px)" });

  // Обработчик за клик върху ред
  const handleRowClick = (item: BookRecommendation) => setSelectedItem(item);

  console.log("selectedItem: ", selectedItem);

  return (
    <Fragment>
      {/* Компонент за показване на избрана книга като alert*/}
      <RecommendationCardAlert
        selectedItem={selectedItem}
        onClose={() => setSelectedItem(null)}
        setBookmarkedBooks={setBookmarkedBooks}
        setCurrentBookmarkStatus={setCurrentBookmarkStatus}
        setAlertVisible={setAlertVisible}
        bookmarkedBooks={bookmarkedBooks}
      />
      <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
        <div className="box custom-card h-[27.75rem]">
          <div className="box-header justify-between">
            <div
              className={`box-title ${is1399 ? "max-w-full" : "max-w-[20rem]"}`}
            >
              Списък За Четене
            </div>
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
                  {/* Render на редовете с книги */}
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
                      <td>{item.goodreads_rating || "N/A"}</td>
                      <td>{item.goodreads_reviews_count || "N/A"}</td>
                      <td>{item.adaptations}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="box-footer">
            {/* Пагинация */}
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

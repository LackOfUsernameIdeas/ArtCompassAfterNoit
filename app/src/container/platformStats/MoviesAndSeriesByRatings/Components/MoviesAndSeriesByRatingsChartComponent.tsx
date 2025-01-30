import { FC, Fragment, useMemo, useState } from "react";
import { MoviesAndSeriesByRatingsChart } from "../../Charts";
import { MoviesAndSeriesByRatingsDataType } from "../../platformStats-types";
import {
  paginateBarChartData,
  getTotalBarChartPages,
  handleBarChartPageChange,
  handleMoviesAndSeriesSortCategory
} from "../../helper_functions";
import { useMediaQuery } from "react-responsive";
import { moviesAndSeriesCategoryDisplayNames } from "../../platformStats-data";
import { Tooltip } from "react-tooltip";
import Pagination from "../../../../components/common/pagination/pagination";

interface MoviesAndSeriesByRatingsComponentProps {
  data: MoviesAndSeriesByRatingsDataType;
}

const MoviesAndSeriesByRatingsComponent: FC<
  MoviesAndSeriesByRatingsComponentProps
> = ({ data }) => {
  const pageSize = 5; // Размер на страницата (брой елементи на страница)
  const [currentChartPage, setCurrentChartPage] = useState(1); // Текущата страница на графиката
  const [moviesAndSeriesSortCategory, setMoviesAndSeriesSortCategory] =
    useState("IMDb"); // Категория за сортиране (IMDb, Metascore, RottenTomatoes)

  // Меморизиране на данните за сериите за графиката на филмите
  const seriesDataForMoviesAndSeriesByRatingsChart = useMemo(() => {
    const sortedData =
      moviesAndSeriesSortCategory === "IMDb"
        ? data.sortedMoviesAndSeriesByIMDbRating // Ако е избрана IMDb, използвай IMDb рейтинги
        : moviesAndSeriesSortCategory === "Metascore"
        ? data.sortedMoviesAndSeriesByMetascore // Ако е избран Metascore, използвай Metascore
        : data.sortedMoviesAndSeriesByRottenTomatoesRating; // Ако е избран RottenTomatoes, използвай Rotten Tomatoes рейтинг

    // Връщаме данни с пагинация
    return paginateBarChartData(
      sortedData,
      currentChartPage,
      pageSize,
      moviesAndSeriesSortCategory
    );
  }, [currentChartPage, moviesAndSeriesSortCategory, data]);

  // Меморизиране на общия брой страници на графиката
  const totalChartPages = useMemo(() => {
    return getTotalBarChartPages(
      data.sortedMoviesAndSeriesByIMDbRating.length, // Използваме дължината на IMDb рейтингите
      pageSize
    );
  }, [data.sortedMoviesAndSeriesByIMDbRating.length, pageSize]);

  // Обработчици за пагинация (предишна и следваща страница)
  const handlePrevChartPage = () => {
    handleBarChartPageChange(
      "prev", // Преминаване на предишната страница
      currentChartPage,
      pageSize,
      data.sortedMoviesAndSeriesByIMDbRating.length,
      setCurrentChartPage
    );
  };

  const handleNextChartPage = () => {
    handleBarChartPageChange(
      "next", // Преминаване на следващата страница
      currentChartPage,
      pageSize,
      data.sortedMoviesAndSeriesByIMDbRating.length,
      setCurrentChartPage
    );
  };

  // Отзивчиви точки за прекъсване
  const is1461 = useMediaQuery({ query: "(max-width: 1461px)" });
  const is1546 = useMediaQuery({ query: "(max-width: 1546px)" });
  const is1675 = useMediaQuery({ query: "(max-width: 1675px)" });

  return (
    <Fragment>
      <div className="xl:col-span-6 col-span-12">
        <div className="box custom-box">
          <div className="custom-box-header justify-between">
            <div
              className={`box-title whitespace-nowrap overflow-hidden text-ellipsis !font-Opsilon !font-light !tracking-wide`}
              data-tooltip-id="box-title-tooltip"
              data-tooltip-content={`Филми и сериали по ${
                moviesAndSeriesCategoryDisplayNames[
                  moviesAndSeriesSortCategory as keyof typeof moviesAndSeriesCategoryDisplayNames
                ]
              }`}
              style={{
                maxWidth:
                  window.innerWidth < 1400
                    ? "100%"
                    : is1675
                    ? is1461
                      ? "200px"
                      : "250px"
                    : "100%"
              }}
            >
              {`Филми и сериали по ${
                moviesAndSeriesCategoryDisplayNames[
                  moviesAndSeriesSortCategory as keyof typeof moviesAndSeriesCategoryDisplayNames
                ]
              }`}
            </div>
            <Tooltip id="box-title-tooltip" />

            <div className="flex flex-wrap gap-2">
              <div
                className="inline-flex rounded-md shadow-sm"
                role="group"
                aria-label="Sort By"
              >
                {["IMDb", "Metascore", "RottenTomatoes"].map(
                  (category, index) => (
                    <button
                      key={category}
                      type="button"
                      className={`ti-btn-group !border-0 !text-xs !py-2 !px-3 ${
                        category === moviesAndSeriesSortCategory
                          ? "ti-btn-primary-full text-white"
                          : "text-[#E74581] dark:text-[#CC3333] bg-[#AF0B48] dark:bg-[#9A110A] bg-opacity-10 dark:bg-opacity-10"
                      } ${
                        index === 0
                          ? "rounded-l-md"
                          : index === 2
                          ? "rounded-r-md"
                          : ""
                      }`}
                      onClick={() =>
                        handleMoviesAndSeriesSortCategory(
                          category,
                          setMoviesAndSeriesSortCategory
                        )
                      }
                    >
                      {
                        moviesAndSeriesCategoryDisplayNames[
                          category as keyof typeof moviesAndSeriesCategoryDisplayNames
                        ]
                      }
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="box-body h-[21.75rem]">
            <div id="bar-basic">
              <MoviesAndSeriesByRatingsChart
                seriesData={seriesDataForMoviesAndSeriesByRatingsChart}
                category={moviesAndSeriesSortCategory}
              />
            </div>
          </div>
          <div className="box-footer">
            <Pagination
              currentPage={currentChartPage}
              totalItems={data.sortedMoviesAndSeriesByIMDbRating.length}
              itemsPerPage={5}
              totalTablePages={totalChartPages}
              isSmallScreen={is1546}
              handlePrevPage={handlePrevChartPage}
              handleNextPage={handleNextChartPage}
              setCurrentPage={setCurrentChartPage}
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default MoviesAndSeriesByRatingsComponent;

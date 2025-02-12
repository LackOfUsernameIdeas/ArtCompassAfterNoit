import { FC, Fragment, useMemo, useState } from "react";
import { MoviesAndSeriesByRatingsChart } from "../../charts";
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
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";

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
  const is1546 = useMediaQuery({ query: "(max-width: 1546px)" });

  return (
    <Fragment>
      <div className="xl:col-span-6 col-span-12">
        <div className="flex flex-col md:flex-row gap-8 box p-6 rounded-lg shadow-lg dark:text-gray-300 text-[#333335] justify-center items-center">
          {/* Лява част */}
          <Card className="bg-white dark:bg-bodybg2/50 dark:border-black/10 dark:text-defaulttextcolor/70 font-semibold text-xl p-4 rounded-md shadow-lg dark:shadow-xl text-center leading-relaxed md:w-1/2 mx-auto">
            <h2 className="text-2xl opsilion text-defaulttextcolor dark:text-white/80">
              В тази страница можете да видите класация на филмите и сериалите
              по техния добавените от вас книги в{" "}
              <span className="font-bold text-primary">
                IMDb, Rotten Tomatoes или Метаскор рейтинг{" "}
              </span>
              !
            </h2>
          </Card>
          {/* Дясна част*/}
          <div className="md:w-1/2 text-sm]">
            <Accordion type="single" collapsible className="space-y-4">
              {/* IMDb */}
              <AccordionItem value="imdb">
                <AccordionTrigger className="opsilion">
                  🎬 IMDb рейтинг
                </AccordionTrigger>
                <AccordionContent className="pl-4">
                  Средна оценка, която даден филм получава от потребителите на
                  <span className="font-semibold"> IMDb</span>. Оценките варират
                  от <span className="font-semibold">1 до 10</span> и отразяват
                  популярността и качеството на филма.
                </AccordionContent>
              </AccordionItem>

              {/* Rotten tomatoes */}
              <AccordionItem value="rotten">
                <AccordionTrigger className="opsilion">
                  🍅 Среден Rotten Tomatoes рейтинг
                </AccordionTrigger>
                <AccordionContent className="pl-4">
                  <span className="font-semibold">Rotten Tomatoes</span> е
                  платформа, показваща процента на положителните рецензии от
                  критици <span className="font-semibold"> (Tomatometer)</span>{" "}
                  или от зрители
                  <span className="font-semibold"> (Audience Score)</span>.
                  Средният рейтинг е средната оценка{" "}
                  <span className="font-semibold"> (от 0 до 10)</span> на всички
                  ревюта, вместо просто процента на положителните рецензии.
                </AccordionContent>
              </AccordionItem>

              {/* Rotten tomatoes */}
              <AccordionItem value="metascore">
                <AccordionTrigger className="opsilion">
                  💡 Среден Metascore рейтинг
                </AccordionTrigger>
                <AccordionContent className="pl-4">
                  <span className="font-semibold">Metascore</span> е оценка от
                  платформата <span className="font-semibold">Metacritic</span>,
                  която събира рецензии от критици и ги преобразува в обща
                  числова стойност{" "}
                  <span className="font-semibold">(от 0 до 100)</span>.{" "}
                  <span className="font-semibold">
                    Средният Metascore рейтинг
                  </span>{" "}
                  е усреднената стойност на тези оценки за даден/и филм/и.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
        <div className="box custom-box">
          <div className="custom-box-header justify-between">
            <div className={`box-title opsilion`}>
              {`Филми и сериали по ${
                moviesAndSeriesCategoryDisplayNames[
                  moviesAndSeriesSortCategory as keyof typeof moviesAndSeriesCategoryDisplayNames
                ]
              }`}
            </div>

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
                      className={`ti-btn-group !border-0 !text-xs !py-2 !px-3 opsilion ${
                        category === moviesAndSeriesSortCategory
                          ? "ti-btn-primary-full text-white"
                          : "text-[#CC3333] dark:text-[#E74581] bg-[#9A110A] dark:bg-[#AF0B48] bg-opacity-10 dark:bg-opacity-10"
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

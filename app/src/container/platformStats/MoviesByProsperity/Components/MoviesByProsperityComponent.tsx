import { FC, Fragment } from "react";
import { MoviesByProsperityDataType } from "../../platformStats-types";
import { MoviesByProsperityBubbleChart } from "../../charts";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from "@/components/ui/accordion";

interface MoviesByProsperityComponentProps {
  data: MoviesByProsperityDataType;
}

const MoviesByProsperityComponent: FC<MoviesByProsperityComponentProps> = ({
  data
}) => {
  return (
    <Fragment>
      <div className="xl:col-span-6 col-span-12">
        <div className="flex flex-col md:flex-row gap-8 bg-gray-800 p-6 rounded-lg shadow-lg">
          {/* Left Section */}
          <div className="md:w-1/2 text-center text-sm text-gray-300">
            <p>
              Тук може да видите най-успешните филми според{" "}
              <strong className="text-red-400">IMDb рейтинг</strong> и приходи
              от <strong className="text-red-400">боксофиса</strong>.
            </p>
            <p>
              Филмите са разпределени по жанрове, като всеки жанр е отбелязан с{" "}
              <strong className="text-red-300">различен цвят</strong>.
            </p>
            <p>
              <strong className="text-yellow-300">Оста X</strong> представя
              приходите от боксофиса в милиони долари.
            </p>
            <p>
              <strong className="text-yellow-300">Оста Y</strong> представя
              рейтинга в IMDb.
            </p>
            <p>Големината на кръговете отразява просперитета на филма.</p>
          </div>

          {/* Right Section - Accordion */}
          <div className="md:w-1/2 text-sm text-gray-300">
            <Accordion type="single" collapsible className="space-y-4">
              {/* IMDb Accordion */}
              <AccordionItem value="imdb">
                <AccordionTrigger>🎬 IMDb рейтинг</AccordionTrigger>
                <AccordionContent>
                  Средна оценка, която даден филм получава от потребителите на
                  IMDb. Оценките варират от{" "}
                  <span className="font-semibold text-red-300">1 до 10</span> и
                  отразяват популярността и качеството на филма.
                </AccordionContent>
              </AccordionItem>

              {/* Box Office Accordion */}
              <AccordionItem value="boxoffice">
                <AccordionTrigger>💰 Боксофис</AccordionTrigger>
                <AccordionContent>
                  Общата сума на приходите от продажба на билети в киносалоните.
                  Обикновено се измерва в{" "}
                  <span className="font-semibold text-red-300">
                    милиони или милиарди долари
                  </span>{" "}
                  и е ключов показател за търговския успех на филма.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Bubble Chart Box */}
        <div className="box custom-box h-[27.75rem] mt-6">
          <div className="box-header">
            <div className="box-title opsilion">
              Най-успешни филми по Просперитет, IMDb Рейтинг и Боксофис
            </div>
          </div>
          <div className="box-body">
            <div id="bubble-simple">
              <MoviesByProsperityBubbleChart
                sortedMoviesByProsperity={data.sortedMoviesByProsperity}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default MoviesByProsperityComponent;

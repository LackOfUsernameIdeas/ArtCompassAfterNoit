import { FC, useState } from "react";
import { MetricChartsProps } from "../aiAnalysator-types";
import { AverageMetricsTrend } from "./Charts";
import { Card } from "@/components/ui/card";
import { InfoboxModal } from "@/components/common/infobox/InfoboxModal";
import Infobox from "@/components/common/infobox/infobox";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from "@/components/ui/accordion";

const MetricCharts: FC<MetricChartsProps> = ({
  historicalMetrics,
  historicalUserMetrics
}) => {
  // State за отваряне/затваряне на InfoBox
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  console.log(historicalMetrics, historicalUserMetrics);
  const handleInfoButtonClick = () => {
    setIsModalOpen((prev) => !prev);
  };
  return (
    <div>
      <div className="bg-bodybg p-6 rounded-xl shadow-lg space-y-4 my-4">
        <Card className="flex flex-col items-center text-center gap-4 bg-white dark:bg-bodybg2/50 dark:border-black/10 dark:text-defaulttextcolor/70 font-semibold text-xl p-4 rounded-md shadow-lg dark:shadow-xl mx-auto">
          <h2 className="text-3xl opsilion text-defaulttextcolor dark:text-white/80">
            Средни стойности на precision, recall и f1 score през времето
          </h2>
          <div className="flex justify-center w-full">
            <Infobox onClick={handleInfoButtonClick} />
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-bodybg2 dark:text-white/80 p-6 rounded-lg shadow-md">
            <AverageMetricsTrend seriesData={historicalMetrics ?? []} />
          </div>
          <div className="bg-white dark:bg-bodybg2 dark:text-white/80 p-6 rounded-lg shadow-md">
            <AverageMetricsTrend seriesData={historicalUserMetrics ?? []} />
          </div>
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
    </div>
  );
};

export default MetricCharts;

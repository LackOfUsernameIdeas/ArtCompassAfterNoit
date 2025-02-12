import { FC, useEffect, useState, useCallback } from "react";
import AIAnalysisDashboard from "./Components/AIAnalysisDashboard";
import {
  F1ScoreData,
  PrecisionData,
  RecallData,
  RecommendationsAnalysis
} from "./aiAnalysator-types";
import RecommendationsAnalysesWidgets from "@/components/common/recommendationsAnalyses/recommendationsAnalyses";
import { Card } from "@/components/ui/card";
import FadeInWrapper from "@/components/common/loader/fadeinwrapper";
import {
  checkRelevanceForLastSavedRecommendations,
  getF1Score,
  getPrecisionTotal,
  getRecallTotal
} from "./helper_functions";
import { analyzeRecommendations } from "../helper_functions_common";
import ErrorCard from "@/components/common/error/error";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from "@/components/ui/accordion";

const AIAnalysator: FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inTransition, setInTransition] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [precisionData, setPrecisionData] = useState<PrecisionData | null>(
    null
  );
  const [recallData, setRecallData] = useState<RecallData | null>(null);
  const [f1ScoreData, setF1ScoreData] = useState<F1ScoreData | null>(null);
  const [recommendationsAnalysis, setRecommendationsAnalysis] =
    useState<RecommendationsAnalysis>({
      relevantCount: 0,
      totalCount: 0,
      precisionValue: 0,
      precisionPercentage: 0,
      relevantRecommendations: []
    });
  const [showError, setShowError] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");
      if (!token) return;

      try {
        const lastSavedRecommendationsAndPreferences =
          await checkRelevanceForLastSavedRecommendations(token);

        const {
          lastSavedRecommendations,
          relevanceResults,
          lastSavedUserPreferences
        } = lastSavedRecommendationsAndPreferences;

        if (
          lastSavedRecommendations.length > 0 &&
          relevanceResults.length > 0 &&
          lastSavedUserPreferences
        ) {
          const [precisionObject, recallObject] = await Promise.all([
            getPrecisionTotal(
              token,
              lastSavedRecommendationsAndPreferences.lastSavedUserPreferences!
            ),
            getRecallTotal(
              token,
              lastSavedRecommendationsAndPreferences.lastSavedUserPreferences!
            )
          ]);

          const f1ScoreObject = await getF1Score(
            precisionObject.precision_exact,
            recallObject.recall_exact
          );

          setPrecisionData(precisionObject);
          setRecallData(recallObject);
          setF1ScoreData(f1ScoreObject);

          // Extract user preferences and recommendations
          const {
            lastSavedUserPreferences,
            lastSavedRecommendations,
            relevanceResults
          } = lastSavedRecommendationsAndPreferences;

          if (relevanceResults) {
            await analyzeRecommendations(
              lastSavedUserPreferences,
              lastSavedRecommendations,
              setRecommendationsAnalysis,
              false
            );
          }
        } else {
          setShowError(true);
        }
      } catch (error) {
        console.error("Error fetching AI analysis data:", error);
      }
    };

    fetchData();
  }, []);

  const handleNext = useCallback(() => {
    setDirection("right");
    setInTransition(true);

    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        recommendationsAnalysis?.relevantRecommendations.length
          ? (prevIndex + 1) %
            recommendationsAnalysis.relevantRecommendations.length
          : 0
      );
      setInTransition(false);
    }, 500);
  }, [recommendationsAnalysis]);

  const handlePrev = useCallback(() => {
    setDirection("left");
    setInTransition(true);

    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        recommendationsAnalysis?.relevantRecommendations.length
          ? (prevIndex -
              1 +
              recommendationsAnalysis.relevantRecommendations.length) %
            recommendationsAnalysis.relevantRecommendations.length
          : 0
      );
      setInTransition(false);
    }, 500);
  }, [recommendationsAnalysis]);

  // Показване на съдържание само след като е дошъл отговорът от заявките
  const renderRecommendationsAnalysis =
    recommendationsAnalysis.relevantRecommendations.length > 0;

  return (
    <FadeInWrapper>
      {!showError ? (
        <div className="p-[1.5rem]">
          <div className="z-10 max-w-6xl w-full mx-auto font-mono text-sm">
            <div className="text-center !text-lg box p-6 flex flex-col gap-6 !rounded-xl justify-center items-center">
              <Card className="bg-white dark:bg-bodybg2/50 dark:border-black/10 dark:text-defaulttextcolor/70 font-semibold text-xl p-4 rounded-md shadow-lg dark:shadow-xl text-center leading-relaxed mx-auto">
                <h2 className="text-4xl opsilion text-defaulttextcolor dark:text-white/80">
                  Искате ли да знаете колко добре се е справил AI-ът с
                  генерирането на препоръки специално за Вас?
                </h2>
              </Card>
              <Card className="bg-white dark:bg-bodybg2/50 dark:border-black/10 dark:text-defaulttextcolor/70 font-semibold text-xl p-4 w-full rounded-md shadow-lg dark:shadow-xl text-center leading-relaxed mx-auto">
                <h2 className="text-xl text-defaulttextcolor dark:text-white/80">
                  За целта е препоръчително първо да се запознаете със следните
                  понятия:
                </h2>
              </Card>
              <div className="text-sm w-full">
                <Accordion type="single" collapsible className="space-y-4">
                  {/* Metascore */}
                  <AccordionItem value="metascore">
                    <AccordionTrigger className="opsilion">
                      💡Metascore рейтинг
                    </AccordionTrigger>
                    <AccordionContent className="pl-4">
                      <span className="font-semibold">Metascore</span> е оценка
                      от платформата{" "}
                      <span className="font-semibold">Metacritic</span>, която
                      събира рецензии от критици и ги преобразува в обща числова
                      стойност{" "}
                      <span className="font-semibold">(от 0 до 100)</span>.{" "}
                      <span className="font-semibold">
                        Средният Metascore рейтинг
                      </span>{" "}
                      е усреднената стойност на тези оценки за даден/и филм/и.
                    </AccordionContent>
                  </AccordionItem>

                  {/* Боксофис */}
                  <AccordionItem value="boxoffice">
                    <AccordionTrigger className="opsilion">
                      💰 Боксофис
                    </AccordionTrigger>
                    <AccordionContent className="pl-4">
                      Общата сума на приходите от продажба на билети в
                      киносалоните. Измерва се в{" "}
                      <span className="font-semibold">
                        милиони или милиарди долари
                      </span>{" "}
                      и е ключов показател за търговския успех на филма.
                    </AccordionContent>
                  </AccordionItem>

                  {/* Просперитет */}
                  <AccordionItem value="prosperity">
                    <AccordionTrigger className="opsilion">
                      🎉 Просперитетен рейтинг
                    </AccordionTrigger>
                    <AccordionContent className="px-5 py-3 space-y-3">
                      <p>
                        <strong className="text-lg">Просперитетът </strong>
                        се получава като се изчисли сборът на стойностите на
                        няколко критерии. За всеки критерий се задава определено
                        процентно отношение, което отразява неговата важност
                        спрямо останалите:
                      </p>
                      <ul className="list-disc coollist pl-6 pt-3 space-y-1">
                        <li>
                          <strong>30%</strong> за спечелени награди
                        </li>
                        <li>
                          <strong>25%</strong> за номинации
                        </li>
                        <li>
                          <strong>15%</strong> за приходите от боксофис
                        </li>
                        <li>
                          <strong>10%</strong> за Метаскор
                        </li>
                        <li>
                          <strong>10%</strong> за IMDb рейтинг
                        </li>
                        <li>
                          <strong>10%</strong> за Rotten Tomatoes рейтинг
                        </li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>

            {precisionData && recallData && f1ScoreData && (
              <AIAnalysisDashboard
                precisionData={precisionData}
                recallData={recallData}
                f1ScoreData={f1ScoreData}
              />
            )}
            {renderRecommendationsAnalysis && (
              <RecommendationsAnalysesWidgets
                recommendationsAnalysis={recommendationsAnalysis}
                currentIndex={currentIndex}
                handlePrev={handlePrev}
                handleNext={handleNext}
                inTransition={inTransition}
                setInTransition={setInTransition}
                direction={direction}
              />
            )}
          </div>
        </div>
      ) : (
        <ErrorCard
          message="🔍 За да можете да разгледате колко добре се е справил AI-ът с
                генерирането на препоръки за вас, моля, първо генерирайте препоръки за филми и сериали."
        />
      )}
    </FadeInWrapper>
  );
};

export default AIAnalysator;

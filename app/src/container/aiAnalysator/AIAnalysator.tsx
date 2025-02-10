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
          <div className="z-10 max-w-5xl w-full mx-auto font-mono text-sm">
            <Card className="dark:border-black/10 bg-bodybg font-semibold text-xl p-4 rounded-lg shadow-lg dark:shadow-xl text-center">
              <h2 className="!text-3xl text-defaulttextcolor dark:text-white/80">
                Искате ли да знаете колко добре се е справил AI-ът с
                генерирането на препоръки за филми и сериали?
              </h2>
              <hr className="my-4 border-defaulttextcolor/70" />
              <p className="text-gray-600 !text-lg">
                Примерно описание...Ако намерите някакъв проблем в нашето
                приложение или имате препоръки, напишете ни и ние ще отговорим
                възможно най-бързо!
              </p>
            </Card>
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

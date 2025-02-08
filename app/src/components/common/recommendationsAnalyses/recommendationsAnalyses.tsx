import React, { Fragment, useState } from "react";
import { CSSTransition } from "react-transition-group"; // Import CSSTransition
import PrecisionFormula from "../precisionFormula/precisionFormula";
import Collapsible from "../collapsible/collapsible";
import RelevantRecommendations from "../relevantRecommendations/relevantRecommendations";
import Widget from "../widget/widget";
import { Card } from "@/components/ui/card";
import { RecommendationsAnalysesWidgetsProps } from "./recommendationsAnalyses-types";

const RecommendationsAnalysesWidgets: React.FC<
  RecommendationsAnalysesWidgetsProps
> = ({
  recommendationsAnalysis,
  currentIndex,
  handlePrev,
  handleNext,
  isSwitching = true,
  inTransition,
  setInTransition,
  direction
}) => {
  const {
    relevantCount,
    totalCount,
    precisionValue,
    precisionPercentage,
    relevantRecommendations
  } = recommendationsAnalysis;

  return (
    <Fragment>
      <Card className="dark:border-black/10 bg-bodybg font-semibold text-xl p-4 rounded-lg shadow-lg dark:shadow-xl text-center mt-4">
        <h2 className="!text-2xl font-bold">
          Анализ на {isSwitching ? "последно генерираните" : "текущите"}{" "}
          препоръки:
        </h2>
      </Card>
      <CSSTransition
        in={!inTransition} // Активиране на анимацията, когато 'inTransition' е false
        timeout={500} // Задаване на времето за анимация (например 500ms)
        classNames={`slide-${direction}`} // Определяне на посоката на анимацията въз основа на 'isSwitching'
        onExited={() => setInTransition(false)} // Нулиране на състоянието след като анимацията приключи
        unmountOnExit // Премахване на компонента, когато анимацията завърши
      >
        <div className="bg-bodybg mt-4 p-6 rounded-xl shadow-lg space-y-6">
          <div className="relative w-full">
            {isSwitching && (
              <svg
                onClick={handlePrev}
                className="absolute top-1/2 transform -translate-y-1/2 left-[-7rem] text-6xl cursor-pointer hover:text-primary hover:scale-110 transition duration-200"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  width: "5rem",
                  height: "5rem",
                  filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.3))"
                }}
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            )}

            <RelevantRecommendations
              relevantRecommendations={relevantRecommendations}
              currentIndex={currentIndex}
              title_en={relevantRecommendations[currentIndex].title_en}
              title_bg={relevantRecommendations[currentIndex].title_bg}
            />

            {isSwitching && (
              <svg
                onClick={handleNext}
                className="absolute top-1/2 transform -translate-y-1/2 right-[-7rem] text-6xl cursor-pointer hover:text-primary hover:scale-110 transition duration-200"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  width: "5rem",
                  height: "5rem",
                  filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.3))"
                }}
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            )}
          </div>
        </div>
      </CSSTransition>

      <div className="bg-bodybg mt-4 p-6 rounded-xl shadow-lg space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Widget
            icon={<i className="ti ti-checklist text-3xl"></i>}
            title="Брой релевантни неща"
            value={relevantCount}
          />
          <Widget
            icon={<i className="ti ti-list text-3xl"></i>}
            title="Общ брой препоръки"
            value={totalCount}
          />
          <Widget
            icon={<i className="ti ti-percentage text-3xl"></i>}
            title="Precision в процент"
            value={`${precisionPercentage}%`}
          />
          <Widget
            icon={<i className="ti ti-star text-3xl"></i>}
            title="Средна релевантност"
            value={(
              relevantRecommendations.reduce(
                (acc, rec) => acc + rec.relevanceScore,
                0
              ) / relevantRecommendations.length
            ).toFixed(2)}
          />
        </div>
        <Collapsible
          title={
            <div className="flex items-center">
              <i className="ti ti-math-function text-2xl mr-2"></i>
              Формула за изчисление на Precision
            </div>
          }
        >
          <PrecisionFormula
            relevantCount={relevantCount}
            totalCount={totalCount}
            precisionValue={precisionValue}
            precisionPercentage={precisionPercentage}
          />
        </Collapsible>
      </div>
    </Fragment>
  );
};

export default RecommendationsAnalysesWidgets;

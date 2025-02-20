import React from "react";
import { Link } from "react-router-dom";
import { DataType } from "../landing-types";

// Дефиниране на типа за пропсвете, предавани на този компонент
interface AIStatsWidgetCardProps {
  data: DataType;
}

const AIStatsWidgetCardsComponent: React.FC<AIStatsWidgetCardProps> = ({
  data
}) => {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="lg:col-span-3 md:col-span-6 sm:col-span-6 col-span-12">
        <div className="box feature-style flex flex-col h-full">
          <div className="box-body flex flex-col flex-grow">
            <Link aria-label="anchor" to="#" className="stretched-link"></Link>
            <div className="feature-style-icon bg-primary/10">
              <i className="ti ti-percentage-60 text-3xl text-primary"></i>
            </div>
            <h5 className=" font-semibold text-default text-[1.25rem]">
              Среден Precision
            </h5>
            <p className="text-[#8c9097] dark:text-white/50 mb-4">
              Средна стойност спрямо всички потребители (отнася се за последно
              генерираните от тях препоръки)
            </p>
            <div className="flex-grow">
              <p className="text-2xl font-bold">{`${data.averagePrecisionLastRoundPercentage}%`}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:col-span-3 md:col-span-6 sm:col-span-6 col-span-12">
        <div className="box feature-style flex flex-col h-full">
          <div className="box-body flex flex-col flex-grow">
            <Link aria-label="anchor" to="#" className="stretched-link"></Link>
            <div className="feature-style-icon bg-primary/10">
              <i className="ti ti-percentage-60 text-3xl text-primary"></i>
            </div>
            <h5 className=" font-semibold text-default text-[1.25rem]">
              Среден Precision
            </h5>
            <p className="text-[#8c9097] dark:text-white/50 mb-4">
              Средна стойност спрямо всички потребители (отнася се за всички
              препоръки в платформата - като цяло)
            </p>
            <div className="flex-grow">
              <p className="text-2xl font-bold">{`${data.averagePrecisionPercentage}%`}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:col-span-3 md:col-span-6 sm:col-span-6 col-span-12">
        <div className="box feature-style flex flex-col h-full">
          <div className="box-body flex flex-col flex-grow">
            <Link aria-label="anchor" to="#" className="stretched-link"></Link>
            <div className="feature-style-icon bg-primary/10">
              <i className="ti ti-percentage-40 text-3xl text-primary"></i>
            </div>
            <h5 className=" font-semibold text-default text-[1.25rem]">
              Среден Recall
            </h5>
            <p className="text-[#8c9097] dark:text-white/50 mb-4">
              Средна стойност спрямо всички потребители (отнася се за всички
              препоръки в платформата - като цяло)
            </p>
            <div className="flex-grow">
              <p className="text-2xl font-bold">{`${data.averageRecallPercentage}%`}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:col-span-3 md:col-span-6 sm:col-span-6 col-span-12">
        <div className="box feature-style flex flex-col h-full">
          <div className="box-body flex flex-col flex-grow">
            <Link aria-label="anchor" to="#" className="stretched-link"></Link>
            <div className="feature-style-icon bg-primary/10">
              <i className="ti ti-percentage-70 text-3xl text-primary"></i>
            </div>
            <h5 className=" font-semibold text-default text-[1.25rem]">
              Среден F1 Score
            </h5>
            <p className="text-[#8c9097] dark:text-white/50 mb-4">
              Средна стойност спрямо всички потребители (отнася се за всички
              препоръки в платформата - като цяло)
            </p>
            <div className="flex-grow">
              <p className="text-2xl font-bold">{`${data.averageF1ScorePercentage}%`}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIStatsWidgetCardsComponent;

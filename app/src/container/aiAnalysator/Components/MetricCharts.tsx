import { FC } from "react";
import { MetricChartsProps } from "../aiAnalysator-types";
import { AverageMetricsTrend } from "./Charts";

const MetricCharts: FC<MetricChartsProps> = ({
  historicalMetrics,
  historicalUserMetrics
}) => {
  console.log(historicalMetrics, historicalUserMetrics);
  return (
    <div className="bg-bodybg p-6 rounded-xl shadow-lg space-y-4 my-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-bodybg2 dark:text-white/80 p-6 rounded-lg shadow-md">
          <AverageMetricsTrend seriesData={historicalMetrics ?? []} />
        </div>
        <div className="bg-white dark:bg-bodybg2 dark:text-white/80 p-6 rounded-lg shadow-md">
          <AverageMetricsTrend seriesData={historicalUserMetrics ?? []} />
        </div>
      </div>
    </div>
  );
};

export default MetricCharts;

import { GenrePopularityOverTime } from "./charts";

export default function MetricCharts() {
  return (
    <div className="bg-bodybg p-6 rounded-xl shadow-lg space-y-4 my-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-bodybg2 dark:text-white/80 p-6 rounded-lg shadow-md">
          <GenrePopularityOverTime />
        </div>
        <div className="bg-white dark:bg-bodybg2 dark:text-white/80 p-6 rounded-lg shadow-md">
          <p className="text-center text-lg font-semibold">Chart 2</p>
        </div>
      </div>
    </div>
  );
}

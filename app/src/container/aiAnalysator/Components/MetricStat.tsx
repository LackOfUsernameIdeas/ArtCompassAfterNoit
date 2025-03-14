interface MetricStatProps {
  label: string;
  value: number | undefined;
  total?: number;
  tooltipText?: string;
}

const MetricStat = ({ label, value, total }: MetricStatProps) => {
  const percentage = total && value !== undefined ? (value / total) * 100 : 0;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <div className="flex items-center text-defaulttextcolor dark:text-white/80 gap-1 text-sm">
          <span>{label}</span>
        </div>
        <span className="font-medium text-sm">
          {value !== undefined ? value : "N/A"}
          {total && ` / ${total}`}
        </span>
      </div>
      {total && (
        <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default MetricStat;

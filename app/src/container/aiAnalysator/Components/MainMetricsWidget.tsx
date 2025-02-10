import { FC } from "react";
import { Progress } from "@/components/ui/progress";

const MainMetricsWidget: FC<{
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
  progress: number;
}> = ({ icon, title, value, description, progress }) => (
  <div className="bg-white dark:bg-bodybg2 dark:text-defaulttextcolor/70 p-4 rounded-lg transition-all duration-300 hover:shadow-md flex flex-col h-full hover:shadow-md dark:hover:shadow-primary">
    <div className="flex items-center mb-2">
      {icon}
      <h3 className="ml-2 text-sm font-semibold">{title}</h3>
    </div>
    <div className="flex-grow">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </div>
    <div className="mt-auto">
      <Progress value={progress} />
    </div>
  </div>
);

export default MainMetricsWidget;

import { FC, ReactNode } from "react";

const Widget: FC<{
  icon: ReactNode;
  title: string;
  value: string | number;
  className?: string;
}> = ({ icon, title, value, className }) => (
  <div
    className={`bg-white dark:bg-bodybg2 dark:text-white/80 p-4 rounded-lg transition-all duration-300 hover:shadow-md dark:hover:shadow-primary flex flex-col justify-between ${className}`}
  >
    <div className="flex items-center mb-2">
      {icon}
      <h3 className="ml-2 text-base opsilion font-semibold">{title}</h3>
    </div>
    <div className="flex-grow" />
    <p className="text-2xl font-bold text-left">{value}</p>
  </div>
);

export default Widget;

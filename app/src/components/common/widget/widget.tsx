import { FC, ReactNode } from "react";

const Widget: FC<{
  icon: ReactNode;
  title: string;
  value: string | number;
}> = ({ icon, title, value }) => (
  <div className="bg-white dark:bg-bodybg2 dark:text-defaulttextcolor/70 p-4 rounded-lg transition-all duration-300 hover:shadow-md dark:hover:shadow-primary">
    <div className="flex items-center mb-2">
      {icon}
      <h3 className="ml-2 text-sm font-semibold">{title}</h3>
    </div>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

export default Widget;

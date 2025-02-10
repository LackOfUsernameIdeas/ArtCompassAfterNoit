import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FC } from "react";
import { MetricCardProps } from "../aiAnalysator-types";

export const MetricCard: FC<MetricCardProps> = ({
  title,
  value,
  description,
  progress
}) => (
  <Card className="h-full flex flex-col">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        className="h-4 w-4 text-muted-foreground"
      >
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    </CardHeader>
    <CardContent className="flex flex-col flex-grow">
      <div className="flex-grow">
        <div className="text-2xl font-bold">{value}%</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Progress value={progress} className="mt-2" />
    </CardContent>
  </Card>
);

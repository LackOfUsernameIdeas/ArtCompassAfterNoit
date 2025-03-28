import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FC } from "react";
import { StatisticCardProps } from "../aiAnalysator-types";

export const StatisticCard: FC<StatisticCardProps> = ({ title, value }) => (
  <Card className="h-full flex flex-col">
    <CardHeader>
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
    </CardHeader>
    <CardContent className="flex-grow flex items-end">
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

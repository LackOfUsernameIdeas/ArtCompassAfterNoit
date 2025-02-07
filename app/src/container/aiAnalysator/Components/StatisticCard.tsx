import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FC } from "react";
import { StatisticCardProps } from "../AIAnalysator-types";

export const StatisticCard: FC<StatisticCardProps> = ({ title, value }) => (
  <Card className="h-full flex flex-col justify-between">
    <CardHeader>
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

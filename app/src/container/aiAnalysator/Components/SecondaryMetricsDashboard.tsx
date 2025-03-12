"use client";

import { useState } from "react";
import { ChevronRight, ChevronLeft, BarChart3, CircleHelp } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Sample data structure based on the provided JSON
interface MetricData {
  // Primary metrics
  fpr_exact?: number;
  fpr_fixed?: number;
  fpr_percentage?: number;
  fnr_exact?: number;
  fnr_fixed?: number;
  fnr_percentage?: number;
  accuracy_exact?: number;
  accuracy_fixed?: number;
  accuracy_percentage?: number;
  specificity_exact?: number;
  specificity_fixed?: number;
  specificity_percentage?: number;

  // Secondary metrics
  irrelevant_user_recommendations_count?: number;
  user_recommendations_count?: number;
  irrelevant_platform_recommendations_count?: number;
  total_platform_recommendations_count?: number;
  relevant_non_given_recommendations_count?: number;
  relevant_user_recommendations_count?: number;
  relevant_platform_recommendations_count?: number;
  irrelevant_non_given_recommendations_count?: number;
  non_given_recommendations_count?: number;
}

// Sample data based on the provided JSON
const sampleData: MetricData[] = [
  {
    fpr_exact: 0.25,
    fpr_fixed: 0.25,
    fpr_percentage: 25,
    irrelevant_user_recommendations_count: 10,
    user_recommendations_count: 40,
    irrelevant_platform_recommendations_count: 15,
    total_platform_recommendations_count: 100
  },
  {
    fnr_exact: 0.15,
    fnr_fixed: 0.15,
    fnr_percentage: 15,
    relevant_non_given_recommendations_count: 8,
    relevant_user_recommendations_count: 30,
    user_recommendations_count: 40,
    relevant_platform_recommendations_count: 45,
    total_platform_recommendations_count: 100
  },
  {
    specificity_exact: 0.85,
    specificity_fixed: 0.85,
    specificity_percentage: 85,
    irrelevant_non_given_recommendations_count: 50,
    non_given_recommendations_count: 60,
    irrelevant_user_recommendations_count: 10,
    user_recommendations_count: 40,
    irrelevant_platform_recommendations_count: 15,
    total_platform_recommendations_count: 100
  },
  {
    accuracy_exact: 0.8,
    accuracy_fixed: 0.8,
    accuracy_percentage: 80,
    irrelevant_non_given_recommendations_count: 50,
    relevant_non_given_recommendations_count: 8,
    non_given_recommendations_count: 60,
    relevant_user_recommendations_count: 30,
    user_recommendations_count: 40,
    relevant_platform_recommendations_count: 45,
    total_platform_recommendations_count: 100
  }
];

// Define the PrimaryMetricCardProps interface
interface PrimaryMetricCardProps {
  title: string;
  value: number | undefined;
  description: string;
  tooltipText: string;
  onClick: () => void;
  isActive: boolean;
}

// Primary metric card component with theme colors
const PrimaryMetricCard = ({
  title,
  value,
  description,
  tooltipText,
  onClick,
  isActive
}: PrimaryMetricCardProps) => {
  return (
    <div
      className={`rounded-lg p-4 cursor-pointer transition-all h-full bg-white dark:bg-bodybg2 ${
        isActive ? "border-l-4 border-primary shadow-lg" : "hover:shadow-md"
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-2 mb-2">
        <Badge
          variant={isActive ? "default" : "outline"}
          className={`opsilion ${
            isActive
              ? "text-white"
              : "border-defaulttextcolor text-defaulttextcolor"
          }`}
        >
          {title}
        </Badge>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <CircleHelp className="h-4 w-4 text-defaulttextcolor dark:text-white/80" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{tooltipText}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="text-lg opsilion text-defaulttextcolor dark:text-white/80 mb-2">
        {description}
      </div>
      <div
        className={`text-3xl font-bold ${
          isActive ? "text-primary" : "text-defaulttextcolor dark:text-white/80"
        }`}
      >
        {value !== undefined ? `${value}%` : "N/A"}
      </div>
    </div>
  );
};

// Metric stat component
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

export default function DataVisualization() {
  const [activeMetric, setActiveMetric] = useState<string>("fpr");

  const metricConfig = {
    fpr: {
      title: "FPR",
      description: "Процент на фалшиво положителни",
      tooltip:
        "Делът на нерелевантните препоръки сред всички препоръки на потребителя."
    },
    fnr: {
      title: "FNR",
      description: "Процент на фалшиво отрицателни",
      tooltip:
        "Делът на релевантните препоръки, които не са били дадени на потребителя."
    },
    accuracy: {
      title: "Accuracy",
      description: "Обща точност",
      tooltip:
        "Делът на правилните препоръки (както релевантни дадени, така и нерелевантни недадени)."
    },
    specificity: {
      title: "Specificity",
      description: "Процент на истински отрицателни",
      tooltip:
        "Делът на нерелевантните препоръки, които правилно не са били дадени на потребителя."
    }
  };

  return (
    <Card className="w-full bg-bodybg dark:bg-bodybg shadow-none border-0">
      <CardHeader className="py-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-3xl font-bold text-defaulttextcolor dark:text-white/80 flex items-center opsilion">
            Метрики за препоръки
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <CircleHelp className="h-5 w-5 text-defaulttextcolor dark:text-white/80" />
              </TooltipTrigger>
              <TooltipContent side="left">
                <p className="max-w-xs">
                  Ключови показатели за ефективност за оценка на системата за
                  препоръки
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-4 mb-4 gap-4">
          <PrimaryMetricCard
            title={metricConfig.fpr.title}
            value={sampleData[0].fpr_percentage}
            description={metricConfig.fpr.description}
            tooltipText={metricConfig.fpr.tooltip}
            onClick={() => setActiveMetric("fpr")}
            isActive={activeMetric === "fpr"}
          />

          <PrimaryMetricCard
            title={metricConfig.fnr.title}
            value={sampleData[1].fnr_percentage}
            description={metricConfig.fnr.description}
            tooltipText={metricConfig.fnr.tooltip}
            onClick={() => setActiveMetric("fnr")}
            isActive={activeMetric === "fnr"}
          />

          <PrimaryMetricCard
            title={metricConfig.accuracy.title}
            value={sampleData[3].accuracy_percentage}
            description={metricConfig.accuracy.description}
            tooltipText={metricConfig.accuracy.tooltip}
            onClick={() => setActiveMetric("accuracy")}
            isActive={activeMetric === "accuracy"}
          />

          <PrimaryMetricCard
            title={metricConfig.specificity.title}
            value={sampleData[2].specificity_percentage}
            description={metricConfig.specificity.description}
            tooltipText={metricConfig.specificity.tooltip}
            onClick={() => setActiveMetric("specificity")}
            isActive={activeMetric === "specificity"}
          />
        </div>

        {/* Detailed Metrics Section */}
        <div className="rounded-lg p-4 bg-white dark:bg-bodybg2 shadow-md">
          <div className="flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-2">
              <Badge variant="default" className="opsilion text-white">
                {activeMetric === "fpr"
                  ? metricConfig.fpr.title
                  : activeMetric === "fnr"
                  ? metricConfig.fnr.title
                  : activeMetric === "accuracy"
                  ? metricConfig.accuracy.title
                  : metricConfig.specificity.title}
              </Badge>
              <h3 className="opsilion text-defaulttextcolor dark:text-white/80">
                Подробна информация
              </h3>
            </div>
            {/* Component Metrics */}
            <div className="bg-white dark:bg-bodybg2 rounded-md p-4">
              <div className="grid gap-3">
                {activeMetric === "fpr" && (
                  <>
                    <MetricStat
                      label="Общо препоръки на потребителя"
                      value={sampleData[0].user_recommendations_count}
                    />
                    <MetricStat
                      label="Нерелевантни препоръки на потребителя"
                      value={
                        sampleData[0].irrelevant_user_recommendations_count
                      }
                      total={sampleData[0].user_recommendations_count}
                    />
                    <MetricStat
                      label="Нерелевантни препоръки на платформата"
                      value={
                        sampleData[0].irrelevant_platform_recommendations_count
                      }
                      total={sampleData[0].total_platform_recommendations_count}
                    />
                  </>
                )}

                {activeMetric === "fnr" && (
                  <>
                    <MetricStat
                      label="Релевантни недадени препоръки"
                      value={
                        sampleData[1].relevant_non_given_recommendations_count
                      }
                      total={
                        sampleData[1].relevant_platform_recommendations_count
                      }
                    />
                    <MetricStat
                      label="Релевантни препоръки на потребителя"
                      value={sampleData[1].relevant_user_recommendations_count}
                      total={sampleData[1].user_recommendations_count}
                    />
                    <MetricStat
                      label="Релевантни препоръки на платформата"
                      value={
                        sampleData[1].relevant_platform_recommendations_count
                      }
                      total={sampleData[1].total_platform_recommendations_count}
                    />
                  </>
                )}

                {activeMetric === "specificity" && (
                  <>
                    <MetricStat
                      label="Нерелевантни недадени препоръки"
                      value={
                        sampleData[2].irrelevant_non_given_recommendations_count
                      }
                      total={sampleData[2].non_given_recommendations_count}
                    />
                    <MetricStat
                      label="Нерелевантни препоръки на потребителя"
                      value={
                        sampleData[2].irrelevant_user_recommendations_count
                      }
                      total={sampleData[2].user_recommendations_count}
                    />
                    <MetricStat
                      label="Нерелевантни препоръки на платформата"
                      value={
                        sampleData[2].irrelevant_platform_recommendations_count
                      }
                      total={sampleData[2].total_platform_recommendations_count}
                    />
                  </>
                )}

                {activeMetric === "accuracy" && (
                  <>
                    <MetricStat
                      label="Нерелевантни недадени препоръки"
                      value={
                        sampleData[3].irrelevant_non_given_recommendations_count
                      }
                      total={sampleData[3].non_given_recommendations_count}
                    />
                    <MetricStat
                      label="Релевантни недадени препоръки"
                      value={
                        sampleData[3].relevant_non_given_recommendations_count
                      }
                      total={sampleData[3].non_given_recommendations_count}
                    />
                    <MetricStat
                      label="Релевантни препоръки на потребителя"
                      value={sampleData[3].relevant_user_recommendations_count}
                      total={sampleData[3].user_recommendations_count}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

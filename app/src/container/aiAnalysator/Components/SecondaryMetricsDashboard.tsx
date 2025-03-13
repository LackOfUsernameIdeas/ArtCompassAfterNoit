import { useState, useRef, useEffect } from "react";
import { LucideCircleHelp } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MetricFormula } from "./MetricFormula";
import { InfoboxModal } from "@/components/common/infobox/InfoboxModal";
import Infobox from "@/components/common/infobox/infobox";

interface MetricData {
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

const sampleData: MetricData[] = [
  {
    fpr_exact: 0.7724550898203593,
    fpr_fixed: 0.77,
    fpr_percentage: 77.25,
    irrelevant_user_recommendations_count: 258,
    user_recommendations_count: 350,
    irrelevant_platform_recommendations_count: 334,
    total_platform_recommendations_count: 439
  },
  {
    fnr_exact: 0.1238095238095238,
    fnr_fixed: 0.12,
    fnr_percentage: 12.38,
    relevant_non_given_recommendations_count: 13,
    relevant_user_recommendations_count: 92,
    user_recommendations_count: 350,
    relevant_platform_recommendations_count: 105,
    total_platform_recommendations_count: 439
  },
  {
    specificity_exact: 0.2275449101796407,
    specificity_fixed: 0.23,
    specificity_percentage: 22.75,
    irrelevant_non_given_recommendations_count: 76,
    non_given_recommendations_count: 89,
    irrelevant_user_recommendations_count: 258,
    user_recommendations_count: 350,
    irrelevant_platform_recommendations_count: 334,
    total_platform_recommendations_count: 439
  },
  {
    accuracy_exact: 0.3826879271070615,
    accuracy_fixed: 0.38,
    accuracy_percentage: 38.27,
    irrelevant_non_given_recommendations_count: 76,
    relevant_non_given_recommendations_count: 13,
    non_given_recommendations_count: 89,
    relevant_user_recommendations_count: 92,
    user_recommendations_count: 350,
    relevant_platform_recommendations_count: 105,
    total_platform_recommendations_count: 439
  }
];

interface PrimaryMetricCardProps {
  title: string;
  value: number | undefined;
  description: string;
  modalText: string;
  onClick: () => void;
  isActive: boolean;
}

const PrimaryMetricCard = ({
  title,
  value,
  description,
  modalText,
  onClick,
  isActive
}: PrimaryMetricCardProps) => {
  const [opened, setOpened] = useState<boolean>(false);

  const toggle = () => {
    setOpened((prev) => !prev);
  };

  return (
    <>
      <div
        className={`
  rounded-lg p-4 cursor-pointer h-full flex flex-col 
  transition-all duration-200 ease-in-out
  ${
    isActive
      ? "border-l-4 border-primary shadow-lg bg-primary/20 dark:bg-primary/10 scale-[1.05] hover:shadow-xl hover:bg-primary/25 dark:hover:bg-primary/15"
      : "border border-transparent hover:border-primary/30 hover:shadow-md hover:scale-[1.02] hover:bg-primary/15 dark:hover:bg-primary/25 bg-white dark:bg-bodybg2"
  }
`}
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
          <Infobox onClick={toggle} />
        </div>

        <div className="text-lg opsilion text-defaulttextcolor dark:text-white/80 mb-2 flex-grow">
          {description}
        </div>

        <div
          className={`text-3xl font-bold mt-auto ${
            isActive
              ? "text-primary"
              : "text-defaulttextcolor dark:text-white/80"
          }`}
        >
          {value !== undefined ? `${value}%` : "N/A"}
        </div>
      </div>

      <InfoboxModal
        onClick={toggle}
        isModalOpen={opened}
        title={description}
        description={modalText}
      />
    </>
  );
};

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
  const termsCardRef = useRef<HTMLDivElement>(null);
  const [flash, setFlash] = useState(false);

  const handleHelpClick = () => {
    if (termsCardRef.current) {
      termsCardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

      setFlash(true);
      setTimeout(() => setFlash(false), 1000);
    }
  };

  useEffect(() => {
    const handleExternalScroll = () => {
      handleHelpClick();
    };

    window.addEventListener("scrollToTerms", handleExternalScroll);
    return () => {
      window.removeEventListener("scrollToTerms", handleExternalScroll);
    };
  }, []);

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
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-4 mb-4 gap-4">
          <PrimaryMetricCard
            title={metricConfig.fpr.title}
            value={sampleData[0].fpr_percentage}
            description={metricConfig.fpr.description}
            modalText={metricConfig.fpr.tooltip}
            onClick={() => setActiveMetric("fpr")}
            isActive={activeMetric === "fpr"}
          />

          <PrimaryMetricCard
            title={metricConfig.fnr.title}
            value={sampleData[1].fnr_percentage}
            description={metricConfig.fnr.description}
            modalText={metricConfig.fnr.tooltip}
            onClick={() => setActiveMetric("fnr")}
            isActive={activeMetric === "fnr"}
          />

          <PrimaryMetricCard
            title={metricConfig.specificity.title}
            value={sampleData[2].specificity_percentage}
            description={metricConfig.specificity.description}
            modalText={metricConfig.specificity.tooltip}
            onClick={() => setActiveMetric("specificity")}
            isActive={activeMetric === "specificity"}
          />

          <PrimaryMetricCard
            title={metricConfig.accuracy.title}
            value={sampleData[3].accuracy_percentage}
            description={metricConfig.accuracy.description}
            modalText={metricConfig.accuracy.tooltip}
            onClick={() => setActiveMetric("accuracy")}
            isActive={activeMetric === "accuracy"}
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
                    <div className="flex flex-row items-center justify-center gap-3">
                      <MetricFormula
                        formula={
                          <div className="flex flex-row gap-2 items-center">
                            <div>FPR</div>
                            <div> = </div>
                            <div className="flex flex-col items-center">
                              <div className="px-2">FP</div>
                              <div className="border-t border-foreground px-2">
                                FP + TN
                              </div>
                            </div>
                          </div>
                        }
                      />
                      <LucideCircleHelp
                        strokeWidth={3}
                        className={`dark:text-defaulttextcolor/85 cursor-pointer text-bold transition-transform duration-200 hover:scale-110 rounded-full z-10`}
                        onClick={handleHelpClick}
                      />
                    </div>

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
                    <div className="flex flex-row items-center justify-center gap-3">
                      <MetricFormula
                        formula={
                          <div className="flex flex-row gap-2 items-center">
                            <div>FNR</div>
                            <div> = </div>
                            <div className="flex flex-col items-center">
                              <div className="px-2">FN</div>
                              <div className="border-t border-foreground px-2">
                                FN + TP
                              </div>
                            </div>
                          </div>
                        }
                      />
                      <LucideCircleHelp
                        strokeWidth={3}
                        className={`dark:text-defaulttextcolor/85 cursor-pointer text-bold transition-transform duration-200 hover:scale-110 rounded-full z-10`}
                        onClick={handleHelpClick}
                      />
                    </div>

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
                    <div className="flex flex-row items-center justify-center gap-3">
                      <MetricFormula
                        formula={
                          <div className="flex flex-row gap-2 items-center">
                            <div>Specificity</div>
                            <div> = </div>
                            <div className="flex flex-col items-center">
                              <div className="px-2">TN</div>
                              <div className="border-t border-foreground px-2">
                                TN + FP
                              </div>
                            </div>
                          </div>
                        }
                      />
                      <LucideCircleHelp
                        strokeWidth={3}
                        className={`dark:text-defaulttextcolor/85 cursor-pointer text-bold transition-transform duration-200 hover:scale-110 rounded-full z-10`}
                        onClick={handleHelpClick}
                      />
                    </div>

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
                    <div className="flex flex-row items-center justify-center gap-4">
                      <MetricFormula
                        formula={
                          <div className="flex flex-row gap-2 items-center">
                            <div>Accuracy</div>
                            <div> = </div>
                            <div className="flex flex-col items-center">
                              <div className="px-2">TP + TN</div>
                              <div className="border-t border-foreground px-2">
                                TP + TN + FP + FN
                              </div>
                            </div>
                          </div>
                        }
                      />
                      <LucideCircleHelp
                        strokeWidth={3}
                        className={`dark:text-defaulttextcolor/85 cursor-pointer text-bold transition-transform duration-200 hover:scale-110 rounded-full z-10`}
                        onClick={handleHelpClick}
                      />
                    </div>

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

        {/* Legend for metrics terminology */}
        <div
          ref={termsCardRef}
          className={`mt-4 p-5 bg-white dark:bg-bodybg2 rounded-xl shadow-lg ${
            flash ? "animate-flash" : ""
          }`}
        >
          <div className="flex items-center gap-2 mb-4">
            <p className="opsilion text-xl font-bold text-defaulttextcolor dark:text-white/80">
              Термини
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-5 gap-y-3">
            {[
              { label: "TP", description: "Подходящи предложени препоръки" },
              { label: "FP", description: "Неподходящи предложени препоръки" },
              { label: "FN", description: "Подходящи пропуснати препоръки" },
              { label: "TN", description: "Неподходящи пропуснати препоръки" }
            ].map(({ label, description }) => (
              <div key={label} className="flex items-center gap-4">
                <div className="flex pt-1 pl-1 h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary shadow">
                  {label}
                </div>
                <span className="text-[14px] text-defaulttextcolor dark:text-white/80 leading-tight">
                  {description}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

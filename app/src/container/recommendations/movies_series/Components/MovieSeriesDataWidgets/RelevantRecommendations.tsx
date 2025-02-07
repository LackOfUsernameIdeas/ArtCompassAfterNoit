import type React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Check,
  X,
  Film,
  Clock,
  Users,
  Target,
  Smile,
  ListIcon as Category,
  HelpCircle
} from "lucide-react";

interface Recommendation {
  isRelevant: boolean;
  relevanceScore: number;
  criteriaScores: {
    genres: number;
    type: number;
    mood: number;
    timeAvailability: number;
    preferredAge: number;
    targetGroup: number;
  };
}

interface RelevantRecommendationsProps {
  recommendations: Recommendation[];
  currentIndex: number;
  //   onExplanationRequest: () => void
}

const RelevantRecommendations: React.FC<RelevantRecommendationsProps> = ({
  recommendations,
  currentIndex
  //   onExplanationRequest,
}) => {
  const recommendation = recommendations[currentIndex];

  const criteriaIcons = {
    genres: Category,
    type: Film,
    mood: Smile,
    timeAvailability: Clock,
    preferredAge: Users,
    targetGroup: Target
  };

  const criteriaNamesInBulgarian = {
    genres: "Жанрове",
    type: "Тип",
    mood: "Настроение",
    timeAvailability: "Време",
    preferredAge: "Възрастова група",
    targetGroup: "Целева група"
  };

  const getProgressValue = (value: number, isGenre: boolean) => {
    return isGenre ? (value / 2) * 100 : value * 100;
  };

  const onExplanationRequest = () => {};
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Badge
              variant={recommendation.isRelevant ? "success" : "destructive"}
              className="text-xl py-1 px-3 mr-4"
            >
              {recommendation.isRelevant ? (
                <Check className="mr-2 h-5 w-5" />
              ) : (
                <X className="mr-2 h-5 w-5" />
              )}
              {recommendation.isRelevant ? "Релевантен" : "Нерелевантен"}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={onExplanationRequest}
              className="flex items-center"
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Обяснение
            </Button>
          </div>
          <div className="flex items-center">
            <div className="text-2xl font-bold mr-4">
              Релевантност: {recommendation.relevanceScore}/7 т.
            </div>
            <Progress
              value={(recommendation.relevanceScore / 7) * 100}
              className="w-32 h-2"
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(recommendation.criteriaScores).map(([key, value]) => {
            const Icon = criteriaIcons[key as keyof typeof criteriaIcons];
            const isGenre = key === "genres";
            return (
              <Card key={key} className="overflow-hidden">
                <CardContent className="p-3 flex items-center">
                  <Icon className="h-6 w-6 mr-3 text-primary flex-shrink-0" />
                  <div className="flex-grow min-w-0">
                    <div className="font-semibold text-sm mb-1 truncate">
                      {
                        criteriaNamesInBulgarian[
                          key as keyof typeof criteriaNamesInBulgarian
                        ]
                      }
                    </div>
                    <div className="flex items-center">
                      <Progress
                        value={getProgressValue(value, isGenre)}
                        className="h-2 flex-grow mr-2"
                      />
                      <div className="text-sm font-bold whitespace-nowrap">
                        {value}/{isGenre ? 2 : 1} т.
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default RelevantRecommendations;

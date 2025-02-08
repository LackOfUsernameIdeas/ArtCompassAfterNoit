export type RecommendationsAnalysis = {
  relevantCount: number; // Броят на релевантните препоръки
  totalCount: number; // Общо броят на препоръките
  precisionValue: number; // Стойността на прецизността
  precisionPercentage: number; // Процентното изражение на прецизността
  relevantRecommendations: Analysis[]; // Списък с релевантни препоръки (imdbID)
};

export interface CriteriaScores {
  genres: number; // жанровете
  type: number; // типа (филм/сериал)
  mood: number; // настроението
  timeAvailability: number; // наличното време за гледане
  preferredAge: number; // предпочитаната възраст (спрямо година на издаване)
  targetGroup: number; // целевата аудитория
}

export interface Analysis {
  imdbID: string; // Уникален идентификатор на филма/сериала в IMDb
  title_en: string; // Английско заглавие на филма/сериала
  title_bg: string; // Българско заглавие на филма/сериала
  isRelevant: boolean; // Дали препоръката е подходяща според критериите
  relevanceScore: number; // Общ резултат за релевантност
  criteriaScores: CriteriaScores; // Подробен резултат по отделни критерии
}

export interface RecommendationsAnalysesWidgetsProps {
  recommendationsAnalysis: RecommendationsAnalysis; // Данни за анализа на препоръките
  currentIndex: number; // Индекс на текущата препоръка
  handlePrev: () => void; // Функция за преминаване към предишната препоръка
  handleNext: () => void; // Функция за преминаване към следващата препоръка
  isSwitching?: boolean; // Флаг, указващ дали се извършва превключване между препоръки
}

export interface RelevantRecommendationsProps {
  relevantRecommendations: Analysis[]; // Масив от релевантни препоръки
  currentIndex: number; // Индекс на текущата препоръка
  title_en: string; // Английско заглавие на филма/сериала
  title_bg: string; // Българско заглавие на филма/сериала
}

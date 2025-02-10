// Тип за данните за прецизност
export type PrecisionData = {
  precision_exact: number; // Точна прецизност
  precision_fixed: number; // Коригирана прецизност
  precision_percentage: number; // Прецизност в проценти
  relevant_recommendations_count: number; // Брой релевантни препоръки
  total_recommendations_count: number; // Общо препоръки
};

// Тип за данните за възвръщаемост (recall)
export type RecallData = {
  recall_exact: number; // Точна възвръщаемост
  recall_fixed: number; // Коригирана възвръщаемост
  recall_percentage: number; // Възвръщаемост в проценти
  relevant_user_recommendations_count: number; // Брой релевантни препоръки от потребителя
  relevant_platform_recommendations_count: number; // Брой релевантни препоръки от платформата
  total_user_recommendations_count: number; // Общо препоръки от потребителя
  total_platform_recommendations_count: number; // Общо препоръки от платформата
};

// Тип за данните за F1-оценка (F1 Score)
export type F1ScoreData = {
  f1_score_exact: number; // Точна F1-оценка
  f1_score_fixed: number; // Коригирана F1-оценка
  f1_score_percentage: number; // F1-оценка в проценти
};

// Интерфейс за свойствата на таблото за анализ на изкуствения интелект
export interface AIAnalysisDashboardProps {
  precisionData: PrecisionData; // Данни за прецизност
  recallData: RecallData; // Данни за възвръщаемост
  f1ScoreData: F1ScoreData; // Данни за F1-оценка
}

// Интерфейс за карта със статистика
export interface StatisticCardProps {
  title: string; // Заглавие на картата
  value: number | string; // Стойност на показателя
}

// Интерфейс за карта с метрика
export interface MetricCardProps {
  title: string; // Заглавие на картата
  value: number | string; // Стойност на метриката
  description: string; // Описание на метриката
  progress: number; // Прогрес на стойността (например процент)
}

// Интерфейс за критериите на модала за оценяване
export interface CriteriaScores {
  genres: number; // Съвпадение по жанрове
  type: number; // Съвпадение по тип (филм/сериал)
  mood: number; // Съвпадение по настроение
  timeAvailability: number; // Наличност на време за гледане
  preferredAge: number; // Предпочитана възраст (спрямо година на издаване)
  targetGroup: number; // Целева аудитория
}

// Интерфейс за анализа на препоръките
export interface Analysis {
  imdbID: string; // Уникален идентификатор на филма/сериала в IMDb
  title_en: string; // Английско заглавие на филма/сериала
  title_bg: string; // Българско заглавие на филма/сериала
  isRelevant: boolean; // Дали препоръката е релевантна
  relevanceScore: number; // Общ резултат за релевантност
  criteriaScores: CriteriaScores; // Подробен резултат по отделни критерии
}

// Тип за анализа на препоръките
export type RecommendationsAnalysis = {
  relevantCount: number; // Брой релевантни препоръки
  totalCount: number; // Общ брой препоръки
  precisionValue: number; // Стойност на прецизността
  precisionPercentage: number; // Процентна стойност на прецизността
  relevantRecommendations: Analysis[]; // Списък с релевантни препоръки (imdbID)
};

// Тип за потребителските предпочитания
export type UserPreferences = {
  token: string; // Токен за удостоверяване на потребителя
  preferred_genres_en: string; // Предпочитани жанрове на английски (като CSV стринг)
  preferred_genres_bg: string; // Предпочитани жанрове на български (като CSV стринг)
  mood: string | null; // Настроение на потребителя (може да бъде null)
  timeAvailability: string | null; // Свободно време за гледане (може да бъде null)
  preferred_age: string | null; // Предпочитана възрастова група (може да бъде null)
  preferred_type: string; // Предпочитан тип съдържание (филм, сериал и т.н.)
  preferred_actors: string; // Предпочитани актьори (като CSV стринг)
  preferred_directors: string; // Предпочитани режисьори (като CSV стринг)
  preferred_countries: string; // Предпочитани държави за филмово съдържание (като CSV стринг)
  preferred_pacing: string; // Предпочитан темп на разказа
  preferred_depth: string; // Предпочитана дълбочина на сюжета
  preferred_target_group: string; // Предпочитана целева аудитория
  interests: string | null; // Интереси на потребителя (или null, ако няма)
  date: Date; // Дата на създаване или последна промяна на предпочитанията
};

// Интерфейс за филм с всички основни данни за филма или сериала.
export interface MovieSeriesRecommendationAfterSaving {
  id?: string; // ID на филма или сериала
  user_id?: string; // ID на потребителя, свързан с филма или сериала
  imdbID: string; // IMDb идентификатор
  title: string; // Английско заглавие на филма или сериала
  bgName: string; // Българско заглавие на филма или сериала
  genre: string; // Жанрове на английски
  reason: string; // Причина за препоръката на филма или сериала
  description: string; // Описание на филма или сериала
  year: string; // Година на издаване
  rated: string; // Възрастова оценка
  released: string; // Дата на излизане
  runtime: string; // Времетраене в минути
  runtimeGoogle: string; // Времетраене, директно от Гугъл
  director: string; // Име на режисьора
  writer: string; // Име на сценариста
  actors: string; // Списък с актьори
  plot: string; // Сюжет на филма или сериала
  language: string; // Езици на филма или сериала
  country: string; // Страни, участващи в производството
  awards: string; // Награди, спечелени от филма или сериала
  poster: string; // URL на постера
  ratings: { Source: string; Value: string }[]; // Масив с рейтингови източници и стойности
  metascore: string; // Метаскор стойност
  imdbRating: string; // IMDb рейтинг
  imdbRatingGoogle: string; // IMDb рейтинг от Гугъл
  imdbVotes: string; // Брой IMDb гласове
  type: string; // Вид (например, филм)
  DVD: string; // Информация за DVD издание (ако е налично)
  boxOffice: string; // Приходи от бокс офиса
  production: string; // Продуцентско студио (ако е налично)
  website: string; // Официален уебсайт (ако е наличен)
  totalSeasons?: string | null; // Общо сезони (за сериали)
  date?: string; // Дата на въвеждане на данните
}

export type RelevanceResponse = {
  lastSavedUserPreferences?: UserPreferences; // Предпочитания на потребителя (по избор)
  lastSavedRecommendations: MovieSeriesRecommendationAfterSaving; // Списък с последно генерирани препоръки
  relevanceResults: Analysis[]; // Списък с релевантни препоръки
};

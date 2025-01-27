// Данни за потребителите
export type UsersCountData = {
  user_count: number; // Брой на регистрираните потребители
};

// Данни за потребител
export interface UserData {
  id: number; // Уникален идентификатор на потребителя
  first_name: string; // Първо име на потребителя
  last_name: string; // Фамилно име на потребителя
  email: string; // Имейл адрес на потребителя
}

// Пропси за модала, показващ сюжета на филма/сериала
export interface PlotModalProps {
  isOpen: boolean; // Статус на модала (отворен/затворен)
  onClose: () => void; // Функция за затваряне на модала
  plot: string; // Сюжет на филма/сериала
}

// Основни данни за филм
export interface MovieData {
  title_en: string; // Заглавие на филма на английски
  boxOffice: number | string; // Приходи от бокс офис
  imdbRating: number; // Рейтинг в IMDb
  metascore: number; // Metascore рейтинг
  rottenTomatoes: number; // Рейтинг в Rotten Tomatoes
  type?: "movie" | "series"; // Тип на филма (филм или сериал)
  title_bg: string; // Заглавие на филма на български
}

// Данни за препоръки на филми/сериали
export interface RecommendationData extends MovieData {
  id: number; // Идентификатор на препоръката
  imdbID: string; // IMDb идентификатор
  awards: string; // Награди, спечелени от филма
  recommendations: number; // Брой препоръки
  oscar_wins: string; // Спечелени Оскари
  oscar_nominations: string; // Номинации за Оскар
  total_wins: string; // Общо спечелени награди
  total_nominations: string; // Общо номинации
}

// Изчисляване на просперитет на филми/сериали
export interface MovieProsperityData {
  imdbID: string; // IMDb идентификатор на филма/сериала
  title_en: string; // Заглавие на английски
  title_bg: string; // Заглавие на български
  type: string; // Тип на филма (филм или сериал)
  imdbRating: string; // Рейтинг в IMDb
  metascore: string; // Metascore рейтинг
  total_box_office: string; // Приходи от бокс офис
  rotten_tomatoes: string; // Рейтинг в Rotten Tomatoes
  total_recommendations: number; // Общо препоръки
  total_wins: string; // Общо спечелени награди
  total_nominations: string; // Общо номинации
  prosperityScore: number; // Индекс на просперитет
  genre_en: string; // Жанр на английски
  genre_bg: string; // Жанр на български
}

// Тип за данни за топ жанровете
export type TopGenres = {
  genre_en: string;
  genre_bg: string;
  count: number;
}[];

// Данни за броя на филми и сериали
export type Count = {
  movies: number;
  series: number;
};

// Обобщени данни за потребителя (например топ препоръки и жанрове)
export type DataType = {
  topRecommendationsWatchlist: {
    savedCount: Count;
    watchlist: Recommendation[]; // Топ препоръки в списък за гледане
  };
  [key: `sorted${string}By${"RecommendationCount" | "SavedCount"}`]: any[]; // Подредени данни по препоръки и запазвания
};

// Категории роли (актьори, режисьори, писатели)
export type Category = "Actors" | "Directors" | "Writers"; // Роли: Актьори, Режисьори, Писатели

// Данни за препоръки с подробности за филма/сериала
export interface Recommendation {
  id: number;
  imdbID: string; // IMDb идентификатор
  title_en: string; // Заглавие на английски
  title_bg: string; // Заглавие на български
  type: "movie" | "series"; // Тип на препоръката
  awards: string; // Награди
  recommendations: number; // Препоръки
  poster: string; // URL за постера на филма/сериала
  oscar_wins: string; // Спечелени Оскари
  oscar_nominations: string; // Номинации за Оскар
  total_wins: string; // Общо спечелени награди
  total_nominations: string; // Общо номинации
  ratings: Rating[]; // Рейтинги от различни източници
  imdbRating: string; // Рейтинг в IMDb
  metascore: string; // Метаскор
  boxOffice: string; // Бокс офис
  prosperityScore: number; // Индекс на просперитет
  genre_en: string; // Жанр на английски
  genre_bg: string; // Жанр на български
  reason: string; // Причина за препоръката
  description: string; // Описание на филма/сериала
  year: string; // Година на издаване
  rated: string; // Оценка за възрастови ограничения
  released: string; // Дата на издаване
  runtime: string; // Продължителност
  director: string; // Режисьор
  writer: string; // Сценаристи
  actors: string; // Актьори
  plot: string; // Сюжет
}

export type Rating = {
  Source: string;
  Value: string;
};

// Пропси за модала, показващ сюжета на филма/сериала
export interface PlotModalProps {
  isOpen: boolean; // Статус на модала (отворен/затворен)
  onClose: () => void; // Функция за затваряне на модала
  plot: string | undefined; // Сюжет на филма/сериала
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
  user_id: number;
  imdbID: string;
  title_en: string;
  title_bg: string;
  genre_en: string;
  genre_bg: string;
  reason: string;
  recommendations: string;
  description: string;
  year: string;
  rated: string;
  released: string;
  runtime: string;
  director: string;
  writer: string;
  actors: string;
  plot: string;
  language: string;
  country: string;
  awards: string;
  poster: string;
  ratings: string;
  metascore: string;
  imdbRating: string;
  imdbVotes: string;
  type: string;
  DVD: string;
  boxOffice: string;
  production: string;
  website: string;
  totalSeasons: string;
  oscar_wins: string;
  oscar_nominations: string;
  total_wins: string;
  total_nominations: string;
  prosperityScore: number;
}

export type Rating = {
  Source: string;
  Value: string;
};

export interface RecommendationCardAlertProps {
  selectedItem: Recommendation | null;
  onClose: () => void;
  setBookmarkedMovies: React.Dispatch<
    // Функция за обновяване на списъка с маркирани филми/сериали
    React.SetStateAction<{
      [key: string]: any; // Динамичен обект с маркирани филми/сериали
    }>
  >;
  setCurrentBookmarkStatus: React.Dispatch<React.SetStateAction<boolean>>; // Функция за задаване на текущия статус на маркиране
  setAlertVisible: React.Dispatch<React.SetStateAction<boolean>>; // Функция за показване на известие
  bookmarkedMovies: { [key: string]: Recommendation };
}

export interface MoviesAndSeriesTableProps {
  data: Recommendation[];
  type: "recommendations" | "watchlist";
  setBookmarkedMovies: React.Dispatch<
    // Функция за обновяване на списъка с маркирани филми/сериали
    React.SetStateAction<{
      [key: string]: any; // Динамичен обект с маркирани филми/сериали
    }>
  >;
  setCurrentBookmarkStatus: React.Dispatch<React.SetStateAction<boolean>>; // Функция за задаване на текущия статус на маркиране
  setAlertVisible: React.Dispatch<React.SetStateAction<boolean>>; // Функция за показване на известие
  bookmarkedMovies: { [key: string]: Recommendation };
}

export interface BookmarkAlertProps {
  isBookmarked: boolean;
  onDismiss: () => void;
}

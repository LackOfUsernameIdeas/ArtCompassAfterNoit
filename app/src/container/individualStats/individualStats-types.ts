// Общи данни за режисьори, актьори и писатели
export interface CommonData {
  avg_imdb_rating: number; // Среден рейтинг в IMDb
  avg_metascore: number; // Среден Metascore
  total_box_office: string; // Общо приходи от бокс офис
  avg_rotten_tomatoes: string; // Среден рейтинг в Rotten Tomatoes
  total_wins: string; // Общо спечелени награди
  total_nominations: string; // Общо номинации
  prosperityScore: number; // Индекс на просперитетто
  movie_series_count: number; // Брой филми
  total_recommendations: number; // Брой препоръки общо
  recommendations_count?: number; // Брой препоръки
  saved_count?: number; // Брой пъти запазван
}

// Данни свързани с режисьори
export interface DirectorData extends CommonData {
  director_en: string; // Име на режисьора на английски
  director_bg: string; // Име на режисьора на български
}

// Данни свързани с актьори
export interface ActorData extends CommonData {
  actor_en: string; // Име на актьора на английски
  actor_bg: string; // Име на актьора на български
}

// Данни свързани с писатели
export interface WriterData extends CommonData {
  writer_en: string; // Име на писателя на английски
  writer_bg: string; // Име на писателя на български
}

// Тип данни за роли (режисьор, актьор, писател)
export type RoleData = DirectorData[] | ActorData[] | WriterData[];

// Тип данни за филтрирани таблици (съюз от данни за режисьори, актьори и писатели)
export type FilteredTableData = (DirectorData | ActorData | WriterData)[];

// Данни за потребителите
export type UsersCountData = {
  user_count: number; // Брой потребители
};

export interface UserData {
  id: number; // Идентификатор на потребителя
  first_name: string; // Първо име
  last_name: string; // Фамилно име
  email: string; // Имейл адрес
}

// Интерфейс за пропсите на модала за сюжет
export interface PlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  plot: string;
}
// Данни свързани с жанрове
export interface GenrePopularityData {
  [year: string]: {
    [genre: string]: {
      genre_en: string; // Жанр на английски
      genre_bg: string; // Жанр на български
      genre_count: number; // Брой на жанра
    };
  };
}

// Данни свързани с филми
export interface MovieData {
  title_en: string; // Заглавие на филма на английски
  boxOffice: number | string; // Бокс офис приходи
  imdbRating: number; // Рейтинг в IMDb
  metascore: number; // Metascore рейтинг
  rottenTomatoes: number; // Рейтинг в Rotten Tomatoes
  type?: "movie" | "series"; // Тип (филм или сериал)
  title_bg: string; // Заглавие на филма на български
}

// Данни свързани с препоръки
export interface RecommendationData extends MovieData {
  id: number; // Идентификатор на препоръката
  imdbID: string; // IMDb идентификатор
  awards: string; // Награди
  recommendations: number; // Брой препоръки
  oscar_wins: string; // Спечелени Оскари
  oscar_nominations: string; // Номинации за Оскар
  total_wins: string; // Общо спечелени награди
  total_nominations: string; // Общо номинации
}

// Данни за изчисляване на средни стойности за приходи и рейтинги
export interface AverageBoxOfficeAndScores {
  average_box_office: string; // Средни приходи от бокс офис
  average_metascore: string; // Среден Metascore
  average_imdb_rating: string; // Среден рейтинг в IMDb
  average_rotten_tomatoes: string; // Среден рейтинг в Rotten Tomatoes
}

// Данни за страните
export interface CountryData {
  country_en: string; // Страна на английски
  country_bg: string; // Страна на български
  count: number; // Брой филми от тази страна
}

// Данни за изчисляване на просперитетто на филми и сериали
export interface MovieProsperityData {
  imdbID: string; // IMDb идентификатор
  title_en: string; // Заглавие на филма на английски
  title_bg: string; // Заглавие на филма на български
  type: string; // Тип на филма (филм или сериал)
  imdbRating: string; // Рейтинг в IMDb
  metascore: string; // Metascore рейтинг
  total_box_office: string; // Общо приходи от бокс офис
  rotten_tomatoes: string; // Рейтинг в Rotten Tomatoes
  total_recommendations: number; // Брой препоръки
  total_wins: string; // Общо спечелени награди
  total_nominations: string; // Общо номинации
  prosperityScore: number; // Индекс на просперитетто
  genre_en: string; // Жанр на английски
  genre_bg: string; // Жанр на български
}

// Структура на данни за популярността на жанровете през времето
export interface GenreSeriesData {
  name: string; // Име на жанра (напр. Криминален, Драма)
  data: { x: string; y: number }[]; // Данни: година (x) и брой жанра (y)
}

// Формат на данни за топ жанровете
export type HeatmapData = GenreSeriesData[];

export type TopGenres = {
  genre_en: string;
  genre_bg: string;
  count: number;
}[];

export type Count = {
  movies: number;
  series: number;
};

// Обобщени данни за потребителя (топ препоръки, жанрове и др.)
export type DataType = {
  topRecommendations: {
    recommendationsCount: Count;
    recommendations: Recommendation[];
  }; // Топ препоръки
  topRecommendationsWatchlist: {
    savedCount: Count;
    watchlist: WatchlistRecommendation[];
  }; // Топ филми/сериали в списък за гледане
  topGenres: TopGenres; // Топ жанрове
  topGenresWatchlist: TopGenres; // Топ жанрове в списък за гледане
  [key: `sorted${string}By${"RecommendationCount" | "SavedCount"}`]: any[]; // Подредени данни по просперитет
};

// Категориен тип за роли
export type Category = "Actors" | "Directors" | "Writers"; // Роли: Актьори, Режисьори, Писатели

export interface Recommendation {
  id: number;
  imdbID: string; // Updated to match "imdbID"
  title_en: string; // Added for the English title
  title_bg: string; // Added for the Bulgarian title
  type: "movie" | "series"; // Added to specify the type of the recommendation
  awards: string; // No change, still a string for awards information
  recommendations: number; // Adjusted to number based on the example
  oscar_wins: string; // Adjusted to match the oscar_wins field
  oscar_nominations: string; // Adjusted to match the oscar_nominations field
  total_wins: string; // Adjusted to match the total_wins field
  total_nominations: string; // Adjusted to match the total_nominations field
  imdbRating: string; // No change, still a string
  metascore: string; // No change, still a string
  boxOffice: string; // No change, still a string
  prosperityScore: number; // Added for the prosperityScore
  genre_en: string; // Жанрове на английски
  genre_bg: string; // Жанрове на български
  reason: string; // Причина за препоръката
  description: string; // Описание на филма/сериала
  year: string; // Година на издаване
  rated: string; // Оценка за възрастови ограничения
  released: string; // Дата на издаване
  runtime: string; // Продължителност на филма/сериала
  director: string; // Режисьор
  writer: string; // Сценарист
  actors: string; // Актьори
  plot: string; // Сюжет на филма/сериала
  language: string; // Езици на филма/сериала
  country: string; // Страни, от които е произведен филмът/сериалът
  poster: string; // URL за постера на филма/сериала
  ratings: string; // Рейтинги от различни източници
  imdbVotes: string; // Брой гласове в IMDb
  DVD: string; // Достъпност на DVD (ако има)
  production: string; // Продукция (ако има)
  website: string; // Уебсайт (ако има)
  totalSeasons: number | null; // Брой сезони (само за сериали)
}

export interface WatchlistRecommendation {
  id: number; // Идентификатор на препоръката
  user_id: number; // Идентификатор на потребителя, който е направил препоръката
  imdbID: string; // IMDb идентификатор на филма/сериала
  title_en: string; // Заглавие на английски
  title_bg: string; // Заглавие на български
  genre_en: string; // Жанрове на английски
  genre_bg: string; // Жанрове на български
  reason: string; // Причина за препоръката
  description: string; // Описание на филма/сериала
  year: string; // Година на издаване
  rated: string; // Оценка за възрастови ограничения
  released: string; // Дата на издаване
  runtime: string; // Продължителност на филма/сериала
  director: string; // Режисьор
  writer: string; // Сценарист
  actors: string; // Актьори
  plot: string; // Сюжет на филма/сериала
  language: string; // Езици на филма/сериала
  country: string; // Страни, от които е произведен филмът/сериалът
  awards: string; // Награди, които е спечелил филмът/сериалът
  poster: string; // URL за постера на филма/сериала
  ratings: string; // Рейтинги от различни източници
  metascore: string; // Метаскор (оценка на критиците)
  imdbRating: string; // IMDb оценка на филма/сериала
  imdbVotes: string; // Брой гласове в IMDb
  type: "movie" | "series"; // Тип на препоръката (филм или сериал)
  DVD: string; // Достъпност на DVD (ако има)
  boxOffice: string; // Приходи от боксофиса
  production: string; // Продукция (ако има)
  website: string; // Уебсайт (ако има)
  totalSeasons: number | null; // Брой сезони (само за сериали)
  oscar_wins: string; // Брой спечелени награди "Оскар"
  oscar_nominations: string; // Брой номинации за "Оскар"
  total_wins: string; // Общ брой спечелени награди
  total_nominations: string; // Общ брой номинации
  prosperityScore: number; // Процъфтяване (оценка за популярност на филма/сериала)
}

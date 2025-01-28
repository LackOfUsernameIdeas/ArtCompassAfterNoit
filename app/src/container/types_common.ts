// Вида на уведомлението.
export type NotificationType = "success" | "error" | "warning";

// Интерфейс за уведомление, което съдържа съобщение и тип на уведомлението.
export interface NotificationState {
  message: string;
  type: NotificationType;
}

// Общи данни за режисьори, актьори и писатели
export interface CommonData {
  avg_imdb_rating: number; // Среден рейтинг в IMDb
  avg_metascore: number; // Среден Metascore
  total_box_office: string; // Общо приходи от бокс офис
  avg_rotten_tomatoes: string; // Среден рейтинг в Rotten Tomatoes
  total_wins: string; // Общо спечелени награди
  total_nominations: string; // Общо номинации
  prosperityScore: number; // Индекс на просперитет
  movie_series_count: number; // Брой филми и сериали
  total_recommendations: number; // Общо препоръки
  recommendations_count?: number; // Брой препоръки за конкретен елемент
  saved_count?: number; // Брой пъти запазвано
}

// Данни за режисьори, включително общи данни
export interface DirectorData extends CommonData {
  director_en: string; // Име на режисьора на английски
  director_bg: string; // Име на режисьора на български
}

// Данни за актьори, включително общи данни
export interface ActorData extends CommonData {
  actor_en: string; // Име на актьора на английски
  actor_bg: string; // Име на актьора на български
}

// Данни за писатели, включително общи данни
export interface WriterData extends CommonData {
  writer_en: string; // Име на писателя на английски
  writer_bg: string; // Име на писателя на български
}

// Интерфейс за филм с всички основни данни за филма.
export interface MovieSeriesRecommendation {
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

// Интерфейс за книга с всички основни данни за книгата.
export interface BookRecommendation {
  id: string; // ID на книгата
  user_id: string; // ID на потребителя, свързан с книгата
  google_books_id: string; // Google Books идентификатор
  goodreads_id: string; // Goodreads идентификатор
  title_en: string; // Английско заглавие на книгата
  title_bg: string; // Българско заглавие на книгата
  real_edition_title: string; // Реално заглавие на изданието
  author: string | Promise<string>; // Име на автора (може да е обещание)
  publisher: string; // Издателство
  genre_en: string | Promise<string>; // Жанрове на английски (може да е обещание)
  genre_bg: string | Promise<string>; // Жанрове на български (може да е обещание)
  description: string | Promise<string>; // Описание на книгата (може да е обещание)
  language: string | Promise<string>; // Езици на книгата (може да е обещание)
  origin: string; // Страна на произход
  literary_awards: string; // Награди на книгата
  setting: string; // Мястото, в което се развива сюжета
  characters: string; // Героите в сюжета
  series: string; // Поредица
  date_of_first_issue: string; // Дата на първо издание
  date_of_issue: string; // Дата на издаване
  goodreads_rating: number; // Goodreads рейтинг
  goodreads_ratings_count: number; // Брой гласове в Goodreads
  goodreads_reviews_count: number; // Брой ревюта в Goodreads
  reason: string; // Причина за препоръката
  adaptations: string; // Адаптации на книгата
  ISBN_10: string; // ISBN-10
  ISBN_13: string; // ISBN-13
  page_count: string; // Брой страници
  book_format: string; // Вид на книгата (тип корица, е-книги)
  imageLink: string; // Линк към изображение на книгата
  source: string; // Източник (напр. Google Books)
}

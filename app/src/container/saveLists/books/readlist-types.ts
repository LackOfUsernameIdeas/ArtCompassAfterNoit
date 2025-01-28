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
  topRecommendationsReadlist: Recommendation[]; // Топ препоръки в списък за четене;
  [key: `sorted${string}By${"RecommendationCount" | "SavedCount"}`]: any[]; // Подредени данни по препоръки и запазвания
};

// Категории роли (актьори, режисьори, писатели)
export type Category = "Actors" | "Directors" | "Writers"; // Роли: Актьори, Режисьори, Писатели

// Данни за препоръки с подробности за книгата
export interface Recommendation {
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

export type Rating = {
  Source: string;
  Value: string;
};

import { BookRecommendation } from "../../types_common";

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
  topRecommendationsReadlist: BookRecommendation[]; // Топ препоръки в списък за четене;
  [key: `sorted${string}By${"RecommendationCount" | "SavedCount"}`]: any[]; // Подредени данни по препоръки и запазвания
};

// Категории роли (актьори, режисьори, писатели)
export type Category = "Actors" | "Directors" | "Writers"; // Роли: Актьори, Режисьори, Писатели

// Тип за рейтинг, съдържащ източник и стойност
export type Rating = {
  Source: string; // Източник на рейтинга (напр. IMDb, Goodreads)
  Value: string; // Стойност на рейтинга (напр. "8.5/10")
};

// Интерфейс за пропс на таблицата с книги
export interface BooksTableProps {
  data: BookRecommendation[]; // Масив с препоръчани книги
  setBookmarkedBooks: React.Dispatch<
    // Функция за обновяване на списъка с маркирани книги
    React.SetStateAction<{
      [key: string]: any; // Динамичен обект с маркирани книги
    }>
  >;
  setCurrentBookmarkStatus: React.Dispatch<React.SetStateAction<boolean>>; // Функция за задаване на текущия статус на маркиране
  setAlertVisible: React.Dispatch<React.SetStateAction<boolean>>; // Функция за показване на известие
  bookmarkedBooks: { [key: string]: BookRecommendation }; // Обект със списък на маркирани книги
}

// Интерфейс за пропс на картата с препоръка
export interface RecommendationCardProps {
  selectedItem: BookRecommendation | null; // Избрана книга от списъка с препоръки
  onClose: () => void; // Функция за затваряне на модала
  setBookmarkedBooks: React.Dispatch<
    // Функция за обновяване на списъка с маркирани книги
    React.SetStateAction<{
      [key: string]: any; // Динамичен обект с маркирани книги
    }>
  >;
  setCurrentBookmarkStatus: React.Dispatch<React.SetStateAction<boolean>>; // Функция за задаване на текущия статус на маркиране
  setAlertVisible: React.Dispatch<React.SetStateAction<boolean>>; // Функция за показване на известие
  bookmarkedBooks: { [key: string]: BookRecommendation }; // Обект със списък на маркирани книги
}

// Интерфейс за пропс на филтриращото меню
export interface FilterSidebarProps {
  isOpen: boolean; // Дали менюто е отворено
  onClose: () => void; // Функция за затваряне на менюто
  data: BookRecommendation[]; // Данни за книгите
  setFilteredData: React.Dispatch<React.SetStateAction<BookRecommendation[]>>; // Функция за задаване на филтрираните книги
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>; // Функция за задаване на текуща страница
  listData: {
    authors: string[];
    publishers: string[];
  }; // Списък с налични автори за избор
}

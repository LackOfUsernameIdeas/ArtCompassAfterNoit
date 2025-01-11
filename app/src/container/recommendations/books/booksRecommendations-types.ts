import { Dispatch, SetStateAction } from "react";

// Вида на уведомлението.
export type NotificationType = "success" | "error" | "warning";

// Интерфейс за уведомление, което съдържа съобщение и тип на уведомлението.
export interface NotificationState {
  message: string;
  type: NotificationType;
}

// Интерфейс за жанр с английско и българско име.
export interface Genre {
  en: string; // Английско име на жанра
  bg: string; // Българско име на жанра
}

// Интерфейс за рейтинг на филм с източник и стойност.
export interface Rating {
  Source: string; // Източник на рейтинга
  Value: string; // Стойност на рейтинга
}

// Интерфейс за въпрос с възможности и стойности.
export interface Question {
  question: string; // Текст на въпроса
  options?: string[] | { en: string; bg: string }[]; // Падащо меню или множествен избор
  isMultipleChoice?: boolean; // Флаг за множествен избор
  isInput?: boolean; // Флаг за въпрос, изискващ текстов вход
  value: any; // Стойност на отговора
  setter: Dispatch<SetStateAction<any>>; // Сетър за стойността на отговора
  placeholder?: string; // Плейсхолдър за въпроси с текстов вход
  description?: string; // Допълнително описание на въпроса
}

// Интерфейс за книга с всички основни данни за книгата.
export interface Book {
  id: string; // ID на книгата
  user_id: string; // ID на потребителя, свързан с книгата
  google_books_id: string; // Google Books идентификатор
  title_en: string; // Английско заглавие на книгата
  title_bg: string; // Българско заглавие на книгата
  real_edition_title: string; // Реално заглавие на изданието
  author: string | Promise<string>; // Име на автора (може да е обещание)
  genres_en: string | Promise<string>; // Жанрове на английски (може да е обещание)
  genres_bg: string | Promise<string>; // Жанрове на български (може да е обещание)
  description: string | Promise<string>; // Описание на книгата (може да е обещание)
  language: string | Promise<string>; // Езици на книгата (може да е обещание)
  origin: string; // Страна на произход
  date_of_first_issue: string; // Дата на първо издание
  date_of_issue: string; // Дата на издаване
  goodreads_rating: string; // Goodreads рейтинг
  reason: string; // Причина за препоръката
  adaptations: string; // Адаптации на книгата
  ISBN_10: string; // ISBN-10
  ISBN_13: string; // ISBN-13
  page_count: string; // Брой страници
  imageLink: string; // Линк към изображение на книгата
  source: string; // Източник (напр. Google Books)
}

// Интерфейс за предпочитания на потребителя.
export interface BooksUserPreferences {
  genres: { en: string; bg: string }[]; // Жанрове на английски и български
  moods: string[]; // Настроения
  authors: string; // Любими актьори
  origin: string; // Предпочитани държави
  pacing: string; // Пейсинг
  depth: string; // Дълбочина на историята
  targetGroup: string; // Целева група
  interests: string; // Интереси
}

// Пропс за компонентата Quiz, свързана с маркирането на филми.
export interface QuizProps {
  handleBookmarkClick: (movie: Book) => void; // Функция за маркиране на филм
  bookmarkedMovies: { [key: string]: Book }; // Списък с маркирани филми
  setBookmarkedMovies: React.Dispatch<
    React.SetStateAction<{ [key: string]: any }>
  >; // Функция за актуализиране на маркираните филми
}

// Пропс за компонентата Recommendations, отговорна за показване на препоръки.
export interface RecommendationsProps {
  recommendationList: Book[]; // Списък с препоръчани филми
  handleBookmarkClick: (movie: Book) => void; // Функция за маркиране на филм
  bookmarkedMovies: { [key: string]: Book }; // Списък с маркирани филми
}

// Пропс за компонентата RecommendationCard, която показва информация за филм.
export interface RecommendationCardProps {
  recommendationList: Book[]; // Списък с препоръчани филми
  currentIndex: number; // Текущ индекс на филма
  isExpanded: boolean; // Флаг дали картата е разширена
  openModal: () => void; // Функция за отваряне на модала
  handleBookmarkClick: (movie: Book) => void; // Функция за маркиране на филм
  bookmarkedMovies: { [key: string]: Book }; // Списък с маркирани филми
}

// Пропс за компонентата PlotModal, показваща сюжетната линия на филма.
export interface PlotModalProps {
  recommendationList: Book[]; // Списък с препоръчани филми
  currentIndex: number; // Текущ индекс на филма
  closeModal: () => void; // Функция за затваряне на модала
}

// Пропс за компонентата QuizQuestion, която съдържа въпросите и опции.
export interface QuizQuestionProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>; // Функция за задаване на състоянието за зареждане
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>; // Функция за задаване на състоянието за изпращане
  showViewRecommendations: boolean; // Флаг за показване на препоръките
  alreadyHasRecommendations: boolean; // Флаг за проверка дали вече има препоръки
  setRecommendationList: React.Dispatch<React.SetStateAction<any[]>>; // Функция за задаване на списък с препоръки
  setBookmarkedMovies: React.Dispatch<
    React.SetStateAction<{ [key: string]: any }>
  >; // Функция за актуализиране на маркираните филми
}

// Пропс за компонентата ViewRecommendations, която показва резултатите от препоръките.
export interface ViewRecommendationsProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>; // Функция за задаване на състоянието за зареждане
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>; // Функция за задаване на състоянието за изпращане
  setShowQuestion: React.Dispatch<React.SetStateAction<boolean>>; // Функция за задаване на показване на въпрос
}

// Интерфейс за пропсите на модала за потвърждение
export interface ConfirmationModalProps {
  // Функция за задаване на уведомления с тип и съобщение
  setNotification: React.Dispatch<
    React.SetStateAction<{
      message: string;
      type: "success" | "error" | "warning";
    } | null>
  >;

  // Функция за задаване на състоянието за зареждане
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;

  // Функция за задаване на състоянието за изпращане
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;

  // Функция за задаване на състоянието за отваряне на модала
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;

  // Функция за обработка на изпращането на заявка
  handleSubmit: (
    setNotification: React.Dispatch<
      React.SetStateAction<{
        message: string;
        type: "success" | "error" | "warning";
      } | null>
    >,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setSubmitted: React.Dispatch<React.SetStateAction<boolean>>,
    setSubmitCount: React.Dispatch<React.SetStateAction<number>>,
    setRecommendationList: React.Dispatch<React.SetStateAction<any[]>>,
    setBookmarkedMovies: React.Dispatch<
      React.SetStateAction<{
        [key: string]: any;
      }>
    >,
    booksUserPreferences: BooksUserPreferences,
    token: string | null,
    submitCount: number
  ) => Promise<void>;

  // Функция за задаване на броя на изпратените заявки
  setSubmitCount: React.Dispatch<React.SetStateAction<number>>;

  // Функция за задаване на списък с препоръки
  setRecommendationList: React.Dispatch<React.SetStateAction<any[]>>;

  // Функция за задаване на списък с любими филми
  setBookmarkedMovies: React.Dispatch<
    React.SetStateAction<{
      [key: string]: any;
    }>
  >;

  // Предпочитания на потребителя
  booksUserPreferences: BooksUserPreferences;

  // Токен за автентикация на потребителя
  token: string | null;

  // Броят на изпратените заявки
  submitCount: number;
}

// Интерфейс за идентификаторите на ISBN
export interface IndustryIdentifier {
  // Тип на идентификатора, може да бъде ISBN_10 или ISBN_13
  type: "ISBN_10" | "ISBN_13";
  // Стойност на идентификатора (самият ISBN номер)
  identifier: string;
}

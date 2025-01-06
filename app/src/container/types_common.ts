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

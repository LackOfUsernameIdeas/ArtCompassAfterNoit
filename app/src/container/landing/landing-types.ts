// Данни за потребителите
export type UsersCountData = {
  user_count: number; // Брой потребители
};

// Обобщени данни за платформата (топ препоръки, жанрове и др.)
export type DataType = {
  usersCount: UsersCountData[]; // Брой потребители
  topGenres: any[]; // Топ жанрове
  totalAwards: any[]; // Общо награди
  averageBoxOfficeAndScores: any[]; // Средни стойности за бокс офис и рейтинги
  averagePrecisionPercentage: string; // Средна прецизност в проценти
  averagePrecisionLastRoundPercentage: string; // Средна прецизност за последния кръг в проценти
  averageRecallPercentage: string; // Среден Recall в проценти
  averageF1ScorePercentage: string; // Среден F1 резултат в проценти
  booksAdaptationsCount: {}; // Брой адаптации на книги (филми и сериали)
};

export interface UserData {
  id: number; // Идентификатор на потребителя
  first_name: string; // Първо име
  last_name: string; // Фамилно име
  email: string; // Имейл адрес
}

// Данни за потребителите
export type UsersCountData = {
  user_count: number; // Брой потребители
};

// Обобщени данни за платформата (топ препоръки, жанрове и др.)
export type DataType = {
  usersCount: UsersCountData[]; // Брой потребители
  topGenres: any[]; // Топ жанрове
  oscarsByMovie: any[]; // Оскари по филми
  totalAwards: any[]; // Общо награди
  averageBoxOfficeAndScores: any[]; // Средни стойности за бокс офис и рейтинги
  [key: `sorted${string}ByProsperity`]: any[]; // Подредени данни по просперитет
};

export interface UserData {
  id: number; // Идентификатор на потребителя
  first_name: string; // Първо име
  last_name: string; // Фамилно име
  email: string; // Имейл адрес
}

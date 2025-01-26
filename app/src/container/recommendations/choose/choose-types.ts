// Данни за потребителите
export type UsersCountData = {
  user_count: number; // Брой потребители
};

// Обобщени данни за платформата (топ препоръки, жанрове и др.)
export type DataType = {
  usersCount: UsersCountData[]; // Брой потребители
  topRecommendations: any[]; // Топ препоръки
  topGenres: any[]; // Топ жанрове
  genrePopularityOverTime: Record<string, any>; // Популярност на жанровете през времето
  topActors: any[]; // Топ актьори
  topDirectors: any[]; // Топ режисьори
  topWriters: any[]; // Топ писатели
  oscarsByMovie: any[]; // Оскари по филми
  totalAwardsByMovieOrSeries: any[]; // Общо награди по филми или сериали
  totalAwards: any[]; // Общо награди
  sortedDirectorsByProsperity: any[]; // Подредени режисьори по просперитет
  sortedActorsByProsperity: any[]; // Подредени актьори по просперитет
  sortedWritersByProsperity: any[]; // Подредени писатели по просперитет
  sortedMoviesByProsperity: any[]; // Подредени филми по просперитет
  sortedMoviesAndSeriesByMetascore: any[]; // Подредени филми и сериали по Metascore
  sortedMoviesAndSeriesByIMDbRating: any[]; // Подредени филми и сериали по IMDb рейтинг
  sortedMoviesAndSeriesByRottenTomatoesRating: any[]; // Подредени филми и сериали по Rotten Tomatoes рейтинг
  averageBoxOfficeAndScores: any[]; // Средни стойности за бокс офис и рейтинги
  topCountries: any[]; // Топ страни
  [key: `sorted${string}ByProsperity`]: any[]; // Подредени данни по просперитет
};

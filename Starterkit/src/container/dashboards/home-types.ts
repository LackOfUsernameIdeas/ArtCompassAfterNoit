// home-types.ts

export interface CommonData {
  avg_imdb_rating: number;
  total_box_office: string;
  total_recommendations: number;
  total_wins: number;
  total_nominations: number;
}

export interface DirectorData extends CommonData {
  director: string;
  movie_count: number;
}

export interface ActorData extends CommonData {
  actor: string;
  movie_count: number;
}

export interface WriterData extends CommonData {
  writer: string;
  movie_count: number;
}

export type UsersCountData = {
  user_count: number;
};

export type DataType = {
  usersCount: UsersCountData[];
  topRecommendations: any[];
  topGenres: any[];
  genrePopularityOverTime: Record<string, any>;
  topActors: any[];
  topDirectors: any[];
  topWriters: any[];
  oscarsByMovie: any[];
  totalAwardsByMovie: any[];
  totalAwards: any[];
  sortedDirectorsByProsperity: any[];
  sortedActorsByProsperity: any[];
  sortedWritersByProsperity: any[];
  sortedMoviesByProsperity: any[];
  averageBoxOfficeAndScores: any[];
  topCountries: any[];
};

export type FilteredTableData = (DirectorData | ActorData | WriterData)[];

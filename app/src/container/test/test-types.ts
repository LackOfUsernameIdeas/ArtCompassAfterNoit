export interface Movie {
  title: string;
  bgName: string;
  year: string;
  runtime: string;
  director: string;
  writer: string;
  imdbRating: number;
  poster?: string;
  plot: string;
  reason: string;
  genre: string;
  actors: string;
  country: string;
  metascore: number;
  type: string;
  boxOffice: string;
  totalSeasons: number;
}

export interface MovieCardInit {
  title: string;
  bgName: string;
  reason: string;
  poster?: string;
  onSeeMore: () => void;
}

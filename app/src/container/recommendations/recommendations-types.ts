import { Dispatch, SetStateAction } from "react";

export interface Genre {
  en: string;
  bg: string;
}

export interface Rating {
  Source: string;
  Value: string;
}

export interface Question {
  question: string;
  options?: string[] | { en: string; bg: string }[]; // For dropdown/multiple choice
  isMultipleChoice?: boolean;
  isInput?: boolean;
  value: any; // The corresponding state value
  setter: Dispatch<SetStateAction<any>>; // The corresponding state setter
  placeholder?: string; // For input-type questions
  description?: string; // Additional question description
}

export interface Movie {
  id: string; // ID of the movie
  user_id: string; // ID of the user associated with the movie
  imdbID: string; // IMDb identifier
  title: string; // English title of the movie
  bgName: string; // Bulgarian title of the movie
  genre: string; // Genres in English
  reason: string; // Reason for recommending the movie
  description: string; // Description of the movie
  year: string; // Year of release
  rated: string; // Age rating
  released: string; // Release date
  runtime: string; // Runtime in minutes
  director: string; // Director's name
  writer: string; // Writer's name
  actors: string; // List of actors
  plot: string; // Plot of the movie
  language: string; // Languages used in the movie
  country: string; // Countries involved in production
  awards: string; // Awards won
  poster: string; // URL to the poster
  ratings: { Source: string; Value: string }[]; // Array of rating sources and values
  metascore: string; // Metascore value
  imdbRating: string; // IMDb rating
  imdbVotes: string; // Number of IMDb votes
  type: string; // Type (e.g., movie)
  DVD: string; // DVD release info (if available)
  boxOffice: string; // Box office earnings
  production: string; // Production studio (if available)
  website: string; // Official website (if available)
  totalSeasons: string | null; // Total seasons (if applicable, for series)
  date: string; // Date of data entry
}

export interface UserPreferences {
  type: string;
  genres: { en: string; bg: string }[];
  moods: string[];
  timeAvailability: string;
  age: string;
  actors: string;
  directors: string;
  interests: string;
  countries: string;
  pacing: string;
  depth: string;
  targetGroup: string;
}

export interface RecommendationsProps {
  recommendationList: Movie[];
}

export interface MovieCardProps {
  recommendationList: Movie[];
  currentIndex: number;
  isExpanded: boolean;
  openModal: () => void;
}

export interface PlotModalProps {
  recommendationList: Movie[];
  currentIndex: number;
  closeModal: () => void;
}

export interface QuizQuestionProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  showViewRecommendations: boolean;
  alreadyHasRecommendations: boolean;
  setRecommendationList: React.Dispatch<React.SetStateAction<any[]>>;
}

export interface ViewRecommendationsProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  setShowQuestion: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ConfirmationModalProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmit: (
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setSubmitted: React.Dispatch<React.SetStateAction<boolean>>,
    setSubmitCount: React.Dispatch<React.SetStateAction<number>>,
    setRecommendationList: React.Dispatch<React.SetStateAction<any[]>>,
    userPreferences: UserPreferences,
    token: string | null,
    submitCount: number
  ) => Promise<void>;
  setSubmitCount: React.Dispatch<React.SetStateAction<number>>;
  setRecommendationList: React.Dispatch<React.SetStateAction<any[]>>;
  userPreferences: UserPreferences;
  token: string | null;
  submitCount: number;
}

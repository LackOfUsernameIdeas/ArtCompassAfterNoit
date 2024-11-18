// helper_functions.ts

import {
  FilteredTableData,
  DirectorData,
  ActorData,
  WriterData,
  GenrePopularityData,
  HeatmapData,
  MovieProsperityData,
  MovieData
} from "./home-types";

// Type guards for filtering
export const isDirector = (
  item: DirectorData | ActorData | WriterData
): item is DirectorData => "director" in item;

export const isActor = (
  item: DirectorData | ActorData | WriterData
): item is ActorData => "actor" in item;

export const isWriter = (
  item: DirectorData | ActorData | WriterData
): item is WriterData => "writer" in item;

export const fetchData = async (
  token: string,
  setUserData: React.Dispatch<React.SetStateAction<any>>,
  setData: React.Dispatch<React.SetStateAction<any>>
) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/stats/platform/all`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
    );
    if (!response.ok) throw new Error("Failed to fetch data");
    const data = await response.json();

    setUserData(data.user);
    setData(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const filterTableData = (
  filteredTableData: FilteredTableData,
  prosperitySortCategory: string,
  currentTablePage: number,
  itemsPerTablePage: number
): FilteredTableData => {
  let newItems: FilteredTableData = [];
  switch (prosperitySortCategory) {
    case "Directors":
      newItems = filteredTableData.filter((item) => "director" in item);
      break;
    case "Actors":
      newItems = filteredTableData.filter((item) => "actor" in item);
      break;
    case "Writers":
      newItems = filteredTableData.filter((item) => "writer" in item);
      break;
    default:
      newItems = [];
  }
  return newItems.slice(
    (currentTablePage - 1) * itemsPerTablePage,
    currentTablePage * itemsPerTablePage
  );
};

export const paginateData = (
  filteredTableData: FilteredTableData,
  currentTablePage: number,
  itemsPerTablePage: number
): FilteredTableData => {
  return filteredTableData.slice(
    (currentTablePage - 1) * itemsPerTablePage,
    currentTablePage * itemsPerTablePage
  );
};

const sortByCategory = (
  seriesData: MovieData[],
  category: string
): MovieData[] => {
  return category === "IMDb"
    ? seriesData.sort((a, b) => b.imdbRating - a.imdbRating)
    : category === "Metascore"
    ? seriesData.sort((a, b) => b.metascore - a.metascore)
    : seriesData.sort((a, b) => b.rottenTomatoes - a.rottenTomatoes);
};

// Function to paginate data for the bar chart after sorting by rating
export const paginateBarChartData = (
  seriesData: MovieData[],
  currentPage: number,
  pageSize: number,
  category?: string
): MovieData[] => {
  const sortedData = category
    ? sortByCategory(seriesData, category)
    : seriesData;

  // Now paginate the sorted data
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  return sortedData.slice(start, end);
};

// Function to handle page change, keeping the logic for next/prev buttons intact
export const handleBarChartPageChange = (
  direction: "next" | "prev",
  currentPage: number,
  pageSize: number,
  totalItems: number,
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
) => {
  const totalPages = Math.ceil(totalItems / pageSize);
  let newPage = currentPage;

  if (direction === "next" && newPage < totalPages) {
    // Ensure you don't exceed totalPages
    newPage++;
  } else if (direction === "prev" && newPage > 1) {
    // Ensure you don't go below 1
    newPage--;
  }

  setCurrentPage(newPage);
};

// Helper function to get the total pages for the bar chart
export const getTotalBarChartPages = (
  totalItems: number,
  pageSize: number
): number => {
  return Math.ceil(totalItems / pageSize);
};

export const handleDropdownClick = (
  setName: React.Dispatch<React.SetStateAction<string>>,
  setValue: React.Dispatch<React.SetStateAction<number>>,
  name: string,
  value: number
) => {
  setName(name);
  setValue(value);
};

export const handleProsperityTableClick = (
  category: string,
  setProsperitySortCategory: React.Dispatch<React.SetStateAction<string>>
) => {
  setProsperitySortCategory(category);
};

export const handleMoviesAndSeriesSortCategory = (
  category: string,
  setMoviesAndSeriesSortCategory: React.Dispatch<React.SetStateAction<string>>
) => {
  setMoviesAndSeriesSortCategory(category);
};

export const handleTopStatsSortCategory = (
  category: string,
  setTopStatsSortCategory: React.Dispatch<React.SetStateAction<string>>
) => {
  setTopStatsSortCategory(category);
};

export const generateHeatmapSeriesData = (
  data: GenrePopularityData
): HeatmapData => {
  const years = Object.keys(data); // Get the list of years
  const genreNames = new Set<string>(); // To store unique genre names

  // Collect all unique genre names across all years
  years.forEach((year) => {
    const genresInYear = Object.keys(data[year]);

    genresInYear.forEach((genreKey) => {
      const genreData = data[year][genreKey];
      genreNames.add(genreData.genre_bg);
    });
  });

  // Create the series data for each genre (using genre_bg as the genre name)
  const series = [...genreNames].map((genreBg) => {
    const seriesData = years.map((year) => {
      const genreData = data[year];
      const genre = Object.values(genreData).find(
        (item) => item.genre_bg === genreBg
      );

      return {
        x: year,
        y: genre ? genre.genre_count : 0
      };
    });

    return {
      name: genreBg,
      data: seriesData
    };
  });

  return series;
};

export const generateScatterSeriesData = (
  movies: MovieProsperityData[]
): MovieData[] => {
  return movies.map((movie) => {
    // Parse IMDb rating
    const imdbRating = parseFloat(movie.imdbRating);
    const metascore = parseFloat(movie.metascore);
    const rottenTomatoes = parseFloat(movie.rotten_tomatoes);

    // Clean the box office string and parse it as a number
    const boxOffice = parseInt(
      movie.total_box_office.replace(/[^0-9.-]+/g, "") // Remove non-numeric characters (e.g., $, commas)
    );

    return {
      title: movie.title_bg,
      title_bg: movie.title_bg,
      title_en: movie.title_en,
      boxOffice: boxOffice,
      imdbRating: imdbRating,
      metascore: metascore,
      rottenTomatoes: rottenTomatoes
    };
  });
};

export function parseBoxOffice(value: string | number): number {
  if (typeof value === "string") {
    return parseFloat(value.replace(/[\$,]/g, ""));
  }
  return value;
}

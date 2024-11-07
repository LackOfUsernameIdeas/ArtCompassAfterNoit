// helper_functions.ts

import {
  FilteredTableData,
  DirectorData,
  ActorData,
  WriterData,
  GenrePopularityData,
  HeatmapData
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
  prosperitySortCategory: string,
  setUserData: React.Dispatch<React.SetStateAction<any>>,
  setData2: React.Dispatch<React.SetStateAction<any>>,
  setFilteredTableData: React.Dispatch<React.SetStateAction<FilteredTableData>>
) => {
  try {
    const response = await fetch("http://localhost:5000/stats/platform/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error("Failed to fetch data");
    const data = await response.json();

    // Set user and platform data from the response
    setUserData(data.user); // assuming 'user' is part of the returned data
    setData2(data); // The platform data
    setFilteredTableData(data[`sorted${prosperitySortCategory}ByProsperity`]);
  } catch (error) {
    console.error("Error fetching data:", error);
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

export const handleDropdownClick = (
  setDisplayedNameAwards: React.Dispatch<React.SetStateAction<string>>,
  setDisplayedValueAwards: React.Dispatch<React.SetStateAction<string>>,
  name: string,
  value: string
) => {
  setDisplayedNameAwards(name);
  setDisplayedValueAwards(value);
};

export const handleProsperityTableClick = (
  category: string,
  setProsperitySortCategory: React.Dispatch<React.SetStateAction<string>>
) => {
  setProsperitySortCategory(category);
};

// Filter data based on name matching
export const myFunction = (
  idx: string,
  Dealsstatistics: any[],
  setData: React.Dispatch<React.SetStateAction<any[]>>
) => {
  let filteredData = Dealsstatistics.filter((data) => {
    if (data.name[0] === " ") {
      data.name = data.name.trim();
    }
    return data.name.toLowerCase().includes(idx.toLowerCase());
  });
  setData(filteredData);
};

export const generateHeatmapSeriesData = (
  data: GenrePopularityData
): HeatmapData => {
  const years = Object.keys(data); // Get the list of years
  const genreNames = new Set<string>(); // To store unique genre names

  // Collect all unique genre names across all years
  years.forEach((year) => {
    const genresInYear = Object.keys(data[year]);
    genresInYear.forEach((genre) => genreNames.add(genre));
  });

  // Create the series data for each genre
  const series = [...genreNames].map((genre) => {
    const seriesData = years.map((year) => {
      const genreData = data[year][genre];
      return {
        x: year, // The year as x-axis
        y: genreData ? genreData.genre_count : 0 // Genre count as y-axis (0 if not available)
      };
    });

    return {
      name: genre, // Genre name
      data: seriesData // Data for this genre
    };
  });

  return series;
};

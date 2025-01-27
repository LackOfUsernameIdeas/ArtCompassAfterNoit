import { DataType } from "./choose-types";

/**
 * Генерира опции за награди въз основа на предоставените данни.
 *
 * @param {DataType} data - Данни за награди и номинации.
 * @returns {Array<{label: string, value: number}>} Списък с опции за награди.
 */
export const getAwardOptions = (
  data: DataType
): Array<{ label: string; value: number }> => [
  {
    label: "Общ брой спечелени награди",
    value: data.totalAwards?.[0]?.total_awards_wins || 0
  },
  {
    label: "Общ брой номинации за награди",
    value: data.totalAwards?.[0]?.total_awards_nominations || 0
  },
  {
    label: "Общ брой спечелени Оскари",
    value: data.totalAwards?.[0]?.total_oscar_wins || 0
  },
  {
    label: "Общ брой номинации за Оскари",
    value: data.totalAwards?.[0]?.total_oscar_nominations || 0
  }
];

/**
 * Генерира опции за средни стойности въз основа на предоставените данни.
 *
 * @param {DataType} data - Данни за средни стойности.
 * @returns {Array<{label: string, value: number}>} Списък с опции за средни стойности.
 */
export const getAveragesOptions = (
  data: DataType
): Array<{ label: string; value: number }> => [
  {
    label: "Среден Боксофис",
    value: data.averageBoxOfficeAndScores?.[0]?.average_box_office || 0
  },
  {
    label: "Среден Метаскор",
    value: data.averageBoxOfficeAndScores?.[0]?.average_metascore || 0
  },
  {
    label: "Среден IMDb Рейтинг",
    value: data.averageBoxOfficeAndScores?.[0]?.average_imdb_rating || 0
  },
  {
    label: "Среден Rotten Tomatoes Рейтинг",
    value: data.averageBoxOfficeAndScores?.[0]?.average_rotten_tomatoes || 0
  }
];

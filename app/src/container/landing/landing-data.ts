import { DataType } from "./landing-types";

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

/**
 * Информация за средните показатели на филмите.
 */
export const averagesInfo = {
  "Среден Боксофис":
    "Общата сума на приходите от продажба на билети в киносалоните. Измерва се в милиони или милиарди долари и е ключов показател за търговския успех на филма.",
  "Среден IMDb Рейтинг":
    "Средна оценка, която даден филм получава от потребителите на IMDb. Оценките варират от 1 до 10 и отразяват популярността и качеството на филма или сериала.",
  "Среден Метаскор":
    "Оценка от платформата Metacritic, която събира рецензии от критици и ги преобразува в обща числова стойност (от 0 до 100). Средният Metascore рейтинг е усреднената стойност на тези оценки за даден/и филм/и.",
  "Среден Rotten Tomatoes Рейтинг":
    "Rotten Tomatoes е платформа, показваща процента на положителните рецензии от критици (Tomatometer) или от зрители (Audience Score). Средният рейтинг е средната оценка (от 0 до 10) на всички ревюта, вместо просто процента на положителните."
};

/**
 * Информация за наградите и номинациите на филмите.
 */
export const awardsInfo = {
  "Общ брой спечелени награди":
    "Общият брой на всички спечелени награди, включително и Оскари, на филмите и сериалите в платформата.",
  "Общ брой номинации за награди":
    "Общият брой на всички номинации за награди, включително и на тези за Оскари, на филмите и сериалите в платформата.",
  "Общ брой спечелени Оскари":
    "Общият брой на спечелените награди Оскар за филмите в платформата.",
  "Общ брой номинации за Оскари":
    "Общият брой на номинациите за награди Оскар за филмите в платформата."
};

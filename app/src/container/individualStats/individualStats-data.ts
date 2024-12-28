import { Category, DataType } from "./individualStats-types";

/**
 * Мапинг на имената за категорията на рейтингите.
 *
 * @type {Record<"IMDb" | "Metascore" | "RottenTomatoes", string>}
 */
export const moviesAndSeriesCategoryDisplayNames: Record<
  "IMDb" | "Metascore" | "RottenTomatoes",
  string
> = {
  IMDb: "IMDb Рейтинг",
  Metascore: "Метаскор",
  RottenTomatoes: "Rotten Tomatoes Рейтинг"
};

/**
 * Мапинг на имената за категориите на таблицата.
 *
 * @type {Record<Category, string>}
 */
export const tableCategoryDisplayNames: Record<Category, string> = {
  Directors: "Режисьори",
  Actors: "Актьори",
  Writers: "Сценаристи"
};

/**
 * Генерира опции за награди въз основа на предоставените данни.
 *
 * @param {DataType} data - Данни за награди и номинации.
 * @returns {Array<{label: string, value: number}>} Списък с опции за награди.
 */
export const getAwardOptions = (data: DataType) => [
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
export const getAveragesOptions = (data: DataType) => [
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

export const Data2 = [
  [
    "24-10-2022 12:47",
    "john",
    "john123@gmail.com",
    "#12012",
    "smart watch",
    "electronics",
    "$1799",
    "1",
    "$1799"
  ],
  [
    "12-09-2022 04:24",
    "mark",
    "markzenner23@gmail.com",
    "#12013",
    "blue Jeans",
    "clothing",
    "$2479",
    "2",
    "$4958"
  ],
  [
    "18-11-2022 18:43",
    "eoin",
    "eoin1992@gmail.com",
    "#12014",
    "g phone",
    "mobiles",
    "$769",
    "1",
    "$769"
  ],
  [
    "10-09-2022 10:35",
    "sarahcdd",
    "sarahcdd129@gmail.com",
    "#12015",
    "head phones",
    "electronics",
    "$1299",
    "3",
    "$3997"
  ],
  [
    "27-10-2022 09:55",
    "afshin",
    "afshin@example.com",
    "#12016",
    "chair",
    "furniture",
    "$1449",
    "1",
    "$1449"
  ]
];

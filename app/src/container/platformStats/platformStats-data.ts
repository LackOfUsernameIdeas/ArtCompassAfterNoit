import { Category, DataType } from "./platformStats-types";

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

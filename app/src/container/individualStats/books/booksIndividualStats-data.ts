import { Category } from "./booksIndividualStats-types";

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

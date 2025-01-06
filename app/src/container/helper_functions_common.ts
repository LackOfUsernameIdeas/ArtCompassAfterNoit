import { NotificationState, NotificationType } from "./types_common";

/**
 * Изпраща уведомление със съобщение и тип към състоянието на уведомления.
 * Използва се за показване на различни уведомления (например: успех, грешка и т.н.).
 *
 * @function showNotification
 * @param {React.Dispatch<React.SetStateAction<NotificationState | null>>} setNotification - Функция за задаване на състоянието на уведомлението.
 * @param {string} message - Съобщението, което ще бъде показано в уведомлението.
 * @param {NotificationType} type - Типът на уведомлението, например: 'успех', 'грешка', 'информация' и т.н.
 * @returns {void} - Функцията не връща стойност, а само актуализира състоянието на уведомлението.
 */
export const showNotification = (
  setNotification: React.Dispatch<
    React.SetStateAction<NotificationState | null>
  >,
  message: string,
  type: NotificationType
) => {
  // Актуализира състоянието на уведомлението със съобщение и тип
  setNotification({ message, type });
};

/**
 * Превежда текста от английски на български, като използва Google Translate API.
 * Ако заявката за превод е неуспешна, се връща оригиналният текст.
 *
 * @async
 * @function translate
 * @param {string} entry - Текстът, който трябва да бъде преведен.
 * @returns {Promise<string>} - Преведеният текст на български език.
 * @throws {Error} - Хвърля грешка, ако не успее да преведе текста.
 */
export async function translate(entry: string): Promise<string> {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=bg&dt=t&q=${encodeURIComponent(
    entry
  )}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const flattenedTranslation = data[0]
      .map((item: [string]) => item[0])
      .join(" ");

    const mergedTranslation = flattenedTranslation.replace(/\s+/g, " ").trim();
    return mergedTranslation;
  } catch (error) {
    console.error(`Error translating entry: ${entry}`, error);
    return entry;
  }
}

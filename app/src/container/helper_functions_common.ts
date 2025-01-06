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

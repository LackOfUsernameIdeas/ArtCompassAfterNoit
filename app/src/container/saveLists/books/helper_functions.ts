// ==============================
// Импортиране на типове и интерфейси
// ==============================
import { BookRecommendation } from "@/container/types_common";
import { DataType } from "./readlist-types";
import { SetStateAction } from "react";

// ==============================
// Функции за работа с данни
// ==============================

/**
 * Извлича данни от API за платформата и ги запазва в състоянието.
 *
 * @param {string} token - Токен за удостоверяване.
 * @param {React.Dispatch<React.SetStateAction<any>>} setData - Функция за задаване на общи данни.
 * @throws {Error} - Хвърля грешка, ако заявката е неуспешна.
 */
export const fetchData = async (
  token: string,
  setData: React.Dispatch<React.SetStateAction<any>>,
  setLoading: React.Dispatch<React.SetStateAction<any>>
): Promise<void> => {
  try {
    // Fetch statistics data independently
    const endpoints = [
      {
        key: "topRecommendationsReadlist",
        endpoint: "/stats/individual/readlist",
        method: "POST",
        body: { token: token }
      }
    ];

    // Loop over each endpoint, fetch data, and update state independently
    const fetchPromises = endpoints.map(
      async ({ key, endpoint, method, body }) => {
        try {
          const res = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}${endpoint}`,
            {
              method: method,
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
              },
              body: method === "POST" ? JSON.stringify(body) : undefined
            }
          );
          const data = await res.json();
          // Replace response with an empty array if it contains a `message` field
          const processedData =
            data && typeof data === "object" && data.message ? [] : data;
          setData({
            topRecommendationsReadlist: [
              {
                id: 153,
                user_id: 1,
                google_books_id: "d_nzjwEACAAJ",
                goodreads_id: null,
                title_en: "Ms. Marvel",
                original_title: null,
                title_bg: "Мис Марвел Том 1: Не е нормално",
                real_edition_title:
                  "Ms. Marvel Volume 1: No Normal - G. Willow Wilson - Google Books",
                author: "Г. Уилоу Уилсън",
                genre_en:
                  '{"Comics & Graphic Novels":["Crime & Mystery","Superheroes"]}',
                genre_bg:
                  '{"Комикси и графични романи":["Престъпление и мистерия","Биография"]}',
                description:
                  "Marvel Comics представя изцяло новата г-жа Marvel, новаторската героиня, която се превърна в международна сензация! Камала Хан е обикновено момиче от Джърси Сити - докато изведнъж не бъде упълномощена с изключителни подаръци. Но кой наистина е изцяло новата г-жа Marvel? Тийнейджър? Мюсюлманин? Нечовешки? Разберете, докато тя приема вселената на Marvel от буря! Докато Камала открива опасностите от новооткритите си сили, тя отключва тайна и зад тях. Готова ли е Камала да притежава тези огромни нови подаръци? Или тежестта на наследството преди нея ще бъде твърде много, за да се справи? Камала също няма представа. Но тя се занимава с теб, Ню Йорк! Това е история в създаването от аплодирания писател Г. Уилоу Уилсън (AIR, Кайро) и любимия художник Адриан Алфона (Runaways)! Събиране: MS. Marvel 1-5, Материал от изцяло новото Marvel сега! Точка първа",
                language: "Английски",
                origin: "Американска литература",
                date_of_first_issue: null,
                date_of_issue: "2014",
                publisher:
                  "Marvel Worldwide, Incorporated, дъщерно дружество на Marvel Entertainment, LLC",
                goodreads_rating: "4.10",
                goodreads_ratings_count: null,
                goodreads_reviews_count: null,
                reason:
                  "Тази книга е оптимистична и вдъхновяваща, идеална за тийнейджъри, обичащи комикси.",
                adaptations: "Телевизионен сериал 'Ms. Marvel' (2022)",
                ISBN_10: "0606388702",
                ISBN_13: "9780606388702",
                page_count: 120,
                book_format: null,
                imageLink:
                  "http://books.google.com/books/content?id=d_nzjwEACAAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE71_6mJ658jVrnL3HTdqbjK06dwQ_ignV3F8VoWxmQtR5caaHXrlzfIHDyfdCN81yMpil1d0iQ68Vzv8MnL5LYXLi2zIUCaxNArNmnACXMOPAI3FFvE1Cn8MR4Bnl1fYpWaxRS2m&source=gbs_api",
                literary_awards: null,
                setting: null,
                characters: null,
                series: null,
                source: "GoogleBooks"
              },
              {
                id: 157,
                user_id: 1,
                google_books_id: "MXizoQEACAAJ",
                goodreads_id: null,
                title_en: "Nimona",
                original_title: null,
                title_bg: "Нимона",
                real_edition_title: "Nimona - Noelle Stevenson - Google Books",
                author: "Ноел Стивънсън",
                genre_en:
                  '{"Young Adult Fiction":["Comics & Graphic Novels","Fantasy","Humorous"]}',
                genre_bg:
                  '{"Млада художествена литература за възрастни":["Комикси и графични романи","Биографии","Общи","Хумористично"]}',
                description:
                  "Индии избор Книга на годината * Финалист на Националната книга на книгата * New York Times Bestseller * New York Times Забележителна книга * Kirkus Best Book * School Library Journal Best Book * Издатели Седмична най -добра книга * NPR Най -добра книга * Ню Йорк публична библиотека Най -добрата книга * Чикаго Public Library Best Bookithe New York Times бестселъри за графичен роман от Ноел Стивънсън, базиран на любимия и критично признат уеб комикс. Киркус казва: „Ако тази година ще прочетете един графичен роман, направете го този.“ Nemeses! Дракони! Наука! Символика! Всичко това и по -голямо очакване в този блестящо подривен, рязко непочтителен епос от Ноел Стивънсън. С участието на ексклузивен епилог, който не се вижда в уеб комикса, заедно с бонус концептуални скици и преработени страници навсякъде, този великолепен пълноцветни графични романи е приветстван от критици и фенове като пристигането на талант на „суперзвезда“ (NPR.org) .Nimona е импулсивен млад формист с умение за злодей.",
                language: "Английски",
                origin: "Американска литература",
                date_of_first_issue: null,
                date_of_issue: "2015-05-12",
                publisher: "HarperCollins",
                goodreads_rating: "4.20",
                goodreads_ratings_count: null,
                goodreads_reviews_count: null,
                reason:
                  "Творчески и уникален комикс, който носи оптимизъм и е подходящ за тийнейджъри.",
                adaptations: "Предстоящ анимационен филм 'Nimona' (2023)",
                ISBN_10: "0062278223",
                ISBN_13: "9780062278227",
                page_count: 272,
                book_format: null,
                imageLink:
                  "http://books.google.com/books/content?id=MXizoQEACAAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE7092u0oMdjsIGEiSeNJwNTjgbQ6Rqelof8rD1Jv-jQ3pri9t6M2Zn6RBrN8WcX7KekRmapewwN9cXmQEZ5gf1GxELLL9vsGyz4jQIQbz1bXHn0W9Ua8X5__4aRXpiYeHeDB4vPQ&source=gbs_api",
                literary_awards: null,
                setting: null,
                characters: null,
                series: null,
                source: "GoogleBooks"
              },
              {
                id: 146,
                user_id: 1,
                google_books_id: null,
                goodreads_id: "70401",
                title_en: "On the Road",
                original_title: "On the Road",
                title_bg: "По пътя",
                real_edition_title: "On the Road - Jack Kerouac - Goodreads",
                author: "Джак Керуак",
                genre_en:
                  "Fiction, Travel, Literature, Classics, Novels, American, Adventure, Modern Classics, 20th Century, The United States Of America",
                genre_bg:
                  "Художествена литература, Пътуване, Литература, Класика, Романи, Американски, Приключения, Модерна класика, 20 век, Съединените американски щати",
                description:
                  'Квисилен роман на „Америка и поколението на ритъма“ на пътя хроникира годините на Джак Керуак, пътуващ на Американския континент на Н. с приятеля си Нийл Касади, „Сърдечен герой на„ Снежния запад “. Като "Sal Paradise" и "Dean Moriarty", двамата обикалят страната в стремеж за самопознание и опит. Любовта на Керуак към Америка, състраданието към човечеството и чувството за език като джаз се комбинира, за да направи по пътя вдъхновяващо произведение с трайно значение. Този класически роман за свободата и копнежа определи какво означава да бъде „бит“ и вдъхнови всяко поколение от първоначалната си публикация.',
                language: "Английски",
                origin: "Американска литература",
                date_of_first_issue: "September 5, 1957",
                date_of_issue: "January 01, 1976",
                publisher: "Пингвин книги",
                goodreads_rating: "3.61",
                goodreads_ratings_count: 428421,
                goodreads_reviews_count: 21157,
                reason:
                  "Този класически роман е свързан с пътуванията и е подходящ за читатели, търсещи класическа литература с тема за пътешествия.",
                adaptations: "Филм 'По пътя' (2012)",
                ISBN_10: "0140042598",
                ISBN_13: "9780140042597",
                page_count: 307,
                book_format: "Paperback",
                imageLink:
                  "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1658929891i/70401.jpg",
                literary_awards: "Grammy Award (2001)",
                setting:
                  "Denver, Colorado (United States, None), San Francisco, California (United States, None), Los Angeles, California (United States, None), New York City, New York (United States, None), New Orleans, Louisiana (United States, None), California (United States,",
                characters: "Jack Kerouac",
                series: null,
                source: "Goodreads"
              },
              {
                id: 147,
                user_id: 1,
                google_books_id: null,
                goodreads_id: "8520610",
                title_en:
                  "Quiet: The Power of Introverts in a World That Can't Stop Talking",
                //@ts-ignore
                original_title:
                  "Quiet: The Power of Introverts in a World That Can't Stop Talking",
                title_bg:
                  "Тихо: Силата на интровертите в свят, който не може да спре да говори",
                real_edition_title:
                  "Quiet: The Power of Introverts in a World That Can't Stop Talking - Susan Cain - Goodreads",
                author: "Сюзън Кейн",
                genre_en:
                  "Nonfiction, Psychology, Self Help, Audiobook, Business, Personal Development, Sociology, Leadership, Adult, Mental Health",
                genre_bg:
                  "Нефилтиране, Психология, Самопомощ, Аудиокнига, Бизнес, Личностно развитие, Социология, Лидерство, Възрастни, Психично здраве",
                description:
                  "Книгата, която започна тихата революция, най-малко една трета от хората, които познаваме, са интроверти. Те са тези, които предпочитат да слушат да говорят; Който иновации и създаване, но не харесва самореклама; които предпочитат работата по себе си над работата в екипи. Това е да интровертите - Rosa Parks, Chopin, Dr. Seuss, Steve Wozniak - че дължим на много от големите приноси на обществото. Инвиат, Сюзън Кейн твърди, че драстично подценяваме интровертите и показва колко губим в това. Тя очертава възхода на идеала за екстроверт през целия ХХ век и изследва колко дълбоко е дошло да проникне в нашата култура. Тя също ни запознава с успешните интроверти-от остроумен, високооктанов публичен оратор, който се презарежда в уединение след разговорите си, на рекорден продавач, който тихо се вписва в силата на въпросите. Страстно спори, превъзходно проучва и изпълнен с незаличими истории на истински хора, Quiethas Силата за постоянно променя начина, по който виждаме интроверти и, също толкова",
                language: "Английски",
                origin: "Американска литература",
                date_of_first_issue: "January 24, 2012",
                date_of_issue: "January 24, 2012",
                publisher: "Crown Publishing Group/Random House, Inc.",
                goodreads_rating: "4.08",
                goodreads_ratings_count: 455786,
                goodreads_reviews_count: 30523,
                reason:
                  "Тази книга помага на тийнейджъри, които се чувстват разтревожени, да разберат и оценят своята интровертност и как тя може да бъде сила в социално ориентирания свят.",
                adaptations: "Няма известни адаптации",
                ISBN_10: "0307352145",
                ISBN_13: "9780307352149",
                page_count: 333,
                book_format: "Hardcover",
                imageLink:
                  "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1328562861i/8520610.jpg",
                literary_awards:
                  "Guardian First Book Award (2012), Andrew Carnegie Medal (2015), Goodreads Choice Award (2012)",
                setting: null,
                characters: null,
                series: null,
                source: "Goodreads"
              }
            ]
          } as DataType);
        } catch (error) {
          return console.error(`Error fetching ${key}:`, error);
        }
      }
    );
    Promise.all(fetchPromises).finally(() => setLoading(false));
  } catch (error) {
    console.error("Error in fetchData:", error);
    throw error;
  }
};

/**
 * Функция за обработка на жанрове.
 * Ако жанровете са подадени като string, се опитваме да ги парсираме в JSON формат.
 * Ако парсирането не успее, се връща null.
 *
 * @param {any} resolvedGenres - Жанрове, които могат да бъдат string или обект.
 * @returns {any} Върща парсираните жанрове или оригиналния обект.
 */
export const parseResolvedGenres = async (resolvedGenres: any) => {
  // Обработка на string
  if (typeof resolvedGenres === "string") {
    try {
      return JSON.parse(resolvedGenres); // Опит за парсиране на JSON ако е string
    } catch (error) {
      console.warn("Неуспешно парсиране на жанрове от string:", resolvedGenres);
      return null; // Връщане на null, ако парсирането не е успешно
    }
  }
  return resolvedGenres;
};

/**
 * Функция за обработка на жанровете за Google Books API.
 * Преобразува жанровете в string-ове, които могат да се покажат на потребителя.
 *
 * @param {any} genres - Жанровете, които ще бъдат обработени.
 * @param {(value: SetStateAction<string[]>) => void} setGenres - Функция за сетване на жанровете в state.
 */
export const processGenresForGoogleBooks = (
  genres: any,
  setGenres: (value: SetStateAction<string[]>) => void
) => {
  if (genres && typeof genres === "object") {
    const genreEntries = Object.entries(genres);
    const genreStrings = genreEntries.map(([category, subGenres]) => {
      return `${category}: ${
        Array.isArray(subGenres)
          ? subGenres.join(", ")
          : subGenres || "Няма поджанрове"
      }`;
    });
    setGenres(genreStrings);
  } else {
    console.warn("Неочакван формат за жанровете на Google Books:", genres);
    setGenres(["Няма жанрове за показване."]);
  }
};

/**
 * Форматира жанровете, като обработва JSON или връща жанра с главна буква.
 * @param {string | null} genre - Жанрът в текстов или JSON формат.
 * @returns {string} - Форматиран списък с жанрове или съобщение, ако липсва.
 */
export const formatGenres = (genre: string | null): string => {
  if (!genre) return "Няма жанр";

  try {
    const parsed = JSON.parse(genre);
    if (typeof parsed === "object" && !Array.isArray(parsed)) {
      return [...new Set(Object.values(parsed).flat())]
        .map((g) =>
          typeof g === "string" ? g.charAt(0).toUpperCase() + g.slice(1) : ""
        )
        .join(", ");
    }
  } catch {}

  return genre.charAt(0).toUpperCase() + genre.slice(1);
};

/**
 * Извлича автори, издатели от подадения обект.
 *
 * @param {Object} item - Обектът, съдържащ информация за книгата.
 * @param {string} [item.author] - Списък с автори, разделени със запетая.
 * @param {string} [item.publisher] - Списък с издатели, разделени със запетая.
 * @returns {Object} - Обект със свойства `authors` и `publishers`.
 */
export const extractItemFromStringList = (
  item: any
): {
  authors: string[];
  publishers: string[];
} => {
  const exclusions = ["LLC", "INC.", "INCORPORATED"];

  const authors = item.author
    ? item.author.split(",").map((author: string) => author.trim())
    : [];

  const publishers = item.publisher
    ? item.publisher
        .split(",")
        .map((publisher: string) => publisher.trim())
        .filter(
          (publisher: string) =>
            !exclusions.some((excluded) =>
              publisher.toUpperCase().endsWith(excluded)
            )
        )
    : [];

  return { authors, publishers };
};

/**
 * Извлича годината от дадена дата.
 * @param {string} date - Дата във формат ISO или друг валиден формат.
 * @returns {number | null} - Годината като число или `null`, ако датата не е валидна.
 */
export const extractYear = (date: string): number | null => {
  const parsedDate = new Date(date);
  return isNaN(parsedDate.getTime()) ? null : parsedDate.getFullYear();
};

/**
 * Жанровете, които си съответстват
 * @param {string} key - Жанрът, който е главен и се използва за филтриране
 * @returns {number | null} - Кейсове, които означават едно и също като главния жанр. Tе се търсят когато главният жанр е избран.
 */
export const genresCorrespondanceMapping: {
  [key: string]: string[];
} = {
  Биография: ["Биография", "Биографии"],
  "Историческа фикция": ["Историческа фикция", "Исторически"],
  "Литературна фикция": ["Литературна фикция", "Художествена литература"],
  "Хумор и комедия": ["Хумор и комедия", "Хумористично", "Хумор"]
};

/**
 * Жанровете, които си отпадат
 * @param {string} key - Жанрът, който е главен и се използва за сортиране
 * @returns {string[]} - Кейсове, които означават едно и също като главния жанр. Tе не се визуализират в менюто за сортиране.
 */
const redundantGenresMapping: Record<string, string[]> = {
  Биография: ["Биографии"],
  "Историческа фикция": ["Исторически"],
  "Литературна фикция": ["Художествена литература"],
  "Хумор и комедия": ["Хумор", "Хумористично"]
};

/**
 * Търси съответстващи жанрове спрямо главен жанр.
 * @param {string} genre - Жанрът, който се търси
 * @returns {string[]} - Съответстващите жанрове
 */
export const getRelatedGenres = (genre: string) => {
  return genresCorrespondanceMapping[genre] || [genre];
};

/**
 * Връща главен жанр.
 * @param {string} genre - Жанрът, който трябва да бъде проверен.
 * @returns {string} - Главният жанр, ако жанрът съществува в `redundantGenresMapping`, иначе оригиналния жанр.
 */
export const getMainGenre = (genre: string): string => {
  for (const mainGenre in redundantGenresMapping) {
    if (redundantGenresMapping[mainGenre].includes(genre)) {
      return mainGenre;
    }
  }
  return genre;
};

/**
 * Филтрира ненужните, повтарящи се жанрове.
 * @param {Array<{ bg: string }>} genreOptions - Всички жанрове
 * @returns {string[]} - Всички жанрове, без тези които се повтарят (Главни жанрове).
 */
export const processGenres = (genreOptions: Array<{ bg: string }>) =>
  genreOptions
    .filter(
      (genre) =>
        !Object.values(redundantGenresMapping).flat().includes(genre.bg)
    )
    .map((genre) => ({
      ...genre,
      bg: getMainGenre(genre.bg)
    }));

/**
 * Филтрира данните според подадените критерии за жанрове, брой страници, автори, издатели, рейтинг и година на писане.
 *
 * @param {Object} filters - Обект с филтри, които ще се приложат към данните.
 * @param {string[]} filters.genres - Списък с избрани жанрове, по които да се филтрират книгите.
 * @param {string[]} filters.pages - Списък с диапазони за броя страници (напр. "Под 100 страници").
 * @param {string[]} filters.author - Списък с автори, чиито книги да бъдат показани.
 * @param {string[]} filters.publisher - Списък с издатели, чиито книги да бъдат включени.
 * @param {string[]} filters.goodreadsRatings - Списък с диапазони на рейтингите в Goodreads (напр. "Над 4.0").
 * @param {string[]} filters.year - Списък с времеви интервали за годината на писане (напр. "След 2010").
 *
 * @param {BookRecommendation[]} data - Масив от книги, които ще бъдат филтрирани.
 * @param {React.Dispatch<React.SetStateAction<BookRecommendation[]>>} setFilteredData - Функция за актуализиране на състоянието на филтрираните данни.
 * @param {React.Dispatch<React.SetStateAction<number>>} setCurrentPage - Функция за нулиране на страницата на резултатите след прилагане на филтрите.
 *
 * Функцията обработва масив от книги, като проверява дали всяка книга отговаря на избраните критерии.
 * Ако даден филтър е празен, той не ограничава резултатите. Книгите се сравняват по жанр,
 * брой страници, автор, издател, рейтинг и година на писане.
 *
 * @returns {void}
 */
export const handleApplyFilters = (
  filters: {
    genres: string[]; // Филтър по жанрове
    pages: string[]; // Филтър по брой страници
    author: string[]; // Филтър по автори
    publisher: string[]; // Филтър по издатели
    goodreadsRatings: string[]; // Филтър по рейтинг в goodreads
    year: string[]; // Филтър по година на писане
  },
  data: BookRecommendation[],
  setFilteredData: React.Dispatch<React.SetStateAction<BookRecommendation[]>>,
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
) => {
  const filtered = data.filter((item) => {
    const { authors, publishers } = extractItemFromStringList(item);
    const bookGenres = formatGenres(item.genre_bg)
      .split(",")
      .map((genre) => genre.trim());

    const matchesGenre =
      filters.genres.length === 0 ||
      filters.genres.some((selectedGenre) =>
        bookGenres.some((bookGenre) =>
          getRelatedGenres(selectedGenre).some((relatedGenre) =>
            bookGenre.toLowerCase().includes(relatedGenre.toLowerCase())
          )
        )
      );

    const matchesPages =
      filters.pages.length === 0 ||
      filters.pages.some((p) => {
        if (p === "Под 100 страници") return item.page_count < 100;
        if (p === "100 до 200 страници")
          return item.page_count >= 100 && item.page_count <= 200;
        if (p === "200 до 300 страници")
          return item.page_count > 200 && item.page_count <= 300;
        if (p === "300 до 400 страници")
          return item.page_count > 300 && item.page_count <= 400;
        if (p === "400 до 500 страници")
          return item.page_count > 400 && item.page_count <= 500;
        if (p === "Повече от 500 страници") return item.page_count > 500;
        return true;
      });

    const matchesAuthor =
      filters.author.length === 0 ||
      filters.author.some((selectedAuthor) =>
        authors.some((bookAuthor) =>
          bookAuthor.toLowerCase().includes(selectedAuthor.toLowerCase())
        )
      );
    const matchesPublisher =
      filters.publisher.length === 0 ||
      filters.publisher.some((selectedPublisher) =>
        publishers.some((bookPublisher) =>
          bookPublisher.toLowerCase().includes(selectedPublisher.toLowerCase())
        )
      );
    const matchesGoodreadsRating =
      filters.goodreadsRatings.length === 0 ||
      filters.goodreadsRatings.some((range) => {
        const rating = item.goodreads_rating
          ? item.goodreads_rating.toString().trim()
          : "";
        const numericRating = parseFloat(rating); // Това е безопасно, защото 'rating' вече е string
        if (isNaN(numericRating)) return false;

        if (range === "Под 3.0") return numericRating < 3.0;
        if (range === "3.0 до 3.5")
          return numericRating >= 3.0 && numericRating < 3.5;
        if (range === "3.5 до 4.0")
          return numericRating >= 3.5 && numericRating < 4.0;
        if (range === "4.0 до 4.5")
          return numericRating >= 4.0 && numericRating < 4.5;
        if (range === "Над 4.5") return numericRating >= 4.5;

        return true;
      });

    const year = extractYear(item.date_of_issue);
    const matchesYear =
      filters.year.length === 0 ||
      filters.year.some((y) => {
        if (year === null) return false;
        if (y === "Преди 1900") return year < 1900;
        if (y === "1900 до 1950") return year >= 1900 && year <= 1950;
        if (y === "1950 до 1980") return year > 1950 && year <= 1980;
        if (y === "1980 до 2000") return year > 1980 && year <= 2000;
        if (y === "2000 до 2010") return year > 2000 && year <= 2010;
        if (y === "След 2010") return year > 2010;
        return true;
      });

    return (
      matchesGenre &&
      matchesPages &&
      matchesAuthor &&
      matchesPublisher &&
      matchesGoodreadsRating &&
      matchesYear
    );
  });

  setFilteredData(filtered);
  setCurrentPage(1);
};

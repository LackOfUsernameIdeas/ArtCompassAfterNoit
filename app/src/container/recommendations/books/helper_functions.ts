import {
  Genre,
  Question,
  BooksUserPreferences,
  IndustryIdentifier
} from "./booksRecommendations-types";
import { NotificationState } from "../../types_common";
import { openAIKey } from "./booksRecommendations-data";
import { moviesSeriesGenreOptions } from "../../data_common";
import { booksGenreOptions } from "../../data_common";
import {
  checkRecommendationExistsInWatchlist,
  showNotification,
  translate
} from "../../helper_functions_common";
import ISO6391 from "iso-639-1";

/**
 * Записва предпочитанията на потребителя в базата данни чрез POST заявка.
 * Ако не успее да запише предпочитанията, се хвърля грешка.
 *
 * @async
 * @function saveBooksUserPreferences
 * @param {string} date - Датата на записа на предпочитанията.
 * @param {Object} booksUserPreferences - Обект с предпочитанията на потребителя.
 * @param {string | null} token - Токенът на потребителя, използван за аутентификация.
 * @returns {Promise<void>} - Няма връщан резултат, но хвърля грешка при неуспех.
 * @throws {Error} - Хвърля грешка, ако заявката не е успешна.
 */
export const saveBooksUserPreferences = async (
  date: string,
  booksUserPreferences: {
    type: string;
    genres: { en: string; bg: string }[];
    moods: string[];
    timeAvailability: string;
    age: string;
    actors: string;
    directors: string;
    interests: string;
    countries: string;
    pacing: string;
    depth: string;
    targetGroup: string;
  },
  token: string | null
): Promise<void> => {
  try {
    const {
      type,
      genres,
      moods,
      timeAvailability,
      age,
      actors,
      directors,
      interests,
      countries,
      pacing,
      depth,
      targetGroup
    } = booksUserPreferences;

    const preferredGenresEn =
      genres.length > 0 ? genres.map((g) => g.en).join(", ") : null;
    const preferredGenresBg =
      genres.length > 0 ? genres.map((g) => g.bg).join(", ") : null;

    console.log("preferences: ", {
      token: token,
      preferred_genres_en: preferredGenresEn,
      preferred_genres_bg: preferredGenresBg,
      mood: Array.isArray(moods) ? moods.join(", ") : null,
      timeAvailability,
      preferred_age: age,
      preferred_type: type,
      preferred_actors: actors,
      preferred_directors: directors,
      preferred_countries: countries,
      preferred_pacing: pacing,
      preferred_depth: depth,
      preferred_target_group: targetGroup,
      interests: interests || null,
      date: date
    });

    const response = await fetch(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/save-movies-series-user-preferences`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token: token,
          preferred_genres_en: preferredGenresEn,
          preferred_genres_bg: preferredGenresBg,
          mood: Array.isArray(moods) ? moods.join(", ") : null,
          timeAvailability,
          preferred_age: age,
          preferred_type: type,
          preferred_actors: actors,
          preferred_directors: directors,
          preferred_countries: countries,
          preferred_pacing: pacing,
          preferred_depth: depth,
          preferred_target_group: targetGroup,
          interests: interests || null,
          date: date
        })
      }
    );

    if (!response.ok) {
      throw new Error("Failed to save recommendation");
    }

    const result = await response.json();
    console.log("Recommendation saved successfully:", result);
  } catch (error) {
    console.error("Error saving recommendation:", error);
  }
};

/**
 * Извлича данни за филм от IMDb чрез няколко различни търсачки в случай на неуспех.
 * Ако не успее да извлече данни от всички търсачки, хвърля грешка.
 *
 * @async
 * @function fetchGoogleBooksIDWithFailover
 * @param {string} bookName - Името на филма, за който се извличат данни.
 * @returns {Promise<Object>} - Връща обект с данни от IMDb за филма.
 * @throws {Error} - Хвърля грешка, ако не успее да извлече данни от всички търсачки.
 */
const fetchGoogleBooksIDWithFailover = async (bookName: string) => {
  const engines = [
    { key: "AIzaSyDqUez1TEmLSgZAvIaMkWfsq9rSm0kDjIw", cx: "d059d8edb90514692" },
    { key: "AIzaSyArE48NFh1befjjDxpSrJ0eBgQh_OmQ7RA", cx: "422c2707d8062436a" },
    { key: "AIzaSyAUOQzjNbBnGSBVvCZkWqHX7uebGZRY0lg", cx: "46127fd515c5d40be" }
  ];

  for (let engine of engines) {
    try {
      const response = await fetch(
        `https://customsearch.googleapis.com/customsearch/v1?key=${
          engine.key
        }&cx=${engine.cx}&q=${encodeURIComponent(bookName)}`
      );
      const data = await response.json();

      if (response.ok && !data.error && data.items) {
        console.log(
          `Fetched Book data successfully using engine: ${engine.cx}`
        );
        return data;
      } else {
        console.log(`Engine ${engine.cx} failed. Trying next...`);
      }
    } catch (error) {
      console.error(`Error fetching data with engine ${engine.cx}:`, error);
    }
  }
  throw new Error(
    `Failed to fetch Book data for "${bookName}" using all engines.`
  );
};

/**
 * Обработва жанровете на книги от категориите на Google Books, като ги организира в основни категории с уникални подкатегории,
 * включително подкатегории на подкатегориите и всички нива на вложеност.
 *
 * @function processBookGenres
 * @param {string[]} categories - Списък с категории от Google Books API.
 * @param {boolean} translateGenres - Определя дали да се преведат жанровете на български.
 * @returns {Record<string, string[]>} - Обект, където ключовете са основните категории, а стойностите са подкатегории, включително всички нива на вложеност.
 */
export const processBookGenres = async (
  categories: string[],
  translateGenres: boolean = false
): Promise<Record<string, string[]>> => {
  // Инициализиране на обект за съхранение на резултатите
  const genreMap: Record<string, string[]> = {};

  // Рекурсивна функция за добавяне на подкатегории на всички нива
  const addSubCategories = async (
    mainCategory: string,
    subCategories: string[]
  ) => {
    const translatedMain = translateGenres
      ? await translate(mainCategory)
      : mainCategory; // Превеждаме, ако е нужно

    if (!genreMap[translatedMain]) {
      genreMap[translatedMain] = [];
    }

    // Обхождаме всички подкатегории на дадената категория
    for (const subCategory of subCategories) {
      const translatedSub = translateGenres
        ? await translate(subCategory)
        : subCategory; // Превеждаме, ако е нужно
      if (
        translatedSub.toLowerCase() !== "general" &&
        translatedSub.toLowerCase() !== "генерал" &&
        !genreMap[translatedMain].includes(translatedSub)
      ) {
        genreMap[translatedMain].push(translatedSub);
      }
    }
  };

  // Изчакваме всички асинхронни операции да завършат
  const promises = categories.map(async (category) => {
    // Разделяне на категорията на различни нива по " / "
    const parts = category.split(" / ");
    const mainCategory = parts[0].trim(); // Основна категория
    const subCategories = parts.slice(1).map((sub) => sub.trim()); // Всички подкатегории след първоначалната основна категория

    // Рекурсивно добавяне на подкатегориите за всяка категория
    await addSubCategories(mainCategory, subCategories);
  });

  // Изчакваме всички промиси да завършат
  await Promise.all(promises);

  // Връщане на обекта с организираните жанрове
  return genreMap;
};

/**
 * Функция за премахване на HTML тагове от даден текст.
 * @param {string} text - Текстът, който трябва да бъде обработен.
 * @returns {string} - Текстът без HTML тагове.
 */
export const removeHtmlTags = (text: string): string => {
  return text.replace(/<[^>]*>/g, ""); // Регулярен израз за премахване на всички HTML тагове
};

/**
 * Проверява и обработва всички полета от обект, като приоритет се дава на основните данни.
 *
 * @function processDataWithFallback
 * @param {any} primaryData - Основните данни от първичния източник (например Google Books).
 * @param {any} fallbackData - Данните от алтернативния източник (например AI).
 * @returns {any} - Връща наличните данни, като приоритет се дава на основния източник.
 */
export const processDataWithFallback = (
  primaryData: any,
  fallbackData: any
): any => {
  // Проверка дали основните данни са дефинирани и не са null
  if (primaryData !== undefined && primaryData !== null) {
    // Ако данните са стринг, проверява дали са празни след trim()
    if (typeof primaryData === "string" && primaryData.trim() !== "") {
      return primaryData;
    }
    // Ако данните не са стринг, приема ги за валидни
    if (typeof primaryData !== "string") {
      return primaryData;
    }
  }

  // Ако няма основни данни, използваме алтернативния източник
  return fallbackData;
};

/**
 * Генерира препоръки за филми или сериали, базирани на предпочитанията на потребителя,
 * като използва OpenAI API за създаване на списък с препоръки.
 * Връща списък с препоръки в JSON формат.
 *
 * @async
 * @function generateBooksRecommendations
 * @param {string} date - Датата на генерирането на препоръките.
 * @param {BooksUserPreferences} booksUserPreferences - Преференциите на потребителя за филми/сериали.
 * @param {React.Dispatch<React.SetStateAction<any[]>>} setRecommendationList - Функция за задаване на препоръките в компонент.
 * @param {string | null} token - Токенът на потребителя, използван за аутентификация.
 * @returns {Promise<void>} - Няма връщан резултат, но актуализира препоръките.
 * @throws {Error} - Хвърля грешка, ако заявката за препоръки е неуспешна.
 */
export const generateBooksRecommendations = async (
  date: string,
  booksUserPreferences: BooksUserPreferences,
  setRecommendationList: React.Dispatch<React.SetStateAction<any[]>>,
  setBookmarkedMovies: React.Dispatch<
    React.SetStateAction<{
      [key: string]: any;
    }>
  >,
  token: string | null
) => {
  const {
    genres,
    moods,
    authors,
    countries,
    pacing,
    depth,
    targetGroup,
    interests
  } = booksUserPreferences;
  try {
    // const response = await fetch("https://api.openai.com/v1/chat/completions", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${openAIKey}`
    //   },
    //   body: JSON.stringify({
    //     model: "gpt-4o-2024-08-06",
    //     messages: [
    //       {
    //         role: "system",
    //         content:
    //           "Ти си изкуствен интелект, който препоръчва книги и събира подробна информация за всяка една от тях от Google Books. Цялата информация трябва да бъде представена в правилен JSON формат с всички стойности преведени на български език, като заглавието на изданието трябва да бъде точно и реално, за да може лесно да бъде намерено в Google Books."
    //       },
    //       {
    //         role: "user",
    //         content:
    //           "Препоръчай 5 различни книги от колекцията на Google Books, като всяка трябва да бъде популярна, призната от критиката и налична за закупуване или заемане. Книгите трябва да съответстват на следните лични предпочитания:\n1. Любими жанрове: [научна фантастика, мистерия, трилър].\n2. Емоционално състояние: [Тъжен/-на, Любопитен/-на].\n3. Любими автори: [Иван Вазов].\n4. Теми, които ме интересуват: [приятелство, справедливост, предизвикателства в живота].\n5. Книгите могат да бъдат от следните страни: [България].\n6. Целева(Възрастова) група: [тийнеджъри].\n7. Предпочитам книгите да са: [бавни, концентриращи се върху разкази на героите]."
    //       },
    //       {
    //         role: "user",
    //         content:
    //           'Събери подробна информация за всяка книга. Използвай следния JSON формат за отговор: \n\n```\n{\n  "title_en": string,\n  "title_bg": string,\n "real_edition_title": string,\n  "author": string,\n  "genres": string[],\n  "description": string,\n  "edition_language": string,\n  "language": string,\n  "country": string,\n  "date_of_first_issue": number,\n  "date_of_issue": number,\n  "goodreads_rating": string,\n  "reason": string,\n  "adaptations": string,\n  "page_count": number\n}\n```\n\nСтойностите на всички полета трябва да бъдат преведени на български език, освен ако оригиналното съдържание (например корицата или заглавието на английски) не изисква друго. Полето "real_edition_title" трябва да съдържа точния и пълен заглавие на изданието от Google Books, което ще бъде използвано за директно търсене.'
    //       },
    //       {
    //         role: "user",
    //         content:
    //           'Ето допълнителни указания, които трябва да следваш: \n1. Книгите трябва да са разнообразни по жанр (например класика, научна фантастика, романтика и др.).\n2. Включи адаптации на книги (ако има такива) като филми, сериали или театрални постановки, посочвайки имената на тези адаптации и годините на издаване/представяне.\n3. Погрижи се информацията да бъде актуална и точна.\n4. Преведи всички текстови стойности като заглавие, резюме, жанрове, държава и автор на български език.\n5. Винаги превеждай Великобритания като "Великобритания".\n6. Полето "date_of_first_issue" е годината, в която книгата е издадена за първи път, а "date_of_issue" е годината на това конкретно издание на книгата.'
    //       },
    //       {
    //         role: "user",
    //         content:
    //           'Отговори само с JSON обект без допълнителен текст или обяснения, който обхваща ВСИЧКИ препоръки ЗАЕДНО. Например: \n\n```\n{\n  "title_en": "To Kill a Mockingbird",\n  "title_bg": "Да убиеш присмехулник",\n  "real_edition_title": "To Kill a Mockingbird - Harper Lee - Google Books",\n  "author": "Харпър Лий",\n  "genres": ["Южен готик", "Билдунгсроман"],\n  "description": "Романът разказва историята на младата Скаут Финч в южната част на САЩ през 30-те години на XX век, докато тя и брат й Джем се сблъскват с расизъм, морал и справедливост, вдъхновени от баща си Атикус Финч, който защитава чернокож мъж, обвинен несправедливо в изнасилване на бяла жена.",\n  "edition_language": "Английски",\n  "language": "Английски",\n  "country": "САЩ",\n  "date_of_first_issue": 1960,\n  "date_of_issue": 1960,\n  "goodreads_rating": "4.27",\n  "reason": "Отговор на въпроса: Защо този филм/сериал е подходящ за мен?",\n  "adaptations": "Филмова адаптация от 1962 г. и сценична адаптация.",\n  "page_count": 281\n}\n```'
    //       }
    //     ]
    //   })
    // });

    // const responseData = await response.json();
    const responseJson = `[
  {
    "title_en": "Foundation",
    "title_bg": "Фондация",
    "real_edition_title": "Foundation - Isaac Asimov - Google Books",
    "author": "Айзък Азимов",
    "genres": ["Научна фантастика"],
    "description": "Фондация е първата книга от поредицата на Азимов, където ученът Хари Селдон използва психоистория, за да предвиди колапса на галактическата империя и създава фондация, която да намали Падането до само хилядолетие.",
    "edition_language": "Английски",
    "language": "Български",
    "country": "САЩ",
    "date_of_first_issue": 1951,
    "date_of_issue": 1972,
    "goodreads_rating": "4.15",
    "reason": "Първостепенна научна фантастика, която се концентрира върху стратегии и социални динамики.",
    "adaptations": "Сериал 'Foundation' от 2021 г.",
    "page_count": 255
  },
  {
    "title_en": "The Girl with the Dragon Tattoo",
    "title_bg": "Момичето с дракона татуировка",
    "real_edition_title": "The Girl with the Dragon Tattoo - Stieg Larsson - Google Books",
    "author": "Стиг Ларшон",
    "genres": ["Мистерия", "Трилър"],
    "description": "Историята на това криминале следва разследването на изчезването на млада жена преди 40 години, което отвежда журналиста Микаел Блумиквист и хакерката Лисбет Саландер в центъра на семейство, обитавано от много тайни.",
    "edition_language": "Английски",
    "language": "Български",
    "country": "Швеция",
    "date_of_first_issue": 2005,
    "date_of_issue": 2008,
    "goodreads_rating": "4.13",
    "reason": "Сложен и интригуващ трилър с акцент на героите, занимаващ се с теми за справедливост и правдоподобност.",
    "adaptations": "Филм 'The Girl with the Dragon Tattoo' от 2011 г.",
    "page_count": 465
  },
  {
    "title_en": "The Hitchhiker's Guide to the Galaxy",
    "title_bg": "Пътеводител на галактическия стопаджия",
    "real_edition_title": "The Hitchhiker's Guide to the Galaxy - Douglas Adams - Google Books",
    "author": "Дъглас Адамс",
    "genres": ["Научна фантастика", "Комедия"],
    "description": "Започвайки с унищожаването на Земята за небесна магистрала, Артър Дент се изплъзва на космическа одисея из космоса, ръководен от Пътеводителя на стопаджията.",
    "edition_language": "Английски",
    "language": "Български",
    "country": "Великобритания",
    "date_of_first_issue": 1979,
    "date_of_issue": 1981,
    "goodreads_rating": "4.20",
    "reason": "Забавно и остроумно приключение, което разисква приятелството и безсмисленото във вселената.",
    "adaptations": "Филм 'The Hitchhiker's Guide to the Galaxy' от 2005 г.",
    "page_count": 193
  },
  {
    "title_en": "The Shadow of the Wind",
    "title_bg": "Сянката на вятъра",
    "real_edition_title": "The Shadow of the Wind - Carlos Ruiz Zafón - Google Books",
    "author": "Карлос Руис Сафон",
    "genres": ["Мистерия", "Исторически"],
    "description": "В Барселона през 1945 год. младеж намира мистериозна книга, която го вкарва в свят на свръхестествени събития и трагични истории.",
    "edition_language": "Английски",
    "language": "Български",
    "country": "Испания",
    "date_of_first_issue": 2001,
    "date_of_issue": 2014,
    "goodreads_rating": "4.30",
    "reason": "Историческа мистерия с емоционална дълбочина и акцент на разказа на героите.",
    "adaptations": "Аудио книга и сценична адаптация в Испания.",
    "page_count": 487
  },
  {
    "title_en": "The Maze Runner",
    "title_bg": "Лабиринтът: Невъзможно бягство",
    "real_edition_title": "The Maze Runner - James Dashner - Google Books",
    "author": "Джеймс Дашнър",
    "genres": ["Научна фантастика", "Мистерия", "Тийн"],
    "description": "Когато Томас се събужда в загадъчен лабиринт без спомени, той се сблъсква с предизвикателства за оцеляване и търсене на истината с помощта на нови приятели.",
    "edition_language": "Английски",
    "language": "Български",
    "country": "САЩ",
    "date_of_first_issue": 2009,
    "date_of_issue": 2014,
    "goodreads_rating": "4.03",
    "reason": "Вълнуваща дистопична история с акцент на приятелството и личните предизвикателства.",
    "adaptations": "Филмова трилогия 'The Maze Runner' започваща от 2014 г.",
    "page_count": 375
  }
]
`;
    const unescapedData = responseJson
      .replace(/^```json([\s\S]*?)```$/, "$1")
      .replace(/^```JSON([\s\S]*?)```$/, "$1")
      .replace(/^```([\s\S]*?)```$/, "$1")
      .replace(/^'|'$/g, "")
      .trim();
    console.log("unescapedData: ", unescapedData);
    const decodedData = decodeURIComponent(unescapedData);
    console.log("decodedData: ", decodedData);
    const recommendations = JSON.parse(decodedData);
    console.log("recommendations: ", recommendations);

    for (const book of recommendations) {
      const bookName = book.real_edition_title;
      console.log("bookName: ", bookName);
      const bookResults = await fetchGoogleBooksIDWithFailover(bookName);

      console.log(bookResults);
      if (Array.isArray(bookResults.items)) {
        const bookItem = bookResults.items.find((item: { link: string }) =>
          item.link.includes("books.google.com/books/about/")
        );
        console.log(`bookItem: ${bookItem}`);
        if (bookItem) {
          const googleBookUrl = bookItem.link;
          const bookId = googleBookUrl.match(/id=([a-zA-Z0-9-_]+)/)?.[1];

          if (bookId) {
            const googleBooksResponse = await fetch(
              `https://www.googleapis.com/books/v1/volumes/${bookId}`
            );
            const googleBooksData = await googleBooksResponse.json();

            console.log(
              `Google Books data for ${bookName}: ${JSON.stringify(
                googleBooksData,
                null,
                2
              )}, `
            );

            const author = await processDataWithFallback(
              translate(googleBooksData.volumeInfo?.authors.join(", ")),
              translate(book?.author)
            );
            const description = await processDataWithFallback(
              translate(
                removeHtmlTags(googleBooksData.volumeInfo?.description)
              ),
              book.description
            );
            const genres_en = await processBookGenres(
              googleBooksData.volumeInfo?.categories
            );
            const genres_bg = await processBookGenres(
              googleBooksData.volumeInfo?.categories,
              true
            );
            const language = await processDataWithFallback(
              translate(ISO6391.getName(googleBooksData.volumeInfo?.language)),
              book?.language
            );

            const recommendationData = {
              google_books_id: googleBooksData.id,
              title_en: googleBooksData.volumeInfo.title,
              title_bg: book.title_bg,
              real_edition_title: book.real_edition_title,
              author: author,
              genres_en: genres_en,
              genres_bg: genres_bg,
              description: description,
              language: language,
              country: book.country,
              date_of_first_issue: book.date_of_first_issue,
              date_of_issue: processDataWithFallback(
                googleBooksData.volumeInfo.publishedDate,
                book.date_of_issue
              ),
              goodreads_rating: book.goodreads_rating,
              reason: book.reason,
              adaptations: book.adaptations,
              ISBN_10: googleBooksData.volumeInfo.industryIdentifiers.find(
                (identifier: IndustryIdentifier) =>
                  identifier.type === "ISBN_10"
              ).identifier,
              ISBN_13: googleBooksData.volumeInfo.industryIdentifiers.find(
                (identifier: IndustryIdentifier) =>
                  identifier.type === "ISBN_13"
              ).identifier,
              page_count: processDataWithFallback(
                googleBooksData.volumeInfo.printedPageCount,
                book.page_count
              ),
              imageLink: googleBooksData.volumeInfo.imageLinks.thumbnail,
              source: "Google Books"
            };

            // Първо, задаваме списъка с препоръки
            setRecommendationList((prevRecommendations) => [
              ...prevRecommendations,
              recommendationData
            ]);

            // // След това изпълняваме проверката и записа паралелно, използвайки
            // const checkAndSaveMoviesSeriesRecommendation = async () => {
            //   // Проверяваме дали филмът съществува в таблицата за watchlist
            //   const existsInWatchlist =
            //     await checkRecommendationExistsInWatchlist(imdbId, token);

            //   // Ако филмът не съществува в watchlist, добавяме го към "bookmarkedMovies" с информация за ID и статус
            //   if (existsInWatchlist) {
            //     setBookmarkedMovies((prevMovies) => {
            //       return {
            //         ...prevMovies,
            //         [recommendationData.imdbID]: recommendationData
            //       };
            //     });
            //   }
            //   // Записваме препоръката в базата данни
            //   await saveMoviesSeriesRecommendation(
            //     recommendationData,
            //     date,
            //     token
            //   );
            // };

            // // Извикваме функцията, за да изпълним и двете операции
            // checkAndSaveMoviesSeriesRecommendation();
          } else {
            console.log(`Book ID not found for ${bookName}`);
          }
        }
      }
    }
  } catch (error) {
    console.error("Error generating recommendations:", error);
  }
};

/**
 * Записва препоръка за филм или сериал в базата данни.
 * Препоръката съдържа подробности за филма/сериала като заглавие, жанр, рейтинг и други.
 * След успешното записване, препоръката се изпраща в сървъра.
 *
 * @async
 * @function saveMoviesSeriesRecommendation
 * @param {any} recommendation - Обект, съдържащ данни за препоръчания филм или сериал.
 * @param {string} date - Дата на генерирането на препоръката.
 * @param {string | null} token - Токенът на потребителя за аутентификация.
 * @returns {Promise<void>} - Няма връщан резултат, но извършва записване на препоръката.
 * @throws {Error} - Хвърля грешка, ако не може да се запази препоръката в базата данни.
 */
export const saveMoviesSeriesRecommendation = async (
  recommendation: any,
  date: string,
  token: string | null
) => {
  try {
    if (!recommendation || typeof recommendation !== "object") {
      console.warn("No valid recommendation data found.");
      return;
    }

    const genresEn = recommendation.genre
      ? recommendation.genre.split(", ")
      : null;

    const genresBg = genresEn.map((genre: string) => {
      const matchedGenre = moviesSeriesGenreOptions.find(
        (option) => option.en.trim() === genre.trim()
      );
      return matchedGenre ? matchedGenre.bg : null;
    });

    const runtime = recommendation.runtimeGoogle || recommendation.runtime;
    const imdbRating =
      recommendation.imdbRatingGoogle || recommendation.imdbRating;

    const formattedRecommendation = {
      token,
      imdbID: recommendation.imdbID || null,
      title_en: recommendation.title || null,
      title_bg: recommendation.bgName || null,
      genre_en: genresEn.join(", "),
      genre_bg: genresBg.join(", "),
      reason: recommendation.reason || null,
      description: recommendation.description || null,
      year: recommendation.year || null,
      rated: recommendation.rated || null,
      released: recommendation.released || null,
      runtime: runtime || null,
      director: recommendation.director || null,
      writer: recommendation.writer || null,
      actors: recommendation.actors || null,
      plot: recommendation.plot || null,
      language: recommendation.language || null,
      country: recommendation.country || null,
      awards: recommendation.awards || null,
      poster: recommendation.poster || null,
      ratings: recommendation.ratings || [],
      metascore: recommendation.metascore || null,
      imdbRating: imdbRating || null,
      imdbVotes: recommendation.imdbVotes || null,
      type: recommendation.type || null,
      DVD: recommendation.DVD || null,
      boxOffice: recommendation.boxOffice || null,
      production: recommendation.production || null,
      website: recommendation.website || null,
      totalSeasons: recommendation.totalSeasons || null,
      date: date
    };

    console.log("Formatted Recommendation:", formattedRecommendation);

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/save-movies-series-recommendation`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formattedRecommendation)
      }
    );

    if (!response.ok) {
      throw new Error("Failed to save recommendation");
    }

    const result = await response.json();
    console.log("Recommendation saved successfully:", result);
  } catch (error) {
    console.error("Error saving recommendation:", error);
  }
};

/**
 * Обработва изпращането на потребителски данни за генериране на препоръки.
 * Извършва валидация на полетата, изпраща заявка до сървъра и обновява списъка с препоръки.
 *
 * @async
 * @function handleSubmit
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setLoading - Функция за задаване на статус на зареждане.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setSubmitted - Функция за задаване на статус за подадена заявка.
 * @param {React.Dispatch<React.SetStateAction<number>>} setSubmitCount - Функция за актуализиране на броя на подадените заявки.
 * @param {React.Dispatch<React.SetStateAction<any[]>>} setRecommendationList - Функция за актуализиране на списъка с препоръки.
 * @param {BooksUserPreferences} booksUserPreferences - Преференции на потребителя за филми/сериали.
 * @param {string | null} token - Токенът за аутентификация на потребителя.
 * @param {number} submitCount - Броят на подадените заявки.
 * @returns {Promise<void>} - Няма връщан резултат, но актуализира препоръките и записва данни.
 * @throws {Error} - Хвърля грешка, ако не може да се обработи заявката.
 */
export const handleSubmit = async (
  setNotification: React.Dispatch<
    React.SetStateAction<NotificationState | null>
  >,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>,
  setSubmitCount: React.Dispatch<React.SetStateAction<number>>,
  setRecommendationList: React.Dispatch<React.SetStateAction<any[]>>,
  setBookmarkedMovies: React.Dispatch<
    React.SetStateAction<{
      [key: string]: any;
    }>
  >,
  booksUserPreferences: BooksUserPreferences,
  token: string | null,
  submitCount: number
): Promise<void> => {
  if (submitCount >= 20) {
    showNotification(
      setNotification,
      "Достигнахте максималния брой предложения! Максималният брой опити е 20 за днес. Можете да опитате отново утре!",
      "error"
    );
    return;
  }

  const { moods, countries, pacing, depth, targetGroup } = booksUserPreferences;

  if (!moods || !countries || !pacing || !depth || !targetGroup) {
    showNotification(
      setNotification,
      "Моля, попълнете всички задължителни полета!",
      "warning"
    );
    return;
  }

  setLoading(true);
  setSubmitted(true);

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/handle-submit`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          type: "books"
        })
      }
    );

    const data = await response.json();

    const date = new Date().toISOString();

    if (response.status === 200) {
      setRecommendationList([]);
      // await saveMoviesSeriesUserPreferences(
      //   date,
      //   booksUserPreferences,
      //   token
      // );
      await generateBooksRecommendations(
        date,
        booksUserPreferences,
        setRecommendationList,
        setBookmarkedMovies,
        token
      );
      setSubmitCount((prevCount) => prevCount + 1);
    } else {
      showNotification(
        setNotification,
        data.error || "Възникна проблем.",
        "error"
      );
    }
  } catch (error) {
    console.error("Error submitting the request:", error);
    showNotification(
      setNotification,
      "Възникна проблем при изпращането на заявката.",
      "error"
    );
  } finally {
    setLoading(false);
  }
};

/**
 * Превключва състоянието на жанр в списъка на избраните жанрове.
 * Ако жанрът е вече в списъка, го премахва; ако не е, го добавя.
 *
 * @function toggleGenre
 * @param {Genre} genre - Жанрът, който трябва да бъде добавен или премахнат.
 * @param {React.Dispatch<React.SetStateAction<Genre[]>>} setGenres - Функцията за актуализиране на списъка с избрани жанрове.
 * @returns {void} - Няма връщан резултат, но актуализира състоянието на жанровете.
 */
export const toggleGenre = (
  genre: Genre,
  setGenres: React.Dispatch<React.SetStateAction<Genre[]>>
): void => {
  setGenres((prevGenres) =>
    prevGenres.find((g) => g.en === genre.en)
      ? prevGenres.filter((g) => g.en !== genre.en)
      : [...prevGenres, genre]
  );
};

/**
 * Проверява дали дадена опция е жанр, базирайки се на наличието на определени свойства в обекта.
 * Връща `true`, ако обектът има свойства `en` и `bg` със стойности от тип "string".
 *
 * @function isGenreOption
 * @param {any} option - Опцията, която трябва да бъде проверена.
 * @returns {boolean} - Връща `true`, ако опцията е жанр, в противен случай `false`.
 */
export function isGenreOption(option: any): option is Genre {
  return (
    option && typeof option.en === "string" && typeof option.bg === "string"
  );
}

/**
 * Обработва избора на отговор от потребителя в зависимост от типа на въпроса (множество или един отговор).
 * Актуализира състоянието на отговорите и жанровете в компонента.
 *
 * @async
 * @function handleAnswerClick
 * @param {React.Dispatch<React.SetStateAction<any>>} setter - Функцията за актуализиране на отговорите в компонента.
 * @param {string} answer - Избраният отговор от потребителя.
 * @param {React.Dispatch<React.SetStateAction<Genre[]>>} setGenres - Функцията за актуализиране на избраните жанрове.
 * @param {Question} currentQuestion - Текущият въпрос, с неговите свойства.
 * @param {string[] | null} selectedAnswer - Съществуващият избран отговор.
 * @param {React.Dispatch<React.SetStateAction<string[] | null>>} setSelectedAnswer - Функцията за актуализиране на състоянието на избраните отговори.
 * @returns {void} - Няма връщан резултат, но актуализира състоянието.
 */
export const handleAnswerClick = (
  setter: React.Dispatch<React.SetStateAction<any>>,
  answer: string,
  setGenres: React.Dispatch<React.SetStateAction<Genre[]>>,
  currentQuestion: Question,
  selectedAnswer: string[] | null,
  setSelectedAnswer: React.Dispatch<React.SetStateAction<string[] | null>>
) => {
  if (currentQuestion.isMultipleChoice) {
    if (currentQuestion.setter === setGenres) {
      const selectedGenre = booksGenreOptions.find(
        (genre) => genre.bg === answer
      );

      if (selectedGenre) {
        toggleGenre(selectedGenre, setGenres);

        return selectedAnswer;
      }

      return selectedAnswer;
    } else {
      setSelectedAnswer((prev) => {
        const updatedAnswers = prev
          ? prev.includes(answer)
            ? prev.filter((item) => item !== answer)
            : [...prev, answer]
          : [answer];
        setter(updatedAnswers);
        return updatedAnswers;
      });
    }
  } else {
    setter(answer);
    setSelectedAnswer([answer]);
  }
};

/**
 * Връща CSS клас, който задава марж в зависимост от броя на опциите за текущия въпрос.
 *
 * @function getMarginClass
 * @param {Question} question - Текущият въпрос, съдържащ информация за опциите.
 * @returns {string} - Строка с CSS клас, който определя маржа за въпроса.
 */
export const getMarginClass = (question: Question): string => {
  if (question.isInput) {
    return question.description ? "mt-[5rem]" : "mt-[9rem]";
  }

  const length = question.options?.length || 0;

  switch (true) {
    case length > 20:
      return "mt-[1rem]";
    case length > 15:
      return "mt-[2rem]";
    case length > 10:
      return "mt-[1rem]";
    case length >= 6:
      return "mt-0"; // Zero margin remains unchanged
    case length >= 4:
      return "mt-[1.5rem]";
    case length >= 3:
      return "mt-[3rem]";
    default:
      return "mt-[9rem]";
  }
};

/**
 * Обработва промяната на стойността в текстовото поле.
 * Актуализира състоянието на полето с новата стойност.
 *
 * @function handleInputChange
 * @param {React.Dispatch<React.SetStateAction<any>>} setter - Функцията за актуализиране на състоянието на стойността.
 * @param {string} value - Новата стойност, въведена в полето.
 * @returns {void} - Няма връщан резултат, но актуализира стойността в състоянието.
 */
export const handleInputChange = (
  setter: React.Dispatch<React.SetStateAction<any>>,
  value: string
): void => {
  setter(value);
};

/**
 * Обработва показването на препоръки, като скрива въпроса и показва индикатор за зареждане.
 * След време показва резултата от подадените отговори.
 *
 * @function handleViewRecommendations
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setShowQuestion - Функцията за скриване на въпроса.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setLoading - Функцията за показване на индикатора за зареждане.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setSubmitted - Функцията за показване на резултата.
 * @returns {void} - Няма връщан резултат, но актуализира състоянието на компонента.
 */
export const handleViewRecommendations = (
  setShowQuestion: React.Dispatch<React.SetStateAction<boolean>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>
): void => {
  setShowQuestion(false);
  setLoading(true);

  setTimeout(() => {
    setSubmitted(true);
    setLoading(false);
  }, 500);
};

/**
 * Обработва преминаването към следващия въпрос в анкета/въпросник.
 * Актуализира индекса на текущия въпрос и показва новия въпрос.
 *
 * @function handleNext
 * @param {React.Dispatch<React.SetStateAction<string[] | null>>} setSelectedAnswer - Функцията за изчистване на избраните отговори.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setShowQuestion - Функцията за показване на следващия въпрос.
 * @param {React.Dispatch<React.SetStateAction<number>>} setCurrentQuestionIndex - Функцията за актуализиране на индекса на текущия въпрос.
 * @param {any[]} questions - Массив от въпроси за анкета.
 * @returns {void} - Няма връщан резултат, но актуализира състоянието на въпросите.
 */
export const handleNext = (
  setSelectedAnswer: React.Dispatch<React.SetStateAction<string[] | null>>,
  setShowQuestion: React.Dispatch<React.SetStateAction<boolean>>,
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>,
  questions: any[]
): void => {
  setSelectedAnswer(null);
  setShowQuestion(false);
  setTimeout(() => {
    setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);
    setShowQuestion(true);
  }, 300);
};

/**
 * Обработва връщането към предишния въпрос в анкета/въпросник.
 * Актуализира индекса на текущия въпрос и показва предишния въпрос.
 *
 * @function handleBack
 * @param {React.Dispatch<React.SetStateAction<string[] | null>>} setSelectedAnswer - Функцията за изчистване на избраните отговори.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setShowQuestion - Функцията за показване на предишния въпрос.
 * @param {React.Dispatch<React.SetStateAction<number>>} setCurrentQuestionIndex - Функцията за актуализиране на индекса на текущия въпрос.
 * @param {any[]} questions - Массив от въпроси за анкета.
 * @returns {void} - Няма връщан резултат, но актуализира състоянието на въпросите.
 */
export const handleBack = (
  setSelectedAnswer: React.Dispatch<React.SetStateAction<string[] | null>>,
  setShowQuestion: React.Dispatch<React.SetStateAction<boolean>>,
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>,
  questions: any[]
): void => {
  setSelectedAnswer(null);
  setShowQuestion(false);
  setTimeout(() => {
    setCurrentQuestionIndex(
      (prev) => (prev - 1 + questions.length) % questions.length
    );
    setShowQuestion(true);
  }, 300);
};

/**
 * Обработва започването на нова анкета, като нулира състоянието на отговорите и резултатите.
 *
 * @function handleRetakeQuiz
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setLoading - Функцията за показване на индикатора за зареждане.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setSubmitted - Функцията за нулиране на състоянието на резултата.
 * @returns {void} - Няма връщан резултат, но актуализира състоянието на компонентите.
 */
export const handleRetakeQuiz = (
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>
): void => {
  setLoading(true);
  setTimeout(() => {
    setSubmitted(false);
    setLoading(false);
  }, 500);
};

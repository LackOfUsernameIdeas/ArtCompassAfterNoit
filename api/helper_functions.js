const translate = async (entry) => {
  // Изграждане на URL за заявка към Google Translate API
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=bg&dt=t&q=${encodeURIComponent(
    entry
  )}`;

  try {
    // Изпращане на заявката към API-то
    const response = await fetch(url);
    const data = await response.json();

    // Обединяване на преведените части в един низ
    const flattenedTranslation = data[0].map((item) => item[0]).join(" ");

    // Премахване на излишните интервали
    const mergedTranslation = flattenedTranslation.replace(/\s+/g, " ").trim();
    return mergedTranslation;
  } catch (error) {
    // Обработка на грешка при превод
    console.error(`Error translating entry: ${entry}`, error);
    return entry;
  }
};

// Функция за проверка и нулиране на броя заявки за деня
const checkAndResetRequestsDaily = (userRequests) => {
  const currentDate = new Date().toISOString().split("T")[0];

  // Ако няма записана дата за нулиране, задаваме текущата дата
  if (!userRequests.resetDate) {
    userRequests.resetDate = currentDate;
  }

  // Ако датата е различна от текущата, нулираме заявките
  if (userRequests.resetDate !== currentDate) {
    userRequests = {};
    userRequests.resetDate = currentDate;
    console.log("Request counts reset for the day.");
  }
};

// Функция за превод на предпочитан тип съдържание (филм/сериал)
const translatePreferredType = (preferredType) => {
  const typeMapping = {
    Сериал: "series",
    Филм: "movie"
  };

  return typeMapping[preferredType] || preferredType;
};

// Функция за съпоставяне на настроение с жанрове
const matchMoodWithGenres = (mood, genres) => {
  const moodGenreMap = {
    "Развълнуван/-на": [
      "Action",
      "Adventure",
      "Comedy",
      "Animation",
      "Fantasy",
      "Mystery",
      "Sci-Fi",
      "Sport",
      "Thriller",
      "War",
      "Western"
    ],
    "Любопитен/-на": [
      "Mystery",
      "Sci-Fi",
      "Documentary",
      "Adventure",
      "Crime",
      "Fantasy",
      "Film-Noir",
      "Horror",
      "Sport",
      "Western"
    ],
    "Тъжен/-на": ["Drama", "Romance", "Film-Noir"],
    "Щастлив/-а": [
      "Comedy",
      "Musical",
      "Action",
      "Animation",
      "Horror",
      "Sport",
      "Thriller",
      "Western"
    ],
    "Спокоен/-йна": [
      "Family",
      "Fantasy",
      "Film-Noir",
      "Musical",
      "Sci-Fi",
      "Thriller",
      "War",
      "Western"
    ],
    "Разочарован/-на": ["Drama", "Horror", "Romance"],
    "Уморен/-на": [
      "Comedy",
      "Documentary",
      "Drama",
      "Animation",
      "Crime",
      "Western"
    ],
    "Нервен/-на": ["Thriller", "Mystery", "Action", "Horror", "War"],
    "Разгневен/-на": ["Action", "Crime", "Horror", "Mystery"],
    "Стресиран/-на": ["Thriller", "Horror", "Drama", "Comedy", "Western"],
    "Носталгичен/-на": ["Drama", "History", "Animation", "Romance", "Western"],
    "Безразличен/-на": [
      "Action",
      "Adventure",
      "Animation",
      "Biography",
      "Comedy",
      "Crime",
      "Documentary",
      "Drama",
      "Family",
      "Fantasy",
      "Film-Noir",
      "History",
      "Horror",
      "Musical",
      "Mystery",
      "Romance",
      "Sci-Fi",
      "Sport",
      "Thriller",
      "War",
      "Western"
    ],
    "Оптимистичен/-на": [
      "Comedy",
      "Adventure",
      "Family",
      "Fantasy",
      "Mystery",
      "Sci-Fi",
      "Sport",
      "Western"
    ],
    "Песимистичен/-на": ["Drama", "War", "Film-Noir", "Thriller"],
    "Весел/-а": [
      "Comedy",
      "Musical",
      "Action",
      "Adventure",
      "Animation",
      "Fantasy",
      "Film-Noir",
      "Mystery",
      "Sci-Fi",
      "Sport",
      "Western"
    ],
    "Смутен/-на": ["Romance", "Drama", "Horror", "War"],
    "Озадачен/-на": [
      "Mystery",
      "Sci-Fi",
      "Adventure",
      "Fantasy",
      "Film-Noir",
      "Romance",
      "Sport",
      "Western"
    ],
    "Разтревожен/-на": ["Thriller", "Horror", "Romance", "War", "Sport"],
    "Вдъхновен/-на": [
      "Biography",
      "History",
      "Adventure",
      "Animation",
      "Fantasy",
      "Film-Noir",
      "Musical",
      "Mystery",
      "Sci-Fi",
      "Sport",
      "Western"
    ]
  };

  // Проверка дали даден жанр съответства на настроението
  const matchingGenres = moodGenreMap[mood] || [];
  return genres.some((genre) => matchingGenres.includes(genre));
};

// Функция за конвертиране на време (часове и минути) в минути
const parseRuntime = (runtime) => {
  if (!runtime || runtime.toLowerCase() === "n/a") return null;

  const hourMatch = runtime.match(/(\d+)\s*ч/); // Съвпадение за часове
  const minMatch = runtime.match(/(\d+)\s*(м|min)/); // Съвпадение за минути

  let totalMinutes = 0;

  if (hourMatch) {
    totalMinutes += parseInt(hourMatch[1], 10) * 60; // Преобразуване на часове в минути
  }
  if (minMatch) {
    totalMinutes += parseInt(minMatch[1], 10); // Добавяне на минутите
  }

  return totalMinutes > 0 ? totalMinutes : null;
};

// Функция за преобразуване на време за гледане в минути
const getTimeAvailabilityInMinutes = (timeAvailability) => {
  const timeMapping = {
    "1 час": 60,
    "2 часа": 120,
    "3 часа": 180,
    "Нямам предпочитания": null
  };

  return timeMapping[timeAvailability];
};

// Функция за определяне на прагова година спрямо възрастовите предпочитания
const getYearThreshold = (preferredAge) => {
  const currentYear = new Date().getFullYear();
  const ageMapping = {
    "Публикуван в последните 3 години": currentYear - 3,
    "Публикуван в последните 10 години": currentYear - 10,
    "Публикуван в последните 20 години": currentYear - 20,
    "Нямам предпочитания": null
  };

  return ageMapping[preferredAge];
};

/**
 * Проверява релевантността на препоръка спрямо предпочитанията на потребителя.
 * @param {Object} userPreferences - Предпочитанията на потребителя.
 * @param {Object} recommendation - Препоръчаното съдържание.
 * @returns {Object} Обект, съдържащ дали е релевантно, общия резултат и подробни точки за всеки критерий.
 */
const checkRelevance = (userPreferences, recommendation) => {
  let score = 0;
  const scores = {
    genres: 0,
    type: 0,
    mood: 0,
    timeAvailability: 0,
    preferredAge: 0,
    targetGroup: 0
  };

  /** ✅ 1. Съответствие на предпочитани жанрове */
  if (userPreferences.preferred_genres_en && recommendation.genre_en) {
    const userGenres = userPreferences.preferred_genres_en
      .split(", ")
      .map((g) => g.toLowerCase());

    const recGenres = recommendation.genre_en
      .split(", ")
      .map((g) => g.toLowerCase());

    if (recGenres.some((genre) => userGenres.includes(genre))) {
      score += 2; // Силно съответствие по жанр
      scores.genres = 2;
    }
  }

  /** ✅ 2. Съответствие на предпочитан тип (Филм/Сериал) */
  if (userPreferences.preferred_type && recommendation.type) {
    if (
      translatePreferredType(userPreferences.preferred_type) ===
      recommendation.type.toLowerCase()
    ) {
      score += 1;
      scores.type = 1;
    }
  }

  /** ✅ 3. Съответствие на настроение с жанр */
  if (userPreferences.mood && recommendation.genre_en) {
    const recGenres = recommendation.genre_en.split(", ");
    const moods = userPreferences.mood.replace(/\/\s+/g, "/").split(/\s*,\s*/);

    const moodMatch = moods.some((mood) =>
      matchMoodWithGenres(mood, recGenres)
    );

    if (moodMatch) {
      score += 1;
      scores.mood = 1;
    }
  }

  /** ✅ 4. Съответствие на наличното време с продължителността */
  if (userPreferences.timeAvailability && recommendation.runtime) {
    const timeAvailable = getTimeAvailabilityInMinutes(
      userPreferences.timeAvailability
    );

    if (timeAvailable === null) {
      // "Нямам предпочитания" -> Всяко време ще е валидно
      score += 1;
      scores.timeAvailability = 1;
    }

    const movieRuntime = parseRuntime(recommendation.runtime);
    const tolerance = 35; // Позволява се толеранс от 35 минути

    if (movieRuntime !== null && timeAvailable !== null) {
      if (movieRuntime <= timeAvailable + tolerance) {
        score += 1; // Филмът попада в рамките на наличното време
        scores.timeAvailability = 1;
      }
    }
  }

  /** ✅ 5. Съответствие на предпочитана възраст с година на издаване */
  if (userPreferences.preferred_age && recommendation.year) {
    const thresholdYear = getYearThreshold(userPreferences.preferred_age);
    const releaseYear = parseInt(recommendation.year, 10);

    if (thresholdYear === null) {
      // "Нямам предпочитания" -> Всяка година ще е валидна
      score += 1;
      scores.preferredAge = 1;
    } else if (
      // Проверява се дали годината е в диапазон (например "2018–2024" или "2013–")
      recommendation.year.includes("–") ||
      recommendation.year.includes("-")
    ) {
      const yearRange = recommendation.year.split(/[-–]/);
      const startYear = parseInt(yearRange[0], 10);
      const endYear = yearRange.length > 1 ? parseInt(yearRange[1], 10) : null;

      // Ако има крайна година, тя се използва; иначе се приема, че филмът продължава
      if (
        (thresholdYear !== null && startYear >= thresholdYear) ||
        (endYear && endYear >= thresholdYear)
      ) {
        score += 1;
        scores.preferredAge = 1;
      }
    } else if (!isNaN(releaseYear)) {
      if (thresholdYear !== null && releaseYear >= thresholdYear) {
        // Филмът попада в предпочитания времеви диапазон
        score += 1;
        scores.preferredAge = 1;
      }
    }
  }

  /** ✅ 6. Съответствие на целевата аудитория */
  if (userPreferences.preferred_target_group && recommendation.rated) {
    const targetMappings = {
      Деца: ["G", "PG", "TV-Y", "TV-Y7", "TV-Y7-FV", "Approved", "Passed"],
      Тийнейджъри: ["PG-13", "TV-14", "Not Rated", "Approved"],
      Възрастни: [
        "PG-13",
        "R",
        "TV-MA",
        "TV-14",
        "NC-17",
        "Not Rated",
        "Approved"
      ],
      Семейни: [
        "G",
        "PG",
        "TV-G",
        "TV-Y",
        "TV-14",
        "TV-Y7",
        "Not Rated",
        "Approved",
        "Passed"
      ],
      "Семейство и деца": [
        "G",
        "PG",
        "TV-Y",
        "TV-Y7",
        "Not Rated",
        "Approved",
        "Passed"
      ],
      "Възрастни над 65": [
        "PG-13",
        "R",
        "TV-MA",
        "TV-14",
        "Not Rated",
        "Approved"
      ]
    };

    const userTarget = userPreferences.preferred_target_group;
    if (
      targetMappings[userTarget] &&
      targetMappings[userTarget].includes(recommendation.rated)
    ) {
      score += 1;
      scores.targetGroup = 1;
    }
  }

  /** ✅ 7. Финално решение */
  return {
    isRelevant: score >= 5,
    relevanceScore: score,
    criteriaScores: scores
  };
};

module.exports = {
  translate,
  checkAndResetRequestsDaily,
  checkRelevance
};

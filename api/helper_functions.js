const translate = async (entry) => {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=bg&dt=t&q=${encodeURIComponent(
    entry
  )}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const flattenedTranslation = data[0].map((item) => item[0]).join(" ");

    const mergedTranslation = flattenedTranslation.replace(/\s+/g, " ").trim();
    return mergedTranslation;
  } catch (error) {
    console.error(`Error translating entry: ${entry}`, error);
    return entry;
  }
};

// Функция за рестартиране на лимита на потребителя
const checkAndResetRequestsDaily = (userRequests) => {
  const currentDate = new Date().toISOString().split("T")[0];

  if (!userRequests.resetDate) {
    userRequests.resetDate = currentDate;
  }

  if (userRequests.resetDate !== currentDate) {
    userRequests = {};
    userRequests.resetDate = currentDate;
    console.log("Request counts reset for the day.");
  }
};

const translatePreferredType = (preferredType) => {
  const typeMapping = {
    Сериал: "series",
    Филм: "movie"
  };

  return typeMapping[preferredType] || preferredType;
};

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
    "Разтревожен/-на": ["Thriller", "Horror", "Romance", "War"],
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

  const matchingGenres = moodGenreMap[mood] || [];
  return genres.some((genre) => matchingGenres.includes(genre));
};

const parseRuntime = (runtime) => {
  if (!runtime || runtime.toLowerCase() === "n/a") return null;

  const hourMatch = runtime.match(/(\d+)\s*ч/); // Match hours
  const minMatch = runtime.match(/(\d+)\s*(м|min)/); // Match minutes

  let totalMinutes = 0;

  if (hourMatch) {
    totalMinutes += parseInt(hourMatch[1], 10) * 60; // Convert hours to minutes
  }
  if (minMatch) {
    totalMinutes += parseInt(minMatch[1], 10); // Add minutes
  }

  return totalMinutes > 0 ? totalMinutes : null;
};

const getTimeAvailabilityInMinutes = (timeAvailability) => {
  const timeMapping = {
    "1 час": 60,
    "2 часа": 120,
    "3 часа": 180,
    "Нямам предпочитания": null
  };

  return timeMapping[timeAvailability];
};

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

  // ✅ 1. Match Preferred Genres
  if (userPreferences.preferred_genres_en && recommendation.genre_en) {
    const userGenres = userPreferences.preferred_genres_en
      .split(", ")
      .map((g) => g.toLowerCase());
    const recGenres = recommendation.genre_en
      .split(", ")
      .map((g) => g.toLowerCase());

    if (recGenres.some((genre) => userGenres.includes(genre))) {
      score += 2; // Strong match for preferred genre
      scores.genres = 2;
    }
  }

  // ✅ 2. Match Preferred Type (Movie/Series)
  if (userPreferences.preferred_type && recommendation.type) {
    if (
      translatePreferredType(userPreferences.preferred_type) ===
      recommendation.type.toLowerCase()
    ) {
      score += 1; // Match for movie/series preference
      scores.type = 1;
    }
  }

  // ✅ 3. Match Mood with Genre
  if (userPreferences.mood && recommendation.genre_en) {
    const recGenres = recommendation.genre_en.split(", ");
    const moods = userPreferences.mood.replace(/\/\s+/g, "/").split(/\s*,\s*/);

    const moodMatch = moods.some((mood) =>
      matchMoodWithGenres(mood, recGenres)
    );
    if (moodMatch) {
      score += 1; // Match for mood-based genre association
      scores.mood = 1;
    }
  }

  // ✅ 4. Match Time Availability with Runtime
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
    const tolerance = 35; // Allow for a 35-minute tolerance

    if (movieRuntime !== null && timeAvailable !== null) {
      if (movieRuntime <= timeAvailable + tolerance) {
        score += 1; // Movie fits within available time
        scores.timeAvailability = 1;
      }
    }
  }

  // ✅ 5. Match Preferred Age with Release Year
  if (userPreferences.preferred_age && recommendation.year) {
    const thresholdYear = getYearThreshold(userPreferences.preferred_age);
    const releaseYear = parseInt(recommendation.year, 10);

    if (thresholdYear === null) {
      // "Нямам предпочитания" -> Всяко време ще е валидно
      score += 1;
      scores.preferredAge = 1;
      console.log("Нямам предпочитания: ", scores.preferredAge);
    }

    // Check if the year is a range like "2018–2024" or "2013–"
    if (
      recommendation.year.includes("–") ||
      recommendation.year.includes("-")
    ) {
      const yearRange = recommendation.year.split(/[-–]/);
      const startYear = parseInt(yearRange[0], 10);
      const endYear = yearRange.length > 1 ? parseInt(yearRange[1], 10) : null;
      console.log(yearRange, startYear, endYear, thresholdYear);

      // If there's a valid end year, we use it, otherwise we assume it's ongoing.
      if (
        (thresholdYear !== null && startYear >= thresholdYear) ||
        (endYear && endYear >= thresholdYear)
      ) {
        score += 1;
        scores.preferredAge = 1;
        console.log("2018–2024 or 2013–", scores.preferredAge);
      }
    } else if (!isNaN(releaseYear)) {
      if (thresholdYear !== null && releaseYear >= thresholdYear) {
        // The movie is within the preferred range
        score += 1;
        scores.preferredAge = 1;
      }
    }
  }

  // ✅ 6. Match Target Group
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

  // ✅ ?. Final Decision
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

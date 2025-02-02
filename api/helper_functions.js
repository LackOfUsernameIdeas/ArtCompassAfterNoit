async function translate(entry) {
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
}

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

function translatePreferredType(preferredType) {
  const typeMapping = {
    Сериал: "series",
    Филм: "movie"
  };

  return typeMapping[preferredType] || preferredType;
}

function matchMoodWithGenres(mood, genres) {
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
}

function parseRuntime(runtime) {
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
}

function getTimeAvailabilityInMinutes(timeAvailability) {
  const timeMapping = {
    "1 час": 60,
    "2 часа": 120,
    "3 часа": 180,
    "Нямам предпочитания": null
  };

  return timeMapping[timeAvailability] ?? undefined;
}

function checkRelevance(userPreferences, recommendation) {
  let score = 0;

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
    }
  }

  // ✅ 2. Match Preferred Type (Movie/Series)
  if (userPreferences.preferred_type && recommendation.type) {
    if (
      translatePreferredType(userPreferences.preferred_type) ===
      recommendation.type.toLowerCase()
    ) {
      score += 1; // Match for movie/series preference
    }
  }

  // ✅ 3. Match Mood with Genre
  if (userPreferences.mood && recommendation.genre_en) {
    const recGenres = recommendation.genre_en.split(", ");
    if (matchMoodWithGenres(userPreferences.mood, recGenres)) {
      score += 1; // Match for mood-based genre association
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
    }

    const movieRuntime = parseRuntime(recommendation.runtime);
    const tolerance = 35; // Allow for a 35-minute tolerance

    if (movieRuntime !== null && timeAvailable !== null) {
      if (movieRuntime <= timeAvailable + tolerance) {
        score += 1; // Movie fits within available time
      }
    }
  }
  // ✅ 3. Final Decision
  return { isRelevant: score >= 2, relevanceScore: score };
}

module.exports = {
  translate,
  checkAndResetRequestsDaily,
  checkRelevance
};

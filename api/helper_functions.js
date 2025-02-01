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

  // ------------------------------------
  // // ✅ 3. Match Age Preference
  // if (userPreferences.preferred_age && recommendation.year) {
  //   const currentYear = new Date().getFullYear();
  //   const recYear = parseInt(recommendation.year, 10);

  //   if (
  //     userPreferences.preferred_age.includes("последните 3 години") &&
  //     recYear >= currentYear - 3
  //   ) {
  //     score += 2;
  //   } else if (
  //     userPreferences.preferred_age.includes("последните 10 години") &&
  //     recYear >= currentYear - 10
  //   ) {
  //     score += 1;
  //   } else if (userPreferences.preferred_age.includes("последните 20 години")) {
  //     score += 1;
  //   }
  // }

  // // ✅ 4. Match Target Group
  // if (userPreferences.preferred_target_group && recommendation.rated) {
  //   const targetMappings = {
  //     тийнейджъри: ["PG-13", "TV-14"],
  //     възрастни: ["R", "TV-MA"],
  //     деца: ["G", "PG", "TV-Y", "TV-Y7"]
  //   };

  //   const userTarget = userPreferences.preferred_target_group.toLowerCase();
  //   if (
  //     targetMappings[userTarget] &&
  //     targetMappings[userTarget].includes(recommendation.rated)
  //   ) {
  //     score += 1;
  //   }
  // }

  // // ✅ 5. Match Favorite Actors & Directors
  // if (userPreferences.favorite_actors && recommendation.actors) {
  //   const userActors = userPreferences.favorite_actors
  //     .split(", ")
  //     .map((actor) => actor.toLowerCase());
  //   const recActors = recommendation.actors
  //     .split(", ")
  //     .map((actor) => actor.toLowerCase());

  //   if (recActors.some((actor) => userActors.includes(actor))) {
  //     score += 2;
  //   }
  // }

  // if (userPreferences.favorite_directors && recommendation.director) {
  //   const userDirectors = userPreferences.favorite_directors
  //     .split(", ")
  //     .map((director) => director.toLowerCase());
  //   const recDirector = recommendation.director.toLowerCase();

  //   if (userDirectors.includes(recDirector)) {
  //     score += 2;
  //   }
  // }

  // ✅ 6. Final Decision
  return { isRelevant: score >= 4, relevanceScore: score };
}

module.exports = {
  translate,
  checkAndResetRequestsDaily,
  checkRelevance
};

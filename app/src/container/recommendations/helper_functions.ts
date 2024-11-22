import { Genre, Question, UserPreferences } from "./recommendations-types";
import { genreOptions, openAIKey } from "./recommendationsdata";

export async function translate(entry: string) {
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

export const saveUserPreferences = async (
  date: string,
  userPreferences: {
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
) => {
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
    } = userPreferences;

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
      `${import.meta.env.VITE_API_BASE_URL}/save-user-preferences`,
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

export const generateMovieRecommendations = async (
  date: string,
  userPreferences: UserPreferences,
  setRecommendationList: React.Dispatch<React.SetStateAction<any[]>>,
  token: string | null
) => {
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
  } = userPreferences;
  try {
    const typeText = type === "Филм" ? "филма" : "сериала";
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openAIKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-2024-08-06",
        messages: [
          {
            role: "system",
            content: `You are an AI that recommends movies and series based on user preferences. Provide a list of movies and series, based on what the user has chosen to watch (movie or series), that match the user's taste and preferences, formatted in Bulgarian, with detailed justifications. Return the result in JSON format as instructed.`
          },
          {
            role: "user",
            content: `Препоръчай ми 5 ${typeText} за гледане, които ЗАДЪЛЖИТЕЛНО да съвпадат с моите вкусове и предпочитания, а именно:
                Любими жанрове: ${genres.map((genre) => genre.bg)}.
                Емоционално състояние в този момент: ${moods}.
                Разполагаемо свободно време за гледане: ${timeAvailability}.
                Възрастта на ${typeText} задължително да бъде: ${age}
                Любими актьори: ${actors}.
                Любими филмови режисьори: ${directors}.
                Теми, които ме интересуват: ${interests}.
                Филмите/сериалите могат да бъдат от следните страни: ${countries}.
                Темпото (бързината) на филмите/сериалите предпочитам да бъде: ${pacing}.
                Предпочитам филмите/сериалите да са: ${depth}.
                Целевата група е: ${targetGroup}.
                Дай информация за всеки отделен филм/сериал по отделно защо той е подходящ за мен.
                Задължително искам имената на филмите/сериалите да бъдат абсолютно точно както са официално на български език – така, както са известни сред публиката в България. 
                Не се допуска буквален превод на заглавията от английски, ако официалното българско заглавие се различава от буквалния превод. 
                Не препоръчвай 18+ филми/сериали.
                Форматирай своя response във валиден JSON формат по този начин:
                {
                  "Официално име на ${typeText} на английски, както е прието да бъде": {
                    "bgName": "Официално име на ${typeText} на български, както е прието да бъде, а не буквален превод",
                    "description": "Описание на ${typeText}",
                    "reason": "Защо този филм/сериал е подходящ за мен?"
                  },
                  "Официално име на ${typeText} на английски, както е прието да бъде": {
                    "bgName": "Официално име на ${typeText} на български, както е прието да бъде, а не буквален превод",
                    "description": "Описание на ${typeText}",
                    "reason": "Защо този филм/сериал е подходящ за мен?"
                  },
                  // ...additional movies
                }. Не добавяй излишни кавички(внимавай кога ползваш единични и кога двойни), думи или скоби, JSON формата трябва да е валиден за JavaScript JSON.parse() функцията.`
          }
        ]
      })
    });

    const responseData = await response.json();
    const responseJson = responseData.choices[0].message.content;
    const unescapedData = responseJson
      .replace(/^```json([\s\S]*?)```$/, "$1")
      .replace(/^```JSON([\s\S]*?)```$/, "$1")
      .replace(/^```([\s\S]*?)```$/, "$1")
      .replace(/^'|'$/g, "")
      .trim();
    console.log("unescapedData: ", unescapedData);
    const escapedData = decodeURIComponent(unescapedData);
    console.log("escapedData: ", escapedData);
    const recommendations = JSON.parse(escapedData);
    console.log("recommendations: ", recommendations);

    for (const movieTitle in recommendations) {
      const movieName = movieTitle;

      // 27427e59e17b74763, AIzaSyArE48NFh1befjjDxpSrJ0eBgQh_OmQ7RA
      // e59ceff412ebc4313, AIzaSyDqUez1TEmLSgZAvIaMkWfsq9rSm0kDjIw
      let imdbData;

      try {
        let imdbResponse = await fetch(
          `https://customsearch.googleapis.com/customsearch/v1?key=AIzaSyDqUez1TEmLSgZAvIaMkWfsq9rSm0kDjIw&cx=e59ceff412ebc4313&q=${encodeURIComponent(
            movieName
          )}`
        );
        imdbData = await imdbResponse.json();

        if (!imdbResponse.ok || imdbResponse.status === 429 || imdbData.error) {
          imdbResponse = await fetch(
            `https://customsearch.googleapis.com/customsearch/v1?key=AIzaSyArE48NFh1befjjDxpSrJ0eBgQh_OmQ7RA&cx=27427e59e17b74763&q=${encodeURIComponent(
              movieName
            )}`
          );
          imdbData = await imdbResponse.json();
        }
      } catch (error) {
        console.error("Error fetching IMDb data:", error);
        continue;
      }

      if (Array.isArray(imdbData.items)) {
        const imdbItem = imdbData.items.find((item: { link: string }) =>
          item.link.includes("imdb.com/title/")
        );

        if (imdbItem) {
          const imdbUrl = imdbItem.link;
          const imdbId = imdbUrl.match(/title\/(tt\d+)\//)?.[1];

          const imdbRating = imdbItem.pagemap.metatags
            ? imdbItem.pagemap.metatags[0]["twitter:title"]?.match(
                /⭐ ([\d.]+)/
              )?.[1]
            : null;
          const runtime = imdbItem.pagemap.metatags
            ? imdbItem.pagemap.metatags[0]["og:description"]?.match(
                /(\d{1,2}h \d{1,2}m|\d{1,2}h|\d{1,3}m)/
              )?.[1]
            : null;

          const translatedRuntime = runtime
            ? runtime.replace(/h/g, "ч").replace(/m/g, "м").replace(/s/g, "с")
            : null;

          console.log("imdbItem.pagemap.metatags: ", imdbItem.pagemap.metatags);
          console.log(`Found IMDb ID: ${imdbId}`);
          console.log(`IMDb Rating: ${imdbRating}`);
          console.log(`Runtime: ${translatedRuntime}`);

          if (imdbId) {
            const omdbResponse = await fetch(
              `http://www.omdbapi.com/?apikey=89cbf31c&i=${imdbId}&plot=full`
            );
            const omdbData = await omdbResponse.json();

            console.log(
              `OMDb data for ${movieName}: ${JSON.stringify(omdbData, null, 2)}`
            );

            const recommendationData = {
              title: omdbData.Title,
              bgName: recommendations[movieTitle].bgName,
              description: recommendations[movieTitle].description,
              reason: recommendations[movieTitle].reason,
              year: omdbData.Year,
              rated: omdbData.Rated,
              released: omdbData.Released,
              runtime: omdbData.Runtime,
              runtimeGoogle: translatedRuntime,
              genre: omdbData.Genre,
              director: omdbData.Director,
              writer: omdbData.Writer,
              actors: omdbData.Actors,
              plot: omdbData.Plot,
              language: omdbData.Language,
              country: omdbData.Country,
              awards: omdbData.Awards,
              poster: omdbData.Poster,
              ratings: omdbData.Ratings,
              metascore: omdbData.Metascore,
              imdbRating: omdbData.imdbRating,
              imdbRatingGoogle: imdbRating,
              imdbVotes: omdbData.imdbVotes,
              imdbID: omdbData.imdbID,
              type: omdbData.Type,
              DVD: omdbData.DVD,
              boxOffice: omdbData.BoxOffice,
              production: omdbData.Production,
              website: omdbData.Website,
              totalSeasons: omdbData.totalSeasons
            };

            setRecommendationList((prevRecommendations) => [
              ...prevRecommendations,
              recommendationData
            ]);

            console.log("recommendationData: ", recommendationData);
            await saveRecommendationToDatabase(recommendationData, date, token);
          } else {
            console.log(`IMDb ID not found for ${movieName}`);
          }
        }
        // TO DO: Да се измисли какво да се прави ако не се намери филма/сериала
      }
    }
  } catch (error) {
    console.error("Error generating recommendations:", error);
  }
};

export const saveRecommendationToDatabase = async (
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
      const matchedGenre = genreOptions.find(
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
      `${import.meta.env.VITE_API_BASE_URL}/save-recommendation`,
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

export const handleSubmit = async (
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>,
  setSubmitCount: React.Dispatch<React.SetStateAction<number>>,
  setRecommendationList: React.Dispatch<React.SetStateAction<any[]>>,
  userPreferences: UserPreferences,
  token: string | null,
  submitCount: number
) => {
  if (submitCount >= 20) {
    alert("Достигнахте максималния брой предложения! :(");
    return;
  }

  const {
    moods,
    timeAvailability,
    actors,
    directors,
    countries,
    pacing,
    depth,
    targetGroup
  } = userPreferences;

  if (
    !moods ||
    !timeAvailability ||
    !actors ||
    !directors ||
    !countries ||
    !pacing ||
    !depth ||
    !targetGroup
  ) {
    alert("Моля, попълнете всички задължителни полета!");
    return;
  }

  setLoading(true);
  setSubmitted(true);

  const date = new Date().toISOString();

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/handle-submit`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    if (response.status === 200) {
      await saveUserPreferences(date, userPreferences, token);
      await generateMovieRecommendations(
        date,
        userPreferences,
        setRecommendationList,
        token
      );
      setSubmitCount((prevCount) => prevCount + 1);
    } else {
      alert(data.error || "Something went wrong.");
    }
  } catch (error) {
    console.error("Error submitting the request:", error);
    alert("Something went wrong while submitting your request.");
  } finally {
    setLoading(false);
  }
};

export const toggleGenre = (
  genre: Genre,
  setGenres: React.Dispatch<React.SetStateAction<Genre[]>>
) => {
  setGenres((prevGenres) =>
    prevGenres.find((g) => g.en === genre.en)
      ? prevGenres.filter((g) => g.en !== genre.en)
      : [...prevGenres, genre]
  );
};

export function isGenreOption(option: any): option is Genre {
  return (
    option && typeof option.en === "string" && typeof option.bg === "string"
  );
}

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
      const selectedGenre = genreOptions.find((genre) => genre.bg === answer);

      if (selectedGenre) {
        toggleGenre(selectedGenre, setGenres);

        console.log("Updated Answer Selection (Genres):", selectedGenre.bg);

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
        console.log("Updated Answer Selection1:", updatedAnswers);
        setter(updatedAnswers);
        return updatedAnswers;
      });
    }
  } else {
    setter(answer);
    setSelectedAnswer([answer]);
    console.log("Updated Answer Selection2:", [answer]);
    console.log("raw2:", answer);
  }
};

export const handleInputChange = (
  setter: React.Dispatch<React.SetStateAction<any>>,
  value: string
) => {
  setter(value);
  console.log("Updated Field Value:", value);
};

export const handleViewRecommendations = (
  setShowQuestion: React.Dispatch<React.SetStateAction<boolean>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setShowQuestion(false);
  setLoading(true);

  setTimeout(() => {
    setSubmitted(true);
    setLoading(false);
  }, 500);
};

export const handleNext = (
  setSelectedAnswer: React.Dispatch<React.SetStateAction<string[] | null>>,
  setShowQuestion: React.Dispatch<React.SetStateAction<boolean>>,
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>,
  questions: any[]
) => {
  setSelectedAnswer(null);
  setShowQuestion(false);
  setTimeout(() => {
    setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);
    setShowQuestion(true);
  }, 300);
};

export const handleBack = (
  setSelectedAnswer: React.Dispatch<React.SetStateAction<string[] | null>>,
  setShowQuestion: React.Dispatch<React.SetStateAction<boolean>>,
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>,
  questions: any[]
) => {
  setSelectedAnswer(null);
  setShowQuestion(false);
  setTimeout(() => {
    setCurrentQuestionIndex(
      (prev) => (prev - 1 + questions.length) % questions.length
    );
    setShowQuestion(true);
  }, 300);
};

export const handleRetakeQuiz = (
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setLoading(true);
  setTimeout(() => {
    setSubmitted(false);
    setLoading(false);
  }, 500);
};

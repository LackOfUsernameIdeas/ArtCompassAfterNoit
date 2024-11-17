import { FC, Fragment, useEffect, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { tailChase } from "ldrs";
import {
  fetchFakeMovieDataForTesting,
  QuizQuestion,
  Rating,
  Recommendations
} from "./recommendationsdata";

interface RecommendationList {}

const RecommendationList: FC<RecommendationList> = () => {
  //FOR TESTING ONLY
  const [testing, setTesting] = useState(false);
  //FOR TESTING ONLY

  const [type, setType] = useState("");
  const [genres, setGenres] = useState<{ en: string; bg: string }[]>([]);
  const [moods, setMoods] = useState<string[]>([]);
  const [timeAvailability, setTimeAvailability] = useState("");
  const [age, setAge] = useState("");
  const [actors, setActors] = useState("");
  const [directors, setDirectors] = useState("");
  const [interests, setInterests] = useState("");
  const [countries, setCountries] = useState("");
  const [pacing, setPacing] = useState("");
  const [depth, setDepth] = useState("");
  const [targetGroup, setTargetGroup] = useState("");

  const [submitCount, setSubmitCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [retake, setRetake] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recommendationList, setRecommendationList] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showQuestion, setShowQuestion] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<string[] | null>(null);
  const [showNextButton, setShowNextButton] = useState(false);
  const typeOptions = ["Филм", "Сериал"];

  const genreOptions = [
    { en: "Action", bg: "Екшън" },
    { en: "Adventure", bg: "Приключенски" },
    { en: "Animation", bg: "Анимация" },
    { en: "Biography", bg: "Биография" },
    { en: "Comedy", bg: "Комедия" },
    { en: "Crime", bg: "Криминален" },
    { en: "Documentary", bg: "Документален" },
    { en: "Drama", bg: "Драма" },
    { en: "Family", bg: "Семейни" },
    { en: "Fantasy", bg: "Фентъзи" },
    { en: "Film-Noir", bg: "Филм-ноар" },
    { en: "History", bg: "Исторически" },
    { en: "Horror", bg: "Ужаси" },
    { en: "Music", bg: "Музика" },
    { en: "Musical", bg: "Мюзикъл" },
    { en: "Mystery", bg: "Мистерия" },
    { en: "Romance", bg: "Романтичен" },
    { en: "Sci-Fi", bg: "Научна фантастика" },
    { en: "Sport", bg: "Спортен" },
    { en: "Thriller", bg: "Трилър" },
    { en: "War", bg: "Военен" },
    { en: "Western", bg: "Уестърн" }
  ];

  const moodOptions = [
    "Развълнуван/-на",
    "Любопитен/-на",
    "Тъжен/-на",
    "Изплашен/-на",
    "Щастлив/-а",
    "Спокоен/-йна",
    "Разочарован/-на",
    "Уморен/-на",
    "Нервен/-на",
    "Уверен/-на",
    "Разгневен/-на",
    "Стресиран/-на",
    "Съсредоточен/-на",
    "Благодарен/-на",
    "Носталгичен/-на",
    "Безразличен/-на",
    "Оптимистичен/-на",
    "Песимистичен/-на",
    "Празен/-на",
    "Весел/-а",
    "Смутен/-на",
    "Озадачен/-на",
    "Разревожен/-на",
    "Вдъхновен/-на",
    "Досаден/-на"
  ];

  const timeAvailabilityOptions = [
    "1 час",
    "2 часа",
    "3 часа",
    "Нямам предпочитания"
  ];

  const ageOptions = [
    "Публикуван в последната 1 година",
    "Публикуван в последните 3 години",
    "Публикуван в последните 5 години",
    "Публикуван в последните 10 години",
    "Публикуван в последните 20 години",
    "Нямам предпочитания"
  ];

  const pacingOptions = [
    "бавни, концентриращи се върху разкази на героите",
    "бързи с много напрежение",
    "Нямам предпочитания"
  ];
  const depthOptions = [
    "Лесни за проследяване - релаксиращи",
    "Средни - с ясни сюжетни линии",
    "Трудни - с много истории и терминологии, характерни за филма",
    "Нямам предпочитания"
  ];

  const targetGroupOptions = [
    "Деца",
    "Тийнейджъри",
    "Възрастни",
    "Семейни",
    "Семейство и деца",
    "Възрастни над 65"
  ];

  // Add this array of questions at the top of the component
  const questions = [
    {
      question: "Какво търсите - филм или сериал?",
      options: typeOptions,
      value: type,
      setter: setType
    },
    {
      question: "Кои жанрове Ви се гледат в момента?",
      options: genreOptions.map((g) => g.bg),
      isMultipleChoice: true,
      value: genres,
      setter: setGenres
    },
    {
      question: "Как се чувствате в момента?",
      options: moodOptions,
      isMultipleChoice: true,
      value: moods,
      setter: setMoods
    },
    {
      question: "С какво време за гледане разполагате?",
      options: timeAvailabilityOptions,
      value: timeAvailability,
      setter: setTimeAvailability
    },
    {
      question: "Колко стар предпочитате да бъде филма/сериала?",
      options: ageOptions,
      value: age,
      setter: setAge
    },
    {
      question: "Кои са вашите любими актьори?",
      isInput: true,
      value: actors,
      setter: setActors,
      placeholder: "Пример: Брад Пит, Леонардо ди Каприо, Ема Уотсън"
    },
    {
      question: "Кои филмови режисьори предпочитате?",
      isInput: true,
      value: directors,
      setter: setDirectors,
      placeholder: "Пример: Дъфър брадърс, Стивън Спилбърг, Джеки Чан"
    },
    {
      question: "От кои страни предпочитате да е филмът/сериалът?",
      isInput: true,
      value: countries,
      setter: setCountries,
      placeholder: "Пример: България, САЩ"
    },
    {
      question:
        "Филми/Сериали с каква бързина на развитие на сюжетното действие предпочитате?",
      options: pacingOptions,
      value: pacing,
      setter: setPacing
    },
    {
      question: "Филми/Сериали с какво ниво на задълбочаване харесвате?",
      options: depthOptions,
      value: depth,
      setter: setDepth
    },
    {
      question: "Каква е вашата целева група?",
      options: targetGroupOptions,
      value: targetGroup,
      setter: setTargetGroup
    },
    {
      question: "Какви теми ви интересуват?",
      isInput: true,
      value: interests,
      setter: setInterests,
      placeholder: "Опишете темите, които ви интересуват",
      description:
        "Предпочитате филм/сериал, който засяга определена историческа епоха, държава или дори представя история по действителен случай? Интересуват ви филми, в които се разследва мистерия или социален проблем, или такива, в които животни играят важна роля? А какво ще кажете за филми, свързани с пътешествия и изследване на света, или пък разкази за въображаеми светове? Дайте описание. Можете също така да споделите примери за филми/сериали, които предпочитате."
    }
  ];

  const token =
    localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
  const openAIKey = import.meta.env.VITE_OPENAI_API_KEY;

  const saveUserPreferences = async (date: string) => {
    try {
      const preferredGenresEn =
        genres.length > 0 ? genres.map((g) => g.en).join(", ") : null;
      const preferredGenresBg =
        genres.length > 0 ? genres.map((g) => g.bg).join(", ") : null;

      const response = await fetch(
        "http://localhost:5000/save-user-preferences",
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

  const saveRecommendationToDatabase = async (
    recommendation: any,
    date: string
  ) => {
    try {
      // Check if the recommendation object is valid
      if (!recommendation || typeof recommendation !== "object") {
        console.warn("No valid recommendation data found.");
        return; // Exit if the recommendation object is invalid
      }

      // Split the genre string into an array
      const genresEn = recommendation.genre
        ? recommendation.genre.split(", ")
        : null;

      // Translate genres from English to Bulgarian using the genreOptions array
      const genresBg = genresEn.map((genre: string) => {
        const matchedGenre = genreOptions.find(
          (option) => option.en.trim() === genre.trim()
        );
        return matchedGenre ? matchedGenre.bg : null;
      });

      // Compare and decide which data to use (Google first, then OMDb)
      const runtime = recommendation.runtimeGoogle || recommendation.runtime; // Use Google runtime if available, otherwise OMDb
      const imdbRating =
        recommendation.imdbRatingGoogle || recommendation.imdbRating; // Use Google IMDb rating if available, otherwise OMDb

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

      // Log the formatted recommendation for debugging
      console.log("Formatted Recommendation:", formattedRecommendation);

      const response = await fetch(
        "http://localhost:5000/save-recommendation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formattedRecommendation) // Send the formatted recommendation directly
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

  const generateMovieRecommendations = async (date: string) => {
    try {
      const typeText = type === "Филм" ? "филма" : "сериала";
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
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
        }
      );

      const responseData = await response.json(); // Get the JSON response
      const responseJson = responseData.choices[0].message.content;
      const unescapedData = responseJson
        .replace(/^```json([\s\S]*?)```$/, "$1")
        .replace(/^```JSON([\s\S]*?)```$/, "$1")
        .replace(/^```([\s\S]*?)```$/, "$1")
        .replace(/^'|'$/g, "") // Remove single quotes at the beginning and end
        .trim();
      console.log("unescapedData: ", unescapedData);
      const escapedData = decodeURIComponent(unescapedData);
      console.log("escapedData: ", escapedData);
      const recommendations = JSON.parse(escapedData);
      console.log("recommendations: ", recommendations);

      for (const movieTitle in recommendations) {
        const movieName = movieTitle; // Use the movie title as the search term

        // Step 3: Fetch IMDb ID via Google Custom Search API

        // 27427e59e17b74763, AIzaSyArE48NFh1befjjDxpSrJ0eBgQh_OmQ7RA
        // e59ceff412ebc4313, AIzaSyDqUez1TEmLSgZAvIaMkWfsq9rSm0kDjIw
        let imdbData;

        try {
          // First attempt with the primary key and cx
          let imdbResponse = await fetch(
            `https://customsearch.googleapis.com/customsearch/v1?key=AIzaSyDqUez1TEmLSgZAvIaMkWfsq9rSm0kDjIw&cx=e59ceff412ebc4313&q=${encodeURIComponent(
              movieName
            )}`
          );
          imdbData = await imdbResponse.json();

          // Retry with secondary key and cx if the first response is invalid
          if (
            !imdbResponse.ok ||
            imdbResponse.status === 429 ||
            imdbData.error
          ) {
            imdbResponse = await fetch(
              `https://customsearch.googleapis.com/customsearch/v1?key=AIzaSyArE48NFh1befjjDxpSrJ0eBgQh_OmQ7RA&cx=27427e59e17b74763&q=${encodeURIComponent(
                movieName
              )}`
            );
            imdbData = await imdbResponse.json();
          }
        } catch (error) {
          console.error("Error fetching IMDb data:", error);
          continue; // Skip this movie if both requests fail
        }

        // Step 4: Extract the IMDb link from the search results
        if (Array.isArray(imdbData.items)) {
          const imdbItem = imdbData.items.find((item: { link: string }) =>
            item.link.includes("imdb.com/title/")
          );

          if (imdbItem) {
            const imdbUrl = imdbItem.link;
            const imdbId = imdbUrl.match(/title\/(tt\d+)\//)?.[1]; // Extract IMDb ID from the URL

            // Extract IMDb Rating and Runtime from the metadata (from `metatags`)
            const imdbRating = imdbItem.pagemap.metatags
              ? imdbItem.pagemap.metatags[0]["twitter:title"]?.match(
                  /⭐ ([\d.]+)/
                )?.[1]
              : null;
            const runtime = imdbItem.pagemap.metatags
              ? imdbItem.pagemap.metatags[0]["og:description"]?.match(
                  /(\d{1,2}h \d{1,2}m|\d{1,2}h|\d{1,3}m)/
                )?.[1] // Match runtime patterns like 2h 30m, 2h, or 90m
              : null;

            const translatedRuntime = runtime
              ? runtime.replace(/h/g, "ч").replace(/m/g, "м").replace(/s/g, "с")
              : null;

            console.log(
              "imdbItem.pagemap.metatags: ",
              imdbItem.pagemap.metatags
            );
            console.log(`Found IMDb ID: ${imdbId}`);
            console.log(`IMDb Rating: ${imdbRating}`);
            console.log(`Runtime: ${translatedRuntime}`);

            if (imdbId) {
              const omdbResponse = await fetch(
                `http://www.omdbapi.com/?apikey=89cbf31c&i=${imdbId}&plot=full`
              );
              const omdbData = await omdbResponse.json();

              console.log(
                `OMDb data for ${movieName}: ${JSON.stringify(
                  omdbData,
                  null,
                  2
                )}`
              );

              // Combine OMDb data and OpenAI data into a single object
              const recommendationData = {
                title: omdbData.Title,
                bgName: recommendations[movieTitle].bgName,
                description: recommendations[movieTitle].description,
                reason: recommendations[movieTitle].reason,
                year: omdbData.Year,
                rated: omdbData.Rated,
                released: omdbData.Released,
                runtime: omdbData.Runtime,
                runtimeGoogle: translatedRuntime, // Store Runtime from Google
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
                imdbRatingGoogle: imdbRating, // Store IMDb Rating from Google
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
              await saveRecommendationToDatabase(recommendationData, date);
            } else {
              console.log(`IMDb ID not found for ${movieName}`);
            }
          }
          // TO DO: Да се измисли какво да се прави ако не се намери филма/сериала
        }
      }
      // Process the API response (e.g., display the recommended movies)
    } catch (error) {
      console.error("Error generating recommendations:", error);
    }
  };
  console.log(submitCount);

  const handleSubmit = async (event: React.FormEvent) => {
    if (submitCount >= 20) {
      alert("Достигнахте максималния брой предложения! :(");
      return;
    }
    setLoading(true);
    setSubmitted(true);
    setShowQuestion(false);
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

    const date = new Date().toISOString();

    event.preventDefault();

    try {
      // Send POST request to server
      const response = await fetch("http://localhost:5000/handle-submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.status === 200) {
        // Handle success
        generateMovieRecommendations(date);
        saveUserPreferences(date);
        setSubmitCount((prevCount) => prevCount + 1);
        setIsModalOpen(true);
      } else {
        // Handle error (e.g., exceeding max requests)
        alert(data.error || "Something went wrong.");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error submitting the request:", error);
      alert("Something went wrong while submitting your request.");
      setLoading(false);
    }
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSeeMore = (movie: any) => {
    alert(`More details for ${movie.title}`);
  };

  const toggleGenre = (genre: { en: string; bg: string }) => {
    setGenres((prevGenres) =>
      prevGenres.find((g) => g.en === genre.en)
        ? prevGenres.filter((g) => g.en !== genre.en)
        : [...prevGenres, genre]
    );
  };

  const toggleMood = (mood: string) => {
    setMoods((prevMoods) =>
      prevMoods.includes(mood)
        ? prevMoods.filter((m) => m !== mood)
        : [...prevMoods, mood]
    );
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setShowQuestion(false);
    setTimeout(() => {
      setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);
      setShowQuestion(true);
    }, 300);
  };

  const handleBack = () => {
    setSelectedAnswer(null);
    setShowQuestion(false);
    setTimeout(() => {
      setCurrentQuestionIndex(
        (prev) => (prev - 1 + questions.length) % questions.length
      );
      setShowQuestion(true);
    }, 300);
  };

  const isBackDisabled = currentQuestionIndex === 0;

  useEffect(() => {
    if (selectedAnswer && selectedAnswer.length > 0) {
      const timer = setTimeout(() => setShowNextButton(true), 100);
      return () => clearTimeout(timer);
    } else {
      setShowNextButton(false);
    }
  }, [selectedAnswer]);

  const handleAnswerClick = (
    setter: React.Dispatch<React.SetStateAction<any>>,
    answer: string
  ) => {
    if (currentQuestion.isMultipleChoice) {
      setSelectedAnswer((prev) => {
        const updatedAnswers = prev
          ? prev.includes(answer)
            ? prev.filter((item) => item !== answer)
            : [...prev, answer]
          : [answer];
        console.log("Updated Answer Selection1:", updatedAnswers);
        setter(updatedAnswers); // Set the updated answers directly
        return updatedAnswers; // Return updated state for `selectedAnswer`
      });
    } else {
      setter(answer);
      setSelectedAnswer([answer]);
      console.log("Updated Answer Selection2:", [answer]);
      console.log("raw2:", answer);
    }
  };

  const handleInputChange = (
    setter: React.Dispatch<React.SetStateAction<any>>,
    value: string
  ) => {
    setter(value);
    console.log("Updated Field Value:", value);
  };

  const handleSubmitTest = () => {
    console.log("Form Field Values on Submit:", {
      moods,
      timeAvailability,
      actors,
      directors,
      countries,
      pacing,
      depth,
      targetGroup
    });
    setLoading(true);
    setSubmitted(true);
    setShowQuestion(false);

    setTimeout(() => {
      fetchFakeMovieDataForTesting(setRecommendationList);
      setLoading(false);
    }, 5000);
  };

  tailChase.register();

  useEffect(() => {
    console.log("Updated Form Field Values:", {
      interests,
      type,
      moods,
      genres,
      timeAvailability,
      actors,
      directors,
      countries,
      pacing,
      depth,
      targetGroup
    });
  }, [
    interests,
    type,
    moods,
    genres,
    timeAvailability,
    actors,
    directors,
    countries,
    pacing,
    depth,
    targetGroup
  ]);

  useEffect(() => {
    setSelectedAnswer(null);
  }, [currentQuestionIndex]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleViewRecommendations = () => {
    setShowQuestion(false);
    setTimeout(() => {
      setSubmitted(true);
    }, 300);
  };

  const handleRetakeQuiz = () => {
    setLoading(true);
    setTimeout(() => {
      setCurrentQuestionIndex(0);
      setSelectedAnswer([]);
      setSubmitted(false);
      setShowQuestion(true);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    if (currentQuestion.isInput && currentQuestion.setter === setInterests) {
      currentQuestion.value = interests;
    }
  }, [currentQuestion, interests]);

  useEffect(() => {
    console.log("recommendationList: ", recommendationList);
  }, [recommendationList]);

  useEffect(() => {
    // TESTING USE EFFECT!!!!!
    setTesting(true);
    setLoading(true);
    fetchFakeMovieDataForTesting(setRecommendationList);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000); // Simulating a 1-second delay
  }, []);

  return (
    <div>
      {testing ? (
        <div className="flex items-center justify-center px-4">
          <CSSTransition
            in={loading}
            timeout={500}
            classNames="fade"
            unmountOnExit
          >
            <div className="fixed inset-0 flex flex-col items-center justify-center text-white p-8 rounded-lg space-y-4">
              <l-tail-chase size="40" speed="1.75" color="white"></l-tail-chase>
              <p>Submitting, please wait...</p>
            </div>
          </CSSTransition>
          {!loading && submitted && recommendationList.length > 0 && (
            <div>
              <Recommendations recommendationList={recommendationList} />
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleRetakeQuiz}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition"
                >
                  Retake Quiz
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center px-4">
          <CSSTransition
            in={loading}
            timeout={500}
            classNames="fade"
            unmountOnExit
          >
            <div className="fixed inset-0 flex flex-col items-center justify-center text-white p-8 rounded-lg space-y-4">
              <l-tail-chase size="40" speed="1.75" color="white"></l-tail-chase>
              <p>Submitting, please wait...</p>
            </div>
          </CSSTransition>

          {!loading && !submitted ? (
            <div className="w-full max-w-3xl">
              <QuizQuestion
                setSelectedAnswer={setSelectedAnswer}
                showQuestion={showQuestion}
                currentQuestion={currentQuestion}
                currentQuestionIndex={currentQuestionIndex}
                totalQuestions={questions.length}
                selectedAnswer={selectedAnswer}
                interests={interests}
                handleInputChange={handleInputChange}
                handleAnswerClick={handleAnswerClick}
                handleNext={handleNext}
                handleBack={handleBack}
                isBackDisabled={isBackDisabled}
                handleSubmitTest={handleSubmitTest}
                setInterests={setInterests}
                recommendationList={recommendationList}
                handleViewRecommendations={handleViewRecommendations}
                submitted={submitted}
              />
            </div>
          ) : null}

          {!loading && submitted && recommendationList.length > 0 && (
            <CSSTransition
              in={submitted}
              timeout={500}
              classNames="fade"
              unmountOnExit
            >
              <div>
                <Recommendations recommendationList={recommendationList} />
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={handleRetakeQuiz}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition"
                  >
                    Retake Quiz
                  </button>
                </div>
              </div>
            </CSSTransition>
          )}
        </div>
      )}
    </div>

    // <Fragment>
    //   <div className="flex flex-col items-center justify-start min-h-screen pt-20 page-header-breadcrumb">
    //     <div className="grid grid-cols-16 gap-1">
    //       <div className="xl:col-span-6 col-span-16">
    //         <div className="mb-4">
    //           <h6 className="">Какво търсите - филм или сериал?</h6>
    //           <div className="">
    //             <select
    //               id="type"
    //               className="form-control"
    //               value={type}
    //               onChange={(e) => setType(e.target.value)}
    //               required
    //             >
    //               {typeOptions.map((option) => (
    //                 <option key={option} value={option}>
    //                   {option}
    //                 </option>
    //               ))}
    //             </select>
    //           </div>
    //         </div>
    //         <div className="mb-4">
    //           <h6 className="">Кои жанрове Ви се гледат в момента?</h6>
    //           <div className="multiCh MChitem">
    //             {genreOptions.map((genre) => (
    //               <div key={genre.en}>
    //                 <label>
    //                   <input
    //                     type="checkbox"
    //                     value={genre.en}
    //                     checked={
    //                       genres.find((g) => g.en === genre.en) !== undefined
    //                     }
    //                     onChange={() => toggleGenre(genre)}
    //                     required
    //                   />
    //                   {genre.bg}
    //                 </label>
    //               </div>
    //             ))}
    //           </div>
    //         </div>
    //         <div className="mb-4">
    //           <h6 className="">Как се чувствате в момента?</h6>
    //           <div className="multiCh MChitem">
    //             {moodOptions.map((mood) => (
    //               <div key={mood}>
    //                 <label>
    //                   <input
    //                     type="checkbox"
    //                     value={mood}
    //                     checked={moods.includes(mood)}
    //                     onChange={() => toggleMood(mood)}
    //                     required
    //                   />
    //                   {mood}
    //                 </label>
    //               </div>
    //             ))}
    //           </div>
    //         </div>
    //         <div className="mb-4">
    //           <label htmlFor="timeAvailability" className="form-label">
    //             С какво време за гледане разполагате?
    //           </label>
    //           <select
    //             id="timeAvailability"
    //             className="form-control"
    //             value={timeAvailability}
    //             onChange={(e) => setTimeAvailability(e.target.value)}
    //             required
    //           >
    //             <option value="" disabled>
    //               Изберете време
    //             </option>
    //             {timeAvailabilityOptions.map((option) => (
    //               <option key={option} value={option}>
    //                 {option}
    //               </option>
    //             ))}
    //           </select>
    //         </div>
    //         <div className="mb-4">
    //           <label htmlFor="age" className="form-label">
    //             Колко стар предпочитате да бъде филма/сериала?
    //           </label>
    //           <select
    //             id="age"
    //             className="form-control"
    //             value={age}
    //             onChange={(e) => setAge(e.target.value)}
    //             required
    //           >
    //             <option value="" disabled>
    //               Изберете възраст
    //             </option>
    //             {ageOptions.map((option) => (
    //               <option key={option} value={option}>
    //                 {option}
    //               </option>
    //             ))}
    //           </select>
    //         </div>
    //         <div className="mb-4">
    //           <label htmlFor="formGroupExampleInput2" className="form-label">
    //             Кои са вашите любими актьори?
    //           </label>
    //           <input
    //             type="text"
    //             className="form-control"
    //             placeholder="Пример: Брад Пит, Леонардо ди Каприо, Ема Уотсън"
    //             value={actors}
    //             onChange={(e) => setActors(e.target.value)}
    //             required
    //           />
    //           <label>
    //             <input
    //               type="checkbox"
    //               checked={actors === "Нямам предпочитания"}
    //               onChange={() => {
    //                 setActors(
    //                   actors === "Нямам предпочитания"
    //                     ? ""
    //                     : "Нямам предпочитания"
    //                 );
    //               }}
    //               required
    //             />
    //             Нямам предпочитания
    //           </label>
    //         </div>
    //         <div className="mb-4">
    //           <label htmlFor="formGroupExampleInput2" className="form-label">
    //             Кои филмови режисьори предпочитате?
    //           </label>
    //           <input
    //             type="text"
    //             className="form-control"
    //             id="formGroupExampleInput2"
    //             placeholder="Пример: Дъфър брадърс, Стивън Спилбърг, Джеки Чан"
    //             value={directors}
    //             onChange={(e) => setDirectors(e.target.value)}
    //             required
    //           />
    //           <label>
    //             <input
    //               type="checkbox"
    //               checked={directors === "Нямам предпочитания"}
    //               onChange={() => {
    //                 setDirectors(
    //                   directors === "Нямам предпочитания"
    //                     ? ""
    //                     : "Нямам предпочитания"
    //                 );
    //               }}
    //               required
    //             />
    //             Нямам предпочитания
    //           </label>
    //         </div>
    //         <div className="mb-4">
    //           <label htmlFor="formGroupExampleInput2" className="form-label">
    //             От кои страни предпочитате да е филмът/сериалът?
    //           </label>
    //           <input
    //             type="text"
    //             className="form-control"
    //             id="formGroupExampleInput2"
    //             placeholder="Пример: България, САЩ"
    //             value={countries}
    //             onChange={(e) => setCountries(e.target.value)}
    //             required
    //           />
    //           <label>
    //             <input
    //               type="checkbox"
    //               checked={countries === "Нямам предпочитания"}
    //               onChange={() => {
    //                 setCountries(
    //                   countries === "Нямам предпочитания"
    //                     ? ""
    //                     : "Нямам предпочитания"
    //                 );
    //               }}
    //               required
    //             />
    //             Нямам предпочитания
    //           </label>
    //         </div>
    //         <div className="mb-4">
    //           <label htmlFor="pacing" className="form-label">
    //             Филми/Сериали с каква бързина на развитие на сюжетното действие
    //             предпочитате?
    //           </label>
    //           <select
    //             id="pacing"
    //             className="form-control"
    //             value={pacing}
    //             onChange={(e) => setPacing(e.target.value)}
    //             required
    //           >
    //             <option value="" disabled>
    //               Изберете бързина на развитие
    //             </option>
    //             {pacingOptions.map((option) => (
    //               <option key={option} value={option}>
    //                 {option}
    //               </option>
    //             ))}
    //           </select>
    //         </div>
    //         <div className="mb-4">
    //           <label htmlFor="depth" className="form-label">
    //             Филми/Сериали с какво ниво на задълбочаване харесвате?
    //           </label>
    //           <select
    //             id="depth"
    //             className="form-control"
    //             value={depth}
    //             onChange={(e) => setDepth(e.target.value)}
    //             required
    //           >
    //             <option value="" disabled>
    //               Изберете ниво на задълбочаване
    //             </option>
    //             {depthOptions.map((option) => (
    //               <option key={option} value={option}>
    //                 {option}
    //               </option>
    //             ))}
    //           </select>
    //         </div>
    //         <div className="mb-4">
    //           <label htmlFor="targetGroup" className="form-label">
    //             Каква е вашата целева група?
    //           </label>
    //           <select
    //             id="targetGroup"
    //             className="form-control"
    //             value={targetGroup}
    //             onChange={(e) => setTargetGroup(e.target.value)}
    //             required
    //           >
    //             <option value="" disabled>
    //               Изберете целева група
    //             </option>
    //             {targetGroupOptions.map((option) => (
    //               <option key={option} value={option}>
    //                 {option}
    //               </option>
    //             ))}
    //           </select>
    //         </div>
    //         <div className="mb-4">
    //           <label htmlFor="formGroupExampleInput2" className="form-label">
    //             Какви теми ви интересуват?
    //           </label>
    //           <div className="form-text">
    //             Предпочитате филм/сериал, който засяга определена историческа
    //             епоха, държава или дори представя история по действителен
    //             случай? Интересуват ви филми, в които се разследва мистерия или
    //             социален проблем, или такива, в които животни играят важна роля?
    //             А какво ще кажете за филми, свързани с пътешествия и изследване
    //             на света, или пък разкази за въображаеми светове? Дайте
    //             описание. Можете също така да споделите примери за
    //             филми/сериали, които предпочитате.
    //           </div>
    //           <textarea
    //             className="form-control"
    //             id="formGroupExampleInput2"
    //             placeholder="Опишете темите, които ви интересуват"
    //             value={interests}
    //             onChange={(e) => setInterests(e.target.value)}
    //             rows={4}
    //             maxLength={200}
    //           />
    //           <div className="text-right mt-2">
    //             <small>{`${interests.length} / 200`}</small>
    //           </div>
    //         </div>

    //         <div>
    //           <div className="ti-btn-list space-x-2 rtl:space-x-reverse mt-4">
    //             <button
    //               type="button"
    //               className={`ti-btn ti-btn-primary-gradient ti-btn-wave`}
    //               onClick={handleSubmit}
    //             >
    //               Submit
    //             </button>
    //           </div>
    //           {/* Modal */}
    //           {isModalOpen && (
    //             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    //               <div className="bg-red rounded-lg p-6 max-w-md w-full relative overflow-y-auto max-h-80">
    //                 <button
    //                   className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
    //                   onClick={closeModal}
    //                 >
    //                   ✕
    //                 </button>
    //                 <div className="text-center">
    //                   <h2 className="text-xl font-semibold mb-4">
    //                     Нашите предложения:
    //                   </h2>
    //                   {/* Content goes here; this will be scrollable if it exceeds max height */}
    //                   <p>
    //                     Your generated recommendations will be displayed here...
    //                   </p>
    //                 </div>
    //               </div>
    //             </div>
    //           )}
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </Fragment>
  );
};

export default RecommendationList;

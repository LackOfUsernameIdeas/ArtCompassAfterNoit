import { FC, useEffect, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { QuizQuestion, Recommendations } from "./Recommendationsdata";
import logo_loader from "../../assets/images/brand-logos/logo_loader.png";
import { useNavigate } from "react-router-dom";
import { checkTokenValidity } from "../home/helper_functions";
import FadeInWrapper from "../../components/common/loader/fadeinwrapper";

interface RecommendationList {}

const RecommendationList: FC<RecommendationList> = () => {
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
  const [recommendationList, setRecommendationList] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showQuestion, setShowQuestion] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<string[] | null>(null);
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
    "Щастлив/-а",
    "Спокоен/-йна",
    "Разочарован/-на",
    "Уморен/-на",
    "Нервен/-на",
    "Разгневен/-на",
    "Стресиран/-на",
    "Носталгичен/-на",
    "Безразличен/-на",
    "Оптимистичен/-на",
    "Песимистичен/-на",
    "Весел/-а",
    "Смутен/-на",
    "Озадачен/-на",
    "Разревожен/-на",
    "Вдъхновен/-на"
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

  const questions = [
    {
      question: "Какво търсите - филм или сериал?",
      options: typeOptions,
      value: type,
      setter: setType
    },
    {
      question: "Кои жанрове Ви се гледат в момента?",
      options: genreOptions,
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

  const saveRecommendationToDatabase = async (
    recommendation: any,
    date: string
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
              await saveRecommendationToDatabase(recommendationData, date);
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
  console.log(submitCount);

  const handleSubmit = async () => {
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
        await saveUserPreferences(date);
        await generateMovieRecommendations(date);
        setSubmitCount((prevCount) => prevCount + 1);
      } else {
        alert(data.error || "Something went wrong.");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error submitting the request:", error);
      alert("Something went wrong while submitting your request.");
      setLoading(false);
    }
  };

  const toggleGenre = (genre: { en: string; bg: string }) => {
    setGenres((prevGenres) =>
      prevGenres.find((g) => g.en === genre.en)
        ? prevGenres.filter((g) => g.en !== genre.en)
        : [...prevGenres, genre]
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
  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerClick = (
    setter: React.Dispatch<React.SetStateAction<any>>,
    answer: string
  ) => {
    if (currentQuestion.isMultipleChoice) {
      if (currentQuestion.setter === setGenres) {
        const selectedGenre = genreOptions.find((genre) => genre.bg === answer);

        if (selectedGenre) {
          toggleGenre(selectedGenre);

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
      setLoading(false);
    }, 5000);
  };

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

  const handleViewRecommendations = () => {
    setShowQuestion(false);
    setLoading(true);
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 500);
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

  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      const redirectUrl = await checkTokenValidity(); // Проверка на валидността на токена
      if (redirectUrl) {
        navigate(redirectUrl); // Пренасочване, ако токенът не е валиден
      }
    };

    validateToken();
  }, []); // Добавяне на navigate като зависимост

  return (
    <FadeInWrapper>
      <div>
        <div className="flex items-center justify-center px-4">
          <CSSTransition
            in={loading}
            timeout={500}
            classNames="fade"
            unmountOnExit
            key="loading"
          >
            <div className="fixed inset-0 flex flex-col items-center justify-center space-y-4">
              <img src={logo_loader} alt="loading" className="spinner" />
              <p className="text-xl">Зареждане...</p>
            </div>
          </CSSTransition>

          <CSSTransition
            in={!loading && !submitted}
            timeout={500}
            classNames="fade"
            unmountOnExit
          >
            <div className="w-full max-w-4xl">
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
                handleSubmit={handleSubmit}
                setInterests={setInterests}
                recommendationList={recommendationList}
                handleViewRecommendations={handleViewRecommendations}
                submitted={submitted}
              />
            </div>
          </CSSTransition>

          <CSSTransition
            in={!loading && submitted}
            timeout={500}
            classNames="fade"
            unmountOnExit
          >
            <div>
              <div className="my-6 text-center">
                <p className="text-lg text-gray-600">
                  Искате други препоръки?{" "}
                  <button
                    onClick={handleRetakeQuiz}
                    className="text-primary font-semibold hover:text-secondary transition-colors underline"
                  >
                    Повторете въпросника
                  </button>
                </p>
              </div>
              <Recommendations recommendationList={recommendationList} />
            </div>
          </CSSTransition>
        </div>
      </div>
    </FadeInWrapper>
  );
};

export default RecommendationList;

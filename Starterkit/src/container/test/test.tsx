import { FC, Fragment, useState } from "react";

interface Test {}

const Test: FC<Test> = () => {
  const [genres, setGenres] = useState<string[]>([]);
  const [mood, setMood] = useState("");
  const [timeAvailability, setTimeAvailability] = useState("");
  const [actors, setActors] = useState("");
  const [directors, setDirectors] = useState("");
  const [interests, setInterests] = useState("");
  const [countries, setCountries] = useState("");
  const [pacing, setPacing] = useState("");
  const [depth, setDepth] = useState("");
  const [targetGroup, setTargetGroup] = useState("");

  const genreOptions = [
    "Екшън",
    "Приключенски",
    "Анимация",
    "Биография",
    "Комедия",
    "Криминален",
    "Документален",
    "Драма",
    "Семейни",
    "Фентъзи",
    "Филм-ноар",
    "Исторически",
    "Ужаси",
    "Музика",
    "Мюзикъл",
    "Мистерия",
    "Романтичен",
    "Научна фантастика",
    "Спортен",
    "Трилър",
    "Военен",
    "Уестърн"
  ];

  const timeAvailabilityOptions = [
    "1 час",
    "2 часа",
    "3 часа",
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

  const openAIKey = import.meta.env.VITE_OPENAI_API_KEY;
  const generateMovieRecommendations = async () => {
    try {
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
                content: `You are an AI that recommends movies based on user preferences. Provide a list of 10 movies that match the user's taste and preferences, formatted in Bulgarian, with detailed justifications. Return the result in JSON format as instructed.`
              },
              {
                role: "user",
                content: `Препоръчай ми 5 филма за гледане, които да са съобразени с моите вкусове и предпочитания, а именно:
              Любими жанрове: ${genres}.
              Емоционално състояние в този момент: ${mood}.
              Разполагаемо свободно време за гледане: ${timeAvailability}.
              Любими актьори: ${actors}.
              Любими филмови режисьори: ${directors}.
              Теми, които ме интересуват: ${interests}.
              Филмите могат да бъдат от следните страни: ${countries}.
              Темпото (бързината) на филмите предпочитам да бъде: ${pacing}.
              Предпочитам филмите да са: ${depth}.
              Целевата група е: ${targetGroup}.
              Дай информация за всеки отделен филм по отделно защо той е подходящ за мен. Форматирай своя response в JSON формат по този начин:
              {
                "Официално име на филма на английски": {
                  "bgName": "Официално име на филма на български",
                  "description": "Описание на филма",
                  "reason": "Защо този филм е подходящ за мен?"
                },
                // ...additional movies
              }`
              }
            ]
          })
        }
      );

      //--EXAMPLE--
      // Препоръчай ми 10 филма за гледане, които да са съобразени с моите вкусове и предпочитания, а именно:
      // Любими жанрове: трилър, хорър.
      // Емоционално състояние в този момент: нормално.
      // Разполагаемо свободно време за гледане: цяла вечер.
      // Любими актьори: Мили Боби Браун.
      // Любими филмови режисьори: Нямам предпочитания.
      // Теми, които ме интересуват: Нямам предпочитания.
      // Филмите могат да бъдат от следните страни: САЩ.
      // Темпото (бързината) на филмите предпочитам да бъде: Нямам предпочитания.
      // Предпочитам филмите да се задълбочават и да имат специфични истории и/или терминологии, специфично съществуващи във филма.
      // Целевата група е: Без възрастови ограничения.
      // Дай информация за всеки отделен филм по отделно защо той е подходящ за мен. Форматирай своя response в JSON формат по този начин:
      // {
      //   "Официално име на филма на английски": {
      //     "bgName": "Официално име на филма на български",
      //     "description": "Описание на филма",
      //     "reason": "Защо този филм е подходящ за мен?"
      //   },
      //   // ...additional movies
      // }
      //--EXAMPLE--

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
        const imdbResponse = await fetch(
          `https://customsearch.googleapis.com/customsearch/v1?key=AIzaSyArE48NFh1befjjDxpSrJ0eBgQh_OmQ7RA&cx=27427e59e17b74763&q=${encodeURIComponent(
            movieName
          )}`
        );
        const imdbData = await imdbResponse.json();

        // Step 4: Extract the IMDb link from the search results
        if (Array.isArray(imdbData.items)) {
          const imdbLink = imdbData.items.find((item: { link: string }) =>
            item.link.includes("imdb.com/title/")
          );

          if (imdbLink) {
            const imdbUrl = imdbLink.link;
            const imdbId = imdbUrl.match(/title\/(tt\d+)\//)?.[1]; // Extract IMDb ID from the URL
            if (imdbId) {
              const omdbResponse = await fetch(
                `http://www.omdbapi.com/?apikey=89cbf31c&i=${imdbId}`
              );
              const omdbData = await omdbResponse.json();

              console.log(
                `OMDb data for ${movieName}: ${JSON.stringify(
                  omdbData,
                  null,
                  2
                )}`
              );
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

  const toggleGenre = (genre: string) => {
    setGenres((prevGenres) =>
      prevGenres.includes(genre)
        ? prevGenres.filter((g) => g !== genre)
        : [...prevGenres, genre]
    );
  };

  return (
    <Fragment>
      <div className="flex flex-col items-center justify-start min-h-screen pt-80 page-header-breadcrumb">
        <div className="grid grid-cols-12 gap-6">
          <div className="xl:col-span-6 col-span-12">
            <div className="mb-4">
              <h6 className="questionTxt bubble left">
                Кои жанрове Ви се гледат в момента?
              </h6>
              <div className="bubble right">
                {genreOptions.map((genre) => (
                  <div key={genre}>
                    <label>
                      <input
                        type="checkbox"
                        value={genre}
                        checked={genres.includes(genre)}
                        onChange={() => toggleGenre(genre)}
                      />
                      {genre}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <h6 className="questionTxt bubble left">
                Как се чувствате в момента?
              </h6>
              <div className="bubble right">
                <input
                  type="text"
                  className="form-control"
                  id="formGroupExampleInput2"
                  placeholder="Пример: развълнуван/на, любопитен/на, тъжен/на, изплашен/на"
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="timeAvailability" className="form-label">
                С какво време разполагате?
              </label>
              <select
                id="timeAvailability"
                className="form-control"
                value={timeAvailability}
                onChange={(e) => setTimeAvailability(e.target.value)}
              >
                <option value="" disabled>
                  Изберете време
                </option>
                {timeAvailabilityOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="formGroupExampleInput2" className="form-label">
                Кои са вашите любими актьори?
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Пример: Брад Пит, Леонардо ди Каприо, Ема Уотсън"
                value={actors}
                onChange={(e) => setActors(e.target.value)}
              />
              <label>
                <input
                  type="checkbox"
                  checked={actors === "Нямам предпочитания"}
                  onChange={() => {
                    setActors(
                      actors === "Нямам предпочитания"
                        ? ""
                        : "Нямам предпочитания"
                    );
                  }}
                />
                Нямам предпочитания
              </label>
            </div>
            <div className="mb-4">
              <label htmlFor="formGroupExampleInput2" className="form-label">
                Кои филмови режисьори предпочитате?
              </label>
              <input
                type="text"
                className="form-control"
                id="formGroupExampleInput2"
                placeholder="Пример: Дъфър брадърс, Стивън Спилбърг, Джеки Чан"
                value={directors}
                onChange={(e) => setDirectors(e.target.value)}
              />
              <label>
                <input
                  type="checkbox"
                  checked={directors === "Нямам предпочитания"}
                  onChange={() => {
                    setDirectors(
                      directors === "Нямам предпочитания"
                        ? ""
                        : "Нямам предпочитания"
                    );
                  }}
                />
                Нямам предпочитания
              </label>
            </div>
            <div className="mb-4">
              <label htmlFor="formGroupExampleInput2" className="form-label">
                От кои страни предпочитате да е филмът?
              </label>
              <input
                type="text"
                className="form-control"
                id="formGroupExampleInput2"
                placeholder="Пример: България, САЩ"
                value={countries}
                onChange={(e) => setCountries(e.target.value)}
              />
              <label>
                <input
                  type="checkbox"
                  checked={countries === "Нямам предпочитания"}
                  onChange={() => {
                    setCountries(
                      countries === "Нямам предпочитания"
                        ? ""
                        : "Нямам предпочитания"
                    );
                  }}
                />
                Нямам предпочитания
              </label>
            </div>
            <div className="mb-4">
              <label htmlFor="pacing" className="form-label">
                Филми с каква бързина на развитие на сюжетното действие
                предпочитате?
              </label>
              <select
                id="pacing"
                className="form-control"
                value={pacing}
                onChange={(e) => setPacing(e.target.value)}
              >
                <option value="" disabled>
                  Изберете бързина на развитие
                </option>
                {pacingOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="depth" className="form-label">
                Филми с какво ниво на задълбочаване харесвате?
              </label>
              <select
                id="depth"
                className="form-control"
                value={depth}
                onChange={(e) => setDepth(e.target.value)}
              >
                <option value="" disabled>
                  Изберете ниво на задълбочаване
                </option>
                {depthOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="targetGroup" className="form-label">
                Каква е вашата целева група?
              </label>
              <select
                id="targetGroup"
                className="form-control"
                value={targetGroup}
                onChange={(e) => setTargetGroup(e.target.value)}
              >
                <option value="" disabled>
                  Изберете целева група
                </option>
                {targetGroupOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="formGroupExampleInput2" className="form-label">
                Какви теми ви интересуват?
              </label>
              <div className="form-text">
                Предпочитате филм, който засяга определена историческа ера,
                държава или пък такъв, в който се изследва, разгадава мистерия
                или социален проблем? Дайте описание. Можете също така да
                споделите примери за филми, които предпочитате.
              </div>
              <textarea
                className="form-control"
                id="formGroupExampleInput2"
                placeholder="Опишете темите, които ви интересуват"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                rows={4}
              />
            </div>

            <div className="ti-btn-list space-x-2 rtl:space-x-reverse mt-4">
              <button
                type="button"
                className={`ti-btn ti-btn-primary-gradient ti-btn-wave`}
                onClick={generateMovieRecommendations}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Test;

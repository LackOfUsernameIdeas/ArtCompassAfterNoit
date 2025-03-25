import { FilteredBrainData } from "@/container/types_common";
import { MoviesSeriesUserPreferences } from "./moviesSeriesRecommendations-types";

export const moodOptions = [
  "Развълнуван/-на 😄",
  "Любопитен/-на 🤔",
  "Тъжен/-на 😢",
  "Щастлив/-а 😊",
  "Спокоен/-йна 😌",
  "Разочарован/-на 😞",
  "Уморен/-на 😴",
  "Нервен/-на 😟",
  "Разгневен/-на 😠",
  "Стресиран/-на 😰",
  "Носталгичен/-на 😭",
  "Безразличен/-на 😐",
  "Оптимистичен/-на 😃",
  "Песимистичен/-на 😔",
  "Весел/-а 😁",
  "Смутен/-на 😳",
  "Озадачен/-на 🤨",
  "Разтревожен/-на 😧",
  "Вдъхновен/-на ✨"
];

export const timeAvailabilityOptions = [
  "1 час",
  "2 часа",
  "3 часа",
  "Нямам предпочитания"
];

export const ageOptions = [
  "Публикуван в последните 3 години",
  "Публикуван в последните 10 години",
  "Публикуван в последните 20 години",
  "Нямам предпочитания"
];

export const pacingOptions = [
  "бавни, концентриращи се върху разкази на героите",
  "бързи с много напрежение",
  "Нямам предпочитания"
];
export const depthOptions = [
  "Лесни за проследяване - релаксиращи",
  "Средни - с ясни сюжетни линии",
  "Трудни - с много истории и терминологии, характерни за филма/сериала",
  "Нямам предпочитания"
];

export const targetGroupOptions = [
  "Деца",
  "Тийнейджъри",
  "Възрастни",
  "Семейни",
  "Семейство и деца",
  "Възрастни над 65"
];

export const openAIKey = import.meta.env.VITE_OPENAI_API_KEY;

export const moviesSeriesStandardPreferencesPrompt = (
  userPreferences: MoviesSeriesUserPreferences
) => {
  const {
    recommendationType,
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

  const typeText = recommendationType === "Филм" ? "филма" : "сериала";

  return {
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
                'Официално име на ${typeText} на английски, както е прието да бъде': {
                  'bgName': 'Официално име на ${typeText} на български, както е прието да бъде, а не буквален превод',
                  'description': 'Описание на ${typeText}',
                  'reason': 'Защо този филм/сериал е подходящ за мен?'
                },
                'Официално име на ${typeText} на английски, както е прието да бъде': {
                  'bgName': 'Официално име на ${typeText} на български, както е прието да бъде, а не буквален превод',
                  'description': 'Описание на ${typeText}',
                  'reason': 'Защо този филм/сериал е подходящ за мен?'
                },
                // ...additional movies
              }. Не добавяй излишни думи или скоби. Избягвай вложени двойни или единични кавички(кавички от един тип едно в друго, които да дават грешки на JSON.parse функцията). Увери се, че всички данни са правилно "escape-нати", за да не предизвикат грешки в JSON формата. 
              JSON формата трябва да е валиден за JavaScript JSON.parse() функцията.`
      }
    ]
  };
};

export const moviesSeriesBrainAnalysisPrompt = (
  brainWaveData: FilteredBrainData[]
) => {
  const brainWaveString = JSON.stringify(brainWaveData, null, 2);

  const brainWaveStringTest = JSON.stringify(
    [
      {
        time: "12:38:59",
        attention: 40,
        meditation: 26,
        delta: 540377,
        theta: 94302,
        lowAlpha: 36855,
        highAlpha: 35990,
        lowBeta: 31996,
        highBeta: 22568,
        lowGamma: 16016,
        highGamma: 9259
      },
      {
        time: "12:39:00",
        attention: 41,
        meditation: 21,
        delta: 924249,
        theta: 303742,
        lowAlpha: 45780,
        highAlpha: 24454,
        lowBeta: 35205,
        highBeta: 31985,
        lowGamma: 12747,
        highGamma: 36390
      },
      {
        time: "12:39:01",
        attention: 41,
        meditation: 7,
        delta: 2035471,
        theta: 518817,
        lowAlpha: 149522,
        highAlpha: 14067,
        lowBeta: 19717,
        highBeta: 80477,
        lowGamma: 30622,
        highGamma: 96761
      },
      {
        time: "12:39:02",
        attention: 43,
        meditation: 1,
        delta: 652443,
        theta: 22933,
        lowAlpha: 4187,
        highAlpha: 2861,
        lowBeta: 9946,
        highBeta: 3065,
        lowGamma: 1203,
        highGamma: 1458
      },
      {
        time: "12:39:03",
        attention: 44,
        meditation: 1,
        delta: 732450,
        theta: 65246,
        lowAlpha: 3046,
        highAlpha: 18603,
        lowBeta: 7758,
        highBeta: 14553,
        lowGamma: 5940,
        highGamma: 3205
      },
      {
        time: "12:39:04",
        attention: 51,
        meditation: 8,
        delta: 80718,
        theta: 29323,
        lowAlpha: 9798,
        highAlpha: 31401,
        lowBeta: 20898,
        highBeta: 22050,
        lowGamma: 9649,
        highGamma: 13857
      },
      {
        time: "12:39:05",
        attention: 48,
        meditation: 1,
        delta: 1150187,
        theta: 229696,
        lowAlpha: 27053,
        highAlpha: 9074,
        lowBeta: 6194,
        highBeta: 16044,
        lowGamma: 6218,
        highGamma: 5908
      },
      {
        time: "12:39:06",
        attention: 48,
        meditation: 1,
        delta: 330289,
        theta: 36994,
        lowAlpha: 1007,
        highAlpha: 5076,
        lowBeta: 1118,
        highBeta: 3897,
        lowGamma: 2575,
        highGamma: 2636
      },
      {
        time: "12:39:08",
        attention: 48,
        meditation: 1,
        delta: 663782,
        theta: 67376,
        lowAlpha: 10212,
        highAlpha: 10936,
        lowBeta: 28042,
        highBeta: 28577,
        lowGamma: 36750,
        highGamma: 14200
      },
      {
        time: "12:39:09",
        attention: 57,
        meditation: 1,
        delta: 22996,
        theta: 35171,
        lowAlpha: 7366,
        highAlpha: 15533,
        lowBeta: 16626,
        highBeta: 16259,
        lowGamma: 46061,
        highGamma: 16922
      },
      {
        time: "12:39:10",
        attention: 54,
        meditation: 3,
        delta: 631198,
        theta: 109571,
        lowAlpha: 27445,
        highAlpha: 18691,
        lowBeta: 9185,
        highBeta: 8670,
        lowGamma: 3961,
        highGamma: 7375
      },
      {
        time: "12:39:11",
        attention: 57,
        meditation: 27,
        delta: 995641,
        theta: 68378,
        lowAlpha: 90254,
        highAlpha: 62331,
        lowBeta: 31028,
        highBeta: 57873,
        lowGamma: 12933,
        highGamma: 13617
      },
      {
        time: "12:39:12",
        attention: 57,
        meditation: 43,
        delta: 859495,
        theta: 35919,
        lowAlpha: 8399,
        highAlpha: 18892,
        lowBeta: 15296,
        highBeta: 21676,
        lowGamma: 16549,
        highGamma: 9131
      },
      {
        time: "12:39:13",
        attention: 53,
        meditation: 29,
        delta: 296991,
        theta: 107377,
        lowAlpha: 4545,
        highAlpha: 6489,
        lowBeta: 15913,
        highBeta: 15879,
        lowGamma: 7759,
        highGamma: 3533
      },
      {
        time: "12:39:14",
        attention: 64,
        meditation: 47,
        delta: 128141,
        theta: 38294,
        lowAlpha: 48502,
        highAlpha: 25800,
        lowBeta: 7528,
        highBeta: 31833,
        lowGamma: 9515,
        highGamma: 14604
      },
      {
        time: "12:39:15",
        attention: 56,
        meditation: 44,
        delta: 1918177,
        theta: 120067,
        lowAlpha: 57463,
        highAlpha: 75977,
        lowBeta: 29950,
        highBeta: 26161,
        lowGamma: 42417,
        highGamma: 7656
      },
      {
        time: "12:39:16",
        attention: 56,
        meditation: 41,
        delta: 406639,
        theta: 100659,
        lowAlpha: 6268,
        highAlpha: 23156,
        lowBeta: 5316,
        highBeta: 33127,
        lowGamma: 27756,
        highGamma: 3214
      },
      {
        time: "12:39:17",
        attention: 61,
        meditation: 56,
        delta: 469726,
        theta: 98722,
        lowAlpha: 19576,
        highAlpha: 21099,
        lowBeta: 21995,
        highBeta: 37099,
        lowGamma: 20623,
        highGamma: 6290
      },
      {
        time: "12:39:18",
        attention: 63,
        meditation: 47,
        delta: 68557,
        theta: 26098,
        lowAlpha: 10332,
        highAlpha: 19632,
        lowBeta: 12183,
        highBeta: 24241,
        lowGamma: 15781,
        highGamma: 4731
      },
      {
        time: "12:39:19",
        attention: 69,
        meditation: 43,
        delta: 65938,
        theta: 53423,
        lowAlpha: 21248,
        highAlpha: 25622,
        lowBeta: 3941,
        highBeta: 23659,
        lowGamma: 13457,
        highGamma: 6965
      },
      {
        time: "12:39:20",
        attention: 61,
        meditation: 29,
        delta: 514472,
        theta: 104310,
        lowAlpha: 4203,
        highAlpha: 1751,
        lowBeta: 3859,
        highBeta: 9649,
        lowGamma: 5281,
        highGamma: 2438
      },
      {
        time: "12:39:21",
        attention: 61,
        meditation: 37,
        delta: 1806420,
        theta: 83148,
        lowAlpha: 26411,
        highAlpha: 20005,
        lowBeta: 41687,
        highBeta: 37278,
        lowGamma: 42078,
        highGamma: 13870
      },
      {
        time: "12:39:22",
        attention: 60,
        meditation: 40,
        delta: 574577,
        theta: 30410,
        lowAlpha: 22258,
        highAlpha: 14415,
        lowBeta: 12806,
        highBeta: 22279,
        lowGamma: 7474,
        highGamma: 6947
      },
      {
        time: "12:39:23",
        attention: 51,
        meditation: 26,
        delta: 1491763,
        theta: 181895,
        lowAlpha: 14354,
        highAlpha: 32236,
        lowBeta: 99110,
        highBeta: 13995,
        lowGamma: 26642,
        highGamma: 12591
      },
      {
        time: "12:39:24",
        attention: 63,
        meditation: 50,
        delta: 1053416,
        theta: 25439,
        lowAlpha: 16506,
        highAlpha: 13246,
        lowBeta: 24414,
        highBeta: 27287,
        lowGamma: 19548,
        highGamma: 14360
      }
    ],
    null,
    2
  );
  return {
    model: "gpt-4o-2024-08-06",
    messages: [
      {
        role: "system",
        content: `You are an AI that recommends movies and series based on data from the 'NeuroSky MindWave Mobile 2: EEG Sensor'. The device provides insights into the user's brain activity, cognitive state and emotional levels by measuring EEG power spectrums (Delta, Theta, low and high Alpha, low and high Beta, low and high Gamma) and using data from EEG algorithms - Attention and Mediation. Relying on this data, provide a list of movies and series, formatted in Bulgarian, with detailed justifications. Return the result in JSON format as instructed.`
      },
      {
        role: "user",
        content: `Препоръчай ми 5 филма или сериала за гледане, които ЗАДЪЛЖИТЕЛНО да съвпадат с получените данни за мозъчна активност, а именно:
          ${brainWaveStringTest}.
          Подсигури подробна информация за всеки отделен филм/сериал по отделно защо той е подходящ за мен НА БАЗА ДАННИТЕ ЗА МОЗЪЧНА АКТИВНОСТ.
          Задължително искам имената на филмите/сериалите да бъдат абсолютно точно както са официално на български език – така, както са известни сред публиката в България.
          Не се допуска буквален превод на заглавията от английски, ако официалното българско заглавие се различава от буквалния превод.
          Не препоръчвай 18+ филми/сериали.
          Форматирай своя response във валиден JSON формат по този начин като използваш само двойни кавички:
          {
            'Официално име на филма или сериала на английски, както е прието да бъде': {
              'bgName': 'Официално име на филма или сериала на български, както е прието да бъде, а не буквален превод',
              'description': 'Описание на филма или сериала',
              'reason': 'Защо този филм/сериал е подходящ за мен, според данните от устройството?'
            },
            'Официално име на филма или сериала на английски, както е прието да бъде': {
              'bgName': 'Официално име на филма или сериала на български, както е прието да бъде, а не буквален превод',
              'description': 'Описание на филма или сериала',
              'reason': 'Защо този филм/сериал е подходящ за мен, според данните от устройството?'
            }
          }`
      }
    ]
  };
};

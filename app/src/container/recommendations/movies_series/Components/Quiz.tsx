import { FC, useEffect, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { RecommendationsList } from "./RecommendationsList";
import { QuizQuestions } from "./QuizQuestions";
import { analyzeRecommendations, handleRetakeQuiz } from "../helper_functions";
import Loader from "../../../../components/common/loader/Loader";
import {
  QuizProps,
  RecommendationsAnalysis
} from "../moviesSeriesRecommendations-types";
import MovieSeriesDataWidgets from "./MovieSeriesDataWidgets/MovieSeriesDataWidgets";

export const Quiz: FC<QuizProps> = ({
  setBookmarkedMovies,
  setCurrentBookmarkStatus,
  setAlertVisible,
  bookmarkedMovies
}) => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [recommendationList, setRecommendationList] = useState<any[]>([]);
  const [recommendationsAnalysis, setRecommendationsAnalysis] =
    useState<RecommendationsAnalysis>({
      relevantCount: 0,
      totalCount: 0,
      precisionValue: 0,
      precisionPercentage: 0,
      relevantRecommendations: []
    });

  const alreadyHasRecommendations = recommendationList.length > 0;

  // Call analyzeRecommendations inside useEffect to make sure it has a stable identity
  useEffect(() => {
    const userPreferences = {
      type: "Сериал",
      genres: [
        {
          en: "Sport",
          bg: "Спортен"
        }
      ],
      moods: ["Оптимистичен/-на"],
      timeAvailability: "Нямам предпочитания",
      age: "Нямам предпочитания",
      actors: "Нямам предпочитания",
      directors: "Нямам предпочитания",
      interests: "Нямам предпочитания",
      countries: "Нямам предпочитания",
      pacing: "Нямам предпочитания",
      depth: "Нямам предпочитания",
      targetGroup: "Възрастни"
    };

    const recommendations = [
      {
        title: "Ted Lasso",
        bgName: "Тед Ласо",
        description:
          "Това е комедиен сериал, който разказва историята на Тед Ласо, футболен треньор, който поема ръководство на английски футболен клуб, въпреки че няма опит в професионалния футбол.",
        reason:
          "Това шоу носи оптимистично настроение с герои, които се справят с предизвикателства във футбола с голяма доза хумор и оптимизъм. Подходящо е за хора, които търсят вдъхновение и забавление от света на спорта.",
        year: "2020–",
        rated: "TV-MA",
        released: "14 Aug 2020",
        runtime: "30 min",
        runtimeGoogle: "30м",
        genre: "Comedy, Drama, Sport",
        director: "N/A",
        writer: "Brendan Hunt, Joe Kelly, Bill Lawrence",
        actors: "Jason Sudeikis, Hannah Waddingham, Jeremy Swift",
        plot: "American college football coach Ted Lasso heads to London to manage AFC Richmond, a struggling English Premier League soccer team.",
        language: "English",
        country: "United States, United Kingdom",
        awards: "Won 13 Primetime Emmys. 94 wins & 246 nominations total",
        poster:
          "https://m.media-amazon.com/images/M/MV5BZmI3YWVhM2UtNDZjMC00YTIzLWI2NGUtZWIxODZkZjVmYTg1XkEyXkFqcGc@._V1_SX300.jpg",
        ratings: [
          {
            Source: "Internet Movie Database",
            Value: "8.8/10"
          }
        ],
        metascore: "N/A",
        imdbRating: "8.8",
        imdbRatingGoogle: "8.8",
        imdbVotes: "382,307",
        imdbID: "tt10986410",
        type: "series",
        totalSeasons: "3"
      },
      {
        title: "Slam Dunk",
        bgName: "Сламдауънк",
        description:
          "Този анимационен сериал от Япония разказва историята на ученически баскетболен отбор, който се изправя пред различни предизвикателства, за да спечели национален шампионат.",
        reason:
          "За оптимистичния зрител, този сериал предлага вдъхновяващи моменти и показва как спортът може да изгради приятелства и характер. Анимацията и динамиката го правят лесно достъпен и приятен за гледане.",
        year: "1993–1996",
        rated: "TV-PG",
        released: "23 Oct 1993",
        runtime: "22 min",
        runtimeGoogle: "22м",
        genre: "Animation, Comedy, Drama",
        director: "N/A",
        writer: "N/A",
        actors: "Hisao Egawa, Eriko Hara, Akiko Hiramatsu",
        plot: "About Sakuragi Hanamichi, a freshman of Shohoku High School who joins the basketball team because of the girl he has a crush on, Haruko. Although he is newbie in this sport, he is no ordinary basketball player.",
        language: "Japanese, English",
        country: "Japan",
        awards: "N/A",
        poster:
          "https://m.media-amazon.com/images/M/MV5BNjIyYjg4YWUtNTM2OS00YTc3LWE5NTEtZTdmMDdiMzE1OGJjXkEyXkFqcGc@._V1_SX300.jpg",
        ratings: [
          {
            Source: "Internet Movie Database",
            Value: "8.7/10"
          }
        ],
        metascore: "N/A",
        imdbRating: "8.7",
        imdbRatingGoogle: "8.7",
        imdbVotes: "8,031",
        imdbID: "tt0965547",
        type: "series",
        totalSeasons: "1"
      },
      {
        title: "All American",
        bgName: "Всички американци",
        description:
          "Драма, основаваща се на живота на млад футболист, който сменя училища и квартали, за да играе в елитно отбора на Бевърли Хилс.",
        reason:
          "Сериалът е подходящ за възрастни, които се интересуват от спортни драми, където героите преодоляват лични и социални предизвикателства. Оптимистичният подход към историята прави сериала привлекателен.",
        year: "2018–",
        rated: "TV-14",
        released: "10 Oct 2018",
        runtime: "45 min",
        runtimeGoogle: "45м",
        genre: "Drama, Sport",
        director: "N/A",
        writer: "April Blair",
        actors: "Michael Evans Behling, Daniel Ezra, Samantha Logan",
        plot: "Inspired by the true life story of NFL Superbowl Champion, Spencer Paysinger, All American is an inspiring, ensemble family drama about a young, high school football phenom, Spencer James and the two families whose homes he shares after transferring from Crenshaw to Beverly High - his mother and brother in South Central LA and the Bakers of Beverly Hills. But as these two families and their vastly different worlds are drawn together, Spencer, the Bakers, and the James family will discover that the differences that divide us on the surface hide a deeper connection - the complicated, imperfect humanity that unites us all.",
        language: "English",
        country: "United States",
        awards: "2 wins & 9 nominations total",
        poster:
          "https://m.media-amazon.com/images/M/MV5BMjZhNDFkZDEtMmFiNC00ZWM0LWJhY2MtNzNiYTdiMmQyNmNmXkEyXkFqcGc@._V1_SX300.jpg",
        ratings: [
          {
            Source: "Internet Movie Database",
            Value: "7.6/10"
          }
        ],
        metascore: "N/A",
        imdbRating: "7.6",
        imdbRatingGoogle: "7.6",
        imdbVotes: "15,114",
        imdbID: "tt7414406",
        type: "series",
        totalSeasons: "7"
      },
      {
        title: "The English Game",
        bgName: "Английската игра",
        description:
          "Исторически минисериал, който разказва за зараждането на съвременния футбол в Англия през 19-ти век.",
        reason:
          "Повдига темите за спортния дух и социалните промени, като показва ранната еволюция на футбола, уникална комбинация за зрители с интерес към спорта и историята, със съдържание, което вдъхва оптимизъм.",
        year: "2020",
        rated: "TV-14",
        released: "21 Mar 2020",
        runtime: "281 min",
        runtimeGoogle: "47м",
        genre: "Drama, History, Sport",
        director: "N/A",
        writer: "Julian Fellowes",
        actors: "Edward Holcroft, Kevin Guthrie, Charlotte Hope",
        plot: "England, 1879. With football still in its infancy and an amateur sport, upper-class teams, led by Old Etonians, have dominated the early years of the FA Cup. But a revolution is brewing: against the rules of the FA, James Walsh, the owner of working-class side Darwen FC and the associated mill, secretly pays talented Scottish players Fergus Suter and Jimmy Love to join the team ahead of the cup quarterfinals against Old Etonians, whose roster features several members of the FA Board, including team captain Arthur Kinnaird.",
        language: "English",
        country: "United Kingdom",
        awards: "N/A",
        poster:
          "https://m.media-amazon.com/images/M/MV5BZDgxMTBhZGEtMWZkYi00M2Q4LTk1NzgtYTdkNjhiZTI1YjZmXkEyXkFqcGc@._V1_SX300.jpg",
        ratings: [
          {
            Source: "Internet Movie Database",
            Value: "7.6/10"
          }
        ],
        metascore: "N/A",
        imdbRating: "7.6",
        imdbRatingGoogle: "7.6",
        imdbVotes: "17,734",
        imdbID: "tt8403664",
        type: "series",
        totalSeasons: "1"
      },
      {
        title: "Haikyu!!",
        bgName: "Хайкю!!",
        description:
          "Японски анимационен сериал, който следва историята на ученически волейболен отбор, който се стреми да стане най-добър в страната.",
        reason:
          "Този спортен аниме сериал се фокусира върху упоритата работа, приятелството и сътрудничеството, като носи положителни и вдъхновяващи послания, което го прави идеален избор за тези, които искат оптимистична и жизнена спортна история.",
        year: "2014–2020",
        rated: "TV-14",
        released: "05 Apr 2014",
        runtime: "1 min",
        runtimeGoogle: "24м",
        genre: "Animation, Comedy, Drama",
        director: "N/A",
        writer: "Haruichi Furudate",
        actors: "Ayumu Murase, Kaito Ishikawa, Yu Hayashi",
        plot: "Hinata Shouyou, a short middle school student, gained a sudden love of volleyball after watching a national championship match on TV. Determined to become like the championship's star player, a short boy nicknamed \"the small giant\", Shouyou joined his school's volleyball club. Unfortunately, he was the only member and the club didn't have so much as a place to practice. He didn't let that deter him, however, and, upon finally acquiring 5 other players in his final year, was able to compete in an actual competition - only for his team to be unlucky enough to face the championship favorite and its star player, Kageyama Tobio, called \"the king of the court\", in the first round. Though Shouyou's team suffers a crushing defeat, he vows to become better and eventually surpass Kageyama. Now Shouyou is starting his first year in high school - the very one he had first watched in the national championships. He's going to join the volleyball team, practice constantly, and wipe the floor with Kageyama the next time they meet on the court. ...or at least that's what Shouyou had planned, until he discovers that he and Kageyama are now in the same school. The volleyball team definitely needs their skills, but only if they can stop bickering and learn to work together as teammates.",
        language: "Japanese, English",
        country: "Japan, Poland",
        awards: "10 wins & 20 nominations total",
        poster:
          "https://m.media-amazon.com/images/M/MV5BYjYxMWFlYTAtYTk0YS00NTMxLWJjNTQtM2E0NjdhYTRhNzE4XkEyXkFqcGc@._V1_SX300.jpg",
        ratings: [
          {
            Source: "Internet Movie Database",
            Value: "8.7/10"
          }
        ],
        metascore: "N/A",
        imdbRating: "8.7",
        imdbRatingGoogle: "8.7",
        imdbVotes: "41,946",
        imdbID: "tt3398540",
        type: "series",
        totalSeasons: "4"
      }
    ];

    // Now call analyzeRecommendations once when the component is mounted or when dependencies change
    analyzeRecommendations(
      userPreferences,
      recommendations,
      setRecommendationsAnalysis
    );
  }, []); // Empty dependency array to ensure this effect only runs once when the component mounts

  console.log("recommendationsAnalysis: ", recommendationsAnalysis);
  return (
    <div className="flex items-center justify-center px-4">
      <CSSTransition
        in={loading}
        timeout={500}
        classNames="fade"
        unmountOnExit
        key="loading"
      >
        <Loader />
      </CSSTransition>

      <CSSTransition
        in={!loading && !submitted}
        timeout={500}
        classNames="fade"
        unmountOnExit
      >
        <div className="w-full max-w-4xl">
          <QuizQuestions
            setLoading={setLoading}
            setSubmitted={setSubmitted}
            showViewRecommendations={alreadyHasRecommendations && !submitted}
            alreadyHasRecommendations={alreadyHasRecommendations}
            setRecommendationList={setRecommendationList}
            setRecommendationsAnalysis={setRecommendationsAnalysis}
            setBookmarkedMovies={setBookmarkedMovies}
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
                onClick={() => handleRetakeQuiz(setLoading, setSubmitted)}
                className="text-primary font-semibold hover:text-secondary transition-colors underline"
              >
                Повторете въпросника
              </button>
            </p>
          </div>
          <RecommendationsList
            recommendationList={recommendationList}
            setCurrentBookmarkStatus={setCurrentBookmarkStatus}
            setAlertVisible={setAlertVisible}
            setBookmarkedMovies={setBookmarkedMovies}
            bookmarkedMovies={bookmarkedMovies}
          />
          <MovieSeriesDataWidgets
            recommendationsAnalysis={recommendationsAnalysis}
          />
        </div>
      </CSSTransition>
    </div>
  );
};

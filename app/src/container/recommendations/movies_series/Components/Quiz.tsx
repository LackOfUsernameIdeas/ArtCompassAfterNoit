import { FC, useEffect, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { RecommendationsList } from "./RecommendationsList";
import { QuizQuestions } from "./QuizQuestions";
import { handleRetakeQuiz } from "../helper_functions";
import Loader from "../../../../components/common/loader/Loader";
import { QuizProps } from "../recommendations-types";

export const Quiz: FC<QuizProps> = ({
  handleBookmarkClick,
  bookmarkedMovies,
  setBookmarkedMovies
}) => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [recommendationList, setRecommendationList] = useState<any[]>([]);

  const alreadyHasRecommendations = recommendationList.length > 0;
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
            handleBookmarkClick={handleBookmarkClick}
            bookmarkedMovies={bookmarkedMovies}
          />
        </div>
      </CSSTransition>
    </div>
  );
};

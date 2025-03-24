import { FC, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { RecommendationsList } from "./RecommendationsList";
import { QuizQuestions } from "./QuizQuestions";
import { handleRetakeQuiz } from "../helper_functions";
import Loader from "../../../../components/common/loader/Loader";
import { QuizProps } from "../booksRecommendations-types";

export const Quiz: FC<QuizProps> = ({
  setBookmarkedBooks,
  setCurrentBookmarkStatus,
  setAlertVisible,
  bookmarkedBooks
}) => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [recommendationList, setRecommendationList] = useState<any[]>([]);
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false);
  console.log("recommendationList: ", recommendationList);

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
        <div className={`${!isAnalysisComplete && "w-full max-w-4xl"}`}>
          <QuizQuestions
            setLoading={setLoading}
            setSubmitted={setSubmitted}
            submitted={submitted}
            showViewRecommendations={alreadyHasRecommendations && !submitted}
            alreadyHasRecommendations={alreadyHasRecommendations}
            setRecommendationList={setRecommendationList}
            setBookmarkedBooks={setBookmarkedBooks}
            setIsAnalysisComplete={setIsAnalysisComplete}
            isAnalysisComplete={isAnalysisComplete}
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
            setBookmarkedBooks={setBookmarkedBooks}
            bookmarkedBooks={bookmarkedBooks}
          />
        </div>
      </CSSTransition>
    </div>
  );
};

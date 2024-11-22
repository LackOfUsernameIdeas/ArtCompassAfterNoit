import { FC, useEffect, useState } from "react";
import logo_loader from "../../../assets/images/brand-logos/logo_loader.png";
import { CSSTransition } from "react-transition-group";
import { RecommendationsList } from "./RecommendationsList";
import { QuizQuestions } from "./QuizQuestions";
import { handleRetakeQuiz } from "../helper_functions";

export const Quiz: FC = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [recommendationList, setRecommendationList] = useState<any[]>([]);

  useEffect(() => {
    console.log("recommendationList: ", recommendationList);
  }, [recommendationList]);

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
          <QuizQuestions
            setLoading={setLoading}
            setSubmitted={setSubmitted}
            showViewRecommendations={alreadyHasRecommendations && !submitted}
            alreadyHasRecommendations={alreadyHasRecommendations}
            setRecommendationList={setRecommendationList}
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
          <RecommendationsList recommendationList={recommendationList} />
        </div>
      </CSSTransition>
    </div>
  );
};

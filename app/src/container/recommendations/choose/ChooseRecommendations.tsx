import { FC, useState, useEffect } from "react";
import { CSSTransition } from "react-transition-group";
import { useNavigate } from "react-router-dom";
import FadeInWrapper from "../../../components/common/loader/fadeinwrapper";

const ChooseRecommendations: FC = () => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Initially set loading to true
  const navigate = useNavigate();

  const question = {
    question: "Какво искате да разгледате в момента?",
    options: ["Филми и сериали", "Книги"]
  };

  // Set loading to false after the component mounts (simulating a page load delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100); // Delay for 1 second before hiding the loader
    return () => clearTimeout(timer); // Cleanup timeout on unmount
  }, []);

  const handleAnswerClick = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleClick = () => {
    if (!selectedAnswer) return;

    // Forward to the respective route based on the selected answer
    if (selectedAnswer === "Филми и сериали") {
      navigate("/app/recommendations/movies_series");
    } else if (selectedAnswer === "Книги") {
      navigate("/app/recommendations/books");
    }
  };

  return (
    <FadeInWrapper>
      <div className="flex items-center justify-center px-4">
        <CSSTransition
          in={!loading}
          timeout={500}
          classNames="fade"
          unmountOnExit
        >
          <div className="w-full max-w-4xl py-8 px-4">
            <div className="question bg-opacity-70 border-2 text-white rounded-lg p-4 glow-effect transition-all duration-300">
              <h2 className="text-xl font-semibold break-words">
                {question.question}
              </h2>
            </div>

            <div className="mt-8">
              {question.options.map((option) => (
                <div key={option} className="my-4">
                  <button
                    onClick={() => handleAnswerClick(option)}
                    className={`w-full py-2 px-4 bg-secondary text-white rounded-lg ${
                      selectedAnswer === option
                        ? "bg-opacity-80"
                        : "bg-opacity-60"
                    } transition-all duration-300`}
                  >
                    {option}
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <button
                onClick={handleClick}
                className={`next glow-next bg-opacity-70 text-white font-bold rounded-lg p-6 mt-4 flex justify-center items-center transition-all duration-200 ${
                  selectedAnswer && selectedAnswer.length > 0
                    ? "opacity-100 pointer-events-auto cursor-pointer"
                    : "opacity-0 pointer-events-none"
                }`}
                disabled={!selectedAnswer}
              >
                Следващ въпрос
              </button>
            </div>
          </div>
        </CSSTransition>
      </div>
    </FadeInWrapper>
  );
};

export default ChooseRecommendations;

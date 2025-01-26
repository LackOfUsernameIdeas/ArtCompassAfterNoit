import { FC, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FadeInWrapper from "../../../components/common/loader/fadeinwrapper";

const ChooseRecommendations: FC = () => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const question = {
    question: "Какво искате да разгледате в момента?",
    options: ["Филми и сериали", "Книги"]
  };

  // Simulating a page load delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleAnswerClick = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleClick = () => {
    if (!selectedAnswer) return;

    if (selectedAnswer === "Филми и сериали") {
      navigate("/app/recommendations/movies_series");
    } else if (selectedAnswer === "Книги") {
      navigate("/app/recommendations/books");
    }
  };

  console.log("selectedAnswer: ", selectedAnswer);
  return (
    <FadeInWrapper>
      <div className="flex items-center justify-center px-4">
        <div className="w-full max-w-4xl py-8 px-4">
          {/* Question Header */}
          <div className="question bg-opacity-70 border-2 text-white rounded-lg p-4 glow-effect transition-all duration-300">
            <h2 className="text-xl font-semibold break-words">
              {question.question}
            </h2>
          </div>

          {/* Grid Layout for Options */}
          <div
            className={`grid gap-4 mt-8 ${
              (question.options.length ?? 0) > 6
                ? "grid-cols-2 md:grid-cols-5"
                : "grid-cols-1"
            }`}
          >
            {question.options.map((option) => (
              <div
                key={option}
                onClick={() => handleAnswerClick(option)}
                className={`${
                  selectedAnswer === option
                    ? "selected-answer transform scale-105"
                    : "question hover:bg-secondary hover:text-white"
                } bg-opacity-70 p-6 text-white rounded-lg glow-effect transition-all duration-300 cursor-pointer flex justify-center items-center text-center`}
              >
                {option}
              </div>
            ))}
          </div>

          {/* Next Button */}
          <div className="mt-8">
            <button
              onClick={handleClick}
              className={`next glow-next bg-opacity-70 text-white font-bold rounded-lg p-6 mt-4 flex justify-center items-center transition-all duration-200 ${
                selectedAnswer
                  ? "opacity-100 pointer-events-auto cursor-pointer"
                  : "opacity-0 pointer-events-none"
              }`}
              disabled={!selectedAnswer}
            >
              Следващ въпрос
            </button>
          </div>
        </div>
      </div>
    </FadeInWrapper>
  );
};

export default ChooseRecommendations;

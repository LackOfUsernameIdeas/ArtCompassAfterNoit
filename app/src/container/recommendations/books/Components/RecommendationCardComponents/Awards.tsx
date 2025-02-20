import { FC, useState, useRef } from "react";
import { Recommendation } from "../../booksRecommendations-types";

interface GenresProps {
  recommendation: Recommendation;
}

const AwardsSection: FC<GenresProps> = ({ recommendation }) => {
  // Състояние за показване или скриване на наградите
  const [showAwards, setShowAwards] = useState(false);

  // Референция към контейнера с наградите за анимиране на височината
  const awardsContainerRef = useRef<HTMLDivElement | null>(null);

  // Функция за превключване на видимостта на наградите
  const toggleAwardsVisibility = () => {
    setShowAwards((prevState) => !prevState);
  };

  return (
    <div className="awards-container">
      {/* Заглавие с възможност за кликване за показване/скриване на наградите */}
      <div className="flex items-center space-x-4">
        <h3
          className="text-lg underline italic font-semibold cursor-pointer mt-2 underline-offset-lower hover:scale-105 transition"
          onClick={toggleAwardsVisibility}
        >
          Вижте литературни награди
        </h3>
      </div>

      {/* Контейнер с анимация за плавно показване и скриване */}
      <div
        ref={awardsContainerRef}
        className={`flex flex-wrap gap-2 mt-2 overflow-hidden transition-all duration-500 ease-in-out`}
        style={{
          maxHeight: showAwards
            ? `${awardsContainerRef.current?.scrollHeight}px` // Автоматична настройка на височината при показване
            : "0px" // Скриване на наградите, когато не се виждат
        }}
      >
        {/* Проверка дали има налични награди */}
        {recommendation.literary_awards ? (
          recommendation.literary_awards.split(", ").map((award, index) => (
            <span
              key={index}
              className="inline-block text-white dark:text-[#FFCC33] bg-[#bf9413]/70 dark:bg-[#FFCC33]/25 px-3 py-1 rounded-md text-sm"
            >
              {award}
            </span>
          ))
        ) : (
          // Ако няма награди, показва съобщение
          <span className="text-gray-500">Няма награди</span>
        )}
      </div>
    </div>
  );
};

export default AwardsSection;

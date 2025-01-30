import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import FadeInWrapper from "../../../components/common/loader/fadeinwrapper";
import Loader from "../../../components/common/loader/Loader";
import WidgetCards from "./components/WidgetCardsComponents";
import { DataType, UserData } from "./choose-types";
import { fetchData } from "./helper_functions";

const ChooseRecommendations: FC = () => {
  // Състояние за проследяване дали зареждаме съдържание
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Хук за пренасочване към различни страници

  // Състояния за задържане на извлечени данни
  const [data, setData] = useState<DataType>({
    usersCount: [], // Броя на потребителите
    topGenres: [], // Топ жанрове
    oscarsByMovie: [], // Оскари по филми
    totalAwards: [], // Общо награди
    averageBoxOfficeAndScores: [] // Среден боксофис и оценки
  });

  // Състояние за потребителски данни
  const [userData, setUserData] = useState<UserData>({
    id: 0, // Уникално ID на потребителя
    first_name: "", // Собствено име на потребителя
    last_name: "", // Фамилно име на потребителя
    email: "" // Имейл на потребителя
  });

  // Въпросът, който ще се покаже на потребителя, и опциите за избор
  const question = {
    question:
      "Искате да четете или гледате нещо, но не знаете какво? АртКомпас ще направи избора Ви лесен като Ви зададе няколко въпроса за Вашите предочитания и Ви предложи най-добре отговарящите на тях филми, сериали и книги!", // Самият въпрос
    options: [
      { label: "Филми и сериали", route: "/app/recommendations/movies_series" }, // Опция за филми и сериали
      { label: "Книги", route: "/app/recommendations/books" } // Опция за книги
    ]
  };

  // Функция, която се изпълнява при клик върху даден бутон
  const handleOptionClick = (route: string) => {
    setLoading(true); // Задаваме състоянието на "зареждане"
    navigate(route); // Пренасочваме към избрания маршрут
    setLoading(false); // Изключваме състоянието на "зареждане" (след приключване)
  };

  // useEffect за извличане на данни, когато компонентът се зареди за първи път
  useEffect(() => {
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken"); // Проверяваме за токен в localStorage или sessionStorage
    if (token) {
      fetchData(token, setData, setUserData); // Извличаме данни с помощта на функцията fetchData
      console.log("fetching"); // Лог за следене на извличането на данни
    }
  }, []); // Празен масив - изпълнява се само веднъж при зареждане на компонента

  return (
    <FadeInWrapper>
      {/* Основният контейнер с анимация за избледняване */}
      <CSSTransition
        in={!loading} // Анимацията се изпълнява само ако не зареждаме
        timeout={500} // Продължителност на анимацията
        classNames="fade" // CSS класове за анимация
        unmountOnExit // Компонентът се премахва от DOM, ако не се показва
      >
        <div>
          {/* Заглавие за добре дошли */}
          <div className="md:flex block items-center justify-between my-[1.5rem] page-header-breadcrumb">
            <div>
              <p className="font-semibold text-[1.125rem] text-defaulttextcolor dark:text-defaulttextcolor/70 !mb-0 ">
                Добре дошли, {userData.first_name} {userData.last_name}!
              </p>
            </div>
          </div>

          {/* Карти с информация за потребителя */}
          <div className="grid grid-cols-12 gap-x-6">
            <WidgetCards data={data} />
          </div>
          {/* Въпрос и бутоните за избор */}
          <div className="flex items-center justify-center px-4">
            <div className="w-full max-w-4xl py-8 px-4 text-center">
              {/* Текстът на въпроса */}
              <h2 className="text-2xl font-Opsilon mb-4 text-defaulttextcolor">
                {question.question}
              </h2>
              <h5 className="mb-8">Какво искате да разгледате в момента?</h5>
              {/* Бутоните, подравнени хоризонтално */}
              <div className="flex justify-between gap-4 w-full">
                {question.options.map((option) => (
                  <button
                    key={option.label}
                    onClick={() => handleOptionClick(option.route)}
                    className={`w-1/2 py-6 next glow-next bg-opacity-70 text-white font-bold rounded-lg p-6 mt-4 flex justify-center items-center text-4xl transition-all duration-300 ease-in-out transform hover:scale-105`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CSSTransition>

      {/* Анимация за показване на Loader при зареждане */}
      <CSSTransition
        in={loading} // Loader се показва, ако зареждаме
        timeout={500} // Продължителност на анимацията
        classNames="fade" // CSS класове за анимация
        unmountOnExit // Loader се премахва от DOM, ако не се показва
        key="loading"
      >
        <Loader />
      </CSSTransition>
    </FadeInWrapper>
  );
};

export default ChooseRecommendations;

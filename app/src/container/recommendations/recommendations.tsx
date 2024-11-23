import { FC, useEffect } from "react";
import { Quiz } from "./Components/Quiz";
import { useNavigate } from "react-router-dom";
import { checkTokenValidity } from "../home/helper_functions";
import FadeInWrapper from "../../components/common/loader/fadeinwrapper";

interface RecommendationsProps {}

const Recommendations: FC<RecommendationsProps> = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      const redirectUrl = await checkTokenValidity(); // Проверка на валидността на токена
      if (redirectUrl) {
        navigate(redirectUrl); // Пренасочване, ако токенът не е валиден
      }
    };

    validateToken();
  }, [navigate]); // Добавяне на navigate като зависимост

  return (
    <FadeInWrapper>
      <Quiz />
    </FadeInWrapper>
  );
};

export default Recommendations;

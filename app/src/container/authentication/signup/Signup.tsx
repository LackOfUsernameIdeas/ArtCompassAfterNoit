import { FC, Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import * as EmailValidator from "email-validator";
import SwiperComponent from "@/components/common/swiper/swiper";

interface SignupcoverProps {}

const Signupcover: FC<SignupcoverProps> = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [emptyFields, setEmptyFields] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false
  });

  const [passwordshow1, setpasswordshow1] = useState(false);
  const [passwordshow2, setpasswordshow2] = useState(false);

  const [alerts, setAlerts] = useState<
    { message: string; color: string; icon: JSX.Element }[]
  >([]);

  const navigate = useNavigate();

  useEffect(() => {
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (token) {
      navigate(`${import.meta.env.BASE_URL}app/recommendations`);
    }
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value
    }));

    setEmptyFields((prevState) => ({
      ...prevState,
      [id]: false
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Предотвратяване на презареждането на страницата при изпращане на формата

    // Проверка дали някое от полетата е празно
    const emptyFirstName = !formData.firstName;
    const emptyLastName = !formData.lastName;
    const emptyEmail = !formData.email;
    const emptyPassword = !formData.password;
    const emptyConfirmPassword = !formData.confirmPassword;

    if (
      emptyFirstName ||
      emptyLastName ||
      emptyEmail ||
      emptyPassword ||
      emptyConfirmPassword
    ) {
      // Запазване на състоянието за празните полета
      setEmptyFields({
        firstName: emptyFirstName,
        lastName: emptyLastName,
        email: emptyEmail,
        password: emptyPassword,
        confirmPassword: emptyConfirmPassword
      });

      // Показване на предупреждение, че всички полета са задължителни
      setAlerts([
        {
          message: "Всички полета са задължителни!",
          color: "danger",
          icon: <i className="ri-error-warning-line"></i>
        }
      ]);
      return;
    }

    // Проверка за валиден формат на имейла
    if (!EmailValidator.validate(formData.email)) {
      setAlerts([
        {
          message: "Невалиден формат на имейл адреса.",
          color: "danger",
          icon: <i className="ri-error-warning-line"></i>
        }
      ]);
      return;
    }

    // Проверка дали паролите съвпадат
    if (formData.password !== formData.confirmPassword) {
      setAlerts([
        {
          message: "Паролите не съвпадат!",
          color: "danger",
          icon: <i className="ri-error-warning-line"></i>
        }
      ]);
      return;
    }

    // Проверка за сила на паролата - трябва да съдържа малки и главни букви, цифри и специален символ, и да е поне 8 символа
    const passwordStrengthRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!passwordStrengthRegex.test(formData.password)) {
      setAlerts([
        {
          message:
            "Паролата трябва да е дълга поне 8 знака и да включва комбинация от главни букви, малки букви, цифри и поне 1 специален символ.",
          color: "danger",
          icon: <i className="ri-error-warning-line"></i>
        }
      ]);
      return;
    }

    // Показване на съобщение за изчакване при изпращане на заявката
    setAlerts([
      {
        message: "Моля, изчакайте...",
        color: "warning",
        icon: <i className="ri-error-warning-fill"></i>
      }
    ]);

    try {
      // Изпращане на заявка за регистрация
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        }
      );

      if (!response.ok) {
        // Ако отговорът не е успешен, обработване на грешката
        const errorData = await response.json();
        throw new Error(errorData.error || "Нещо се обърка! :(");
      }

      // При успешна регистрация, пренасочване към страницата за двустепенна верификация
      navigate(`${import.meta.env.BASE_URL}twostepverification`, {
        state: { email: formData.email }
      });
    } catch (error: any) {
      let errorMessage = "";

      // Обработка на специфични грешки, като например дублиране на имейл
      switch (true) {
        case error.message.includes("Duplicate entry"):
          errorMessage = "Потребител с този имейл адрес вече съществува!";
          break;
        default:
          errorMessage = error.message;
          break;
      }

      // Показване на съобщение за грешка
      setAlerts([
        {
          message: errorMessage,
          color: "danger",
          icon: <i className="ri-error-warning-fill"></i>
        }
      ]);
    }
  };

  return (
    <Fragment>
      <Helmet>
        <body className="bg-white dark:!bg-bodybg"></body>
      </Helmet>
      <div className="grid grid-cols-12 authentication mx-0 text-defaulttextcolor text-defaultsize">
        <div className="xxl:col-span-7 xl:col-span-7 lg:col-span-12 col-span-12">
          <div className="flex justify-center items-center h-full">
            {/* Празна колона за подравняване */}
            <div className="xxl:col-span-3 xl:col-span-3 lg:col-span-3 md:col-span-3 sm:col-span-2"></div>
            <div className="xxl:col-span-6 xl:col-span-6 lg:col-span-6 md:col-span-6 sm:col-span-8 col-span-12">
              {/* Линк за връщане към началната страница */}
              <p className="text-[0.75rem] text-[#8c9097] dark:text-white/50 ml-[1.5rem]">
                <Link to={`${import.meta.env.BASE_URL}`}>
                  {"<< Обратно към главната страница"}
                </Link>
              </p>
              <div className="p-[3rem]">
                <p className="h5 font-semibold opsilion !text-3xl mb-2">
                  Създаване на профил
                </p>
                <p className="mb-4 text-[#8c9097] dark:text-white/50 opacity-[0.7] font-normal">
                  Присъединете се към (име на проекта) и създайте профил!
                </p>
                <div className="form-wrapper max-w-lg mx-auto">
                  {alerts.map((alert, idx) => (
                    <div
                      className={`alert alert-${alert.color} flex items-center`}
                      role="alert"
                      key={idx}
                      style={{
                        maxWidth: "100%",
                        height: "auto",
                        marginBottom: "1rem",
                        wordBreak: "break-word",
                        padding: "0.75rem 1rem",
                        minHeight: "auto",
                        alignItems: "center"
                      }}
                    >
                      <div
                        style={{
                          marginRight: "0.5rem",
                          fontSize: "1.25rem",
                          lineHeight: "1"
                        }}
                      >
                        {alert.icon}
                      </div>
                      <div style={{ lineHeight: "1.2" }}>
                        <b>{alert.message}</b>
                      </div>
                    </div>
                  ))}

                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-12 gap-y-4">
                      <div className="xl:col-span-12 col-span-12 mt-0">
                        <label
                          htmlFor="signup-firstname"
                          className="form-label text-default opsilion"
                        >
                          Име
                        </label>
                        <input
                          type="text"
                          className={`form-control form-control-lg w-full !rounded-md ${
                            emptyFields.firstName ? "empty-field" : ""
                          }`}
                          id="firstName"
                          placeholder="Въведете своето първо име"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange(e)}
                        />
                      </div>
                      <div className="xl:col-span-12 col-span-12">
                        <label
                          htmlFor="signup-lastname"
                          className="form-label text-default opsilion"
                        >
                          Фамилия
                        </label>
                        <input
                          type="text"
                          className={`form-control form-control-lg w-full !rounded-md ${
                            emptyFields.lastName ? "empty-field" : ""
                          }`}
                          id="lastName"
                          placeholder="Въведете своята фамилия"
                          value={formData.lastName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="xl:col-span-12 col-span-12">
                        <label
                          htmlFor="signup-email"
                          className="form-label text-default opsilion"
                        >
                          Имейл
                        </label>
                        <input
                          type="text"
                          className={`form-control form-control-lg w-full !rounded-md ${
                            emptyFields.email ? "empty-field" : ""
                          }`}
                          id="email"
                          placeholder="Въведете своя имейл"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="xl:col-span-12 col-span-12">
                        <label
                          htmlFor="signup-password"
                          className="form-label text-default opsilion"
                        >
                          Парола
                        </label>
                        <div className="input-group">
                          <input
                            type={passwordshow1 ? "text" : "password"}
                            className={`form-control form-control-lg w-full !rounded-e-none ${
                              emptyFields.password ? "empty-field" : ""
                            }`}
                            id="password"
                            placeholder="Въведете парола от поне 8 знака"
                            value={formData.password}
                            onChange={handleInputChange}
                          />
                          <button
                            aria-label="button"
                            className="ti-btn ti-btn-light !rounded-s-none !mb-0"
                            onClick={() => setpasswordshow1(!passwordshow1)}
                            type="button"
                            id="button-addon2"
                          >
                            <i
                              className={`${
                                passwordshow1
                                  ? "ri-eye-line"
                                  : "ri-eye-off-line"
                              } align-middle`}
                            ></i>
                          </button>
                        </div>
                      </div>
                      <div className="xl:col-span-12 col-span-12 mb-4">
                        <label
                          htmlFor="signup-confirmpassword"
                          className="form-label text-default opsilion"
                        >
                          Потвърждаване на паролата
                        </label>
                        <div className="input-group">
                          <input
                            type={passwordshow2 ? "text" : "password"}
                            className={`form-control form-control-lg w-full !rounded-e-none ${
                              emptyFields.confirmPassword ? "empty-field" : ""
                            }`}
                            id="confirmPassword"
                            placeholder="Повторете своята парола"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                          />
                          <button
                            aria-label="button"
                            className="ti-btn ti-btn-light !rounded-s-none !mb-0"
                            onClick={() => setpasswordshow2(!passwordshow2)}
                            type="button"
                            id="button-addon21"
                          >
                            <i
                              className={`${
                                passwordshow2
                                  ? "ri-eye-line"
                                  : "ri-eye-off-line"
                              } align-middle`}
                            ></i>
                          </button>
                        </div>
                      </div>
                      <div className="xl:col-span-12 col-span-12 grid mt-2">
                        <button
                          type="submit"
                          className="ti-btn ti-btn-lg bg-primary text-white !text-lg opsilion !font-medium dark:border-defaultborder/10"
                        >
                          Създай профил
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="text-center">
                  <p className="text-[0.75rem] text-[#8c9097] dark:text-white/50 mt-4">
                    Вече имате профил?{" "}
                    <Link
                      to={`${import.meta.env.BASE_URL}signin/`}
                      className="text-primary"
                    >
                      Влезте в профила си!
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Страничен панел с изображение или лого */}
        <SwiperComponent />
      </div>
    </Fragment>
  );
};

export default Signupcover;

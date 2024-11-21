import { FC, Fragment, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import logo from "../../../assets/images/brand-logos/logo-large.png";
import logoPink from "../../../assets/images/brand-logos/logo-large-pink.png";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

interface SignincoverProps {}

const Signincover: FC<SignincoverProps> = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [emptyFields, setEmptyFields] = useState({
    email: false,
    password: false
  });

  const [passwordShow, setpasswordShow] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [alerts, setAlerts] = useState<
    { message: string; color: string; icon: JSX.Element }[]
  >([]);
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokenValidity = async () => {
      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");

      if (token) {
        try {
          // Validate the token with the server
          const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/token-validation`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({ token })
            }
          );

          if (!response.ok) {
            throw new Error("Token validation failed");
          }

          const result = await response.json();

          if (result.valid) {
            // Redirect to the app if the token is valid
            navigate(`${import.meta.env.BASE_URL}app/home`);
          } else {
            // Token is invalid, you might want to handle this scenario
            console.log("Invalid token");
            // Optionally, clear token and redirect to login page
            localStorage.removeItem("authToken");
            sessionStorage.removeItem("authToken");
            navigate("/signin");
          }
        } catch (error) {
          console.error("Error validating token:", error);
          // Handle error (e.g., redirect to login page)
          navigate("/signin");
        }
      } else {
        // No token found, redirect to login page
        navigate("/signin");
      }
    };

    checkTokenValidity();
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value
    }));

    setEmptyFields((prevState) => ({
      ...prevState,
      [id]: false // Reset field error when typing
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emptyEmail = !formData.email;
    const emptyPassword = !formData.password;

    if (emptyEmail || emptyPassword) {
      setEmptyFields({
        email: emptyEmail,
        password: emptyPassword
      });

      setAlerts([
        {
          message: "Всички полета са задължителни!",
          color: "danger",
          icon: <i className="ri-error-warning-line"></i>
        }
      ]);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/signin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ ...formData, rememberMe })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Нещо се обърка! :(");
      }

      const data = await response.json();
      console.log("response: ", data);
      setAlerts([
        {
          message: "Успешно влизане!",
          color: "success",
          icon: <i className="ri-check-line"></i>
        }
      ]);

      // Store token in local storage if remember me is checked
      if (rememberMe) {
        localStorage.setItem("authToken", data.token);
      } else {
        sessionStorage.setItem("authToken", data.token);
      }

      navigate(`${import.meta.env.BASE_URL}app/home`);
    } catch (error: any) {
      setAlerts([
        {
          message: error.message,
          color: "danger",
          icon: <i className="ri-error-warning-line"></i>
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
            <div className="xxl:col-span-3 xl:col-span-3 lg:col-span-3 md:col-span-3 sm:col-span-2"></div>
            <div className="xxl:col-span-6 xl:col-span-6 lg:col-span-6 md:col-span-6 sm:col-span-8 col-span-12">
              <div className="p-[3rem]">
                <p className="h5 font-semibold mb-2">Имате профил?</p>
                <p className="mb-4 text-[#8c9097] dark:text-white/50 opacity-[0.7] font-normal">
                  Попълнете Вашите имейл и парола, за да влезете в профила си!
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
                          htmlFor="signin-email"
                          className="form-label text-default"
                        >
                          Имейл
                        </label>
                        <input
                          type="email"
                          className={`form-control form-control-lg w-full !rounded-md ${
                            emptyFields.email ? "empty-field" : ""
                          }`}
                          id="email"
                          placeholder="Въведете своя имейл"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="xl:col-span-12 col-span-12 mb-4">
                        <label
                          htmlFor="signin-password"
                          className="form-label text-default block"
                        >
                          Парола
                          <Link
                            to={`${import.meta.env.BASE_URL}resetpassword`}
                            className="ltr:float-right rtl:float-left text-danger"
                          >
                            Забравена парола
                          </Link>
                        </label>
                        <div className="input-group">
                          <input
                            type={passwordShow ? "text" : "password"}
                            className={`form-control form-control-lg !rounded-e-none ${
                              emptyFields.password ? "empty-field" : ""
                            }`}
                            id="password"
                            placeholder="Въведете своята парола"
                            value={formData.password}
                            onChange={handleInputChange}
                          />
                          <button
                            aria-label="button"
                            type="button"
                            className="ti-btn ti-btn-light !rounded-s-none !mb-0"
                            onClick={() => setpasswordShow(!passwordShow)}
                            id="button-addon2"
                          >
                            <i
                              className={`${
                                passwordShow ? "ri-eye-line" : "ri-eye-off-line"
                              } align-middle`}
                            ></i>
                          </button>
                        </div>
                        <div className="mt-2">
                          <div className="form-check !ps-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="rememberMe"
                              checked={rememberMe}
                              onChange={handleCheckboxChange}
                            />
                            <label
                              className="form-check-label text-[#8c9097] dark:text-white/50 font-normal"
                              htmlFor="rememberMe"
                            >
                              Запомни паролата ми
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="xl:col-span-12 col-span-12 grid mt-2">
                        <button
                          type="submit"
                          className="ti-btn ti-btn-lg bg-primary text-white !font-medium dark:border-defaultborder/10"
                        >
                          Влезни
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="text-center">
                  <p className="text-[0.75rem] text-[#8c9097] dark:text-white/50 mt-4">
                    Нямате профил?{" "}
                    <Link
                      to={`${import.meta.env.BASE_URL}signup`}
                      className="text-primary"
                    >
                      Създайте такъв сега!
                    </Link>
                  </p>
                </div>
              </div>
            </div>
            <div className="xxl:col-span-3 xl:col-span-3 lg:col-span-3 md:col-span-3 sm:col-span-2"></div>
          </div>
        </div>
        <div className="xxl:col-span-5 xl:col-span-5 lg:col-span-5 col-span-12 xl:block hidden px-0">
          <div className="authentication-cover ">
            <div className="aunthentication-cover-content rounded">
              <div className="swiper keyboard-control">
                <Swiper
                  spaceBetween={30}
                  navigation={true}
                  centeredSlides={true}
                  autoplay={{ delay: 2500, disableOnInteraction: false }}
                  pagination={{ clickable: true }}
                  modules={[Pagination, Autoplay, Navigation]}
                  className="mySwiper"
                >
                  <SwiperSlide>
                    <div className="text-white text-center p-[3rem] flex items-center justify-center flex-col lg:space-y-8 md:space-y-4 sm:space-y-2 space-y-2">
                      <div>
                        <div className="mb-[6rem] dark:hidden">
                          <img
                            src={logoPink}
                            className="authentication-image"
                            alt="Logo"
                            style={{ width: "100%", height: "auto" }}
                          />
                        </div>
                        <div className="mb-[6rem] hidden dark:block">
                          <img
                            src={logo}
                            className="authentication-image"
                            alt="Logo"
                            style={{
                              width: "100%",
                              height: "auto"
                            }}
                          />
                        </div>
                        <h6 className="font-semibold text-[1rem] sm:text-[1.325rem] lg:text-[1.5rem]">
                          Добре дошли в Кино Компас!
                        </h6>
                        <p className="font-normal text-[0.875rem] opacity-[0.7] sm:text-[1rem] lg:mt-8">
                          Това е вашият гид за откриване на филми и сериали за
                          всяко настроение, анализирайки вашите предпочитания и
                          предлагайки персонализирани препоръки с помощта на
                          изкуствен интелект!
                        </p>
                      </div>
                    </div>
                  </SwiperSlide>
                  {/* Add additional slides here if needed */}
                </Swiper>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Signincover;

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
import { Link, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

interface ResetcoverProps {}

const Resetcover: FC<ResetcoverProps> = () => {
  const [passwordShow1, setPasswordShow1] = useState(false);
  const [passwordShow2, setPasswordShow2] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [alerts, setAlerts] = useState<
    { message: string; color: string; icon: JSX.Element }[]
  >([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { token } = useParams(); // Assuming the token is passed in the URL as a parameter
  console.log("token: ", token);
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      try {
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
        console.log("result: ", result);
        if (!result.valid) navigate("/signin");
      } catch (error) {
        console.error("Error validating token:", error);
        navigate("/signin"); // Redirect to an error page if the request fails
      }
    };

    validateToken();
  }, [token, navigate]);

  const handlePasswordReset = async () => {
    setIsSubmitting(true);

    if (newPassword == "" || confirmPassword == "") {
      setAlerts([
        {
          message: "Всички полета са задължителни!",
          color: "danger",
          icon: <i className="ri-error-warning-line"></i>
        }
      ]);
      setIsSubmitting(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setAlerts([
        ...alerts,
        {
          message: "Паролите не са еднакви!",
          color: "danger",
          icon: <i className="ri-error-warning-line"></i>
        }
      ]);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/password-reset`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            token, // The token from the URL
            newPassword
          })
        }
      );

      const result = await response.json();

      if (response.ok) {
        setAlerts([
          ...alerts,
          {
            message:
              "Сменихте паролата си успешно! Препращане към формата за влизане...",
            color: "success",
            icon: <i className="ri-check-line"></i>
          }
        ]);
        navigate("/signin/");
      } else {
        setAlerts([
          ...alerts,
          {
            message: result.error || "Възникна грешка!",
            color: "danger",
            icon: <i className="ri-error-warning-fill"></i>
          }
        ]);
      }
    } catch (error) {
      setAlerts([
        ...alerts,
        {
          message: "Не успяхме да сменим паролата Ви! Опитайте отново.",
          color: "danger",
          icon: <i className="ri-error-warning-fill"></i>
        }
      ]);
    } finally {
      setIsSubmitting(false);
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
            <div className="p-[3rem]">
              <p className="h5 font-semibold mb-2">Смяна на паролата</p>
              <p className="mb-4 text-[#8c9097] dark:text-white/50 opacity-[0.7] font-normal">
                Сменете своята парола тук!
              </p>
              {alerts.map((alert, idx) => (
                <div
                  className={`alert alert-${alert.color} flex items-center`}
                  role="alert"
                  key={idx}
                  style={{
                    width: "100%", // Ensure it takes full width
                    boxSizing: "border-box", // Includes padding in width calculation
                    height: "auto",
                    marginBottom: "1rem", // Adds space between alert and form
                    wordBreak: "break-word", // Wraps long messages properly
                    padding: "0.75rem 1rem", // Adjust padding to match typical alert sizing
                    minHeight: "auto", // Allows the alert to shrink to fit smaller content
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
              <div className="grid grid-cols-12 gap-y-4">
                <div className="xl:col-span-12 col-span-12 mt-0">
                  <label
                    htmlFor="reset-newpassword"
                    className="form-label text-default"
                  >
                    Нова парола
                  </label>
                  <div className="input-group">
                    <input
                      type={passwordShow1 ? "text" : "password"}
                      className="form-control form-control-lg !rounded-e-none"
                      id="reset-password"
                      placeholder="Въведете новата си парола (мин. 8 знака)"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button
                      onClick={() => setPasswordShow1(!passwordShow1)}
                      aria-label="button"
                      className="ti-btn ti-btn-light !mb-0 !rounded-s-none"
                      type="button"
                      id="button-addon2"
                    >
                      <i
                        className={`${
                          passwordShow1 ? "ri-eye-line" : "ri-eye-off-line"
                        } align-middle`}
                      ></i>
                    </button>
                  </div>
                </div>
                <div className="xl:col-span-12 col-span-12 mt-0">
                  <label
                    htmlFor="reset-confirmpassword"
                    className="form-label text-default"
                  >
                    Потвърждаване на паролата
                  </label>
                  <div className="input-group">
                    <input
                      type={passwordShow2 ? "text" : "password"}
                      className="form-control form-control-lg !rounded-e-none"
                      id="reset-cpassword"
                      placeholder="Повторете своята парола"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                      onClick={() => setPasswordShow2(!passwordShow2)}
                      aria-label="button"
                      className="ti-btn ti-btn-light !mb-0 !rounded-s-none"
                      type="button"
                      id="button-addon2"
                    >
                      <i
                        className={`${
                          passwordShow2 ? "ri-eye-line" : "ri-eye-off-line"
                        } align-middle`}
                      ></i>
                    </button>
                  </div>
                </div>
                <div className="xl:col-span-12 col-span-12 grid mt-2">
                  <button
                    className="ti-btn ti-btn-primary w-full py-2"
                    onClick={handlePasswordReset}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Сменяме паролата Ви..." : "Смени паролата"}
                  </button>
                </div>
              </div>
              <div className="text-center">
                <p className="text-[0.75rem] text-[#8c9097] dark:text-white/50 mt-4">
                  Объркахте нещо?{" "}
                  <Link
                    to={`${import.meta.env.BASE_URL}signin/`}
                    className="text-primary"
                  >
                    Върни се към формата за влизане
                  </Link>
                </p>
              </div>
            </div>
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

export default Resetcover;

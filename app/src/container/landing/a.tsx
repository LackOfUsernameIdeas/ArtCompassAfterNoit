import { FC, Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
// import required modules
import store from "../../redux/store";
import { ThemeChanger } from "../../redux/action";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Navbar2 from "./sidemenu";
import { connect } from "react-redux";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";

interface JobslandingProps {}

const Jobslanding: FC<JobslandingProps> = ({ ThemeChanger }: any) => {
  useEffect(() => {
    const rootDiv = document.getElementById("root");
    if (rootDiv) {
    }
    return () => {
      if (rootDiv) {
        rootDiv.className = ""; // Remove the className when component unmounts
      }
    };
  }, []);

  const Topup = () => {
    if (window.scrollY > 30 && document.querySelector(".landing-body")) {
      const Scolls = document.querySelectorAll(".sticky");
      Scolls.forEach((e) => {
        e.classList.add("sticky-pin");
      });
    } else {
      const Scolls = document.querySelectorAll(".sticky");
      Scolls.forEach((e) => {
        e.classList.remove("sticky-pin");
      });
    }
  };
  window.addEventListener("scroll", Topup);
  function menuClose() {
    const theme = store.getState();
    if (window.innerWidth <= 992) {
      ThemeChanger({ ...theme, toggled: "close" });
    }
    const overlayElement = document.querySelector("#responsive-overlay");
    if (overlayElement) {
      overlayElement.classList.remove("active");
    }
  }
  return (
    <Fragment>
      <HelmetProvider>
        <Helmet>
          <body className="landing-body jobs-landing"></body>
        </Helmet>
      </HelmetProvider>
      <div id="responsive-overlay" onClick={() => menuClose()}></div>
      <aside className="app-sidebar sticky !topacity-0 sticky-pin" id="sidebar">
        <div className="container-xl xl:!p-0">
          <div className="main-sidebar mx-0">
            <nav className="main-menu-container nav nav-pills flex-column sub-open">
              <div className="landing-logo-container my-auto hidden lg:block">
                <div className="responsive-logo"></div>
              </div>
              <div className="slide-left hidden" id="slide-left">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#7b8191"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  {" "}
                  <path d="M13.293 6.293 7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z"></path>{" "}
                </svg>
              </div>
              <Navbar2 />
              <div className="slide-right hidden" id="slide-right">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#7b8191"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  {" "}
                  <path d="M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z"></path>{" "}
                </svg>
              </div>
              <div className="lg:flex hidden space-x-2 rtl:space-x-reverse">
                <Link
                  to={`${import.meta.env.BASE_URL}signin/`}
                  className="ti-btn w-[10rem] ti-btn-primary-full m-0 p-2"
                >
                  Влезте в профила си
                </Link>
                <Link
                  to={`${import.meta.env.BASE_URL}signup/`}
                  className="ti-btn w-[10rem] ti-btn-secondary-full m-0 p-2"
                >
                  Създаване на профил
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </aside>
      <div className="main-content !p-0 landing-main dark:text-defaulttextcolor/70">
        <div className="landing-banner !h-auto" id="home">
          <section className="section !pb-0 text-[0.813rem]">
            <div className="container main-banner-container">
              <Card className="dark:border-black/10 bg-bodybg font-semibold text-xl p-4 rounded-lg shadow-lg dark:shadow-xl text-center">
                <h2 className="text-2xl opsilion text-defaulttextcolor dark:text-white/80">
                  ДОБРЕ ДОШЛИ!
                </h2>
              </Card>
            </div>
          </section>
        </div>
        <section
          className="section bg-light dark:!bg-black/10 text-defaulttextcolor"
          id="description"
        >
          <div className="container text-center">
            <div className=" justify-center text-center mb-12">
              <div className="xl:col-span-6 col-span-12">
                <h3 className="font-semibold mb-2">Как работи АртКомпас?</h3>
                <span className="text-[#8c9097] dark:text-white/50 text-[0.9375rem] font-normal block">
                  Открийте най-добрите препоръки за вас с помощта на Изкуствен
                  Интелект и станете свидетел на анализ на точността му в три
                  лесни стъпки – регистрирайте се, попълнете кратък въпросник и
                  вижте вашите резултати!
                </span>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-6 text-start">
              <div className="col-span-12 md:col-span-4">
                <div className="box border dark:border-defaultborder/10">
                  <div className="box-body rounded">
                    <div className="mb-4 ms-1">
                      <div className="icon-style">
                        <span className="avatar avatar-lg avatar-rounded bg-primary svg-white">
                          <i className="ti ti-file-invoice"></i>
                        </span>
                      </div>
                    </div>
                    <h5 className="font-semibold text-[1.25rem]">
                      Регистрация
                    </h5>
                    <p className="opacity-[0.8] mb-4">
                      Създайте свой профил, за да станете част от нашата
                      платформа. АртКомпас ви предоставя възможността да
                      изживеете едно уникално кино и библиопреживяване.
                    </p>
                    <Link
                      className="mx-1 text-primary font-semibold leading-[1]"
                      to="#"
                    >
                      Създайте свой профил сега
                      <i className="ri-arrow-right-s-line align-middle rtl:rotate-180"></i>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="md:col-span-4 col-span-12">
                <div className="box border dark:border-defaultborder/10">
                  <div className="box-body rounded">
                    <div className="mb-4 ms-1">
                      <div className="icon-style">
                        <span className="avatar avatar-lg avatar-rounded bg-primary svg-white">
                          <i className="ti ti-briefcase"></i>
                        </span>
                      </div>
                    </div>
                    <h5 className="font-semibold text-[1.25rem]">
                      Вашият анализ
                    </h5>
                    <p className="opacity-[0.8] mb-4">
                      Спрямо вашите индивидуални предпояитания и личностни
                      качества, приложението ще анализира поведението на
                      Изкуствения Интелект с помощта на универсални и потвърдени
                      показатели за оценка на машинното обучение!
                    </p>
                    <Link
                      className="mx-1 text-primary font-semibold leading-[1]"
                      to="#"
                    >
                      Тествайте AI
                      <i className="ri-arrow-right-s-line align-middle rtl:rotate-180"></i>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="md:col-span-4 col-span-12">
                <div className="box border dark:border-defaultborder/10">
                  <div className="box-body rounded">
                    <div className="mb-4 ms-1">
                      <div className="icon-style">
                        <span className="avatar avatar-lg avatar-rounded bg-primary svg-white">
                          <i className="ti ti-user-plus"></i>
                        </span>
                      </div>
                    </div>
                    <h5 className="font-semibold text-[1.25rem]">
                      Нови препоръки
                    </h5>
                    <p className="opacity-[0.8] mb-4">
                      Съвместно с анализа, приложението също така ще ви насочи
                      към най-подходящите филми и сериали за гледане и книги за
                      четене. Направете първата крачка още сега!
                    </p>
                    <Link
                      className="mx-1 text-primary font-semibold leading-[1]"
                      to="#"
                    >
                      Рзгледайте нови препоръки
                      <i className="ri-arrow-right-s-line align-middle rtl:rotate-180"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="section bg-light" id="aianalysis">
          <div className="container">
            <div className="grid grid-cols-12 gap-6">
              <div className="lg:col-span-3 md:col-span-6 sm:col-span-6 col-span-12">
                <div className="box feature-style">
                  <div className="box-body">
                    <Link
                      aria-label="anchor"
                      to="#"
                      className="stretched-link"
                    ></Link>
                    <div className="feature-style-icon bg-primary/10">
                      <svg
                        className="svg-primary"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 64 64"
                      >
                        <g data-name="Working-Home-Online-Work From Home-Computer">
                          <path d="M28 29h2v2h-2zM34 29h2v2h-2z" />
                          <circle cx="32" cy="52" r="2" />
                          <path d="M60.99 25.89h-.01L33.93 3.31a2.981 2.981 0 0 0-3.85 0L3.1 25.95a3.071 3.071 0 0 0-.74 3.89 2.976 2.976 0 0 0 2.08 1.43 2.921 2.921 0 0 0 .5.05 2.986 2.986 0 0 0 1.93-.71l4.13-3.5V61a1 1 0 0 0 1 1h40a1 1 0 0 0 1-1V27.01l4.13 3.48a3 3 0 0 0 3.86-4.6ZM40 59a1 1 0 0 1-1 1H25a1 1 0 0 1-1-1v-1h16Zm.09-3H23.9l-.69-6.9a1.022 1.022 0 0 1 .26-.77.985.985 0 0 1 .74-.33h15.58a.985.985 0 0 1 .74.33 1.022 1.022 0 0 1 .26.77ZM45 60h-3.18a3 3 0 0 0 .18-1v-1.95l.78-7.75a3.009 3.009 0 0 0-.77-2.31 2.97 2.97 0 0 0-2.22-.99H24.21a2.97 2.97 0 0 0-2.22.99 3.009 3.009 0 0 0-.77 2.31l.78 7.75V59a3 3 0 0 0 .18 1H19V49.87a5.018 5.018 0 0 1 2.93-4.56l6.76-3.07a3.993 3.993 0 0 0 6.62 0l6.76 3.07A5.018 5.018 0 0 1 45 49.87ZM24.07 31.99c-.02 0-.05.01-.07.01a2 2 0 0 1 0-4v3a7.954 7.954 0 0 0 .07.99ZM24 26a4.091 4.091 0 0 0-1 .14V26a9 9 0 0 1 18 0v.14a4.091 4.091 0 0 0-1-.14c-.02 0-.05.01-.07.01a7.99 7.99 0 0 0-15.86 0c-.02 0-.05-.01-.07-.01Zm18 4a2.006 2.006 0 0 1-2 2c-.02 0-.05-.01-.07-.01A7.954 7.954 0 0 0 40 31v-3a2.006 2.006 0 0 1 2 2Zm-4.09-4h-.5l-1.7-1.71a1 1 0 0 0-1.16-.18L30.76 26h-4.67a5.993 5.993 0 0 1 11.82 0ZM26 28h5a1 1 0 0 0 .45-.11l3.35-1.67 1.49 1.49A1.033 1.033 0 0 0 37 28h1v3a6 6 0 0 1-12 0Zm8 10.74V40a2 2 0 0 1-4 0v-1.26a7.822 7.822 0 0 0 4 0ZM51 60h-4V49.87a7.025 7.025 0 0 0-4.11-6.38L36 40.36v-2.44a8.066 8.066 0 0 0 3.43-3.97A5.481 5.481 0 0 0 40 34a3.981 3.981 0 0 0 3-6.62V26a11 11 0 1 0-22 0v1.38A3.981 3.981 0 0 0 24 34a5.481 5.481 0 0 0 .57-.05A8.066 8.066 0 0 0 28 37.92v2.45l-6.89 3.12A7.025 7.025 0 0 0 17 49.87V60h-4V25.42L32 9.31l19 16.01Zm8.82-31.17a.988.988 0 0 1-1.4.13L32.64 7.24a.987.987 0 0 0-1.29 0L5.58 29.08a.986.986 0 0 1-.81.22 1 1 0 0 1-.7-.49 1.083 1.083 0 0 1 .31-1.33L31.36 4.84a1.025 1.025 0 0 1 .64-.23 1 1 0 0 1 .64.23L59.7 27.43a.987.987 0 0 1 .12 1.4Z" />
                        </g>
                      </svg>
                    </div>
                    <h5 className=" font-semibold text-default text-[1.25rem]">
                      Среден Precision
                    </h5>
                    <p className="text-[#8c9097] dark:text-white/50 mb-4">
                      Средна стойност спрямо всички потребители (за всички
                      препоръки в системата)
                    </p>
                    <div className="flex-grow">
                      <p className="text-2xl font-bold">{`${100}%`}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {`${100} от общо ${100} препоръки, които сте направили, са релевантни`}
                      </p>
                    </div>
                    <div className="mt-auto">
                      <Progress value={100} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-3 md:col-span-6 sm:col-span-6 col-span-12">
                <div className="box feature-style">
                  <div className="box-body">
                    <Link
                      aria-label="anchor"
                      to="#"
                      className="stretched-link"
                    ></Link>
                    <div className="feature-style-icon bg-primary/10">
                      <svg
                        className="svg-primary"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 64 64"
                      >
                        <path d="M21 28h-5v-.93a1 1 0 0 1 .445-.832l3.774-2.515A3.993 3.993 0 0 0 22 20.4V20a4 4 0 0 0-8 0 1 1 0 0 0 2 0 2 2 0 0 1 4 0v.4a2 2 0 0 1-.891 1.664l-3.773 2.515A2.993 2.993 0 0 0 14 27.07V29a1 1 0 0 0 1 1h6a1 1 0 0 0 0-2Z" />
                        <path d="M31 26h-1v-9a1 1 0 0 0-1.857-.515l-6 10A1 1 0 0 0 23 28h5v1a1 1 0 0 0 2 0v-1h1a1 1 0 0 0 0-2zm-3 0h-3.233L28 20.61zm15 5a1 1 0 0 0 1-1v-1a1 1 0 0 0-2 0v1a1 1 0 0 0 1 1zm6 0a1 1 0 0 0 1-1v-1a1 1 0 0 0-2 0v1a1 1 0 0 0 1 1z" />
                        <path d="M53 42h-3v-2.08A8.028 8.028 0 0 0 53.93 34H55a3.009 3.009 0 0 0 3-3v-1a2.986 2.986 0 0 0-1-2.22V21a5 5 0 0 0-5-5h-1a2.994 2.994 0 0 0-1.67.51 4.712 4.712 0 0 0-.8-1.05A5.005 5.005 0 0 0 45 14h-3.04a21 21 0 1 0-3.05 22.69A8.071 8.071 0 0 0 42 39.92V42h-3a9.014 9.014 0 0 0-9 9v10a1 1 0 0 0 1 1h30a1 1 0 0 0 1-1V51a9.014 9.014 0 0 0-9-9Zm3-12v1a1 1 0 0 1-1 1h-1v-3h1a1 1 0 0 1 1 1ZM23 42a19 19 0 1 1 16.91-27.66 7.16 7.16 0 0 0-1.81.86 17 17 0 1 0-2.01 18.64A2.764 2.764 0 0 0 37 34h1.07c.02.15.04.3.07.45A19.011 19.011 0 0 1 23 42Zm11.48-9.39a15.049 15.049 0 0 1-3.13 2.85l-.48-.84a1 1 0 0 0-1.74 1l.49.84A14.821 14.821 0 0 1 24 37.94V37a1 1 0 0 0-2 0v.95a14.915 14.915 0 0 1-5.61-1.5l.48-.83a1 1 0 0 0-1.74-1l-.48.84a15.165 15.165 0 0 1-4.11-4.11l.84-.48a1 1 0 0 0-1-1.74l-.83.48A14.915 14.915 0 0 1 8.05 24H9a1 1 0 0 0 0-2h-.95a14.915 14.915 0 0 1 1.5-5.61l.83.48a1 1 0 0 0 1.36-.37 1.007 1.007 0 0 0-.36-1.37l-.84-.48a15.165 15.165 0 0 1 4.11-4.11l.48.84a.993.993 0 0 0 1.37.36 1 1 0 0 0 .37-1.36l-.48-.83A14.915 14.915 0 0 1 22 8.05V9a1 1 0 0 0 2 0v-.96a14.83 14.83 0 0 1 5.61 1.5l-.48.84a1 1 0 0 0 .37 1.36.993.993 0 0 0 1.37-.36l.48-.84a14.891 14.891 0 0 1 4.1 4.12l-.83.47a1.007 1.007 0 0 0-.36 1.37 1 1 0 0 0 1.36.37l.83-.48a2 2 0 0 1 .1.21A6.984 6.984 0 0 0 35 21v6.78A2.986 2.986 0 0 0 34 30v1a2.933 2.933 0 0 0 .48 1.61ZM36 30a1 1 0 0 1 1-1h1v3h-1a1 1 0 0 1-1-1Zm2-4v1h-1v-6a4.938 4.938 0 0 1 1.45-3.52 5.007 5.007 0 0 1 3.04-1.45A4.361 4.361 0 0 1 42 16h3a2.988 2.988 0 0 1 3 3 1 1 0 0 0 2 0 1 1 0 0 1 1-1h1a3.009 3.009 0 0 1 3 3v6h-1v-1a3.009 3.009 0 0 0-3-3H41a3.009 3.009 0 0 0-3 3Zm2 7v-7a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v7a6 6 0 0 1-12 0Zm9.5 11h.5v3.52l-2.42-.96ZM46 45.33l-2-2.66v-1.93a7.822 7.822 0 0 0 4 0v1.93ZM42 44h.5l1.92 2.56-2.42.96Zm18 16h-4v-7a1 1 0 0 0-2 0v7H38v-7a1 1 0 0 0-2 0v7h-4v-9a7.008 7.008 0 0 1 7-7h1v5a1 1 0 0 0 1 1 .937.937 0 0 0 .37-.07L46 48.08l4.63 1.85A.937.937 0 0 0 51 50a1 1 0 0 0 1-1v-5h1a7.008 7.008 0 0 1 7 7Z" />
                        <path d="M46 50a1 1 0 0 0-1 1v1a1 1 0 0 0 2 0v-1a1 1 0 0 0-1-1zm0 5a1 1 0 0 0-1 1v1a1 1 0 0 0 2 0v-1a1 1 0 0 0-1-1zm3.706-21.706a1 1 0 0 0-1.413 0 3.318 3.318 0 0 1-4.582 0 1 1 0 0 0-1.411 1.415 5.239 5.239 0 0 0 7.41 0 1 1 0 0 0-.004-1.415z" />
                      </svg>
                    </div>
                    <h5 className=" font-semibold text-default text-[1.25rem]">
                      Среден Precision
                    </h5>
                    <p className="text-[#8c9097] dark:text-white/50 mb-4">
                      Средна стойност спрямо всички потребители (за последно
                      генерираните от тях препоръки)
                    </p>
                    <div className="flex-grow">
                      <p className="text-2xl font-bold">{`${100}%`}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-3 md:col-span-6 sm:col-span-6 col-span-12">
                <div className="box feature-style">
                  <div className="box-body">
                    <Link
                      aria-label="anchor"
                      to="#"
                      className="stretched-link"
                    ></Link>
                    <div className="feature-style-icon bg-primary/10">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="svg-primary"
                        viewBox="0 0 64 64"
                      >
                        <path d="M45 30h2v2h-2zM41 30h2v2h-2zM37 30h2v2h-2z" />
                        <path d="M62 13v-2H42V9c0-3.859-3.141-7-7-7h-6c-3.859 0-7 3.141-7 7v2h-8a1 1 0 0 0-1 1v19c0 .633.13 1.234.346 1.792L2.75 35.532a1 1 0 0 0 0 1.936L16 40.894V46H5v2h11v2H8v2h8v2h-5v2h5.839l14.845 4.948a1.006 1.006 0 0 0 .632 0l15-5A.998.998 0 0 0 48 55V40.894l10-2.586v14.455l-1.895 3.789a1 1 0 0 0 0 .895l2 4a1.001 1.001 0 0 0 1.79 0l2-4a1 1 0 0 0 0-.895L60 52.764V37.791l1.25-.323a1 1 0 0 0 0-1.936l-10.596-2.741A4.938 4.938 0 0 0 51 31V21h5v-2h-5v-2h8v-2h-8v-2h11zm-3 45.764L58.118 57 59 55.236 59.882 57 59 58.764zM24 9c0-2.757 2.243-5 5-5h6c2.757 0 5 2.243 5 5v2h-2V9c0-1.654-1.346-3-3-3h-6c-1.654 0-3 1.346-3 3v2h-2V9zm12 2h-8V9a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2zm-21 2h34v4c0 1.654-1.346 3-3 3H36v-3a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v3H18c-1.654 0-3-1.346-3-3v-4zm34 18c0 .68-.236 1.3-.618 1.804-.006.007-.015.012-.021.02a3.076 3.076 0 0 1-.497.508 3.016 3.016 0 0 1-.5.325c-.03.015-.058.034-.088.048-.161.078-.33.135-.503.182-.042.011-.081.029-.123.038A2.985 2.985 0 0 1 46 34H18c-.222 0-.439-.028-.651-.076-.043-.009-.082-.027-.123-.038a2.866 2.866 0 0 1-.502-.182c-.031-.014-.059-.033-.089-.048a3.002 3.002 0 0 1-.996-.832c-.006-.008-.014-.012-.021-.02A2.975 2.975 0 0 1 15 31V20.974A4.948 4.948 0 0 0 18 22h1v3a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-3h14v3a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-3h1c1.13 0 2.162-.391 3-1.026V31zm-28-9h2v2h-2v-2zm13-2h-4v-2h4v2zm7 2h2v2h-2v-2zm5 32.279-14 4.667-14-4.667V41.412l13.75 3.556a1.008 1.008 0 0 0 .5 0L46 41.412v12.867zM32 42.967 6.993 36.5l7.504-1.941c.457.45.998.811 1.599 1.06.111.046.23.069.343.107.19.063.376.134.575.174.321.065.651.1.986.1h28c.335 0 .665-.035.986-.1.199-.04.385-.112.575-.174.114-.038.233-.061.343-.107a5 5 0 0 0 1.599-1.06l7.504 1.941L32 42.967z" />
                      </svg>
                    </div>
                    <h5 className=" font-semibold text-default text-[1.25rem]">
                      Среден Recall
                    </h5>
                    <p className="text-[#8c9097] dark:text-white/50 mb-4">
                      Средна стойност спрямо всички потребители (за всички
                      препоръки в платформата)
                    </p>
                    <div className="flex-grow">
                      <p className="text-2xl font-bold">{`${100}%`}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {`${100} от общо ${100} релевантни препоръки в системата са отправени към вас`}
                      </p>
                    </div>
                    <div className="mt-auto">
                      <Progress value={100} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-3 md:col-span-6 sm:col-span-6 col-span-12">
                <div className="box feature-style">
                  <div className="box-body">
                    <Link
                      aria-label="anchor"
                      to="#"
                      className="stretched-link"
                    ></Link>
                    <div className="feature-style-icon bg-primary/10">
                      <svg
                        className="svg-primary"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 66 66"
                      >
                        <g data-name="Layer 2">
                          <path d="M66 40.88a13 13 0 0 0-25.91-1.45c-1.51-.19-3.18-.34-5-.46v-2.09a15.25 15.25 0 0 0 5.42-8.51 5.34 5.34 0 0 0 3.21-4.91c0-2.18-.68-3.89-1.78-4.67 0-7.2-.63-11.65-3.24-14.25C34.15 0 23.87 4.17 20.75.36A1 1 0 0 0 19.4.18C13 4.7 10.73 13 12.92 19.3a6.55 6.55 0 0 0-1.21 4.15 5.33 5.33 0 0 0 3.21 4.92 15.26 15.26 0 0 0 5.44 8.53V39C13.3 39.42 0 40.23 0 53.93V65a1 1 0 0 0 1 1h53.44a1 1 0 0 0 1-1V53.64A13 13 0 0 0 66 40.88ZM44.75 58.36V64h-16V52.82l6-11.87c8.62.52 16.9 1.44 18.57 10.85h-2.01a6.56 6.56 0 0 0-6.56 6.56Zm-17-8-2.3-4.59.92-2.92h2.77l.86 2.89ZM19.9 2.3c4.61 3.49 13.92.19 17.4 3.7 2.19 2.18 2.64 6.61 2.65 13.5l-.39.64c-.28-2.22-.45-3.37-.61-4v-.06c-.86-5.94-7.47-6.07-12.59-2.41-2.89 1.8-5.67 1.44-8.73-1.12a1 1 0 0 0-1.63.65l-.78 6.48C12.86 14.76 14.18 6.82 19.9 2.3Zm-3.16 25.05a1 1 0 0 0-.89-.79 3.2 3.2 0 0 1-2.14-3.1 6.59 6.59 0 0 1 .29-1.94A5.18 5.18 0 0 0 15.37 23a1 1 0 0 0 1.54-.72l.86-7.13a8.42 8.42 0 0 0 9.69.19c3.63-2.59 8.85-3.46 9.5 1 0 .27.72 4.83 1 6.86a1 1 0 0 0 1.85.4l1.52-2.5a5.67 5.67 0 0 1 .44 2.36 3.23 3.23 0 0 1-2.15 3.1 1 1 0 0 0-.88.79c-1.25 5.95-5.77 10.1-11 10.1s-9.74-4.15-11-10.1Zm11 12.1a11.8 11.8 0 0 0 5.38-1.3v1.47l-1.78 3.56-.53-1.65a1 1 0 0 0-.95-.7h-4.25a1 1 0 0 0-1 .7l-.52 1.66-1.77-3.52v-1.51a11.87 11.87 0 0 0 5.4 1.29Zm-7 1.5 5.95 11.84V64h-16v-5.64a6.56 6.56 0 0 0-6.56-6.56H2.19C3.86 42.37 12.24 41.46 20.76 41ZM2 53.93a.57.57 0 0 1 0-.13h2.13a4.56 4.56 0 0 1 4.56 4.56V64H2ZM53.44 64h-6.69v-5.64a4.56 4.56 0 0 1 4.56-4.56h2.12c.01.69.01-2.66.01 10.2Zm1.81-12.35c-1-6.06-5-10.62-13.18-11.94a11 11 0 1 1 13.18 11.94Z" />
                          <path d="M57.54 39.87H54v-5.25a1 1 0 0 0-2 0v6.25a1 1 0 0 0 1 1h4.54a1 1 0 0 0 0-2Z" />
                        </g>
                      </svg>
                    </div>
                    <h5 className=" font-semibold text-default text-[1.25rem]">
                      Среден F1 Score
                    </h5>
                    <p className="text-[#8c9097] dark:text-white/50 mb-4">
                      Средна стойност спрямо всички потребители (за всички
                      препоръки в платформата)
                    </p>
                    <div className="flex-grow">
                      <p className="text-2xl font-bold">{`${100}%`}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Баланс между Precision и Recall
                      </p>
                    </div>
                    <div className="mt-auto">
                      <Progress value={100} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Card className="dark:border-black/10 bg-bodybg font-semibold text-xl p-4 rounded-lg shadow-lg dark:shadow-xl text-center">
              <h2 className="text-2xl opsilion text-defaulttextcolor dark:text-white/80">
                За да придобиете по-ясна представа за значенията на тези
                показатели за оценка на машинното обучение, моля, разгледайте
                <a
                  href="#accordion"
                  className="side-menu__item text-gray-500 cursor-pointer hover:text-primary/80 transition-all duration-150"
                >
                  {" <<секцията за разяснения>> "}
                </a>
                !
              </h2>
            </Card>
          </div>
        </section>
        <section
          className="section scroll-mt-16 bg-primary text-defaultsize text-defaulttextcolor"
          id="accordion"
        >
          <div className="container text-center">
            <div className="text-sm">
              <Accordion type="single" collapsible className="space-y-4">
                {/* Relevance */}
                <AccordionItem value="relevance">
                  <AccordionTrigger className="opsilion">
                    🎯 Релевантност
                  </AccordionTrigger>
                  <AccordionContent>
                    Свойство, което дадена препоръка може да притежава. Дали
                    даден филм или сериал е{" "}
                    <span className="font-semibold">релевантен </span> се
                    определя спрямо това дали неговите характеристики като{" "}
                    <span className="font-semibold">
                      жанр, емоционално състояние, разполагаемо време за гледане
                    </span>{" "}
                    и други се съобразяват с{" "}
                    <span className="font-semibold">ВАШИТЕ </span> индивидуални
                    потребителски предпочитания. Всичко това се случва с помощта
                    на{" "}
                    <span className="font-semibold">
                      Алгоритъма за релевантност
                    </span>
                    , описан в следващата секция.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="concept">
                  <AccordionTrigger className="opsilion">
                    🔍 Как работи алгоритъмът?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-10">
                      <span className="font-semibold">
                        Алгоритъмът за релевантност
                      </span>{" "}
                      е сърцето на препоръчителната система, който анализира{" "}
                      <span className="font-semibold">
                        последно регистрираните{" "}
                      </span>
                      предпочитания на потребителя и определя доколко даден филм
                      или сериал съвпада с неговите изисквания. Той използва
                      подход, включващ няколко критерия за оценка, и изчислява
                      общ резултат, който се нарича{" "}
                      <span className="font-semibold">релевантност</span>.
                    </p>
                    <h2 className="text-2xl">Критериите са: </h2>
                    <ul className="space-y-4 mt-3">
                      <li>
                        <strong>✅ Предпочитани жанрове</strong> – Проверява се
                        дали жанровете на предложеното съдържание съвпадат с
                        тези, които потребителят харесва. Ако има съвпадение, то
                        се оценява с висока тежест.
                      </li>
                      <li>
                        <strong>✅ Тип съдържание (филм или сериал)</strong> –
                        Системата преобразува избора на потребителя в
                        стандартизиран формат (напр. "Филм" → "movie") и го
                        сравнява с типа на препоръчаното заглавие.
                      </li>
                      <li>
                        <strong>✅ Настроение на потребителя</strong> – В
                        зависимост от настроението, в което се намира
                        потребителят, се извършва съпоставяне с жанрове, които
                        типично се свързват с това усещане.
                      </li>
                      <li>
                        <strong>✅ Наличност на време</strong> – Алгоритъмът
                        оценява дали продължителността на филма или средната
                        продължителност на епизодите на сериала се вписват в
                        свободното време на потребителя, като използва разумен
                        толеранс за разлики от няколко минути.
                      </li>
                      <li>
                        <strong>✅ Година на издаване</strong> – Ако
                        потребителят има предпочитания за определен времеви
                        период (напр. „публикуван в последните 10 години“),
                        препоръките се филтрират според този критерий.
                      </li>
                      <li>
                        <strong>✅ Целева аудитория</strong> – Системата
                        сравнява таргетираната възрастова група на съдържанието
                        със заявените предпочитания на потребителя.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="calculation">
                  <AccordionTrigger className="opsilion">
                    🎯 Как се изчислява крайният резултат?
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-4">
                      <li>
                        Всеки критерий има индивидуален принос към крайния
                        резултат, като по-важните фактори (като жанр) получават
                        по-голяма брой точки при съвпадение. Системата изчислява
                        сборна оценка, която показва до каква степен филмът или
                        сериалът е релевантен за потребителя.
                      </li>
                      <li>
                        <strong>
                          {" "}
                          📌 Ако резултатът премине прагът от 5 точки,
                          препоръката се счита за подходяща и се предлага на
                          потребителя.
                        </strong>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                {/* Precision */}
                <AccordionItem value="precision">
                  <AccordionTrigger className="opsilion">
                    ✅ Precision
                  </AccordionTrigger>
                  <AccordionContent>
                    <p>
                      Измерва каква част от препоръките, които сте направили, са{" "}
                      <span className="font-semibold">наистина </span>{" "}
                      релевантни. Високата стойност на{" "}
                      <span className="font-semibold">Precision</span> означава,
                      че когато системата препоръчва нещо, то вероятно ще бъде
                      подходящо за вас.
                    </p>
                    <Card className="bg-white dark:bg-bodybg2 dark:border-black/10 dark:text-defaulttextcolor/70 font-semibold text-xl p-4 rounded-md shadow-lg dark:shadow-xl text-center leading-relaxed mx-auto mt-5">
                      <div className="flex items-center space-x-2 justify-center items-center">
                        <span className="font-semibold">Precision =</span>
                        <div className="text-center">
                          <p className="text-primary text-sm">
                            всички РЕЛЕВАНТНИ препоръки правени някога НА ВАС
                          </p>
                          <div className="border-b border-gray-400 dark:border-gray-600 my-2"></div>
                          <p className="text-secondary text-sm">
                            всички препоръки, които някога са правени НА ВАС
                          </p>
                        </div>
                      </div>
                    </Card>
                  </AccordionContent>
                </AccordionItem>

                {/* Recall */}
                <AccordionItem value="recall">
                  <AccordionTrigger className="opsilion">
                    🔍 Recall
                  </AccordionTrigger>
                  <AccordionContent>
                    <p>
                      Измерва каква част от всички препоръки, които са
                      определени като релевантни, са били препоръчани на{" "}
                      <span className="font-semibold">ВАС</span>. Високата
                      стойност на Recall означава, че системата{" "}
                      <span className="font-semibold">НЕ </span> пропуска{" "}
                      <span className="font-semibold">важни (релевантни) </span>{" "}
                      препоръки, дори ако включва някои нерелевантни.
                    </p>
                    <Card className="bg-white dark:bg-bodybg2 dark:border-black/10 dark:text-defaulttextcolor/70 font-semibold text-xl p-4 rounded-md shadow-lg dark:shadow-xl text-center leading-relaxed mx-auto mt-5">
                      <div className="flex items-center space-x-2 justify-center items-center">
                        <span className="font-semibold">Recall =</span>
                        <div className="text-center">
                          <p className="text-primary text-sm">
                            всички РЕЛЕВАНТНИ препоръки правени някога НА ВАС
                          </p>
                          <div className="border-b border-gray-400 dark:border-gray-600 my-2"></div>
                          <p className="text-secondary text-sm">
                            всички препоръки, които са РЕЛЕВАНТНИ на ВАШИТЕ
                            предпочитания, измежду тези в цялата система
                          </p>
                        </div>
                      </div>
                    </Card>
                  </AccordionContent>
                </AccordionItem>

                {/* F1 Score */}
                <AccordionItem value="f1-score">
                  <AccordionTrigger className="opsilion">
                    ⚖️ F1 Score
                  </AccordionTrigger>
                  <AccordionContent>
                    <p>
                      <span className="font-semibold">
                        Балансиран показател
                      </span>
                      , който комбинира стойностите на{" "}
                      <span className="font-semibold">Precision</span> и{" "}
                      <span className="font-semibold">Recall</span>, показвайки
                      колко добре системата намира точния баланс между тях.
                      Високият <span className="font-semibold">F1 Score</span>{" "}
                      означава, че системата има добро представяне както по
                      отношение на{" "}
                      <span className="font-semibold">
                        точността на препоръките
                      </span>
                      , така и на
                      <span className="font-semibold">
                        покритието спрямо всички възможности
                      </span>
                      .
                    </p>
                    <Card className="bg-white dark:bg-bodybg2 dark:border-black/10 dark:text-defaulttextcolor/70 font-semibold text-xl p-4 rounded-md shadow-lg dark:shadow-xl text-center leading-relaxed mx-auto mt-5">
                      <div className="flex items-center space-x-2 justify-center items-center">
                        <span className="font-semibold">F1 Score =</span>
                        <div className="text-center">
                          <p className="text-primary text-sm">
                            2 x Precision x Recall
                          </p>
                          <div className="border-b border-gray-400 dark:border-gray-600 my-2"></div>
                          <p className="text-secondary text-sm">
                            Precision + Recall
                          </p>
                        </div>
                      </div>
                    </Card>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>
        <section
          className="section section-bg text-defaultsize text-defaulttextcolor mb-[15rem]"
          id="additionalStats"
        >
          <div className="container text-center">
            <div className=" gap-6 mb-[3rem] justify-center text-center">
              <h3 className="font-semibold mb-2">Други главни статистики:</h3>
            </div>
            <div className="grid grid-cols-12 gap-x-6 justify-center">
              <div className="xxl:col-span-3 xl:col-span-3 col-span-12">
                <div className="box custom-box">
                  <div className="box-body h-[5.5rem]">
                    <div className="flex items-center justify-between">
                      {/* Лява секция, показваща общия брой потребители */}
                      <div className="flex-grow">
                        <p className={`mb-0 text-[#8c9097] dark:text-white/50`}>
                          Общ брой потребители
                        </p>
                        <div className="flex items-center">
                          <span className={`text-[1.25rem] opsilion`}>
                            {20} {/* Показва общия брой потребители или 0 */}
                          </span>
                        </div>
                      </div>
                      {/* Дясна секция, показваща икона */}
                      <div>
                        <span className="avatar avatar-md !rounded-full bg-primary/10 !text-secondary text-[1.125rem]">
                          <i
                            className={`bi bi-person text-primary text-[1rem]`}
                          ></i>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="xxl:col-span-3 xl:col-span-3 col-span-12">
                <div className="box custom-box">
                  <div className="box-body h-[5.5rem]">
                    <div className="flex items-center justify-between">
                      {/* Лява секция, показваща общия брой потребители */}
                      <div className="flex-grow">
                        <p className={`mb-0 text-[#8c9097] dark:text-white/50`}>
                          Най-препоръчван жанр
                        </p>
                        <div className="flex items-center">
                          <span className={`text-[1.25rem] opsilion`}>
                            {`${"Драма"}`}{" "}
                            {/* Показва общия брой потребители или 0 */}
                          </span>
                        </div>
                      </div>
                      {/* Дясна секция, показваща икона */}
                      <div>
                        <span className="avatar avatar-md !rounded-full bg-primary/10 !text-secondary text-[1.125rem]">
                          <i
                            className={`bi bi-film text-primary text-[1rem]`}
                          ></i>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>{" "}
              <div className="xxl:col-span-3 xl:col-span-3 col-span-12">
                <div className="box custom-box">
                  <div className="box-body h-[5.5rem]">
                    <div className="flex items-center justify-between">
                      {/* Лява секция, показваща общия брой потребители */}
                      <div className="flex-grow">
                        <p className={`mb-0 text-[#8c9097] dark:text-white/50`}>
                          Среден Боксофис
                        </p>
                        <div className="flex items-center">
                          <span className={`text-[1.25rem] opsilion`}>
                            {`${"$77,572,149"}`}{" "}
                            {/* Показва общия брой потребители или 0 */}
                          </span>
                        </div>
                      </div>
                      {/* Дясна секция, показваща икона */}
                      <div>
                        <span className="avatar avatar-md !rounded-full bg-primary/10 !text-secondary text-[1.125rem]">
                          <i
                            className={`bi bi-clipboard-data text-primary text-[1rem]`}
                          ></i>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>{" "}
              <div className="xxl:col-span-3 xl:col-span-3 col-span-12">
                <div className="box custom-box">
                  <div className="box-body h-[5.5rem]">
                    <div className="flex items-center justify-between">
                      {/* Лява секция, показваща общия брой потребители */}
                      <div className="flex-grow">
                        <p className={`mb-0 text-[#8c9097] dark:text-white/50`}>
                          Общ брой спечелени награди
                        </p>
                        <div className="flex items-center">
                          <span className={`text-[1.25rem] opsilion`}>
                            {7978} {/* Показва общия брой потребители или 0 */}
                          </span>
                        </div>
                      </div>
                      {/* Дясна секция, показваща икона */}
                      <div>
                        <span className="avatar avatar-md !rounded-full bg-primary/10 !text-secondary text-[1.125rem]">
                          <i
                            className={`bi bi-trophy text-primary text-[1rem]`}
                          ></i>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Fragment>
  );
};
const mapStateToProps = (state: any) => ({
  local_varaiable: state
});

export default connect(mapStateToProps, { ThemeChanger })(Jobslanding);
// export default Jobslanding;

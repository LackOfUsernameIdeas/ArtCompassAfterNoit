import { FC, Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
// import required modules
import { Autoplay, Pagination } from "swiper/modules";
import store from "../../redux/store";
import { ThemeChanger } from "../../redux/action";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Navbar2 from "./sidemenu";
import { connect } from "react-redux";

interface JobslandingProps {}

const Jobslanding: FC<JobslandingProps> = ({ ThemeChanger }: any) => {
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth <= 992) {
        const theme = store.getState();
        ThemeChanger({
          ...theme,
          toggled: "close",
          dataNavLayout: "horizontal"
        });
      } else {
        const theme = store.getState();
        ThemeChanger({
          ...theme,
          toggled: "open",
          dataNavLayout: "horizontal"
        });
      }
    }

    handleResize(); // Initial check

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  function handleClick() {
    const theme = store.getState();
    ThemeChanger({ ...theme, toggled: "close", dataNavLayout: "horizontal" });
  }
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
                  to={`${import.meta.env.BASE_URL}signin`}
                  className="ti-btn w-[10rem] ti-btn-primary-full m-0 p-2"
                >
                  Влезте в профила си
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </aside>
      <div
        className="main-content !p-0 landing-main dark:text-defaulttextcolor/70"
        onClick={handleClick}
      >
        <div className="landing-banner !h-auto" id="home">
          <section className="section !pb-0 text-[0.813rem]">
            <div className="container main-banner-container">
              <div className="grid grid-cols-12 justify-center text-center">
                <div className="xxl:col-span-2 xl:col-span-2 lg:col-span-2 col-span-12"></div>
                <div className="xxl:col-span-8 xl:col-span-8 lg:col-span-8 col-span-12">
                  <div className="">
                    <h5 className="landing-banner-heading mb-3 !text-[2.4rem]">
                      <span className="text-secondary font-bold">6000+ </span>
                      Jobs, Find your dream job
                    </h5>
                    <p className="text-[1.125rem] mb-[3rem] opacity-[0.8] font-normal text-white">
                      Register &amp; get free access to latest openings
                      worldwide. Create &amp; submit your resume with few easy
                      steps.
                    </p>
                  </div>
                </div>
                <div className="xxl:col-span-2 xl:col-span-2 lg:col-span-2 col-span-12"></div>
              </div>
            </div>
          </section>
        </div>
        <section
          className="section section-bg dark:!bg-black/10 text-defaulttextcolor"
          id="candidate"
        >
          <div className="container text-center">
            <div className=" justify-center text-center mb-12">
              <div className="xl:col-span-6 col-span-12">
                <p className="text-[0.75rem] font-semibold mb-1">
                  <span className="landing-section-heading">Steps</span>
                </p>
                <h3 className="font-semibold mb-2">How it works ?</h3>
                <span className="text-[#8c9097] dark:text-white/50 text-[0.9375rem] font-normal block">
                  Sed do eiusmod tempor incididunt ut labore et dolore magna
                  aliqua
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
                      Register Your Account
                    </h5>
                    <p className="opacity-[0.8] mb-4">
                      Est amet sit vero sanctus labore no sed ipsum ipsum
                      nonumy. Sit ipsum sanctus ea.
                    </p>
                    <Link
                      className="mx-1 text-primary font-semibold leading-[1]"
                      to="#"
                    >
                      Register Now
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
                      Complete Your Profile
                    </h5>
                    <p className="opacity-[0.8] mb-4">
                      Est amet sit vero sanctus labore no sed ipsum ipsum
                      nonumy. Sit ipsum sanctus ea.
                    </p>
                    <Link
                      className="mx-1 text-primary font-semibold leading-[1]"
                      to="#"
                    >
                      Complete Profile
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
                      Apply job / Hire
                    </h5>
                    <p className="opacity-[0.8] mb-4">
                      Est amet sit vero sanctus labore no sed ipsum ipsum
                      nonumy. Sit ipsum sanctus ea.
                    </p>
                    <Link
                      className="mx-1 text-primary font-semibold leading-[1]"
                      to="#"
                    >
                      Apply Now
                      <i className="ri-arrow-right-s-line align-middle rtl:rotate-180"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="section bg-primary" id="wantedJob">
          <div className="container">
            <div className="grid grid-cols-12 justify-center text-center mb-[3rem] text-white">
              <div className="xl:col-span-3 col-span-12"></div>
              <div className="xl:col-span-6 col-span-12">
                <h3 className="font-semibold mb-2 dark:text-defaulttextcolor/70">
                  Which Type Of Job You Want ?
                </h3>
                <span className="text-[0.9375rem] font-normal block opacity-[0.8]">
                  Sed do eiusmod tempor incididunt ut labore et dolore magna
                  aliqua
                </span>
              </div>
              <div className="xl:col-span-3 col-span-12"></div>
            </div>
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
                      In Home
                    </h5>
                    <p className="text-[#8c9097] dark:text-white/50 mb-4">
                      120 Jobs Available
                    </p>
                    <Link className="text-primary font-semibold" to="#">
                      Explore Jobs
                      <i className="ri-arrow-right-s-line align-middle rtl:rotate-180"></i>
                    </Link>
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
                      Internship
                    </h5>
                    <p className="text-[#8c9097] dark:text-white/50 mb-4">
                      120 Jobs Available
                    </p>
                    <Link className="text-primary font-semibold" to="#">
                      Explore Jobs
                      <i className="ri-arrow-right-s-line align-middle rtl:rotate-180"></i>
                    </Link>
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
                      Part Time
                    </h5>
                    <p className="text-[#8c9097] dark:text-white/50 mb-4">
                      120 Jobs Available
                    </p>
                    <Link className="text-primary font-semibold" to="#">
                      Explore Jobs
                      <i className="ri-arrow-right-s-line align-middle rtl:rotate-180"></i>
                    </Link>
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
                      Full Time
                    </h5>
                    <p className="text-[#8c9097] dark:text-white/50 mb-4">
                      120 Jobs Available
                    </p>
                    <Link className="text-primary font-semibold" to="#">
                      Explore Jobs
                      <i className="ri-arrow-right-s-line align-middle rtl:rotate-180"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section
          className="section bg-light text-defaultsize text-defaulttextcolor"
          id="employers"
        >
          <div className="container text-center">
            <div className=" gap-6 mb-[3rem] justify-center text-center">
              <p className="text-[0.75rem] font-semibold mb-1">
                <span className="landing-section-heading">FAQ'S</span>{" "}
              </p>
              <h3 className="font-semibold mb-2">
                Frequently Asked Questions?
              </h3>
              <div className="xl:col-span-9 col-span-12">
                <span className="block font-normal text-[0.9375rem] text-[#8c9097] dark:text-white/50">
                  Sed do eiusmod tempor incididunt ut labore et dolore magna
                  aliqua
                </span>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-x-6 justify-center">
              <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-3 md:col-span-6 sm:col-span-6 col-span-12">
                <div className="box text-start featured-card-4">
                  <Link aria-label="anchor" to="#" className="open-link"></Link>
                  <div className="box-body p-4">
                    <div className="flex items-center">
                      <div className="me-2 p-2 !bg-primary/10 !rounded-full dark:border-defaultborder/10 !border dark:border-defaultborder/10-primary/10">
                        <span className="avatar avatar-rounded bg-primary !mb-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="#FFFFFF"
                              d="M11.29,15.29a1.58,1.58,0,0,0-.12.15.76.76,0,0,0-.09.18.64.64,0,0,0-.06.18,1.36,1.36,0,0,0,0,.2.84.84,0,0,0,.08.38.9.9,0,0,0,.54.54.94.94,0,0,0,.76,0,.9.9,0,0,0,.54-.54A1,1,0,0,0,13,16a1,1,0,0,0-.29-.71A1,1,0,0,0,11.29,15.29ZM12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8,8,0,0,1,12,20ZM12,7A3,3,0,0,0,9.4,8.5a1,1,0,1,0,1.73,1A1,1,0,0,1,12,9a1,1,0,0,1,0,2,1,1,0,0,0-1,1v1a1,1,0,0,0,2,0v-.18A3,3,0,0,0,12,7Z"
                            />
                          </svg>
                        </span>
                      </div>
                      <h6 className="font-semibold mb-0 text-[1rem]">
                        General Questions
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
              <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-3 md:col-span-6 sm:col-span-6 col-span-12">
                <div className="box text-start featured-card-4">
                  <Link aria-label="anchor" to="#" className="open-link"></Link>
                  <div className="box-body p-4">
                    <div className="flex items-center">
                      <div className="me-2 p-2 !bg-primary/10 !rounded-full dark:border-defaultborder/10 !border dark:border-defaultborder/10-primary/10">
                        <span className="avatar avatar-rounded bg-primary !mb-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="#FFFFFF"
                              d="M21.5,15a3,3,0,0,0-1.9-2.78l1.87-7a1,1,0,0,0-.18-.87A1,1,0,0,0,20.5,4H6.8L6.47,2.74A1,1,0,0,0,5.5,2h-2V4H4.73l2.48,9.26a1,1,0,0,0,1,.74H18.5a1,1,0,0,1,0,2H5.5a1,1,0,0,0,0,2H6.68a3,3,0,1,0,5.64,0h2.36a3,3,0,1,0,5.82,1,2.94,2.94,0,0,0-.4-1.47A3,3,0,0,0,21.5,15Zm-3.91-3H9L7.34,6H19.2ZM9.5,20a1,1,0,1,1,1-1A1,1,0,0,1,9.5,20Zm8,0a1,1,0,1,1,1-1A1,1,0,0,1,17.5,20Z"
                            />
                          </svg>
                        </span>
                      </div>
                      <h6 className="font-semibold mb-0 text-[1rem]">
                        Order &amp; Cart
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
              <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-3 md:col-span-6 sm:col-span-6 col-span-12">
                <div className="box text-start featured-card-4">
                  <Link aria-label="anchor" to="#" className="open-link"></Link>
                  <div className="box-body p-4">
                    <div className="flex items-center">
                      <div className="me-2 p-2 !bg-primary/10 !rounded-full dark:border-defaultborder/10 !border dark:border-defaultborder/10-primary/10">
                        <span className="avatar avatar-rounded bg-primary !mb-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            data-name="Layer 1"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="#FFFFFF"
                              d="M20,17.57a4.3,4.3,0,1,0-3.67,2.06A4.37,4.37,0,0,0,18.57,19l1.72,1.73a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42ZM18,17a2.37,2.37,0,0,1-3.27,0,2.32,2.32,0,0,1,0-3.27,2.31,2.31,0,0,1,3.27,0A2.32,2.32,0,0,1,18,17ZM19,3H5A3,3,0,0,0,2,6v9a3,3,0,0,0,3,3H9a1,1,0,0,0,0-2H5a1,1,0,0,1-1-1V9H20v1a1,1,0,0,0,2,0V6A3,3,0,0,0,19,3Zm1,4H4V6A1,1,0,0,1,5,5H19a1,1,0,0,1,1,1ZM10,11H7a1,1,0,0,0,0,2h3a1,1,0,0,0,0-2Z"
                            />
                          </svg>
                        </span>
                      </div>
                      <h6 className="font-semibold mb-1 text-[1rem]">
                        Payment &amp; Credits
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
              <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-3 md:col-span-6 sm:col-span-6 col-span-12">
                <div className="box text-start featured-card-4">
                  <Link aria-label="anchor" to="#" className="open-link"></Link>
                  <div className="box-body p-4">
                    <div className="flex items-center">
                      <div className="me-2 p-2 !bg-primary/10 !rounded-full dark:border-defaultborder/10 !border dark:border-defaultborder/10-primary/10">
                        <span className="avatar avatar-rounded bg-primary !mb-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="#FFFFFF"
                              d="M1,12.5v5a1,1,0,0,0,1,1H3a3,3,0,0,0,6,0h6a3,3,0,0,0,6,0h1a1,1,0,0,0,1-1V5.5a3,3,0,0,0-3-3H11a3,3,0,0,0-3,3v2H6A3,3,0,0,0,3.6,8.7L1.2,11.9a.61.61,0,0,0-.07.14l-.06.11A1,1,0,0,0,1,12.5Zm16,6a1,1,0,1,1,1,1A1,1,0,0,1,17,18.5Zm-7-13a1,1,0,0,1,1-1h9a1,1,0,0,1,1,1v11h-.78a3,3,0,0,0-4.44,0H10Zm-2,6H4L5.2,9.9A1,1,0,0,1,6,9.5H8Zm-3,7a1,1,0,1,1,1,1A1,1,0,0,1,5,18.5Zm-2-5H8v2.78a3,3,0,0,0-4.22.22H3Z"
                            />
                          </svg>
                        </span>
                      </div>
                      <h6 className="font-semibold mb-1 text-[1rem]">
                        Shipping
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
              <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-3 md:col-span-6 sm:col-span-6 col-span-12">
                <div className="box text-start featured-card-4">
                  <Link aria-label="anchor" to="#" className="open-link"></Link>
                  <div className="box-body p-4">
                    <div className="flex items-center">
                      <div className="me-2 p-2 !bg-primary/10 !rounded-full dark:border-defaultborder/10 !border dark:border-defaultborder/10-primary/10">
                        <span className="avatar avatar-rounded bg-primary !mb-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="#FFFFFF"
                              d="M11.5,20h-6a1,1,0,0,1-1-1V5a1,1,0,0,1,1-1h5V7a3,3,0,0,0,3,3h3v5a1,1,0,0,0,2,0V9s0,0,0-.06a1.31,1.31,0,0,0-.06-.27l0-.09a1.07,1.07,0,0,0-.19-.28h0l-6-6h0a1.07,1.07,0,0,0-.28-.19.29.29,0,0,0-.1,0A1.1,1.1,0,0,0,11.56,2H5.5a3,3,0,0,0-3,3V19a3,3,0,0,0,3,3h6a1,1,0,0,0,0-2Zm1-14.59L15.09,8H13.5a1,1,0,0,1-1-1ZM7.5,14h6a1,1,0,0,0,0-2h-6a1,1,0,0,0,0,2Zm4,2h-4a1,1,0,0,0,0,2h4a1,1,0,0,0,0-2Zm-4-6h1a1,1,0,0,0,0-2h-1a1,1,0,0,0,0,2Zm13.71,6.29a1,1,0,0,0-1.42,0l-3.29,3.3-1.29-1.3a1,1,0,0,0-1.42,1.42l2,2a1,1,0,0,0,1.42,0l4-4A1,1,0,0,0,21.21,16.29Z"
                            />
                          </svg>
                        </span>
                      </div>
                      <h6 className="font-semibold mb-1 text-[1rem]">
                        Licence
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
              <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-3 md:col-span-6 sm:col-span-6 col-span-12">
                <div className="box text-start featured-card-4">
                  <Link aria-label="anchor" to="#" className="open-link"></Link>
                  <div className="box-body p-4">
                    <div className="flex items-center">
                      <div className="me-2 p-2 !bg-primary/10 !rounded-full dark:border-defaultborder/10 !border dark:border-defaultborder/10-primary/10">
                        <span className="avatar avatar-rounded bg-primary !mb-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            data-name="Layer 1"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="#FFFFFF"
                              d="M13,16H7a1,1,0,0,0,0,2h6a1,1,0,0,0,0-2ZM9,10h2a1,1,0,0,0,0-2H9a1,1,0,0,0,0,2Zm12,2H18V3a1,1,0,0,0-.5-.87,1,1,0,0,0-1,0l-3,1.72-3-1.72a1,1,0,0,0-1,0l-3,1.72-3-1.72a1,1,0,0,0-1,0A1,1,0,0,0,2,3V19a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V13A1,1,0,0,0,21,12ZM5,20a1,1,0,0,1-1-1V4.73L6,5.87a1.08,1.08,0,0,0,1,0l3-1.72,3,1.72a1.08,1.08,0,0,0,1,0l2-1.14V19a3,3,0,0,0,.18,1Zm15-1a1,1,0,0,1-2,0V14h2Zm-7-7H7a1,1,0,0,0,0,2h6a1,1,0,0,0,0-2Z"
                            />
                          </svg>
                        </span>
                      </div>
                      <h6 className="font-semibold mb-1 text-[1rem]">
                        Invoice
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section
          className="section landing-testimonials text-defaulttextcolor text-defaultsize"
          id="careerAdvice"
        >
          <div className="container text-center">
            <div className=" mb-[3rem] justify-center text-center">
              <p className="text-[0.75rem] font-semibold mb-1">
                <span className="landing-section-heading">TESTIMONIALS</span>{" "}
              </p>
              <h3 className="font-semibold mb-2">
                We never failed to reach expectations
              </h3>
              <div className="xl:col-span-9 col-span-12">
                <span className="block font-normal text-[0.9375rem] text-[#8c9097] dark:text-white/50">
                  Some of the reviews our clients gave which brings motivation
                  to work for future projects.
                </span>
              </div>
            </div>
            <Swiper
              // slidesPerView={3}
              breakpoints={{
                640: {
                  slidesPerView: 1,
                  spaceBetween: 10
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 30
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 30
                }
              }}
              spaceBetween={30}
              centeredSlides={false}
              autoplay={{ delay: 2500, disableOnInteraction: false }}
              pagination={{
                dynamicBullets: true,
                clickable: true
              }}
              modules={[Pagination, Autoplay]}
              className="mySwiper"
            >
              <SwiperSlide className="rtl:dir-rtl">
                <div className="box testimonial-card">
                  <div className="box-body">
                    <div className="flex items-center mb-4">
                      <div>
                        <p className="mb-0 font-semibold text-[0.875rem]">
                          Json Taylor
                        </p>
                        <p className="mb-0 text-[0.625rem] font-semibold text-[#8c9097] dark:text-white/50">
                          CEO OF NORJA
                        </p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <span className="text-[#8c9097] dark:text-white/50">
                        - Lorem ipsum dolor sit amet consectetur adipisicing
                        elit. Earum autem quaerat distinctio --
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-[#8c9097] dark:text-white/50">
                          Rating :{" "}
                        </span>
                        <span className="text-warning block ms-1">
                          <i className="ri-star-fill"></i>
                          <i className="ri-star-fill"></i>
                          <i className="ri-star-fill"></i>
                          <i className="ri-star-fill"></i>
                          <i className="ri-star-half-fill"></i>
                        </span>
                      </div>
                      <div className="ltr:float-right rtl:float-left text-[0.75rem] font-semibold text-[#8c9097] dark:text-white/50 text-end">
                        <span>12 days ago</span>
                        <span className="block font-normal text-[0.75rem] text-success">
                          <i>Json Taylor</i>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide className="rtl:dir-rtl">
                <div className="box testimonial-card">
                  <div className="box-body">
                    <div className="flex items-center mb-4">
                      <div>
                        <p className="mb-0 font-semibold text-[0.875rem]">
                          Melissa Blue
                        </p>
                        <p className="mb-0 text-[0.625rem] font-semibold text-[#8c9097] dark:text-white/50">
                          MANAGER CHO
                        </p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <span className="text-[#8c9097] dark:text-white/50">
                        - Lorem ipsum dolor sit amet consectetur adipisicing
                        elit. Earum autem quaerat distinctio --
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-[#8c9097] dark:text-white/50">
                          Rating :{" "}
                        </span>
                        <span className="text-warning block ms-1">
                          <i className="ri-star-fill"></i>
                          <i className="ri-star-fill"></i>
                          <i className="ri-star-fill"></i>
                          <i className="ri-star-fill"></i>
                          <i className="ri-star-half-fill"></i>
                        </span>
                      </div>
                      <div className="ltr:float-right rtl:float-left text-[0.75rem] font-semibold text-[#8c9097] dark:text-white/50 text-end">
                        <span>7 days ago</span>
                        <span className="block font-normal text-[0.75rem] text-success">
                          <i>Melissa Blue</i>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide className="rtl:dir-rtl">
                <div className="box testimonial-card">
                  <div className="box-body">
                    <div className="flex items-center mb-4">
                      <div>
                        <p className="mb-0 font-semibold text-[0.875rem]">
                          Kiara Advain
                        </p>
                        <p className="mb-0 text-[0.625rem] font-semibold text-[#8c9097] dark:text-white/50">
                          CEO OF EMPIRO
                        </p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <span className="text-[#8c9097] dark:text-white/50">
                        - Lorem ipsum dolor sit amet consectetur adipisicing
                        elit. Earum autem quaerat distinctio --
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-[#8c9097] dark:text-white/50">
                          Rating :{" "}
                        </span>
                        <span className="text-warning block ms-1">
                          <i className="ri-star-fill"></i>
                          <i className="ri-star-fill"></i>
                          <i className="ri-star-fill"></i>
                          <i className="ri-star-fill"></i>
                          <i className="ri-star-line"></i>
                        </span>
                      </div>
                      <div className="ltr:float-right rtl:float-left text-[0.75rem] font-semibold text-[#8c9097] dark:text-white/50 text-end">
                        <span>2 days ago</span>
                        <span className="block font-normal text-[0.75rem] text-success">
                          <i>Kiara Advain</i>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide className="rtl:dir-rtl">
                <div className="box testimonial-card">
                  <div className="box-body">
                    <div className="flex items-center mb-4">
                      <div>
                        <p className="mb-0 font-semibold text-[0.875rem]">
                          Jhonson Smith
                        </p>
                        <p className="mb-0 text-[0.625rem] font-semibold text-[#8c9097] dark:text-white/50">
                          CHIEF SECRETARY MBIO
                        </p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <span className="text-[#8c9097] dark:text-white/50">
                        - Lorem ipsum dolor sit amet consectetur adipisicing
                        elit. Earum autem quaerat distinctio --
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-[#8c9097] dark:text-white/50">
                          Rating :{" "}
                        </span>
                        <span className="text-warning block ms-1">
                          <i className="ri-star-fill"></i>
                          <i className="ri-star-fill"></i>
                          <i className="ri-star-fill"></i>
                          <i className="ri-star-fill"></i>
                          <i className="ri-star-half-fill"></i>
                        </span>
                      </div>
                      <div className="ltr:float-right rtl:float-left text-[0.75rem] font-semibold text-[#8c9097] dark:text-white/50 text-end">
                        <span>16 hrs ago</span>
                        <span className="block font-normal text-[0.75rem] text-success">
                          <i>Jhonson Smith</i>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide className="rtl:dir-rtl">
                <div className="box testimonial-card">
                  <div className="box-body">
                    <div className="flex items-center mb-4">
                      <div>
                        <p className="mb-0 font-semibold text-[0.875rem]">
                          Dwayne Stort
                        </p>
                        <p className="mb-0 text-[0.625rem] font-semibold text-[#8c9097] dark:text-white/50">
                          CEO ARMEDILLO
                        </p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <span className="text-[#8c9097] dark:text-white/50">
                        - Lorem ipsum dolor sit amet consectetur adipisicing
                        elit. Earum autem quaerat distinctio --
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-[#8c9097] dark:text-white/50">
                          Rating :{" "}
                        </span>
                        <span className="text-warning block ms-1">
                          <i className="ri-star-fill"></i>
                          <i className="ri-star-fill"></i>
                          <i className="ri-star-fill"></i>
                          <i className="ri-star-fill"></i>
                          <i className="ri-star-line"></i>
                        </span>
                      </div>
                      <div className="ltr:float-right rtl:float-left text-[0.75rem] font-semibold text-[#8c9097] dark:text-white/50 text-end">
                        <span>22 days ago</span>
                        <span className="block font-normal text-[0.75rem] text-success">
                          <i>Dwayne Stort</i>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide className="rtl:dir-rtl">
                <div className="box testimonial-card">
                  <div className="box-body">
                    <div className="flex items-center mb-4">
                      <div>
                        <p className="mb-0 font-semibold text-[0.875rem]">
                          Jasmine Kova
                        </p>
                        <p className="mb-0 text-[0.625rem] font-semibold text-[#8c9097] dark:text-white/50">
                          AGGENT AMIO
                        </p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <span className="text-[#8c9097] dark:text-white/50">
                        - Lorem ipsum dolor sit amet consectetur adipisicing
                        elit. Earum autem quaerat distinctio --
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-[#8c9097] dark:text-white/50">
                          Rating :{" "}
                        </span>
                        <span className="text-warning block ms-1">
                          <i className="ri-star-fill"></i>
                          <i className="ri-star-fill"></i>
                          <i className="ri-star-fill"></i>
                          <i className="ri-star-fill"></i>
                          <i className="ri-star-half-fill"></i>
                        </span>
                      </div>
                      <div className="ltr:float-right rtl:float-left text-[0.75rem] font-semibold text-[#8c9097] dark:text-white/50 text-end">
                        <span>26 days ago</span>
                        <span className="block font-normal text-[0.75rem] text-success">
                          <i>Jasmine Kova</i>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide className="rtl:dir-rtl">
                <div className="box testimonial-card">
                  <div className="box-body">
                    <div className="flex items-center mb-4">
                      <div>
                        <p className="mb-0 font-semibold text-[0.875rem]">
                          Dolph MR
                        </p>
                        <p className="mb-0 text-[0.625rem] font-semibold text-[#8c9097] dark:text-white/50">
                          CEO MR BRAND
                        </p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <span className="text-[#8c9097] dark:text-white/50">
                        - Lorem ipsum dolor sit amet consectetur adipisicing
                        elit. Earum autem quaerat distinctio --
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-[#8c9097] dark:text-white/50">
                          Rating :{" "}
                        </span>
                        <span className="text-warning block ms-1">
                          <i className="ri-star-fill"></i>
                          <i className="ri-star-fill"></i>
                          <i className="ri-star-fill"></i>
                          <i className="ri-star-fill"></i>
                          <i className="ri-star-fill"></i>
                        </span>
                      </div>
                      <div className="ltr:float-right rtl:float-left text-[0.75rem] font-semibold text-[#8c9097] dark:text-white/50 text-end">
                        <span>1 month ago</span>
                        <span className="block font-normal text-[0.75rem] text-success">
                          <i>Dolph MR</i>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide className="rtl:dir-rtl">
                <div className="box testimonial-card">
                  <div className="box-body">
                    <div className="flex items-center mb-4">
                      <div>
                        <p className="mb-0 font-semibold text-[0.875rem]">
                          Brenda Simpson
                        </p>
                        <p className="mb-0 text-[0.625rem] font-semibold text-[#8c9097] dark:text-white/50">
                          CEO AIBMO
                        </p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <span className="text-[#8c9097] dark:text-white/50">
                        - Lorem ipsum dolor sit amet consectetur adipisicing
                        elit. Earum autem quaerat distinctio --
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-[#8c9097] dark:text-white/50">
                          Rating :{" "}
                        </span>
                        <span className="text-warning block ms-1">
                          <i className="ri-star-fill"></i>
                          <i className="ri-star-fill"></i>
                          <i className="ri-star-fill"></i>
                          <i className="ri-star-fill"></i>
                          <i className="ri-star-half-fill"></i>
                        </span>
                      </div>
                      <div className="ltr:float-right rtl:float-left text-[0.75rem] font-semibold text-[#8c9097] dark:text-white/50 text-end">
                        <span>1 month ago</span>
                        <span className="block font-normal text-[0.75rem] text-success">
                          <i>Brenda Simpson</i>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide className="rtl:dir-rtl">
                <div className="box testimonial-card">
                  <div className="box-body">
                    <div className="flex items-center mb-4">
                      <div>
                        <p className="mb-0 font-semibold text-[0.875rem]">
                          Julia Sams
                        </p>
                        <p className="mb-0 text-[0.625rem] font-semibold text-[#8c9097] dark:text-white/50">
                          CHIEF SECRETARY BHOL
                        </p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <span className="text-[#8c9097] dark:text-white/50">
                        - Lorem ipsum dolor sit amet consectetur adipisicing
                        elit. Earum autem quaerat distinctio --
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-[#8c9097] dark:text-white/50">
                          Rating :{" "}
                        </span>
                        <span className="text-warning block ms-1">
                          <i className="ri-star-fill"></i>
                          <i className="ri-star-fill"></i>
                          <i className="ri-star-fill"></i>
                          <i className="ri-star-fill"></i>
                          <i className="ri-star-fill"></i>
                        </span>
                      </div>
                      <div className="ltr:float-right rtl:float-left text-[0.75rem] font-semibold text-[#8c9097] dark:text-white/50 text-end">
                        <span>2 month ago</span>
                        <span className="block font-normal text-[0.75rem] text-success">
                          <i>Julia Sams</i>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </section>
        <br />
        <br />
        <br />
      </div>
    </Fragment>
  );
};
const mapStateToProps = (state: any) => ({
  local_varaiable: state
});

export default connect(mapStateToProps, { ThemeChanger })(Jobslanding);
// export default Jobslanding;

import { FC, Fragment } from "react";

import gradientDark from "../../../assets/images/menu-bg-images/layered-peaks-haikei-dark.svg";
import gradientLight from "../../../assets/images/menu-bg-images/layered-peaks-haikei-light.svg";
import { Link } from "react-router-dom";

const Footer: FC = () => (
  <Fragment>
    <div className="relative">
      {/* Gradient Background */}
      <img
        src={gradientLight}
        alt="Gradient Background Light"
        className="absolute bottom-0 left-0 w-full h-auto dark:hidden z-[-1]"
      />
      <img
        src={gradientDark}
        alt="Gradient Background Dark"
        className="absolute bottom-0 left-0 w-full h-auto hidden dark:block z-[-1]"
      />

      {/* Footer Content */}
      <footer className="footer font-normal font-Opsilon !bg-white text-defaultsize leading-normal text-[0.813] shadow-[0_0_0.4rem_rgba(0,0,0,0.1)] dark:!bg-bodybg py-8 rounded-[2rem] border-t-4 border-t-primary mt-[3rem] mx-4 mb-4 relative z-10">
        <div className="container mx-auto px-8">
          <div className="footer-content grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <div className="footer-column">
              <div className="brand-name">
                <span className="footer-brand-name-art dark:text-[#AD0C48] text-[#9A110A]">
                  АРТ
                </span>
                <span className="footer-brand-name-compass">КОМПАС</span>
              </div>
              <ul className="footer-links">
                <li>НОИТ 2025</li>
                <li>Калоян Костадинов</li>
                <li>Мария Малчева</li>
                <li>
                  <a
                    href="https://pgi-pernik.bg-schools.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ПГИ Перник
                  </a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h3 className="footer-title !text-[1.25rem] !max-sm:text-[1.1rem]">
                Бързи Връзки
              </h3>
              <ul className="footer-links">
                <li>
                  <Link to="/app/recommendations">Нови Препоръки</Link>
                </li>
                <li>
                  <Link to="/app/aiAnalysator">AI Анализатор</Link>
                </li>
                <li>
                  <Link to="/app/saveLists/movies_series">
                    Списък за гледане
                  </Link>
                </li>
                <li>
                  <Link to="/app/saveLists/books">Списък за четене</Link>
                </li>
                <li>
                  <Link to="/app/individualStats/movies_series">
                    Индивидуални статистики
                  </Link>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h3 className="footer-title !text-[1.25rem] !max-sm:text-[1.1rem]">
                Източници
              </h3>
              <ul className="footer-links">
                <li>
                  <a
                    href="https://platform.openai.com/docs/overview"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="space-x-1">
                      <i className="ti ti-brand-openai text-lg sm:text-xs"></i>
                      <span>OpenAI API</span>
                    </div>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.omdbapi.com/#top"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="space-x-1">
                      <i className="ti ti-api text-lg sm:text-xs"></i>
                      <span>Gemini API</span>
                    </div>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.omdbapi.com/#top"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="space-x-1">
                      <i className="ti ti-api text-lg sm:text-xs"></i>
                      <span>OMDb API</span>
                    </div>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.omdbapi.com/#top"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="space-x-1">
                      <i className="ti ti-brand-google text-lg sm:text-xs"></i>
                      <span>Google Books API</span>
                    </div>
                  </a>
                </li>
                <li>
                  <a
                    href="https://developers.google.com/custom-search/v1/introduction"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="space-x-1">
                      <i className="ti ti-world-search text-lg sm:text-xs"></i>
                      <span>Google Custom Search JSON API</span>
                    </div>
                  </a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h3 className="footer-title !text-[1.25rem] !max-sm:text-[1.1rem]">
                Използвани технологии
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 auto-rows-min footer-links">
                <div className="flex items-center space-x-2 md:ml-[2rem]">
                  <i className="ti ti-brand-python text-xs"></i>
                  <span className="whitespace-nowrap">Python</span>
                </div>
                <div className="flex items-center space-x-2 md:ml-[2rem]">
                  <i className="ti ti-brand-react text-lg sm:text-xs"></i>
                  <span className="whitespace-nowrap">React</span>
                </div>
                <div className="flex items-center space-x-[0.40rem] md:ml-[2rem]">
                  <i className="ti ti-brand-tailwind text-lg sm:text-xs"></i>
                  <span className="whitespace-nowrap">Tailwind CSS</span>
                </div>
                <div className="flex items-center space-x-2 md:ml-[2rem]">
                  <i className="ti ti-brand-typescript text-lg sm:text-xs"></i>
                  <span className="whitespace-nowrap">TypeScript</span>
                </div>
                <div className="flex items-center space-x-2 md:ml-[2rem]">
                  <i className="ti ti-brand-nodejs text-lg sm:text-xs"></i>
                  <span className="whitespace-nowrap">NodeJS</span>
                </div>
                <div className="flex items-center space-x-2 md:ml-[2rem]">
                  <i className="ti ti-brand-vite text-lg sm:text-xs"></i>
                  <span className="whitespace-nowrap">Vite</span>
                </div>
                <div className="flex items-center space-x-2 md:ml-[2rem]">
                  <i className="ti ti-brand-javascript text-lg sm:text-xs"></i>
                  <span className="whitespace-nowrap">Express JS</span>
                </div>
                <div className="flex items-center space-x-2 md:ml-[2rem]">
                  <i className="ti ti-database text-lg sm:text-xs"></i>
                  <span className="whitespace-nowrap">MySQL</span>
                </div>
                <div className="flex items-center space-x-2 md:ml-[2rem]">
                  <i className="ti ti-brand-adobe text-lg sm:text-xs"></i>
                  <span className="whitespace-nowrap">Apex Charts</span>
                </div>
                <div className="flex items-center space-x-2 md:ml-[2rem]">
                  <i className="ti ti-lock-open text-lg sm:text-xs"></i>
                  <span className="whitespace-nowrap">JWT</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </Fragment>
);

export default Footer;

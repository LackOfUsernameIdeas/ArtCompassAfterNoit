import { FC, Fragment } from "react";

import gradientDark from "../../../assets/images/menu-bg-images/layered-peaks-haikei-dark.svg";
import gradientLight from "../../../assets/images/menu-bg-images/layered-peaks-haikei-light.svg";
import techStack from "../../../assets/images/brand-logos/tech_stack.png";

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
      <footer className="footer font-normal font-Opsilon bg-white text-defaultsize leading-normal text-[0.813] shadow-[0_0_0.4rem_rgba(0,0,0,0.1)] dark:bg-bodybg py-8 rounded-[2rem] border-t-4 border-t-primary mt-[3rem] mx-4 mb-4 relative z-10">
        <div className="container mx-auto px-8">
          <div className="footer-content grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <div className="footer-column">
              <div className="brand-name">
                <span className="footer-brand-name-art dark:text-[#610000] text-[#AF0B48]">
                  АРТ
                </span>
                <span className="footer-brand-name-compass">КОМПАС</span>
              </div>
              <ul className="footer-links">
                <li>НЕТИТ „Джон Атанасов” 2024</li>
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
              <h3 className="footer-title">Бързи Връзки</h3>
              <ul className="footer-links">
                <li>
                  <a href="/app/recommendations">Нови Препоръки</a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h3 className="footer-title">Източници</h3>
              <ul className="footer-links">
                <li>
                  <a
                    href="https://platform.openai.com/docs/overview"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    OpenAI API
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.omdbapi.com/#top"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    OMDb API
                  </a>
                </li>
                <li>
                  <a
                    href="https://developers.google.com/custom-search/v1/introduction"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Google Custom Search JSON API
                  </a>
                </li>
              </ul>
            </div>

            <div className="footer-column tech-stack">
              <img
                src={techStack}
                alt="Основни технологии"
                className="tech-stack-image"
              />
            </div>
          </div>
        </div>
      </footer>
    </div>
  </Fragment>
);

export default Footer;

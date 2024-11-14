import { FC, Fragment } from "react";

const Footer: FC = () => (
  <Fragment>
    <footer className="footer font-normal font-inter bg-white text-defaultsize leading-normal text-[0.813] shadow-[0_0_0.4rem_rgba(0,0,0,0.1)] dark:bg-bodybg py-8 rounded-[2rem] border-t-4 border-t-primary mt-auto mx-4 mb-4">
      <div className="container mx-auto px-8">
        <div className="footer-content grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div className="footer-column">
            <div className="brand-name">
              <span className="brand-name-cine">Кино </span>
              <span className="brand-name-compass">Компас</span>
            </div>
            <ul className="footer-links">
              <li>
                <a href="https://edusoft.fmi.uni-sofia.bg/" target="_blank">
                  НОИТ 2025
                </a>
              </li>
              <li>Калоян Костадинов</li>
              <li>Мария Малчева</li>
              <li>
                <a href="https://pgi-pernik.bg-schools.com/" target="_blank">
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
                >
                  OpenAI API
                </a>
              </li>
              <li>
                <a href="https://www.omdbapi.com/#top" target="_blank">
                  OMDb API
                </a>
              </li>
              <li>
                <a
                  href="https://developers.google.com/custom-search/v1/introduction"
                  target="_blank"
                >
                  Google Custom Search JSON API
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-column tech-stack">
            <img
              src="path/to/your/techStackImage.jpg"
              alt="Tech Stack"
              className="tech-stack-image"
            />
          </div>
        </div>
      </div>
    </footer>
  </Fragment>
);

export default Footer;

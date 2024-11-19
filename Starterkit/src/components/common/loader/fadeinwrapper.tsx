import React, { useEffect, useState, ReactNode } from "react";
import { CSSTransition } from "react-transition-group";
import { useLocation } from "react-router-dom";
import LogoLoader from "../../../assets/images/brand-logos/logo_loader.png";

interface FadeInWrapperProps {
  children: ReactNode;
}

const FadeInWrapper: React.FC<FadeInWrapperProps> = ({ children }) => {
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true); // Track if it's the first load
  const location = useLocation();

  useEffect(() => {
    if (isFirstLoad) {
      const delay = 100; // Delay before showing content
      const timeoutId = setTimeout(() => {
        setIsPageLoaded(true);
        setIsFirstLoad(false); // Mark as no longer first load
      }, delay);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [location.key]);

  return (
    <>
      {/* Loader with "fade" class transition */}
      <CSSTransition
        in={!isPageLoaded}
        timeout={600} // Match CSS transition duration
        classNames="fade"
        unmountOnExit
      >
        <div className="fixed inset-0 flex flex-col items-center justify-center space-y-4">
          <img src={LogoLoader} alt="loading" className="spinner" />
          <p className="text-xl">Зареждане...</p>
        </div>
      </CSSTransition>

      {/* Children with "fade-no-transform" class transition */}
      <CSSTransition
        in={isPageLoaded}
        timeout={600} // Match CSS transition duration
        classNames="fade-no-transform"
        unmountOnExit
      >
        <div>{children}</div>
      </CSSTransition>
    </>
  );
};

export default FadeInWrapper;

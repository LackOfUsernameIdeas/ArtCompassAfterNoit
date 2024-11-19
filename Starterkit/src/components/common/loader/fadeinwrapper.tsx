import React, { useEffect, useState, ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { Transition } from "react-transition-group"; // Import CSSTransition from 'react-transition-group'
import LogoLoader from "../../../assets/images/brand-logos/logo_loader.png";

interface FadeInWrapperProps {
  children: ReactNode;
}

const FadeInWrapper: React.FC<FadeInWrapperProps> = ({ children }) => {
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true); // Track if it's the first load
  const location = useLocation();

  useEffect(() => {
    // Simulate initial page load only
    if (isFirstLoad) {
      const delay = 100; // Slightly longer delay to avoid abrupt visibility
      const timeoutId = setTimeout(() => {
        setIsPageLoaded(true);
        setIsFirstLoad(false); // After the first load, don't trigger again
      }, delay);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [location.key]); // Run effect only once during the first load

  const duration = 100; // Smooth transition duration in milliseconds
  const defaultStyle = {
    opacity: 0,
    transform: "translateY(10px)", // Subtle vertical movement for smoothness
    transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`
  };

  const transitionStyles: { [state: string]: React.CSSProperties } = {
    entering: { opacity: 0, transform: "translateY(10px)" },
    entered: { opacity: 1, transform: "translateY(0)" },
    exiting: { opacity: 0, transform: "translateY(10px)" },
    exited: { opacity: 0, transform: "translateY(10px)" }
  };

  return (
    <>
      {/* Circle loader while the page is loading */}
      <Transition
        in={!isPageLoaded}
        timeout={duration}
        classNames="fade"
        unmountOnExit
      >
        <div className="fixed inset-0 flex flex-col items-center justify-center space-y-4">
          <img src={LogoLoader} alt="loading" className="spinner" />
          <p className="text-xl">Зареждане...</p>
        </div>
      </Transition>
      <Transition in={isPageLoaded} timeout={duration}>
        {(state) => (
          <div
            style={{
              ...defaultStyle,
              ...transitionStyles[state]
            }}
          >
            {children}
          </div>
        )}
      </Transition>
    </>
  );
};

export default FadeInWrapper;

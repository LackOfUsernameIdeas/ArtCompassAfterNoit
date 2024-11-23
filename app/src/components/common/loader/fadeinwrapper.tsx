import React, { useEffect, useState, ReactNode } from "react";
import { CSSTransition } from "react-transition-group";
import { useLocation } from "react-router-dom";

interface FadeInWrapperProps {
  children: ReactNode;
}

const FadeInWrapper: React.FC<FadeInWrapperProps> = ({ children }) => {
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Simulating the page load delay with a setTimeout
    const delay = 1;
    const timeoutId = setTimeout(() => {
      setIsPageLoaded(true);
    }, delay);

    // Clear the timeout on component unmount
    return () => clearTimeout(timeoutId);
  }, [location.key]); // Trigger effect on route change

  return (
    <CSSTransition
      in={isPageLoaded}
      timeout={600} // Match CSS transition duration
      classNames="fade"
      unmountOnExit
    >
      <div>{children}</div>
    </CSSTransition>
  );
};

export default FadeInWrapper;

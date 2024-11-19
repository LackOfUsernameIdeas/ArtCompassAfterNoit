import React, { useEffect, useState, ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { Transition } from "react-transition-group";

interface FadeInWrapperProps {
  children: ReactNode;
}

const FadeInWrapper: React.FC<FadeInWrapperProps> = ({ children }) => {
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Simulating the page load delay with a setTimeout
    const delay = 100; // Slightly longer delay to avoid abrupt visibility
    const timeoutId = setTimeout(() => {
      setIsPageLoaded(true);
    }, delay);

    // Clear the timeout on component unmount
    return () => {
      clearTimeout(timeoutId);
      setIsPageLoaded(false); // Reset state for the next transition
    };
  }, [location.key]); // Trigger effect on route change

  const duration = 500; // Smooth transition duration in milliseconds
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
  );
};

export default FadeInWrapper;

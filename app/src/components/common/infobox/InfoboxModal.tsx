import { type FC, useEffect, useState } from "react";
import { CSSTransition } from "react-transition-group";

interface InfoboxModalProps {
  onClick: () => void;
  isModalOpen: boolean;
  title: string | JSX.Element;
  description: string | JSX.Element;
}
export const InfoboxModal: FC<InfoboxModalProps> = ({
  onClick,
  isModalOpen,
  title,
  description
}) => {
  const [animationState, setAnimationState] = useState({
    opacity: 0,
    transform: "scale(0.9)"
  });

  useEffect(() => {
    if (isModalOpen) {
      setAnimationState({ opacity: 1, transform: "scale(1)" });
    } else {
      setAnimationState({ opacity: 0, transform: "scale(0.9)" });
    }
  }, [isModalOpen]);

  return (
    <CSSTransition
      in={isModalOpen}
      timeout={300}
      classNames="modal"
      unmountOnExit
    >
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="fixed inset-0 bg-black bg-opacity-70 z-40"></div>
        <div
          className="plot-modal relative z-[10000]"
          style={{
            ...animationState,
            transition: "opacity 300ms, transform 300ms"
          }}
        >
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm">{description}</p>
          <div className="flex justify-end">
            <button
              onClick={onClick}
              className="bg-primary hover:bg-primary/90 text-white font-medium rounded-lg px-5 py-2.5 text-center transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </CSSTransition>
  );
};

import { FC, useState, useEffect } from "react";
import { CSSTransition } from "react-transition-group";
import { PlotModalProps } from "../readlist-types";

// Компонент за модал, който показва пълен сюжет
export const PlotModal: FC<PlotModalProps> = ({ isOpen, onClose, plot }) => {
  // Състояние за анимацията на модала (непрозрачност и скалиране)
  const [animationState, setAnimationState] = useState({
    opacity: 0,
    transform: "scale(0.9)"
  });

  // useEffect, за да променяме анимацията в зависимост от състоянието на модала
  useEffect(() => {
    if (isOpen) {
      setAnimationState({ opacity: 1, transform: "scale(1)" });
    } else {
      setAnimationState({ opacity: 0, transform: "scale(0.9)" });
    }
  }, [isOpen]); // Извикваме ефекта при промяна на isOpen

  return (
    // Използваме CSSTransition за плавно показване и скриване на модала
    <CSSTransition in={isOpen} timeout={300} classNames="modal" unmountOnExit>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        {/* Затъмняване на фона, когато модалът е отворен */}
        <div className="fixed inset-0 bg-black bg-opacity-70 z-40"></div>
        <div
          className="modal m-4 sm:m-0"
          style={{
            ...animationState,
            transition: "opacity 300ms, transform 300ms"
          }}
        >
          <h2 className="text-lg font-semibold">Пълен сюжет</h2>
          <p className="text-sm">{plot}</p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose} // Затваря модала
              className="bg-primary text-white rounded-lg px-4 py-2 hover:bg-secondary transform transition-transform duration-200 hover:scale-105"
            >
              Затвори
            </button>
          </div>
        </div>
      </div>
    </CSSTransition>
  );
};

import { FC } from "react";
import { CSSTransition } from "react-transition-group";
import logo_loader from "../../../assets/images/brand-logos/logo_loader.png";

interface LoaderProps {
  brainAnalysis?: boolean;
}

const Loader: FC<LoaderProps> = ({ brainAnalysis = false }) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center space-y-4 text-center">
      {brainAnalysis ? (
        <CSSTransition in={true} appear timeout={300} unmountOnExit>
          <div className="flex flex-col items-center justify-center space-y-4">
            <img src={logo_loader} alt="loading" className="fade-loop" />
            <p className="text-xl">Изчакване на връзка с устройството...</p>
          </div>
        </CSSTransition>
      ) : (
        <>
          <img src={logo_loader} alt="loading" className="spinner" />
          <p className="text-xl">Зареждане...</p>
        </>
      )}
    </div>
  );
};

export default Loader;

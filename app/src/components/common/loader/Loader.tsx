import { FC } from "react";
import { CSSTransition } from "react-transition-group";
import logo_loader from "../../../assets/images/brand-logos/logo_loader.png";

interface LoaderProps {
  loading: boolean;
}

const Loader: FC<LoaderProps> = ({ loading }) => {
  return (
    <CSSTransition
      in={loading}
      timeout={500}
      classNames="fade"
      unmountOnExit
      key="loading"
    >
      <div className="fixed inset-0 flex flex-col items-center justify-center space-y-4">
        <img src={logo_loader} alt="loading" className="spinner" />
        <p className="text-xl">Зареждане...</p>
      </div>
    </CSSTransition>
  );
};

export default Loader;

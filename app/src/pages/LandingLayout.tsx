import { Fragment, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../redux/store";
import Landingswitcher from "../components/common/switcher/landingswitcher";
import Footer from "@/components/common/footer/footer";

function Landinglayout() {
  const [MyclassName, setMyClass] = useState("");

  useEffect(() => {
    import("preline");
  }, []);

  const Bodyclickk = () => {
    if (localStorage.getItem("artverticalstyles") == "icontext") {
      setMyClass("");
    }
    if (window.innerWidth > 992) {
      let html = document.documentElement;
      if (html.getAttribute("icon-overlay") === "open") {
        html.setAttribute("icon-overlay", "");
      }
    }
  };

  return (
    <Fragment>
      <Provider store={store}>
        <Landingswitcher />
        <div className="page">
          <div className="content main-index">
            <div className="main-content" onClick={Bodyclickk}>
              <Outlet />
            </div>
          </div>
          <Footer />
        </div>
      </Provider>
    </Fragment>
  );
}

export default Landinglayout;

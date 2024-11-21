import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import App from "./pages/App.tsx";
import Signincover from "./container/authentication/signin/Signin.tsx";
import Authenticationlayout from "./pages/AuthenticationRoute.tsx";
import Resetcover from "./container/authentication/resetpassword/Resetpassword.tsx";
import Signupcover from "./container/authentication/signup/Signup.tsx";
import Twostepcover from "./container/authentication/twostepverification/Twostepverification.tsx";
import Test from "./container/recommendations/recommendations.tsx";
import "./index.scss";
import ResetRequest from "./container/authentication/resetpassword/Resetrequest.tsx";
import PrivateRoute from "./pages/PrivateRoute.tsx";
import Home from "./container/home/Home.tsx";
import Contact from "./container/contact/Contact.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.Fragment>
    <BrowserRouter>
      <React.Suspense fallback={<div>Зареждане...</div>}>
        <Routes>
          <Route path="/" element={<Navigate to="/signin" />} />
          <Route
            path="/app"
            element={
              <PrivateRoute>
                <App />
              </PrivateRoute>
            }
          >
            {/* Default route */}
            <Route path="" element={<Navigate to="home" />} />
            <Route path="home" element={<Home />} />
            <Route path="recommendations" element={<Test />} />
            <Route path="contact" element={<Contact />} />
          </Route>

          <Route path="/" element={<Authenticationlayout />}>
            <Route
              path="resetpassword/resetcover/:token"
              element={<Resetcover />}
            />
            <Route path="resetpassword" element={<ResetRequest />} />
            <Route path="signup" element={<Signupcover />} />
            <Route path="signin" element={<Signincover />} />
            <Route path="twostepverification" element={<Twostepcover />} />
          </Route>
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  </React.Fragment>
);

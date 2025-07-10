import reducer, { reducerLanding } from "./reducer";
import thunk from "redux-thunk";
import { configureStore } from "@reduxjs/toolkit";
import { Middleware } from "redux";

const middleware: Middleware[] = [thunk];

export const storeLanding = configureStore({
  reducer: reducerLanding,
  middleware: middleware
});

export default configureStore({ reducer: reducer, middleware: middleware });

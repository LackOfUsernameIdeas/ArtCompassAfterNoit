import reducer from "./reducer";
import thunk from "redux-thunk";
import { configureStore } from "@reduxjs/toolkit";
import { Middleware } from "redux";

const middleware: Middleware[] = [thunk];

const store = configureStore({
  reducer: reducer,
  middleware: middleware
});

export default store;

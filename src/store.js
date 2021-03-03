import { createStore, compose, applyMiddleware } from "redux";
import indexReducers from "./reducers";

const store = createStore(
  indexReducers,
  {},
  compose(
    ...(window.__REDUX_DEVTOOLS_EXTENSION__
      ? [window.__REDUX_DEVTOOLS_EXTENSION__()]
      : [])
  )
);

export default store;

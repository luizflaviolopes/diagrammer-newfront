import { createStore, compose, applyMiddleware } from "redux";
import actionSenderMiddleware from "./middlewares/actionSenderMiddleware";
import indexReducers from "./stateManipulators/reducers";

const store = createStore(
  indexReducers,
  {},
  compose(
    applyMiddleware(actionSenderMiddleware),
    ...(window.__REDUX_DEVTOOLS_EXTENSION__
      ? [window.__REDUX_DEVTOOLS_EXTENSION__()]
      : [])
  )
);
export default store;

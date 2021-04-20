import { createStore, compose, applyMiddleware } from "redux";
import PersistActionMiddleware from "./middlewares/PersistActionMiddleware";
import indexReducers from "./reducers";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  indexReducers,
  {},
  composeEnhancers(applyMiddleware(PersistActionMiddleware))
);

export default store;

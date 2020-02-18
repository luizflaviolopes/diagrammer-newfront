import { createStore } from "redux";
import indexStore from "./reducers";

const store = createStore(
  indexStore,
  {},
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;

import { combineReducers } from "redux";
import boardView from "./boardView";
import elements from "./elements";
import serverConnection from "./serverConnection";
import context from "./context";

export default combineReducers({
  boardView,
  elements,
  serverConnection,
});

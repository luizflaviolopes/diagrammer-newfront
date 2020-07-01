import { combineReducers } from "redux";
import boardView from "./boardView";
import elements from "./elements";
import serverConnection from "./serverConnection";

export default combineReducers({
  boardView,
  elements,
  serverConnection,
});

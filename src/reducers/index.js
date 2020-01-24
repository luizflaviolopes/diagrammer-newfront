import { combineReducers } from "redux";
import boardView from "./boardView";
import elements from "./elements";

export default combineReducers({
  boardView,
  elements
});

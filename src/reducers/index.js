import { combineReducers } from "redux";
import boardView from "./boardView";
import elements from "./elements";
import toolboxElements from "./toolboxElements";

export default combineReducers({
  boardView,
  elements,
  toolboxElements
});

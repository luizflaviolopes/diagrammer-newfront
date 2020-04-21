import { combineReducers } from "redux";
import boardView from "./boardView";
import elements from "./elements";
import tabDrawList from "./tabDrawList";

export default combineReducers({
  boardView,
  elements,
  tabDrawList,
});

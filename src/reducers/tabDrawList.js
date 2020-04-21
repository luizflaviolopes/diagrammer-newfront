import { DRAWLIST_CHANGE_SELECTED } from "../types/actionTypes";

const setState = () => ({
  elementSelected: "DRAW_RECTANGLE",
});

export default (state = setState(), action = {}) => {
  switch (action.type) {
    case DRAWLIST_CHANGE_SELECTED:
      const newState = { ...state };
      newState.elementSelected = action.payload.selected;
      return newState;
    default:
      return state;
  }
};

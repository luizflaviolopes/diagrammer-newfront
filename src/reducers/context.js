import * as actionTypes from "../types/actionTypes";
import * as boardViewResolver from "../resolvers/boardViewResolver";
import { getPositionBoardRelative } from "../helpers/getPositionBoardRelative";

const setState = () => ({
  selectedDraws: [],
  dragging: false,
  connectorDrawing: false,
});

export default (state = setState(), action = {}) => {
  switch (action.type) {
    case actionTypes.BOARD_SELECT_DRAW:
      return selectDraw({ ...state }, action.payload);
    case actionTypes.BOARD_DRAGGING_ELEMENTS:
      return dragging({ ...state }, action.payload);
    case actionTypes.BOARD_DROP_ELEMENTS:
      return drop({ ...state }, action.payload);
    case actionTypes.BOARD_SELECTION_CLEAR:
      const NS = { ...state };
      NS.selectedDraws = [];
      return NS;
    default:
      return state;
  }
};

const selectDraw = (state, actionPayload) => {
  if (actionPayload.shiftPressed) {
    state.selectedDraws = [...state.selectedDraws, +actionPayload.id];
  } else {
    state.selectedDraws = [+actionPayload.id];
  }
  state.dragging = true;
  return state;
};

const dragging = (state, actionPayload) => {
  actionPayload.selectedDraws = state.selectedDraws;

  return state;
};

const drop = (state, actionPayload) => {
  actionPayload.selectedDraws = state.selectedDraws;
  state.dragging = false;
  return state;
};

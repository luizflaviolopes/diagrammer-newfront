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
      const newState = { ...state };
      newState.selectedDraws = [];
      return newState;
    case actionTypes.BOARD_DRAW_START_RESIZE:
      return startResize({ ...state }, action.payload);
    case actionTypes.BOARD_DRAW_RESIZE:
      return resizing({ ...state }, action.payload);
    case actionTypes.BOARD_DRAW_STOP_RESIZE:
      return endResize({ ...state }, action.payload);

    case actionTypes.BOARD_CONNECTOR_DRAWING_START:
      return { ...state, connectorDrawing: true };
    case actionTypes.BOARD_CONNECTOR_DRAWING_END:
      return { ...state, connectorDrawing: false };
    default:
      return state;
  }
};

const calculateDisplacementAndSetLastPosition = (state, actionPayload) => {
  actionPayload.displacement = {
    x: actionPayload.mousePosition.x - state.lastPosition.x,
    y: actionPayload.mousePosition.y - state.lastPosition.y,
  };
  state.lastPosition = actionPayload.mousePosition;
};

const startResize = (state, actionPayload) => {
  state.lastPosition = actionPayload.mousePosition;
  state.startPosition = actionPayload.mousePosition;
  return state;
};

const resizing = (state, actionPayload) => {
  calculateDisplacementAndSetLastPosition(state, actionPayload);
  return state;
};

const endResize = (state, actionPayload) => {
  actionPayload.displacement = {
    x: actionPayload.mousePosition.x - state.startPosition.x,
    y: actionPayload.mousePosition.y - state.startPosition.y,
  };
  state.lastPosition = null;
  state.startPosition = null;
  return state;
};

const selectDraw = (state, actionPayload) => {
  if (actionPayload.shiftPressed) {
    if (!state.selectedDraws.includes(+actionPayload.id))
      state.selectedDraws = [...state.selectedDraws, +actionPayload.id];
  } else {
    state.selectedDraws = [+actionPayload.id];
  }
  state.lastPosition = actionPayload.mousePosition;
  state.startPosition = actionPayload.mousePosition;
  state.dragging = true;
  return state;
};

const dragging = (state, actionPayload) => {
  actionPayload.selectedDraws = state.selectedDraws;
  calculateDisplacementAndSetLastPosition(state, actionPayload);
  return state;
};

const drop = (state, actionPayload) => {
  actionPayload.selectedDraws = state.selectedDraws;
  state.dragging = false;

  actionPayload.displacement = {
    x: actionPayload.mousePosition.x - state.startPosition.x,
    y: actionPayload.mousePosition.y - state.startPosition.y,
  };
  state.lastPosition = null;
  state.startPosition = null;

  return state;
};

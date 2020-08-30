import * as actionTypes from "../types/actionTypes";
import * as boardViewResolver from "../resolvers/boardViewResolver";
import { getPositionBoardRelative } from "../helpers/getPositionBoardRelative";

const setState = () => ({
  selectedDraws: {},
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
      newState.selectedDraws = {};
      return newState;
    case actionTypes.BOARD_DRAW_START_RESIZE:
      return startResize({ ...state }, action.payload);
    case actionTypes.BOARD_DRAW_RESIZE:
      return resizing({ ...state }, action.payload);
    case actionTypes.BOARD_DRAW_STOP_RESIZE:
      return endResize({ ...state }, action.payload);

    case actionTypes.BOARD_CONNECTOR_DRAWING_START:
      return startConnectorDrawing({ ...state }, action.payload);
    case actionTypes.BOARD_CONNECTOR_DRAWING_END:
      return endConnectorDrawing({ ...state }, action.payload);
    default:
      return state;
  }
};

const calculateDisplacementAndSetLastPosition = (state, actionPayload) => {
  actionPayload.displacement = {
    x: actionPayload.positionRelative.x - state.lastPosition.x,
    y: actionPayload.positionRelative.y - state.lastPosition.y,
  };
  state.lastPosition = actionPayload.positionRelative;
};

const startResize = (state, actionPayload) => {
  state.lastPosition = actionPayload.positionRelative;
  state.startPosition = actionPayload.positionRelative;
  return state;
};

const resizing = (state, actionPayload) => {
  calculateDisplacementAndSetLastPosition(state, actionPayload);
  return state;
};

const endResize = (state, actionPayload) => {
  actionPayload.displacement = {
    x: actionPayload.positionRelative.x - state.startPosition.x,
    y: actionPayload.positionRelative.y - state.startPosition.y,
  };
  state.lastPosition = null;
  state.startPosition = null;
  return state;
};

const selectDraw = (state, actionPayload) => {
  if (actionPayload.shiftPressed) {
    if (!state.selectedDraws[actionPayload.id])
      state.selectedDraws[actionPayload.id] = {
        absolutePosition: actionPayload.clientRectPositionRelative,
      };
  } else {
    state.selectedDraws = {
      [actionPayload.id]: {
        absolutePosition: actionPayload.clientRectPositionRelative,
      },
    };
  }
  state.lastPosition = actionPayload.positionRelative;
  state.startPosition = actionPayload.positionRelative;
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

  actionPayload.completeDisplacement = {
    x: actionPayload.positionRelative.x - state.startPosition.x,
    y: actionPayload.positionRelative.y - state.startPosition.y,
  };
  state.lastPosition = null;
  state.startPosition = null;

  return state;
};

const startConnectorDrawing = (state, actionPayload) => {
  const idFrom = +actionPayload.id;

  const positionBoardRelative = actionPayload.positionRelative;

  let from = {
    id: idFrom,
    ...positionBoardRelative,
    angle: actionPayload.variant.angle,
  };

  actionPayload.connStartFrom = from;
  state.connStartFrom = from;

  return { ...state, connectorDrawing: true };
};

const endConnectorDrawing = (state, actionPayload) => {
  if (actionPayload) {
    const idTo = +actionPayload.id;

    const positionBoardRelative = actionPayload.positionRelative;

    let to = {
      id: idTo,
      ...positionBoardRelative,
      angle: actionPayload.variants.angle,
    };

    actionPayload.connStartFrom = state.connStartFrom;
    actionPayload.connEndTo = to;

    state.connStartFrom = undefined;
  }

  return { ...state, connectorDrawing: true };
};

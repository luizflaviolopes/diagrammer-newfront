import * as types from "../types/actionTypes";

export const dragging = data => {
  return {
    type: types.BOARD_ELEMENT_DRAGGING,
    payload: data
  };
};

export const addElement = data => {
  return {
    type: types.BOARD_ELEMENT_ADD,
    payload: data
  };
};

export const connectorDrawing = data => {
  return {
    type: types.BOARD_CONNECTOR_DRAWING,
    payload: data
  };
};

export const connectorDrawingStart = data => {
  return {
    type: types.BOARD_CONNECTOR_DRAWING_START,
    payload: data
  };
};

export const connectorDrawingEnd = data => {
  return {
    type: types.BOARD_CONNECTOR_DRAWING_END,
    payload: data
  };
};

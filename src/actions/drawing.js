import * as types from "../types/actionTypes";

export const mouseDown = (data) => {
  return {
    type: types.BOARD_SELECT_DRAW,
    payload: data,
  };
};
export const dragging = (data) => {
  return {
    type: types.BOARD_DRAGGING_ELEMENTS,
    payload: data,
  };
};
export const drop = (data) => {
  return {
    type: types.BOARD_DROP_ELEMENTS,
    payload: data,
  };
};

export const addDraw = (data) => {
  return {
    type: types.BOARD_DRAW_ADD,
    payload: data,
  };
};

export const selectDraw = (data) => {
  return {
    type: types.BOARD_SELECT_DRAW,
    payload: data,
  };
};

export const clearSelection = (data) => {
  return {
    type: types.BOARD_SELECTION_CLEAR,
    payload: data,
  };
};

export const connectorDrawing = (data) => {
  return {
    type: types.BOARD_CONNECTOR_DRAWING,
    payload: data,
  };
};

export const connectorDrawingStart = (data) => {
  return {
    type: types.BOARD_CONNECTOR_DRAWING_START,
    payload: data,
  };
};

export const connectorDrawingEnd = (data) => {
  return {
    type: types.BOARD_CONNECTOR_DRAWING_END,
    payload: data,
  };
};

export const startResizeDraw = (data) => {
  return {
    type: types.BOARD_DRAW_START_RESIZE,
    payload: data,
  };
};

export const resizeDraw = (data) => {
  return {
    type: types.BOARD_DRAW_RESIZE,
    payload: data,
  };
};

export const stopResizeDraw = (data) => {
  return {
    type: types.BOARD_DRAW_STOP_RESIZE,
    payload: data,
  };
};

export const changeDrawText = (data) => {
  return {
    type: types.BOARD_DRAW_CHANGE_TEXT,
    payload: data,
  };
};

import * as types from "../types/actionTypes";

export const deletePressed = (data) => {
  return {
    type: types.BOARD_DELETE_PRESSED,
    payload: data,
  };
};

export const undo = (data) => {
  return {
    type: types.BOARD_UNDO,
    payload: data,
  };
};

export const redo = (data) => {
  return {
    type: types.BOARD_REDO,
    payload: data,
  };
};

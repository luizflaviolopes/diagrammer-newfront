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

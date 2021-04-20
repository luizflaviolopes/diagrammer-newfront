import * as types from "../types/actionTypes";

export const undo = () => {
  return {
    type: types.BOARD_UNDO,
  };
};
export const redo = () => {
  return {
    type: types.BOARD_REDO,
  };
};

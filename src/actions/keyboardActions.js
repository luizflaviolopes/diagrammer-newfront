import * as types from "../types/actionTypes";

export const deletePressed = data => {
  return {
    type: types.BOARD_DELETE_PRESSED,
    payload: data
  };
};

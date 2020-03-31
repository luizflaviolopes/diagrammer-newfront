import * as types from "../types/actionTypes";

export const selectConnector = data => {
  return {
    type: types.BOARD_SELECT_CONNECTOR,
    payload: data
  };
};

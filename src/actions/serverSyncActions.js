import * as types from "../types/actionTypes";

export const boardRebuildAction = (data) => {
  return {
    type: types.BOARD_REBUILD,
    payload: data,
  };
};

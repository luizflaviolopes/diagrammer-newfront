import * as types from "../types/actionTypes";

export const zoomAction = (data) => {
  return {
    type: types.BOARDVIEW_ZOOM,
    payload: data,
  };
};

export const moveAction = (data) => {
  return {
    type: types.BOARDVIEW_MOVE,
    payload: data,
  };
};

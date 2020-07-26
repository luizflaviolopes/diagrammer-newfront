import * as types from "../types/actionTypes";

export const zoomAction = (data) => {
  return {
    type: types.BOARDVIEW_ZOOM,
    payload: data,
  };
};

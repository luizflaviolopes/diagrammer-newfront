import { DRAWLIST_CHANGE_SELECTED } from "../types/actionTypes";

export const changeSelected = (data) => {
  return {
    type: DRAWLIST_CHANGE_SELECTED,
    payload: data,
  };
};

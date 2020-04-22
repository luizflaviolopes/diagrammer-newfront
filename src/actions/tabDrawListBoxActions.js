import {
  DRAWLIST_CHANGE_SELECTED,
  DRAWLIST_DRAG_BLOCK,
} from "../types/actionTypes";

export const changeSelected = (data) => {
  return {
    type: DRAWLIST_CHANGE_SELECTED,
    payload: data,
  };
};

export const dragBlock = (data) => {
  return {
    type: DRAWLIST_DRAG_BLOCK,
    payload: data,
  };
};

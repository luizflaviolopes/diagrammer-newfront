import {
  DRAWLIST_CHANGE_SELECTED,
  DRAWLIST_DRAG_BLOCK,
  DRAWLIST_DROP_BLOCK_OUT_OF_BOARD,
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

export const dropBlockOutOfBoard = (data) => {
  return {
    type: DRAWLIST_DROP_BLOCK_OUT_OF_BOARD,
    payload: data,
  };
};

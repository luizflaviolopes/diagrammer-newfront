import * as actionTypes from "../types/actionTypes";
import * as boardViewResolver from "../resolvers/boardViewResolver";

const setState = () => ({
  x: 0,
  y: 0,
  zoom: 1.5,
});

export default (state = setState(), action = {}) => {
  if (action.payload) action.payload.boardView = { ...state };

  switch (action.type) {
    case actionTypes.BOARDVIEW_ZOOM:
      return boardViewResolver.changeZoom({ ...state }, action.payload);
    default:
      return state;
  }
};

import * as actionTypes from "../types/actionTypes";
import * as boardViewResolver from "../resolvers/boardViewResolver";
import { getPositionBoardRelative } from "../helpers/getPositionBoardRelative";

const setState = () => ({
  x: 0,
  y: 0,
  zoom: 1,
});

export default (state = setState(), action = {}) => {
  if (action.payload && action.payload.mousePosition)
    action.payload.position = getPositionBoardRelative(
      state,
      action.payload.mousePosition
    );

  switch (action.type) {
    case actionTypes.BOARD_SELECT_DRAW:
    case actionTypes.BOARD_DRAW_START_RESIZE:
      return { ...state, dragStartPosition: action.payload.position };

    case actionTypes.BOARD_DRAGGING_ELEMENTS:
    case actionTypes.BOARD_DRAW_STOP_RESIZE:
    case actionTypes.BOARD_DROP_ELEMENTS:
      action.payload.displacement = {
        x: action.payload.position.x - state.dragStartPosition.x,
        y: action.payload.position.y - state.dragStartPosition.y,
      };
      return state;

    case actionTypes.BOARDVIEW_ZOOM:
      return boardViewResolver.changeZoom({ ...state }, action.payload);

    default:
      return state;
  }
};

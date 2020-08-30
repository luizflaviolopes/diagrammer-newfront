import * as actionTypes from "../types/actionTypes";
import * as boardViewResolver from "../resolvers/boardViewResolver";
import {
  getPositionBoardRelative,
  getDisplacementBoardRelative,
  getPointBoardRelative,
} from "../helpers/getPositionBoardRelative";

const setState = () => ({
  x: 0,
  y: 0,
  zoom: 1.5,
});

export default (state = setState(), action = {}) => {
  const injectDisplacementRelative = () => {
    action.payload.displacementRelative = getDisplacementBoardRelative(
      state,
      action.payload.displacement
    );
  };
  const injectPositionRelative = () => {
    action.payload.positionRelative = getPointBoardRelative(
      state,
      action.payload.mousePosition
    );
  };

  if (action.payload && action.payload.mousePosition) injectPositionRelative();

  switch (action.type) {
    case actionTypes.BOARD_DRAW_ADD:
      return state;
    case actionTypes.BOARD_SELECT_DRAW:
      selectDraw(state, action.payload);
      return state;
    case actionTypes.BOARD_DRAGGING_ELEMENTS:
    case actionTypes.BOARD_DROP_ELEMENTS:
      // injectDisplacementRelative();
      return state;

    case actionTypes.BOARD_DRAW_RESIZE:
    case actionTypes.BOARD_DRAW_STOP_RESIZE:
      injectDisplacementRelative();
      return state;

    case actionTypes.BOARD_CONNECTOR_DRAWING_START:
    case actionTypes.BOARD_CONNECTOR_DRAWING:
    case actionTypes.BOARD_CONNECTOR_DRAWING_END:
      return state;
    case actionTypes.BOARDVIEW_ZOOM:
      return boardViewResolver.changeZoom({ ...state }, action.payload);

    default:
      return state;
  }
};

const selectDraw = (state, payload) => {
  payload.clientRectPositionRelative = getPointBoardRelative(
    state,
    payload.clientRectPosition
  );
};

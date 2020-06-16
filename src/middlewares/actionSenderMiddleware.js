import * as types from "../types/actionTypes";

const actionSenderMiddleware = (store) => (next) => (action) => {
  switch (action.type) {
    case types.BOARD_SELECTION_CLEAR:
    case types.BOARD_SELECT_DRAW:
    case types.BOARD_CLEAR_HIGHLIGHT_DRAW_DRAGGING:
    case types.BOARD_DRAGGING_ELEMENTS:
    case types.BOARD_DROP_ELEMENTS:
    case types.BOARD_DRAW_ADD:
    case types.BOARD_DRAW_START_RESIZE:
    case types.BOARD_DRAW_RESIZE:
    case types.BOARD_CONNECTOR_DRAWING_START:
    case types.BOARD_CONNECTOR_DRAWING:
    case types.BOARD_CONNECTOR_DRAWING_END:
    //ConnectorActions
    case types.BOARD_SELECT_CONNECTOR:
    //KeyboardActions
    case types.BOARD_DELETE_PRESSED:
    //tabDrawList
    case types.DRAWLIST_CHANGE_SELECTED:
    case types.DRAWLIST_DRAG_BLOCK:
    case types.DRAWLIST_DROP_BLOCK_OUT_OF_BOARD:
      console.log(action.type);
      break;
  }

  return next(action);
};

export default actionSenderMiddleware;

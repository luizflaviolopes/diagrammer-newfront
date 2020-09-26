import * as types from "../types/actionTypes";
import syncController from "../comunication/boardSyncController";

const actionSenderMiddleware = (store) => (next) => (action) => {
  const nextResult = next(action);

  switch (action.type) {
    case types.SERVER_CONNECTION_READY:
    case types.SERVER_CONNECTION_BUSY:
    case types.SERVER_CONNECTION_DISCONNECTED:
    case types.DRAWLIST_CHANGE_SELECTED:
    case types.DRAWLIST_DRAG_BLOCK:
    case types.DRAWLIST_DROP_BLOCK_OUT_OF_BOARD:
    case types.BOARDVIEW_ZOOM:
    case types.BOARD_REBUILD:
    case types.BOARD_SELECTION_CLEAR:
      break;
    //DraggingActions
    case types.BOARD_SELECT_DRAW:
    case types.BOARD_DRAGGING_ELEMENTS:
    //ResizeActions
    case types.BOARD_DRAW_START_RESIZE:
    case types.BOARD_DRAW_RESIZE:
    //ConnectorActions
    case types.BOARD_CONNECTOR_DRAWING_START:
    case types.BOARD_CONNECTOR_DRAWING:
    //ConnectorActions
    case types.BOARD_SELECT_CONNECTOR:
      syncController.addAction(action);
      break;
    default:
      syncController.sendActions(action);
      break;
  }

  return nextResult;
};

export default actionSenderMiddleware;

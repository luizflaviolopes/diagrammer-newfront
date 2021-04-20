import boardSync from "../comunication/boardSyncController";
import * as actionTypes from "../types/actionTypes";
import { FinishAction } from "./../dataControllers/changeDataControl";

const PersistActionMiddleware = (storeAPI) => (next) => (action) => {
  let result = next(action);

  switch (action.type) {
    case actionTypes.BOARD_DROP_ELEMENTS:
    case actionTypes.BOARD_DRAW_ADD:
    case actionTypes.BOARD_DRAW_STOP_RESIZE:
    case actionTypes.BOARD_DRAW_CHANGE_TEXT:
      FinishAction(action.type);
      break;
    default:
      break;
  }

  return result;
};

export default PersistActionMiddleware;

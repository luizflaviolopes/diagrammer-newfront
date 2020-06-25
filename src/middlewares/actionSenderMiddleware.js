import * as types from "../types/actionTypes";
import syncController from "../boardSync/syncController";

const actionSenderMiddleware = (store) => (next) => (action) => {
  switch (action.type) {
    case types.SERVER_CONNECTION_READY:
    case types.SERVER_CONNECTION_BUSY:
    case types.SERVER_CONNECTION_DISCONNECTED:
      break;
    default:
      syncController.newAction(action);
      break;
  }

  return next(action);
};

export default actionSenderMiddleware;

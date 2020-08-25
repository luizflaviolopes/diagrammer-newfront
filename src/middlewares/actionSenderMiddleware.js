import * as types from "../types/actionTypes";
import syncController from "../comunication/boardSyncController";

const actionSenderMiddleware = (store) => (next) => (action) => {
  const nextResult = next(action);

  switch (action.type) {
    case types.SERVER_CONNECTION_READY:
    case types.SERVER_CONNECTION_BUSY:
    case types.SERVER_CONNECTION_DISCONNECTED:
      break;
    default:
      syncController.newAction(action);
      break;
  }

  return nextResult;
};

export default actionSenderMiddleware;

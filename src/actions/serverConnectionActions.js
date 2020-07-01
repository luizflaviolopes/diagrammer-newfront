import * as types from "../types/actionTypes";

export const connectionReady = (data) => {
  return {
    type: types.SERVER_CONNECTION_READY,
  };
};
export const connectionBusy = (data) => {
  return {
    type: types.SERVER_CONNECTION_BUSY,
  };
};
export const connectionLost = (data) => {
  return {
    type: types.SERVER_CONNECTION_DISCONNECTED,
  };
};

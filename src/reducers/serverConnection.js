import * as types from "../../types/actionTypes";
// 0 iddle
// 1 ready
// 2 busy
// 3 disconnected

const setState = () => ({
  communicationStatus: 0,
});

export default (state = setState(), action = {}) => {
  let newstate = { ...state };

  switch (action.type) {
    case types.SERVER_CONNECTION_READY:
      newstate.communicationStatus = 1;
      return newstate;
    case types.SERVER_CONNECTION_BUSY:
      newstate.communicationStatus = 2;
      return newstate;
    case types.SERVER_CONNECTION_DISCONNECTED:
      newstate.communicationStatus = 3;
      return newstate;
      break;
    default:
      return state;
  }
};

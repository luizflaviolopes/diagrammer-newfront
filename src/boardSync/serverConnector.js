import configs from "../config";
import { Auth } from "aws-amplify";
import notifier from "./connectionEventsNotifier";
import * as serverConnectionsActions from "../actions/serverConnectionActions";

//https://javascript.info/websocket

let socket;
let connected = false;
let connecting = false;

const connect = () => {
  if (connecting) return;

  connecting = true;
  getUserToken((userToken) => {
    socket = new WebSocket(
      `${configs.wsDomain}?token=${userToken}&diagram=teste`
    );
    socket.onopen = connectionOpened;
    socket.onerror = connectionError;
    socket.onclose = connectionClosed;
  });
};

const connectionOpened = () => {
  connected = true;
  notifier(serverConnectionsActions.connectionReady());
};

const connectionError = () => {
  alert(`[error] ${error.message}`);
};

const connectionClosed = (event) => {
  notifier(serverConnectionsActions.connectionLost());
  if (event.wasClean) {
    alert(
      `[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`
    );
  } else {
    // e.g. server process killed or network down
    // event.code is usually 1006 in this case
    alert("[close] Connection died");
  }
};

const getUserToken = (callback) => {
  Auth.currentSession().then((userData) => {
    callback(userData.getIdToken().getJwtToken());
  });
};

const send = (action) => {
  if (!socket) connect();

  if (connected)
    socket.send(JSON.stringify({ message: "action", action: action }));
  else throw { message: "socket not connected" };
};

export default { send, connect };

import configs from "../config";
import { Auth } from "aws-amplify";
import queue from "./queue";
import notifier from "./connectionEventsNotifier";
import * as serverConnectionsActions from "../actions/serverConnectionActions";

//https://javascript.info/websocket

let socket;

const connectionOpened = () => {
  notifier(serverConnectionsActions.connectionReady());

  setInterval(function () {
    if (socket.bufferedAmount == 0) {
      console.time("sendNext");
      sendNext();
      console.timeEnd("sendNext");
    }
  }, 50);
};

const connectionError = (error) => {
  notifier(serverConnectionsActions.connectionLost());
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

const connect = () => {
  console.time("getUserToken");
  getUserToken((userToken) => {
    socket = new WebSocket(
      `${configs.wsDomain}?token=${userToken}&diagram=teste`
    );
    socket.onopen = connectionOpened;
    socket.onerror = connectionError;
    socket.onclose = connectionClosed;
  });

  console.timeEnd("getUserToken");
};

const getUserToken = (callback) => {
  Auth.currentSession().then((userData) => {
    callback(userData.getIdToken().getJwtToken());
  });
};

const sendNext = () => {
  const nextAction = queue.getNext();
  try {
    socket.send(JSON.stringify({ message: "action", action: nextAction }));
  } catch (exception) {
    return;
  }
  queue.commit(nextAction);
};

const closeConnection = () => {
  setTimeout(() => {
    if (socket.bufferedAmount == 0) socket.close(1000, "Closed");
    else closeConnection();
  }, 100);
};

export default { connect };

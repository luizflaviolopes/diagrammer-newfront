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
  console.time("getUserToken");
  // getUserToken((userToken) => {
  //   console.log("opening Socket");
  //   socket = new WebSocket(
  //     `${configs.wsDomain}?token=${userToken}&diagram=teste`
  //   );
  //   socket.onopen = connectionOpened;
  //   socket.onerror = connectionError;
  //   socket.onclose = connectionClosed;
  // });
  socket = new WebSocket(
    `${
      configs.wsDomain
    }?token=${"eyJraWQiOiIxVUI3UXhCQjJ1ZHVqaVl5Z254Ujl1WEZDQmdYeXJqTmlINFhpVnZzTmQ0PSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIxMmMxYzk1My1jMzIxLTQ4NjYtYjhkZS1lZjAxYjgzZTcxNGQiLCJhdWQiOiJoZHR2Nm84NHBjbDF1ZmhsNjhhNW81dGRwIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNTkyMDY1NTA0LCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuY2EtY2VudHJhbC0xLmFtYXpvbmF3cy5jb21cL2NhLWNlbnRyYWwtMV9YZ284MUQzYngiLCJuYW1lIjoiTFVJWiBGTEFWSU8gUk9EUklHVUVTIExPUEVTIiwiY29nbml0bzp1c2VybmFtZSI6IjEyYzFjOTUzLWMzMjEtNDg2Ni1iOGRlLWVmMDFiODNlNzE0ZCIsImV4cCI6MTU5MzAzODM3OCwiaWF0IjoxNTkzMDM0Nzc4LCJlbWFpbCI6Imx1aXpmbGF2aW9sb3Blc0BnbWFpbC5jb20ifQ.XRWDIgWYVl0PjdJxbHTBVPXhJu9IYEY55B7OVULdLMI02tRQZ4oMnnIjzQAK57USMmt49Yal9KTSmezr5X2TKtNjCGwG8tduCfHuIXsUz0ZsLXJABl0hd5Sp7FtiEVvdlR4GhTFdUAZsjQWkj1jvk7om8OGw0b3L7-RA-T6t7tIbMPOdvV4AMT1-97r98cAwgagAj6IN6zpAP-Gc5S7epRqU9zwVVTLeI38jGBlcJoCOAB_MRKNkaseZycL6GdjJiEdoRK9mEAc6QsbHPJBnVg-444lnAYRMcSERJW7pEtUR6gtWVEpa-oM9zCNtD5Ht11kcufLNWkME37mMoqrUJA"}&diagram=teste`
  );
  socket.onopen = connectionOpened;
  socket.onerror = connectionError;
  socket.onclose = connectionClosed;

  console.timeEnd("getUserToken");
};

const connectionOpened = () => {
  console.log("conectado");
  connected = true;
  notifier(serverConnectionsActions.connectionReady());
};

const connectionError = (error) => {
  //alert(`[error] ${error.message}`);
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
    // alert("[close] Connection died");
  }
};

const getUserToken = (callback) => {
  Auth.currentSession().then((userData) => {
    callback(userData.getIdToken().getJwtToken());
  });
};

const send = (action) => {
  if (!socket) connect();

  if (connected) {
    socket.send(JSON.stringify({ message: "action", action: action }));
  } else throw { message: "socket not connected" };
};

export default { send, connect };

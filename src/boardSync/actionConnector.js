import socketIOClient from "socket.io-client";
import configs from "../config";
import { Auth } from "aws-amplify";

//https://javascript.info/websocket

let socket;
let ready = false;

const connect = () => {
  getUserToken((userToken) => {
    socket = new WebSocket(
      `${configs.wsDomain}?token=${userToken}&diagram=teste`
    );
    socket.onopen = () => {
      ready = true;
    };
  });
};

const getUserToken = (callback) => {
  Auth.currentSession().then((userData) => {
    callback(userData.getIdToken().getJwtToken());
  });
};

const send = (action) => {
  if (!socket) connect();
  socket.send(JSON.stringify({ message: "action", action: action }));
};

export default { send, connect };

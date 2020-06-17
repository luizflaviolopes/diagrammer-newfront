import socketIOClient from "socket.io-client";
import configs from "../config";

let socket;

const connect = () => {
  socket = new WebSocket(configs.wsDomain);
};

const send = (action) => {
  if (!socket) connect();
  socket.send(JSON.stringify(action));
};

export default { send, connect };

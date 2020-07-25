import queue from "./queue";
import serverConnector from "./serverConnector";

const newAction = (action) => {
  // queue.add(action);
  // serverConnector.startSending();
};

const startConnection = () => {
  //serverConnector.connect();
};

const stopConnection = () => {
  serverConnector.connect();
};

export default { newAction, startConnection, stopConnection };

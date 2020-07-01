import queue from "./queue";
import serverConnector from "./serverConnector";

const newAction = (action) => {
  queue.add(action);
};

const startConnection = () => {
  serverConnector.connect();
};

const stopConnection = () => {
  serverConnector.connect();
};

export default { newAction, startConnection, stopConnection };

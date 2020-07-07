import queue from "./components/queue";
import serverConnector from "./connectors/socketServerConnector";

const newAction = (action) => {
  queue.add(action);
  serverConnector.startSending();
};

const startConnection = () => {
  serverConnector.connect();
};

const stopConnection = () => {
  serverConnector.closeConnection();
};

const getBoardLastState = (boardId) => {};

export default { newAction, startConnection, stopConnection };

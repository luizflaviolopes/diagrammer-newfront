import queue from "./components/queue";
import serverConnector from "./connectors/socketServerConnector";
import api from "./connectors/restServerConnector";

const newAction = (action) => {
  queue.add(action);
  serverConnector.startSending();
};

const stopConnection = () => {
  serverConnector.closeConnection();
};

const getBoardLastState = async (boardId) => {
  return await api.get("diagram?i=" + boardId);
};

const startBoard = async (boardId) => {
  serverConnector.connect(boardId);
  const boardState = await getBoardLastState(boardId);
};

export default { newAction, startBoard, stopConnection };

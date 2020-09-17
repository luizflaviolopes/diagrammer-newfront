import queue from "./components/queue";
import serverConnector from "./connectors/socketServerConnector";
import api from "./connectors/restServerConnector";

export const sendPackage = (packageToSend) => {
  queue.add(packageToSend);
  serverConnector.send();
  console.log(packageToSend);
};

export const getBoardState = async (boardId) => {
  serverConnector.connect(boardId);
  return await api.get("diagram?i=" + boardId);
};

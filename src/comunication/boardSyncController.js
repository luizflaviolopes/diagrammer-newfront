// import queue from "./components/queue";
// import serverConnector from "./connectors/socketServerConnector";
// import api from "./connectors/restServerConnector";
import boardStartReBuild from "./components/boardStartReBuild";
import {
  addAction as addToPackage,
  flushPackage,
} from "./components/actionsPackageManager";
import { sendPackage, getBoardState } from "./serverController";

const addAction = (action) => {
  addToPackage(action);
};

const sendActions = (action) => {
  addToPackage(action);
  const packageToSend = flushPackage();
  sendPackage(packageToSend);
};

const startBoard = async (boardId) => {
  const boardState = await getBoardState(boardId);
  boardStartReBuild(boardState);
};

export default { startBoard, addAction, sendActions };

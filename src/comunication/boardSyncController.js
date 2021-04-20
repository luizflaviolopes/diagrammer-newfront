// import queue from "./components/queue";
// import serverConnector from "./connectors/socketServerConnector";
// import api from "./connectors/restServerConnector";
import boardStartReBuild from "./components/boardStartReBuild";
import { sendPackage, getBoardState } from "./serverController";

const sendAction = (action) => {
  //console.log(action);
};

const startBoard = async (boardId) => {};

export default { startBoard, sendAction };
